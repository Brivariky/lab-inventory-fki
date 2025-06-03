<?php
// app/Models/Product.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $fillable = ['lab_id', 'product_name', 'description'];

    public function lab()
    {
        return $this->belongsTo(Lab::class);
    }
}
