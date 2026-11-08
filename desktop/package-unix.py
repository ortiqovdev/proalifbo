"""Pack the official Electron ZIP without losing Unix permissions or macOS symlinks."""
import copy
import hashlib
import json
import plistlib
import shutil
import sys
import zipfile
from pathlib import Path

root = Path(__file__).resolve().parent
target, archive, output = sys.argv[1:]
archive, output = Path(archive), Path(output)
version = json.loads((root/'node_modules/electron/package.json').read_text())['version']
checks = json.loads((root/'node_modules/electron/checksums.json').read_text())
with archive.open('rb') as source:
    actual = hashlib.file_digest(source, 'sha256').hexdigest()
if actual != checks[f'electron-v{version}-{target}.zip']:
    raise ValueError('Electron archive checksum mismatch')
mac = target.startswith('darwin-')
base = 'Pro Alifbo.app/Contents/Resources/app/' if mac else 'ProAlifbo/resources/app/'
def add(out, name, data, mode=0o644):
    entry = zipfile.ZipInfo(name)
    entry.create_system = 3
    entry.external_attr = (0o100000 | mode) << 16
    out.writestr(entry, data, compress_type=zipfile.ZIP_DEFLATED)
stage = output.with_suffix('.partial')
with zipfile.ZipFile(archive) as source, zipfile.ZipFile(stage, 'w') as out:
    for item in source.infolist():
        name = item.filename
        if name.endswith('/default_app.asar'):
            continue
        entry = copy.copy(item)
        if mac:
            entry.filename = name.replace('Electron.app/', 'Pro Alifbo.app/', 1)
        else:
            entry.filename = 'ProAlifbo/' + ('pro-alifbo' if name == 'electron' else name)
        if mac and name == 'Electron.app/Contents/Info.plist':
            plist = plistlib.loads(source.read(item))
            plist.update(CFBundleName='Pro Alifbo', CFBundleDisplayName='Pro Alifbo', CFBundleIdentifier='uz.proalifbo.desktop')
            out.writestr(entry, plistlib.dumps(plist))
        else:
            with source.open(item) as src, out.open(entry,'w') as dst:
                shutil.copyfileobj(src,dst,1024*1024)
    files = 'main.cjs preload.cjs renderer.js office.js files.cjs unix-auto.cjs expand.pl popup.html popup.js index.html style.css package.json'.split()
    assets = {name:root/name for name in files}
    assets.update({'logo.png':root.parent/'assets/brand/pro-alifbo-mark-transparent.png',
                   'fflate.js':root/'node_modules/fflate/umd/index.js',
                   'pro-alifbo-chrome-v0.1.3.zip':root.parent/'pro-alifbo-chrome-v0.1.3.zip'})
    for name in ['new-alphabet.js','transliterate.js']:
        assets['lib/'+name]=root.parent/'shared'/name
    for name,file in assets.items():
        add(out,base+name,file.read_bytes())
    if mac:
        add(out,'Pro Alifbo - ishga tushirish.command',b'''#!/bin/sh
set -eu
cd "$(dirname "$0")"
app="$PWD/Pro Alifbo.app"
# Ad-hoc sign the locally packaged development build on its target machine.
if ! /usr/bin/codesign --verify --deep "$app" 2>/dev/null; then
  /usr/bin/codesign --force --sign - "$app"
fi
/usr/bin/open "$app"
''',0o755)
    add(out,'OQING.txt',('ZIP paketni toliq oching. '+('Mac Finder ichida Pro Alifbo - ishga tushirish.command faylini ishga tushiring. Bu lokal imzolanadigan sinov versiyasi.' if mac else 'ProAlifbo/pro-alifbo faylini ishga tushiring.')+'\nAvtoyozuv uchun Espanso va Perl, eski Office fayllari uchun LibreOffice kerak.').encode())
with zipfile.ZipFile(stage) as test:
    if test.testzip() is not None: raise ValueError('Package integrity check failed')
    assert base+'main.cjs' in test.namelist()
stage.replace(output)
print(output)
