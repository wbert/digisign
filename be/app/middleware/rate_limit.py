import time
from fastapi import Request
from fastapi.responses import JSONResponse

_last: dict[str, float] = {}
COOLDOWN = 5  # seconds


async def rate_limit_middleware(request: Request, call_next):
    """Simple in-memory rate limiter for /files/store"""
    if request.url.path.startswith("/files/store"):
        ip = request.client.host
        now = time.time()
        delta = now - _last.get(ip, 0)
        if delta < COOLDOWN:
            retry_after = int(COOLDOWN - delta)
            return JSONResponse(
                {"detail": f"Too many requests. Retry after {retry_after}s."},
                status_code=429,
                headers={"Retry-After": str(retry_after)},
            )
        _last[ip] = now

    response = await call_next(request)
    return response
