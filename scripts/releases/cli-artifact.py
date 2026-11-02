#!/usr/bin/env python3
"""Prepare/verify an immutable CLI artifact. Never publishes or extracts tar files."""
import argparse
import hashlib
import io
import json
import os
from pathlib import Path
import re
import subprocess
import tarfile
import urllib.request

VERSION = r'(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)'
SHA = r'[0-9a-f]{64}'
COMMIT = r'[0-9a-f]{40}'
REPOSITORY = 'baseui-cn/baseui-cn'


def require(condition, message):
    if not condition:
        raise ValueError(message)


def digest(data):
    return hashlib.sha256(data).hexdigest()


def encode(value):
    return (json.dumps(value, indent=2, sort_keys=True) + '\n').encode()


def git(root, *args):
    return subprocess.check_output(['git', '-C', str(root), *args], text=True).strip()


def identity(version, commit):
    require(re.fullmatch(VERSION, version), 'invalid stable release version')
    require(re.fullmatch(COMMIT, commit), 'expected a full source commit')


def members(data):
    result = {}
    with tarfile.open(fileobj=io.BytesIO(data), mode='r:gz') as archive:
        for member in archive:
            require(member.isfile() and member.name.startswith('package/'), 'non-file tar member')
            name = member.name.removeprefix('package/')
            require(name and all(p not in ('', '.', '..') for p in name.split('/')), 'unsafe tar path')
            require(name not in result, 'duplicate tar member')
            result[name] = (archive.extractfile(member).read(), member.mode)
    return result


def inspect(root, data, version):
    files = members(data)
    cli = root / 'packages/cli'
    pkg = json.loads((cli / 'package.json').read_bytes())
    require(pkg['name'] == 'baseui-cn' and pkg['version'] == version, 'source package version/name mismatch')
    require(pkg['repository']['url'] == f'git+https://github.com/{REPOSITORY}.git', 'repository metadata mismatch')
    require(pkg['license'] == 'MIT' and pkg['bin'] == {'baseui-cn': 'dist/index.js'}, 'package metadata mismatch')
    require(not pkg.get('private') and not pkg.get('publishConfig'), 'unexpected publishing policy override')
    for section in ('dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'):
        for spec in pkg.get(section, {}).values():
            require(not re.search(r'workspace:|file:|link:|^\.?\.?/|^/|^~/', spec), 'local/workspace dependency')
    registry = sorted((cli / 'registry').glob('*.json'))
    expected = {'LICENSE', 'README.md', 'package.json', 'dist/index.js', 'dist/index.d.ts'}
    expected.update('registry/' + p.name for p in registry)
    require(set(files) == expected, 'unexpected package file inventory')
    require(files['package.json'][0] == (cli / 'package.json').read_bytes(), 'packed package metadata changed')
    for name in ('README.md', 'LICENSE'):
        require(files[name][0] == (cli / name).read_bytes(), f'{name} differs from source')
    require(files['dist/index.js'][0].startswith(b'#!/usr/bin/env node'), 'missing CLI shebang')
    require(files['dist/index.d.ts'][0], 'missing declarations')
    base_ui = json.loads((root / 'apps/www/package.json').read_bytes())['dependencies']['@base-ui/react']
    cli_versions = re.findall(r'\.version\(\s*"([^"]+)"\s*\)', (cli / 'src/index.ts').read_text())
    require(cli_versions == [version], 'CLI source version mismatch')
    site = (root / 'apps/www/lib/site-config.ts').read_text()
    require(re.findall(r'\bversion:\s*"([^"]+)"', site) == [version], 'site release version mismatch')
    require(re.findall(r'\bbaseUIVersion:\s*"([^"]+)"', site) == [base_ui], 'site Base UI version mismatch')
    package_index = json.loads((root / 'packages/registry/index.json').read_bytes())
    require(package_index['version'] == version and package_index['baseUIVersion'] == base_ui, 'registry package metadata mismatch')
    for directory in ('packages/registry/registry', 'apps/www/public/registry'):
        require({p.name for p in (root / directory).glob('*.json')} == {p.name for p in registry}, 'source registry inventories differ')
    manifest = {}
    for file in registry:
        data = file.read_bytes()
        entry = json.loads(data)
        require(entry['version'] == version, f'{file.name}: registry version mismatch')
        if file.name != 'index.json':
            require(entry['baseUIVersion'] == base_ui, f'{file.name}: Base UI mismatch')
        for directory in ('packages/registry/registry', 'apps/www/public/registry'):
            require((root / directory / file.name).read_bytes() == data, 'source registry copies differ')
        require(files['registry/' + file.name][0] == data, 'artifact registry differs from source')
        manifest[file.name] = digest(data)
    index = json.loads((cli / 'registry/index.json').read_bytes())
    require(package_index['components'] == index['components'], 'registry package index differs')
    require({c['name'] + '.json' for c in index['components']} == set(manifest) - {'index.json'}, 'registry index inventory mismatch')
    inventory = {}
    for name, (content, mode) in sorted(files.items()):
        require(mode == (0o755 if name == 'dist/index.js' else 0o644), f'{name}: unexpected file mode')
        inventory[name] = {'sha256': digest(content), 'bytes': len(content), 'mode': mode}
    return manifest, inventory


