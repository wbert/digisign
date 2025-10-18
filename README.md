# Digi Sign (`wbert-digisign`)

Digi Sign is a full-stack web application for embedding and serializing verifiable digital signatures directly into a PDF’s metadata. It uses a PKCS\#12 certificate to cryptographically sign documents, placing a visible signature based on the location of specific search text within the PDF.

The system is built with a Python/FastAPI backend that performs the core signing logic and a React/TypeScript frontend that provides a user interface for uploading files and initiating the signing process. The entire application is containerized using Docker and Docker Compose.

## Technology Stack

| Component | Technology |
| :--- | :--- |
| **Backend** | Python 3.11, FastAPI, Uvicorn |
| **PDF Signing** | `endesive` |
| **PDF Text Extraction** | `pdfminer.six` |
| **Frontend** | React 19, TypeScript, Vite |
| **UI** | shadcn/ui, Tailwind CSS, Lucide Icons |
| **Routing** | React Router |
| **Infra** | Docker, Docker Compose |
| **Web Server / Proxy** | Nginx |

## Features

  * **PKCS\#12 Digital Signing:** Securely signs PDF documents using a password-protected `.p12` or `.pfx` file containing a private key and certificate chain.
  * **OCR-Aware Placement:** The system doesn't just stamp a signature; it uses `pdfminer` to parse the PDF, find the exact coordinates of a user-provided `search_word`, and then places the visible signature image at that location.
  * **Multiple Signing Modes**:
      * `single_sign`: Places one signature on the **last page** of the PDF, next to the **last occurrence** of the `search_word`.
      * `per_page_sign`: Places a signature on **every page** that contains the `search_word`, next to the **last occurrence** on each page.
      * `per_name_sign`: Places a signature next to **every single occurrence** of the `search_word` throughout the entire document.
  * **Web Interface & Demo:** The frontend provides a simple interface with pages for "Home", "Features", "About" (detailing the architecture), and a "Demo" page.
  * **Demo Workflow:** The demo page allows a user to:
    1.  Upload a PDF, a transparent signature PNG, and a `.p12` certificate file.
    2.  Enter the `.p12` password and the `search_word` to target for placement.
    3.  Select a signing mode (`single_sign`, `per_page_sign`, `per_name_sign`).
    4.  Execute the signature process and receive a link to the new, signed PDF.
  * **Automatic File Cleanup:** A separate `cleanup` service runs a cron job (`0 2 * * *` - 2:00 AM daily) to delete uploaded files older than 24 hours (configurable via `MAX_AGE_HOURS`).
  * **Rate Limiting:** The file upload endpoint (`/files/store`) is protected by a simple in-memory rate limiter, enforcing a 5-second cooldown per IP address.

## Getting Started

The project is designed to be run using Docker Compose.

1.  Ensure you have Docker and Docker Compose (or `docker compose`) installed on your system.

2.  Clone the repository.

3.  From the root `wbert-digisign/` directory, run the following command to build and start all services:

    ```sh
    docker compose up --build -d
    ```

4.  The application will be accessible at **`http://localhost:80`**.

The `docker-compose.yml` file defines three services:

  * `backend`: The FastAPI application.
  * `web`: The Nginx server, which serves the React frontend and acts as a reverse proxy for the backend.
  * `cleanup`: A cron-based container that periodically cleans the `uploads` volume.

## Project Structure

```
wbert-digisign/
├── docker-compose.yml  # Defines the backend, web, and cleanup services
├── be/                   # FastAPI Backend
│   ├── Dockerfile        # Docker build file for the backend
│   ├── requirements.txt  # Python dependencies
│   └── app/
│       ├── main.py       # FastAPI app initialization, middleware, routers
│       ├── middleware/
│       │   └── rate_limit.py # Simple IP-based rate limiter
│       ├── repositories/
│       │   └── storage/    # File storage logic (e.g., local_storage.py)
│       ├── routers/
│       │   ├── sign_router.py  # API routes for signing
│       │   └── upload_router.py # API routes for file uploads
│       ├── schemas/        # Pydantic models for API I/O
│       ├── services/
│       │   ├── sign_service.py # Business logic for signing modes
│       │   └── upload_service.py # Business logic for file handling
│       └── utils/
│           ├── cron/
│           │   └── cleanup.py  # Script to delete old files
│           └── signer/       # Core PDF signing and parsing logic
│               ├── name_search.py # Uses pdfminer to find word coordinates
│               ├── sign.py        # Uses endesive to apply the signature
│               └── signature.py   # Orchestrates the signing modes
├── fe/                   # React/TypeScript Frontend
│   ├── Dockerfile        # Multi-stage build for the React app
│   ├── package.json      # Frontend dependencies (React, Vite)
│   ├── vite.config.ts    # Vite configuration, including PWA setup
│   └── src/
│       ├── App.tsx       # Main React application component
│       ├── components/
│       │   └── ui/       # shadcn/ui components
│       ├── pages/        # Application pages
│       │   ├── about/    # Architecture overview page
│       │   ├── demo/     # Interactive signing demo page
│       │   ├── features/ # Features explanation page
│       │   └── home/     # Landing page
│       └── routes/
│           └── router.tsx # React Router configuration
└── nginx/
    └── default.conf      # Nginx config for reverse proxy and static file serving
```

## API Endpoints

The Nginx service proxies all requests from `/api/` to the backend service.

### `POST /api/files/store`

Uploads the files required for the signing operation. This endpoint is rate-limited.

  * **Request:** `multipart/form-data`
      * `pdf_path`: The PDF file to be signed.
      * `pdf_image`: The transparent PNG signature image.
      * `p12_signature`: The `.p12` or `.pfx` certificate file.
  * **Response:** `200 OK`
    ```json
    {
      "paths": {
        "pdf_path": "/app/uploads/pdfs/uuid-here.pdf",
        "pdf_image": "/app/uploads/images/uuid-here.png",
        "p12_signature": "/app/uploads/certs/uuid-here.p12"
      }
    }
    ```

### `POST /api/sign/sign`

Executes the digital signing process using the files previously uploaded.

  * **Request:** `application/json` (matches `SingleSign` schema)
    ```json
    {
      "sign_type": "single_sign",
      "pdf_image": "/app/uploads/images/uuid-here.png",
      "p12_signature": "/app/uploads/certs/uuid-here.p12",
      "password": "your-p12-password",
      "pdf_path": "/app/uploads/pdfs/uuid-here.pdf",
      "search_word": "TEXT TO FIND"
    }
    ```
  * **Response:** `200 OK`
      * On success, returns the signed PDF file directly with a `media_type` of `application/pdf` and a `Content-Disposition` header to trigger a download.
