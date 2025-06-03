<?php
// app/Models/Lab.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lab extends Model
{
    protected $fillable = ['lab_name'];

    public function items()
    {
        return $this->hasMany(Item::class, 'lab_id');
    }


    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}

