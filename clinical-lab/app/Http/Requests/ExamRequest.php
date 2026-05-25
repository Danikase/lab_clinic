<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ExamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $examId = $this->route('exam')?->id;

        return [
            'name' => 'required|string|max:150',
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('exams')->ignore($examId)
            ],
            'category' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'fields' => 'nullable|array',
            'fields.*.field_name' => 'required|string|max:100',
            'fields.*.field_type' => 'required|in:text,number,select,boolean,range',
            'fields.*.unit' => 'nullable|string|max:50',
            'fields.*.ref_min' => 'nullable|string|max:50',
            'fields.*.ref_max' => 'nullable|string|max:50',
            'fields.*.options' => 'nullable|array',
            'fields.*.is_required' => 'boolean',
            'fields.*.sort_order' => 'integer',
        ];
    }
}
