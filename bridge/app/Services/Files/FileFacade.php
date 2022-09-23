<?php namespace App\Services\Files;

use \Illuminate\Support\Facades\Facade;

/**
* Facade class to be called whenever the class PokemonService is called
*/
class FileFacade extends Facade {

    /**
     * Get the registered name of the component. This tells $this->app what record to return
     * (e.g. $this->app[‘fileService’])
     *
     * @return string
     */
    protected static function getFacadeAccessor() { return 'fileService'; }

}