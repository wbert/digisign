from pydantic import BaseModel, Field
from typing import Optional


class FileStoreResult(BaseModel):
    file_path: str = Field(
        ..., description="Absolute or server-local path where the file was saved"
    )
    size: int
    mime: str
    original_name: str
    checksum: Optional[str] = None
