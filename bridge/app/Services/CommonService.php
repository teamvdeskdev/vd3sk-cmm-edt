<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Cookie;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\UriInterface;
use PHPUnit\Framework\Assert;

use GuzzleHttp\Cookie\CookieJar;
use GuzzleHttp\RequestOptions;
use stdClass;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of CommonService
 *
 * @author raffr
 */
class CommonService
{
    //put your code here
    public static function getApiGetResponseAuth(Request $request, $url, $ocs = false, $method = null)
    {
        // $strCookie='nc_username='.$request->cookie()['nc_username'].'; oc_sessionPassphrase='.$request->cookie()['oc_sessionPassphrase'].'; nc_token='.$request->cookie()['nc_token'].'; nc_session_id='.$request->cookie()['nc_session_id'].'; nc_sameSiteCookiestrict='.$request->cookie()['nc_sameSiteCookiestrict'].'; '.env('OCSSESSION').'='.$request->cookie()[env('OCSSESSION')].'; nc_sameSiteCookielax='.$request->cookie()['nc_sameSiteCookielax'];  
        $strCookie = CommonService::getStrCookie($request);

        if ($ocs) {
            $client = new Client(['headers' => ['Authorization' => $request->input('authorization'), 'requesttoken' => $request->input('requesttoken'), 'Cookie' => $strCookie, 'OCS-APIREQUEST' => true,'origin'=> $request->header('origin'),'user-agent'=> env('USER_AGENT', 'Bridge'),'AddressIp'=>$request->header('AddressIp')]]);
        } else {
            $client = new Client(['headers' => ['Authorization' => $request->input('authorization'), 'requesttoken' => $request->input('requesttoken'), 'Cookie' => $strCookie,'origin'=> $request->header('origin'),'user-agent'=> env('USER_AGENT', 'Bridge'),'AddressIp'=>$request->header('AddressIp')]]);
        }
       
        if (isset($method)) {
            if ($method == 'PROPFIND') {
                $res = $client->request($method, env('API_DRIVE_URL') . $url, ['http_errors' => false, 'body' => '<?xml version="1.0"?><d:propfind  xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns" xmlns:ocs="http://open-collaboration-services.org/ns"><d:prop><d:getlastmodified /><d:getetag /><d:getcontenttype /><d:resourcetype /><oc:fileid /><oc:permissions /><oc:size /><d:getcontentlength /><nc:has-preview /><nc:mount-type /><nc:is-encrypted /><ocs:share-permissions /><oc:tags /><oc:favorite /><oc:comments-unread /><oc:owner-id /><oc:owner-display-name /><oc:share-types /> </d:prop></d:propfind>']);
            } else {
                $res = $client->request($method, env('API_DRIVE_URL') . $url, ['http_errors' => false]);
            }
        } else {
            Log::debug(env('API_DRIVE_URL') . $url);
            $res = $client->request('GET', env('API_DRIVE_URL') . $url, ['http_errors' => false]);
        }
        return $res;
    }

    public static function getApiGetResponse(Request $request, $url, $ocs = false, $method = null)
    {
        // $strCookie='nc_username='.$request->cookie()['nc_username'].'; oc_sessionPassphrase='.$request->cookie()['oc_sessionPassphrase'].'; nc_token='.$request->cookie()['nc_token'].'; nc_session_id='.$request->cookie()['nc_session_id'].'; nc_sameSiteCookiestrict='.$request->cookie()['nc_sameSiteCookiestrict'].'; '.env('OCSSESSION').'='.$request->cookie()[env('OCSSESSION')].'; nc_sameSiteCookielax='.$request->cookie()['nc_sameSiteCookielax'];  
        $strCookie = CommonService::getStrCookie($request);

        Log::debug(env('API_DRIVE_URL') . $url);
        if ($ocs) {

            $client = new Client(['headers' => ['Authorization' => $request->header('Authorization'), 'requesttoken' => $request->input('requesttoken'), 'Cookie' => $strCookie, 'OCS-APIREQUEST' => true,'origin'=> $request->header('origin'),'user-agent'=> env('USER_AGENT', 'Bridge'),'AddressIp'=>$request->header('AddressIp')]]);
        } else {

            $client = new Client(['headers' => ['Authorization' => $request->header('Authorization'), 'requesttoken' => $request->input('requesttoken'), 'Cookie' => $strCookie,'origin'=> $request->header('origin'),'user-agent'=> env('USER_AGENT', 'Bridge'),'AddressIp'=>$request->header('AddressIp')]]);
        }
        if (isset($method)) {
            if ($method == 'PROPFIND') {
                $res = $client->request($method, env('API_DRIVE_URL') . $url, ['http_errors' => false, 'body' => '<?xml version="1.0"?><d:propfind  xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns" xmlns:ocs="http://open-collaboration-services.org/ns"><d:prop><d:getlastmodified /><d:getetag /><d:getcontenttype /><d:resourcetype /><oc:fileid /><oc:permissions /><oc:size /><d:getcontentlength /><nc:has-preview /><nc:mount-type /><nc:is-encrypted /><ocs:share-permissions /><oc:tags /><oc:favorite /><oc:comments-unread /><oc:owner-id /><oc:owner-display-name /><oc:share-types /> </d:prop></d:propfind>']);
            } else {

                $res = $client->request($method, env('API_DRIVE_URL') . $url, ['http_errors' => false]);
            }
        } else {


            $res = $client->request('GET', env('API_DRIVE_URL') . $url, ['http_errors' => false]);
        }
        return $res;
    }

