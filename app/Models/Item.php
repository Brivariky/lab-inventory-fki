<?php
// app/Models/Item.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Item extends Model
{
    protected $fillable = ['lab_id', 'name', 'description', 'condition'];

    public function lab()
    {
        return $this->belongsTo(Lab::class, 'lab_id');
    }


    // app/Models/ItemUnit.php

    public function item()
    {
        return $this->belongsTo(Item::class);
    }


    public function units()
    {
        return $this->hasMany(ItemUnit::class, 'item_id');
    }


}
