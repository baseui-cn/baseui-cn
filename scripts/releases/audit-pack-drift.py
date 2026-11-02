#!/usr/bin/env python3
"""Compare npm/pnpm packs and reconstruct the Linux gzip header without repacking."""
import argparse
import gzip
import hashlib
import io
import json
from pathlib import Path
import tarfile


def sha(data, algorithm='sha256'):
    return hashlib.new(algorithm, data).hexdigest()


def inspect(data):
    with tarfile.open(fileobj=io.BytesIO(data), mode='r:gz') as tar:
        return [(m, tar.extractfile(m).read()) for m in tar]


def summary(data):
    return {'bytes': len(data), 'sha256': sha(data), 'sha1': sha(data, 'sha1'),
            'gzipHeaderHex': data[:10].hex(), 'tarSha256': sha(gzip.decompress(data))}


def compare(left, right):
    a, b = inspect(left), inspect(right)
    ad = {m.name: (m, content) for m, content in a}
    bd = {m.name: (m, content) for m, content in b}
    keys = ('mode', 'mtime', 'uid', 'gid', 'uname', 'gname', 'type', 'pax_headers')
    rows = []
    for name in sorted(set(ad) | set(bd)):
        x, y = ad[name], bd[name]
        headers = []
        ta, tb = gzip.decompress(left), gzip.decompress(right)
        if ta[x[0].offset:x[0].offset + 512] != tb[y[0].offset:y[0].offset + 512]:
            headers.append('raw 512-byte header differs')
        rows.append({'name': name, 'contentEqual': x[1] == y[1],
                     'approvedSha256': sha(x[1]), 'comparedSha256': sha(y[1]),
                     'approvedBytes': len(x[1]), 'comparedBytes': len(y[1]),
                     'semanticMetadataDifferences': [key for key in keys if getattr(x[0], key) != getattr(y[0], key)],
                     'rawHeaderDifferences': headers})
    return {'memberOrderEqual': [m.name for m, _ in a] == [m.name for m, _ in b],
            'memberNamesEqual': set(ad) == set(bd), 'members': rows}


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--approved', type=Path, required=True)
    p.add_argument('--npm-pack', type=Path, required=True)
    p.add_argument('--pnpm-pack', type=Path, required=True)
    p.add_argument('--ci-sha1', required=True)
    args = p.parse_args()
    approved, npm, pnpm = [f.read_bytes() for f in (args.approved, args.npm_pack, args.pnpm_pack)]
    # zlib records the operating system in byte 9. CRC covers the payload only.
    # No member, tar header, or compressed payload is edited by this reconstruction.
    linux = bytearray(pnpm)
    linux[9] = 3
    exact = sha(linux, 'sha1') == args.ci_sha1
    if not exact:
        raise ValueError('CI SHA-1 reconstruction failed')
    approved_members = {m.name: content for m, content in inspect(approved)}
    pnpm_members = {m.name: content for m, content in inspect(pnpm)}
    result = {'packageJsonSemanticEqual': json.loads(approved_members['package/package.json']) == json.loads(pnpm_members['package/package.json']),
              'schema': 1, 'classification': ['B: package.json member bytes', 'F: npm vs pnpm packer'],
              'approved': summary(approved), 'localNpmPack': summary(npm), 'localPnpmPack': summary(pnpm),
              'reconstructedLinuxPnpmPack': summary(linux), 'ciLoggedSha1': args.ci_sha1,
              'ciSha1Reproduced': exact, 'approvedEqualsLocalNpmPack': approved == npm,
              'npmComparison': compare(approved, npm), 'pnpmComparison': compare(approved, pnpm)}
    print(json.dumps(result, indent=2) + '\n')


if __name__ == '__main__':
    main()
