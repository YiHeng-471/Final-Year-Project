<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('perfume_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')
                ->constrained('perfume_categories');
            $table->string('name');
            $table->string('description');
            $table->string('image_url');
            $table->decimal('price');
            $table->enum('availability_status', [0, 1]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('perfume_items');
    }
};
