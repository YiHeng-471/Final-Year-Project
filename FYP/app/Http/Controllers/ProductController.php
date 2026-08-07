<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PerfumeItem;
use App\Models\PerfumeCategory;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = PerfumeItem::query()->with(['perfumeCategory', 'sizes']);

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%");
        }

        if ($request->has('category')) {
            $category = PerfumeCategory::where('name', $request->input('category'))->first();
            if ($category) {
                $query->where('category_id', $category->id);
            }
        }

        $perfumeItems = $query->get();

        return Inertia::render('ProductListing', [
            'auth' => ['user' => Auth::user()],
            'perfumeItems' => $perfumeItems,
        ]);
    }

    public function show($id)
    {
        $item = PerfumeItem::with(['perfumeCategory', 'sizes', 'perfumeReviews'])->findOrFail($id);

        return Inertia::render('ProductDetail', [
            'auth' => ['user' => Auth::user()],
            'product' => $item,
        ]);
    }
}
