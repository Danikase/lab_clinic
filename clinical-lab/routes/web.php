<?php

use Illuminate\Support\Facades\Route;

// ✅ Catch-all para React: sirve la SPA para todo lo que NO sea /api/*
Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!api).*$');
