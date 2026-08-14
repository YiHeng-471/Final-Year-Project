<?php

namespace App\Http\Controllers;

use App\Models\PerfumeCategory;
use App\Models\PerfumeItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'sort' => ['nullable', 'in:name,price-low,price-high,rating'],
        ]);

        $query = PerfumeItem::query()
            ->select([
                'id',
                'dataset_id',
                'category_id',
                'brand',
                'name',
                'description',
                'scent_notes',
                'image_url',
                'availability_status',
            ])
            ->addSelect([
                'minimum_price' => DB::table('perfume_item_sizes')
                    ->selectRaw('MIN(price)')
                    ->whereColumn('perfume_item_id', 'perfume_items.id'),
            ])
            ->with(['sizes:id,name'])
            ->withAvg('perfumeReviews as average_rating', 'rating')
            ->withCount('perfumeReviews')
            ->where('availability_status', true);

        if (! empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($query) use ($search): void {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%");
            });
        }

        if ($request->has('category')) {
            $category = PerfumeCategory::where('name', $request->input('category'))->first();
            if ($category) {
                $query->where('category_id', $category->id);
            }
        }

        match ($validated['sort'] ?? 'name') {
            'price-low' => $query->orderBy('minimum_price'),
            'price-high' => $query->orderByDesc('minimum_price'),
            'rating' => $query->orderByDesc('average_rating')->orderBy('name'),
            default => $query->orderBy('name'),
        };

        $perfumeItems = $query->paginate(24)->withQueryString();

        return Inertia::render('ProductListing', [
            'perfumeItems' => $perfumeItems,
            'filters' => [
                'search' => $validated['search'] ?? '',
                'sort' => $validated['sort'] ?? 'name',
            ],
        ]);
    }

    public function show($id)
    {
        $item = PerfumeItem::with(['perfumeCategory', 'sizes', 'perfumeReviews'])->findOrFail($id);

        return Inertia::render('ProductDetail', [
            'product' => $item,
        ]);
    }
}
