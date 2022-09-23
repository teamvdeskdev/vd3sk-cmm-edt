<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Closure;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Illuminate\Support\Facades\Log;
/**
 * ApiVersionMiddleware class
 *
 * @author    pvl
 */
class FileApiVersionMiddleware
{

    public function handle(Request $request, Closure $next)
    {
        // if ($request->getMethod() === "GET") {
            // foreach ($request->all() as $key => $value) {
            //   Log::debug("urlnotencoded ".request($key));
            
            //     $request[$key] =  str_replace('%2F','/',rawurlencode($value));
            //   Log::debug("urlencoded ".request($key));
            // }
        // }
      //  $data=$request->json()->all();
        // if (count($data) > 0)
        // {
        //     foreach ($data as $key => $value) {
        //     Log::debug("urlnotencoded ".$data[$key]);
          
        //       $data[$key] =  str_replace('%2F','/',rawurlencode($value));
        //     Log::debug("urlencoded ".$data[$key]);
        //   }
        // }
          
       
        return $next($request);
    }
}