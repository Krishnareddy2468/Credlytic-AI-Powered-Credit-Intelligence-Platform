from typing import List, Optional

from pydantic import BaseModel, Field


class IngestResponse(BaseModel):
    status: str
    chunks_indexed: int
    pages_extracted: int = 0
    source_file: str = ""


class PolicyChunk(BaseModel):
    id: str
    score: float
    text: str
    bank: str
    card_name: str
    document_type: str
    page_number: int
    source_file: str


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500)
    top_k: int = Field(default=5, ge=1, le=20)
    bank: Optional[str] = None
    card_name: Optional[str] = None
    document_type: Optional[str] = None


class SearchResponse(BaseModel):
    query: str
    results: List[PolicyChunk]
    total: int


class BulkIngestResult(BaseModel):
    file: str
    status: str
    chunks_indexed: int


class BulkIngestResponse(BaseModel):
    documents_processed: int
    results: List[BulkIngestResult]
