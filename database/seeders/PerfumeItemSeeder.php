<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PerfumeItemSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $items = [
            [
                'category_id' => 1,
                'name' => 'Midnight Rose',
                'description' => 'A captivating rose-based scent.',
                'image_url' => '',
                'scent-notes' => 'Bulgarian Rose,Bergamot,Amber',
                'tags' => 'women,floral',
                'availability_status' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'category_id' => 3,
                'name' => 'Ocean Breeze',
                'description' => 'Fresh aquatic scent.',
                'image_url' => '',
                'scent-notes' => 'Sea Salt,Citrus,Musk',
                'tags' => 'men,fresh',
                'availability_status' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('perfume_items')->insert($items);

        // attach sizes with prices
        $perfume1 = DB::table('perfume_items')->where('name', 'Midnight Rose')->first();
        $perfume2 = DB::table('perfume_items')->where('name', 'Ocean Breeze')->first();

        $sizes = DB::table('sizes')->get();

        foreach ($sizes as $size) {
            DB::table('perfume_item_sizes')->insert([
                ['perfume_item_id' => $perfume1->id, 'size_id' => $size->id, 'price' => 129 + ($size->id * 50), 'created_at' => $now, 'updated_at' => $now],
                ['perfume_item_id' => $perfume2->id, 'size_id' => $size->id, 'price' => 89 + ($size->id * 40), 'created_at' => $now, 'updated_at' => $now],
            ]);
        }
    }
}
