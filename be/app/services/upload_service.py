import uuid
from fastapi import UploadFile, HTTPException

from app.repositories.storage.ports import FileStorage, StoredFile

ALLOWED_MIME = {
    "application/pdf",
    "image/png",
    "image/jpeg",
    "application/x-pkcs12",
    "application/octet-stream",
}


class UploadService:
    def __init__(self, storage: FileStorage):
        self.storage = storage

    async def save_named(self, field_name: str, file: UploadFile) -> StoredFile:
        if file.content_type and file.content_type not in ALLOWED_MIME:
            raise HTTPException(415, f"Unsupported file type: {file.content_type}")

        role = (
            "pdfs"
            if field_name in {"pdf_path"}
            else "images"
            if field_name in {"pdf_image"}
            else "certs"
            if field_name in {"p12_signature"}
            else "misc"
        )

        if "." in (file.filename or ""):
            ext = file.filename.rsplit(".", 1)[-1].lower()
        else:
            ext = "bin"

        key = f"{role}/{uuid.uuid4().hex}.{ext}"

        await file.seek(0)
        return await self.storage.put(key, file)
