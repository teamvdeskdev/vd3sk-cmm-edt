<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Support\Facades\Log;
class PreflightResponse
{
    /**
    * Handle an incoming request.
    *
    * @param \Illuminate\Http\Request $request
    * @param \Closure $next
    * @return mixed
    */
    public function handle($request, Closure $next )
    {
        Log::debug('arriva');
        if ($request->getMethod() === "OPTIONS") {
            return response('');
        }
return $next($request);
     }
 }

