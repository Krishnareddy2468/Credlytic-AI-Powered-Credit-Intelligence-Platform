from __future__ import annotations

from qdrant_client.models import FieldCondition, Filter, MatchValue

from app.core.config import get_settings
from app.core.qdrant import get_qdrant_client
from app.services.rag.embeddings import embed_query


def retrieve(
    query: str,
    top_k: int = 5,
    bank: str | None = None,
    card_name: str | None = None,
    document_type: str | None = None,
) -> list[dict]:
    settings = get_settings()
    client = get_qdrant_client()

    query_vector = embed_query(query)

    conditions = []
    if bank:
        conditions.append(
            FieldCondition(key="bank", match=MatchValue(value=bank))
        )
    if card_name:
        conditions.append(
            FieldCondition(key="card_name", match=MatchValue(value=card_name))
        )
    if document_type:
        conditions.append(
            FieldCondition(key="document_type", match=MatchValue(value=document_type))
        )

    query_filter = Filter(must=conditions) if conditions else None

    results = client.query_points(
        collection_name=settings.qdrant_collection,
        query=query_vector,
        query_filter=query_filter,
        limit=top_k,
        with_payload=True,
    )

    chunks: list[dict] = []
    for point in results.points:
        chunks.append({
            "id": point.id,
            "score": point.score,
            "text": point.payload.get("text", ""),
            "bank": point.payload.get("bank", ""),
            "card_name": point.payload.get("card_name", ""),
            "document_type": point.payload.get("document_type", ""),
            "page_number": point.payload.get("page_number", 0),
            "source_file": point.payload.get("source_file", ""),
        })

    return chunks
