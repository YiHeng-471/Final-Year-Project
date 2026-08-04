<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SizeSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('sizes')->insert([
            ['name' => '30ml', 'created_at' => now(), 'updated_at' => now()],
            ['name' => '50ml', 'created_at' => now(), 'updated_at' => now()],
            ['name' => '100ml', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}

