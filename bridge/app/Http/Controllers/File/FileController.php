<?php

namespace App\Http\Controllers\File;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Files\FileFacade;

class FileController extends Controller
{
    private $clientInterface;
    
    public function __construct(FileClientInterface $clientInterface) {
        $this->clientInterface = $clientInterface;
    }
    
     public function file($x,Request $request)
    {
        try
        {
            
            $results=FileFacade::getFacadeAccessor();
            return Response::json(['data'=>$results['data'],'message'=>"Success"],200);
        } 
        catch (Exception $ex) {
            return Response::json(['data'=>[],'message'=>sprintf("Error %s",$ex->getMessage())],400);
        }

    }
    
    public function thumbnail($x,$y,$file,Request $request)
    {
        try
        {
            $results=$this->clientInterface->thumbnail($x,$y,$file);
            return Response::json(['data'=>$results['data'],'message'=>"Success"],200);
        } 
        catch (Exception $ex) {
            return Response::json(['data'=>[],'message'=>sprintf("Error %s",$ex->getMessage())],400);
        }

    }
}
