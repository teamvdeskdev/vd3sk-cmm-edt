<?php namespace App\Services\Files;

use App\Repositories\Files\FileInterface;

/**
* Our FileService, containing all useful methods for business logic around File
*/
class FileService
{
    // Containing our pokemonRepository to make all our database calls to
    protected $fileRepo;
    
    /**
    * Loads our $fileRepo with the actual Repo associated with our fileInterface
    * 
    * @param fileInterface $fileRepo
    * @return FileService
    */
    public function __construct(FileInterface $fileRepo)
    {
        $this->fileRepo = $fileRepo;
    }

    /**
    * Method to get pokemon based either on name or ID
    * 
    * @param mixed $file
    * @return string
    */
    public function getFile($file)
    {
        // If file variable is numeric, assume ID
        if (is_numeric($file))
        {
            // Get file based on ID
            $file = $this->fileRepo->getFileById($file);
        }
        else 
        {
            // Since not numeric, lets try get the pokemon based on Name
            $file = $this->fileRepo->getFileByName($file);
        }
        
        // If Eloquent Object returned (rather than null) return the name of the file
        if ($file != null)
        {
            return $file->name;
        }

        // If nothing found, return this simple string
        return 'File Not Found';
    }
}