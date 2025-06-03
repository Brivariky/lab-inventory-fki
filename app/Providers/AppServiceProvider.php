<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Hilangkan middleware 'api' karena tidak terdaftar
        Route::prefix('api')->group(base_path('routes/api.php'));

    }
}
