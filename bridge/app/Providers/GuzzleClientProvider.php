<?php

namespace App\Providers;

use GuzzleHttp\Client;
use Illuminate\Support\ServiceProvider;

class GuzzleClientProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind('\App\Interfaces\ClientInterface',function($app){
            $config = [
                'base_url'          => env('API_CLIENT_URL'),
                'timeout'           => 0,
                'allow_redirects'   => false,
                'verify'            => false,
                'headers'           => ['Content-Type' => 'application/json']
            ];
            $client = new Client($config);
            return $client;
        });
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
