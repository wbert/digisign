from fastapi import APIRouter
from fastapi.responses import FileResponse
from app.services.sign_service import SignService
from app.schemas.sign_schema import SingleSign
from urllib.parse import quote


class SignRouter:
    def __init__(self, svc: SignService):
        self.svc = svc
        self.router = APIRouter()

        # register routes during initialization
        self.router.add_api_route("/sign", self.sign, methods=["POST"], tags=["SIGN"])

    def sign(self, ss: SingleSign):
        # result = self.svc.single_sign(ss)
        # return {"status": "ok", "result": result}
        out_path, filename = self.svc.sign(ss)

        if not out_path and not filename:
            return None

        cd = f"attachment; filename=\"{filename}\"; filename*=UTF-8''{quote(filename)}"
        return FileResponse(
            path=out_path,
            media_type="application/pdf",
            filename=filename,  # sets a basic Content-Disposition too
            headers={"Content-Disposition": cd},
        )
