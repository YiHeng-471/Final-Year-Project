import pandas as pd

DATA_PATH = "../data/raw/final_perfume_data.csv"

df = pd.read_csv(DATA_PATH, encoding='latin1')

print("Shape:")
print(df.shape)

print("\nColumns:")
print(df.columns.tolist())

print("\nFirst 5 rows:")
print(df.head())

print("\nMissing values:")
print(df.isnull().sum())

print("\nDuplicate rows:")
print(df.duplicated().sum())

print("\nData types:")
print(df.dtypes)