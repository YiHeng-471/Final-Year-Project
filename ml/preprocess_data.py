import pandas as pd
import re

INPUT_PATH = "../data/raw/final_perfume_data.csv"
OUTPUT_PATH = "../data/processed/perfume_clean.csv"

df = pd.read_csv(INPUT_PATH, encoding='latin1')

print("Original shape:", df.shape)

# Standardize column names
df.columns = [
    "name",
    "brand",
    "description",
    "notes",
    "image_url"
]

# Convert text columns to strings
text_columns = [
    "name",
    "brand",
    "description",
    "notes",
    "image_url"
]

for col in text_columns:
    df[col] = df[col].fillna("").astype(str).str.strip()

# Remove rows with no useful text
df = df[
    (df["name"] != "") &
    (
        (df["description"] != "") |
        (df["notes"] != "")
    )
]

# Remove duplicate perfumes
df = df.drop_duplicates(
    subset=["name", "brand"],
    keep="first"
)

def create_profile(row):
    return (
        f"Perfume: {row['name']}. "
        f"Brand: {row['brand']}. "
        f"Description: {row['description']}. "
        f"Fragrance notes: {row['notes']}."
    )

df["profile"] = df.apply(create_profile, axis=1)

def clean_text(text):
    text = str(text).strip()
    text = re.sub(r"\s+", " ", text)
    return text

df["profile"] = df["profile"].apply(clean_text)

print("After cleaning:", df.shape)

df.to_csv(
    OUTPUT_PATH,
    index=False,
    encoding="utf-8"
)

print("Saved:", OUTPUT_PATH)