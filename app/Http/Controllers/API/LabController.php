<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lab;
use Illuminate\Http\Request;

class LabController extends Controller
{
    public function index()
    {
        return Lab::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string',
        ]);

        $lab = Lab::create($request->all());
        return response()->json($lab, 201);
    }

    public function show(Lab $lab)
    {
        return $lab;
    }

    public function update(Request $request, Lab $lab)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'location' => 'nullable|string',
        ]);

        $lab->update($request->all());
        return response()->json($lab);
    }

    public function destroy(Lab $lab)
    {
        $lab->delete();
        return response()->json(null, 204);
    }
}
