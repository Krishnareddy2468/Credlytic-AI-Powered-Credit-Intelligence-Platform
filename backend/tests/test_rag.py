"""Tests for the RAG pipeline: text splitting, PDF extraction, embedding, and API endpoints.

These tests run without Qdrant by mocking the vector store calls.
The splitter and PDF extraction are tested directly.
"""

from __future__ import annotations

import tempfile
from pathlib import Path
from unittest.mock import MagicMock, patch

import fitz
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services.rag.splitter import recursive_character_split


# ---------------------------------------------------------------------------
# Text splitter
# ---------------------------------------------------------------------------


class TestRecursiveCharacterSplit:
    def test_short_text_returns_single_chunk(self) -> None:
        result = recursive_character_split("Hello world", chunk_size=512)
        assert result == ["Hello world"]

    def test_empty_text_returns_empty_list(self) -> None:
        assert recursive_character_split("") == []
        assert recursive_character_split("   ") == []

    def test_splits_on_paragraph_boundary(self) -> None:
        text = ("A" * 300) + "\n\n" + ("B" * 300)
        chunks = recursive_character_split(text, chunk_size=400, chunk_overlap=0)
        assert len(chunks) >= 2
        assert chunks[0].startswith("A")
        assert chunks[-1].startswith("B") or "B" in chunks[-1]

    def test_respects_chunk_size(self) -> None:
        text = " ".join(["word"] * 500)
        chunks = recursive_character_split(text, chunk_size=100, chunk_overlap=0)
        for chunk in chunks:
            assert len(chunk) <= 120  # small tolerance for edge splits

    def test_overlap_produces_more_chunks(self) -> None:
        text = " ".join(["word"] * 200)
        no_overlap = recursive_character_split(text, chunk_size=100, chunk_overlap=0)
        with_overlap = recursive_character_split(text, chunk_size=100, chunk_overlap=20)
        assert len(with_overlap) >= len(no_overlap)


# ---------------------------------------------------------------------------
# PDF extraction
# ---------------------------------------------------------------------------


def _make_sample_pdf(text: str, pages: int = 1) -> Path:
    tmp = tempfile.NamedTemporaryFile(suffix=".pdf", delete=False)
    doc = fitz.open()
    for _ in range(pages):
        page = doc.new_page()
        tw = fitz.TextWriter(page.rect)
        tw.append((72, 72), text, fontsize=11)
        tw.write_text(page)
    doc.save(tmp.name)
    doc.close()
    tmp.close()
    return Path(tmp.name)


class TestPdfExtraction:
    def test_extract_text(self) -> None:
        from app.services.rag.ingestion import extract_text_from_pdf

        pdf_path = _make_sample_pdf("Test content for extraction")
        pages = extract_text_from_pdf(pdf_path)
        assert len(pages) == 1
        assert "Test content" in pages[0]["text"]
        assert pages[0]["page_number"] == 1
        pdf_path.unlink()

    def test_multi_page_extraction(self) -> None:
        from app.services.rag.ingestion import extract_text_from_pdf

        pdf_path = _make_sample_pdf("Page content", pages=3)
        pages = extract_text_from_pdf(pdf_path)
        assert len(pages) == 3
        assert pages[2]["page_number"] == 3
        pdf_path.unlink()


class TestChunkDocument:
    def test_chunk_pages(self) -> None:
        from app.services.rag.ingestion import chunk_document

        pages = [
            {"text": "Short text on page one.", "page_number": 1},
            {"text": "Another short page.", "page_number": 2},
        ]
        chunks = chunk_document(pages, chunk_size=512)
        assert len(chunks) == 2
        assert chunks[0]["page_number"] == 1
        assert chunks[1]["page_number"] == 2


# ---------------------------------------------------------------------------
# Embedding service
# ---------------------------------------------------------------------------


class TestEmbeddings:
    @patch("app.services.rag.embeddings.get_embedding_model")
    def test_embed_texts(self, mock_model_fn: MagicMock) -> None:
        import numpy as np

        from app.services.rag.embeddings import embed_texts

        mock_model = MagicMock()
        mock_model.encode.return_value = np.random.rand(2, 384).astype("float32")
        mock_model_fn.return_value = mock_model

        result = embed_texts(["hello", "world"])
        assert len(result) == 2
        assert len(result[0]) == 384

    @patch("app.services.rag.embeddings.get_embedding_model")
    def test_embed_query(self, mock_model_fn: MagicMock) -> None:
        import numpy as np

        from app.services.rag.embeddings import embed_query

        mock_model = MagicMock()
        mock_model.encode.return_value = np.random.rand(384).astype("float32")
        mock_model_fn.return_value = mock_model

        result = embed_query("test query")
        assert len(result) == 384


# ---------------------------------------------------------------------------
# Ingestion (mocked Qdrant)
# ---------------------------------------------------------------------------


