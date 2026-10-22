from __future__ import annotations

import uuid
from pathlib import Path

import fitz  # PyMuPDF
from qdrant_client.models import PointStruct

from app.core.config import get_settings
from app.core.qdrant import get_qdrant_client
from app.services.rag.embeddings import embed_texts
from app.services.rag.splitter import recursive_character_split


def extract_text_from_pdf(pdf_path: str | Path) -> list[dict]:
    doc = fitz.open(str(pdf_path))
    pages: list[dict] = []
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text")
        if text.strip():
            pages.append({"text": text, "page_number": page_num + 1})
    doc.close()
    return pages


def chunk_document(
    pages: list[dict],
    chunk_size: int = 512,
    chunk_overlap: int = 64,
) -> list[dict]:
    chunks: list[dict] = []
    for page in pages:
        page_chunks = recursive_character_split(
            page["text"],
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
        )
        for text in page_chunks:
            chunks.append({
                "text": text,
                "page_number": page["page_number"],
            })
    return chunks


def ingest_document(
    pdf_path: str | Path,
    bank: str,
    card_name: str | None = None,
    document_type: str = "mitc",
) -> dict:
    settings = get_settings()
    client = get_qdrant_client()

    pages = extract_text_from_pdf(pdf_path)
    if not pages:
        return {"status": "empty", "chunks_indexed": 0}

    chunks = chunk_document(pages)
    if not chunks:
        return {"status": "empty", "chunks_indexed": 0}

    texts = [c["text"] for c in chunks]
    vectors = embed_texts(texts)

    points = []
    for chunk, vector in zip(chunks, vectors):
        point_id = str(uuid.uuid4())
        payload = {
            "text": chunk["text"],
            "bank": bank,
            "card_name": card_name or "",
            "document_type": document_type,
            "page_number": chunk["page_number"],
            "source_file": Path(pdf_path).name,
        }
        points.append(PointStruct(id=point_id, vector=vector, payload=payload))

    batch_size = 64
    for i in range(0, len(points), batch_size):
        batch = points[i : i + batch_size]
        client.upsert(collection_name=settings.qdrant_collection, points=batch)

    return {
        "status": "indexed",
        "chunks_indexed": len(points),
        "pages_extracted": len(pages),
        "source_file": Path(pdf_path).name,
    }


def ingest_directory(directory: str | Path) -> list[dict]:
    directory = Path(directory)
    results: list[dict] = []
    for pdf_file in sorted(directory.glob("**/*.pdf")):
        parts = pdf_file.relative_to(directory).parts
        if len(parts) >= 2:
            document_type = parts[0]
            bank = pdf_file.stem.split("_")[0] if "_" in pdf_file.stem else ""
            card_name = "_".join(pdf_file.stem.split("_")[1:]) if "_" in pdf_file.stem else pdf_file.stem
        else:
            document_type = "general"
            bank = ""
            card_name = pdf_file.stem

        result = ingest_document(
            pdf_path=pdf_file,
            bank=bank,
            card_name=card_name,
            document_type=document_type,
        )
        result["file"] = str(pdf_file)
        results.append(result)
    return results
