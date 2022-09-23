<?php

namespace App\Services\FilesBridge;

use App\Services\CommonService;
use App\Services\UserBridge\UserBridgeService;
use GuzzleHttp\Client;
use GuzzleHttp\Cookie;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\UriInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use PHPUnit\Framework\Assert;

/**
 * Our FileService, containing all useful methods for business logic around File
 */

class FileBridgeService extends Assert
{    
   
    public function encodeRequest(Request $request)
    {
        foreach ($request->all() as $key => $value) {
            Log::debug(request($key));
            $request[$key] = urlencode($value);
            Log::debug(request($key)); 
        }
        
    }


    public function crftoken(Request $request)
    {
        
          $client = new Client();
     
                  
        $res = $client->request('GET', env('API_DRIVE_URL').'index.php/csrftoken');
       
        return $res->getBody();
    }
    //DAV get all files folder
    public function files(Request $request)
    {
       // $this->encodeRequest($request);
      
        
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $strCookie = CommonService::getUsernameRequest($request);
        
        $folder = '';
        if ($request->query->has('path')) {
           
            $folder = $request->input('path');
        }
        
        $depth=1;
        if ($request->query->has('depth')) {
            $depth = $request->input('depth');
        }
        $headers = array('Depth' => $depth);
        // $allheaders = $request->headers->all();
        // $headers += $allheaders;
        return CommonService::getApiDAVResponse($request,'remote.php/dav/files/'.$strCookie.'/'.$folder.'?format='.$format,'PROPFIND','<?xml version="1.0"?><d:propfind  xmlns:d="DAV:"   xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns" xmlns:ocs="http://open-collaboration-services.org/ns"><d:prop><d:getlastmodified /><d:getetag /><d:getcontenttype /><d:resourcetype /><oc:fileid /><oc:permissions /><oc:size /><d:getcontentlength /><nc:has-preview /><nc:mount-type /><nc:is-encrypted /><ocs:share-permissions /><oc:tags /><oc:favorite /><oc:comments-unread /><oc:owner-id /><oc:owner-display-name /><oc:share-types /> </d:prop></d:propfind>',$headers);
    }
    
   
    
   public function updatemetadata(Request $request)
   {
       $folder = '';
        if ($request->query->has('path')) {
            $folder = $request->input('path');
        }
   }
    
     //DAV get all files folder
    public function favorites(Request $request)
    {
        //$this->fictitious($request);
        $strCookie = CommonService::getUsernameRequest($request);
        
        
        return CommonService::getApiDAVResponse($request,'remote.php/dav/files/'.$strCookie.'/','REPORT','<oc:filter-files  xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns" xmlns:ocs="http://open-collaboration-services.org/ns"><d:prop><d:getlastmodified /><d:getetag /><d:getcontenttype /><d:resourcetype /><oc:fileid /><oc:permissions /><oc:size /><d:getcontentlength /><nc:has-preview /><nc:mount-type /><nc:is-encrypted /><ocs:share-permissions /><oc:tags /><oc:favorite /><oc:comments-unread /><oc:owner-id /><oc:owner-display-name /><oc:share-types /></d:prop><oc:filter-rules><oc:favorite>1</oc:favorite></oc:filter-rules></oc:filter-files>');
    }
    
     //DAV get all files with tags
    public function tags(Request $request)
    {
        //$this->fictitious($request);
        $strCookie = CommonService::getUsernameRequest($request);
        
        $rules="";
        $arraytags=explode(",",$request->input('id'));
        foreach ($arraytags as $key => $value) {
            
            $rules=$rules.'<oc:systemtag>'.$value.'</oc:systemtag>';
        }
     
        return CommonService::getApiDAVResponse($request,'remote.php/dav/files/'.$strCookie.'/','REPORT','<oc:filter-files  xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns" xmlns:ocs="http://open-collaboration-services.org/ns"><d:prop><d:getlastmodified /><d:getetag /><d:getcontenttype /><d:resourcetype /><oc:fileid /><oc:permissions /><oc:size /><d:getcontentlength /><nc:has-preview /><nc:mount-type /><nc:is-encrypted /><ocs:share-permissions /><oc:tags /><oc:favorite /><oc:comments-unread /><oc:owner-id /><oc:owner-display-name /><oc:share-types /></d:prop><oc:filter-rules>'.$rules.'</oc:filter-rules></oc:filter-files>');
    }
    
     //DAV calendar
    public function calendar(Request $request)
    {
        Log::debug('sdsds1');
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $strCookie = CommonService::getUsernameRequest($request);
        
        
        //'VEVENT', 'VTODO', 'VJOURNAL'
        $filter="VEVENT";
        if ($request->query->has('filter')) {
            $start=$request->input('filter');
        }
        Log::debug('sdsds1');
        $sdate = strtotime("-15 days", time());
        $start=date('Ymd\THis', $sdate)."Z";
        if ($request->query->has('start')) {
            $start=$request->input('start');
        }
        $edate = strtotime("25 days", time());
        
        $end=date('Ymd\THis', $edate)."Z";
        if ($request->query->has('end')) {
            $end=$request->input('end');
        }
        $depth=1;
        if ($request->query->has('depth')) {
            $depth = $request->input('depth');
        }
        $headers = array('Depth' => $depth);
        // $allheaders = $request->headers->all();
        // $headers += $allheaders;
        return CommonService::getApiCALDAVResponse($request,'remote.php/dav/calendars/'.$strCookie.'/personal/','REPORT','<x1:calendar-query xmlns:x1="urn:ietf:params:xml:ns:caldav"><x0:prop xmlns:x0="DAV:"><x0:getcontenttype/><x0:getetag/><x0:resourcetype/><x0:displayname/><x0:owner/><x0:resourcetype/><x0:sync-token/><x0:current-user-privilege-set/><x0:getcontenttype/><x0:getetag/><x0:resourcetype/><x1:calendar-data/></x0:prop><x1:filter><x1:comp-filter name="VCALENDAR"><x1:comp-filter name="'.$filter.'"><x1:time-range start="'.$start.'" end="'.$end.'"/></x1:comp-filter></x1:comp-filter></x1:filter></x1:calendar-query>',$headers);
    } 
    
     //DAV calendar
    public function calendargeneral(Request $request)
    {
        Log::debug('sdsds1');
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $strCookie = CommonService::getUsernameRequest($request);
       
        
        $depth=1;
        if ($request->query->has('depth')) {
            $depth = $request->input('depth');
        }
        $headers = array('Depth' => $depth);
        // $allheaders = $request->headers->all();
        // $headers += $allheaders;
        return CommonService::getApiCALDAVResponse($request,'remote.php/dav/calendars/'.$strCookie,'PROPFIND','<x0:propfind xmlns:x0="DAV:"><x0:prop><x0:getcontenttype/><x0:getetag/><x0:resourcetype/><x0:displayname/><x0:owner/><x0:resourcetype/><x0:sync-token/><x0:current-user-privilege-set/><x0:displayname/><x0:owner/><x0:resourcetype/><x0:sync-token/><x0:current-user-privilege-set/><x4:invite xmlns:x4="http://owncloud.org/ns"/><x5:allowed-sharing-modes xmlns:x5="http://calendarserver.org/ns/"/><x5:publish-url xmlns:x5="http://calendarserver.org/ns/"/><x6:calendar-order xmlns:x6="http://apple.com/ns/ical/"/><x6:calendar-color xmlns:x6="http://apple.com/ns/ical/"/><x5:getctag xmlns:x5="http://calendarserver.org/ns/"/><x1:calendar-description xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:calendar-timezone xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:supported-calendar-component-set xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:supported-calendar-data xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:max-resource-size xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:min-date-time xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:max-date-time xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:max-instances xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:max-attendees-per-instance xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:supported-collation-set xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:calendar-free-busy-set xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:schedule-calendar-transp xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:schedule-default-calendar-URL xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x4:calendar-enabled xmlns:x4="http://owncloud.org/ns"/><x3:owner-displayname xmlns:x3="http://nextcloud.com/ns"/><x0:displayname/><x0:owner/><x0:resourcetype/><x0:sync-token/><x0:current-user-privilege-set/><x4:invite xmlns:x4="http://owncloud.org/ns"/><x5:allowed-sharing-modes xmlns:x5="http://calendarserver.org/ns/"/><x5:publish-url xmlns:x5="http://calendarserver.org/ns/"/><x6:calendar-order xmlns:x6="http://apple.com/ns/ical/"/><x6:calendar-color xmlns:x6="http://apple.com/ns/ical/"/><x5:getctag xmlns:x5="http://calendarserver.org/ns/"/><x1:calendar-description xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:calendar-timezone xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:supported-calendar-component-set xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:supported-calendar-data xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:max-resource-size xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:min-date-time xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:max-date-time xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:max-instances xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:max-attendees-per-instance xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:supported-collation-set xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:calendar-free-busy-set xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:schedule-calendar-transp xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:schedule-default-calendar-URL xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x4:calendar-enabled xmlns:x4="http://owncloud.org/ns"/><x3:owner-displayname xmlns:x3="http://nextcloud.com/ns"/><x5:source xmlns:x5="http://calendarserver.org/ns/"/><x6:refreshrate xmlns:x6="http://apple.com/ns/ical/"/><x5:subscribed-strip-todos xmlns:x5="http://calendarserver.org/ns/"/><x5:subscribed-strip-alarms xmlns:x5="http://calendarserver.org/ns/"/><x5:subscribed-strip-attachments xmlns:x5="http://calendarserver.org/ns/"/><x0:displayname/><x0:owner/><x0:resourcetype/><x0:sync-token/><x0:current-user-privilege-set/><x4:invite xmlns:x4="http://owncloud.org/ns"/><x5:allowed-sharing-modes xmlns:x5="http://calendarserver.org/ns/"/><x5:publish-url xmlns:x5="http://calendarserver.org/ns/"/><x6:calendar-order xmlns:x6="http://apple.com/ns/ical/"/><x6:calendar-color xmlns:x6="http://apple.com/ns/ical/"/><x5:getctag xmlns:x5="http://calendarserver.org/ns/"/><x1:calendar-description xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:calendar-timezone xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:supported-calendar-component-set xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:supported-calendar-data xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:max-resource-size xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:min-date-time xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:max-date-time xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:max-instances xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:max-attendees-per-instance xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:supported-collation-set xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:calendar-free-busy-set xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:schedule-calendar-transp xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:schedule-default-calendar-URL xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x4:calendar-enabled xmlns:x4="http://owncloud.org/ns"/><x3:owner-displayname xmlns:x3="http://nextcloud.com/ns"/><x1:calendar-availability xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x0:displayname/><x0:owner/><x0:resourcetype/><x0:sync-token/><x0:current-user-privilege-set/></x0:prop></x0:propfind>',$headers);
    } 
    
    //DAV dav
    public function dav(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        return CommonService::getApiDAVResponse($request,'remote.php/dav/','PROPFIND','<x0:propfind xmlns:x0="DAV:"><x0:prop><x0:current-user-principal/></x0:prop></x0:propfind>');
    } 
    
    //DAV principals
    public function principals(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $strCookie = CommonService::getUsernameRequest($request);
        
        
        return CommonService::getApiDAVResponse($request,'remote.php/dav/principals/users/'.$strCookie.'/','PROPFIND','<x0:propfind xmlns:x0="DAV:"><x0:prop><x0:displayname/><x1:calendar-user-type xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x1:calendar-user-address-set xmlns:x1="urn:ietf:params:xml:ns:caldav"/><x0:principal-URL/><x0:alternate-URI-set/><x2:email-address xmlns:x2="http://sabredav.org/ns"/><x3:addressbook-home-set xmlns:x3="urn:ietf:params:xml:ns:carddav"/><x0:principal-collection-set/><x0:supported-report-set/></x0:prop></x0:propfind>');
    }
    
    //DAV principals
    public function addressbooks(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $strCookie = CommonService::getUsernameRequest($request);
        
        
        return CommonService::getApiDAVResponse($request,'remote.php/dav/addressbooks/users/'.$strCookie.'/','PROPFIND','<x0:propfind xmlns:x0="DAV:"><x0:prop><x0:getcontenttype/><x0:getetag/><x0:resourcetype/><x0:displayname/><x0:owner/><x0:resourcetype/><x0:sync-token/><x0:current-user-privilege-set/><x0:displayname/><x0:owner/><x0:resourcetype/><x0:sync-token/><x0:current-user-privilege-set/><x4:invite xmlns:x4="http://owncloud.org/ns"/><x5:allowed-sharing-modes xmlns:x5="http://calendarserver.org/ns/"/><x3:addressbook-description xmlns:x3="urn:ietf:params:xml:ns:carddav"/><x3:supported-address-data xmlns:x3="urn:ietf:params:xml:ns:carddav"/><x3:max-resource-size xmlns:x3="urn:ietf:params:xml:ns:carddav"/><x5:getctag xmlns:x5="http://calendarserver.org/ns/"/><x4:enabled xmlns:x4="http://owncloud.org/ns"/><x4:read-only xmlns:x4="http://owncloud.org/ns"/></x0:prop></x0:propfind>');
    }
    
    
    
