"""Compare five semantic/note weightings without changing production scoring.

All configurations use the same 18 questionnaire-style scenarios, the same
complete candidate catalogue, and the existing PerfumeRecommender.recommend()
method. Baseline overlap@5 is the fraction of a scenario's top five dataset IDs
that also occur in that scenario's 100/0 semantic-baseline top five, averaged
across all scenarios.
"""

from __future__ import annotations

from dataclasses import dataclass
from statistics import mean

from recommend import recommender


TOP_K = 5
SEMANTIC_WEIGHTS = (1.0, 0.9, 0.8, 0.7, 0.6)


@dataclass(frozen=True)
class EvaluationScenario:
    name: str
    semantic_profile: str
    preferred_notes: tuple[str, ...]


SCENARIOS = (
    # Floral profiles: one, two, and three selected notes.
    EvaluationScenario(
        "Floral rose romantic",
        "The user prefers a floral fragrance featuring rose. They want something soft, elegant and romantic for date occasions.",
        ("rose",),
    ),
    EvaluationScenario(
        "Floral rose jasmine romantic",
        "The user prefers a floral fragrance featuring rose and jasmine. They want something elegant and sophisticated for romantic occasions.",
        ("rose", "jasmine"),
    ),
    EvaluationScenario(
        "Floral rose jasmine musk special",
        "The user prefers a floral fragrance featuring rose, jasmine and musk. They want something soft, sophisticated and sensual for a special occasion.",
        ("rose", "jasmine", "musk"),
    ),

    # Woody profiles: one, two, and three selected notes.
    EvaluationScenario(
        "Woody vetiver office",
        "The user prefers a woody fragrance featuring vetiver. They want something clean, elegant and professional for office use.",
        ("vetiver",),
    ),
    EvaluationScenario(
        "Woody vetiver sandalwood office",
        "The user prefers a woody fragrance featuring vetiver and sandalwood. They want something elegant and sophisticated for professional office use.",
        ("vetiver", "sandalwood"),
    ),
    EvaluationScenario(
        "Woody sandalwood vetiver patchouli evening",
        "The user prefers a woody fragrance featuring sandalwood, vetiver and patchouli. They want something warm, sophisticated and luxurious for evening wear.",
        ("sandalwood", "vetiver", "patchouli"),
    ),

    # Fresh/citrus profiles: one, two, and three selected notes.
    EvaluationScenario(
        "Citrus bergamot energetic daily",
        "The user prefers a fresh citrus fragrance featuring bergamot. They want something energetic, uplifting and refreshing for everyday wear.",
        ("bergamot",),
    ),
    EvaluationScenario(
        "Fresh citrus bergamot musk daily",
        "The user prefers a fresh citrus fragrance featuring bergamot and musk. They want something clean and refreshing for everyday wear.",
        ("bergamot", "musk"),
    ),
    EvaluationScenario(
        "Fresh bergamot musk vetiver work",
        "The user prefers a fresh citrus fragrance featuring bergamot, musk and vetiver. They want something clean, uplifting and sophisticated for daytime office wear.",
        ("bergamot", "musk", "vetiver"),
    ),

    # Warm/spicy profiles: one, two, and three selected notes.
    EvaluationScenario(
        "Warm amber luxurious evening",
        "The user prefers a warm and spicy fragrance featuring amber. They want something warm, luxurious and sensual for evening wear.",
        ("amber",),
    ),
    EvaluationScenario(
        "Warm vanilla amber evening",
        "The user prefers a warm and spicy fragrance featuring vanilla and amber. They want something warm and luxurious for evening and nighttime wear.",
        ("vanilla", "amber"),
    ),
    EvaluationScenario(
        "Warm vanilla amber patchouli special",
        "The user prefers a warm and spicy fragrance featuring vanilla, amber and patchouli. They want something bold, sensual and luxurious for a special occasion.",
        ("vanilla", "amber", "patchouli"),
    ),

    # Clean/aquatic profiles: one, two, and three selected notes.
    EvaluationScenario(
        "Aquatic musk outdoors",
        "The user prefers an aquatic and clean fragrance featuring musk. They want something clean and refreshing for sport and outdoor activities.",
        ("musk",),
    ),
    EvaluationScenario(
        "Clean aquatic musk citrus sport",
        "The user prefers an aquatic and clean fragrance featuring musk and citrus. They want something energetic and refreshing for sport and outdoor activities.",
        ("musk", "citrus"),
    ),
    EvaluationScenario(
        "Aquatic citrus musk bergamot active",
        "The user prefers a fresh aquatic fragrance featuring citrus, musk and bergamot. They want something clean, energetic and uplifting for active everyday wear.",
        ("citrus", "musk", "bergamot"),
    ),

    # Sweet/comforting profiles: one, two, and three selected notes.
    EvaluationScenario(
        "Sweet vanilla comforting",
        "The user prefers a sweet fragrance featuring vanilla. They want something soft, comforting and cozy for everyday wear.",
        ("vanilla",),
    ),
    EvaluationScenario(
        "Sweet vanilla amber cozy",
        "The user prefers a sweet fragrance featuring vanilla and amber. They want something sweet, warm and cozy for evening wear.",
        ("vanilla", "amber"),
    ),
    EvaluationScenario(
        "Sweet vanilla amber sandalwood special",
        "The user prefers a sweet fragrance featuring vanilla, amber and sandalwood. They want something comforting, warm and luxurious for a special occasion.",
        ("vanilla", "amber", "sandalwood"),
    ),
)


