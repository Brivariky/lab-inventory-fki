<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
 
    public function index()
        {
            $products = Product::with('lab')->get();

            return response()->json(
                $products->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'name' => $product->product_name,
                        'description' => $product->description,
                        'lab' => $product->lab?->lab_name ?? 'Unknown',
                        'lab_id' => $product->lab_id,
                        'createdAt' => strtotime($product->created_at),
                    ];
                })
            );
        }    

    public function show($id)
    {
        return Product::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'lab_id' => 'required|exists:labs,id',
            'product_name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $product = Product::create($validated);

        return response()->json($product, 201);
    }


    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'product_name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'lab_id' => 'sometimes|required|exists:labs,id'
        ]);

        $product->update($validated);
        return $product;
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Produk berhasil dihapus']);
    }
}
