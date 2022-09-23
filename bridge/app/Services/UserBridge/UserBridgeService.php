<?php

namespace App\Services\UserBridge;

use App\Services\CommonService;
use GuzzleHttp\Client;
use GuzzleHttp\Cookie;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use PHPUnit\Framework\Assert;

class UserBridgeService extends Assert{
    
    
    //USER
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    //search 
    public function searchuser(Request $request)
    {
        
        $offset = 0;
        if ($request->query->has('offset')) {
            $offset = $request->input('offset');
        }
        $limit = 25;
        if ($request->query->has('limit')) {
            $limit = $request->input('limit');
        }
        $search = "";
         if ($request->query->has('search')) {
            $search = $request->input('search');
        }
        return CommonService::simpleResponseAll($request, 'ocs/v2.php/cloud/users/details?offset='.$offset.'&limit='.$limit.'&search='.$request->input('search'), false); 
       // return CommonService::simpleResponseAll($request, 'ocs/v1.php/cloud/users?search='.$request->input('search'), true); 
    }

     //deleteuser 
    public function deleteuser(Request $request)
    {
            
        return CommonService::simpleResponseAll($request, 'ocs/v1.php/cloud/users/'.$request->input('userid'), true,"DELETE"); 
    }
    
    //datauser 
    public function datauser(Request $request)
    {
            $strCookie="";
        if ($request->cookies->has('nc_username')) {
            $strCookie=$request->cookie()['nc_username'];
        }
        return CommonService::simpleResponseAll($request, 'ocs/v1.php/cloud/users/'.$strCookie, true); 
    }

    //get users ,only for admin
    public function getusers(Request $request)
    {
        return CommonService::simpleResponseAll($request, 'ocs/v2.php/cloud/users',false); 
    }
    
    //get users details ,only for admin
    public function getusersdetails(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        return CommonService::simpleResponse($request, 'ocs/v2.php/cloud/users/details?format='.$format,false); 
    }
    
  public function searchusernoadmin(Request $request)
    {
        
        $offset = 0;
        if ($request->query->has('offset')) {
            $offset = $request->input('offset');
        }
        $limit = 25;
        if ($request->query->has('limit')) {
            $limit = $request->input('limit');
        }
        $search = "";
         if ($request->query->has('search')) {
            $search = $request->input('search');
        }
        return CommonService::simpleResponseAll($request, 'ocs/v2.php/cloud/users/detailsnoadmin?offset='.$offset.'&limit='.$limit.'&search='.$request->input('search'), false); 
       // return CommonService::simpleResponseAll($request, 'ocs/v1.php/cloud/users?search='.$request->input('search'), true); 
    }

    //POST add user
    public function adduser(Request $request)
    {
        $body=$request->json()->all();
          $pdata = explode(" ", $body['password']);
        $body['password'] = trim(CommonService::decrypt($pdata[0],$pdata[1],$pdata[2]));
        return CommonService::simpleResponseAll($request, 'ocs/v2.php/cloud/users',false,'POST',$body); 
    }
    
    //get user
    public function getuser(Request $request)
    {
        return CommonService::simpleResponseAll($request, 'ocs/v2.php/cloud/users/'.$request->input('userid'),false); 
    }
    
     //get user
    public function getusernoadmin(Request $request)
    {
        return CommonService::simpleResponseAll($request, 'ocs/v2.php/cloud/usersnoadmin/'.$request->input('userid'),false); 
    }
    
    //get current user
    public function currentuser(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $body = CommonService::simpleResponse($request, 'ocs/v2.php/cloud/user?format='.$format,false,null,null,true);
        $jsonnew = str_replace("display-name", "displayname", $body);
        return $jsonnew; 
    }
    
    //get editable field
    public function geteditablefields(Request $request)
    {
        return CommonService::simpleResponseAll($request, 'ocs/v2.php/cloud/user/fields',false); 
    }

    //PUT add update user
    public function updateuser(Request $request)
    {
        $body=$request->json()->all();
        if ($body['key']=="password")
        {
            $pdata = explode(" ", $body['value']);
            $body['value'] = trim(CommonService::decrypt($pdata[0],$pdata[1],$pdata[2]));
        }
       
        return CommonService::simpleResponseAll($request, 'ocs/v2.php/cloud/users/'.$request->input('userid'),false,'PUT',$body); 
    }
    
    //get wipe user device
    public function wipeuserdevices(Request $request)
    {
         $body=$request->json()->all();
        return CommonService::simpleResponseAll($request, 'ocs/v2.php/cloud/users/'.$request->input('userid').'/wipe',false,'POST',$body); 
    }

    //PUT enable user
    public function enableuser(Request $request)
    {
        $body=$request->json()->all();
        return CommonService::simpleResponseAll($request, 'ocs/v2.php/cloud/users/'.$request->input('userid').'/enable',false,'PUT',$body); 
    }
    
    //PUT disable user
    public function disableuser(Request $request)
    {
        $body=$request->json()->all();
        return CommonService::simpleResponseAll($request, 'ocs/v2.php/cloud/users/'.$request->input('userid').'/disable',false,'PUT',$body); 
    }

    
    //GROUP
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // users group 
    public function usersgroup(Request $request)
    {
        return CommonService::simpleResponseAll($request, 'ocs/v1.php/cloud/users/'.$request->input('userid').'/groups', false); 
    }
    
