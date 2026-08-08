import pandas as pd
import numpy as np

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

DATA_PATH = "../data/processed/perfume_clean.csv"
EMBEDDINGS_PATH = "../data/processed/perfumes_embeddings.npy"

df = pd.read_csv(DATA_PATH)

embeddings = np.load(EMBEDDINGS_PATH)

model = SentenceTransformer(
    "sentence-transformers/all-MiniLM-L6-v2"
)


def recommend(user_text, top_k=5):

    user_embedding = model.encode(
        [user_text],
        normalize_embeddings=True
    )

    similarities = cosine_similarity(
        user_embedding,
        embeddings
    )[0]

    top_indices = np.argsort(
        similarities
    )[::-1][:top_k]

    results = []

    for index in top_indices:

        results.append({
            "name": df.iloc[index]["name"],
            "brand": df.iloc[index]["brand"],
            "description": df.iloc[index]["description"],
            "notes": df.iloc[index]["notes"],
            "image_url": df.iloc[index]["image_url"],
            "similarity": float(similarities[index])
        })

    return results


if __name__ == "__main__":

    user_text = """
    I want a fresh citrus perfume with bergamot
    that is suitable for everyday use.
    """

    results = recommend(user_text)

    for result in results:
        print(
            result["name"],
            result["brand"],
            result["similarity"]
        )