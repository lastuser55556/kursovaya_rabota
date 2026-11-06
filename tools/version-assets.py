from pathlib import Path
import re,hashlib
for p in Path('.').glob('*.html'):
 def replace(m):
  asset=m.group(2);return m.group(1)+asset+'?v='+hashlib.sha256(Path(asset).read_bytes()).hexdigest()[:10]+m.group(3)
 p.write_text(re.sub(r'((?:src|href)=")((?:js|css)/[^"?]+)(?:\?[^\"]*)?(\")',replace,p.read_text()))
