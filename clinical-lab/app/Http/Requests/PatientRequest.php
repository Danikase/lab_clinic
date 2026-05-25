<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $patientId = $this->route('patient')?->id;

        return [
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'dui' => [
                'required',
                'string',
                'max:15',
                Rule::unique('patients')->ignore($patientId)
            ],
            'birth_date' => 'nullable|date|before:today',
            'gender' => 'nullable|in:M,F,O',
            'phone' => 'nullable|string|max:20',
            'email' => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('patients')->ignore($patientId)
            ],
            'address' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'dui.unique' => 'El DUI ya está registrado en el sistema.',
            'email.unique' => 'El correo electrónico ya está registrado.',
        ];
    }
}