      //DAV contact
    public function contact(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $strCookie = CommonService::getUsernameRequest($request);
        
         $depth=1;
        if ($request->query->has('depth')) {
            $depth = $request->input('depth');
        }
        $headers = array('Depth' => $depth);
        // $allheaders = $request->headers->all();
        // $headers += $allheaders;
        return CommonService::getApiDAVResponse($request,'remote.php/dav/addressbooks/users/'.$strCookie.'/contacts/','REPORT','<x3:addressbook-query xmlns:x3="urn:ietf:params:xml:ns:carddav"><x0:prop xmlns:x0="DAV:"><x0:getetag/><x0:getcontenttype/><x0:resourcetype/><x3:address-data><x3:prop name="EMAIL"/><x3:prop name="UID"/><x3:prop name="CATEGORIES"/><x3:prop name="FN"/><x3:prop name="ORG"/><x3:prop name="N"/></x3:address-data><x6:has-photo xmlns:x6="http://nextcloud.com/ns"/></x0:prop></x3:addressbook-query>',$headers);
    } 
    
       //DAV contact
    public function contactdetail(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $href="";
        if ($request->query->has('href')) {
            $href = $request->input('href');
        }
        $strCookie = CommonService::getUsernameRequest($request);
        
         $depth=0;
        if ($request->query->has('depth')) {
            $depth = $request->input('depth');
        }
        $headers = array('Depth' => $depth);
        // $allheaders = $request->headers->all();
        // $headers += $allheaders;
        return CommonService::getApiDAVResponse($request,$href,'PROPFIND','<x0:propfind xmlns:x0="DAV:"><x0:prop><x0:getcontenttype/><x0:getetag/><x0:resourcetype/><x3:address-data xmlns:x3="urn:ietf:params:xml:ns:carddav"/></x0:prop></x0:propfind>',$headers);
    }  
    
    //DAV get all tags
    public function listtags(Request $request)
    {
        //$this->fictitious($request);
        $strCookie = CommonService::getUsernameRequest($request);
        
        return CommonService::getApiDAVResponse($request,'remote.php/dav/systemtags/','PROPFIND','<?xml version="1.0"?><d:propfind  xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns"><d:prop><oc:id /><oc:display-name /><oc:user-visible /><oc:user-assignable /><oc:can-assign /></d:prop></d:propfind>');
    }
    
     //DAV get all files folder
    public function filestrash(Request $request)
    {
        //$this->fictitious($request);
        $strCookie = CommonService::getUsernameRequest($request);
        
        $folder = '';
        if ($request->query->has('path')) {
            $folder = $request->input('path');
        }
        return CommonService::getApiDAVResponse($request,'remote.php/dav/trashbin/'.$strCookie.'/trash/'.$folder,'PROPFIND','<?xml version="1.0"?><d:propfind  xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns" xmlns:ocs="http://open-collaboration-services.org/ns"><d:prop><nc:trashbin-filename /><nc:trashbin-deletion-time /><nc:trashbin-original-location /><d:getlastmodified /><d:getetag /><d:getcontenttype /><d:resourcetype /><oc:fileid /><oc:permissions /><oc:size /><d:getcontentlength /><nc:has-preview /><nc:mount-type /><nc:is-encrypted /><ocs:share-permissions /></d:prop></d:propfind>');
    }
    
     //DAV get all files folder
    public function trashbin(Request $request)
    {
         
        $strCookie = CommonService::getUsernameRequest($request);
        $trashbinfilename='';
        if ($request->query->has('trashbinfilename') && $request->query->has('trashbindeletiontime')) {
            $trashbinfilename = $request->input('trashbinfilename').'.d'.$request->input('trashbindeletiontime');
            Log::debug($request->input('trashbinfilename'));
        }
        return CommonService::getApiDAVResponse($request,'remote.php/dav/trashbin/'.$strCookie.'/trash/'.$trashbinfilename,'DELETE');
     
    }
    
  
    
