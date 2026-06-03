<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamField extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_id',
        'field_name',
        'field_type',
        'unit',
        'ref_min',
        'ref_max',
        'options',
        'is_required',
        'is_reference',
        'sort_order',
    ];

    protected $casts = [
        'options' => 'array',
        'is_required' => 'boolean',
        'is_reference' => 'boolean',
    ];

    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }
}
