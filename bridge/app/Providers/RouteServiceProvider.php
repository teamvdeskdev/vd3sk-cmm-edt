<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * This namespace is applied to your controller routes.
     *
     * In addition, it is set as the URL generator's root namespace.
     *
     * @var string
     */
    protected $namespace = 'App\Http\Controllers';

    protected $namespaceAPI = 'App\Services';
    /**
     * The path to the "home" route for your application.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        //

        parent::boot();
    }

    /**
     * Define the routes for the application.
     *
     * @return void
     */
    public function map()
    {
        //$this->mapApiRoutes();

        $this->mapWebRoutes();

        //$this->mapFileApiRoutes();
        $this->mapLoginBridgeApiRoutes();

        $this->mapFileBridgeApiRoutes();

        $this->mapActivityBridgeApiRoutes();

        $this->mapNotificationBridgeApiRoutes();

        $this->mapUserBridgeApiRoutes();

        $this->mapMailBridgeApiRoutes();

        $this->mapSettingBridgeApiRoutes();

        $this-> mapLoginV2BridgeBridgeApiRoutes();

    }

    /**
     * Define the "web" routes for the application.
     *
     * These routes all receive session state, CSRF protection, etc.
     *
     * @return void
     */
    protected function mapWebRoutes()
    {
        Route::middleware('web')
            ->namespace($this->namespace)
            ->group(base_path('routes/web.php'));
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiRoutes()
    {
        Route::prefix('api/v1')
            ->middleware('api')
            ->namespace($this->namespaceAPI)
            ->group(base_path('routes/api.php'));
    }

    protected function mapFileApiRoutes()
    {
        Route::prefix('api/v1')
            ->middleware('api')
            ->namespace($this->namespaceAPI)
            ->group(base_path('routes/FileApi.php'));
    }

    protected function mapLoginBridgeApiRoutes()
    {

        Route::prefix('api/v1')
            ->middleware('api')
            ->namespace($this->namespaceAPI)
            ->group(base_path('routes/LoginBridgeApi.php'));
    }

    protected function mapFileBridgeApiRoutes()
    {

        Route::prefix('api/v1')
            ->middleware('fileapi')
            ->namespace($this->namespaceAPI)
            ->group(base_path('routes/FileBridgeApi.php'));
    }

    protected function mapActivityBridgeApiRoutes()
    {

        Route::prefix('api/v1/activity')
            ->middleware('api')
            ->namespace($this->namespaceAPI)
            ->group(base_path('routes/ActivityBridgeApi.php'));
    }

    protected function mapNotificationBridgeApiRoutes()
    {

        Route::prefix('api/v1/notification')
            ->middleware('api')
            ->namespace($this->namespaceAPI)
            ->group(base_path('routes/NotificationBridgeApi.php'));
    }

    protected function mapUserBridgeApiRoutes()
    {

        Route::prefix('api/v1/user')
            ->middleware('api')
            ->namespace($this->namespaceAPI)
            ->group(base_path('routes/UserBridgeApi.php'));
    }

    protected function mapMailBridgeApiRoutes()
    {

        Route::prefix('api/v1/mail')
            ->middleware('api')
            ->namespace($this->namespaceAPI)
            ->group(base_path('routes/MailBridgeApi.php'));
    }

    

    protected function mapSettingBridgeApiRoutes()
    {

        Route::prefix('api/v1/setting')
            ->middleware('api')
            ->namespace($this->namespaceAPI)
            ->group(base_path('routes/SettingBridgeApi.php'));
    }

    

    

    

     


    

    

    protected function mapLoginV2BridgeBridgeApiRoutes()
    {

        Route::prefix('api/v1/login/v2')
        ->middleware('api')
        ->namespace($this->namespaceAPI)
        ->group(base_path('routes/LoginV2BridgeApi.php'));
    } 
    
    
    
    

    

}
