from typing import Protocol, BinaryIO, Optional
from dataclasses import dataclass


@dataclass
class StoredFile:
    file_path: str  # absolute server path
    size: int
    mime: Optional[str] = None
    original_name: Optional[str] = None
    checksum: Optional[str] = None


class FileStorage(Protocol):
    async def put(self, dst_rel_key: str, stream: BinaryIO) -> StoredFile: ...
