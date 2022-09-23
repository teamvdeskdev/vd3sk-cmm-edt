<?php

namespace App\Services\SettingBridge;

use App\Services\CommonService;
use GuzzleHttp\Client;
use GuzzleHttp\Cookie;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use PHPUnit\Framework\Assert;
/**
 * Description of SettingBridgeService
 *
 * @author raffr
 */
class SettingBridgeService {
    
    
    //get avatar  
    public function getavatar(Request $request)
    {
        $size=24;
        if ($request->query->has('size')) {
            $size = $request->input('size');
        }
        return CommonService::simpleResponseBody($request,'index.php/avatar/'.$request->input('user').'/'.$size, false); 
    }
    
    //get avatar  
    public function currentavatar(Request $request)
    {
        
        $strCookie = CommonService::getUsernameRequest($request);
														 
		 
        $size=24;
        if ($request->query->has('size')) {
            $size = $request->input('size');
        }
        return CommonService::simpleResponseImg($request,'index.php/avatar/'.$strCookie.'/'.$size, false); 
    }
    //get avatar  
    public function uploadavatar(Request $request)
    { 
           $onRedirect = function(
                RequestInterface $request,
                ResponseInterface $response,
                UriInterface $uri
            ) {
                Log::debug($uri);
            };
           
        
        $tempFile = tempnam(sys_get_temp_dir(), 'File_').'.jpg';   
        file_put_contents($tempFile,$request->getContent());
        $strCookie= CommonService::getStrCookie($request);
        
       $client = new Client([[
            'allow_redirects' => [
            'max'             => 5,        // allow at most 10 redirects.
            'strict'          => true,      // use "strict" RFC compliant redirects.
            'referer'         => true,      // add a Referer header
            'protocols'       => ['http','https'], // only allow https URLs
            'on_redirect'     => $onRedirect,
            'track_redirects' => true]],'http_errors'=>true,'headers' => ['Authorization' => $request->header('Authorization'),'OCS-APIREQUEST'=>true,'Cookie'=> $strCookie,'Origin' => env('DOMAIN_IP_FRONTEND'),'HOST'=>env('HOST_DRIVE')]]);
         
        $file = fopen($tempFile, "r");
         
        try
        {
             $res = $client->request('GET', env('API_DRIVE_URL').'index.php/csrftoken');   
            $resptoken = json_decode($res->getBody(),true);
            
            $jsreq=['multipart' => [
            [
                'name'     => 'files[]',
                'contents' => fopen($tempFile, "r"),
            ],
                   [
                'name'     => 'requesttoken',
                'contents' => $resptoken['token'],
            ],
            ],
            ];
           
            $res = $client->request('POST', env('API_DRIVE_URL').'index.php/avatar/',$jsreq );
              
            return $res->getBody();
 
        }
        catch (\GuzzleHttp\Exception\ClientException $ex) {
            Log::error($ex->getMessage());
        } 
        finally {
            
           
        }
      
    }
    
    //get avatar  
    public function deleteavatar(Request $request)
    { 
         
         return CommonService::simpleResponse($request,'index.php/avatardelete', false);
      
    }
    
    //get avatar  
    public function cropped(Request $request)
    {
        $data = $request->json()->all();
        $jsonreq=[
                'multipart' => [
                    [
                        'name' => 'crop[x]',
                        'contents' => $data['x'],
                    ],[
                        'name' => 'crop[y]',
                        'contents' => $data['y'],
                    ],
                    [
                        'name' => 'crop[w]',
                        'contents' => $data['w'],
                    ],
                    [
                        'name' => 'crop[h]',
                        'contents' => $data['h'],
                    ]
                    ]
            ];

        return CommonService::simpleResponsePostCropped($request,'index.php/avatar/cropped', true,'POST',$jsonreq); 
    }
    
    //get avatar  
    public function setdisplayname(Request $request)
    {
        $strCookie = CommonService::getUsernameRequest($request);
        
														 
		 
        $data = $request->json()->all();
        
        return CommonService::simpleResponse($request,'index.php/settings/users/'.$strCookie.'/displayName', false,'POST',$data); 
    }
    
    
    
