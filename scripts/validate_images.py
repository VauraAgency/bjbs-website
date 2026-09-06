#!/usr/bin/env python3
"""Fail the build if any committed image is corrupt or unreferenced-broken.

Why this exists: hero images were once committed after their bytes had been
round-tripped through a UTF-8 text decode. Every byte that wasn't valid UTF-8
became U+FFFD ('\xef\xbf\xbd'), which inflates the file 2-3x and makes it
undecodable — the site rendered blank boxes and nothing failed loudly.

Checks, for every image under data/images/ and images/:
  1. it decodes as a real image
  2. it does not contain the U+FFFD run that signals the text-mangling bug
  3. it is not implausibly large for a web asset
Plus: every `image` path referenced in the data/*.json feeds exists on disk.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMAGE_DIRS = [ROOT / "data" / "images", ROOT / "images"]
FEEDS = [ROOT / "data" / "articles.json", ROOT / "data" / "daily-reads.json"]
EXTS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"}
MAX_BYTES = 6 * 1024 * 1024          # a web hero image has no business being bigger
MOJIBAKE = b"\xef\xbf\xbd" * 3       # three consecutive U+FFFD = text-mangled binary

errors: list[str] = []


def check_file(path: Path) -> None:
    rel = path.relative_to(ROOT)
    data = path.read_bytes()

    if MOJIBAKE in data[:4096]:
        errors.append(
            f"{rel}: contains repeated U+FFFD replacement characters — the binary was "
            f"decoded as UTF-8 text somewhere in the pipeline. Upload raw bytes "
            f"(or base64 via the GitHub contents API), never a decoded string."
        )
        return

    if len(data) > MAX_BYTES:
        errors.append(f"{rel}: {len(data)/1e6:.1f}MB exceeds the {MAX_BYTES/1e6:.0f}MB web-asset budget")

    try:
        from PIL import Image  # noqa: PLC0415
        with Image.open(path) as im:
            im.verify()
    except ImportError:
        # No Pillow available — fall back to magic-number sniffing.
        magic = (data[:3] == b"\xff\xd8\xff" or data[:8] == b"\x89PNG\r\n\x1a\n"
                 or data[:6] in (b"GIF87a", b"GIF89a") or data[8:12] == b"WEBP")
        if not magic:
            errors.append(f"{rel}: does not start with a valid image signature")
    except Exception as exc:
        errors.append(f"{rel}: not a decodable image ({type(exc).__name__}: {exc})")


def main() -> int:
    checked = 0
    for base in IMAGE_DIRS:
        if not base.exists():
            continue
        for path in sorted(base.rglob("*")):
            if path.is_file() and path.suffix.lower() in EXTS:
                check_file(path)
                checked += 1

    for feed in FEEDS:
        if not feed.exists():
            continue
        for item in json.loads(feed.read_text()):
            ref = item.get("image")
            if ref and not (ROOT / ref).exists():
                errors.append(f"{feed.name}: '{item.get('title', '?')}' references missing image {ref}")

    if errors:
        print(f"Image validation FAILED ({len(errors)} problem(s)):\n", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        return 1

    print(f"Image validation passed — {checked} image(s) OK, all feed references resolve.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
