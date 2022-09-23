<?php

namespace App\Repositories\Files;

use App\Entities\Files\File;
use App\Repositories\Files\FileRepository;


/**
* Register our Repository with Laravel
*/
class FileRepositoryServiceProvider extends ServiceProvider 
{
    /**
    * Registers the fileInterface with Laravels IoC Container
    * 
    */
    public function register()
    {
        // Bind the returned class to the namespace 'Repositories\FileInterface
        $this->app->bind('Repositories\Files\FileInterface', function($app)
        {
            return new FileRepository(new File());
        });
    }
}

