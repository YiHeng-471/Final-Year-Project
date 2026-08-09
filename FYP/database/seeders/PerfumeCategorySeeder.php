<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PerfumeCategorySeeder extends Seeder
{
    public function run(): void
    {
        foreach (['Uncategorised', 'Floral', 'Woody', 'Fresh'] as $name) {
            DB::table('perfume_categories')->updateOrInsert(
                ['name' => $name],
                ['created_at' => now(), 'updated_at' => now()]
            );
        }
    }
}
