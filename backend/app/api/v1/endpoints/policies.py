from __future__ import annotations

import shutil
import tempfile
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.core.config import get_settings
from app.schemas.policy import (
    BulkIngestResponse,
    BulkIngestResult,
    IngestResponse,
    SearchRequest,
    SearchResponse,
)
from app.services.rag.ingestion import ingest_document, ingest_directory
from app.services.rag.retrieval import retrieve

router = APIRouter()


@router.post("/ingest", response_model=IngestResponse)
async def ingest_policy(
    file: UploadFile = File(...),
    bank: str = Form(...),
    card_name: str = Form(default=""),
    document_type: str = Form(default="mitc"),
) -> IngestResponse:
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    if file.size and file.size > 50 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 50 MB)")

    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        result = ingest_document(
            pdf_path=tmp_path,
            bank=bank,
            card_name=card_name or None,
            document_type=document_type,
        )
    finally:
        Path(tmp_path).unlink(missing_ok=True)

    return IngestResponse(**result)


@router.post("/ingest/bulk", response_model=BulkIngestResponse)
async def bulk_ingest() -> BulkIngestResponse:
    settings = get_settings()
    policies_dir = Path(settings.policies_dir)
    if not policies_dir.exists():
        raise HTTPException(status_code=404, detail=f"Policies directory not found: {policies_dir}")

    raw = ingest_directory(policies_dir)
    results = [
        BulkIngestResult(
            file=r.get("file", ""),
            status=r.get("status", "error"),
            chunks_indexed=r.get("chunks_indexed", 0),
        )
        for r in raw
    ]
    return BulkIngestResponse(documents_processed=len(results), results=results)


@router.post("/search", response_model=SearchResponse)
async def search_policies(request: SearchRequest) -> SearchResponse:
    chunks = retrieve(
        query=request.query,
        top_k=request.top_k,
        bank=request.bank,
        card_name=request.card_name,
        document_type=request.document_type,
    )
    return SearchResponse(query=request.query, results=chunks, total=len(chunks))
