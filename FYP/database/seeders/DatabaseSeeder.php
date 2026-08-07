<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->call([
            // StateSeeder::class,
            SizeSeeder::class,
            PerfumeCategorySeeder::class,
            PerfumeItemSeeder::class,
            UserSeeder::class,
            StateSeeder::class,
        ]);
    }
}
