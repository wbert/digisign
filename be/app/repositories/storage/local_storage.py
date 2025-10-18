import aiofiles, hashlib, os
from pathlib import Path
from .ports import FileStorage, StoredFile


class LocalFileStorage(FileStorage):
    def __init__(self, base_dir: str):
        self.base_dir = Path(base_dir).resolve()
        self.base_dir.mkdir(parents=True, exist_ok=True)

    async def put(self, dst_rel_key: str, stream) -> StoredFile:
        key = dst_rel_key.strip().lstrip("/").replace("..", "")
        dst_path = (self.base_dir / key).resolve()

        # ensure we don't escape base_dir
        if self.base_dir not in dst_path.parents and dst_path.parent != self.base_dir:
            raise ValueError("Invalid destination path")

        dst_path.parent.mkdir(parents=True, exist_ok=True)

        h = hashlib.sha256()
        size = 0
        async with aiofiles.open(dst_path, "wb") as f:
            while chunk := await stream.read(1024 * 1024):
                await f.write(chunk)
                h.update(chunk)
                size += len(chunk)

        return StoredFile(
            file_path=str(dst_path),
            size=size,
            mime=getattr(stream, "content_type", None),
            original_name=getattr(stream, "filename", None),
            checksum=h.hexdigest(),
        )

