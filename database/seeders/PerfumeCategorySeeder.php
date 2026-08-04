<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PerfumeCategorySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('perfume_categories')->insert([
            ['name' => 'Floral', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Woody', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Fresh', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
