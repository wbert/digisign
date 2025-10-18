from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .services.sign_service import SignService
from .utils.signer.signature import Signature
from .utils.signer.name_search import NameSearch
from .routers.sign_router import SignRouter
from .routers.upload_router import router as upload_router
from .middleware.rate_limit import rate_limit_middleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

origins = os.getenv("ALLOWED_ORIGINS", "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.middleware("http")(rate_limit_middleware)

# init your service
sign_service = SignService(Signature(NameSearch()))

# init router with service
sign_router = SignRouter(sign_service)

# include router
app.include_router(upload_router, prefix="/files", tags=["FILES"])
app.include_router(sign_router.router, prefix="/sign", tags=["SIGN"])
