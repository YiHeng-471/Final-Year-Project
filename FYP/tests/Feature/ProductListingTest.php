<?php

namespace Tests\Feature;

use App\Models\PerfumeCategory;
use App\Models\PerfumeItem;
use App\Models\Size;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductListingTest extends TestCase
{
    use RefreshDatabase;

    public function test_catalogue_is_paginated_and_searchable(): void
    {
        $category = PerfumeCategory::create(['name' => 'Uncategorised']);
        $size = Size::create(['name' => '30ml']);

        foreach (range(1, 30) as $datasetId) {
            $product = PerfumeItem::create([
                'dataset_id' => $datasetId,
                'category_id' => $category->id,
                'brand' => $datasetId === 30 ? 'Special House' : 'Test House',
                'name' => $datasetId === 30 ? 'Unique Bergamot' : "Perfume {$datasetId}",
                'description' => 'A perfume used to verify catalogue pagination.',
                'scent_notes' => 'Bergamot, musk',
                'image_url' => '',
                'availability_status' => true,
            ]);
            $product->sizes()->attach($size, ['price' => 100 + $datasetId]);
        }

        $this->get('/products')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('ProductListing')
                ->has('perfumeItems.data', 24)
                ->where('perfumeItems.total', 30)
                ->where('perfumeItems.last_page', 2)
            );

        $this->get('/products?search=Special')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('perfumeItems.data', 1)
                ->where('perfumeItems.data.0.name', 'Unique Bergamot')
                ->where('filters.search', 'Special')
            );
    }
}
