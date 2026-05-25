<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

/**
 * @method bool update(array $attributes)
 */
class UserController extends Controller
{
    // Obtener datos del usuario logueado
    public function profile()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        return response()->json($user);
    }

    // Actualizar información personal
    public function updateProfile(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
        ]);

        // ✅ IntelliSense: forzar tipo para reconocer update()
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        return response()->json(['message' => '✅ Perfil actualizado correctamente']);
    }

    // Cambiar contraseña
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Verificar contraseña actual
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'La contraseña actual es incorrecta'], 400);
        }

        // ✅ Actualizar contraseña
        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        return response()->json(['message' => '✅ Contraseña actualizada correctamente']);
    }
}