     //DAV get all files folder
    public function trash(Request $request)
    {
        //$this->fictitious($request);
        $strCookie = CommonService::getUsernameRequest($request);
        return CommonService::getApiDAVResponse($request,'remote.php/dav/trashbin/'.$strCookie.'/trash','PROPFIND','<?xml version="1.0"?>
<d:propfind  xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns" xmlns:ocs="http://open-collaboration-services.org/ns">
  <d:prop>
    <nc:trashbin-filename />
    <nc:trashbin-deletion-time />
    <nc:trashbin-original-location />
    <d:getlastmodified />
    <d:getetag />
    <d:getcontenttype />
    <d:resourcetype />
    <oc:fileid />
    <oc:permissions />
    <oc:size />
    <d:getcontentlength />
    <nc:has-preview />
    <nc:mount-type />
    <nc:is-encrypted />
    <ocs:share-permissions />
  </d:prop>
</d:propfind>
');
    }
    
    public function createfolder(Request $request)
    {
        $strCookie = CommonService::getUsernameRequest($request);
        Log::debug("strCookie: ".$strCookie);
        $folder = true;
        if ($request->query->has('folder')) {
            $folder = $request->input('folder');
        }
        return CommonService::getApiDAVResponse($request,'remote.php/dav/files/'.$strCookie.'/'.$folder,'MKCOL');
    }
    
    //DAV get file
    public function getfile(Request $request)
    {
        $strCookie = CommonService::getUsernameRequest($request);
        
        return CommonService::getApiDAVResponse($request,'remote.php/dav/systemtags-relations/files/'.$request->input('fileid'),'PROPFIND','<?xml version="1.0"?>
        <d:propfind  xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns">
          <d:prop>
            <oc:id />
            <oc:display-name />
            <oc:user-visible />
            <oc:user-assignable />
            <oc:can-assign />
          </d:prop>
        </d:propfind>');
    }
    
    //DAV delete file
     public function delete(Request $request)
    {
        $strCookie = CommonService::getUsernameRequest($request);
        
        $uri = 'PseudoFolder';
        if ($request->query->has('uri')) {
            $uri = $request->input('uri');
        }
        return CommonService::getApiDAVResponse($request,'remote.php/dav/files/'.$strCookie.'/'.$request->input('uri'),'DELETE','');     
    }

     //DAV upload file
    public function newfile(Request $request)
    {
        $strCookie = CommonService::getUsernameRequest($request);
        $uri = 'PseudoFolder';
        if ($request->query->has('filename')) {
            $uri = $request->input('filename');
        }
        
        return CommonService::getApiDAVResponse($request,'remote.php/dav/files/'.$strCookie.'/'.$request->input('filename'),'PUT');     
    } 
    
     //DAV upload file
     public function getnewfile(Request $request)
     {
         $strCookie = CommonService::getUsernameRequest($request);
         $uri = 'PseudoFolder';
         if ($request->query->has('filename')) {
             $uri = $request->input('filename');
         }
         $json = CommonService::getApiDAVResponse($request,'remote.php/dav/files/'.$strCookie.'/'.$request->input('filename'),'PUT');
        if (strpos($json, 'Created') !== false) 
         {
            $format='json';
            if ($request->query->has('format')) {
                $format = $request->input('format');
            }
            $folder =  $uri;
           
            $depth=1;
           
            $headers = array('Depth' => $depth);
            // $allheaders = $request->headers->all();
            // $headers += $allheaders;
            return CommonService::getApiDAVResponse($request,'remote.php/dav/files/'.$strCookie.'/'.$folder.'?format='.$format,'PROPFIND','<?xml version="1.0"?><d:propfind  xmlns:d="DAV:"   xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns" xmlns:ocs="http://open-collaboration-services.org/ns"><d:prop><d:getlastmodified /><d:getetag /><d:getcontenttype /><d:resourcetype /><oc:fileid /><oc:permissions /><oc:size /><d:getcontentlength /><nc:has-preview /><nc:mount-type /><nc:is-encrypted /><ocs:share-permissions /><oc:tags /><oc:favorite /><oc:comments-unread /><oc:owner-id /><oc:owner-display-name /><oc:share-types /> </d:prop></d:propfind>',$headers);
         
         }
         else
         {
                return   $json;
         }
          
     } 
     //DAV upload file
    public function upload(Request $request)
    {
        $uri = 'PseudoFolder';
        if ($request->query->has('uri')) {
            $uri = $request->input('uri');
        }
        
                
        $res=CommonService::getApiDAVResponse($request,'remote.php/webdav/'.$request->input('uri'),'PUT',$request->getContent());   
         
         if ($res->original['status'] == "204")
         {
             return response()->json(['status' => $res->original['status'], 'message' => "file already exists"]);
         }
        
        return $res;   
    } 
   
     //DAV upload file
     public function uploadgroup(Request $request)
     {
         $uri = 'PseudoFolder';
         if ($request->query->has('uri')) {
             $uri = $request->input('uri');
         }
         
         $res=CommonService::getApiDAVResponse($request,'remote.php/webdav/'.$request->input('uri'),'PUT',$request->getContent());   
         
         if ($res->original['status'] == "500")
         {
            $res=CommonService::getApiDAVResponse($request,'remote.php/webdav/'.$request->input('uri'),'PUT',$request->getContent());   

            if ($res->original['status'] == "204")
            {
                return response()->json(['status' => 'success', 'message' => 'Created', 'body' => '']);
            }
         }

           
         
         return $res;
     } 

     //DAV move file
    public function move(Request $request)
    {
        $strCookie = CommonService::getUsernameRequest($request);
        
        $source = '';
        $destination = '';
        $dest = '';
        if ($request->query->has('source')) {
            $source = $request->input('source');
            
            $dest = $request->input('destination');
            
            $destination = env('API_DRIVE_URL').'remote.php/dav/files/'.$strCookie.'/'.$dest;
            
        }
        $headers = array('Destination' => $destination);
        return CommonService::getApiDAVResponse($request,'remote.php/dav/files/'.$strCookie.'/'.$source,'MOVE', null, $headers);     
    }
    
      //DAV move file
    public function restore(Request $request)
    {
        $strCookie = CommonService::getUsernameRequest($request);
        
        $path = '';
        $destination = '';
        if ($request->query->has('path')) { 
            $destination = env('API_DRIVE_URL').'remote.php/dav/trashbin/'.$strCookie.'/restore/'.$request->input('filename');
        }
        $headers = array('Destination' => $destination);
        return CommonService::getApiDAVResponse($request,'remote.php/dav/trashbin/'.$strCookie.'/trash/'.$request->input('path'),'MOVE', null, $headers);     
    }
    
      //DAV move file
    public function copy(Request $request)
    {
        $strCookie = CommonService::getUsernameRequest($request);
        
        $source = '';
        $destination = '';
        if ($request->query->has('source')) {
            $source = $request->input('source');
            $destination = env('API_DRIVE_URL').'remote.php/dav/files/'.$strCookie.'/'.$request->input('destination');
        }
        $headers = array('Destination' => $destination);
        return CommonService::getApiDAVResponse($request,'remote.php/dav/files/'.$strCookie.'/'.$request->input('source'),'COPY', null, $headers);     
    }
    
     //DAV get all files folder
    public function version(Request $request)
    {
        $strCookie = CommonService::getUsernameRequest($request);
        
        return CommonService::getApiDAVResponse($request,'remote.php/dav/versions/'.$strCookie.'/versions/'.$request->input('fileid'),'PROPFIND','<?xml version="1.0"?>
<d:propfind  xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns">
  <d:prop>
    <d:getcontentlength />
    <d:getcontenttype />
    <d:getlastmodified />
  </d:prop>
</d:propfind>');
    }
    
    //DAV get all files folder
    public function restoreversion(Request $request)
    {
        $strCookie = CommonService::getUsernameRequest($request);
        
        $destination = env('API_DRIVE_URL').'remote.php/dav/versions/'.$strCookie.'/restore/target';
        $headers = array('Destination' => $destination);
        return CommonService::getApiDAVResponse($request,$request->input('href'),'MOVE',null,$headers);
    }
    
    
      //add tag
    public function addtag(Request $request)
    {
        
        $body=$request->json()->all();
        
        return CommonService::simpleResponse($request,'remote.php/dav/systemtags/',false,'POST',$body);
    }
    
     //add tag to file
    public function addtagtofile(Request $request)
    {
        $body=$request->json()->all();
        
        return CommonService::simpleResponse($request,'remote.php/dav/systemtags-relations/files/'.$request->input('fileid').'/'.$request->input('id'),false,'PUT',$body);
    }
    
     //remove tag to file
    public function removetagtofile(Request $request)
    {
         
        return CommonService::simpleResponse($request,'remote.php/dav/systemtags-relations/files/'.$request->input('fileid').'/'.$request->input('id'),false,'DELETE');
    }
    
     //remove favorities
    public function removefavorities(Request $request)
    {
        $folder = '';
        if ($request->query->has('path')) {
            $folder = $request->input('path');
        }
        return CommonService::simpleResponse($request,'index.php/apps/files/api/v1/files/'.$folder,true,'POST','{"tags":[]}');
    }
    
    //get  fetch
    public function fetch(Request $request)
    {
        $token='';
        if ($request->query->has('token')) {
            $token = $request->input('token'); 
              
        }
        return CommonService::simpleResponseAll($request, 'index.php/apps/text/session/fetch?documentId='.$request->input('documentId').'&sessionId='.$request->input('sessionId').'&sessionToken='.$request->input('sessionToken').'&token='.$token);
    }
    
    
    
    //get Session
    public function createsession(Request $request)
    {
        if ($request->query->has('token')) {
            $token = $request->input('token'); 
            return CommonService::simpleResponse($request, 'index.php/apps/text/public/session/create?token='.$token.'&guestName=null&forceRecreate=false');
        }
        return CommonService::simpleResponse($request, 'index.php/apps/text/session/create?fileId='.$request->input('fileId').'&filePath='.$request->input('path').'&guestName=null&forceRecreate=false');
    }
    
    //post file sync
    public function sync(Request $request)
    {
        $body=$request->json()->all();
        return CommonService::simpleResponse($request, 'index.php/apps/text/session/sync',false,'POST',$body);
    }
    
    //change file push
    public function push(Request $request)
    {
        
        $body=$request->json()->all();
        return CommonService::simpleResponse($request, 'index.php/apps/text/session/push',false,'POST',$body);
    }
    
    public function closesession(Request $request)
    {
        
        $documentId = '';
        $sessiontoken='';
        $sessionId='';
        if ($request->query->has('documentId')) {
            $documentId = $request->input('documentId'); 
        }
        if ($request->query->has('sessiontoken')) {
            $sessiontoken = $request->input('sessiontoken'); 
        }
        if ($request->query->has('sessionId')) {
            $sessionId = $request->input('sessionId'); 
        }
        return CommonService::simpleResponse($request, 'index.php/apps/text/session/close?documentId='.$documentId.'&sessionId='.$sessionId.'&sessionToken='.$sessiontoken,false);
    }
    
    //get getstoragestat
    public function getstoragestat(Request $request)
    {
        
        $dir = '';
        if ($request->query->has('dir')) {
            $dir = $request->input('dir'); 
        }
        return CommonService::simpleResponse($request, 'index.php/apps/files/ajax/getstoragestats.php?dir='.$dir,true);
    }
    
    //get file
    public function getresourcefile(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        return CommonService::simpleResponse($request, 'ocs/v2.php/collaboration/resources/file/'.$request->input('fileid').'?format='.$format);
    }
    
    //get all recent files
    public function recents(Request $request)
    {
         
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        return CommonService::simpleResponse($request, 'index.php/apps/files/api/v1/recent?format='.$format, true); 
    }
    
    //get all recent files
    public function fictitious(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        return CommonService::simpleResponse($request, 'index.php/apps/files/api/v1/recents?format='.$format, true); 
    }
    
    //get all files recommendation
    public function recommendations(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        return CommonService::simpleResponse($request, 'index.php/apps/recommendations/api/recommendations?format='.$format);  
    }
      //Download a file
    public function urlfilenew(Request $request)
    {
        $uri = $request->input('uri');
           
           $client = new Client([[
            'allow_redirects' => [
            'max'             => 10,        // allow at most 10 redirects.
            'strict'          => true,      // use "strict" RFC compliant redirects.
            'referer'         => true,      // add a Referer header
            'protocols'       => ['http','https']]],'headers' => ['Authorization' => $request->header('Authorization')]]);
        $url=env('API_DRIVE_URL').'remote.php/webdav/'.$uri;
        Log::debug($url);
           return $client->request('GET',$url,['http_errors'=>true]);    
           
    }
     //Download a file
    public function urlfile(Request $request)
    {
        $uri = $request->input('uri');
        
       return response()->json(['status' => '200', 'message' => 'success', 'body' => env('API_DRIVE_URL').'remote.php/webdav/'.$uri]);
         
    }
    //Download a file
    public function download(Request $request)
    {
        try
        { 
            Log::debug($request->headers->all());
            $downloadStartSecret = $request->input('requesttoken');
            $uri = $request->input('uri');//'Photos/Hummingbird.jpg';
            $filename = $request->input('filename');
            $save_as = $request->input('saveAs');
            $request->headers->set('AddressIp', $request->input('AddressIp'));
            $res = CommonService::getApiGetResponse($request, '/remote.php/webdav/'.$uri.'?downloadStartSecret='.$downloadStartSecret);

            // echo '<pre>'; var_dump($res); echo '</pre>'; die();
Log::debug($res->getBody());
            $content_type = $res->getHeaders()["Content-Type"][0]; 
            if (strcmp('200', $res->getStatusCode()) == 0) {
                setcookie("downloadFinish", 1, time() + 10, '/', "", false, false);
                return response($res->getBody())->withHeaders([
                    'Content-Type' => $content_type,
                    'Content-Disposition' => 'attachment; filename='.$save_as,
                    'X-Download-Options' => 'noopen'                    
                ]);
            } else {
                return response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
            }
        } catch (GuzzleHttp\Exception\ClientException $ex) {
            Log::error($ex->getMessage());
            return response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
        }
    }
    
     public function filebody(Request $request)
    {
        try
        {
             
            $uri = $request->input('uri');//'Photos/Hummingbird.jpg';
          
            
            $res = CommonService::getApiGetResponse($request, '/remote.php/webdav/'.$uri);

            
            if (strcmp('200', $res->getStatusCode()) == 0) {
                
                return   $res->getBody() ;
            } else {
                return response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
            }
        } catch (GuzzleHttp\Exception\ClientException $ex) {
            Log::error($ex->getMessage());
            return response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
        }
    }
    
    //Download a file
    public function downloaddav(Request $request)
    {
        try
        {
            $downloadStartSecret = $request->input('requesttoken');
            $uri = $request->input('uri');//'Photos/Hummingbird.jpg';
            $filename = $request->input('filename');
            $save_as = $request->input('saveAs');
            $request->headers->set('AddressIp', $request->input('AddressIp'));
            $res = CommonService::getApiGetResponse($request, '/remote.php/dav/'.$uri.'?downloadStartSecret='.$downloadStartSecret);

            // echo '<pre>'; var_dump($res); echo '</pre>'; die();

            $content_type = $res->getHeaders()["Content-Type"][0]; 
            if (strcmp('200', $res->getStatusCode()) == 0) {
                setcookie("downloadFinish", 1, time() + 10, '/', "", false, false);
                return response($res->getBody())->withHeaders([
                    'Content-Type' => $content_type,
                    'Content-Disposition' => 'attachment; filename='.$save_as,
                    'X-Download-Options' => 'noopen'                    
                ]);
            } else {
                return response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
            }
        } catch (GuzzleHttp\Exception\ClientException $ex) {
            Log::error($ex->getMessage());
            return response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
        }
    }
    
    //Download a file
    public function download_folder(Request $request)
    {
        try
        {
            $downloadStartSecret = $request->input('requesttoken');
            $filename = $request->input('filename');
            $save_as = $request->input('saveAs');
            $request->headers->set('AddressIp', $request->input('AddressIp'));
            if ($request->query->has('files')) {
                $filename = $request->input('files');
                $dir = $request->input('dir');
                $res = CommonService::getApiGetResponse($request, '/index.php/apps/files/ajax/download.php?dir='.$dir.'&files='.$filename.'&downloadStartSecret='.$downloadStartSecret);

            } else {
                $res = CommonService::getApiGetResponse($request, '/index.php/apps/files/ajax/download.php?dir=%2F&files='.$filename.'&downloadStartSecret='.$downloadStartSecret);
            }

            if (strcmp('200', $res->getStatusCode()) == 0) {
                setcookie("downloadFinish", 1, time() + 10, '/', "", false, false);
                return response($res->getBody())->withHeaders([
                    'Content-Type' => 'application/zip',//$content_type,
                    'Content-Disposition' => 'attachment; filename='.$save_as.'.zip',//.$filename,
                    'X-Download-Options' => 'noopen'                    
                ]);
            } else {
                return response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
            }
        } catch (GuzzleHttp\Exception\ClientException $ex) {
            Log::error($ex->getMessage());
            return response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
        }
    }
    
//    //Add file or folder to favorite
//    public function add_to_favorite(Request $request)
//    {
//        $is_remove = $request->input('is-remove');
//        $tags = ($is_remove == true) ? array('') : array('_$!<Favorite>!$_');
//        $uri = $request->input('uri'); //'Documents/11%20(copy).txt';
//        try
//        {
//            $jsonreq = [
//                'form_params' => array(
//                    'tags' => $tags,
//                ),
//            ];
//
//            $strCookie = CommonService::getStrCookie($request);
//            
//            $client = new Client(['headers' => ['Content-Type' => ' application/json', 'Cookie' => $strCookie]]);
//
//            $url = env('API_DRIVE_URL') . 'index.php/apps/files/api/v1/files/' . $uri;
//
//            $res = $client->request('POST', $url, $jsonreq);
//
//            if (strcmp('201', $res->getStatusCode()) == 0) {
//                return $res->getBody();
//            } else {
//                return response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase()], $res->getStatusCode(), ['Access-Control-Allow-Origin' => env('HOST_IP_FRONTEND'), 'Access-Control-Allow-Methods' => '*', 'Access-Control-Allow-Headers' => 'Content-Type, Authorization']); // Status
//            }
//        } catch (GuzzleHttp\Exception\ClientException $ex) {
//
//            Log::error("Client exception error");
//            return response()->json(['token' => '', 'status' => Response::HTTP_UNAUTHORIZED, 'message' => $res->getReasonPhrase()], $res->getStatusCode(), ['Access-Control-Allow-Origin' => env('HOST_IP_FRONTEND'), 'Access-Control-Allow-Methods' => '*', 'Access-Control-Allow-Headers' => 'Content-Type, Authorization']);
//        }
//    }
  
      //Add file or folder to favorite
    public function add_to_favorite(Request $request)
    {
         
        $is_remove = $request->input('is-remove');
        $tags = ($is_remove == 'true') ? '{"tags":[]}' : '{"tags":["_$!<Favorite>!$_"]}';
        $data = json_decode($tags);
        
        $uri = $request->input('uri'); //'Documents/11%20(copy).txt';
         

        
        if ($is_remove == 'true')
        {
            Log::debug("is_remove");
            return CommonService::simpleResponse($request, 'index.php/apps/files/api/v1/filesfavrem/' . $uri,true,'POST',$data); 
        }
        else
        {
            Log::debug("add");
            return CommonService::simpleResponse($request, 'index.php/apps/files/api/v1/filesfav/' . $uri,true,'POST',$data); 
        } 
        // return $res;
       
           
    }
    

										 
														  
		  
													   
																							  
										
																		  
		   
   
																															
			 
		  

    //get files share with others or share with you 
    public function sharedwith(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        
        $tag = true;

        if ($request->query->has('tag')) {
            $tag = $request->input('tag');
        }
        return CommonService::simpleResponse($request, 'ocs/v1.php/apps/files_sharing/api/v1/shares?format='.$format.'&shared_with_me='.$request->input('withme').'&include_tags='.$tag);
//        $jsonres=str_replace(env('HOST_DRIVE'), env('HOST_IP_FRONTEND').'/link', $jsonnew); 
//        return $jsonres;
    }
    
    //get files share with you by remote
    public function sharedwithyouremote(Request $request)
    {   
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
            $tag = true;

            if ($request->query->has('tag')) {
                $tag = $request->input('tag');
            }
            return CommonService::simpleResponse($request, 'ocs/v1.php/apps/files_sharing/api/v1/remote_shares?format='.$format.'&include_tags='.$tag);
    }

 //get shares with others of folder or file
    public function closeproject(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }

         
       
        $path ='';
        if ($request->query->has('path')) {
            $path = $request->input('path');
        }

        $expire_date ='';
        if ($request->query->has('expire_date')) {
            $expire_date = $request->input('expire_date');
        }
        
        $jsonres= CommonService::simpleResponse($request, 'ocs/v2.php/apps/files_sharing/api/v1/closeproject?format='.$format.'&path='.$path.'&reshares=true&expire_date='.$expire_date); 
         $jsonres->setContent(str_replace(env('HOST_DRIVE'), env('DOMAIN_IP_VDESK'), $jsonres->content())); 

        
        return $jsonres;
        
    }


    //get shares with others of folder or file
    public function filesreshares(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $path ='';
        if ($request->query->has('path')) {
            $path = $request->input('path');
        }
        $jsonres= CommonService::simpleResponse($request, 'ocs/v2.php/apps/files_sharing/api/v1/shares?format='.$format.'&path='.$path.'&reshares=true'); 
         $jsonres->setContent(str_replace(env('HOST_DRIVE'), env('DOMAIN_IP_VDESK'), $jsonres->content())); 
        return $jsonres;
        
        }


    //Export Shares
    public function exportshares(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $path ='';
        if ($request->query->has('path')) {
            $path = $request->input('path');
        }
        $jsonres = CommonService::simpleResponse($request, 'ocs/v2.php/apps/files_sharing/api/v1/shares?format='.$format.'&path='.$path.'&reshares=true');
        $jsonres->setContent(str_replace(env('HOST_DRIVE'), env('DOMAIN_IP_VDESK'), $jsonres->content()));

        $jsonrescopy = CommonService::simpleResponse($request, 'ocs/v2.php/apps/files_sharing/api/v1/sharesdouble?format='.$format.'&path='.$path.'&reshares=true');
        $jsonrescopy->setContent(str_replace(env('HOST_DRIVE'), env('DOMAIN_IP_VDESK'), $jsonrescopy->content()));

        $share1 = $jsonres->getData();
        $sharecopy = $jsonrescopy->getData();

         if(!isset($share1->body->ocs))
            return json_encode($share1);

        $share1 = $share1->body->ocs->data;
        if(!isset($sharecopy->body->ocs))
        return json_encode($sharecopy);
        $sharecopy = $sharecopy->body->ocs->data;

        $share = array_merge($share1,$sharecopy);

        $shareInfo['path'] = $path;

        $headers = ["Nominativo","UID/Matr.","Email","Data Condivisione","Diritti"];

        $data = [];
        if(count($share)) {
            if($request->cookies->has('nc_username')) {
                $loggedUser = $request->cookie()['nc_username'];
                if($share[0]->uid_file_owner != $loggedUser) {
                    return json_Encode(['status'=>401,'message'=>"You aren't the owner of this share!",'body'=>'']);
                }
            }

                //$shareInfo['owner'] = $share[0]->displayname_file_owner . " (" . $share[0]->uid_file_owner . ")";
                $shareInfo['owner'] = $share[0]->displayname_file_owner;

                foreach($share as $shuser) {

                    if($shuser->share_type == 3) {
                        continue;
                    }

                    $row = [];
                    $uid = $shuser->share_with;
                    //$userInfo = CommonService::simpleResponseAll($request, 'ocs/v2.php/cloud/users/'.$uid,false);
                    $userInfo = CommonService::simpleResponseAll($request, 'ocs/v2.php/apps/vdeskintegration/userdata',false,'POST',["userId"=>$uid]);
                    $userInfo = json_decode($userInfo);
                    $userInfo = $userInfo->UserData;

                    $row['firstname'] = '';
                    $row['lastname'] = '';
                    if($userInfo->isGuest) {
                        if(isset($userInfo->GuestUserData->nome))
                            $row['firstname'] = $userInfo->GuestUserData->nome;
                        if(isset($userInfo->GuestUserData->cognome))
                            $row['lastname'] = $userInfo->GuestUserData->cognome;
                    }

                    if($userInfo->isSAMLUser) {
                        if(isset($userInfo->SAMLUserData->nome))
                            $row['firstname'] = $userInfo->SAMLUserData->nome;
                        if(isset($userInfo->SAMLUserData->cognome))
                            $row['lastname'] = $userInfo->SAMLUserData->cognome;
                    }

                    if($row['firstname'] == '' && $row['lastname'] == '') {
                        $row['firstname'] = $shuser->share_with_displayname;
                    }
                $row['note'] = $shuser->note;
                    $row['displayname'] = $shuser->share_with_displayname;
                    $row['uid'] = $shuser->share_with;
                    $row['email'] = $userInfo->emailAddress;
                    $row['sharedAt'] = date("d/m/Y H:i", $shuser->stime);
                    $row['expiration'] = $shuser->expiration;
                    switch($shuser->permissions) {
                        case '1' : $permstr = 'R'; break;
                    }

                    $row['permissions'] = $shuser->permissions;
                    $data[] = $row;
                }


        }

        /** EXPORT IN CSV FORMAT */
        /*
        $fp = fopen('php://temp', 'r+');

        fputcsv($fp, ["Risorsa: ", $shareInfo['path']]);
        fputcsv($fp, ["Proprietario: ", $shareInfo['owner']]);

        fputcsv($fp, []);

        fputcsv($fp, $headers);
        foreach ( $data as $line ) {
            fputcsv($fp, $line);
        }
        rewind($fp);
        $csvstring = fread($fp, 1048576);
        fclose($fp);

        $output = base64_encode($csvstring);
        */
        /** ----------- */


        /** EXPORT IN JSON FORMAT */
        $result['shareInfo'] = $shareInfo;
        $result['data'] = $data;
        /** --------------------- */

        $output = json_encode($result);

        return $output;
    }
    
    //get shares with me of folder or file
    public function filessharedwithme(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $path ='';
        if ($request->query->has('path')) {
            $path = $request->input('path');
        }
        return CommonService::simpleResponse($request, 'ocs/v2.php/apps/files_sharing/api/v1/shares?format='.$format.'&path='.$path.'&shared_with_me=true');
    }
    
    //get shares with me of folder or file
    public function deletedshares(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $tag = true;
        if ($request->query->has('tag')) {
            $tag = $request->input('tag');
        }
        return CommonService::simpleResponse($request,'ocs/v2.php/apps/files_sharing/api/v1/deletedshares?format='.$format.'&include_tags='.$tag);
    }

										  
													 
		
						  
		
												
												   
			
		

																																																												   
		 
	
     //get users to share file or folder
	
									   
     public function sharedsearch(Request $request)
     {
 
         
         $format='json';
         if (empty($request->input('search'))) {
             $search = "";
            
         }
         else
         {
             $search = $request->input('search');
            
         }
        
         if ($request->query->has('format')) {
             $format = $request->input('format');
         }
            
         $resShare=CommonService::simpleResponse($request, 'ocs/v1.php/apps/files_sharing/api/v1/sharees?format='.$format.'&search='.$request->input('search').'&nodeId='.$request->input('nodeId').'&lookup=false&perPage=800&itemType=folder');   
         if (env('CUSTOMCUSTOMER')!=="TIM")
         {
             
             return $resShare;
         }
          
         $resDataShare = $resShare->getData();
         $UserShare= $resDataShare->body->ocs->data->users;
         $UserShareExact= $resDataShare->body->ocs->data->exact->users;
         $reqbody='{"search":"'.$request->input('search').'","typeapp":["VSHARE"]}';
 
         $reqbodyjson = json_decode($reqbody, true); 
     
         $resUser=CommonService::simpleResponse($request, 'ocs/v1.php/apps/vdesk_tim/usersforapps',true,'POST',$reqbodyjson);  
 
         $stream = $resUser;
         $resData = $stream->getData();
         $UserApps= $resData->body->UserApps;
         $subUserShare =[];
         $subUserShareExact= [];
 
         foreach ($UserShare as $user)
         {
              
             if ($search=="")
             {
                 $subUserShare[] = (object)$user;
             }
             else
             {
                  if ((strpos(strtolower($user->value->shareWith), strtolower($search))!== false)|| (strpos(strtolower($user->label), strtolower($search))!== false))
                 {
                     $subUserShare[] = (object)$user;
                 }
             }
            
         }
 
         foreach ($UserShareExact as $user)
         {
             if ($search=="")
             {
                 $subUserShareExact[] = (object)$user;
             }
             else
             {
                 if ((strpos(strtolower($user->value->shareWith), strtolower($search))!== false)|| (strpos(strtolower($user->label), strtolower($search))!== false))
                 {
                     $subUserShareExact[] = (object)$user;
                 }
             }
         }
 
         $subuserExact=[];
         $subuser=[];
         Log::debug($UserShare);
         foreach ($subUserShare as $user) {
             foreach ($UserApps as $userapp) {
                 if (($userapp->userId==$user->value->shareWith))
                 {
                     $subuser[]=(object)$user;
                     $subuser[]=(object)$user;
                 } 
             } 
             
         }
         foreach ($subUserShareExact as $user) {
             foreach ($UserApps as $userapp) {
                 if (($userapp->userId==$user->value->shareWith))
                 {
                     $subuserExact[]=(object)$user;
                     
                 } 
             } 
             
         }
         $finalSubuser  = array();
         $finalSubuserExact  = array();
         foreach ($subuser as $current) {
             if ( ! in_array($current, $finalSubuser)) {
                 $finalSubuser[] = $current;
             }
         }
         foreach ($subuserExact as $current) {
             if ( ! in_array($current, $finalSubuserExact)) {
                 $finalSubuserExact[] = $current;
             }
         }
         // $resDataShare->body->ocs->data->users = $subuser;
         // $resDataShare->body->ocs->data->exact->users = $subuserExact;
         $resDataShare->body->ocs->data->users = $finalSubuser;
         $resDataShare->body->ocs->data->exact->users = $finalSubuserExact;
          $resDataOcs=$resDataShare->body;
         return  response()->json(['status' => Response::HTTP_OK, 'message' => 'success', 'body' => $resDataOcs]);
         
     } 
    
     //get users to share file or folder
    public function shareesrecommended(Request $request)
    {
        Log::debug("cas aS");
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        return CommonService::simpleResponse($request, '/ocs/v1.php/apps/files_sharing/api/v1/sharees_recommended?format='.$format.'&itemType=file');   
    } 
    
    
    public function shares(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $data = $request->json()->all();  
        
        $data["label"]='https://'.env('DOMAIN_IP_VDESK').'/index.php/f/';
        
        $jsonres= CommonService::simpleResponse($request, 'ocs/v2.php/apps/files_sharing/api/v1/shares?format='.$format,true,'POST',$data); 
         $jsonres->setContent(str_replace(env('HOST_DRIVE'), env('DOMAIN_IP_VDESK'), $jsonres->content())); 
        return $jsonres;
    }
    
    public function convertlink(Request $request)
    {
         
        $url='';
        if ($request->query->has('url')) {
            $url = $request->input('url');
        }
         
        
        $url=str_replace(env('DOMAIN_IP_VDESK'),env('HOST_DRIVE'), $url); 
       //call api login 
         $client = new Client([[
       'allow_redirects' => [
       'max'             => 10,        // allow at most 10 redirects.
       'strict'          => true,      // use "strict" RFC compliant redirects.
       'referer'         => true,      // add a Referer header
       'protocols'       => ['http','https']]]]);
       $res = $client->request('GET',$url,['http_errors'=>false]);
      
        if (strcmp('200',$res->getStatusCode())==0)
        {
            //read html response
            $dom = new \DOMDocument;
            @$dom->loadHTML($res->getBody());
            
            if ($dom->getElementById('body-login') !== null)
            {
                return response()->json(['ispassword' => true,'name' => '','dataowner'=>'','dispalyname'=>'','dataprotected'=>'','url' => $url.'/download','hidedownload'=>false]);

            } 
            else if ($dom->getElementById('save-external-share') !== null)
            {
            
                $namefile="";
                $dataowner="";
                $dispalyname="";
                $dataprotected="false";
                $hidedownload="false";
            
             
                $heads = $dom->getElementById('save-external-share')->attributes;
             
                foreach($heads as $head)
                {  
                    if ($head->nodeName=='data-name')
                    {
                        $namefile=$head->nodeValue;
                    }
                     if ($head->nodeName=='data-owner')
                    {
                        $dataowner=$head->nodeValue;
                    }
                     if ($head->nodeName=='data-owner-display-name')
                    {
                        $dispalyname=$head->nodeValue;
                    }

                    if ($head->nodeName=='data-protected')
                    {
                        $dataprotected =$head->nodeValue;
                    }
                }

              
            return response()->json(['ispassword' => false,'name' => $namefile,'dataowner'=>$dataowner,'dispalyname'=>$dispalyname,'dataprotected'=>$dataprotected,'url' => $url.'/download','hidedownload'=>false]);

            }
            else {
                
                    $namefile="";
                $dataowner="";
                $dispalyname="";
                $dataprotected="false";
                //retrive token by field data-requesttoken in head 
                $hidedownload="true";

                 if ($dom->getElementById('filename') !== null)
                 {
                      
                     $values=$dom->getElementById('filename')->attributes;
                     
                    foreach ($values as $value) {
                        if ($value->nodeName=='value')
                        {
                            $namefile= $value->nodeValue;
                        }
                    }
                 }
                if ($dom->getElementById('sharingUserId') !== null)
                 {
                    $values=$dom->getElementById('sharingUserId')->attributes;
                     
                    foreach ($values as $value) {
                        if ($value->nodeName=='value')
                        {
                            $dataowner= $value->nodeValue;
                        }
                    }
                    
                 }
                     
                      
                      
                    
                
                return response()->json(['ispassword' => false,'name' => $namefile,'dataowner'=>$dataowner,'dispalyname'=>$dispalyname,'dataprotected'=>$dataprotected,'url' => $url.'/download','hidedownload'=>true]);

           }  
            
            
             

           // return  response()->json(['token' => $token,'status' => $res->getStatusCode()]);
        }
        else
        {
            return  response()->json(['status' => $res->getStatusCode(),'message'=>$res->getReasonPhrase(),'body'=>'']);
        }
        
            
                   
          
         
         
          
         
    }
    
    public function updateshare(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $data = $request->json()->all();
       if(array_key_exists('password', $data)) {
             
            if ($data['password']=='')
            {
                $data['password']='';
            }
        }
        if(array_key_exists('expireDate', $data)){
            if ($data['expireDate']=='')
            {
                $data['expireDate']='';
            }
        }
        $jsonres=CommonService::simpleResponse($request, 'ocs/v2.php/apps/files_sharing/api/v1/shares/'.$request->input('id').'?format='.$format,true,'PUT',$data); 
     $jsonres->setContent(str_replace(env('HOST_DRIVE'), env('DOMAIN_IP_VDESK'), $jsonres->content())); 
        return $jsonres;
        
            }

    public function deleteshare(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        return CommonService::simpleResponse($request, 'ocs/v2.php/apps/files_sharing/api/v1/shares/'.$request->input('id').'?format='.$format,true,'DELETE'); 
    }
    
    //get pec files
    public function pec(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        return CommonService::simpleResponse($request, 'apps/mail/api/v1/pec?format='.$format, true); 
    }
    
    
    //get all recent files
    public function labels(Request $request)
    {
       // return CommonService::simpleResponse($request, 'ocs/v1.php/apps/files_external/api/v1/mounts?format=json', true); 
        return ""; 
    }
    
    //get all recent files
    public function mounts(Request $request)
    {
         $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        return CommonService::simpleResponse($request, 'ocs/v1.php/apps/files_external/api/v1/mounts?format='.$format, true); 
    }

    //get detail file
    public function detail(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        return CommonService::simpleResponse($request, 'ocs/v2.php/apps/activity/api/v2/activity/filter?format='.$format.'&object_type=files&object_id='.$request->input('fileid'), true); 
    }
    
    
    
    //get detail file
    public function search(Request $request)
    {
         $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        return CommonService::simpleResponse($request, 'index.php/core/search?query='.$request->input('query').'&inapps%5B%5D='.$request->input('inapps').'&page='.$request->input('page').'&size='.$request->input('size').'&format='.$format, true); 
    }
    
    //get detail file
    public function getbodyfile(Request $request)
    {
        
        $streambuffer=CommonService::simpleResponseAll($request, 'remote.php/files/'.$request->input('uri'),true); 
         Log::debug($streambuffer);
        $tempFile = tempnam(sys_get_temp_dir(), 'File_').'.txt';   
        $tempFile1 = tempnam(sys_get_temp_dir(), 'Mio_').'.mp4'; 
       
      
        file_put_contents($tempFile1, $streambuffer);
         
        return $streambuffer;
    }
    
    //get detail file
    public function getbodyfileurl(Request $request)
    {
        
        $streambuffer=CommonService::simpleResponseAll($request, 'remote.php/files/'.$request->input('uri'),true); 
         
        $tempFile = tempnam(sys_get_temp_dir(), 'File_').'.txt';   
        $tempFile1 = tempnam(sys_get_temp_dir(), $request->input('uri')); 
       
      
        file_put_contents($tempFile1, $streambuffer);
         
        return $tempFile1;
    }
    
    //get detail file
    public function preview(Request $request)
    {
        $fileId=-1;
        if ($request->query->has('fileId')) {
            $fileId = $request->input('fileId');
        }
         $tag='false';
        if ($request->query->has('tag')) {
            $tag = $request->input('tag');
        }
         $x=32;
        if ($request->query->has('x')) {
            $x= $request->input('x');
        }
         $y=32;
        if ($request->query->has('y')) {
            $y = $request->input('y');
        }
       return CommonService::simpleResponseAll($request, 'index.php/core/preview?fileId='.$fileId.'&c='.$tag.'&x='.$x.'&y='.$y.'&forceIcon=0'); 
    }
    //get detail file
    public function thumbnail(Request $request)
    { 
         $x=32;
        if ($request->query->has('x')) {
            $x= $request->input('x');
        }
         $y=32;
        if ($request->query->has('y')) {
            $y = $request->input('y');
        }
        $path='';
        if ($request->query->has('path')) {
            $path = $request->input('path');
        }
       return CommonService::simpleResponseAll($request, 'index.php/apps/files/api/v1/thumbnail/'.$x.'/'.$y.'/'.$path); 
    }
    
    
     //DAV get all files folder
    public function filespublic(Request $request)
    {
        $strCookie="";
       
        $folder = '';
        if ($request->query->has('path')) {
            $folder = $request->input('path');
        }
        $depth=1;
        if ($request->query->has('depth')) {
            $depth = $request->input('depth');
        }
        $authorization = "";
        if ($request->query->has('authorization')) {
            $authorization = $request->input('authorization');
        }
        $headers = array('Depth' => $depth,'Authorization'=>$authorization);
        return CommonService::getApiDAVResponse($request,'public.php/webdav/'.$folder,'PROPFIND','<?xml version="1.0"?><d:propfind  xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns" xmlns:ocs="http://open-collaboration-services.org/ns"><d:prop><d:getlastmodified /><d:getetag /><d:getcontenttype /><d:resourcetype /><oc:fileid /><oc:permissions /><oc:size /><d:getcontentlength /><nc:has-preview /><nc:mount-type /><nc:is-encrypted /><ocs:share-permissions /></d:prop></d:propfind>',$headers);
    }
    
     //DAV delete file
     public function deletepublic(Request $request)
    {
             
         if ($request->query->has('authorization')) {
            $authorization = $request->input('authorization');
        }
        $headers = array('Authorization'=>$authorization);
        $uri = 'PseudoFolder';
        if ($request->query->has('uri')) {
            $uri = $request->input('uri');
        }
        return CommonService::getApiDAVResponse($request,'public.php/webdav/'.$request->input('uri'),'DELETE','',$headers);     
    }

     public function createfolderpublic(Request $request)
    {
         if ($request->query->has('authorization')) {
            $authorization = $request->input('authorization');
        }
        $headers = array('Authorization'=>$authorization);
        $folder = '';
        if ($request->query->has('folder')) {
            $folder = $request->input('folder');
        }
        return CommonService::getApiDAVResponse($request,'public.php/webdav/'.$folder,'MKCOL','',$headers);
    }
    
     //DAV upload file
    public function newfilepublic(Request $request)
    {
        if ($request->query->has('authorization')) {
            $authorization = $request->input('authorization');
        }
        $headers = array('Authorization'=>$authorization);
        $uri = 'PseudoFolder';
        if ($request->query->has('filename')) {
            $uri = $request->input('filename');
        }
        
        return CommonService::getApiDAVResponse($request,'public.php/webdav/'.$request->input('filename'),'PUT','',$headers);     
    } 
    
     //DAV upload file
    public function uploadpublic(Request $request)
    {
         if ($request->query->has('authorization')) {
            $authorization = $request->input('authorization');
        }
        $headers = array('Authorization'=>$authorization);
        $uri = 'PseudoFolder';
        if ($request->query->has('uri')) {
            $uri = $request->input('uri');
        }
        
        return CommonService::getApiDAVResponse($request,'public.php/webdav/'.$request->input('uri'),'PUT',$request->getContent(),$headers);     
    } 
   
     //DAV move file
    public function movepublic(Request $request)
    {
        if ($request->query->has('authorization')) {
            $authorization = $request->input('authorization');
        }
         
        $source = '';
        $destination = '';
        if ($request->query->has('source')) {
            $source = $request->input('source');
            $destination = env('API_DRIVE_URL').'public.php/webdav/'.$request->input('destination');
        }
        $headers = array('Authorization'=>$authorization,'Destination' => $destination);
        return CommonService::getApiDAVResponse($request,'public.php/webdav/'.$request->input('source'),'MOVE', null, $headers);     
    }
    
     
    
      //DAV move file
    public function copypublic(Request $request)
    {
        if ($request->query->has('authorization')) {
            $authorization = $request->input('authorization');
        }
        $source = '';
        $destination = '';
        if ($request->query->has('source')) {
            $source = $request->input('source');
            $destination = env('API_DRIVE_URL').'public.php/webdav/'.$request->input('destination');
        }
        $headers = array('Authorization'=>$authorization,'Destination' => $destination);
        return CommonService::getApiDAVResponse($request,'public.php/webdav/'.$request->input('source'),'COPY', null, $headers);     
    }
    
   
    //Download a file
    public function downloadshare_public(Request $request)
    {
        try
        {
             $onRedirect = function(
                   RequestInterface $request,
                   ResponseInterface $response,
                   UriInterface $uri
               ) {


               };
                 $jar = new \GuzzleHttp\Cookie\CookieJar();

               $client = new Client( [
               'allow_redirects' => [
               'max'             => 5,        // allow at most 10 redirects.
               'strict'          => true,      // use "strict" RFC compliant redirects.
               'referer'         => true,      // add a Referer header
               'protocols'       => ['http','https'], // only allow https URLs
               'on_redirect'     => $onRedirect,
               'track_redirects' => true],'cookies' => $jar,'http_errors'=>false]);
               //take token

               $data = $request->json()->all();
           $token='';

           if ($request->query->has('token')) {
               $token = $request->input('token');
           }
           $res = $client->request('GET', env('API_DRIVE_URL').'index.php/csrftoken');   
               $resptoken = json_decode($res->getBody(),true);
             $jsonreq=[
                   'multipart' => [
                       [
                           'name' => 'password',
                           'contents' => $data['password'],
                       ],
                       [
                           'name' => 'sharingToken',
                           'contents' => $data['sharingToken'],
                       ],
                       [
                           'name' => 'requesttoken', 
                           'contents' => $resptoken['token'],
                       ]
                       ]
               ];
  
           $res = $client->request('POST', env('API_DRIVE_URL').'index.php/s/'.$token.'/authenticate/downloadShare',$jsonreq);

//            $token="";
//            if ($request->query->has('token')) {
//                $token = $request->input('token');
//            }
//            Log::debug("qui1");
//            $res0 = CommonService::simpleResponse($request,'/index.php/s/'.$token.'/download',false);
//            if (strcmp('200', $res0->getStatusCode()) == 0) {
//                Log::debug("qui2");
//                $data = $request->json()->all();  
//                $res = CommonService::getApiGetResponse($request, '/index.php/s/'.$token.'/authenticate/downloadShare',false,'POST',$data);
                if (strcmp('200', $res->getStatusCode()) == 0) {
                    Log::debug($res->getHeaders());
                    $request->headers->add($res->getHeaders());
                     $res2 = CommonService::simpleResponse($request,'index.php/s/'.$token.'/download',false,null,null,true);
                    
                   return $res2;
                } else {
                    return response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
                }
//            }
        } catch (GuzzleHttp\Exception\ClientException $ex) {
            Log::error($ex->getMessage());
            return response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
        }
    }

// //Download a file
// public function download_public(Request $request)
// {
//     try
//     {
//         if ($request->query->has('authorization')) {
//         $request->headers->add(['Authorization' => $request->input('authorization')]);
      
//          }
//         $downloadStartSecret = $request->input('requesttoken');
        
//         $save_as = $request->input('saveAs');
//         $token="";
//         if ($request->query->has('token')) {
//             $token = $request->input('token');
//         }
//         $filename = $request->input('files');
//         $dir = "\\";
//         $dir = $request->input('dir');
//         $res = CommonService::getApiGetResponse($request, 'index.php/s/'.$token.'/download?path='.$dir.'&files='.$filename.'&downloadStartSecret='.$downloadStartSecret);
// //$res = CommonService::getApiGetResponse($request, '/index.php/s/'.$token.'/download?downloadStartSecret='.$downloadStartSecret);

//         // echo '<pre>'; var_dump($res); echo '</pre>'; die();

//         $content_type = $res->getHeaders()["Content-Type"][0]; 
//         $content_type = $this->get_mime_type($save_as); 
//         if (strcmp('200', $res->getStatusCode()) == 0) {
//             setcookie("downloadFinish", 1, time() + 10, '/', "", false, false);
//             return response($res->getBody())->withHeaders([
//                 'Content-Type' => $content_type,
//                 'Content-Disposition' => 'attachment; filename='.$save_as,
//                 'X-Download-Options' => 'noopen'                    
//             ]);
//         } else {
//             return response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
//         }
//     } catch (GuzzleHttp\Exception\ClientException $ex) {
//         Log::error($ex->getMessage());
//         return response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
//     }
// }

    //Download a file
    public function download_public(Request $request)
    {
        try
        {
            
            
            $save_as = $request->input('saveAs');
            $token="";
            if ($request->query->has('token')) {
                $token = $request->input('token');
            }
            $filename = $request->input('files');
            $request->headers->set('AddressIp', $request->input('AddressIp'));
            $dir = "\\";
            $dir = $request->input('dir');
            $password = "";
            if ($request->query->has('password')) {
                $password = $request->input('password');
            }
            $onRedirect = function(
                RequestInterface $request,
                ResponseInterface $response,
                UriInterface $uri
            ) {
 
 
            }; 

              $jar = new \GuzzleHttp\Cookie\CookieJar();
 
            $client = new Client( [
            'allow_redirects' => [
            'max'             => 5,        // allow at most 10 redirects.
            'strict'          => true,      // use "strict" RFC compliant redirects.
            'referer'         => true,      // add a Referer header
            'protocols'       => ['http','https'], // only allow https URLs
            'on_redirect'     => $onRedirect,
            'track_redirects' => true],'cookies' => $jar,'http_errors'=>false]);
            //take token
 
            
        
 
            
          $jsonreq=[
                'multipart' => [
                    [
                        'name' => 'password',
                        'contents' => $password,
                    ]
                    ]
            ];
            
           
            $res = $client->request('POST', env('API_DRIVE_URL').'index.php/s/'.$token.'/authenticate/showAuthenticate',$jsonreq);


            $res = $client->request('GET', env('API_DRIVE_URL').'index.php/s/'.$token.'/download?path='.$dir.'&files='.$filename);
   
  
            $content_type = $res->getHeaders()["Content-Type"][0]; 
            $content_type = $this->get_mime_type($save_as); 
            if (strcmp('200', $res->getStatusCode()) == 0) {
                setcookie("downloadFinish", 1, time() + 10, '/', "", false, false);
                return response($res->getBody())->withHeaders([
                    'Content-Type' => $content_type,
                    'Content-Disposition' => 'attachment; filename='.$save_as,
                    'X-Download-Options' => 'noopen'                    
                ]);
            } else {
                return response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
            }
        } catch (GuzzleHttp\Exception\ClientException $ex) {
            Log::error($ex->getMessage());
            return response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
        }
    }
    


    function get_mime_type($filename) {
    $idx = explode( '.', $filename );
    $count_explode = count($idx);
    $idx = strtolower($idx[$count_explode-1]);

    $mimet = array( 
        'txt' => 'text/plain',
        'htm' => 'text/html',
        'html' => 'text/html',
        'php' => 'text/html',
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'xml' => 'application/xml',
        'swf' => 'application/x-shockwave-flash',
        'flv' => 'video/x-flv',

        // images
        'png' => 'image/png',
        'jpe' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'jpg' => 'image/jpeg',
        'gif' => 'image/gif',
        'bmp' => 'image/bmp',
        'ico' => 'image/vnd.microsoft.icon',
        'tiff' => 'image/tiff',
        'tif' => 'image/tiff',
        'svg' => 'image/svg+xml',
        'svgz' => 'image/svg+xml',

        // archives
        'zip' => 'application/zip',
        'rar' => 'application/x-rar-compressed',
        'exe' => 'application/x-msdownload',
        'msi' => 'application/x-msdownload',
        'cab' => 'application/vnd.ms-cab-compressed',

        // audio/video
        'mp3' => 'audio/mpeg',
        'qt' => 'video/quicktime',
        'mov' => 'video/quicktime',

        // adobe
        'pdf' => 'application/pdf',
        'psd' => 'image/vnd.adobe.photoshop',
        'ai' => 'application/postscript',
        'eps' => 'application/postscript',
        'ps' => 'application/postscript',

        // ms office
        'doc' => 'application/msword',
        'rtf' => 'application/rtf',
        'xls' => 'application/vnd.ms-excel',
        'ppt' => 'application/vnd.ms-powerpoint',
        'docx' => 'application/msword',
        'xlsx' => 'application/vnd.ms-excel',
        'pptx' => 'application/vnd.ms-powerpoint',


        // open office
        'odt' => 'application/vnd.oasis.opendocument.text',
        'ods' => 'application/vnd.oasis.opendocument.spreadsheet',
    );

    if (isset( $mimet[$idx] )) {
     return $mimet[$idx];
    } else {
     return 'application/octet-stream';
    }
 }
    
    //Download a file
    public function download_folder_public(Request $request)
    {
        try
        {
            


            $save_as = $request->input('saveAs');
            $token="";
            if ($request->query->has('token')) {
                $token = $request->input('token');
            }
            $filename = $request->input('files');
            $request->headers->set('AddressIp', $request->input('AddressIp'));
            $dir = "\\";
            $dir = $request->input('dir');
            $password = "";
            if ($request->query->has('password')) {
                $password = $request->input('password');
            }
            $onRedirect = function(
                RequestInterface $request,
                ResponseInterface $response,
                UriInterface $uri
            ) {
 
 
            }; 

              $jar = new \GuzzleHttp\Cookie\CookieJar();
 
            $client = new Client( [
            'allow_redirects' => [
            'max'             => 5,        // allow at most 10 redirects.
            'strict'          => true,      // use "strict" RFC compliant redirects.
            'referer'         => true,      // add a Referer header
            'protocols'       => ['http','https'], // only allow https URLs
            'on_redirect'     => $onRedirect,
            'track_redirects' => true],'cookies' => $jar,'http_errors'=>false]);
            //take token
 
            
        
 
            
          $jsonreq=[
                'multipart' => [
                    [
                        'name' => 'password',
                        'contents' => $password,
                    ]
                    ]
            ];
            
           
            $res = $client->request('POST', env('API_DRIVE_URL').'index.php/s/'.$token.'/authenticate/showAuthenticate',$jsonreq);

            $res = $client->request('GET', env('API_DRIVE_URL').'index.php/s/'.$token.'/download?path='.$dir.'&files='.$filename);
   
            

            if (strcmp('200', $res->getStatusCode()) == 0) {
                setcookie("downloadFinish", 1, time() + 10, '/', "", false, false);
                return response($res->getBody())->withHeaders([
                    'Content-Type' => 'application/zip',//$content_type,
                    'Content-Disposition' => 'attachment; filename='.$save_as.'.zip',//.$filename,
                    'X-Download-Options' => 'noopen'                    
                ]);
            } else {
                return response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
            }
        } catch (GuzzleHttp\Exception\ClientException $ex) {
            Log::error($ex->getMessage());
            return response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
        }
    }
    
	public function viewpublic(Request $request)
{
    if ($request->query->has('token')) {
        $token = $request->input('token');
    }
    $jar = new \GuzzleHttp\Cookie\CookieJar();

    $client = new Client( ['http_errors'=>false]);
    $url=env('API_DRIVE_URL').'index.php/s/'.$token;
    $res = $client->request('GET', $url);
    return response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => $res->getBody()]);
}
    
// public function authenticate($password,$token)
// {
//     $onRedirect = function(
//         RequestInterface $request,
//         ResponseInterface $response,
//         UriInterface $uri
//     ) {


//     };
//       $jar = new \GuzzleHttp\Cookie\CookieJar();

//     $client = new Client( [
//     'allow_redirects' => [
//     'max'             => 5,        // allow at most 10 redirects.
//     'strict'          => true,      // use "strict" RFC compliant redirects.
//     'referer'         => true,      // add a Referer header
//     'protocols'       => ['http','https'], // only allow https URLs
//     'on_redirect'     => $onRedirect,
//     'track_redirects' => true],'cookies' => $jar,'http_errors'=>false]);
//     //take token
//     $redirect="";
//     $jsonreq=[
//         'multipart' => [
//             [
//                 'name' => 'password',
//                 'contents' => $password,
//             ]
//             ]
//     ];
//     $res = $client->request('POST', env('API_DRIVE_URL').'index.php/s/'.$token.'/authenticate\/'.$redirect,$jsonreq);

// }