    public static function simpleResponse(Request $request, $url, $ocs = false, $method = null, $body = null, $iscontent = false)
    {
        if ($request->query->has('format')) {
            if ($request->input('format') != 'json') {
                $iscontent = true;
            }
        }
        Log::debug($url);
        // $strCookie='nc_username='.$request->cookie()['nc_username'].'; oc_sessionPassphrase='.$request->cookie()['oc_sessionPassphrase'].'; nc_token='.$request->cookie()['nc_token'].'; nc_session_id='.$request->cookie()['nc_session_id'].'; nc_sameSiteCookiestrict='.$request->cookie()['nc_sameSiteCookiestrict'].'; '.env('OCSSESSION').'='.$request->cookie()[env('OCSSESSION')].'; nc_sameSiteCookielax='.$request->cookie()['nc_sameSiteCookielax'];  
        $strCookie = CommonService::getStrCookie($request);


        if ($ocs) {
            $client = new Client([[
                'allow_redirects' => [
                    'max'             => 10,        // allow at most 10 redirects.
                    'strict'          => true,      // use "strict" RFC compliant redirects.
                    'referer'         => true,      // add a Referer header
                    'protocols'       => ['http', 'https']
                ]
            ], 'headers' => ['Authorization' => $request->header('Authorization'), 'requesttoken' => $request->input('requesttoken'), 'Cookie' => $strCookie, 'OCS-APIREQUEST' => true,'origin'=> $request->header('origin'),'user-agent'=> env('USER_AGENT', 'Bridge'),'AddressIp'=>$request->header('AddressIp')]]);
        } else {
            $client = new Client([[
                'allow_redirects' => [
                    'max'             => 10,        // allow at most 10 redirects.
                    'strict'          => true,      // use "strict" RFC compliant redirects.
                    'referer'         => true,      // add a Referer header
                    'protocols'       => ['http', 'https']
                ]
            ], 'headers' => ['Authorization' => $request->header('Authorization'), 'requesttoken' => $request->input('requesttoken'), 'Cookie' => $strCookie,'origin'=> $request->header('origin'),'user-agent'=> env('USER_AGENT', 'Bridge'),'AddressIp'=>$request->header('AddressIp')]]);
        }

        try {
            if (isset($method)) {
                if (isset($body)) {
                    $res = $client->request($method, env('API_DRIVE_URL') . $url, ['http_errors' => false, 'json' => $body]);
                } else {
                    $res = $client->request($method, env('API_DRIVE_URL') . $url, ['http_errors' => false]);
                }
            } else {
                $res = $client->request('GET', env('API_DRIVE_URL') . $url, ['http_errors' => false]);
            }
            Log::debug($res->getReasonPhrase());
            if (strcmp('200', $res->getStatusCode()) == 0 || strcmp('201', $res->getStatusCode()) == 0) {

                if ($iscontent) {
                    return  $res->getBody();
                } else {

                    $arrayJson = json_decode($res->getBody());
                    return  response()->json(['status' => Response::HTTP_OK, 'message' => 'success', 'body' => $arrayJson]);
                }
            } else {

                return  response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
            }
        } catch (\GuzzleHttp\Exception\ClientException $ex) {
            Log::error($ex->getMessage());
        } finally {
            //            if (strcmp('200',$res->getStatusCode())==0)
            //            { 
            //                Log::debug($res->getBody());
            //                if ($iscontent)
            //                {
            //                    return  $res->getBody();
            //                }
            //                else
            //                {
            //                    Log::debug($res->getBody());
            //                    $arrayJson= json_decode($res->getBody());
            //                    return  response()->json(['status' => Response::HTTP_OK,'message'=>'success','body'=>$arrayJson]);
            //                }
            //                
            //            }
            //            else
            //            {
            //                Log::debug($res->getBody());
            //                return  response()->json(['status' => $res->getStatusCode(),'message'=>$res->getReasonPhrase(),'body'=>'']);
            //            } 
            // return  $res->getBody();
        }
    }

    public static function simpleResponsePost(Request $request, $url, $ocs = false, $method = null, $body = null, $iscontent = false)
    {

        if ($request->query->has('format')) {
            if ($request->input('format') != 'json') {
                $iscontent = true;
            }
        }
        // $strCookie='nc_username='.$request->cookie()['nc_username'].'; oc_sessionPassphrase='.$request->cookie()['oc_sessionPassphrase'].'; nc_token='.$request->cookie()['nc_token'].'; nc_session_id='.$request->cookie()['nc_session_id'].'; nc_sameSiteCookiestrict='.$request->cookie()['nc_sameSiteCookiestrict'].'; '.env('OCSSESSION').'='.$request->cookie()[env('OCSSESSION')].'; nc_sameSiteCookielax='.$request->cookie()['nc_sameSiteCookielax'];  
        $strCookie = CommonService::getStrCookie($request);
        if ($ocs) {
            $client = new Client(['headers' => ['Authorization' => $request->header('Authorization'), 'requesttoken' => $request->input('requesttoken'), 'Cookie' => $strCookie, 'OCS-APIREQUEST' => true,'origin'=> $request->header('origin'),'user-agent'=> env('USER_AGENT', 'Bridge'),'AddressIp'=>$request->header('AddressIp')]]);
        } else {
            $client = new Client(['headers' => ['Authorization' => $request->header('Authorization'), 'requesttoken' => $request->input('requesttoken'), 'Cookie' => $strCookie,'origin'=> $request->header('origin'),'user-agent'=> env('USER_AGENT', 'Bridge'),'AddressIp'=>$request->header('AddressIp')]]);
        }

        try {
            Log::debug(env('API_DRIVE_URL') . $url);
            $res = $client->request($method, env('API_DRIVE_URL') . $url, $body);

            return  $res->getBody();
        } catch (\GuzzleHttp\Exception\ClientException $ex) {
            Log::error("qui" . $ex->getMessage());
        }
    }
    public static function simpleResponsePostCropped(Request $request, $url, $ocs = false, $method = null, $body = null, $iscontent = false)
    {

        if ($request->query->has('format')) {
            if ($request->input('format') != 'json') {
                $iscontent = true;
            }
        }
        // $strCookie='nc_username='.$request->cookie()['nc_username'].'; oc_sessionPassphrase='.$request->cookie()['oc_sessionPassphrase'].'; nc_token='.$request->cookie()['nc_token'].'; nc_session_id='.$request->cookie()['nc_session_id'].'; nc_sameSiteCookiestrict='.$request->cookie()['nc_sameSiteCookiestrict'].'; '.env('OCSSESSION').'='.$request->cookie()[env('OCSSESSION')].'; nc_sameSiteCookielax='.$request->cookie()['nc_sameSiteCookielax'];  
        $strCookie = CommonService::getStrCookie($request);
        if ($ocs) {
            $client = new Client(['http_errors' => false, 'headers' => ['Authorization' => $request->header('Authorization'), 'requesttoken' => $request->input('requesttoken'), 'Cookie' => $strCookie, 'OCS-APIREQUEST' => true,'origin'=> $request->header('origin'),'user-agent'=> env('USER_AGENT', 'Bridge')]]);
        } else {
            $client = new Client(['http_errors' => false, 'headers' => ['Authorization' => $request->header('Authorization'), 'requesttoken' => $request->input('requesttoken'), 'Cookie' => $strCookie,'origin'=> $request->header('origin'),'user-agent'=> env('USER_AGENT', 'Bridge')]]);
        }

        try {
            Log::debug(env('API_DRIVE_URL') . $url);
            $res = $client->request($method, env('API_DRIVE_URL') . $url, $body);

            if (strcmp('200', $res->getStatusCode()) == 0) {

                $arrayJson = json_decode($res->getBody());
                return  response()->json(['status' => Response::HTTP_OK, 'message' => 'success', 'body' => $res->getBody()]);
            } else  if (strcmp('500', $res->getStatusCode()) == 0) {
                Log::debug($res->getBody());
                return  response()->json(['status' => Response::HTTP_OK, 'message' => 'success', 'body' => '']);
            } else {
                return  response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
            }
        } catch (\GuzzleHttp\Exception\ClientException $ex) {
            Log::error("qui" . $ex->getMessage());
            return  response()->json(['status' => $res->getStatusCode(), 'message' => $ex->getMessage(), 'body' => '']);
        }
    }

