"""Release gates using real 1.4.1 input or a supplied source/tarball; never publish."""
import copy
import importlib.util
import io
import json
import os
from pathlib import Path
import subprocess
import tarfile
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('gate', Path(__file__).with_name('cli-artifact.py'))
gate = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gate)


class ReleaseGateTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.fixture = tempfile.TemporaryDirectory()
        cls.root = Path(cls.fixture.name) / 'source'
        cls.artifact = Path(cls.fixture.name) / 'package.tgz'
        if os.environ.get('RELEASE_TEST_SOURCE'):
            cls.root = Path(os.environ['RELEASE_TEST_SOURCE'])
            cls.artifact = Path(os.environ['RELEASE_TEST_ARTIFACT'])
        else:
            pkg = {'name': 'baseui-cn', 'version': '1.4.1', 'license': 'MIT',
                   'repository': {'url': 'git+https://github.com/baseui-cn/baseui-cn.git'},
                   'bin': {'baseui-cn': 'dist/index.js'}, 'dependencies': {'chalk': '4.1.2'}}
            files = {'package.json': gate.encode(pkg), 'LICENSE': b'MIT', 'README.md': b'CLI',
                     'dist/index.js': b'#!/usr/bin/env node\n', 'dist/index.d.ts': b'export {}',
                     'registry/index.json': gate.encode({'version': '1.4.1', 'components': [{'name': 'button'}]}),
                     'registry/button.json': gate.encode({'version': '1.4.1', 'baseUIVersion': '1.9.0'})}
            for name, data in files.items():
                path = cls.root / 'packages/cli' / name
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(data)
                if name.startswith('registry/'):
                    for directory in ('packages/registry', 'apps/www/public'):
                        path = cls.root / directory / name
                        path.parent.mkdir(parents=True, exist_ok=True)
                        path.write_bytes(data)
            (cls.root / 'apps/www/package.json').write_bytes(gate.encode({'dependencies': {'@base-ui/react': '1.9.0'}}))
            (cls.root / 'packages/cli/src').mkdir(parents=True)
            (cls.root / 'packages/cli/src/index.ts').write_text('program.version("1.4.1")')
            (cls.root / 'apps/www/lib').mkdir(parents=True)
            (cls.root / 'apps/www/lib/site-config.ts').write_text('version: "1.4.1", baseUIVersion: "1.9.0"')
            (cls.root / 'packages/registry/index.json').write_bytes(gate.encode({'version': '1.4.1', 'baseUIVersion': '1.9.0', 'components': [{'name': 'button'}]}))
            with tarfile.open(cls.artifact, mode='w:gz') as tar:
                for name, data in files.items():
                    info = tarfile.TarInfo('package/' + name)
                    info.size, info.mode = len(data), 0o755 if name == 'dist/index.js' else 0o644
                    tar.addfile(info, io.BytesIO(data))
        cls.commit = '2842bf1300760c3daf7befb4edb98893549f0eef'
        cls.version = '1.4.1'
        cls.manifest = gate.create_manifest(cls.root, cls.artifact, cls.version, cls.commit, {'node': 'test', 'npm': 'test', 'pnpm': 'test'})
        cls.encoded = gate.encode(cls.manifest)
        cls.approved = gate.approval(cls.encoded, 123, 456)

    @classmethod
    def tearDownClass(cls):
        cls.fixture.cleanup()

    def verify(self, approved=None, manifest=None, artifact=None, tag='cli-v1.4.1', commit=None):
        gate.verify(self.root, artifact or self.artifact, manifest or self.encoded,
                    approved or self.approved, tag, commit or self.commit)

    def test_exact_reviewed_package_passes(self):
        self.verify()

    def test_sha_tamper_rejected(self):
        approved = dict(self.approved, sha256='0' * 64)
        with self.assertRaisesRegex(ValueError, 'artifact SHA'):
            self.verify(approved=approved)

    def test_wrong_tag_version(self):
        with self.assertRaisesRegex(ValueError, 'tag/version'):
            self.verify(tag='cli-v1.4.2')

    def test_wrong_commit(self):
        with self.assertRaisesRegex(ValueError, 'source commit'):
            self.verify(commit='0' * 40)

    def test_missing_artifact(self):
        with self.assertRaises(FileNotFoundError):
            self.verify(artifact=Path('/nonexistent/cli.tgz'))

    def test_manifest_tamper(self):
        with self.assertRaisesRegex(ValueError, 'manifest SHA'):
            self.verify(manifest=self.encoded + b' ')

    def test_registry_approval_tamper(self):
        with self.assertRaisesRegex(ValueError, 'registry manifest'):
            self.verify(approved=dict(self.approved, registrySha256='0' * 64))

    def test_manifest_identity_version_and_contents(self):
        changes = [('version', '1.4.2'), ('sourceCommit', '0' * 40), ('repository', 'other/repo'),
                   ('registry', {}), ('members', {})]
        for key, value in changes:
            with self.subTest(key=key):
                manifest = dict(self.manifest, **{key: value})
                data = gate.encode(manifest)
                approved = dict(self.approved, manifestSha256=gate.digest(data))
                with self.assertRaises(ValueError):
                    self.verify(approved=approved, manifest=data)

    def test_published_version_rejected(self):
        with self.assertRaisesRegex(ValueError, 'already published'):
            gate.check_unpublished('1.4.1', lambda _: {'name': 'baseui-cn', 'versions': {'1.4.1': {}}})

    def test_unpublished_version_passes(self):
        gate.check_unpublished('1.4.2', lambda _: {'name': 'baseui-cn', 'versions': {'1.4.1': {}}})

    def test_registry_failure_closed(self):
        for value in ({}, {'name': 'other', 'versions': {}}, {'name': 'baseui-cn', 'versions': []}):
            with self.subTest(value=value), self.assertRaises(ValueError):
                gate.check_unpublished('1.4.2', lambda _: value)
        with self.assertRaises(OSError):
            gate.check_unpublished('1.4.2', lambda _: (_ for _ in ()).throw(OSError('offline')))

    def test_unsafe_tags(self):
        for value in ('cli-v01.4.1', 'cli-v1.4', 'cli-v1.4.1-beta', 'main', 'cli-v1.4.1;echo bad'):
            with self.subTest(value=value), self.assertRaises(ValueError):
                gate.validate_approval(self.approved, value, self.commit)

    def test_bad_artifact_id(self):
        for value in (0, -1, '456', True):
            with self.subTest(value=value), self.assertRaises(ValueError):
                gate.validate_approval(dict(self.approved, artifactId=value), 'cli-v1.4.1', self.commit)

    def test_package_content_inventory_modes_registry_and_version(self):
        original = gate.members(self.artifact.read_bytes())
        for change in ('registry', 'version', 'extra', 'missing', 'mode', 'dist', 'workspace', 'readme'):
            with self.subTest(change=change):
                files = copy.deepcopy(original)
                if change == 'registry':
                    data, mode = files['registry/button.json']
                    files['registry/button.json'] = (data + b' ', mode)
                elif change == 'version':
                    data, mode = files['package.json']
                    files['package.json'] = (data.replace(b'1.4.1', b'1.4.2'), mode)
                elif change == 'extra':
                    files['secret.txt'] = (b'extra', 0o644)
                elif change == 'missing':
                    del files['LICENSE']
                elif change == 'mode':
                    files['dist/index.js'] = (files['dist/index.js'][0], 0o644)
                elif change == 'dist':
                    files['dist/index.js'] = (b'bad', 0o755)
                elif change == 'workspace':
                    data, mode = files['package.json']
                    files['package.json'] = (data.replace(b'4.1.2', b'workspace:*'), mode)
                else:
                    files['README.md'] = (b'changed', 0o644)
                buffer = io.BytesIO()
                with tarfile.open(fileobj=buffer, mode='w:gz') as tar:
                    for name, (data, mode) in files.items():
                        info = tarfile.TarInfo('package/' + name)
                        info.mode, info.size = mode, len(data)
                        tar.addfile(info, io.BytesIO(data))
                with self.assertRaises(ValueError):
                    gate.inspect(self.root, buffer.getvalue(), self.version)

    def test_source_local_dependencies_rejected(self):
        original = Path.read_bytes
        target = self.root / 'packages/cli/package.json'
        for dependency in ('workspace:*', 'file:../local', 'link:../local', '../local', './local', '/local', '~/local'):
            def altered(path):
                data = original(path)
                return data.replace(b'4.1.2', dependency.encode()) if path == target else data
            with self.subTest(dependency=dependency), patch.object(Path, 'read_bytes', altered), self.assertRaisesRegex(ValueError, 'local/workspace dependency'):
                self.verify()

    def test_source_metadata_inconsistency(self):
        original = Path.read_text
        for file, text in [('packages/cli/src/index.ts', 'program.version("1.4.2")'),
                           ('apps/www/lib/site-config.ts', 'version: "1.4.2", baseUIVersion: "1.9.0"'),
                           ('apps/www/lib/site-config.ts', 'version: "1.4.1", baseUIVersion: "0.0.0"')]:
            target = self.root / file
            def altered(path, *args, **kwargs):
                return text if path == target else original(path, *args, **kwargs)
            with self.subTest(file=file, text=text), patch.object(Path, 'read_text', altered), self.assertRaises(ValueError):
                self.verify()

    def test_archive_path_links_and_duplicates(self):
        for name, kind in [('package/../escape', tarfile.REGTYPE), ('package/a', tarfile.SYMTYPE), ('package/a', 'duplicate')]:
            with self.subTest(kind=kind):
                buffer = io.BytesIO()
                with tarfile.open(fileobj=buffer, mode='w:gz') as tar:
                    for _ in range(2 if kind == 'duplicate' else 1):
                        info = tarfile.TarInfo(name)
                        info.type = tarfile.REGTYPE if kind == 'duplicate' else kind
                        tar.addfile(info, io.BytesIO(b''))
                with self.assertRaises(ValueError):
                    gate.members(buffer.getvalue())

    def test_preparation_run_and_artifact_binding(self):
        run = {'id': 123, 'head_sha': self.commit, 'event': 'workflow_dispatch',
               'path': '.github/workflows/prepare-cli.yml', 'repository': {'full_name': gate.REPOSITORY},
               'status': 'completed', 'conclusion': 'success'}
        artifact = {'id': 456, 'expired': False, 'name': f'cli-{self.version}-{self.commit}',
                    'workflow_run': {'id': 123, 'head_sha': self.commit}}
        gate.check_run(self.approved, run, artifact)
        for field, value in [('head_sha', '0' * 40), ('path', 'evil.yml'), ('conclusion', 'failure'), ('event', 'push')]:
            with self.subTest(field=field), self.assertRaises(ValueError):
                gate.check_run(self.approved, dict(run, **{field: value}), artifact)
        for field, value in [('expired', True), ('id', 789), ('name', 'wrong'), ('workflow_run', {'id': 999, 'head_sha': self.commit})]:
            with self.subTest(field=field), self.assertRaises(ValueError):
                gate.check_run(self.approved, run, dict(artifact, **{field: value}))

    def test_annotated_tag_and_lightweight_tag(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            def git(*args):
                return subprocess.check_output(['git', '-C', str(root), *args], stderr=subprocess.DEVNULL, text=True).strip()
            git('init')
            git('-c', 'user.name=Release test', '-c', 'user.email=test@example.invalid', 'commit', '--allow-empty', '-m', 'fixture')
            commit = git('rev-parse', 'HEAD')
            approved = dict(self.approved, sourceCommit=commit)
            git('-c', 'user.name=Release test', '-c', 'user.email=test@example.invalid', 'tag', '-a', 'cli-v1.4.1', '-m', json.dumps(approved))
            self.assertEqual(gate.tag_approval(root, 'cli-v1.4.1', commit), approved)
            git('tag', 'cli-v1.4.2')
            with self.assertRaisesRegex(ValueError, 'annotated'):
                gate.tag_approval(root, 'cli-v1.4.2', commit)
            with self.assertRaisesRegex(ValueError, 'wrong source'):
                gate.tag_approval(root, 'cli-v1.4.1', '0' * 40)


class TagApprovalTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name) / 'source'
        self.root.mkdir()
        self.git('init')
        self.git('config', 'user.name', 'Release test')
        self.git('config', 'user.email', 'test@example.invalid')
        self.git('commit', '--allow-empty', '-m', 'fixture')
        self.commit = self.git('rev-parse', 'HEAD')
        self.tag = 'cli-v1.4.1'
        self.approved = {'schema': 1, 'version': '1.4.1', 'sourceCommit': self.commit,
                         'runId': 123, 'artifactId': 456, 'sha256': 'a' * 64,
                         'manifestSha256': 'b' * 64, 'registrySha256': 'c' * 64}

    def git(self, *args, input=None):
        return subprocess.run(['git', '-C', str(self.root), *args], input=input,
                              capture_output=True, text=True, check=True).stdout.strip()

    def write_tag(self, target=None, kind='commit', name=None, annotation=None, header=None):
        if header is None:
            header = f'object {target or self.commit}\ntype {kind}\ntag {name or self.tag}'
        message = json.dumps(self.approved) if annotation is None else annotation
        raw = header + '\n\n' + message + '\n'
        # --literally permits deliberately malformed headers for fail-closed tests.
        oid = self.git('hash-object', '--literally', '-t', 'tag', '-w', '--stdin', input=raw)
        # update-ref refuses some malformed objects before our parser can see them.
        ref = self.root / '.git/refs/tags' / self.tag
        ref.parent.mkdir(parents=True, exist_ok=True)
        ref.write_text(oid + '\n')
        return oid

    def test_direct_annotated_tag_passes(self):
        self.git('tag', '-a', self.tag, '-m', json.dumps(self.approved), self.commit)
        self.assertEqual(gate.tag_approval(self.root, self.tag, self.commit), self.approved)

    def test_nested_annotated_tag_rejected(self):
        self.git('tag', '-a', 'intermediary', '-m', 'intermediary', self.commit)
        self.git('tag', '-a', self.tag, '-m', json.dumps(self.approved), 'intermediary')
        # Reproduce the old bug: recursive peeling reaches the approved commit.
        self.assertEqual(self.git('rev-parse', 'refs/tags/' + self.tag + '^{}'), self.commit)
        with self.assertRaisesRegex(ValueError, 'directly target a commit'):
            gate.tag_approval(self.root, self.tag, self.commit)

    def test_tag_object_via_lightweight_intermediary_rejected(self):
        self.git('tag', '-a', 'intermediary', '-m', 'intermediary', self.commit)
        self.git('tag', 'alias', 'intermediary')
        self.write_tag(target=self.git('rev-parse', 'refs/tags/alias'), kind='tag')
        with self.assertRaisesRegex(ValueError, 'directly target a commit'):
            gate.tag_approval(self.root, self.tag, self.commit)

    def test_wrong_commit_rejected(self):
        self.git('commit', '--allow-empty', '-m', 'other')
        self.write_tag(target=self.git('rev-parse', 'HEAD'))
        with self.assertRaisesRegex(ValueError, 'wrong source commit'):
            gate.tag_approval(self.root, self.tag, self.commit)

    def test_lightweight_release_tag_rejected(self):
        self.git('tag', self.tag, self.commit)
        with self.assertRaisesRegex(ValueError, 'annotated'):
            gate.tag_approval(self.root, self.tag, self.commit)

    def test_wrong_internal_tag_name_rejected(self):
        self.write_tag(name='another-tag')
        with self.assertRaisesRegex(ValueError, 'internal tag name'):
            gate.tag_approval(self.root, self.tag, self.commit)

    def test_non_commit_targets_rejected(self):
        objects = [('tree', self.git('rev-parse', 'HEAD^{tree}')),
                   ('blob', self.git('hash-object', '-w', '--stdin', input='blob fixture'))]
        for kind, oid in objects:
            with self.subTest(kind=kind):
                self.write_tag(target=oid, kind=kind)
                with self.assertRaisesRegex(ValueError, 'directly target a commit'):
                    gate.tag_approval(self.root, self.tag, self.commit)
            with self.subTest(kind=kind, forged_commit_header=True):
                self.write_tag(target=oid, kind='commit')
                with self.assertRaisesRegex(ValueError, 'target object is not a commit'):
                    gate.tag_approval(self.root, self.tag, oid)

    def test_malformed_tag_headers_rejected(self):
        header = f'object {self.commit}\ntype commit\ntag {self.tag}'
        invalid = [header.replace('object ' + self.commit + '\n', ''),
                   header.replace('type commit\n', ''), header.replace('\ntag ' + self.tag, ''),
                   header.replace(self.commit, 'invalid-sha'),
                   header + '\nobject ' + self.commit, header + '\ntype commit',
                   header + '\ntag ' + self.tag, header + '\nmalformed']
        for value in invalid:
            with self.subTest(header=value):
                self.write_tag(header=value)
                with self.assertRaises(ValueError):
                    gate.tag_approval(self.root, self.tag, self.commit)

    def test_malformed_annotations_rejected(self):
        valid = json.dumps(self.approved)
        for annotation in ('ordinary prose', '{', '', valid + '\nunrelated prose',
                           valid + '\n-----BEGIN PGP SIGNATURE-----\ninvalid\n-----END PGP SIGNATURE-----'):
            with self.subTest(annotation=annotation):
                self.write_tag(annotation=annotation)
                with self.assertRaises(ValueError):
                    gate.tag_approval(self.root, self.tag, self.commit)

    def test_remote_tag_object_equality(self):
        self.write_tag()
        remote = Path(self.directory.name) / 'remote.git'
        self.git('init', '--bare', str(remote))
        self.git('remote', 'add', 'origin', str(remote))
        self.git('push', 'origin', 'refs/tags/' + self.tag)
        artifact_dir = Path(self.directory.name) / 'artifact'
        artifact_dir.mkdir()
        (artifact_dir / 'release-manifest.json').write_text('{}')
        original_git = gate.git

        def local_git(root, *args):
            # The production URL is redirected only to this temporary bare repo.
            args = tuple(str(remote) if value == f'https://github.com/{gate.REPOSITORY}.git'
                         else value for value in args)
            return original_git(root, *args)

        argv = ['cli-artifact.py', 'verify', '--root', str(self.root), '--directory',
                str(artifact_dir), '--tag', self.tag, '--commit', self.commit, '--check-remote-tag']
        with patch.object(gate, 'git', side_effect=local_git), patch.object(gate, 'verify') as verify, \
                patch('sys.argv', argv), patch('builtins.print'):
            gate.main()
            verify.assert_called_once()
            # Same commit and approval, different tag object: equality must fail.
            self.write_tag(annotation=json.dumps(self.approved, indent=2))
            with self.assertRaisesRegex(ValueError, 'remote approval tag moved'):
                gate.main()


if __name__ == '__main__':
    unittest.main()