     //Download a file
    public function getpassword(Request $request)
    {
        try
        {
            $onRedirect = function(
                   RequestInterface $request,
                   ResponseInterface $response,
                   UriInterface $uri
               ) {


               };
                 $jar = new \GuzzleHttp\Cookie\CookieJar();

               $client = new Client( [
               'allow_redirects' => [
               'max'             => 5,        // allow at most 10 redirects.
               'strict'          => true,      // use "strict" RFC compliant redirects.
               'referer'         => true,      // add a Referer header
               'protocols'       => ['http','https'], // only allow https URLs
               'on_redirect'     => $onRedirect,
               'track_redirects' => true],'cookies' => $jar,'http_errors'=>false]);
               //take token

               $data = $request->json()->all();
           $token='';
 
           if ($request->query->has('token')) {
               $token = $request->input('token');
           }
           $res = $client->request('GET', env('API_DRIVE_URL').'index.php/csrftoken');   
               $resptoken = json_decode($res->getBody(),true);

               
             $jsonreq=[
                   'multipart' => [
                       [
                           'name' => 'password',
                           'contents' => $data['password'],
                       ],
                       [
                           'name' => 'sharingToken',
                           'contents' => $data['sharingToken'],
                       ],
                       [
                           'name' => 'requesttoken', 
                           'contents' => $resptoken['token'],
                       ]
                       ]
               ];
               
           $res = $client->request('POST', env('API_DRIVE_URL').'index.php/s/'.$token.'/authenticate/showShare',$jsonreq);
          
           foreach($jar->toArray() as $item)
           {
               $name = $item['Name'];
               Log::debug($item['Value']);
            //    if ($name==env('OCSSESSION'))
            //    {
                   Log::debug($item['Value']);
                   setcookie($name, $item['Value'], $item['Expires'],$item['Path'],env('HOST_IP_FRONTEND'));


                   if ((float)phpversion()>=7.3) {
                        setcookie($item['Name'], $item['Value'], [
                            'expires' => $item['Expires'],
                            'path' => $item['Path'],
                            'domain' => env('DOMAIN_IP_FRONTEND'),
                            'secure' => true,
                            'samesite' => 'None'
                        ]);
                    } else {
                        setcookie($name, $item['Value'], $item['Expires'],$item['Path']."; SameSite=None",env('DOMAIN_IP_FRONTEND'),true);
                    }
            //    }
           }

           $url=env('API_DRIVE_URL').'index.php/s/'.$token;
           if (strcmp('200',$res->getStatusCode())==0)
           { 
               $dom = new \DOMDocument;
               @$dom->loadHTML($res->getBody());
                 
                          $heads = $dom->getElementsByTagName('head')->item(0)->attributes;
                foreach($heads as $head)
                {
                    if ($head->nodeName=='data-requesttoken')
                    {
                        $token=$head->nodeValue;
                    }
                }
               if ($dom->getElementById('body-login') !== null)
               {
                   Log::debug('body-login');

                   Log::debug(env('API_DRIVE_URL').'index.php/s/'.$token);
          
                  
                  return response()->json(['ispassword' => true,'name' => '','dataowner'=>'','dispalyname'=>'','dataprotected'=>'','url' => $url.'/download','hidedownload'=>false,'message'=>'error password']);

               } else if ($dom->getElementById('save-external-share')!==null){

                    Log::debug('save-external-share');
                   $namefile="";
                   $dataowner="";
                   $dispalyname="";
                   $dataprotected="false";
                   //retrive token by field data-requesttoken in head 
                   $heads = $dom->getElementById('save-external-share')->attributes;
                   foreach($heads as $head)
                   {  
                       if ($head->nodeName=='data-name')
                       {
                           $namefile=$head->nodeValue;
                       }
                        if ($head->nodeName=='data-owner')
                       {
                           $dataowner=$head->nodeValue;
                       }
                        if ($head->nodeName=='data-owner-display-name')
                       {
                           $dispalyname=$head->nodeValue;
                       }

                       if ($head->nodeName=='data-protected')
                       {
                           $dataprotected =$head->nodeValue;
                       }
                   }
                   
                
                 return response()->json(['ispassword' => false,'name' => $namefile,'dataowner'=>$dataowner,'dispalyname'=>$dispalyname,'dataprotected'=>$dataprotected,'url' => $url.'/download','hidedownload'=>false,'message'=>$res->getStatusCode()]);
               }
               else
               {
                   Log::debug('hide');
                      $namefile="";
                   $dataowner="";
                   $dispalyname="";
                   $dataprotected="false";
                   //retrive token by field data-requesttoken in head 
                   $hidedownload="true";

                    if ($dom->getElementById('filename') !== null)
                    {

                        $values=$dom->getElementById('filename')->attributes;

                       foreach ($values as $value) {
                           if ($value->nodeName=='value')
                           {
                               $namefile= $value->nodeValue;
                           }
                       }
                    }
                   if ($dom->getElementById('sharingUserId') !== null)
                    {
                       $values=$dom->getElementById('sharingUserId')->attributes;

                       foreach ($values as $value) {
                           if ($value->nodeName=='value')
                           {
                               $dataowner= $value->nodeValue;
                           }
                       }

                    }
                   return response()->json(['ispassword' => false,'name' => $namefile,'dataowner'=>$dataowner,'dispalyname'=>$dispalyname,'dataprotected'=>$dataprotected,'url' => $url.'/download','hidedownload'=>true,'message'=>$res->getStatusCode()]);
               }
           }
           else {
                Log::debug($res->getStatusCode());
               return response()->json(['ispassword' => true,'name' => '','dataowner'=>'','dispalyname'=>'','dataprotected'=>'','url' => $url.'/download','hidedownload'=>false,'message'=>$res->getStatusCode()]);
           }
        } catch (GuzzleHttp\Exception\ClientException $ex) {
            Log::error($ex->getMessage());
            return response()->json(['ispassword' => true,'name' => '','dataowner'=>'','dispalyname'=>'','dataprotected'=>'','url' => $url.'/download','hidedownload'=>false,'message'=>$ex->getMessage()]);
        }
         
    }
    
