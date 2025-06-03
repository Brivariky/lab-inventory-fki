<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Item;

class ItemController extends Controller
{
    public function index()
    {
        $items = Item::with(['units', 'lab'])->get();

        return response()->json(
            $items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'description' => $item->description,
                    'quantity' => $item->units->count(),
                    'condition' => $item->units->first()->condition ?? 'Baik',
                    'lab' => $item->lab?->lab_name ?? 'Unknown',
                    'lab_id' => $item->lab_id, 
                    'units' => $item->units,
                    'createdAt' => strtotime($item->created_at),
                ];
            })
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'lab_id' => 'required|exists:labs,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'units' => 'required|array',
            'units.*.code' => 'nullable|string',
            'units.*.condition' => 'required|string',
        ]);

        // Buat item baru
        $item = Item::create([
            'lab_id' => $request->lab_id,
            'name' => $request->name,
            'description' => $request->description,
        ]);

        // Tambahkan units jika ada
        foreach ($request->units as $unit) {
            $item->units()->create([
                'code' => $unit['code'],
                'condition' => $unit['condition'],
            ]);
        }

        return response()->json($item->load('units'), 201);
    }

    public function show($id)
    {
        $item = Item::with(['units', 'lab'])->findOrFail($id);
        return response()->json($item);
    }

    public function update(Request $request, $id)
    {
        $item = Item::findOrFail($id);

        $request->validate([
            'lab_id' => 'sometimes|exists:labs,id',
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
        ]);

        $item->update([
            'lab_id' => $request->lab_id ?? $item->lab_id,
            'name' => $request->name ?? $item->name,
            'description' => $request->description ?? $item->description,
        ]);

        return response()->json($item);
    }

    public function destroy($id)
    {
        $item = Item::findOrFail($id);
        $item->delete();

        return response()->json(['message' => 'Item deleted']);
    }
}
