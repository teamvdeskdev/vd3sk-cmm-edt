<?php namespace App\Services\Files;

use Illuminate\Support\ServiceProvider;

/**
* Register our pokemon service with Laravel
*/
class FileServiceServiceProvider extends ServiceProvider 
{
    /**
    * Registers the service in the IoC Container
    * 
    */
    public function register()
    {
        // Binds 'fileService' to the result of the closure
        $this->app->bind('fileService', function($app)
        {
            return new FileService(
                // Inject in our class of fileInterface, this will be our repository
                $app->make('Repositories\Files\FileInterface')
            );
        });
    }
}

