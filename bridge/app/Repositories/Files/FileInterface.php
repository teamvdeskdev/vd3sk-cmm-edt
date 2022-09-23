<?php
namespace App\Repositories\Files;
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author raffr
 */
interface FileInterface {
    //put your code here
    public function getFileById($fileId);
    
    public function getFileByName($fileName);
    
}
