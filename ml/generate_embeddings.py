import pandas as pd
import numpy as np

from sentence_transformers import SentenceTransformer

INPUT_PATH = "../data/processed/perfume_clean.csv"

df = pd.read_csv(INPUT_PATH)

print("Loading model...")

model = SentenceTransformer(
    "sentence-transformers/all-MiniLM-L6-v2"
)

print("Generating embeddings...")

embeddings = model.encode(
    df["profile"].tolist(),
    show_progress_bar=True,
    normalize_embeddings=True
)

print("Embedding shape:")
print(embeddings.shape)

np.save(
    "../data/processed/perfumes_embeddings.npy",
    embeddings
)

print("Embeddings saved.")