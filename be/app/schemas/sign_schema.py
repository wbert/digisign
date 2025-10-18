from pydantic import BaseModel


class SingleSign(BaseModel):
    sign_type: str
    pdf_image: str
    p12_signature: str
    password: str
    pdf_path: str
    search_word: str
