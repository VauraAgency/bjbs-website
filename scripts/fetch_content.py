#!/usr/bin/env python3
"""Pull latest videos from the YouTube channel RSS feed into data/videos.json.

Runs on a schedule via GitHub Actions — the site loads this JSON at runtime,
so new uploads appear on the site automatically. Extend with podcast/blog RSS
feeds by adding entries to FEEDS.
"""
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

CHANNEL_ID = "UCEFJ-b1wemecS_FoQpSF8bQ"  # youtube.com/@benjaminjbsmith
FEED_URL = f"https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}"
MAX_ITEMS = 12

NS = {
    "atom": "http://www.w3.org/2005/Atom",
    "yt": "http://www.youtube.com/xml/schemas/2015",
    "media": "http://search.yahoo.com/mrss/",
}


def clean_title(title: str) -> str:
    """Strip hashtag spam from short-form titles."""
    cleaned = re.sub(r"#\S+", "", title).strip(" -–—|")
    return cleaned or title


def main() -> None:
    with urllib.request.urlopen(FEED_URL, timeout=30) as resp:
        root = ET.fromstring(resp.read())

    videos = []
    for entry in root.findall("atom:entry", NS)[:MAX_ITEMS]:
        vid = entry.findtext("yt:videoId", "", NS)
        title = entry.findtext("atom:title", "", NS)
        published = entry.findtext("atom:published", "", NS)[:10]
        desc = ""
        media_group = entry.find("media:group", NS)
        if media_group is not None:
            desc = (media_group.findtext("media:description", "", NS) or "").split("\n")[0][:140]
        videos.append({
            "cat": "video",
            "label": "Video",
            "date": published,
            "title": clean_title(title),
            "desc": desc,
            "url": f"https://www.youtube.com/watch?v={vid}",
            "thumb": f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg",
        })

    out = Path(__file__).resolve().parent.parent / "data" / "videos.json"
    out.parent.mkdir(exist_ok=True)
    out.write_text(json.dumps(videos, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote {len(videos)} videos to {out}")


if __name__ == "__main__":
    main()