def create_manifest(root, artifact, version, commit, toolchain):
    identity(version, commit)
    data = artifact.read_bytes()
    registry, inventory = inspect(root, data, version)
    return {'schema': 1, 'repository': REPOSITORY, 'version': version, 'sourceCommit': commit,
            'sha256': digest(data), 'registry': registry, 'members': inventory, 'toolchain': toolchain}


def approval(manifest_data, run_id, artifact_id):
    manifest = json.loads(manifest_data)
    return {'schema': 1, 'version': manifest['version'], 'sourceCommit': manifest['sourceCommit'],
            'runId': run_id, 'artifactId': artifact_id, 'sha256': manifest['sha256'],
            'manifestSha256': digest(manifest_data), 'registrySha256': digest(encode(manifest['registry']))}


def validate_approval(value, tag, commit):
    identity(value['version'], value['sourceCommit'])
    require(value['schema'] == 1, 'unsupported approval schema')
    require(tag == 'cli-v' + value['version'], 'tag/version mismatch')
    require(value['sourceCommit'] == commit, 'wrong source commit')
    for key in ('sha256', 'manifestSha256', 'registrySha256'):
        require(re.fullmatch(SHA, value[key]), f'invalid {key}')
    for key in ('runId', 'artifactId'):
        require(type(value[key]) is int and value[key] > 0, f'invalid {key}')


def verify(root, artifact, manifest_data, approved, tag, commit):
    validate_approval(approved, tag, commit)
    require(digest(manifest_data) == approved['manifestSha256'], 'wrong approved manifest SHA')
    manifest = json.loads(manifest_data)
    data = artifact.read_bytes()
    require(digest(data) == approved['sha256'] == manifest['sha256'], 'wrong approved artifact SHA')
    require(manifest['schema'] == 1 and manifest['repository'] == REPOSITORY, 'wrong manifest identity')
    require(manifest['sourceCommit'] == commit, 'wrong artifact source commit')
    require(manifest['version'] == approved['version'], 'wrong artifact version')
    require(digest(encode(manifest['registry'])) == approved['registrySha256'], 'wrong approved registry manifest')
    actual = create_manifest(root, artifact, approved['version'], commit, manifest['toolchain'])
    require(actual == manifest, 'package members or registry manifest differ')


def check_unpublished(version, fetch):
    # An arbitrary E404 is not proof of absence: require the public package's full
    # metadata with a valid versions map. Network/auth/server errors fail closed.
    metadata = fetch('https://registry.npmjs.org/baseui-cn')
    require(metadata.get('name') == 'baseui-cn' and isinstance(metadata.get('versions'), dict), 'invalid npm metadata')
    require(version not in metadata['versions'], 'npm version already published')


def fetch_json(url, token=None):
    headers = {'Accept': 'application/json', 'User-Agent': 'baseui-cn-release-gate'}
    if token:
        headers['Authorization'] = 'Bearer ' + token
    with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=30) as response:
        require(response.status == 200, 'metadata request failed')
        return json.load(response)


def check_run(approved, run, artifact):
    require(run['id'] == approved['runId'] and run['head_sha'] == approved['sourceCommit'], 'wrong preparation run commit/id')
    require(run['event'] == 'workflow_dispatch' and run['path'] == '.github/workflows/prepare-cli.yml', 'wrong preparation workflow')
    require(run['repository']['full_name'] == REPOSITORY, 'wrong preparation repository')
    require(run['status'] == 'completed' and run['conclusion'] == 'success', 'preparation did not succeed')
    require(artifact['id'] == approved['artifactId'] and not artifact['expired'], 'missing/expired artifact')
    require(artifact['name'] == f"cli-{approved['version']}-{approved['sourceCommit']}", 'wrong artifact name')
    require(artifact['workflow_run']['id'] == approved['runId'] and artifact['workflow_run']['head_sha'] == approved['sourceCommit'], 'artifact/run mismatch')


