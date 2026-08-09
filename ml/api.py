"""FastAPI boundary for the perfume recommendation engine."""

from __future__ import annotations

from fastapi import FastAPI
from pydantic import BaseModel, Field

try:
    from .recommend import MODEL_NAME, recommender
except ImportError:  # Supports running uvicorn from inside the ml directory.
    from recommend import MODEL_NAME, recommender


app = FastAPI(
    title="Essence Recommendation API",
    description="Hybrid semantic and exact-note content-based perfume recommendations.",
    version="1.0.0",
)


@app.get("/")
def root() -> dict:
    return {
        "service": "Essence Recommendation API",
        "status": "running",
        "health": "/health",
        "documentation": "/docs",
        "recommendations": "POST /recommend",
    }


class RecommendationRequest(BaseModel):
    semantic_profile: str = Field(min_length=10, max_length=2000)
    preferred_notes: list[str] = Field(default_factory=list, max_length=5)
    candidate_dataset_ids: list[int] | None = None
    top_k: int = Field(default=12, ge=1, le=50)


class RecommendationResult(BaseModel):
    dataset_id: int
    score: float
    semantic_score: float
    note_score: float
    matched_notes: list[str]
    name: str
    brand: str
    description: str
    notes: str
    image_url: str
    explanation: str


class RecommendationResponse(BaseModel):
    model: str
    candidate_count: int
    results: list[RecommendationResult]


@app.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "model": MODEL_NAME,
        "catalogue_size": len(recommender.perfumes),
        "embedding_shape": list(recommender.embeddings.shape),
    }


@app.post("/recommend", response_model=RecommendationResponse)
def create_recommendations(payload: RecommendationRequest) -> RecommendationResponse:
    candidate_count = (
        len(set(payload.candidate_dataset_ids))
        if payload.candidate_dataset_ids is not None
        else len(recommender.perfumes)
    )
    results = recommender.recommend(
        user_text=payload.semantic_profile,
        preferred_notes=payload.preferred_notes,
        candidate_dataset_ids=payload.candidate_dataset_ids,
        top_k=payload.top_k,
    )
    return RecommendationResponse(
        model=MODEL_NAME,
        candidate_count=candidate_count,
        results=results,
    )
