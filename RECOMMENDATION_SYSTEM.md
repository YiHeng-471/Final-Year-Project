# Essence recommendation system

## Architecture

The recommender is a hybrid content-based filtering system:

1. Laravel stores the questionnaire's structured answers and its reproducible `semantic_profile`.
2. Laravel applies shop constraints first: product availability and at least one size within the selected budget.
3. Laravel sends only eligible `dataset_id` values to FastAPI.
4. Python embeds the semantic profile with `all-MiniLM-L6-v2` and compares it with the existing normalized perfume embeddings.
5. Exact preferred-note coverage contributes 20% of the final score when notes were selected. Semantic similarity contributes 80%. If no notes were selected, semantic similarity contributes 100%.
6. Python returns ranked `dataset_id` values, component scores, matched notes, and an explanation.
7. Laravel resolves those IDs to shop products, sizes, prices, availability, and reviews.

Occasion, desired feeling, and scent character are not invented as perfume database labels. They remain semantic evidence. Budget is never sent to MiniLM.

## Stable dataset mapping

`perfume_items.dataset_id` is the zero-based row index of `data/processed/perfume_clean.csv` and the corresponding row in `data/processed/perfumes_embeddings.npy`.

The catalogue importer verifies the required CSV columns and assigns this ID while importing. All 2,191 cleaned rows are imported. The current prices are deterministic prototype data for academic/shop-flow testing; they are not asserted to be real market prices.

To rebuild the catalogue after a fresh migration:

```powershell
cd FYP
php artisan db:seed --class=PerfumeCategorySeeder
php artisan db:seed --class=SizeSeeder
php artisan db:seed --class=PerfumeItemSeeder
```

## Running the recommendation service

Use the project's Python environment with the packages in `ml/requirements.txt`, then run from the repository root:

```powershell
python -m uvicorn ml.api:app --host 127.0.0.1 --port 8001 --reload
```

Laravel defaults to `http://127.0.0.1:8001`. Override it with `ML_RECOMMENDATION_URL` if needed.

Health check:

```text
GET http://127.0.0.1:8001/health
```

Interactive API documentation is available at `http://127.0.0.1:8001/docs`.

## Evaluation

Run the reproducible engineering sanity benchmark:

```powershell
python ml/evaluate.py
```

It reports hit rate and mean reciprocal rank for a small set of expected-note queries. This confirms pipeline behavior but does not replace the FYP's final user evaluation. Reviews remain a shop feature and possible future feedback signal; they are not included in the current CBF score.
