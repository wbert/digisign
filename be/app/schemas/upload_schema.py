from pydantic import BaseModel, Field
from typing import Dict


class UploadPaths(BaseModel):
    # Map the field name -> absolute file path saved on server
    paths: Dict[str, str] = Field(
        ..., description="Saved file paths by form field name"
    )
