import os
import time
from pathlib import Path

UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "/app/uploads"))
MAX_AGE_HOURS = int(os.getenv("MAX_AGE_HOURS", "24"))


def cleanup_uploads():
    now = time.time()
    cutoff = now - MAX_AGE_HOURS * 3600
    deleted = 0
    if not UPLOAD_DIR.exists():
        print(f"[cleanup] upload dir not found: {UPLOAD_DIR}")
        return
    for p in UPLOAD_DIR.rglob("*"):
        if p.is_file() and p.stat().st_mtime < cutoff:
            try:
                p.unlink()
                deleted += 1
            except Exception as e:
                print(f"[cleanup] failed {p}: {e}")
    print(f"[cleanup] removed {deleted} file(s) older than {MAX_AGE_HOURS}h")


if __name__ == "__main__":
    cleanup_uploads()
