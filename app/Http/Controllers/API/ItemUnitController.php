<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ItemUnit;
use Illuminate\Http\Request;

class ItemUnitController extends Controller
{
    public function index()
    {
        return response()->json(ItemUnit::all());
    }

public function store(Request $request)
{
    $validated = $request->validate([
        'item_id' => 'required|exists:items,id',
        'code' => 'nullable|array',
        'code.*' => 'nullable|string|max:50',
        'condition' => 'required|string|in:Baik,Rusak',
    ]);

    $units = [];

    foreach ($validated['code'] as $unitCode) {
        $units[] = [
            'item_id' => $validated['item_id'],
            'code' => $unitCode,
            'condition' => $validated['condition'],
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    ItemUnit::insert($units);

    return response()->json(['message' => 'Units added successfully'], 201);
}


    public function show($id)
    {
        $unit = ItemUnit::find($id);
        if (!$unit) {
            return response()->json(['message' => 'ItemUnit not found'], 404);
        }
        return response()->json($unit);
    }

    public function update(Request $request, $id)
    {
        $unit = ItemUnit::find($id);
        if (!$unit) {
            return response()->json(['message' => 'ItemUnit not found'], 404);
        }

        $validated = $request->validate([
            'code' => 'sometimes|string|max:50',
            'condition' => 'sometimes|string|in:Baik,Rusak',
        ]);

        $unit->update($validated);
        return response()->json($unit);
    }

    public function destroy($id)
    {
        $unit = ItemUnit::find($id);
        if (!$unit) {
            return response()->json(['message' => 'ItemUnit not found'], 404);
        }

        $unit->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
