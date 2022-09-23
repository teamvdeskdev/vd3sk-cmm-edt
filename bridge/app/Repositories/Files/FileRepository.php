<?php
namespace App\Repositories\Files;

use Illuminate\Database\Eloquent\Model;
use \stdClass;
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class FileRepository implements Fileinterface
{
    protected $fileModel;
    
    public function __construct(Model $file) {
        $this->fileModel =$fileModel;
    }
    
    public function getFileById($fileId)
    {
        return $this->convertFormat($this->fileModel->find($fileId));
    }
    
    public function getFileByName($fileName)
    {
        // Search by name
        $file = $this->fileModel->where('name', strtolower($fileName));
        
        if ($file) 
        {
            // Return first found row
            return $this->convertFormat($file->first());
        }
        return null;
    }
    
     protected function convertFormat($file)
    {
        if ($file == null)
        {
            return null;
        }
        $object = new stdClass();
        $object->id = $file->id;
        $object->name = $file->name;
        
        return $object;
    }
}