    public static function  simpleResponseAll(Request $request, $url, $ocs = false, $method = null, $body = null, $iscontent = false, $nominus = false)
    {
        $format = 'json';

        if ($request->query->has('format')) {
            $format = $request->input('format');
        }
        if (strpos($url, 'format=') !== false) {
        } else {
        }
        $request->query->add(['format' => $format]);

        //$strCookie='nc_username='.$request->cookie()['nc_username'].'; oc_sessionPassphrase='.$request->cookie()['oc_sessionPassphrase'].'; nc_token='.$request->cookie()['nc_token'].'; nc_session_id='.$request->cookie()['nc_session_id'].'; nc_sameSiteCookiestrict='.$request->cookie()['nc_sameSiteCookiestrict'].'; '.env('OCSSESSION').'='.$request->cookie()[env('OCSSESSION')].'; nc_sameSiteCookielax='.$request->cookie()['nc_sameSiteCookielax'];  
        $strCookie = CommonService::getStrCookie($request);
        if ($ocs) {
            $client = new Client(['headers' => ['Authorization' => $request->header('Authorization'), 'requesttoken' => $request->input('requesttoken'), 'Cookie' => $strCookie, 'OCS-APIREQUEST' => true,'origin'=> $request->header('origin'),'user-agent'=> env('USER_AGENT', 'Bridge'),'AddressIp'=>$request->header('AddressIp')]]);
        } else {
            $client = new Client(['headers' => ['Authorization' => $request->header('Authorization'), 'requesttoken' => $request->input('requesttoken'), 'Cookie' => $strCookie,'origin'=> $request->header('origin'),'user-agent'=> env('USER_AGENT', 'Bridge'),'AddressIp'=>$request->header('AddressIp')]]);
        }
        try {
            if (isset($method)) {
                if (isset($body)) {
                    $res = $client->request($method, env('API_DRIVE_URL') . $url, ['http_errors' => false, 'json' => $body, 'query' => $request->query->all()]);
                } else {
                    $res = $client->request($method, env('API_DRIVE_URL') . $url, ['http_errors' => false, 'query' =>  $request->query->all()]);
                }
            } else {
                $res = $client->request('GET', env('API_DRIVE_URL') . $url, ['http_errors' => false, 'query' => $request->query->all()]);
            }
            if (strcmp('200', $res->getStatusCode()) == 0) {

                if ($nominus) {
                    $jsonnew = str_replace("-", "", $res->getBody());
                    return  $jsonnew;
                } else {

                    return  $res->getBody();
                }
            } else {

                return  $res->getBody();
            }
        } catch (\GuzzleHttp\Exception\ClientException $ex) {
            Log::error($ex->getMessage());
        } finally {

            // return  $res->getBody();
        }
    }

    public static function simpleResponseBody(Request $request, $url, $ocs = false, $method = null, $body = null, $iscontent = false)
    {

        //$strCookie='nc_username='.$request->cookie()['nc_username'].'; oc_sessionPassphrase='.$request->cookie()['oc_sessionPassphrase'].'; nc_token='.$request->cookie()['nc_token'].'; nc_session_id='.$request->cookie()['nc_session_id'].'; nc_sameSiteCookiestrict='.$request->cookie()['nc_sameSiteCookiestrict'].'; '.env('OCSSESSION').'='.$request->cookie()[env('OCSSESSION')].'; nc_sameSiteCookielax='.$request->cookie()['nc_sameSiteCookielax'];  
        $strCookie = CommonService::getStrCookie($request);
        if ($ocs) {
            $client = new Client(['headers' => ['Authorization' => $request->header('Authorization'), 'requesttoken' => $request->input('requesttoken'), 'Cookie' => $strCookie, 'OCS-APIREQUEST' => true,'origin'=> $request->header('origin'),'user-agent'=> env('USER_AGENT', 'Bridge'),'AddressIp'=>$request->header('AddressIp')]]);
        } else {
            $client = new Client(['headers' => ['Authorization' => $request->header('Authorization'), 'requesttoken' => $request->input('requesttoken'), 'Cookie' => $strCookie,'origin'=> $request->header('origin'),'user-agent'=> env('USER_AGENT', 'Bridge'),'AddressIp'=>$request->header('AddressIp')]]);
        }
        try {
            if (isset($method)) {
                if (isset($body)) {
                    $res = $client->request($method, env('API_DRIVE_URL') . $url, ['http_errors' => false, 'json' => $body]);
                } else {
                    $res = $client->request($method, env('API_DRIVE_URL') . $url, ['http_errors' => false]);
                }
            } else {
                $res = $client->request('GET', env('API_DRIVE_URL') . $url, ['http_errors' => false]);
            }
            if (strcmp('200', $res->getStatusCode()) == 0 || strcmp('201', $res->getStatusCode()) == 0) {

                Log::debug($res->getStatusCode());
                return  $res->getBody();
            }
            else if (strcmp('401', $res->getStatusCode()) == 0)
            {
                return  response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
            } 
            else {

                return  response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
            }
        } catch (\GuzzleHttp\Exception\ClientException $ex) {
            Log::error($ex->getMessage());
        } finally {

            // return  $res->getBody();
        }
    }


    public static function simpleResponseImg(Request $request, $url, $ocs = false, $method = null, $body = null, $iscontent = false)
    {

        //$strCookie='nc_username='.$request->cookie()['nc_username'].'; oc_sessionPassphrase='.$request->cookie()['oc_sessionPassphrase'].'; nc_token='.$request->cookie()['nc_token'].'; nc_session_id='.$request->cookie()['nc_session_id'].'; nc_sameSiteCookiestrict='.$request->cookie()['nc_sameSiteCookiestrict'].'; '.env('OCSSESSION').'='.$request->cookie()[env('OCSSESSION')].'; nc_sameSiteCookielax='.$request->cookie()['nc_sameSiteCookielax'];  
        $strCookie = CommonService::getStrCookie($request);
        if ($ocs) {
            $client = new Client(['headers' => ['Authorization' => $request->header('Authorization'), 'requesttoken' => $request->input('requesttoken'), 'Cookie' => $strCookie, 'OCS-APIREQUEST' => true,'origin'=> $request->header('origin'),'user-agent'=> env('USER_AGENT', 'Bridge')]]);
        } else {
            $client = new Client(['headers' => ['Authorization' => $request->header('Authorization'), 'requesttoken' => $request->input('requesttoken'), 'Cookie' => $strCookie,'origin'=> $request->header('origin'),'user-agent'=> env('USER_AGENT', 'Bridge')]]);
        }
        try {
            if (isset($method)) {
                if (isset($body)) {
                    $res = $client->request($method, env('API_DRIVE_URL') . $url, ['http_errors' => false, 'json' => $body]);
                } else {
                    $res = $client->request($method, env('API_DRIVE_URL') . $url, ['http_errors' => false]);
                }
            } else {
                $res = $client->request('GET', env('API_DRIVE_URL') . $url, ['http_errors' => false]);
            }
            if (strcmp('201', $res->getStatusCode()) == 0) {

                
                return  $res->getBody();
            }
            else if (strcmp('200', $res->getStatusCode()) == 0)
            {
                return  response()->json(['status' => '401', 'message' => 'Unauthorized', 'body' => '']);
            } 
            else {
                Log::debug($res->getStatusCode());
                return  response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
            }
        } catch (\GuzzleHttp\Exception\ClientException $ex) {
            Log::error($ex->getMessage());
        } finally {

            // return  $res->getBody();
        }
    }