   public function config_onlyoffice(Request $request)
    {
        $fileid = $request->input('fileid'); 
        $filepath = $request->input('filepath'); 
        $sharetoken = $request->input('sharetoken');
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $res = CommonService::simpleResponse($request, 'index.php/apps/onlyoffice/ajax/config/'.$fileid.'?filePath='.$filepath.'&shareToken='.$sharetoken,true);
        if (strcmp('200',$res->getStatusCode())==0)
        { 
            $resLogRead = CommonService::simpleResponse($request, 'ocs/v1.php/apps/vdeskintegration/logCollectorRead?path='.$filepath,true,'GET');
        }
        
        return $res; 
    }
    
    public function new_onlyoffice(Request $request)
    {
        
        $data = $request->json()->all();
        Log::debug($data);
        $authorization = "";
        if ($request->query->has('authorization')) {
            $authorization = $request->input('authorization');
        }
        $headers = array('Authorization'=>$authorization);

        $res = CommonService::simpleResponse($request,'index.php/apps/onlyoffice/ajax/new',true,'POST',$data);
        if (strcmp('200',$res->getStatusCode())==0)
        { 
            $resLogRead = CommonService::simpleResponse($request, 'ocs/v1.php/apps/vdeskintegration/logCollectorNew?path='.$data["name"],true,'GET');
        }
        return $res;
    }
    
