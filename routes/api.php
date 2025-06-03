<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\LabController;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\ItemUnitController;
use App\Http\Controllers\Api\ProductController;

Route::get('/ping', function () {
    return response()->json(['message' => 'pong']);
});

Route::apiResource('labs', LabController::class);
Route::apiResource('items', ItemController::class);
Route::apiResource('item-units', ItemUnitController::class);
Route::apiResource('products', ProductController::class);