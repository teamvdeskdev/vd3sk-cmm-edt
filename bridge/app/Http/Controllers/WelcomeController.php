<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class WelcomeController extends Controller
{
    public function index()
    {
//            $streamService=new \App\Services\FilesBridge\FileBridgeService();
//            $request=new Request;
//            $streambuffer=new \GuzzleHttp\Psr7\BufferStream();
//            $tempFile = tempnam(sys_get_temp_dir(), 'File_').'.txt';   
//            $tempFile1 = tempnam(sys_get_temp_dir(), 'File_').'.mp4'; 
//            $request->headers->add(['Authorization' => 'Basic cmFmZmFlbGU6T2NjaWhjNzI/']);
//            $request->attributes->add(['uri'=> 'mio.mp4','filename'=>'mio.mp4','saveAs'=>'mio.mp4']);
//            $tempFile12=$streamService->download($request);
//            var_dump($tempFile12);
//            file_put_contents($tempFile1, $tempFile12);
        return view('welcome') ;
    }
}
