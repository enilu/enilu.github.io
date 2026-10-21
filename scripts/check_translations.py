"""Check bilingual pairs and identify translations behind their Chinese source."""
import argparse
import hashlib
import re
from pathlib import Path
import yaml

ROOT = Path(__file__).resolve().parents[1]


def read(path):
    match = re.match(r'\A---\s*\n(.*?)\n---\s*\n(.*)', path.read_text(encoding='utf-8-sig'), re.S)
    if not match:
        raise ValueError(f'Missing front matter: {path.name}')
    return yaml.safe_load(match[1]) or {}, match[2]


def source_hash(path):
    meta, body = read(path)
    title = str(meta.get('title') or re.sub(r'^\d{4}-\d{2}-\d{2}-', '', path.stem))
    return hashlib.sha256((title + '\n' + body.strip()).encode('utf-8')).hexdigest()


def check(root, reviewed=None):
    sources, translations, errors = {}, {}, []
    for directory, mapping in (('_posts', sources), ('_english', translations)):
        for path in (root / directory).rglob('*.md'):
            meta, _ = read(path)
            key = meta.get('translation_key')
            if not key:
                if directory == '_english':
                    errors.append(f'Missing translation_key: {path.name}')
                continue
            if key in mapping:
                errors.append(f'Duplicate translation_key in {directory}: {key}')
            mapping[key] = path
    for key, english in translations.items():
        if key not in sources:
            errors.append(f'Missing Chinese source: {key}')
            continue
        meta, _ = read(english)
        if meta.get('lang') != 'en' or not str(meta.get('permalink', '')).startswith('/en/'):
            errors.append(f'Invalid English language or permalink: {english.name}')
        digest = source_hash(sources[key])
        if reviewed and english.resolve() == reviewed.resolve():
            text = english.read_text(encoding='utf-8')
            if re.search(r'^source_sha256:', text, re.M):
                text = re.sub(r'^source_sha256:.*$', 'source_sha256: ' + digest, text, count=1, flags=re.M)
            else:
                text = text.replace('---\n', '---\nsource_sha256: ' + digest + '\n', 1)
            english.write_text(text, encoding='utf-8')
        elif meta.get('source_sha256') != digest:
            errors.append(f'Translation needs review: {english.name}')
    if reviewed and reviewed.resolve() not in [p.resolve() for p in translations.values()]:
        errors.append('Reviewed file is not a registered English translation')
    return errors, len(translations)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--mark-reviewed', type=Path)
    args = parser.parse_args()
    errors, count = check(ROOT, args.mark_reviewed)
    for error in errors:
        print(error)
    print(f'Checked {count} translation pairs; {len(errors)} issues.')
    raise SystemExit(bool(errors))
