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
        Schema::create('perfume_item_sizes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('perfume_item_id')
                ->constrained('perfume_items')
                ->cascadeOnDelete();

            $table->foreignId('size_id')
                ->constrained('sizes')
                ->cascadeOnDelete();

            $table->decimal('price');
            $table->timestamps();

            $table->unique(['perfume_item_id', 'size_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('perfume_item_sizes');
    }
};
