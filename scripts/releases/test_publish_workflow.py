"""Guard OIDC-only exact-artifact publication without contacting npm."""
import hashlib
import os
from pathlib import Path
import re
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[2]
WORKFLOW = ROOT / '.github/workflows/publish-cli.yml'
COMMAND = ('npm publish "$RUNNER_TEMP/approved-cli/package.tgz" --access public '
           '--ignore-scripts --registry=https://registry.npmjs.org')


class PublishWorkflowTests(unittest.TestCase):
    def setUp(self):
        self.workflow = WORKFLOW.read_text()
        # Deliberately require the final, unconditional, single-command publish step.
        self.publish = self.workflow.split(
            '      - name: Publish exact approved tarball with trusted publishing\n', 1)[1]

    def test_oidc_is_required_without_token_or_variable_switch(self):
        self.assertIn('      id-token: write\n', self.workflow)
        self.assertNotRegex(self.workflow, r'NPM_TOKEN|NODE_AUTH_TOKEN|NPM_TRUSTED_PUBLISHING_ENABLED|secrets\.')
        self.assertNotRegex(self.publish, r'(?m)^\s*(if|continue-on-error):|^      - ')
        self.assertNotIn('continue-on-error:', self.workflow)
        self.assertEqual(re.findall(r'(?m)^\s*if: (.+)$', self.workflow),
                         ["github.repository == 'baseui-cn/baseui-cn'"])
        self.assertIn('NPM_CONFIG_USERCONFIG: ${{ runner.temp }}/oidc-only.npmrc', self.publish)
        self.assertIn('working-directory: ${{ runner.temp }}/npm-publish', self.publish)

    def test_only_approved_tarball_can_be_published(self):
        self.assertEqual(re.findall(r'(?m)^\s*run: (npm publish .+)$', self.workflow), [COMMAND])
        self.assertEqual(self.publish.split('        run: ', 1)[1].strip(), COMMAND)
        self.assertNotRegex(self.workflow, r'workflow_dispatch|npm pack|pnpm (install|publish)|build:all|--no-git-checks')
        self.assertIn('tags:\n      - "cli-v*"', self.workflow)

    def test_approval_download_and_verification_precede_publication(self):
        gates = [
            'cli-artifact.py resolve',
            'artifact-ids: ${{ steps.approval.outputs.artifact_id }}',
            'run-id: ${{ steps.approval.outputs.run_id }}',
            'node scripts/check-registry-consistency.mjs',
            'cli-artifact.py verify --directory "$RUNNER_TEMP/approved-cli" '
            '--tag "$RELEASE_TAG" --commit "$SOURCE_COMMIT" --check-npm --check-remote-tag',
            COMMAND,
        ]
        positions = [self.workflow.index(gate) for gate in gates]
        self.assertEqual(positions, sorted(positions))
        self.assertIn('persist-credentials: false', self.workflow)
        self.assertIn('cancel-in-progress: false', self.workflow)
        self.assertIn('npm install --global npm@11.16.0 --ignore-scripts', self.workflow)

    def test_oidc_failure_propagates_without_retry_or_artifact_mutation(self):
        command = self.publish.split('        run: ', 1)[1].strip()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'approved-cli').mkdir()
            (root / 'npm-publish').mkdir()
            tarball = root / 'approved-cli/package.tgz'
            tarball.write_bytes(b'reviewed immutable tarball fixture')
            before = hashlib.sha256(tarball.read_bytes()).hexdigest()
            # A fake npm records arguments and fails authentication; no network/publish.
            npm = root / 'npm'
            npm.write_text('#!/bin/sh\nprintf "%s\\n" "$@" >> "$RUNNER_TEMP/calls"\nexit 42\n')
            npm.chmod(0o755)
            env = dict(os.environ, PATH=str(root) + os.pathsep + os.defpath,
                       RUNNER_TEMP=directory, NPM_CONFIG_USERCONFIG=str(root / 'oidc-only.npmrc'))
            for name in ('NPM_TOKEN', 'NODE_AUTH_TOKEN', 'NPM_CONFIG_TOKEN'):
                env.pop(name, None)
            result = subprocess.run(['/bin/bash', '--noprofile', '--norc', '-e', '-o',
                                     'pipefail', '-c', command], cwd=root / 'npm-publish',
                                    env=env, capture_output=True, text=True)
            self.assertEqual(result.returncode, 42)
            self.assertEqual((root / 'calls').read_text().splitlines(),
                             ['publish', str(tarball), '--access', 'public', '--ignore-scripts',
                              '--registry=https://registry.npmjs.org'])
            self.assertEqual(hashlib.sha256(tarball.read_bytes()).hexdigest(), before)
            self.assertFalse((root / 'oidc-only.npmrc').exists())


if __name__ == '__main__':
    unittest.main()
