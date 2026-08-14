<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\PerfumeReview;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    // store review
    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'perfume_item_id' => 'required|exists:perfume_items,id',
            'content' => 'required|string',
            'rating' => 'required|integer|between:1,5',
        ]);

        $order = Order::with('orderItems')->findOrFail($request->order_id);

        // only able to review within 7 days after order is completed
        if ($order->created_at->diffInDays(now()) > 7) {
            return redirect()->back()->with('error', 'Review period has expired.');
        }

        // pending order cannot be reviewed
        if (strtolower($order->order_status) === 'pending') {
            return redirect()->back()->with('error', 'You cannot review a pending order.');
        }

        PerfumeReview::create([
            'user_id' => $order->user_id,
            'order_id' => $order->id,
            'perfume_item_id' => $request->perfume_item_id,
            'content' => $request->content,
            'rating' => $request->rating,
        ]);

        return redirect()->back()->with('success', 'Review submitted successfully!');
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'edit_review_id' => 'required|exists:perfume_reviews,id',
            'edit_review_content' => 'required|string',
            'edit_review_rating' => 'required|integer|between:1,5',
        ]);

        $affectedRows = PerfumeReview::where('id', $validated['edit_review_id'])
            ->update([
                'content' => $validated['edit_review_content'],
                'rating' => $validated['edit_review_rating'],
            ]);

        if ($affectedRows === 0) {
            return redirect()->back()->with('error', 'Review not found or no changes made.');
        }

        return redirect()->back()->with('success', 'Review updated successfully!');
    }

    public function delete(PerfumeReview $review)
    {
        if (! $review) {
            return redirect()->back()->with('error', 'Review not found for deletion.');
        }

        $review->delete();

        return redirect()->back()->with('success', 'Review deleted successfully!');
    }
}
