<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use SplFileObject;

class PerfumeItemSeeder extends Seeder
{
    private const PRODUCT_CHUNK_SIZE = 250;
    private const EXPECTED_PRODUCT_COUNT = 2191;
    private const EXPECTED_PRICE_COUNT = 6573;
    private const REQUIRED_SIZES = ['30ml', '50ml', '100ml'];

    public function run(): void
    {
        $path = base_path('../data/processed/perfume_clean.csv');

        if (! is_file($path)) {
            throw new RuntimeException("Clean perfume dataset not found at {$path}");
        }

        $categoryId = DB::table('perfume_categories')
            ->where('name', 'Uncategorised')
            ->value('id');

        if (! $categoryId) {
            throw new RuntimeException('Run PerfumeCategorySeeder before PerfumeItemSeeder.');
        }

        $rows = $this->readDataset($path, $categoryId);

        DB::transaction(function () use ($rows): void {
            DB::table('perfume_items')
                ->whereNotNull('dataset_id')
                ->where('dataset_id', '>=', count($rows))
                ->delete();

            foreach (array_chunk($rows, self::PRODUCT_CHUNK_SIZE) as $chunk) {
                DB::table('perfume_items')->upsert(
                    $chunk,
                    ['dataset_id'],
                    ['category_id', 'brand', 'name', 'description', 'scent_notes', 'image_url', 'availability_status', 'updated_at']
                );
            }

            $this->assertImportedProducts();
            $this->seedPrototypePrices();
        });

        $this->command?->info(count($rows).' perfumes imported with stable dataset IDs and prototype prices.');
    }

    private function readDataset(string $path, int $categoryId): array
    {
        $file = new SplFileObject($path);
        $file->setFlags(SplFileObject::READ_CSV | SplFileObject::SKIP_EMPTY);
        $headers = $file->fgetcsv();
        $columns = array_flip($headers);
        $required = ['name', 'brand', 'description', 'notes', 'image_url'];

        foreach ($required as $column) {
            if (! array_key_exists($column, $columns)) {
                throw new RuntimeException("Dataset column '{$column}' is missing.");
            }
        }

        $now = now();
        $items = [];
        $datasetId = 0;

        while (! $file->eof()) {
            $row = $file->fgetcsv();

            if ($row === false || $row === [null]) {
                continue;
            }

            $line = $file->key() + 1;

            if (! is_array($row) || count($row) !== count($headers)) {
                throw new RuntimeException("Malformed cleaned-dataset row at CSV line {$line}: expected ".count($headers).' columns.');
            }

            $name = trim((string) ($row[$columns['name']] ?? ''));
            $brand = trim((string) ($row[$columns['brand']] ?? ''));
            $description = trim((string) ($row[$columns['description']] ?? ''));
            $notes = trim((string) ($row[$columns['notes']] ?? ''));

            if ($name === '' || $brand === '' || ($description === '' && $notes === '')) {
                throw new RuntimeException("Malformed cleaned-dataset row at CSV line {$line}: name, brand, and useful fragrance text are required.");
            }

            $items[] = [
                'dataset_id' => $datasetId,
                'category_id' => $categoryId,
                'brand' => $brand,
                'name' => $name,
                'description' => $description,
                'scent_notes' => $notes,
                'tags' => null,
                'image_url' => trim((string) $row[$columns['image_url']]),
                'availability_status' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ];

            $datasetId++;
        }

        $datasetIds = array_column($items, 'dataset_id');

        if (count($items) !== self::EXPECTED_PRODUCT_COUNT || $datasetIds !== range(0, self::EXPECTED_PRODUCT_COUNT - 1)) {
            throw new RuntimeException('Clean dataset invariant failed: expected exactly 2,191 sequential dataset IDs from 0 through 2190.');
        }

        return $items;
    }

    private function assertImportedProducts(): void
    {
        $query = DB::table('perfume_items')->whereNotNull('dataset_id');

        if (
            $query->count() !== self::EXPECTED_PRODUCT_COUNT
            || (int) $query->min('dataset_id') !== 0
            || (int) $query->max('dataset_id') !== self::EXPECTED_PRODUCT_COUNT - 1
            || $query->distinct()->count('dataset_id') !== self::EXPECTED_PRODUCT_COUNT
        ) {
            throw new RuntimeException('Catalogue import invariant failed: database must contain exactly dataset_id 0 through 2190 once each.');
        }
    }

    private function seedPrototypePrices(): void
    {
        $sizes = DB::table('sizes')->pluck('id', 'name');
        $missingSizes = array_values(array_diff(self::REQUIRED_SIZES, $sizes->keys()->all()));

        if ($missingSizes !== []) {
            throw new RuntimeException('Cannot seed prototype prices; missing required sizes: '.implode(', ', $missingSizes).'.');
        }

        $products = DB::table('perfume_items')
            ->whereNotNull('dataset_id')
            ->select(['id', 'dataset_id'])
            ->orderBy('dataset_id')
            ->get();
        $now = now();

        foreach ($products->chunk(self::PRODUCT_CHUNK_SIZE) as $productsChunk) {
            $prices = [];

            foreach ($productsChunk as $product) {
                $basePrice = 69 + (($product->dataset_id * 37) % 500);

                foreach (['30ml' => 0, '50ml' => 80, '100ml' => 200] as $sizeName => $supplement) {
                    $prices[] = [
                        'perfume_item_id' => $product->id,
                        'size_id' => $sizes[$sizeName],
                        'price' => $basePrice + $supplement,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
            }

            DB::table('perfume_item_sizes')->upsert(
                $prices,
                ['perfume_item_id', 'size_id'],
                ['price', 'updated_at']
            );
        }

        $priceCount = DB::table('perfume_item_sizes')
            ->whereIn('perfume_item_id', $products->pluck('id'))
            ->count();

        if ($priceCount !== self::EXPECTED_PRICE_COUNT) {
            throw new RuntimeException("Prototype price invariant failed: expected exactly 6,573 records, found {$priceCount}.");
        }
    }
}
