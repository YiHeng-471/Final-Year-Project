"""Hybrid content-based perfume recommendation engine.

Semantic similarity is calculated from the existing MiniLM embeddings. Exact
preferred-note matching adds a small, explainable boost without pretending the
dataset contains structured occasion or feeling labels.
"""

from __future__ import annotations

import re
import unicodedata
from pathlib import Path
from typing import Iterable

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "processed" / "perfume_clean.csv"
EMBEDDINGS_PATH = ROOT / "data" / "processed" / "perfumes_embeddings.npy"
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

# Deliberately limited to spelling/number variants of notes exposed by the
# questionnaire. This is not intended to become a fragrance-note ontology.
QUESTIONNAIRE_NOTE_ALIASES = {
    "musk": ("musk", "musks"),
    "citrus": ("citrus", "citruses"),
}


def normalize_text(value: str) -> str:
    value = unicodedata.normalize("NFKD", str(value).lower())
    value = "".join(character for character in value if not unicodedata.combining(character))
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def note_matches(notes_text: str, preferred_notes: Iterable[str]) -> list[str]:
    normalized_notes = f" {normalize_text(notes_text)} "
    matches = []

    for note in preferred_notes:
        normalized_note = normalize_text(note)
        aliases = QUESTIONNAIRE_NOTE_ALIASES.get(normalized_note, (normalized_note,))

        if any(f" {normalize_text(alias)} " in normalized_notes for alias in aliases):
            matches.append(note)

    return matches


class PerfumeRecommender:
    def __init__(self) -> None:
        self.perfumes = pd.read_csv(DATA_PATH).fillna("")
        self.embeddings = np.load(EMBEDDINGS_PATH).astype(np.float32)
        self._model = None

        if len(self.perfumes) != len(self.embeddings):
            raise RuntimeError(
                "Dataset and embedding counts differ: "
                f"{len(self.perfumes)} rows versus {len(self.embeddings)} embeddings."
            )

    @property
    def model(self):
        if self._model is None:
            from sentence_transformers import SentenceTransformer

            self._model = SentenceTransformer(MODEL_NAME)
        return self._model

    def recommend(
        self,
        user_text: str,
        preferred_notes: list[str] | None = None,
        candidate_dataset_ids: list[int] | None = None,
        top_k: int = 12,
        semantic_weight: float = 0.8,
    ) -> list[dict]:
        preferred_notes = preferred_notes or []
        user_embedding = self.model.encode(
            [user_text],
            normalize_embeddings=True,
        )[0].astype(np.float32)

        semantic_scores = self.embeddings @ user_embedding
        candidate_ids = self._candidate_ids(candidate_dataset_ids)
        ranked = []

        for dataset_id in candidate_ids:
            perfume = self.perfumes.iloc[dataset_id]
            matched_notes = note_matches(perfume["notes"], preferred_notes)
            note_score = len(matched_notes) / len(preferred_notes) if preferred_notes else 0.0
            effective_semantic_weight = semantic_weight if preferred_notes else 1.0
            final_score = (
                effective_semantic_weight * float(semantic_scores[dataset_id])
                + (1.0 - effective_semantic_weight) * note_score
            )

            ranked.append(
                {
                    "dataset_id": int(dataset_id),
                    "score": round(final_score, 6),
                    "semantic_score": round(float(semantic_scores[dataset_id]), 6),
                    "note_score": round(note_score, 6),
                    "matched_notes": matched_notes,
                    "name": perfume["name"],
                    "brand": perfume["brand"],
                    "description": perfume["description"],
                    "notes": perfume["notes"],
                    "image_url": perfume["image_url"],
                    "explanation": self._explanation(matched_notes, preferred_notes),
                }
            )

        ranked.sort(key=lambda item: item["score"], reverse=True)
        return ranked[:top_k]

    def _candidate_ids(self, requested_ids: list[int] | None) -> list[int]:
        if requested_ids is None:
            return list(range(len(self.perfumes)))
        return sorted({item for item in requested_ids if 0 <= item < len(self.perfumes)})

    @staticmethod
    def _explanation(matched_notes: list[str], preferred_notes: list[str]) -> str:
        if matched_notes:
            notes = ", ".join(matched_notes)
            return f"Semantically aligned with your scent profile and contains your preferred note(s): {notes}."
        if preferred_notes:
            return "Semantically aligned with your preferred character, occasion, and desired feeling."
        return "Semantically aligned with your preferred character, occasion, and desired feeling."


recommender = PerfumeRecommender()


def recommend(
    user_text: str,
    preferred_notes: list[str] | None = None,
    candidate_dataset_ids: list[int] | None = None,
    top_k: int = 12,
) -> list[dict]:
    return recommender.recommend(user_text, preferred_notes, candidate_dataset_ids, top_k)


if __name__ == "__main__":
    for result in recommend(
        "The user prefers a fresh citrus fragrance with bergamot for everyday wear.",
        preferred_notes=["bergamot"],
        top_k=5,
    ):
        print(result["dataset_id"], result["name"], result["score"], result["matched_notes"])
