"""Small reproducible offline sanity benchmark for the CBF pipeline.

This is an engineering evaluation, not a replacement for the final user study.
It reports whether a perfume containing an expected note appears in the top K.
"""

from recommend import normalize_text, recommender


CASES = [
    ("A bright fresh citrus fragrance for everyday use", ["bergamot"], "bergamot"),
    ("A warm sweet comforting fragrance for evenings", ["vanilla"], "vanilla"),
    ("An earthy woody sophisticated office fragrance", ["vetiver"], "vetiver"),
    ("A romantic elegant floral fragrance", ["rose", "jasmine"], "rose"),
    ("A bold warm luxurious nighttime fragrance", ["oud", "amber"], "oud"),
]


def main(top_k: int = 10) -> None:
    reciprocal_ranks = []
    hits = 0

    for profile, notes, expected in CASES:
        results = recommender.recommend(profile, notes, top_k=top_k)
        rank = next(
            (
                index
                for index, result in enumerate(results, start=1)
                if normalize_text(expected) in normalize_text(result["notes"])
            ),
            None,
        )
        hits += int(rank is not None)
        reciprocal_ranks.append(1 / rank if rank else 0)
        print(f"expected={expected:<10} rank={rank or '-'} top={results[0]['name']}")

    print(f"hit_rate@{top_k}={hits / len(CASES):.3f}")
    print(f"mrr@{top_k}={sum(reciprocal_ranks) / len(CASES):.3f}")


if __name__ == "__main__":
    main()
