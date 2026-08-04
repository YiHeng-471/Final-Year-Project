<?php

namespace Database\Seeders;

use App\Models\State;
use Illuminate\Database\Seeder;

class StateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $states = [
            ['name' => 'Johor'],
            ['name' => 'Kedah'],
            ['name' => 'Kelantan'],
            ['name' => 'Melaka'],
            ['name' => 'Negeri Sembilan'],
            ['name' => 'Pahang'],
            ['name' => 'Perak'],
            ['name' => 'Perlis'],
            ['name' => 'Pulau Pinang'],
            ['name' => 'Sabah'],
            ['name' => 'Sarawak'],
            ['name' => 'Selangor'],
            ['name' => 'Terengganu'],
            ['name' => 'Kuala Lumpur'],
            ['name' => 'Labuan'],
            ['name' => 'Putrajaya']
        ];

        foreach ($states as $state) {
            State::create($state);
        }
    }
}
