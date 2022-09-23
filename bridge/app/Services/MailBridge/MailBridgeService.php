<?php

namespace App\Services\MailBridge;

use App\Services\CommonService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

/**
 * Description of MailBridgeService
 *
 * @author raffr
 */
class MailBridgeService
{
    public function makeRequest(Request $request, string $url, string $method)
    {
        $res = CommonService::getMailApiResponse($request, $url, $method);
       // $resData = json_encode($res);
        $stream = $res->getBody();
        $resData = (string)$stream->getContents();
        $response = new Response($resData, $res->getStatusCode(), $res->getHeaders());
        return $response;
    }

    public function postRequestProxy(Request $request)
    {
        $baseOCS = 'ocs/v1.php/apps/drivemailcore/';
        $requestEndpoint = $request->path();
        //sanitize from "api/v1/"
        $requestEndpoint = str_replace('api/v1/', '', $requestEndpoint);
        Log::debug($requestEndpoint);
        $url = $baseOCS . $requestEndpoint;
       
        return $this->makeRequest($request, $url, 'POST');
    }

    public function getRequestProxy(Request $request)
    {
        $baseOCS = 'ocs/v1.php/apps/drivemailcore/';
        $requestEndpoint = $request->path();
        //sanitize from "api/v1/"
        $requestEndpoint = str_replace('api/v1/', '', $requestEndpoint);
        $url = $baseOCS . $requestEndpoint;
        return $this->makeRequest($request, $url, 'GET');
    }

    // public function get(Request $request)
    // {
    //     // $url = 'index.php/apps/drivemailcore/api/v1/mail/get';
    //     $url = 'ocs/v1.php/apps/drivemailcore/mail/get';
    //     return $this->makeRequest($request, $url, 'POST');
    // }

    // public function setFlag(Request $request)
    // {
    //     $url = 'ocs/v1.php/apps/drivemailcore/mail/setflag';
    //     return $this->makeRequest($request, $url, 'POST');
    // }

    // public function moveMail(Request $request)
    // {
    //     $url = 'ocs/v1.php/apps/drivemailcore/mail/move';
    //     return $this->makeRequest($request, $url, 'POST');
    // }

    // public function deleteMail(Request $request)
    // {
    //     $url = 'ocs/v1.php/apps/drivemailcore/mail/delete';
    //     return $this->makeRequest($request, $url, 'POST');
    // }

    // public function send(Request $request)
    // {
    //     $params = new ParameterBag($request->json()->all());

    //     //decompress data
    //     $attachments = $params->get('attachments');
    //     $realAttachments = [];
    //     if (isset($attachments)) {
    //         foreach ($attachments as $attachment) {
    //             $realAttach = [];
    //             $realAttach['fileName'] = $attachment['fileName'];
    //             $realAttach['contentType'] = $attachment['contentType'];
    //             //Decode and decompress
    //             $attachData = base64_decode($attachment['base64_content']);
    //             $attachData = gzcompress($attachData);
    //             $realAttach['base64_content'] = base64_encode($attachData);
    //             array_push($realAttachments, $realAttach);
    //         }
    //         if (count($realAttachments) > 0) {
    //             $params->set('attachments', $realAttachments);
    //             $params->set('attachsCompressed', true);
    //             $request->setJson($params);
    //         }
    //     }

    //     $url = 'ocs/v1.php/apps/drivemailcore/mail/send';
    //     return $this->makeRequest($request, $url, 'POST');
    // }

    // public function getFolder(Request $request)
    // {
    //     $url = 'ocs/v1.php/apps/drivemailcore/mail/folder/get';
    //     return $this->makeRequest($request, $url, 'POST');
    // }

    // public function createFolder(Request $request)
    // {
    //     $url = 'ocs/v1.php/apps/drivemailcore/mail/folder/create';
    //     return $this->makeRequest($request, $url, 'POST');
    // }

    // public function deleteFolder(Request $request)
    // {
    //     $url = 'ocs/v1.php/apps/drivemailcore/mail/folder/delete';
    //     return $this->makeRequest($request, $url, 'POST');
    // }

    // public function renameFolder(Request $request)
    // {
    //     $url = 'ocs/v1.php/apps/drivemailcore/mail/folder/rename';
    //     return $this->makeRequest($request, $url, 'POST');
    // }

    // public function saveAttachmentToDriveById(Request $request)
    // {
    //     $url = 'ocs/v1.php/apps/drivemailcore/saveattachmentbyid';
    //     return $this->makeRequest($request, $url, 'GET');
    // }

    // public function getPecFileList(Request $request)
    // {
    //     $url = 'ocs/v1.php/apps/drivemailcore/mail/getpecfilelist';
    //     return $this->makeRequest($request, $url, 'GET');
    // }

    // /**USER CONFIG ROUTES*/

    // public function getConfig(Request $request)
    // {
    //     $url = 'ocs/v1.php/apps/drivemailcore/config/account/get';
    //     return $this->makeRequest($request, $url, 'GET');
    // }

    // public function getAccount(Request $request)
    // {
    //     $url = 'ocs/v1.php/apps/drivemailcore/config/account/list';
    //     return $this->makeRequest($request, $url, 'GET');
    // }

    // public function setConfig(Request $request)
    // {
    //     $url = 'ocs/v1.php/apps/drivemailcore/config/account/set';
    //     return $this->makeRequest($request, $url, 'POST');
    // }

    // public function deleteAccount(Request $request)
    // {
    //     $url = 'ocs/v1.php/apps/drivemailcore/config/account/delete';
    //     return $this->makeRequest($request, $url, 'POST');
    // }

    // public function addAccount(Request $request)
    // {
    //     $url = 'ocs/v1.php/apps/drivemailcore/config/account/add';
    //     return $this->makeRequest($request, $url, 'POST');
    // }

    // public function updateAccount(Request $request)
    // {
    //     $url = 'ocs/v1.php/apps/drivemailcore/config/account/update';
    //     return $this->makeRequest($request, $url, 'POST');
    // }

    // public function activateAccount(Request $request)
    // {
    //     $url = 'ocs/v1.php/apps/drivemailcore/config/account/activation';
    //     return $this->makeRequest($request, $url, 'POST');
    // }

    // public function getChanges(Request $request)
    // {
    //     $url = 'ocs/v1.php/apps/drivemailcore/mail/getchanges';
    //     return $this->makeRequest($request, $url, 'POST');
    // }

    // public function getDomains(Request $request)
    // {
    //     $url = 'ocs/v1.php/apps/drivemailcore/getdomains';
    //     return $this->makeRequest($request, $url, 'GET');
    // }

    // public function addDomain(Request $request)
    // {
    //     $url = 'ocs/v1.php/apps/drivemailcore/config/admin/domain/add';
    //     return $this->makeRequest($request, $url, 'POST');
    // }

    // public function deleteDomain(Request $request)
    // {
    //     $url = 'ocs/v1.php/apps/drivemailcore/config/admin/domain/delete';
    //     return $this->makeRequest($request, $url, 'POST');
    // }

    // public function getAdminConfig(Request $request)
    // {
    //     $url = 'ocs/v1.php/apps/drivemailcore/config/admin/get';
    //     return $this->makeRequest($request, $url, 'GET');
    // }

    // public function setAdminConfig(Request $request)
    // {
    //     $url = 'ocs/v1.php/apps/drivemailcore/config/admin/get';
    //     return $this->makeRequest($request, $url, 'POST');
    // }

    // public function emptyTrash(Request $request)
    // {
    //     $url = 'ocs/v1.php/apps/drivemailcore/emptytrash';
    //     return $this->makeRequest($request, $url, 'POST');
    // }
}