    public static function twoResponseLogin(Request $request, $url, $data = null, $challengeProviderId)
    {
        try {

            $jar = new \GuzzleHttp\Cookie\CookieJar();
            //$strCookie='oc_sessionPassphrase='.$request->cookie()['oc_sessionPassphrase'].'; nc_sameSiteCookiestrict='.$request->cookie()['nc_sameSiteCookiestrict'].'; '.env('OCSSESSION').'='.$request->cookie()[env('OCSSESSION')].'; nc_sameSiteCookielax='.$request->cookie()['nc_sameSiteCookielax'];
            $strCookie = CommonService::getStrCookie($request);
            $client = new Client(['headers' => ['Authorization' => $request->header('Authorization'), 'Cookie' => $strCookie,'origin'=> $request->header('origin'),'user-agent'=> env('USER_AGENT', 'Bridge'),'AddressIp'=>$request->header('AddressIp')], 'cookies' => $jar]);
            $jsonreq = [
                'multipart' => [
                    [
                        'name' => 'challenge',
                        'contents' => $data['challenge'],
                    ],
                    [
                        'name' => 'redirect_url',
                        'contents' => '/index.php/apps/files',
                    ]
                ]
            ];
            Log::debug("qui1");
            $res = $client->request('POST', env('API_DRIVE_URL') . $url, $jsonreq);
            Log::debug(env('API_DRIVE_URL') . $url);
            foreach ($jar->toArray() as $item) {

                setcookie($item['Name'], $item['Value'], $item['Expires'], $item['Path'], env('HOST_IP'));
                if ((float)phpversion() >= 7.3){
                    setcookie($item['Name'], $item['Value'], [
                        'expires' => $item['Expires'],
                        'path' => $item['Path'],
                        'domain' => env('DOMAIN_IP_FRONTEND'),
                        'secure' => true,
                        'samesite' => 'None'
                    ]);
                } else {
                    setcookie($item['Name'], $item['Value'], $item['Expires'], $item['Path'] . "; SameSite=None", env('DOMAIN_IP_FRONTEND'), true);
                }

                if ($item['Name'] == 'nc_username') {
                    $uname = $item['Value'];
                    if (isset($uname)) {
                        Log::debug("cookie  nc_username" . $uname);
                    }
                    $islogin = true;
                }
            }

            if (strcmp('200', $res->getStatusCode()) == 0) {
                if (strpos($res->getBody(), 'Authenticator app') !== false) {

                    $value = "challenge";
                    return  response()->json(['status' => Response::HTTP_FORBIDDEN, 'message' => 'Error authentication code', 'totp' => true]);
                } else if ((strpos($res->getBody(), 'Backup code') !== false)||(strpos($res->getBody(), 'Codice di backup') !== false)) {

                    $value = "challenge";
                    return  response()->json(['status' => Response::HTTP_FORBIDDEN, 'message' => 'Error backup code', 'backup_codes' => true]);
                } else {
                    $dom = new \DOMDocument;
                    @$dom->loadHTML($res->getBody());
                    $token = "";

                    //retrive token by field data-requesttoken in head 
                    $heads = $dom->getElementsByTagName('head')->item(0)->attributes;
                    foreach ($heads as $head) {
                        if ($head->nodeName == 'data-requesttoken') {
                            $token = $head->nodeValue;
                        }
                    }

                    return  response()->json(['token' => $token, 'status' => Response::HTTP_OK, 'message' => 'OK', 'challengeProviderId'  => true]);
                }
            } else {

                return  response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
            }
        } catch (\GuzzleHttp\Exception\ClientException $ex) {
            Log::error($ex->getMessage());
        } finally {
        }
    }

    public static function simpleResponseLogin(Request $request, $url, $ocs = false, $method = null, $data = null, $iscontent = false)
    {
        $onRedirect = function (
            RequestInterface $request,
            ResponseInterface $response,
            UriInterface $uri
        ) {
        };
        $jar = new \GuzzleHttp\Cookie\CookieJar();
        if ($ocs) {
            $client = new Client([
                'allow_redirects' => [
                    'max'             => 1,        // allow at most 10 redirects.
                    'strict'          => true,      // use "strict" RFC compliant redirects.
                    'referer'         => true,      // add a Referer header
                    'protocols'       => ['http'], // only allow https URLs
                    'on_redirect'     => $onRedirect,
                    'track_redirects' => true
                ], 'headers' => ['requesttoken' => $request->input('requesttoken'),'origin'=> $request->header('origin'),'user-agent'=> env('USER_AGENT', 'Bridge')], 'cookies' => $jar
            ]);
            //$client = new Client(['headers' => ['requesttoken' => $request->input('requesttoken'),'OCS-APIREQUEST'=>true],'cookies' => $jar]);
        } else {
            // $client = new Client(['headers' => ['requesttoken' => $request->input('requesttoken'),'Cookie' => $strCookie]]);
            $client = new Client(['headers' => ['requesttoken' => $request->input('requesttoken'), 'cookies' => $jar,'origin'=> $request->header('origin'),'user-agent'=> env('USER_AGENT', 'Bridge')]]);
        }
        try {

            if (isset($method)) {

                if (isset($data)) {

                    $jsonreq = [
                        'multipart' => [
                            [
                                'name' => 'challenge',
                                'contents' => $data['challenge'],
                            ],
                            [
                                'name' => 'challengeProviderId',
                                'contents' => $data['challengeProviderId'],
                            ],
                            [
                                'name' => 'redirect_url',
                                'contents' => $data['redirect_url'],
                            ]
                        ]
                    ];

                    $res = $client->request($method, env('API_DRIVE_URL') . $url, ['headers' => ['requesttoken' => $request->input('requesttoken'),'AddressIp'=>$request->header('AddressIp')], $jsonreq]);

                    foreach ($jar->toArray() as $item) {

                        setcookie($item['Name'], $item['Value'], $item['Expires'], $item['Path'], env('HOST_IP'));
                        if ((float)phpversion() >= 7.3) {
                            setcookie($item['Name'], $item['Value'], [
                                'expires' => $item['Expires'],
                                'path' => $item['Path'],
                                'domain' => env('DOMAIN_IP_FRONTEND'),
                                'secure' => true,
                                'samesite' => 'None'
                            ]);
                        } else {
                            setcookie($item['Name'], $item['Value'], $item['Expires'], $item['Path'] . "; SameSite=None", env('DOMAIN_IP_FRONTEND'), true);
                        }

                        if ($item['Name'] == 'nc_username') {
                            $uname = $item['Value'];
                            if (isset($uname)) {
                                Log::debug("cookie  nc_username" . $uname);
                            }
                            $islogin = true;
                        }
                    }
                } else {
                    $res = $client->request($method, env('API_DRIVE_URL') . $url, ['http_errors' => false]);
                }
                if (strcmp('200', $res->getStatusCode()) == 0) {

                    if ($iscontent) {
                        return  $res->getBody()->getContents();
                    } else {

                        $arrayJson = json_decode($res->getBody());
                        return  response()->json(['status' => Response::HTTP_OK, 'message' => 'success', 'body' => $arrayJson]);
                    }
                } else {

                    return  response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
                }
            } else {
                $res = $client->request('GET', env('API_DRIVE_URL') . $url, ['http_errors' => false]);
            }
        } catch (\GuzzleHttp\Exception\ClientException $ex) {
            Log::error($ex->getMessage());
        } finally {
        }
    }


