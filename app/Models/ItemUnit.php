<?php
// app/Models/ItemUnit.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItemUnit extends Model
{
    protected $fillable = ['item_id', 'unit_code', 'condition'];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

}