def preferred_note_coverage(results: list[dict], preferred_notes: tuple[str, ...]) -> float:
    matched = {
        note
        for result in results
        for note in result.get("matched_notes", [])
    }
    return len(matched.intersection(preferred_notes)) / len(preferred_notes)


def baseline_overlap(results: list[dict], baseline_results: list[dict]) -> float:
    result_ids = {result["dataset_id"] for result in results}
    baseline_ids = {result["dataset_id"] for result in baseline_results}
    return len(result_ids.intersection(baseline_ids)) / TOP_K


def run_scenarios(semantic_weight: float, candidate_ids: list[int]) -> list[list[dict]]:
    return [
        recommender.recommend(
            user_text=scenario.semantic_profile,
            preferred_notes=list(scenario.preferred_notes),
            candidate_dataset_ids=candidate_ids,
            top_k=TOP_K,
            semantic_weight=semantic_weight,
        )
        for scenario in SCENARIOS
    ]


def calculate_metrics(
    scenario_results: list[list[dict]],
    baseline_results: list[list[dict]],
) -> dict[str, float]:
    semantic_scores = []
    note_scores = []
    note_coverages = []
    baseline_overlaps = []

    for scenario, results, baseline in zip(SCENARIOS, scenario_results, baseline_results, strict=True):
        if len(results) != TOP_K:
            raise RuntimeError(
                f"Scenario '{scenario.name}' returned {len(results)} results; expected {TOP_K}."
            )

        semantic_scores.append(mean(result["semantic_score"] for result in results))
        note_scores.append(mean(result["note_score"] for result in results))
        note_coverages.append(preferred_note_coverage(results, scenario.preferred_notes))
        baseline_overlaps.append(baseline_overlap(results, baseline))

    return {
        "mean_semantic_score_at_5": mean(semantic_scores),
        "mean_exact_note_score_at_5": mean(note_scores),
        "preferred_note_coverage_at_5": mean(note_coverages),
        "semantic_baseline_overlap_at_5": mean(baseline_overlaps),
    }


def main() -> None:
    # Constructed once and reused unchanged for every configuration.
    candidate_ids = list(range(len(recommender.perfumes)))
    baseline_results = run_scenarios(1.0, candidate_ids)

    print(
        f"Scenarios: {len(SCENARIOS)} | One-note: 6 | Two-note: 6 | Three-note: 6 "
        f"| Candidates per scenario: {len(candidate_ids)} | Top K: {TOP_K}"
    )
    print()
    print(
        f"{'Weight':>8}  {'Mean semantic@5':>17}  {'Mean exact-note@5':>18}  "
        f"{'Note coverage@5':>16}  {'Baseline overlap@5':>18}"
    )
    print("-" * 87)

    for semantic_weight in SEMANTIC_WEIGHTS:
        results = baseline_results if semantic_weight == 1.0 else run_scenarios(semantic_weight, candidate_ids)
        metrics = calculate_metrics(results, baseline_results)
        note_weight = 1.0 - semantic_weight
        weight_label = f"{round(semantic_weight * 100)}/{round(note_weight * 100)}"

        print(
            f"{weight_label:>8}  "
            f"{metrics['mean_semantic_score_at_5']:>17.6f}  "
            f"{metrics['mean_exact_note_score_at_5']:>18.6f}  "
            f"{metrics['preferred_note_coverage_at_5']:>16.6f}  "
            f"{metrics['semantic_baseline_overlap_at_5']:>18.6f}"
        )


if __name__ == "__main__":
    main()
