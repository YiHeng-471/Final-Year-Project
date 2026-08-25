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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')
                ->constrained('orders')
                ->cascadeOnDelete();
            $table->foreignId('perfume_item_id')
                ->constrained('perfume_items');
            $table->foreignId('size_id')
                ->constrained('sizes');
            $table->integer('quantity');
            $table->decimal('unit_price');
            $table->string('product_name');
            $table->string('size_name');
            $table->unsignedBigInteger('source_cart_item_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