def tag_approval(root, tag, commit):
    require(re.fullmatch('cli-v' + VERSION, tag), 'invalid release tag')
    require(git(root, 'cat-file', '-t', 'refs/tags/' + tag) == 'tag', 'release requires an annotated approval tag')
    raw = git(root, 'cat-file', 'tag', 'refs/tags/' + tag)
    header, separator, annotation = raw.partition('\n\n')
    require(separator, 'missing tag annotation separator')
    fields = {}
    for line in header.split('\n'):
        name, separator, value = line.partition(' ')
        require(separator and name and name not in fields, 'malformed or duplicate tag header')
        fields[name] = value
    target = fields.get('object', '')
    require(re.fullmatch(COMMIT, target), 'invalid immediate tag target SHA')
    require(fields.get('type') == 'commit', 'approval tag must directly target a commit')
    require(fields.get('tag') == tag, 'wrong internal tag name')
    require(target == commit, 'tag points to wrong source commit')
    require(git(root, 'cat-file', '-t', target) == 'commit', 'tag target object is not a commit')
    value = json.loads(annotation)
    validate_approval(value, tag, commit)
    return value


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['prepare', 'approval', 'resolve', 'verify'])
    parser.add_argument('--root', type=Path, default=Path.cwd())
    parser.add_argument('--directory', type=Path, required=True)
    parser.add_argument('--version')
    parser.add_argument('--commit')
    parser.add_argument('--tag')
    parser.add_argument('--run-id', type=int)
    parser.add_argument('--artifact-id', type=int)
    parser.add_argument('--check-npm', action='store_true')
    parser.add_argument('--check-remote-tag', action='store_true')
    args = parser.parse_args()
    directory = args.directory.resolve()
    root = args.root.resolve()
    if args.command == 'prepare':
        require(git(root, 'rev-parse', 'HEAD') == args.commit, 'checkout differs from source commit')
        # Both tracked and untracked package inputs must be reviewed before preparation.
        require(not git(root, 'status', '--porcelain', '--untracked-files=normal'), 'dirty preparation checkout')
        tools = {name: subprocess.check_output([name, '--version'], text=True).strip() for name in ('node', 'npm', 'pnpm')}
        result = create_manifest(root, directory / 'package.tgz', args.version, args.commit, tools)
        (directory / 'release-manifest.json').write_bytes(encode(result))
        print(encode({'sha256': result['sha256'], 'registrySha256': digest(encode(result['registry']))}).decode())
    elif args.command == 'approval':
        result = approval((directory / 'release-manifest.json').read_bytes(), args.run_id, args.artifact_id)
        validate_approval(result, 'cli-v' + result['version'], result['sourceCommit'])
        print(encode(result).decode())
    else:
        commit = git(root, 'rev-parse', 'HEAD')
        require(commit == args.commit, 'checkout differs from expected source commit')
        approved = tag_approval(root, args.tag, commit)
        if args.command == 'resolve':
            token = os.environ['GH_TOKEN']
            api = f'https://api.github.com/repos/{REPOSITORY}/actions'
            check_run(approved, fetch_json(f"{api}/runs/{approved['runId']}", token),
                      fetch_json(f"{api}/artifacts/{approved['artifactId']}", token))
            with open(os.environ['GITHUB_OUTPUT'], 'a') as output:
                output.write(f"run_id={approved['runId']}\nartifact_id={approved['artifactId']}\n")
        else:
            verify(root, directory / 'package.tgz', (directory / 'release-manifest.json').read_bytes(), approved, args.tag, commit)
            if args.check_remote_tag:
                remote = git(root, 'ls-remote', '--exit-code', f'https://github.com/{REPOSITORY}.git', 'refs/tags/' + args.tag)
                require(remote.split()[0] == git(root, 'rev-parse', 'refs/tags/' + args.tag), 'remote approval tag moved')
            if args.check_npm:
                check_unpublished(approved['version'], fetch_json)
            print('PASS: exact approved artifact, source, version, registry and inventory')


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        # Do not dump subprocess environments, HTTP headers or response bodies.
        raise SystemExit(f'Release gate failed: {type(error).__name__}: {error}')
