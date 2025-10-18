from typing import Optional, Dict
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Request

from app.repositories.storage.local_storage import LocalFileStorage
from app.services.upload_service import UploadService
from app.schemas.upload_schema import UploadPaths

router = APIRouter()


def get_upload_service() -> UploadService:
    storage = LocalFileStorage(base_dir="uploads")  # adjust base_dir as needed
    return UploadService(storage)


@router.post("/store", response_model=UploadPaths)
async def store_files(
    request: Request,
    pdf_path: Optional[UploadFile] = File(None),
    pdf_image: Optional[UploadFile] = File(None),
    p12_signature: Optional[UploadFile] = File(None),
    svc: UploadService = Depends(get_upload_service),
):
    # Optional size guard via Content-Length (50MB example)
    clen = request.headers.get("content-length")
    if clen and int(clen) > 50 * 1024 * 1024:
        raise HTTPException(413, "Payload too large")

    if not any([pdf_path, pdf_image, p12_signature]):
        raise HTTPException(400, "No files provided")

    results: Dict[str, str] = {}
    for name, f in (
        ("pdf_path", pdf_path),
        ("pdf_image", pdf_image),
        ("p12_signature", p12_signature),
    ):
        if f is None:
            continue
        stored = await svc.save_named(name, f)
        results[name] = stored.file_path

    return UploadPaths(paths=results)