    public static function getApiDAVResponse(Request $request, $url, $method = null, $xml = null, $addheaders = null)
    {
        try {

            // $strCookie='nc_username='.$request->cookie()['nc_username'].'; oc_sessionPassphrase='.$request->cookie()['oc_sessionPassphrase'].'; nc_token='.$request->cookie()['nc_token'].'; nc_session_id='.$request->cookie()['nc_session_id'].'; nc_sameSiteCookiestrict='.$request->cookie()['nc_sameSiteCookiestrict'].'; '.env('OCSSESSION').'='.$request->cookie()[env('OCSSESSION')].'; nc_sameSiteCookielax='.$request->cookie()['nc_sameSiteCookielax'];  
            $strCookie = CommonService::getStrCookie($request);
            //Log::debug($strCookie);
            Log::debug("url: ".$url);
          
            if ($request->header('Authorization') != "") {

                if ($addheaders == null) {
                    $addheaders = ['Authorization' => $request->header('Authorization'),'origin'=> $request->header('origin'),'user-agent'=> env('USER_AGENT', 'Bridge'),'AddressIp'=>$request->header('AddressIp')];
                } else {
                    $addheaders += ['Authorization' => $request->header('Authorization'),'origin'=> $request->header('origin'),'user-agent'=> env('USER_AGENT', 'Bridge'),'AddressIp'=>$request->header('AddressIp')];
                }

                $auserpass = explode(':', base64_decode(substr($request->header('Authorization'), 6)));
                Log::debug($auserpass[0]);
            }
            else
            {
                if ($addheaders == null) {
                    $addheaders = ['origin'=> $request->header('origin'),'user-agent'=> env('USER_AGENT', 'Bridge'),'AddressIp'=>$request->header('AddressIp')];
                } else {
                    $addheaders += ['origin'=> $request->header('origin'),'user-agent'=> env('USER_AGENT', 'Bridge'),'AddressIp'=>$request->header('AddressIp')];
                }
            }
            
            $client = CommonService::getClient($request, $strCookie, $method, $addheaders);
            if ($xml != null) {

                if ($request->getContent() != null) {
                    $xml = $request->getContent();
                }
                $body = ['http_errors' => false, 'body' => $xml];
            } else {

                $body = ['http_errors' => false];
            }
            // $strCookiUsername = CommonService::getStrCookieUsername($request);
            // if ($strCookiUsername == "") {
            //     if ($request->header('Authorization') != "") {
            //         $url = str_replace("//", "/" . $auserpass[0] . "/", $url);
            //     }
            // }
            Log::debug("url: ".$url);
            $res = $client->request($method, env('API_DRIVE_URL') . $url, $body);

            if ($request->method() == 'GET' || $request->method() == 'POST') {

                if (strcmp('201', $res->getStatusCode()) == 0) {

                    return  response()->json(['status' => 'success', 'message' => $res->getReasonPhrase(), 'body' => '']);
                }
                if (strcmp('204', $res->getStatusCode()) == 0) {

                    return  response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase()]);
                } else if (strcmp('207', $res->getStatusCode()) == 0) {

                    $xml_str = str_replace(PHP_EOL, '', $res->getBody());
                    $xml_str = str_replace('\'', '%27', $xml_str);
                    $xml = simplexml_load_string($xml_str, 'SimpleXMLElement', LIBXML_NOCDATA);

                    $arrayData =  CommonService::xmlToArray($xml);
                    $jsonnew = preg_replace("/\"/", "'", json_encode($arrayData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
                    // $jsonnew=str_replace("\\\\'","", $jsonnew);
                    //$jsonnew=str_replace("-","", $jsonnew);
                    $jsonnew = str_replace('\'', '"', $jsonnew);
                    str_replace("d:", "", $jsonnew);
                    return response()->json(['status' => Response::HTTP_OK, 'message' => 'success', 'body' => json_decode($jsonnew)]);
                } else if (strcmp('500', $res->getStatusCode()) == 0) {

                    return  response()->json(['status' => Response::HTTP_INTERNAL_SERVER_ERROR, 'message' => 'internal server error', 'body' => $res->getReasonPhrase()]);
                } else {

                    return response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
                }
            } else {
                return $res->getBody();
            }
        } catch (\GuzzleHttp\Exception\ClientException $ex) {
            Log::error($ex->getMessage());
            return  response()->json(['status' => Response::HTTP_INTERNAL_SERVER_ERROR, 'message' => 'internal server error', 'body' => '']);
        }
    }