    public function new_onlyoffice_password(Request $request)
    {
        $data = $request->json()->all();
        $password = "";
        if ($request->query->has('password')) {
            $password = $request->input('password');
        }
        $onRedirect = function(
            RequestInterface $request,
            ResponseInterface $response,
            UriInterface $uri
        ) {


        }; 

          $jar = new \GuzzleHttp\Cookie\CookieJar();

        $client = new Client( [
        'allow_redirects' => [
        'max'             => 5,        // allow at most 10 redirects.
        'strict'          => true,      // use "strict" RFC compliant redirects.
        'referer'         => true,      // add a Referer header
        'protocols'       => ['http','https'], // only allow https URLs
        'on_redirect'     => $onRedirect,
        'track_redirects' => true],'cookies' => $jar,'http_errors'=>false,'headers' => ['OCS-APIREQUEST' => true]]);
        //take token

        
    

        
      $jsonreq=[
            'multipart' => [
                [
                    'name' => 'password',
                    'contents' => $password,
                ]
                ]
        ];
        
       
        $res = $client->request('POST', env('API_DRIVE_URL').'index.php/s/'.$data['shareToken'].'/authenticate/showAuthenticate',$jsonreq);

       
        Log::debug($data);
        $res = $client->request('POST', env('API_DRIVE_URL').'index.php/apps/onlyoffice/ajax/new',['http_errors' => false, 'json' => $data]);
        $arrayJson = json_decode($res->getBody());
      return  response()->json(['status' => Response::HTTP_OK, 'message' => 'success', 'body' => $arrayJson]);
       // return CommonService::simpleResponse($request,'index.php/apps/onlyoffice/ajax/new',true,'POST',$data);
    }