    //POST add user to group 
    public function addtogroup(Request $request)
    {
        $body=$request->json()->all();
        return CommonService::simpleResponseAll($request, 'ocs/v1.php/cloud/users/'.$request->input('userid').'/groups',false,'POST',$body); 
    }
    
    //DELETE remove user from group 
    public function removefromgroup(Request $request)
    {
        $body=$request->json()->all();
        return CommonService::simpleResponseAll($request, 'ocs/v1.php/cloud/users/'.$request->input('userid').'/groups',false,'DELETE',$body); 
    }
    
    //get group 
    public function getgroups(Request $request)
    {
        return CommonService::simpleResponseAll($request, 'ocs/v1.php/cloud/groups', false); 
    }
    
    //get group details
    public function getgroupdetails(Request $request)
    {
        return CommonService::simpleResponseAll($request, 'ocs/v1.php/cloud/groups/details', false); 
    }
    
    //get group user
    public function getgroupusers(Request $request)
    {
        return CommonService::simpleResponseAll($request, 'ocs/v1.php/cloud/groups/'.$request->input('groupid').'/users', false); 
    }
    
    //get group details
    public function getgroupuserdetail(Request $request)
    {
        return CommonService::simpleResponseAll($request, 'ocs/v1.php/cloud/groups/'.$request->input('groupid').'/users/details', false); 
    }
    
    //get group admin of group
    public function getsubadminofgroup(Request $request)
    {
        return CommonService::simpleResponseAll($request, 'ocs/v1.php/cloud/groups/'.$request->input('groupid').'/subadmins', false); 
    }
    
    //POST add group 
    public function addgroup(Request $request)
    {
        $body=$request->json()->all();
        return CommonService::simpleResponseAll($request, 'ocs/v2.php/cloud/groups',false,'POST',$body); 
    }
    
    //get group 
    public function getgroup(Request $request)
    {
        return CommonService::simpleResponseAll($request, 'ocs/v1.php/cloud/groups/'.$request->input('groupid'), false); 
    }
    
    //DELETE group 
    public function deletegroup(Request $request)
    {
        return CommonService::simpleResponseAll($request, 'ocs/v1.php/cloud/groups/'.$request->input('groupid'), false,'DELETE'); 
    }
    
     public function getuserssubadmin(Request $request)
    {
        return CommonService::simpleResponseAll($request, 'ocs/v1.php/cloud/users/'.$request->input('userid').'/subadmins', false); 
    }
    
    //POST add sub admin
    public function addsubadmin(Request $request)
    {
        $body=$request->json()->all();
        return CommonService::simpleResponseAll($request, 'ocs/v1.php/cloud/users/'.$request->input('userid').'/subadmins',false,'POST',$body); 
    }
    
    //POST delete sub admin
    public function deletesubadmin(Request $request)
    {
        $body=$request->json()->all();
        return CommonService::simpleResponseAll($request, 'ocs/v1.php/cloud/users/'.$request->input('userid').'/subadmins',false,'DELETE',$body); 
    }
    
    //POST resend welcome message
    public function resendWelcomeMessage(Request $request)
    {
        $body=$request->json()->all();
        return CommonService::simpleResponseAll($request, 'ocs/v1.php/cloud/users/'.$request->input('userid').'/welcome',false,'POST',$body); 
    }
//    ['root' => '/cloud', 'name' => 'Users#getUserSubAdminGroups', 'url' => '/users/{userId}/subadmins', 'verb' => 'GET'],
//		['root' => '/cloud', 'name' => 'Users#addSubAdmin', 'url' => '/users/{userId}/subadmins', 'verb' => 'POST'],
//		['root' => '/cloud', 'name' => 'Users#removeSubAdmin', 'url' => '/users/{userId}/subadmins', 'verb' => 'DELETE'],
//		['root' => '/cloud', 'name' => 'Users#resendWelcomeMessage', 'url' => '/users/{userId}/welcome', 'verb' => 'POST'],

    
//    //searchgroup 
//    public function searchgroup(Request $request)
//    {
//        return CommonService::simpleResponseAll($request, 'ocs/v1.php/cloud/groups?search='.$request->input('search'), true); 
//    }
//    
//    //membersgroup 
//    public function membersgroup(Request $request)
//    {
//        return CommonService::simpleResponseAll($request, 'ocs/v1.php/cloud/groups/'.$request->input('group'), true); 
//    }
    
    // get list language
    public function getlistlanguage(Request $request)
    {
        $body=CommonService::simpleResponseBody($request,'index.php/settings/user', true,'GET');
        $dom = new \DOMDocument;
        @$dom->loadHTML($body);
        $associativeArray = array();
        $xpath = new \DOMXPath($dom);
        $result = $xpath->query("//select[@id='languageinput']/option"); 
         
        foreach($result as $option) { // find options of this select box 
                $associativeArray [trim($option->textContent)] = trim($option->attributes['value']->value);
        }
        
        return json_encode($associativeArray);
    }

    // get list locale
    public function getlistlocale(Request $request)
    {
        $body=CommonService::simpleResponseBody($request,'index.php/settings/user', true,'GET');
        $dom = new \DOMDocument;
        @$dom->loadHTML($body);
        $associativeArray = array();
        $xpath = new \DOMXPath($dom);
        $result = $xpath->query("//select[@id='localeinput']/option"); 
         
        foreach($result as $option) { // find options of this select box 
                $associativeArray [trim($option->textContent)] = trim($option->attributes['value']->value);
        }
        
        return json_encode($associativeArray);
    }

    
    
}