    public function settinguser(Request $request)
    {
         $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $strCookie = CommonService::getUsernameRequest($request);
        
														 
		 
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'index.php/settings/users/'.$strCookie.'/settings?format='.$format, true,'PUT',$data); 
    }
    
    public function userslist(Request $request)
    {
        
        return CommonService::simpleResponseBody($request,'index.php/settings/users'); 
    }
    
     public function changepassword(Request $request)
    {
         $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $data = $request->json()->all();
 
        $isCrypt = true;
        if (isset($data['isCrypt']))
        {
            
            echo $data['isCrypt'];
            if (!$data['isCrypt'])
            {
                
                $isCrypt = false;
            }
        }
        if ($isCrypt)
        {
            
            $pdata = explode(" ", $data['oldpassword']);
            $data['oldpassword'] = trim(CommonService::decrypt($pdata[0],$pdata[1],$pdata[2]));
            $data['newpassword'] = trim(CommonService::decrypt($data['newpassword'],$pdata[1],$pdata[2]));
            $data['newpassword-clone'] = trim(CommonService::decrypt($data['newpassword-clone'],$pdata[1],$pdata[2]));
            
        }
        return CommonService::simpleResponse($request,'index.php/settings/personal/changepassword?format='.$format, false,'POST',$data); 
       
    }
    
    
    public function backupcode(Request $request)
    {
         $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $data=null;
        if ($request->json()->all()!=null)
        {
            $data = $request->json()->all();
        }
        
        return CommonService::simpleResponse($request,'index.php/apps/twofactor_backupcodes/settings/create?format='.$format, false,'POST',$data);       
    }
    
    public function personalactivitysetting(Request $request) {
         
         $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        if ($request->json()->all()!=null)
        {
            $data = $request->json()->all();
        }
        
        return CommonService::simpleResponse($request,'index.php/apps/activity/settings?format='.$format, false,'POST',$data);
    }
    
    public function theme(Request $request) {
         
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        if ($request->json()->all()!=null)
        {
            $data = $request->json()->all();
        }
        
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/accessibility/api/v1/config/theme?format='.$format, false,'POST',$data);
    }
    
    public function font(Request $request) {
         
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        if ($request->json()->all()!=null)
        {
            $data = $request->json()->all();
        }
        
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/accessibility/api/v1/config/font?format='.$format, false,'POST',$data);
    }
    
     public function applistupdate(Request $request) {
         
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
   
        $version='18.0.4.2';
        if ($request->query->has('version')) {
            $version = $request->input('version');
        }
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/updatenotification/api/v1/applist/'.$version.'?format='.$format, true);
    }
    
     public function ocmprovider(Request $request) {
          
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
 
        return CommonService::simpleResponse($request,'ocm-provider?format='.$format, true);
    }
    
     public function ocsprovider(Request $request) {
          
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
 
        return CommonService::simpleResponse($request,'ocs-provider?format='.$format, true);
    }
    
     public function checksetup(Request $request) {
          
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
 
        return CommonService::simpleResponse($request,'index.php/settings/ajax/checksetup?format='.$format, true);
    }
    
    
     public function credential(Request $request) {
          
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $data = $request->json()->all();
        
        
        return CommonService::simpleResponse($request,'index.php/settings/admin/mailsettings/credentials?format='.$format, false,'POST',$data);
    }
    
     public function mailsetting(Request $request) {
          
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $data = $request->json()->all();

        return CommonService::simpleResponse($request,'index.php/settings/admin/mailsettings?format='.$format, false,'POST',$data);
    }
    
     public function mailtest(Request $request) {
          
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }

        return CommonService::simpleResponse($request,'index.php/settings/admin/mailtest', false,'POST');
    }
    
     public function notificationgroup(Request $request) {
          
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $data = $request->json()->all();
         
        $jsonreq=[
                'multipart' => [
                    [
                        'name' => 'value',
                        'contents' =>  json_encode($data['value']),
                    ] 
                    ]
            ];
        
        return CommonService::simpleResponsePost($request,'ocs/v2.php/apps/provisioning_api/api/v1/config/apps/nextcloud_announcements/notification_groups?format='.$format, false,'POST',$jsonreq);
    }

    //SHARING
    public function shareapipubliclinkdisclaimertextdelete(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/provisioning_api/api/v1/config/apps/core/shareapi_public_link_disclaimertext?format='.$format, false,'DELETE',$data);
    }

     public function shareapienabled(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/provisioning_api/api/v1/config/apps/core/shareapi_enabled?format='.$format, false,'POST',$data);
    }
    public function shareapiallowlinks(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/provisioning_api/api/v1/config/apps/core/shareapi_allow_links?format='.$format, false,'POST',$data);
    }
    public function shareapiallowpublicupload(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/provisioning_api/api/v1/config/apps/core/shareapi_allow_public_upload?format='.$format, false,'POST',$data);
    }
    public function shareapienablelinkpasswordbydefault(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/provisioning_api/api/v1/config/apps/core/shareapi_enable_link_password_by_default?format='.$format, false,'POST',$data);
    }
    public function shareapienforcelinkspassword(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/provisioning_api/api/v1/config/apps/core/shareapi_enforce_links_password?format='.$format, false,'POST',$data);
    }
    public function shareapidefaultexpiredate(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/provisioning_api/api/v1/config/apps/core/shareapi_default_expire_date?format='.$format, false,'POST',$data);
    }
    public function shareapienforceexpiredate(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/provisioning_api/api/v1/config/apps/core/shareapi_enforce_expire_date?format='.$format, false,'POST',$data);
    }
    public function shareapiexpireafterndays(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/provisioning_api/api/v1/config/apps/core/shareapi_expire_after_n_days?format='.$format, false,'POST',$data);
    }
    public function shareapiallowresharing(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/provisioning_api/api/v1/config/apps/core/shareapi_allow_resharing?format='.$format, false,'POST',$data);
    }
    public function shareapiexcludegroups(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/provisioning_api/api/v1/config/apps/core/shareapi_exclude_groups
?format='.$format, false,'POST',$data);
    }
    public function shareapiallowgroupsharing(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'indphp/settings/admin/mailsettings/credentialsex.ocs/v2.php/apps/provisioning_api/api/v1/config/apps/core/shareapi_allow_group_sharing?format='.$format, false,'POST',$data);
    }
    public function shareapionlysharewithgroupmembers(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/provisioning_api/api/v1/config/apps/core/shareapi_only_share_with_group_members?format='.$format, false,'POST',$data);
    }
    public function shareapiexcludegroupslist(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/provisioning_api/api/v1/config/apps/core/shareapi_exclude_groups_list?format='.$format, false,'POST',$data);
    }
    public function shareapiallowsharedialoguserenumeration(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/provisioning_api/api/v1/config/apps/core/shareapi_allow_share_dialog_user_enumeration?format='.$format, false,'POST',$data);
    }
    public function shareapipubliclinkdisclaimertext(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/provisioning_api/api/v1/config/apps/core/shareapi_public_link_disclaimertext?format='.$format, false,'POST',$data);
    }
   
    public function shareapidefaultpermissioncancreate(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/provisioning_api/api/v1/config/apps/core/shareapi_default_permission_cancreate?format='.$format, false,'POST',$data);
    }
    public function shareapidefaultpermissioncanupdate(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/provisioning_api/api/v1/config/apps/core/shareapi_default_permission_canupdate?format='.$format, false,'POST',$data);
    }
    public function shareapidefaultpermissioncandelete(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/provisioning_api/api/v1/config/apps/core/shareapi_default_permission_candelete?format='.$format, false,'POST',$data);
    }
    public function shareapidefaultpermissioncanshare(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/provisioning_api/api/v1/config/apps/core/shareapi_default_permission_canshare?format='.$format, false,'POST',$data);
    }
    public function shareapidefaultpermissions(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/provisioning_api/api/v1/config/apps/core/shareapi_default_permissions?format='.$format, false,'POST',$data);
    }
     
    //EXTERNALSTORAGE
    
    public function displaynames(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'index.php/displaynames?format='.$format, true,'POST',$data);
    }
    
    public function globalstoragegetall(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
         
        return CommonService::simpleResponse($request,'index.php/apps/files_external/globalstorages?format='.$format, true);
    }
    
     public function globalstorageget(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
         
        return CommonService::simpleResponse($request,'index.php/apps/files_external/globalstorages/'.$request->input('storageid').'?testOnly=true&format='.$format, true);
    }
    
     public function globalstoragedelete(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        
        return CommonService::simpleResponse($request,'index.php/apps/files_external/globalstorages/'.$request->input('storageid').'?format='.$format, true,'DELETE');
    }
    
    
     public function globalstorageupdate(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'index.php/apps/files_external/globalstorages/'.$request->input('storageid').'?format='.$format, true,'PUT',$data);
    }
    
     public function globalstoragecreate(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'index.php/apps/files_external/globalstorages?format='.$format, true,'POST',$data);
    }
    
    public function getstatus(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
         
        return CommonService::simpleResponse($request,'index.php/apps/encryption/ajax/getStatus?format='.$format, true);
    }
   
     public function setencrypthomestorage(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'index.php/apps/encryption/ajax/setEncryptHomeStorage?format='.$format, true,'POST',$data);
    }
    
    public function fulldiskencryption(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'index.php/apps/privacy/api/fullDiskEncryption?format='.$format, true,'POST',$data);
    }
 
    public function getsearch(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $search='';
        if ($request->query->has('search')) { $format = $request->input('search');}
        return CommonService::simpleResponse($request,'index.php/apps/groupfolders/folders/'.$request->input('idfolder').'/search?format='.$format.'&search='.$search, true);
    }
    
    public function getfolder(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
         
        return CommonService::simpleResponse($request,'index.php/apps/groupfolders/folders?format='.$format, true);
    }
    
    public function getfolderid(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
         
        return CommonService::simpleResponse($request,'index.php/apps/groupfolders/folders/'.$request->input('idfolder').'?format='.$format, true);
    }

     public function createfolder(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
       
        return CommonService::simpleResponse($request,'index.php/apps/groupfolders/folders?format='.$format, true,'POST',$data);
    }
    
    public function deletefolder(Request $request)
    {
        return CommonService::simpleResponse($request,'index.php/apps/groupfolders/folders/'.$request->input('idfolder'), true,'DELETE');
 
    }
    
    public function updatefolder(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        
        return CommonService::simpleResponse($request,'index.php/apps/groupfolders/folders/'.$request->input('idfolder').'/mountpoint?format='.$format, true,'POST',$data);
    }
    
    public function addfolder(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'index.php/apps/groupfolders/folders/'.$request->input('idfolder').'/groups?format='.$format, true,'POST',$data);
    }
    
     public function deletegroupfolder(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
         
        return CommonService::simpleResponse($request,'index.php/apps/groupfolders/folders/'.$request->input('idfolder').'/groups/'.$request->input('group').'?format='.$format, true,'DELETE');
    }
    
    public function addpermission(Request $request) { 
        $format='json';
        $group='admin';
        if ($request->query->has('format')) { $format = $request->input('format');}
        if ($request->query->has('group')) { $group = $request->input('group');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'index.php/apps/groupfolders/folders/'.$request->input('idfolder').'/groups/'.$group.'?format='.$format, true,'POST',$data);
    }
    
    public function addquota(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'index.php/apps/groupfolders/folders/'.$request->input('idfolder').'/quota?format='.$format, true,'POST',$data);
    }
    
    public function addacl(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'index.php/apps/groupfolders/folders/'.$request->input('idfolder').'/acl?format='.$format, true,'POST',$data);
    }
    public function manageacl(Request $request) { 
        $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'index.php/apps/groupfolders/folders/'.$request->input('idfolder').'/manageACL?format='.$format, true,'POST',$data);
    }
    
    //get also log other user
     public function getlog(Request $request) { 
        $format='json';
        $offset=0;
        $count=50;
        $level=11111;
        if ($request->query->has('format')) { $format = $request->input('format');}
        if ($request->query->has('offset')) { $offset = $request->input('offset');}
        if ($request->query->has('count')) { $count = $request->input('count');}
        if ($request->query->has('level')) { $level = $request->input('level');}
        return CommonService::simpleResponse($request,'index.php/apps/logreader/get?offset='.$offset.'&count='.$count.'&levels='.$level.'&format='.$format, true);
    }
    
    public function address_onlyoffice(Request $request) { 
        
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'index.php/apps/onlyoffice/ajax/settings/address', true,'PUT',$data);
    }
    
    public function common_onlyoffice(Request $request) { 
        
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'index.php/apps/onlyoffice/ajax/settings/common', true,'PUT',$data);
    }
    
    public function watermark_onlyoffice(Request $request) { 
        
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'index.php/apps/onlyoffice/ajax/settings/watermark', true,'PUT',$data);
    }
    
     public function get_onlyoffice(Request $request) { 
        
         
        return CommonService::simpleResponse($request,'index.php/apps/onlyoffice/ajax/settings', true,'GET');
    } 
    
    
    
    
    public function getbackends(Request $request) { 
        
         
            $body=CommonService::simpleResponseBody($request,'/index.php/settings/admin/externalstorages', true,'GET');
            
                //read html response
                $dom = new \DOMDocument;
                @$dom->loadHTML($body);
                $backend="";
                //retrive token by field data-requesttoken in head 
                $heads = $dom->getElementById('selectBackend')->attributes;
                foreach($heads as $head)
                {
                    if ($head->nodeName=='data-configurations')
                    {
                        $backend=$head->nodeValue;
                    }
                }

           return $backend;
            
        
    } 
 
     public function getmechanisms(Request $request) { 
        
         
            $body=CommonService::simpleResponseBody($request,'/index.php/settings/admin/externalstorages', true,'GET');
            
                //read html response
                $dom = new \DOMDocument;
                @$dom->loadHTML($body);
                $mechanisms="";
                 
                $xpath = new \DOMXpath($dom);
                $authentication = $xpath->query("//td[contains(@class,'authentication')]");
                 
                //retrive token by field data-requesttoken in head 
                $heads = $authentication->item(0)->attributes;
                foreach($heads as $head)
                {
                    if ($head->nodeName=='data-mechanisms')
                    {
                        $mechanisms=$head->nodeValue;
                    }
                }

           return $mechanisms;
            
    } 
    
    
     public function saveglobalcredentials(Request $request) { 
        
         $format='json';
        if ($request->query->has('format')) { $format = $request->input('format');}
        $data = $request->json()->all();
        return CommonService::simpleResponse($request,'index.php/apps/files_external/globalcredentials?format='.$format, true,'POST',$data);
            
    } 
    
     public function getglobalcredential(Request $request) { 
        
         
            $body=CommonService::simpleResponseBody($request,'/index.php/settings/admin/externalstorages', true,'GET');
             
            $dom = new \DOMDocument;
            @$dom->loadHTML($body);
            $username="";
            $xpath = new \DOMXpath($dom);
            $inputs = $xpath->query("//input[contains(@name,'username')]");
            $heads = $inputs->item(0)->attributes;
            foreach($heads as $head)
            {
                if ($head->nodeName=='value')
                {
                    
                    $username=$head->nodeValue;
                }
            }
            $password="";
             
            $xpath = new \DOMXpath($dom);
            $inputs = $xpath->query("//input[contains(@name,'password')]");
            $heads = $inputs->item(0)->attributes;
            foreach($heads as $head)
            {
                if ($head->nodeName=='value')
                {
                    
                    $password=$head->nodeValue;
                }
            }
            
            return response()->json(['username' => $username ,'password'=>$password]);
            
    } 
    
    public function updateUrlServerOnlyOffice(Request $request)
    {
        $body=$request->json()->all();
        
        return CommonService::simpleResponse($request,'index.php/apps/onlyoffice/ajax/settings/address',true,'PUT',$body);
        
    }
    
    public function getUrlServerOnlyOffice(Request $request)
    {
        $url = CommonService::simpleResponseBody($request,'/index.php/apps/onlyoffice/ajax/settings/getOnlyOfficeServerUrl', true,'GET');
        return '{"url":'.$url.'}';
        
    }

    public function getDeviceSession(Request $request) { 
 
        $jsonobj = CommonService::simpleResponse($request,'/index.php/settings/user/security/devices', true,null,null,true);
        $array = json_decode($jsonobj);
        $arr2 = [];
        foreach($array as $row => $value){
            foreach($value as $row2 => $value2)
            {
                if ($row2=='name')
                {
                    if (strpos($value2, 'GuzzleHttp') !== false) {
                        unset($row); 
                    }
                    else
                    {
                        array_push($arr2,$value);
                        //$arr2 = array_values($value);
                    }
                }
            }
        
        
        }
    
        return response()->json(['status' => Response::HTTP_OK, 'message' => 'success', 'body' => $arr2]);
      // return $jsonobj;
    }

    public function canceldevices(Request $request) { 
        
        return CommonService::simpleResponse($request,'/index.php/settings/personal/authtokens/wipe/'.$request->input('id'), true,'POST');
   }

   public function revokedevices(Request $request) { 
        
    return CommonService::simpleResponse($request,'/index.php/settings/personal/authtokens/'.$request->input('id'), true,'DELETE');
    }

    public function updatedevices(Request $request) { 
         
        $body=$request->json()->all();
        return CommonService::simpleResponse($request,'/index.php/settings/personal/authtokens/'.$request->input('id'), true,'PUT',$body);
        }
}