     public function save_onlyoffice(Request $request)
    {
        
        $data = $request->json()->all();
        Log::debug($data);

        return CommonService::simpleResponse($request,'index.php/apps/onlyoffice/ajax/save',true,'POST',$data);
    }
    
     public function convert_onlyoffice(Request $request)
    {
        
        $data = $request->json()->all();
        Log::debug($data);

        return CommonService::simpleResponse($request,'index.php/apps/onlyoffice/ajax/convert',true,'POST',$data);
    }
    
     public function truck_onlyoffice(Request $request)
    {
        
        $data = $request->json()->all();
        Log::debug($data);

        return CommonService::simpleResponse($request,'index.php/apps/onlyoffice/truck',true,'POST',$data);
    }
    
     public function getfile_onlyoffice(Request $request)
    {
        
           $fileid = $request->input('fileid'); 

        return CommonService::simpleResponse($request,'index.php/apps/onlyoffice/'.$fileid,true,'GET');
    }
     public function getfile_public_onlyoffice(Request $request)
    {
        
           $shareToken = $request->input('shareToken'); 

        return CommonService::simpleResponse($request,'index.php/apps/onlyoffice/s/'.$shareToken,true,'GET');
    }
     public function url_onlyoffice(Request $request)
    {
        
         

        return CommonService::simpleResponse($request,'index.php/apps/onlyoffice/ajax/url',true,'GET');
    }
    
     public function download_onlyoffice(Request $request)
    {
        
         

        return CommonService::simpleResponse($request,'index.php/apps/onlyoffice/download',true,'GET');
    }
    
     public function empty_onlyoffice(Request $request)
    {
        
         

        return CommonService::simpleResponse($request,'index.php/apps/onlyoffice/aempty',true,'GET');
    }