class TestIngestion:
    @patch("app.services.rag.ingestion.get_qdrant_client")
    @patch("app.services.rag.ingestion.embed_texts")
    def test_ingest_document(
        self, mock_embed: MagicMock, mock_client_fn: MagicMock
    ) -> None:
        from app.services.rag.ingestion import ingest_document

        pdf_path = _make_sample_pdf("HDFC Regalia eligibility income Rs 12 lakhs")
        mock_embed.return_value = [[0.1] * 384]
        mock_client = MagicMock()
        mock_client_fn.return_value = mock_client

        result = ingest_document(
            pdf_path=pdf_path,
            bank="HDFC",
            card_name="Regalia",
            document_type="mitc",
        )

        assert result["status"] == "indexed"
        assert result["chunks_indexed"] >= 1
        assert result["pages_extracted"] == 1
        mock_client.upsert.assert_called_once()
        pdf_path.unlink()


# ---------------------------------------------------------------------------
# Retrieval (mocked Qdrant)
# ---------------------------------------------------------------------------


class TestRetrieval:
    @patch("app.services.rag.retrieval.get_qdrant_client")
    @patch("app.services.rag.retrieval.embed_query")
    def test_retrieve(self, mock_embed: MagicMock, mock_client_fn: MagicMock) -> None:
        from app.services.rag.retrieval import retrieve

        mock_embed.return_value = [0.1] * 384

        mock_point = MagicMock()
        mock_point.id = "abc-123"
        mock_point.score = 0.95
        mock_point.payload = {
            "text": "HDFC Regalia requires minimum income of Rs 12 lakhs",
            "bank": "HDFC",
            "card_name": "Regalia",
            "document_type": "mitc",
            "page_number": 1,
            "source_file": "HDFC_Regalia.pdf",
        }

        mock_client = MagicMock()
        mock_result = MagicMock()
        mock_result.points = [mock_point]
        mock_client.query_points.return_value = mock_result
        mock_client_fn.return_value = mock_client

        results = retrieve("What is the income requirement for HDFC Regalia?")
        assert len(results) == 1
        assert results[0]["bank"] == "HDFC"
        assert results[0]["score"] == 0.95
        assert "12 lakhs" in results[0]["text"]

    @patch("app.services.rag.retrieval.get_qdrant_client")
    @patch("app.services.rag.retrieval.embed_query")
    def test_retrieve_with_filters(
        self, mock_embed: MagicMock, mock_client_fn: MagicMock
    ) -> None:
        from app.services.rag.retrieval import retrieve

        mock_embed.return_value = [0.1] * 384
        mock_client = MagicMock()
        mock_result = MagicMock()
        mock_result.points = []
        mock_client.query_points.return_value = mock_result
        mock_client_fn.return_value = mock_client

        results = retrieve("eligibility", bank="HDFC", document_type="mitc")
        assert results == []
        call_kwargs = mock_client.query_points.call_args
        assert call_kwargs.kwargs["query_filter"] is not None


# ---------------------------------------------------------------------------
# API endpoint tests (mocked services)
# ---------------------------------------------------------------------------


class TestPolicyEndpoints:
    @patch("app.api.v1.endpoints.policies.ingest_document")
    def test_ingest_endpoint(self, mock_ingest: MagicMock) -> None:
        mock_ingest.return_value = {
            "status": "indexed",
            "chunks_indexed": 5,
            "pages_extracted": 2,
            "source_file": "test.pdf",
        }

        pdf_path = _make_sample_pdf("test content")
        client = TestClient(app)
        with open(pdf_path, "rb") as f:
            response = client.post(
                "/api/v1/admin/policies/ingest",
                files={"file": ("test.pdf", f, "application/pdf")},
                data={"bank": "HDFC", "card_name": "Regalia", "document_type": "mitc"},
            )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "indexed"
        assert data["chunks_indexed"] == 5
        pdf_path.unlink()

    def test_ingest_rejects_non_pdf(self) -> None:
        client = TestClient(app)
        response = client.post(
            "/api/v1/admin/policies/ingest",
            files={"file": ("test.txt", b"hello", "text/plain")},
            data={"bank": "HDFC"},
        )
        assert response.status_code == 400

    @patch("app.api.v1.endpoints.policies.retrieve")
    def test_search_endpoint(self, mock_retrieve: MagicMock) -> None:
        mock_retrieve.return_value = [
            {
                "id": "abc",
                "score": 0.9,
                "text": "sample chunk",
                "bank": "HDFC",
                "card_name": "Regalia",
                "document_type": "mitc",
                "page_number": 1,
                "source_file": "HDFC_Regalia.pdf",
            }
        ]

        client = TestClient(app)
        response = client.post(
            "/api/v1/admin/policies/search",
            json={"query": "income requirement"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 1
        assert data["results"][0]["bank"] == "HDFC"
