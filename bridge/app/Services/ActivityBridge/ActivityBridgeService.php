<?php
namespace App\Services\ActivityBridge;

use App\Services\CommonService;
use GuzzleHttp\Client;
use GuzzleHttp\Cookie;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use PHPUnit\Framework\Assert;

/**
 * Description of ActivityBridgeService
 *
 * @author raffr
 */
class ActivityBridgeService  extends Assert {
    //put your code here
    
    
    //get filter
    public function all(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $since=0;
        if ($request->query->has('since')) {
            $since = $request->input('since');
        }
        return CommonService::simpleResponse($request, 'ocs/v2.php/apps/activity/api/v2/activity/all?format='.$format.'&previews=true&since='.$since);
    }
    
    //get filters
    public function filters(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        return CommonService::simpleResponseAll($request, 'ocs/v2.php/apps/activity/api/v2/activity/filters?format='.$format);
    }
    
    //get filter
    public function filter(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $object_type='files';
        if ($request->query->has('object_type')) {
            $object_type = $request->input('object_type');
        }
        return CommonService::simpleResponse($request, 'ocs/v2.php/apps/activity/api/v2/activity/filter?format='.$format.'&object_type='.$object_type.'&object_id='.$request->input('objectid'), true); 
    }
    
    //get byyou
    public function byyou(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
         $since=0;
        if ($request->query->has('since')) {
            $since = $request->input('since');
        }
        return CommonService::simpleResponse($request, 'ocs/v2.php/apps/activity/api/v2/activity/self?format='.$format.'&previews=true&since='.$since);
    }
 
    //get byothers
    public function byothers(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
         $since=0;
        if ($request->query->has('since')) {
            $since = $request->input('since');
        }
        return CommonService::simpleResponse($request, 'ocs/v2.php/apps/activity/api/v2/activity/by?format='.$format.'&previews=true&since='.$since);
    }
    
    //get favorities
    public function favorities(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
         $since=0;
         if ($request->query->has('since')) {
            $since = $request->input('since');
        }
        return CommonService::simpleResponse($request, 'ocs/v2.php/apps/activity/api/v2/activity/files_favorites?format='.$format.'&previews=true&since='.$since);
    }
    
    //get filechanges
    public function filechanges(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
         $since=0;
         if ($request->query->has('since')) {
            $since = $request->input('since');
        }
        return CommonService::simpleResponse($request, 'ocs/v2.php/apps/activity/api/v2/activity/files?format='.$format.'&previews=true&since='.$since);
    }
    
    //get security
    public function security(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $since=0;
         if ($request->query->has('since')) {
            $since = $request->input('since');
        }
        return CommonService::simpleResponse($request, 'ocs/v2.php/apps/activity/api/v2/activity/security?format='.$format.'&previews=true&since='.$since);
    }
    
    //get fileshares
    public function fileshares(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $since=0;
         if ($request->query->has('since')) {
            $since = $request->input('since');
        }
        return CommonService::simpleResponse($request, 'ocs/v2.php/apps/activity/api/v2/activity/files_sharing?format='.$format.'&previews=true&since='.$since);
    }
    
    //get calendar
    public function calendar(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $since=0;
         if ($request->query->has('since')) {
            $since = $request->input('since');
        }
        return CommonService::simpleResponse($request, 'ocs/v2.php/apps/activity/api/v2/activity/calendar?format='.$format.'&previews=true&since='.$since);
    }
    
    //get todos
    public function todos(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $since=0;
         if ($request->query->has('since')) {
            $since = $request->input('since');
        }
        return CommonService::simpleResponse($request, 'ocs/v2.php/apps/activity/api/v2/activity/calendar_todo?format='.$format.'&previews=true&since='.$since);
    }
    
    //get comments
    public function comments(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $since=0;
         if ($request->query->has('since')) {
            $since = $request->input('since');
        }
        return CommonService::simpleResponse($request, 'ocs/v2.php/apps/activity/api/v2/activity/comments?format='.$format.'&previews=true&since='.$since);
    }
    
   
}