    public static function getApiDAVResponse1(Request $request, $url, $method = null, $xml = null, $addheaders = null)
    {
        try {
            $headers =  $request->header();

            $basicAuthString = '';
            $requestHeaders = [];
            $cookies = '';
            $cookies = $request->cookies->all();
            //fill headers
            if (strcmp($basicAuthString, '') === 0) {
                foreach ($headers as $key => $value) {

                    $requestHeaders[$key] = $value[0];
                }
            }



            //        $cookies = implode(';', array_map(
            //            function ($v, $k) {
            //                return sprintf("%s=%s", $k, urldecode($v));
            //            },
            //            $cookies,
            //            array_keys($cookies)
            //        ));

            $strCookie = CommonService::getStrCookie($request);
            $requestHeaders['cookie'] = $strCookie;
            $requestHeaders['ocs-apirequest'] = "false";
            $requestHeaders['origin'] = $request->header('origin');
            if ($request->header('Authorization') != "") {
                $addheaders['Authorization'] = $request->header('Authorization');
                $auserpass = explode(':', base64_decode(substr($request->header('Authorization'), 6)));
                Log::debug('passord username ' . $auserpass[0]);
            }
            switch ($method) {
                case 'PROPFIND':

                    break;
                case 'PUT':
                    $headers += ['OCS-APIREQUEST' => true];
                    break;
                default:

                    break;
            }
            //  $client = new Client(['headers' => ['requesttoken' => $request->input('requesttoken'),'Cookie' => $strCookie],'allow_redirects' => false,'cookies'=>$jar]);
            $client = new Client([
                'headers' => $requestHeaders
            ]);

            if ($xml != null) {

                if ($request->getContent() != null) {
                    $xml = $request->getContent();
                }
                $body = ['http_errors' => true, 'body' => $xml];
            } else {

                $body = ['http_errors' => true];
            }
            //            if ($strCookie=="")
            //            {
            if ($request->header('Authorization') != "") {

                $url = str_replace("//", "/" . $auserpass[0] . "/", $url);
            }
            //            }



            $res = $client->request($method, env('API_DRIVE_URL') . $url, $body);

            if ($request->method() == 'GET' || $request->method() == 'POST') {

                if (strcmp('201', $res->getStatusCode()) == 0) {

                    return  response()->json(['status' => 'success', 'message' => $res->getReasonPhrase(), 'body' => '']);
                }
                if (strcmp('204', $res->getStatusCode()) == 0) {

                    return  response()->json(['status' => 'success']);
                } else if (strcmp('207', $res->getStatusCode()) == 0) {

                    $xml_str = str_replace(PHP_EOL, '', $res->getBody());
                    $xml = simplexml_load_string($xml_str, 'SimpleXMLElement', LIBXML_NOCDATA);

                    $arrayData =  CommonService::xmlToArray($xml);
                    $jsonnew = preg_replace("/\"/", "'", json_encode($arrayData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
                    // $jsonnew=str_replace("\\\\'","", $jsonnew);
                    //$jsonnew=str_replace("-","", $jsonnew);
                    $jsonnew = str_replace('\'', '"', $jsonnew);
                    str_replace("d:", "", $jsonnew);
                    return response()->json(['status' => Response::HTTP_OK, 'message' => 'success', 'body' => json_decode($jsonnew)]);
                } else if (strcmp('500', $res->getStatusCode()) == 0) {

                    return  response()->json(['status' => Response::HTTP_INTERNAL_SERVER_ERROR, 'message' => 'internal server error', 'body' => '']);
                } else {

                    return response()->json(['status' => $res->getStatusCode(), 'message' => $res->getReasonPhrase(), 'body' => '']);
                }
            } else {
                return $res->getBody();
            }
        } catch (\GuzzleHttp\Exception\ClientException $ex) {
            Log::error($ex->getMessage());
            return  response()->json(['status' => Response::HTTP_INTERNAL_SERVER_ERROR, 'message' => 'internal server error', 'body' => '']);
        }
    }

    public static function getClient($request, $strCookie, $method = null, $addheaders = null)
    {
        $headers = ['requesttoken' => $request->input('requesttoken'), 'Cookie' => $strCookie];

        if ($addheaders != null) {
            $headers += $addheaders;
        }
        //$headers += ['redirect.max'=>10];
        switch ($method) {
            case 'PROPFIND':

                break;
            case 'PUT':
                $headers += ['OCS-APIREQUEST' => true];
                break;
            default:

                break;
        }


        return new Client([[
            'allow_redirects' => [
                'max'             => 10,        // allow at most 10 redirects.
                'strict'          => true,      // use "strict" RFC compliant redirects.
                'referer'         => true,      // add a Referer header
                'protocols'       => ['http', 'https']
            ]
        ], 'headers' => $headers]);
    }



    public static function  xmlToArray($xml, $options = array())
    {
        $defaults = array(
            'namespaceRecursive' => false,  //setting to true will get xml doc namespaces recursively
            'removeNamespace' => false,     //set to true if you want to remove the namespace from resulting keys (recommend setting namespaceSeparator = '' when this is set to true)
            'namespaceSeparator' => ':',    //you may want this to be something other than a colon
            'attributePrefix' => '@',       //to distinguish between attributes and nodes with the same name
            'alwaysArray' => array(),       //array of xml tag names which should always become arrays
            'autoArray' => true,            //only create arrays for tags which appear more than once
            'textContent' => '$',           //key used for the text content of elements
            'autoText' => true,             //skip textContent key if node has no attributes or child nodes
            'keySearch' => false,           //optional search and replace on tag and attribute names
            'keyReplace' => false           //replace values for above search values (as passed to str_replace())
        );
        $options = array_merge($defaults, $options);
        $namespaces = $xml->getDocNamespaces($options['namespaceRecursive']);
        $namespaces['x1'] = "http://open-collaboration-services.org/ns"; //add base (empty) namespace

        //get attributes from all namespaces
        $attributesArray = array();
        foreach ($namespaces as $prefix => $namespace) {
            if ($options['removeNamespace']) $prefix = "";
            foreach ($xml->attributes($namespace) as $attributeName => $attribute) {
                //replace characters in attribute name
                if ($options['keySearch']) $attributeName =
                    str_replace($options['keySearch'], $options['keyReplace'], $attributeName);
                $attributeKey = $options['attributePrefix']
                    . ($prefix ? $prefix . $options['namespaceSeparator'] : '')
                    . $attributeName;
                $attributesArray[$attributeKey] = (string)$attribute;
            }
        }
        //get child nodes from all namespaces
        $tagsArray = array();
        foreach ($namespaces as $prefix => $namespace) {
            if ($options['removeNamespace']) $prefix = "";
            foreach ($xml->children($namespace) as $childXml) {
                //recurse into child nodes
                $childArray = CommonService::xmlToArray($childXml, $options);
                list($childTagName, $childProperties) = CommonService::myEach($childArray);

                //replace characters in tag name
                if ($options['keySearch']) $childTagName =
                    str_replace($options['keySearch'], $options['keyReplace'], $childTagName);
                //add namespace prefix, if any
                if ($prefix) $childTagName =  $childTagName;

                if (!isset($tagsArray[$childTagName])) {
                    //only entry with this key
                    //test if tags of this type should always be arrays, no matter the element count
                    $tagsArray[$childTagName] =
                        in_array($childTagName, $options['alwaysArray']) || !$options['autoArray']
                        ? array($childProperties) : $childProperties;
                } elseif (
                    is_array($tagsArray[$childTagName]) && array_keys($tagsArray[$childTagName])
                    === range(0, count($tagsArray[$childTagName]) - 1)
                ) {
                    //key already exists and is integer indexed array
                    $tagsArray[$childTagName][] = $childProperties;
                } else {
                    //key exists so convert to integer indexed array with previous value in position 0
                    $tagsArray[$childTagName] = array($tagsArray[$childTagName], $childProperties);
                }
            }
        }
        //get text content of node
        $textContentArray = array();
        $plainText = trim((string)$xml);
        if ($plainText !== '') $textContentArray[$options['textContent']] = $plainText;

        //stick it all together
        $propertiesArray = !$options['autoText'] || $attributesArray || $tagsArray || ($plainText === '')
            ? array_merge($attributesArray, $tagsArray, $textContentArray) : $plainText;

        $nodename = str_replace("-", "", $xml->getName());
        //return node as array
        return array(

            $nodename => $propertiesArray
        );
    }

    public static function  xmlToArray1($xml, $options = array())
    {
        $defaults = array(
            'namespaceRecursive' => false,  //setting to true will get xml doc namespaces recursively
            'removeNamespace' => false,     //set to true if you want to remove the namespace from resulting keys (recommend setting namespaceSeparator = '' when this is set to true)
            'namespaceSeparator' => ':',    //you may want this to be something other than a colon
            'attributePrefix' => '@',       //to distinguish between attributes and nodes with the same name
            'alwaysArray' => array(),       //array of xml tag names which should always become arrays
            'autoArray' => true,            //only create arrays for tags which appear more than once
            'textContent' => '$',           //key used for the text content of elements
            'autoText' => true,             //skip textContent key if node has no attributes or child nodes
            'keySearch' => false,           //optional search and replace on tag and attribute names
            'keyReplace' => false           //replace values for above search values (as passed to str_replace())
        );
        $options = array_merge($defaults, $options);
        $namespaces = $xml->getDocNamespaces($options['namespaceRecursive']);
        $namespaces['x1'] = "http://open-collaboration-services.org/ns"; //add base (empty) namespace

        //get attributes from all namespaces
        $attributesArray = array();
        foreach ($namespaces as $prefix => $namespace) {
            if ($options['removeNamespace']) $prefix = "";
            foreach ($xml->attributes($namespace) as $attributeName => $attribute) {
                //replace characters in attribute name
                if ($options['keySearch']) $attributeName =
                    str_replace($options['keySearch'], $options['keyReplace'], $attributeName);
                $attributeKey = $options['attributePrefix']
                    . ($prefix ? $prefix . $options['namespaceSeparator'] : '')
                    . $attributeName;
                $attributesArray[$attributeKey] = (string)$attribute;
            }
        }
        //get child nodes from all namespaces
        $tagsArray = array();
        foreach ($namespaces as $prefix => $namespace) {
            if ($options['removeNamespace']) $prefix = "";
            foreach ($xml->children($namespace) as $childXml) {
                //recurse into child nodes
                $childArray = CommonService::xmlToArray1($childXml, $options);
                list($childTagName, $childProperties) = CommonService::myEach($childArray);

                //replace characters in tag name
                if ($options['keySearch']) $childTagName =
                    str_replace($options['keySearch'], $options['keyReplace'], $childTagName);
                //add namespace prefix, if any
                if ($prefix) $childTagName =  $childTagName;

                if (!isset($tagsArray[$childTagName])) {
                    //only entry with this key
                    //test if tags of this type should always be arrays, no matter the element count
                    $tagsArray[$childTagName] =
                        in_array($childTagName, $options['alwaysArray']) || !$options['autoArray']
                        ? array($childProperties) : $childProperties;
                } elseif (
                    is_array($tagsArray[$childTagName]) && array_keys($tagsArray[$childTagName])
                    === range(0, count($tagsArray[$childTagName]) - 1)
                ) {
                    //key already exists and is integer indexed array
                    $tagsArray[$childTagName][] = $childProperties;
                } else {
                    //key exists so convert to integer indexed array with previous value in position 0
                    $tagsArray[$childTagName] = array($tagsArray[$childTagName], $childProperties);
                }
            }
        }
        //get text content of node
        $textContentArray = array();
        $plainText = trim((string)$xml);
        if ($plainText !== '') $textContentArray[$options['textContent']] = $plainText;

        //stick it all together
        $propertiesArray = !$options['autoText'] || $attributesArray || $tagsArray || ($plainText === '')
            ? array_merge($attributesArray, $tagsArray, $textContentArray) : $plainText;

        $nodename = str_replace("-", "", $xml->getName());

        if ($propertiesArray == []) {
            $propertiesArray = null;
        }
        //return node as array
        return array(

            $nodename => $propertiesArray
        );
    }

    static function myEach(&$arr)
    {
        $key = key($arr);
        $result = ($key === null) ? false : [$key, current($arr), 'key' => $key, 'value' => current($arr)];
        next($arr);
        return $result;
    }

   
    public static function getStrCookie(Request $request)
    {
        $strCookie = "";
        if ($request->cookies->has('nc_username')) {
            $strCookie = $strCookie . 'nc_username=' . $request->cookie()['nc_username'] . ';';
        }
        if ($request->cookies->has('oc_sessionPassphrase')) {
            $strCookie = $strCookie . 'oc_sessionPassphrase=' . $request->cookie()['oc_sessionPassphrase'] . ';';
        }
        if ($request->cookies->has('nc_token')) {
            $strCookie = $strCookie . 'nc_token=' . $request->cookie()['nc_token'] . ';';
        }
        if ($request->cookies->has('nc_session_id')) {
            $strCookie = $strCookie . 'nc_session_id=' . $request->cookie()['nc_session_id'] . ';';
        }
        if ($request->cookies->has('nc_sameSiteCookiestrict')) {
            $strCookie = $strCookie . 'nc_sameSiteCookiestrict=' . $request->cookie()['nc_sameSiteCookiestrict'] . ';';
        }
        if ($request->cookies->has('__Host-nc_sameSiteCookiestrict')) {
            $strCookie = $strCookie . 'nc_sameSiteCookiestrict=' . $request->cookie()['__Host-nc_sameSiteCookiestrict'] . ';';
            $strCookie = $strCookie . '__Host-nc_sameSiteCookiestrict=' . $request->cookie()['__Host-nc_sameSiteCookiestrict'] . ';';
        }
        if ($request->cookies->has(env('OCSSESSION'))) {
            $strCookie = $strCookie . env('OCSSESSION') . '=' . $request->cookie()[env('OCSSESSION')] . ';';
        }
        if ($request->cookies->has('nc_sameSiteCookielax')) {
            $strCookie = $strCookie . 'nc_sameSiteCookielax=' . $request->cookie()['nc_sameSiteCookielax'] . ';';
        }
        if ($request->cookies->has('__Host-nc_sameSiteCookielax')) {

            $strCookie = $strCookie . 'nc_sameSiteCookielax=' . $request->cookie()['__Host-nc_sameSiteCookielax'] . ';';
            $strCookie = $strCookie . '__Host-nc_sameSiteCookielax=' . $request->cookie()['__Host-nc_sameSiteCookielax'] . ';';
        }
        return $strCookie;
    }

    public static function getStrCookieUsername(Request $request)
    {
        $strCookie = "";
        if ($request->cookies->has('nc_username')) {
            $strCookie = $strCookie . 'nc_username=' . $request->cookie()['nc_username'] . ';';
        }
        return $strCookie;
    }   
   
  public static function getUsernameRequest(Request $request)
  {
    $strUsername="";
    if ($request->cookies->has('nc_username')) {
        $strUsername = $request->cookie()['nc_username'];
    }
    else  if ($request->header('Authorization') != "")
    {
        
        $auserpass = explode(':', base64_decode(substr($request->header('Authorization'), 6)));
        $strUsername = $auserpass[0];
        
    }
    return $strUsername;
    
  }

    public static function getMailApiResponse(Request $request, string $url, string $method = 'POST', $isOCS = true)
    {

        
        $headers =  $request->header();
        $cookies = '';
        //       $cookies = $request->cookies->all();
        $cookies = CommonService::getStrCookie($request);
        //        $cookies = implode(';', array_map(
        //            function ($v, $k) {
        //                return sprintf("%s=%s", $k, urldecode($v));
        //            },
        //            $cookies,
        //            array_keys($cookies)
        //        ));
       
        $basicAuthString = '';
        $requestHeaders = [];
        //fill headers
        //        if (strcmp($basicAuthString, '') === 0) {
        //            foreach ($headers as $key => $value) {
        //                Log::debug($value[0]);
        //                $requestHeaders[$key] = $value[0];
        //            }
        //        }
       
        $requestHeaders['Cookie'] = $cookies;
        $requestHeaders['user-agent'] = env('USER_AGENT', 'Bridge');
        $requestHeaders['AddressIp'] = $request->header('AddressIp');
         
      //  $requestHeaders['origin'] = $request->header('origin');
        if (boolval($isOCS)) {
            $requestHeaders['ocs-apirequest'] = "true";
        };

        if ($request->header('Authorization') != "") {

            $requestHeaders['Authorization'] = $request->header('Authorization');
        }
        //get body        
        $body = $request->json()->all();
        $body = $body;
     
	 
        try {
            $client = new Client([
                'headers' => $requestHeaders,
                'json' => $body,
            ]);
           
            Log::debug($requestHeaders);
            $res = $client->request($method, env('API_DRIVE_URL') . $url, ['http_errors' => false]);
           
            return $res;
            $res = $res->getBody();
            $res->seek(0);
            $res = $res->getContents();
            if (!is_null($res) && !empty($res) && is_string($res)) {
                return json_decode($res);
            } else {
                $error = new stdClass();
                $error->Error = 'No response or error from Backend';
                $error->ErrorContent = $res;
                return $error;
            }
        } catch (\GuzzleHttp\Exception\ClientException $ex) {
            Log::error($ex->getMessage());
        } finally {
        }
    }


    /**
     * Digital Signature API responses
     *  
     * @author d.derose
     * 
     * @param Request $request
     * @param string $url
     * @param bool $ocs
     * @param string $method default 'POST'     
     * @param bool $isOCS if ocs call
     * 
     * @return object
     */
    public static function getSignatureApiResponse(Request $request, string $url, string $method = 'POST', $isOCS = true)
    {
        $headers =  $request->header();
        $cookies = '';
        // $cookies = $request->cookies->all();
        $cookies = CommonService::getStrCookie($request);
        // $cookies = implode(';', array_map(
        //     function ($v, $k) {
        //         return sprintf("%s=%s", $k, urldecode($v));
        //     },
        //     $cookies,
        //     array_keys($cookies)
        // ));

        $basicAuthString = '';
        $requestHeaders = [];
        //fill headers
        // if (strcmp($basicAuthString, '') === 0) {
        //     foreach ($headers as $key => $value) {
        //         Log::debug($value[0]);
        //         $requestHeaders[$key] = $value[0];
        //     }
        // }
        $requestHeaders['Cookie'] = $cookies;
        $requestHeaders['user-agent'] = env('USER_AGENT', 'Bridge');
        $requestHeaders['origin'] = $request->header('origin');
        $requestHeaders['AddressIp'] = $request->header('AddressIp');
        if (boolval($isOCS)) {
            $requestHeaders['ocs-apirequest'] = "true";
        };
        if ($request->header('Authorization') != "") {

            $requestHeaders['Authorization'] = $request->header('Authorization');
        }
        //get body        
        $body = $request->json()->all();
        $body = $body;
        Log::error(env('API_DRIVE_URL') . $url);

        try {
            Log::error("[SIGNATURE] BEFORE CLIENT ");
            $client = new Client([
                'headers' => $requestHeaders,
                'json' => $body,
            ]);

            $res = $client->request($method, env('API_DRIVE_URL') . $url, ['http_errors' => false]);
            return $res;
            Log::error("[SIGNATURE] AFTER CLIENT REQUEST");
            $res = $res->getBody();
            $res->seek(0);


            $res = $res->getContents();

            Log::error("[SIGNATURE] RES : " . $res);
            if (!is_null($res) && !empty($res) && is_string($res)) {
                return json_decode($res);
            } else {
                $error = new stdClass();
                $error->Error = 'No response or error from Backend';
                $error->ErrorContent = $res;
                return $error;
            }
        } catch (\GuzzleHttp\Exception\ClientException $ex) {
            Log::error($ex->getMessage());
        } finally {
        }
    }

    /**
     * vEncrypt Core API responses
     *  
     * @author d.derose
     * 
     * @param Request $request
     * @param string $url
     * @param bool $ocs
     * @param string $method default 'POST'     
     * @param bool $isOCS if ocs call
     * 
     * @return object
     */
    public static function getVencApiResponse(Request $request, string $url, string $method = 'POST', $isOCS = true)
    {

        Log::debug($request->query->all());
        $headers =  $request->header();
        $cookies = '';
        $cookies = CommonService::getStrCookie($request);
        // $cookies = $request->cookies->all();
        // $cookies = implode(';', array_map(
        //     function ($v, $k) {
        //         return sprintf("%s=%s", $k, urldecode($v));
        //     },
        //     $cookies,
        //     array_keys($cookies)
        // ));

        $basicAuthString = '';
        $requestHeaders = [];
        //fill headers
        // if (strcmp($basicAuthString, '') === 0) {
        //     foreach ($headers as $key => $value) {
        //         $requestHeaders[$key] = $value[0];
        //     }
        // }
        $requestHeaders['cookie'] = $cookies;
        $requestHeaders['user-agent'] = env('USER_AGENT', 'Bridge');
        $requestHeaders['origin'] = $request->header('origin');
        $requestHeaders['AddressIp'] = $request->header('AddressIp');
        if (boolval($isOCS)) {
            $requestHeaders['ocs-apirequest'] = "true";
        };
        if ($request->header('Authorization') != "") {

            $requestHeaders['Authorization'] = $request->header('Authorization');
        }
        Log::debug($request->json()->all());
        //get body        
        $body = $request->json()->all();
        $body = $body;


        try {
            $client = new Client([
                'headers' => $requestHeaders,
                'json' => $body,
            ]);
            $res = $client->request($method, env('API_DRIVE_URL') . $url, ['http_errors' => false]);
            return $res;
            Log::debug($res->getBody());
            $res = $res->getBody();
            $res->seek(0);
            $res = $res->getContents();
        } catch (\GuzzleHttp\Exception\ClientException $ex) {
            Log::error($ex->getMessage());
        } finally {

            if (!is_null($res) && !empty($res) && is_string($res)) {
                return json_decode($res);
            } else {
                $error = new stdClass();
                $error->Error = 'No response or error from Backend';
                $error->ErrorContent = $res;
                return $error;
            }
        }
    }

    /**
     * Common Core API responses
     *  
     * @author d.derose
     * 
     * @param Request $request
     * @param string $url
     * @param bool $ocs
     * @param string $method default 'POST'     
     * @param bool $isOCS if ocs call
     * @param bool $preserveUserAgent use UserAgent from Request's client instead of Bridge's UA
     * 
     * @return object
     */
    public static function getCommonApiResponse(Request $request, string $url, string $method = 'POST', $isOCS = true, $preserveUserAgent = false)
    {
        try {
            $headers =  $request->header();
            $cookies = '';
            // $cookies = $request->cookies->all();
            // $cookies = implode(';', array_map(
            //     function ($v, $k) {
            //         return sprintf("%s=%s", $k, urldecode($v));
            //     },
            //     $cookies,
            //     array_keys($cookies)
            // ));
            $cookies = CommonService::getStrCookie($request);


            $basicAuthString = '';
            $requestHeaders = [];
            //fill headers
            //        if (strcmp($basicAuthString, '') === 0) {
            //            foreach ($headers as $key => $value) {
            //                Log::debug($value[0]);
            //                $requestHeaders[$key] = $value[0];
            //            }
            //        }
            $requestHeaders['Cookie'] = $cookies;
            $requestHeaders['user-agent'] = env('USER_AGENT', 'Bridge');
            $requestHeaders['origin'] = $request->header('origin');
            $requestHeaders['AddressIp'] = $request->header('AddressIp');
            if (boolval($isOCS)) {
                $requestHeaders['ocs-apirequest'] = "true";
            };
    
            if ($request->header('Authorization') != "") {
    
                $requestHeaders['Authorization'] = $request->header('Authorization');
            }
          
    
                                                      
                                                   



            // $requestHeaders = [];
            // //fill headers

            // foreach ($headers as $key => $value) {
            //     Log::debug($key."=".$value[0]);
            //     $requestHeaders[$key] = $value[0];
            // }

            // $requestHeaders['Cookie'] = $cookies;
           // $requestHeaders['origin'] = $request->header('origin');
            if ($preserveUserAgent) {
                $requestHeaders['user-agent'] = $request->header('user-agent');
            }
            if (boolval($isOCS)) {
                $requestHeaders['ocs-apirequest'] = "true";
            };
            //get body        
            $body = $request->json()->all();
            try {
                $client = new Client([
                    'headers' => $requestHeaders,
                    'json' => $body,
                ]);
                Log::debug(env('API_DRIVE_URL') . $url);
                $res = $client->request($method, env('API_DRIVE_URL') . $url, ['http_errors' => false]);
       
                return $res;
                $res = $res->getBody();
                $res->seek(0);
                $res = $res->getContents();
                Log::error($res);
                if (!is_null($res) && !empty($res) && is_string($res)) {
                    $response = json_decode($res);
                    if (!is_null($response)) {
                        return $response;
                    } else {
                        throw new \Exception("Backend response is null or invalid.", 500);
                    }
                } else {
                    $error = new stdClass();
                    $error->Error = 'No response or error from Backend';
                    $error->ErrorContent = $res;
                    return $error;
                }
            } catch (\GuzzleHttp\Exception\ClientException $ex) {                
                throw new \Exception($ex->getMessage(),$ex->getCode());
            }
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            $error = new stdClass();
            $error->Error = 'Error executing request : ';
            $error->ErrorContent = $th->getMessage();
            return $error;
        }
    }
   
    public  static  function decrypt($pass,$keyString,$ivString){
        $key = hex2bin($keyString);
        $iv = hex2bin($ivString);
        $decrypted = openssl_decrypt($pass, 'AES-128-CBC', $key, OPENSSL_ZERO_PADDING, $iv);
        return $decrypted;
   }
}
