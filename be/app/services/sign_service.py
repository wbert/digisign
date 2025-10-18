from app.utils.signer.signature import Signature
from app.schemas.sign_schema import SingleSign
from pathlib import Path


class SignService:
    def __init__(self, sg: Signature) -> None:
        self.sg = sg

    def sign(self, ss: SingleSign):
        out_path = None

        if ss.sign_type == "single_sign":
            out_path = self.sg.single_sign(
                ss.pdf_image, ss.p12_signature, ss.password, ss.pdf_path, ss.search_word
            )

        if ss.sign_type == "per_page_sign":
            out_path = self.sg.per_page_sign(
                ss.pdf_image, ss.p12_signature, ss.password, ss.pdf_path, ss.search_word
            )

        if ss.sign_type == "per_name_sign":
            out_path = self.sg.per_name_sign(
                ss.pdf_image, ss.p12_signature, ss.password, ss.pdf_path, ss.search_word
            )

        if not out_path:
            return None, None

        out_path = Path(out_path).resolve()
        filename = out_path.name
        return str(out_path), filename
