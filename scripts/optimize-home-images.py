"""Makes web-sized copies of the home page photos.

Sources (kept untouched):  img/life/*.webp   and   img/image-dish-*.webp
Output:                    img/web/life/*.webp  and  img/web/dish/*.webp

The originals are 2000-2700 px, but the home page shows them at 300-700 px. Decoding the originals needs hundreds of
MB of memory (a 2160x2700 photo is 23 MB once decoded), which makes scrolling stutter, above all on phones. The
home page points at the web copies (content/homeContent.js for Life, content/kitchen-menu.csv for dishes).

Needs Pillow:  pip install Pillow
Run:           python scripts/optimize-home-images.py
"""
import glob
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAX_SIDE = {'life': 1100, 'dish': 900}  # long side in px (about 2x the largest size a photo is shown at)
QUALITY = 80

JOBS = [
    ('life', os.path.join(ROOT, 'img', 'life', '*.webp'), os.path.join(ROOT, 'img', 'web', 'life')),
    ('dish', os.path.join(ROOT, 'img', 'image-dish-*.webp'), os.path.join(ROOT, 'img', 'web', 'dish')),
]

before = after = 0
for kind, pattern, out_dir in JOBS:
    os.makedirs(out_dir, exist_ok=True)
    for source in sorted(glob.glob(pattern)):
        target = os.path.join(out_dir, os.path.basename(source))
        with Image.open(source) as image:
            image.load()
            scale = MAX_SIDE[kind] / max(image.size)
            if scale < 1:
                image = image.resize((round(image.width * scale), round(image.height * scale)), Image.LANCZOS)
            image.save(target, 'WEBP', quality=QUALITY, method=6)
        before += os.path.getsize(source)
        after += os.path.getsize(target)
print(f'{before / 1e6:.1f} MB -> {after / 1e6:.1f} MB')
