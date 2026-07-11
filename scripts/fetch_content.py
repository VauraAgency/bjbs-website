#!/usr/bin/env python3
"""Pull latest videos from the YouTube channel RSS feed into data/videos.json.

Runs on a schedule via GitHub Actions — the site loads this JSON at runtime,
so new uploads appear on the site automatically. Extend with podcast/blog RSS
feeds by adding entries to FEEDS.
"""
import json
import re
import urllib.error
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


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def is_short(video_id: str) -> bool:
    """youtube.com/shorts/<id> returns 200 for Shorts, redirects for regular videos."""
    opener = urllib.request.build_opener(NoRedirect)
    req = urllib.request.Request(
        f"https://www.youtube.com/shorts/{video_id}", method="HEAD",
        headers={"User-Agent": "Mozilla/5.0"},
    )
    try:
        with opener.open(req, timeout=15) as resp:
            return resp.status == 200
    except urllib.error.HTTPError as e:
        return e.code == 200
    except Exception:
        return True  # channel is mostly shorts; safest default


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
        short = is_short(vid)
        videos.append({
            "cat": "reel" if short else "video",
            "label": "Reel" if short else "Video",
            "date": published,
            "title": clean_title(title),
            "desc": desc,
            "url": f"https://www.youtube.com/watch?v={vid}",
            "thumb": f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg",
        })

    out = Path(__file__).resolve().parent.parent / "data" / "videos.json"
    out.parent.mkdir(exist_ok=True)

    # Merge with existing entries instead of overwriting — the RSS feed only
    # returns the channel's most recent MAX_ITEMS uploads, so a plain
    # overwrite silently deletes older manually-curated videos (e.g. imported
    # back-catalog content) once they age out of that window.
    existing = []
    if out.exists():
        try:
            existing = json.loads(out.read_text())
        except json.JSONDecodeError:
            existing = []

    merged_by_url = {v["url"]: v for v in existing}
    for v in videos:
        merged_by_url[v["url"]] = v  # upsert: refresh title/thumb/date from feed
    merged = sorted(merged_by_url.values(), key=lambda v: v["date"], reverse=True)

    out.write_text(json.dumps(merged, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote {len(merged)} videos to {out} ({len(videos)} from feed, {len(merged) - len(videos)} preserved from history)")


if __name__ == "__main__":
    main()
