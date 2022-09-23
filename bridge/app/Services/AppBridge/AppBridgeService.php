<?php
namespace App\Services\AppBridge;

use App\Services\CommonService;
use GuzzleHttp\Client;
use GuzzleHttp\Cookie;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use PHPUnit\Framework\Assert;

/**
 * Description of AppBridgeService
 *
 * @author raffr
 */
class AppBridgeService {
    //put your code here
    

    //get app  
    public function categories(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        return CommonService::simpleResponse($request,'index.php/settings/apps/categories?format='.$format, false); 
    }
  
    //get app  
    public function getapps(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        return CommonService::simpleResponse($request,'ocs/v1.php/cloud/apps?format='.$format, false); 
    }
    
    //get app  
    public function list(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        return CommonService::simpleResponse($request,'index.php/settings/apps/list?format='.$format, false); 
    }
    
    //get app info 
    public function getappinfo(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        return CommonService::simpleResponse($request, 'ocs/v1.php/cloud/apps/'.$request->input('appid').'?format='.$format, false); 
    }
    
    //post app enable
    public function enable(Request $request)
    {
       
         $body=$request->json()->all();
        return CommonService::simpleResponse($request,'index.php/settings/apps/enable',false,'POST',$body);
         
    }
    
    //get post disable  
    public function disable(Request $request)
    {
         $body=$request->json()->all();
        return CommonService::simpleResponse($request, 'index.php/settings/apps/disable',false,'POST',$body);
    }
    
    //get app navigation 
    public function navigation(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        return CommonService::simpleResponse($request, 'ocs/v2.php/core/navigation/apps?format='.$format, true); 
    }
    
    //get app  update
    public function update(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        return CommonService::simpleResponse($request, 'index.php/settings/apps/update/'.$request->input('appid').'?format='.$format, false); 
    }
    
    //get app  uninstall
    public function uninstall(Request $request)
    {
         $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        return CommonService::simpleResponse($request, 'index.php/settings/apps/uninstall/'.$request->input('appid').'?format='.$format, false); 
    }
}
