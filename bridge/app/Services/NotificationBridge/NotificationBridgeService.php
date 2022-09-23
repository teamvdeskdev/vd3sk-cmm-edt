<?php

namespace App\Services\NotificationBridge;

use App\Services\CommonService;
use GuzzleHttp\Client;
use GuzzleHttp\Cookie;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use PHPUnit\Framework\Assert;

class NotificationBridgeService {
    
    //get capabilities
    public function capabilities(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        return CommonService::simpleResponse($request, 'ocs/v2.php/cloud/capabilities?format='.$format, true); 
    }
    
    //get notifications
    public function notifications(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $res=CommonService::simpleResponse($request, 'ocs/v2.php/apps/notifications/api/v2/notifications?format='.$format, true); 
        $res->setContent(str_replace('\/index.php\/settings\/user\/security', '/settings/authentication', $res->content()));
        $res->setContent(str_replace(env('HOST_DRIVE'), env('DOMAIN_IP_VDESK'), $res->content()));
        return $res;
    }
   
    //get single notification
    public function getnotification(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/notifications/api/v2/notifications/'.$request->input('id').'?format='.$format, true); 
    }
  
    //deleting single notification
    public function deletenotification(Request $request)
    {
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/notifications/api/v2/notifications/'.$request->input('id'), true,'DELETE'); 
    }
    
    //deleting single notification
    public function deleteallnotification(Request $request)
    {
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/notifications/api/v2/notifications', true,'DELETE'); 
    }
    
    public function createnotification(Request $request)
    {
        Log::debug("casas");
        
        $body=$request->json()->all();
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/admin_notifications/api/v1/notifications/'.$body['userId'],true,'POST',$body);   
    }
}