    //DAV get all files folder
    public function shareWithVMeet(Request $request)
    {
        try
        {
            $strCookie = CommonService::getUsernameRequest($request);
            $json = $request->getContent();  
            $data = json_decode($json);
            $path=$data->path;
            $users = $data->shareWith;
           
            foreach($users as $user)
            {
                Log::debug($user);
                $format='json';
                if ($request->query->has('format')) {
                    $format = $request->input('format');
                }
                $json="{
                    'shareType': 0,
                    'shareWith': '".$user."',
                    'permissions': 27,
                    'path': '".$path."',
                    'target':'".$path."'
                }";
                $json = str_replace('\'', '"', $json);
                Log::debug($json);
                $data=json_decode($json);
                //$data=json_encode($data);
                $jsonres= CommonService::simpleResponse($request, 'ocs/v2.php/apps/files_sharing/api/v1/shares?format='.$format,true,'POST',$data); 
               // $jsonres->setContent(str_replace(env('HOST_DRIVE'), env('DOMAIN_IP_VDESK'), $jsonres->content())); 

               
               
               if (substr($jsonres->original['status'], 0, 1 ) !='2')
               {
                   Log::debug("mio ".$user);
                   return response()->json(['status' => $jsonres->original['status'], 'message' => $jsonres->original['message']. " " .$user, 'body' => '']);
               }
               Log::debug($jsonres->original['message']);
            }
            return response()->json(['status' => 'OK', 'message' => 'Allegato condiviso', 'body' => $jsonres->original['body']]); 
        }
        catch (GuzzleHttp\Exception\ClientException $ex) {
            Log::error($ex->getMessage());
            return response()->json(['status' => 'KO', 'message' => $ex->getMessage(), 'body' => '']);
        }
       
    }
      

     

     //DAV get all files folder
     public function shareAndCopy(Request $request)
     {
        try
        {
            $strCookie = CommonService::getUsernameRequest($request);
            $json = $request->getContent();  
            $data = json_decode($json);
            $destinationpath=$data->destinationpath;
            $path = $data->path;
            $users = $data->shareWith;
            $destination = '';
            if ($path!='') {
                $destination = env('API_DRIVE_URL').'remote.php/dav/files/'.$strCookie.'/'.$destinationpath;
                Log::debug($destination);
            }
            $headers = array('Destination' => $destination);
            $res = CommonService::getApiDAVResponse($request,'remote.php/dav/files/'.$strCookie.'/'.$path,'COPY', null, $headers); 
           // $res =json_decode($res);
           
            if (isset($res->original['message']) && $res->original['status']=='success')
            {
                Log::debug($res->original['message']);
                foreach($users as $user)
                {
                    Log::debug($user);
                    $format='json';
                    if ($request->query->has('format')) {
                        $format = $request->input('format');
                    }
                    $json="{
                        'shareType': 0,
                        'shareWith': '".$user."',
                        'permissions': 27,
                        'path': '".$destinationpath."',
                        'target':'".$destinationpath."'
                    }";
                    $json = str_replace('\'', '"', $json);
                    Log::debug($json);
                    $data=json_decode($json);
                    //$data=json_encode($data);
                    $jsonres= CommonService::simpleResponse($request, 'ocs/v2.php/apps/files_sharing/api/v1/shares?format='.$format,true,'POST',$data); 
                    if (substr($jsonres->original['status'], 0, 1 ) !='2')
                    {
                        Log::debug("mio ".$user);
                        return response()->json(['status' => $jsonres->original['status'], 'message' => $jsonres->original['message']. " " .$user, 'body' => '']);
                    }
                   
                // $jsonres->setContent(str_replace(env('HOST_DRIVE'), env('DOMAIN_IP_VDESK'), $jsonres->content())); 
                }

                
                return response()->json(['status' => 'OK', 'message' => 'Allegato condiviso', 'body' => $jsonres->original['body']]);
            }
            else
            {
                
                if (substr($res->original['status'], 0, 1 ) ==='s')
                {
                    return response()->json(['status' => 'KO', 'message' => 'File già stato copiato', 'body' => '']);
                }
                else
                {
                    return response()->json(['status' => $res->original['status'], 'message' => $res->original['message'], 'body' => '']);
                }
                
                
            } 
        }
        catch (GuzzleHttp\Exception\ClientException $ex) {
            Log::error($ex->getMessage());
            return response()->json(['status' => 'KO', 'message' => $ex->getMessage(), 'body' => '']);
        }
     }



     public function attachFromVshare(Request $request) {
        
        $response = [];
       
        $values = $request->json()->all();
         
        $sharewith = '';
        $destinationpath =  env('FOLDER_VMEET') . '/'.$values['fileNameWithGuid'];
        $participants= $values['participants'];
        $filePath = $values["filePath"];
        

        $size = count($participants);
        foreach($participants as $key => $participant) {
            if($key != $size-1){
                $sharewith .= '"'.$participant.'",';
            } else {
                $sharewith .= '"'.$participant.'"';
            }
        }
        $sharewith = '['.$sharewith.']';
        
        $json='{
            "shareWith": '.$sharewith.',
            "path": "'.$filePath.'",
            "destinationpath":"'.$destinationpath.'"
            }';
        $res=$this->shareAndCopyVmeet($request,$json);
        // $res = json_decode($res);
        if ($res->original['status'] == "KO")
        {
            return response()->json(['status' => 'KO', 'message' => $res->original['message'], 'body' => '']); 
        }
        $resarray = $this->passtovmeet($request);
 
        $resarray = json_decode($resarray,true);
        if ($resarray['performed']==true)
        {
            return response()->json(['status' => 'OK', 'message' => 'Allegato condiviso', 'body' => $res->original['body']]);
        }
        else
        {
            return response()->json(['status' => 'KO', 'msg' => $resarray["msg"], 'body' => '']);
        }
        return $resarray;        
    }

    //DAV get all files folder
    public function shareAndCopyVmeet(Request $request,string $jsonvmeet)
    {
        try
        {
            $strCookie = CommonService::getUsernameRequest($request);
            
            $data = json_decode($jsonvmeet);
            $destinationpath=$data->destinationpath;
            $path = $data->path;
            $users = $data->shareWith;
            $destination = '';
            if ($path!='') {
                $destination = env('API_DRIVE_URL').'remote.php/dav/files/'.$strCookie.'/'.$destinationpath;
                Log::debug($destination);
            }
            $headers = array('Destination' => $destination);
            $res = CommonService::getApiDAVResponse($request,'remote.php/dav/files/'.$strCookie.'/'.$path,'COPY', null, $headers); 
            // $res =json_decode($res);
            
            if (isset($res->original['message']) && $res->original['status']=='success')
            {
                Log::debug($res->original['message']);
                foreach($users as $user)
                {
                    Log::debug($user);
                    $format='json';
                    if ($request->query->has('format')) {
                        $format = $request->input('format');
                    }
                    $json="{
                        'shareType': 0,
                        'shareWith': '".$user."',
                        'permissions': 27,
                        'path': '".$destinationpath."',
                        'target':'".$destinationpath."'
                    }";
                    $json = str_replace('\'', '"', $json);
                    Log::debug($json);
                    $data=json_decode($json);
                    //$data=json_encode($data);
                    $jsonres= CommonService::simpleResponse($request, 'ocs/v2.php/apps/files_sharing/api/v1/shares?format='.$format,true,'POST',$data); 
                    if (substr($jsonres->original['status'], 0, 1 ) !='2')
                    {
                         
                        return response()->json(['status' => 'KO', 'message' => $jsonres->original['message']. " " .$user, 'body' => '']);
                    }
                    
                // $jsonres->setContent(str_replace(env('HOST_DRIVE'), env('DOMAIN_IP_VDESK'), $jsonres->content())); 
                }

                
                return response()->json(['status' => 'OK', 'message' => 'Allegato condiviso', 'body' => $jsonres->original['body']]);
            }
            else
            {
                
                if (substr($res->original['status'], 0, 1 ) ==='s')
                {
                    return response()->json(['status' => 'KO', 'message' => 'File già stato copiato', 'body' => '']);
                }
                else
                {
                    return response()->json(['status' => 'KO', 'message' => $res->original['message'], 'body' => '']);
                }
                
                
            } 
        }
        catch (GuzzleHttp\Exception\ClientException $ex) {
            Log::error($ex->getMessage());
            return response()->json(['status' => 'KO', 'message' => $ex->getMessage(), 'body' => '']);
        }
    }


     public function passtovmeet(Request $request)
     {
         
        if ($request->query->has('format')) {
            if ($request->input('format') != 'json') {
                $iscontent = true;
            }
        }
       // $json = $request->getContent();
        $json=$request->json()->all();
        Log::debug($json);
        $strCookie = CommonService::getStrCookie($request);
        $client = new Client([[
            'allow_redirects' => [
                'max'             => 10,        // allow at most 10 redirects.
                'strict'          => true,      // use "strict" RFC compliant redirects.
                'referer'         => true,      // add a Referer header
                'protocols'       => ['http', 'https']
            ]
        ], 'headers' => ['Authorization' => $request->header('Authorization'), 'requesttoken' => $request->input('requesttoken'), 'Cookie' => $strCookie,'origin'=> $request->header('origin'),'user-agent'=> env('USER_AGENT', 'Bridge'),'AddressIp'=>$request->header('AddressIp')]]);
    
        try {
           
             $res = $client->request('POST', 'https://vmeet-be.dev.liveboxcloud.com/api/attachfromvshare', ['http_errors' => false,'json' => $json]);
            
              

                return  $res->getBody();
            
        } catch (\GuzzleHttp\Exception\RequestException $ex) {
            return   json_encode([
					  
                "performed" => false,
                "msg" => $ex->getMessage()
            ]);
        } 
 
         
     }

     public function shareFromVshare(Request $request) {
        
        $response = [];
       
        $values = $request->json()->all();
         
        $sharewith = '';
        $destinationpath =  env('FOLDER_VMEET') . '/'.$values['fileNameWithGuid'];
        $participants= $values['participants'];
        

        $size = count($participants);
        foreach($participants as $key => $participant) {
            if($key != $size-1){
                $sharewith .= '"'.$participant.'",';
            } else {
                $sharewith .= '"'.$participant.'"';
            }
        }
        $sharewith = '['.$sharewith.']';
        
        $json='{
            "shareWith": '.$sharewith.',
            "destinationpath":"'.$destinationpath.'"
            }';
        $res=$this->shareVmeet($request,$json);
        // $res = json_decode($res);
        if ($res->original['status'] == "KO")
        {
            return response()->json(['status' => 'KO', 'message' => $res->original['message'], 'body' => '']); 
        }
        $resarray = $this->passtovmeetshare($request);
        Log::debug("casa1");
        $resarray = json_decode($resarray,true);
		
        if ($resarray['performed']==true)
        {
            return response()->json(['status' => 'OK', 'message' => 'Allegato condiviso', 'body' => $res->original['body']]);
        }
        else
        {
            return response()->json(['status' => 'KO', 'msg' => $resarray["msg"], 'body' => '']);
        }
        return $resarray;        
    }

     //DAV get all files folder
     public function shareVmeet(Request $request,string $jsonvmeet)
     {
         try
         {
             $strCookie = CommonService::getUsernameRequest($request);
             
             $data = json_decode($jsonvmeet);
             $destinationpath=$data->destinationpath;
             $users = $data->shareWith;
            
            foreach($users as $user)
            {
                Log::debug($user);
                $format='json';
                if ($request->query->has('format')) {
                    $format = $request->input('format');
                }
                $json="{
                    'shareType': 0,
                    'shareWith': '".$user."',
                    'permissions': 27,
                    'path': '".$destinationpath."',
                    'target':'".$destinationpath."'
                }";
                $json = str_replace('\'', '"', $json);
                Log::debug($json);
                $data=json_decode($json);
                //$data=json_encode($data);
                $jsonres= CommonService::simpleResponse($request, 'ocs/v2.php/apps/files_sharing/api/v1/shares?format='.$format,true,'POST',$data); 
                if (substr($jsonres->original['status'], 0, 1 ) !='2')
                {
                    Log::debug("mio ".$user);
                    return response()->json(['status' => 'KO', 'message' => $jsonres->original['message']. " " .$user, 'body' => '']);
                }
            }
            return response()->json(['status' => 'OK', 'message' => 'Allegato condiviso', 'body' => $jsonres->original['body']]);
         }
         catch (GuzzleHttp\Exception\ClientException $ex) {
             Log::error($ex->getMessage());
             return response()->json(['status' => 'KO', 'message' => $ex->getMessage(), 'body' => '']);
         }
     }

     public function passtovmeetshare(Request $request)
     {
         
        if ($request->query->has('format')) {
            if ($request->input('format') != 'json') {
                $iscontent = true;
            }
        }
       // $json = $request->getContent();
        $json=$request->json()->all();
        Log::debug($json);
        $strCookie = CommonService::getStrCookie($request);
        $client = new Client([[
            'allow_redirects' => [
                'max'             => 10,        // allow at most 10 redirects.
                'strict'          => true,      // use "strict" RFC compliant redirects.
                'referer'         => true,      // add a Referer header
                'protocols'       => ['http', 'https']
            ]
        ], 'headers' => ['Authorization' => $request->header('Authorization'), 'requesttoken' => $request->input('requesttoken'), 'Cookie' => $strCookie,'origin'=> $request->header('origin'),'user-agent'=> env('USER_AGENT', 'Bridge'),'AddressIp'=>$request->header('AddressIp')]]);
    
        try {
            
             $res = $client->request('POST', 'https://vmeet-be.dev.liveboxcloud.com/api/attachfromvsharehidden', ['http_errors' => true,'json' => $json]);
            
			 

             return  $res->getBody();
            
        } catch (\GuzzleHttp\Exception\RequestException $ex) {
           
            return   json_encode([
                "performed" => false,
                "msg" => $ex->getMessage()
            ]);
        } 
 
         
     }

//get shares with others of folder or file
    public function finddatecloseproject(Request $request)
    {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }

        $path ='';
        if ($request->query->has('path')) {
            $path = $request->input('path');
        }

        $jsonres= CommonService::simpleResponse($request, 'ocs/v2.php/apps/files_sharing/api/v1/finddatecloseproject?format='.$format.'&path='.$path.'&reshares=true');
        $jsonres->setContent(str_replace(env('HOST_DRIVE'), env('DOMAIN_IP_VDESK'), $jsonres->content()));


        return $jsonres;

    }

     //get shares with others of folder or file
     public function filesresharesdouble(Request $request)
     {
         $format='json';
         if ($request->query->has('format')) {
             $format = $request->input('format');
         }
         $path ='';
         if ($request->query->has('path')) {
             $path = $request->input('path');
         }
         $jsonres= CommonService::simpleResponse($request, 'ocs/v2.php/apps/files_sharing/api/v1/sharesdouble?format='.$format.'&path='.$path.'&reshares=true');
         $jsonres->setContent(str_replace(env('HOST_DRIVE'), env('DOMAIN_IP_VDESK'), $jsonres->content()));
         return $jsonres;

     }

      public function getsoursefileid(Request $request)
     {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $res = CommonService::simpleResponse($request, 'ocs/v2.php/apps/activity/api/v2/activity/filter?format='.$format.'&object_type=files&object_id='.$request->input('fileid'), true); 
         
         
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $strCookie = CommonService::getUsernameRequest($request);
         
         
        
        try
        {
             
            $uri =  $res->original['body']->ocs->data[0]->object_name;
          
            
            $res = CommonService::getApiGetResponse($request, '/remote.php/webdav/'.$uri);

            
            if (strcmp('200', $res->getStatusCode()) == 0) {
                
                return   $res->getBody() ;
            } else {
                return response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
            }
        } catch (GuzzleHttp\Exception\ClientException $ex) {
            Log::error($ex->getMessage());
            return response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
        }
        
     }

     public function getinfofileid(Request $request)
     {
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $res = CommonService::simpleResponse($request, 'ocs/v2.php/apps/activity/api/v2/activity/filter?format='.$format.'&object_type=files&object_id='.$request->input('fileid'), true); 
         
         
        $format='json';
        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        $strCookie = CommonService::getUsernameRequest($request);
        $folder = $res->original['body']->ocs->data[0]->object_name;
         
        
        try
        {
             
            
            
            $format='json';
            if ($request->query->has('format')) {
                $format = $request->input('format');
            }
            $strCookie = CommonService::getUsernameRequest($request);
            
            $folder = '';
            
                $folder = $res->original['body']->ocs->data[0]->object_name;
            
            
            $depth=1;
            if ($request->query->has('depth')) {
                $depth = $request->input('depth');
            }
            $headers = array('Depth' => $depth);
             
            return CommonService::getApiDAVResponse($request,'remote.php/dav/files/'.$strCookie.'/'.$folder.'?format='.$format,'PROPFIND','<?xml version="1.0"?><d:propfind  xmlns:d="DAV:"   xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns" xmlns:ocs="http://open-collaboration-services.org/ns"><d:prop><d:getlastmodified /><d:getetag /><d:getcontenttype /><d:resourcetype /><oc:fileid /><oc:permissions /><oc:size /><d:getcontentlength /><nc:has-preview /><nc:mount-type /><nc:is-encrypted /><ocs:share-permissions /><oc:tags /><oc:favorite /><oc:comments-unread /><oc:owner-id /><oc:owner-display-name /><oc:share-types /> </d:prop></d:propfind>',$headers);
        
        } catch (GuzzleHttp\Exception\ClientException $ex) {
            Log::error($ex->getMessage());
            return response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
        }
        
     }

       // delete file
      public function deletefileingroup(Request $request)
      {
         $strCookie = CommonService::getUsernameRequest($request);
         
         $uri = 'PseudoFolder';
         if ($request->query->has('uri')) {
             $uri = $request->input('uri');
         }
  
         $res= CommonService::getApiDAVResponse($request,'remote.php/dav/files/'.$strCookie.'/'.$request->input('uri'),'DELETE',''); 
            
         if ($res->original['status'] == "500")
         {
             $res=CommonService::getApiDAVResponse($request,'remote.php/dav/files/'.$strCookie.'/'.$request->input('uri'),'DELETE','');   
   
             if ($res->original['status'] == "204")
             {
                  return response()->json(['status' => 'success', 'message' => 'delete', 'body' => '']);
             }
          }
          if ($res->original['status'] == "204")
          {
               return response()->json(['status' => 'success', 'message' => "delete", 'body' => '']);
          }
              
            
          return $res;
        } 

}


