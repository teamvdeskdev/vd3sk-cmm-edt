<?php
namespace App\Services\Login;

use GuzzleHttp\Client; 
use GuzzleHttp\Cookie;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\UriInterface;
use PHPUnit\Framework\Assert;
use App\Services\CommonService;

/**
* Our FileService, containing all useful methods for business logic around File
*/
class LoginService extends Assert
{
    
    
    /**
    * Loads our $fileRepo with the actual Repo associated with our fileInterface
    * 
    * @param fileInterface $fileRepo
    * @return FileService
    */
    public function __construct()
    {
         
    }

    public function token()
    {
        
          $client = new Client();
     
                  
        $res = $client->request('GET', env('API_DRIVE_URL').'index.php/csrftoken');
       
        return $res->getBody();
    }
    
    public function home(Request $request)
    {
            $onRedirect = function(
                RequestInterface $request,
                ResponseInterface $response,
                UriInterface $uri
            ) {
 
            };
              
       // $strCookie='nc_username='.$_COOKIE['nc_username'].';oc_sessionPassphrase='.$_COOKIE['oc_sessionPassphrase'].';nc_token='.$_COOKIE['nc_token'].';nc_session_id='.$_COOKIE['nc_session_id'].';nc_sameSiteCookiestrict='.$_COOKIE['nc_sameSiteCookiestrict'].';'.env('OCSSESSION').'='.$_COOKIE[env('OCSSESSION')].';nc_sameSiteCookielax='.$_COOKIE['nc_sameSiteCookielax'];
           $strCookie=$this->getStrCookie($request);
        $jar = new \GuzzleHttp\Cookie\CookieJar();
            $client = new Client([[
            'allow_redirects' => [
            'max'             => 2,        // allow at most 10 redirects.
            'strict'          => true,      // use "strict" RFC compliant redirects.
            'referer'         => true,      // add a Referer header
            'protocols'       => ['http','https'], // only allow https URLs
            'on_redirect'     => $onRedirect,
            'track_redirects' => true]],'headers' => ['Host'=> '64.225.4.119','Cookie'=> $strCookie],'cookies' => $jar]);
  
 
                  
        $res = $client->request('GET', env('API_DRIVE_URL').'index.php/login');
        if (strcmp('200',$res->getStatusCode())==0)
        {
            echo '200';
        }
        else if (strcmp('303',$res->getStatusCode())==0)
        {
            echo '303';
        }
        else 
        {
           echo '400';
        }
        return $res->getBody();
    }
    
	/**
	 * @deprecated 
	 */
    public function logoutDEPRECATED(Request $request)
    {
         
        if ($request->cookies->has('nc_username'))
        {

            $onRedirect = function(
                RequestInterface $request,
                ResponseInterface $response,
                UriInterface $uri
            ) {
                  
             //     return  response()->json(['token' => ' ','status' => '200','message'=>"OK"],'200',['Access-Control-Allow-Origin'=>env('HOST_IP_FRONTEND') , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']);
            };
         //  $strCookie='nc_username='.$request->cookie()['nc_username'].'; oc_sessionPassphrase='.$request->cookie()['oc_sessionPassphrase'].'; nc_token='.$request->cookie()['nc_token'].'; nc_session_id='.$request->cookie()['nc_session_id'].'; nc_sameSiteCookiestrict='.$request->cookie()['nc_sameSiteCookiestrict'].'; '.env('OCSSESSION').'='.$request->cookie()[env('OCSSESSION')].'; nc_sameSiteCookielax='.$request->cookie()['nc_sameSiteCookielax'];
            // $strCookie='nc_username='.$request->cookie()['nc_username'].'; nc_token=
            // '.$request->cookie()['nc_token'].'; nc_session_id='.$request->cookie()['nc_session_id'].'; nc_sameSiteCookiestrict='.$request->cookie()['nc_sameSiteCookiestrict'].'; nc_sameSiteCookielax='.$request->cookie()['nc_sameSiteCookielax'];
        
        $strCookie=$this->getStrCookie($request);

            $client = new Client(['headers' => ['requesttoken' => $request->input('requesttoken'),'Cookie' => $strCookie,'Host'=> env('HOST_DRIVE'),'Sec-Fetch-Dest'=> 'document','Sec-Fetch-Mode'=> 'navigate','Sec-Fetch-Site'=>  'same-origin','Sec-Fetch-User'=> '?1','user-agent'=> env('USER_AGENT', 'Bridge'),'AddressIp'=>$request->header('AddressIp')]]);

            $res = $client->request('GET', env('API_DRIVE_URL').'index.php/logout',[ 'allow_redirects' => [
            'max'             => 15,        // allow at most 10 redirects.
            'strict'          => true,      // use "strict" RFC compliant redirects.
            'referer'         => true,      // add a Referer header
            'protocols'       => ['http','https'], // only allow https URLs
            'on_redirect'     => $onRedirect,
            'track_redirects' => true] ,'http_errors'=>false,'headers' => ['Host'=> env('HOST_DRIVE')]]);
 
            $this->destroyCookie($request);
            
            return '{"token":"","status":200,"message":"OK"}';
           // return  response()->json(['token' => '','status' => 200,'message'=>'OK'],200,['Access-Control-Allow-Origin'=>env('HOST_IP_FRONTEND') , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']);
        }
        else
        {
            //return  response()->json(['token' => '','status' => 401,'message'=>'Unauthorized'],401,['Access-Control-Allow-Origin'=>env('HOST_IP_FRONTEND') , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']);
        
        }
        
         
    }

	/**
	 * Logout based on domain-cookie auth
	 *
	 * @param Request $request
	 * @return void
	 */
	public function logout(Request $request)
	{
		try {
			$strCookie=$this->getStrCookie($request);
			$client = new Client(['headers' => [
									'requesttoken' => $request->input('requesttoken'),
									'Cookie' => $strCookie,
									'Host'=> env('HOST_DRIVE'),
									'Sec-Fetch-Dest'=> 'document',
									'Sec-Fetch-Mode'=> 'navigate',
									'Sec-Fetch-Site'=> 'same-origin',
									'Sec-Fetch-User'=> '?1',
									'user-agent'=> env('USER_AGENT', 'Bridge'),
									'AddressIp'=>$request->header('AddressIp')]
								]);
			$res = $client->request('GET', env('API_DRIVE_URL').'index.php/logout',[ 'allow_redirects' => [
							'max'             => 15,        // allow at most 10 redirects.
							'strict'          => true,      // use "strict" RFC compliant redirects.
							'referer'         => true,      // add a Referer header
							'protocols'       => ['http','https'], // only allow https URLs							
							'track_redirects' => true] ,'http_errors'=>false,'headers' => ['Host'=> env('HOST_DRIVE')]]);
			
			
			$this->destroyCookie($request);							
			return response()->json(['token' => '',
									 'status' => $res->getStatusCode(),
									 'message' => $res->getReasonPhrase()],
									 $res->getStatusCode(),
									 $request->headers->all());
		} catch (\Throwable $th) {
			 
			 return response()->json(['token' => '',
									 'status' => $th->getCode(),
									 'message' => $th->getMessage()],
									 $th->getCode(),
									 $request->headers->all());
		}		
	}

    
     public function logout1(Request $request)
    {
        try
        {
              $onRedirect = function(
                RequestInterface $request,
                ResponseInterface $response,
                UriInterface $uri
            ) {
                  
             //     return  response()->json(['token' => ' ','status' => '200','message'=>"OK"],'200',['Access-Control-Allow-Origin'=>env('HOST_IP_FRONTEND') , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']);
            };
         //  $strCookie='nc_username='.$request->cookie()['nc_username'].'; oc_sessionPassphrase='.$request->cookie()['oc_sessionPassphrase'].'; nc_token='.$request->cookie()['nc_token'].'; nc_session_id='.$request->cookie()['nc_session_id'].'; nc_sameSiteCookiestrict='.$request->cookie()['nc_sameSiteCookiestrict'].'; '.env('OCSSESSION').'='.$request->cookie()[env('OCSSESSION')].'; nc_sameSiteCookielax='.$request->cookie()['nc_sameSiteCookielax'];
            // $strCookie='nc_username='.$request->cookie()['nc_username'].'; nc_token=
            // '.$request->cookie()['nc_token'].'; nc_session_id='.$request->cookie()['nc_session_id'].'; nc_sameSiteCookiestrict='.$request->cookie()['nc_sameSiteCookiestrict'].'; nc_sameSiteCookielax='.$request->cookie()['nc_sameSiteCookielax'];
        
        $strCookie=$this->getStrCookie($request);

            $client = new Client(['headers' => ['requesttoken' => $request->input('requesttoken'),'Cookie' => $strCookie,'Host'=> env('HOST_DRIVE'),'Sec-Fetch-Dest'=> 'document','Sec-Fetch-Mode'=> 'navigate','Sec-Fetch-Site'=>  'same-origin','Sec-Fetch-User'=> '?1']]);

            $res = $client->request('GET', env('API_DRIVE_URL').'index.php/logout',[ 'allow_redirects' => [
            'max'             => 15,        // allow at most 10 redirects.
            'strict'          => true,      // use "strict" RFC compliant redirects.
            'referer'         => true,      // add a Referer header
            'protocols'       => ['http','https'], // only allow https URLs
            'on_redirect'     => $onRedirect,
            'track_redirects' => true] ,'http_errors'=>false,'headers' => ['Host'=> env('HOST_DRIVE')]]);
 
            if (strcmp('200',$res->getStatusCode())==0 || strcmp('997',$res->getStatusCode())==0)
            {
 
                return  response()->json(['token' => $res->getBody(),'status' => $res->getStatusCode(),'message'=>$res->getReasonPhrase()],$res->getStatusCode(),['Access-Control-Allow-Origin'=>env('HOST_IP_FRONTEND') , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']);
            }
            else {
                return  response()->json(['token' => $res->getBody(), 'status' => $res->getStatusCode(),'message'=>$res->getReasonPhrase()],$res->getStatusCode(),['Access-Control-Allow-Origin'=>env('HOST_IP_FRONTEND') , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']); // Status
            }
        }
        catch (GuzzleHttp\Exception\ClientException $ex) {
             
            
            return  response()->json(['token' => '','status' => Response::HTTP_UNAUTHORIZED,'message'=>$res->getReasonPhrase()],$res->getStatusCode(),['Access-Control-Allow-Origin'=>env('HOST_IP_FRONTEND') , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']);
        }
        catch (GuzzleHttp\Exception\TooManyRedirectsException $ex) {
             
             
            return  response()->json(['token' => '','status' => Response::HTTP_UNAUTHORIZED,'message'=>$res->getReasonPhrase()],$res->getStatusCode(),['Access-Control-Allow-Origin'=>env('HOST_IP_FRONTEND') , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']);
        }
         
    }
    
    public function loginTest(Request $request)
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
            'track_redirects' => true],'cookies' => $jar,'headers' => ['origin'=> $request->header('Origin'),'user-agent'=> env('USER_AGENT', 'Bridge')]]);
            //take token
            
            $data = $request->json()->all();
            
            $res = $client->request('GET', env('API_DRIVE_URL').'index.php/csrftoken');  
      
            $resptoken = json_decode($res->getBody(),true);

            //$pdata[0] password cripted,$pdata[1] key,$pdata[2] iv
            //  $pdata = explode(" ", $data['password']);
            //  $password = CommonService::decrypt($pdata[0],$pdata[1],$pdata[2]);
            
             
                $password =  $data['password'];
 
             //create form data login
            $jsonreq=[
                'multipart' => [
                    [
                        'name' => 'user',
                        'contents' => $data['user'],
                    ],
                    [
                        'name' => 'password',
                        'contents' => $password,
                    ],
                    [
                        'name' => 'timezone_offset',
                        'contents' => $data['timezone_offset'],
                    ],[
                        'name' => 'timezone',
                        'contents' => $data['timezone'],
                    ]
                   ,[
                        'name' => 'requesttoken', 
                        'contents' => $resptoken['token'],
                    ]
                    ]
            ];

            //call api login 
            $res = $client->request('POST', env('API_DRIVE_URL').'index.php/login',$jsonreq);
            $islogin=false;
            foreach($jar->toArray() as $item)
            {
                $name = $item['Name'];
//                 if ($item['Name'] == '__Host-nc_sameSiteCookielax') {
//                     $name='nc_sameSiteCookielax';
//                 }
//                 if ($item['Name'] == '__Host-nc_sameSiteCookiestrict') {
//                     $name='nc_sameSiteCookiestrict';
//                 }
               // Log::debug($item['Name']."=".$item['Value']);
               setcookie($name, $item['Value'], $item['Expires'],$item['Path'],env('HOST_IP_FRONTEND'));


               if ((strtoupper(substr(PHP_OS, 0, 3)) === 'WIN')&&((float)phpversion()>=7.3)) {
                  
//                     setcookie($item['Name'], $item['Value'], [
//                        'expires' => $item['Expires'],
//                        'path' => $item['Path'],
//                        'domain' => env('HOST_IP_FRONTEND'),
//                        'secure' => true,
//                        'samesite' => 'None'
//                    ]);
                      setcookie($item['Name'], $item['Value'], [
                        'expires' => $item['Expires'],
                        'path' => $item['Path'],
                        'domain' => env('DOMAIN_IP_FRONTEND'),
                        'secure' => true,
                        'samesite' => 'None'
                    ]);
                } else {
//                   setcookie($name, $item['Value'], $item['Expires'],$item['Path']."; SameSite=None",env('HOST_IP_FRONTEND'),true);
                    setcookie($name, $item['Value'], $item['Expires'],$item['Path']."; SameSite=None",env('DOMAIN_IP_FRONTEND'),true);
                }
                

           
               if ($name=='nc_username')
                {
                   $uname = $item['Value'];
                    if (isset($uname)) {
                        Log::debug("cookie  nc_username".$uname);
                    }
                    $islogin=true;
                } 
            }

            
            if (strcmp('200',$res->getStatusCode())==0 && $islogin)
            {
                //read html response
                $dom = new \DOMDocument;
                @$dom->loadHTML($res->getBody());
                $token="";
                //retrive token by field data-requesttoken in head 
                $heads = $dom->getElementsByTagName('head')->item(0)->attributes;
                foreach($heads as $head)
                {
                    if ($head->nodeName=='data-requesttoken')
                    {
                        $token=$head->nodeValue;
                    }
                }

                return response()->json(['token' => $token,'status' => $res->getStatusCode(),'message'=>$res->getReasonPhrase(),'totp'=> false],$res->getStatusCode(),['Access-Control-Allow-Origin'=>env('HOST_IP_FRONTEND') , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']);
  
            }
            else if (strcmp('200',$res->getStatusCode())==0) {
               $state=0;
 
                $value="";

                $dom = new \DOMDocument;
                @$dom->loadHTML($res->getBody());
                $token="";
                //retrive token by field data-requesttoken in head 
                $heads = $dom->getElementsByTagName('head')->item(0)->attributes;
                foreach($heads as $head)
                {
                    if ($head->nodeName=='data-requesttoken')
                    {
                        $token=$head->nodeValue;
                    }
                }
                
                if (strpos($res->getBody(), 'userDisabledMsg') !== false) {
                    Log::debug('User disabled');
                    return  response()->json(['token' => $token, 'status' => $res->getStatusCode(),'message'=>'User disabled','totp'=> false],$res->getStatusCode(),['Access-Control-Allow-Origin'=>env('HOST_IP_FRONTEND') , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']); // Status
                }
                
                if (strpos($res->getBody(), 'two-factor-provider') !== false) {
                    Log::debug('Setup two-factor');
                    $state=0;
                    return  response()->json(['token' => $token, 'status' => $res->getStatusCode(),'message'=> $res->getReasonPhrase(),'totp'=> true,'state'=> $state],$res->getStatusCode(),['Access-Control-Allow-Origin'=>env('HOST_IP_FRONTEND') , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']); // Status
                }
                else if(strpos($res->getBody(), 'Authenticator app') !== false)
                {
                    Log::debug('Authenticator app');
                    $value="challenge";
                }
                else  if (strpos($res->getBody(), 'challenge/backup_codes') !== false) {
                    Log::debug('Use backup code');
                     
                    return  response()->json(['token' => $token, 'status' => $res->getStatusCode(),'message'=> $res->getReasonPhrase(),'backup_codes'=> true],$res->getStatusCode(),['Access-Control-Allow-Origin'=>env('HOST_IP_FRONTEND') , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']); // Status
                }
                if ($value=="challenge")
                {
                    Log::debug('challenge2');
                    $state=2;
                    return  response()->json(['token' => $token, 'status' => $res->getStatusCode(),'message'=> $res->getReasonPhrase(),'totp'=> true,'state'=> $state],$res->getStatusCode(),['Access-Control-Allow-Origin'=>env('HOST_IP_FRONTEND') , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']); // Status
                }
                else
                {
                   $body=['username' => $data['user']];  
                   $numberTrial = CommonService::simpleResponseAll($request, 'ocs/v1.php/apps/vdeskintegration/user/numbertrial',false,'POST',$body);  

                   $trial =strval($numberTrial);
                   return  response()->json(['token' => $token, 'status' => Response::HTTP_UNAUTHORIZED,'message'=>'current user not logged','totp'=> false,'trialFailed' => $trial],$res->getStatusCode(),['Access-Control-Allow-Origin'=>env('HOST_IP_FRONTEND') , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']); // Status
                }
                
            }
            
            else {
                return  response()->json(['token' => '', 'status' => $res->getStatusCode(),'message'=>$res->getReasonPhrase(),'totp'=> false],$res->getStatusCode(),['Access-Control-Allow-Origin'=>env('HOST_IP_FRONTEND') , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']); // Status
            }
            
        } 
        catch (GuzzleHttp\Exception\ClientException $ex) {
            return  response()->json(['token' => '','status' => Response::HTTP_UNAUTHORIZED,'message'=>$res->getReasonPhrase(),'totp'=> false],$res->getStatusCode(),['Access-Control-Allow-Origin'=>env('HOST_IP_FRONTEND') , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']);
        }
   }
    

    public function login(Request $request)
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
            'track_redirects' => true],'cookies' => $jar,'headers' => ['origin'=> $request->header('Origin'),'user-agent'=> env('USER_AGENT', 'Bridge'),'AddressIp'=>$request->header('AddressIp')]]);
            //take token
            
            $data = $request->json()->all();
            
            $res = $client->request('GET', env('API_DRIVE_URL').'index.php/csrftoken');  
      
            $resptoken = json_decode($res->getBody(),true);
            $isCrypt = true;
            // foreach ($request->headers as $header => $value) {
            //     Log::debug($value);
            //     Log::debug($header);
            //     if ((($header == 'origin') && ($value[0]='http://'.env('API_DRIVE_URL'))))
            //     {
                   
            //         Log::debug("true");
            //         $isCrypt=true;
               
            //     }
            // }
            if (isset($data['isCrypt']))
            {
                Log::debug("truae");
                if (!$data['isCrypt'])
                {
                    $isCrypt = false;
                }
            }
            if ($isCrypt)
            {
                $pdata = explode(" ", $data['password']);
                if (count($pdata)==3)
                {
                    $password = CommonService::decrypt($pdata[0],$pdata[1],$pdata[2]);
                }
                else
                {
                    $password =  "errore";
                }
                
            }
            else
            {
                $password =  $data['password'];
            }
             
             //  $password =  $data['password'];
 
             //create form data login
            $jsonreq=[
                'multipart' => [
                    [
                        'name' => 'user',
                        'contents' => $data['user'],
                    ],
                    [
                        'name' => 'password',
                        'contents' => $password,
                    ],
                    [
                        'name' => 'timezone_offset',
                        'contents' => $data['timezone_offset'],
                    ],[
                        'name' => 'timezone',
                        'contents' => $data['timezone'],
                    ]
                   ,[
                        'name' => 'requesttoken', 
                        'contents' => $resptoken['token'],
                    ]
                    ]
            ];

            //call api login 
            $res = $client->request('POST', env('API_DRIVE_URL').'index.php/login',$jsonreq);
            $islogin=false;
           
            
            foreach($jar->toArray() as $item)
            {
                $name = $item['Name'];
//                 if ($item['Name'] == '__Host-nc_sameSiteCookielax') {
//                     $name='nc_sameSiteCookielax';
//                 }
//                 if ($item['Name'] == '__Host-nc_sameSiteCookiestrict') {
//                     $name='nc_sameSiteCookiestrict';
//                 }
                Log::debug($item['Name']."=".$item['Value']);
               setcookie($name, $item['Value'], $item['Expires'],$item['Path'],env('HOST_IP_FRONTEND'));


            //    if ((strtoupper(substr(PHP_OS, 0, 3)) === 'WIN')&&((float)phpversion()>=7.3)) {
                if (((float)phpversion()>=7.3)) {   
//                     setcookie($item['Name'], $item['Value'], [
//                        'expires' => $item['Expires'],
//                        'path' => $item['Path'],
//                        'domain' => env('HOST_IP_FRONTEND'),
//                        'secure' => true,
//                        'samesite' => 'None'
//                    ]);
                      setcookie($item['Name'], $item['Value'], [
                        'expires' => $item['Expires'],
                        'path' => $item['Path'],
                        'domain' => env('DOMAIN_IP_FRONTEND'),
                        'secure' => true,
                        'samesite' => 'None'
                    ]);
                } else {
//                   setcookie($name, $item['Value'], $item['Expires'],$item['Path']."; SameSite=None",env('HOST_IP_FRONTEND'),true);
                    setcookie($name, $item['Value'], $item['Expires'],$item['Path']."; SameSite=None",env('DOMAIN_IP_FRONTEND'),true);
                }
                

           
               if ($name=='nc_username')
                {
                   $uname = $item['Value'];
                    if (isset($uname)) {
                        Log::debug("cookie  nc_username".$uname);
                    }
                    $islogin=true;
                } 
            }

            
            if (strcmp('200',$res->getStatusCode())==0 && $islogin)
            {
                //read html response
                $dom = new \DOMDocument;
                @$dom->loadHTML($res->getBody());
                $token="";
                //retrive token by field data-requesttoken in head 
                $heads = $dom->getElementsByTagName('head')->item(0)->attributes;
                foreach($heads as $head)
                {
                    if ($head->nodeName=='data-requesttoken')
                    {
                        $token=$head->nodeValue;
                    }
                }

                return response()->json(['token' => $token,'status' => $res->getStatusCode(),'message'=>$res->getReasonPhrase(),'totp'=> false],$res->getStatusCode(),['Access-Control-Allow-Origin'=>env('HOST_IP_FRONTEND') , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']);
 
         
               // return  response()->json(['token' => $token,'status' => $res->getStatusCode()]);
            }
            else if (strcmp('200',$res->getStatusCode())==0) {
               $state=0;
 
                $value="";

                $dom = new \DOMDocument;
                @$dom->loadHTML($res->getBody());
                $token="";
                //retrive token by field data-requesttoken in head 
                $heads = $dom->getElementsByTagName('head')->item(0)->attributes;
                foreach($heads as $head)
                {
                    if ($head->nodeName=='data-requesttoken')
                    {
                        $token=$head->nodeValue;
                    }
                }
                Log::debug($res->getBody());
                if (strpos($res->getBody(), 'userDisabledMsg') !== false) {
                    Log::debug('User disabled');
                    return  response()->json(['token' => $token, 'status' => $res->getStatusCode(),'message'=>'User disabled','totp'=> false],$res->getStatusCode(),['Access-Control-Allow-Origin'=>env('HOST_IP_FRONTEND') , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']); // Status
                }
                
                if (strpos($res->getBody(), 'two-factor-provider') !== false) {
                    Log::debug('Setup two-factor');
                    $state=0;
                    return  response()->json(['token' => $token, 'status' => $res->getStatusCode(),'message'=> $res->getReasonPhrase(),'totp'=> true,'state'=> $state],$res->getStatusCode(),['Access-Control-Allow-Origin'=>env('HOST_IP_FRONTEND') , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']); // Status
                }
                else if(strpos($res->getBody(), 'Authenticator app') !== false)
                {
                    Log::debug('Authenticator app');
                    $value="challenge";
                }
                else  if (strpos($res->getBody(), 'challenge/backup_codes') !== false) {
                    Log::debug('Use backup code');
                     
                    return  response()->json(['token' => $token, 'status' => $res->getStatusCode(),'message'=> $res->getReasonPhrase(),'backup_codes'=> true],$res->getStatusCode(),['Access-Control-Allow-Origin'=>env('HOST_IP_FRONTEND') , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']); // Status
                }
                if ($value=="challenge")
                {
                    Log::debug('challenge2');
                    $state=2;
                   return  response()->json(['token' => $token, 'status' => $res->getStatusCode(),'message'=> $res->getReasonPhrase(),'totp'=> true,'state'=> $state],$res->getStatusCode(),['Access-Control-Allow-Origin'=>env('HOST_IP_FRONTEND') , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']); // Status
                }
                else
                {
                //     Log::debug('non autorizzato');
                //     $body=['username' => $data['user']] ;
                //     Log::debug('non autorizzato1');
                //  $numberTrial = CommonService::simpleResponseAll($request, 'ocs/v1.php/apps/vdeskintegration/user/numbertrial',false,'POST',$body); 
                //  Log::debug('non autorizzato2s');
                //  Log::debug($numberTrial);
                $body=['username' => $data['user']];  
                $numberTrial = CommonService::simpleResponseAll($request, 'ocs/v1.php/apps/vdeskintegration/user/numbertrial',false,'POST',$body);  
                
                $trial =strval($numberTrial);
                    return  response()->json(['token' => $token, 'status' => Response::HTTP_UNAUTHORIZED,'message'=>'current user not logged','totp'=> false,'trialFailed' => $trial],$res->getStatusCode(),['Access-Control-Allow-Origin'=>env('HOST_IP_FRONTEND') , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']); // Status
                }
                
            }
            
            else {
                // $body=['username' => $data['user']] ;
                //  $numberTrial = CommonService::simpleResponseAll($request, 'ocs/v1.php/apps/vdeskintegration/user/numbertrial',false,'POST',$body); 
                //  Log::debug($numberTrial);
                return  response()->json(['token' => '', 'status' => $res->getStatusCode(),'message'=>$res->getReasonPhrase(),'totp'=> false],$res->getStatusCode(),['Access-Control-Allow-Origin'=>env('HOST_IP_FRONTEND') , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']); // Status
            }
            
        } 
        catch (GuzzleHttp\Exception\ClientException $ex) {
            return  response()->json(['token' => '','status' => Response::HTTP_UNAUTHORIZED,'message'=>$res->getReasonPhrase(),'totp'=> false],$res->getStatusCode(),['Access-Control-Allow-Origin'=>env('HOST_IP_FRONTEND') , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']);
        }
   }
   
   public function getloginflow(Request $request)
   {
       //$data = $request->json()->all(); 
       return CommonService::simpleResponse($request, 'index.php/login/flow',true,'GET',$data); 
       
   }
   
   public function loginflowgrant(Request $request)
   {
       //$data = $request->json()->all(); 
       return CommonService::simpleResponse($request, 'index.php/login/flow',true,'GET',$data); 
       
   }
   
   public function loginflow(Request $request)
   {
       $data = $request->json()->all(); 
       return CommonService::simpleResponse($request, 'index.php/login/flow',true,'POST',$data); 
       
   }
   
    public function password_recovery(Request $request)
    {
       try
       {
       
           $client = new Client();

           $data = $request->json()->all(); 

            //create form data login
           $jsonreq=[
               'multipart' => [
                   [
                       'name' => 'user',
                       'contents' => $data['user'],
                   ]
                ]
           ];

           //call api login 
           $res = $client->request('POST', env('API_DRIVE_URL').'index.php/lostpassword/email', $jsonreq);
         
           if (strcmp('200',$res->getStatusCode())==0) {
              return response()->json(['status' => $res->getStatusCode()]);
           } else {
               return  response()->json(['token' => '', 'status' => $res->getStatusCode(),'message'=>$res->getReasonPhrase()],$res->getStatusCode(),['Access-Control-Allow-Origin'=>'http://localhost:4200' , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']); // Status
           }
           
       } 
       catch (GuzzleHttp\Exception\ClientException $ex) {
           return  response()->json(['token' => '','status' => Response::HTTP_UNAUTHORIZED,'message'=>$res->getReasonPhrase()],$res->getStatusCode(),['Access-Control-Allow-Origin'=>'http://localhost:4200' , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']);
       }
  }
  
    public function twofactorstate(Request $request)
    {
         
        return CommonService::simpleResponse($request, 'index.php/apps/twofactor_totp/settings/state',false,'GET'); 
    }
  
    public function twofactorauth(Request $request)
    {
        $data = $request->json()->all(); 
        return CommonService::simpleResponse($request, 'index.php/settings/api/admin/twofactorauth',false,'PUT',$data); 
    }
    public function twofactorenable(Request $request)
    {
        $data = $request->json()->all(); 
        return CommonService::simpleResponse($request, 'index.php/apps/twofactor_totp/settings/enable',false,'POST',$data); 
    }
    
    public function challenge(Request $request)
    {
        $challengeProviderId = 'totp';
        $data = $request->json()->all(); 
        if ($request->query->has('challengeProviderId')) {
            $challengeProviderId=$request->input('challengeProviderId');
        }
        
        return CommonService::twoResponseLogin($request, 'index.php/login/challenge/'.$challengeProviderId,$data,$challengeProviderId); 
    }
    
    public function confirmTest(Request $request)
    {
        $data = $request->json()->all();
       
        return CommonService::simpleResponse($request, 'index.php/login/confirm',true,'POST',$data);
    }   

    
    public function confirm(Request $request)
    {
        $data = $request->json()->all();
        Log::debug($data);
        $pdata = explode(" ", $data['password']);
        $data['password'] = CommonService::decrypt($pdata[0],$pdata[1],$pdata[2]);
        return CommonService::simpleResponse($request, 'index.php/login/confirm',true,'POST',$data);
    }
    
    public function getStrCookie(Request $request)
    {
       $strCookie="";
        if ($request->cookies->has('nc_username')) {
            $strCookie=$strCookie.'nc_username='.$request->cookie()['nc_username'].';';
        }
        if ($request->cookies->has('oc_sessionPassphrase')) {
            $strCookie=$strCookie.'oc_sessionPassphrase='.$request->cookie()['oc_sessionPassphrase'].';';
        }
        if ($request->cookies->has('nc_token')) {
            $strCookie=$strCookie.'nc_token='.$request->cookie()['nc_token'].';';
        }
        if ($request->cookies->has('nc_session_id')) {
            $strCookie=$strCookie.'nc_session_id='.$request->cookie()['nc_session_id'].';';
        }
        if ($request->cookies->has('nc_sameSiteCookiestrict')) {
            $strCookie=$strCookie.'nc_sameSiteCookiestrict='.$request->cookie()['nc_sameSiteCookiestrict'].';';
        }
        if ($request->cookies->has('__Host-nc_sameSiteCookiestrict')) {
            $strCookie=$strCookie.'nc_sameSiteCookiestrict='.$request->cookie()['__Host-nc_sameSiteCookiestrict'].';';
            $strCookie=$strCookie.'__Host-nc_sameSiteCookiestrict='.$request->cookie()['__Host-nc_sameSiteCookiestrict'].';';
        }
        if ($request->cookies->has(env('OCSSESSION'))) {
            $strCookie=$strCookie. env('OCSSESSION').'='.$request->cookie()[env('OCSSESSION')].';';
        }
        if ($request->cookies->has('nc_sameSiteCookielax')) {
            $strCookie=$strCookie.'nc_sameSiteCookielax='.$request->cookie()['nc_sameSiteCookielax'].';';
        }
        if ($request->cookies->has('__Host-nc_sameSiteCookielax')) {
            $strCookie=$strCookie.'nc_sameSiteCookielax='.$request->cookie()['__Host-nc_sameSiteCookielax'].';';
            $strCookie=$strCookie.'__Host-nc_sameSiteCookielax='.$request->cookie()['__Host-nc_sameSiteCookielax'].';';
        }
        return $strCookie;
    }
    
    public function destroyCookie(Request $request)
    {
        
        if ($request->cookies->has('nc_username')) {
             setcookie('nc_username', '', time() - 3600, '/');
             setcookie('nc_username', '', time() - 3600, '/',env('DOMAIN_IP_FRONTEND'));
             setcookie('nc_username', '', time() - 3600, '/',env('HOST_IP_FRONTEND'));
             setcookie('nc_username', '', time() - 3600, '/',".".env('DOMAIN_IP_FRONTEND'));
             setcookie('nc_username', '', time() - 3600, '/',".".env('HOST_IP_FRONTEND'));
        }
        if ($request->cookies->has('oc_sessionPassphrase')) {
           setcookie('oc_sessionPassphrase', '', time() - 3600, '/');
           setcookie('oc_sessionPassphrase', '', time() - 3600, '/',env('DOMAIN_IP_FRONTEND'));
           setcookie('oc_sessionPassphrase', '', time() - 3600, '/',env('HOST_IP_FRONTEND'));
           setcookie('oc_sessionPassphrase', '', time() - 3600, '/',".".env('DOMAIN_IP_FRONTEND'));
           setcookie('oc_sessionPassphrase', '', time() - 3600, '/',".".env('HOST_IP_FRONTEND'));
        }
        if ($request->cookies->has('nc_token')) {
            setcookie('nc_token', '', time() - 3600, '/');
            setcookie('nc_token', '', time() - 3600, '/',env('DOMAIN_IP_FRONTEND'));
            setcookie('nc_token', '', time() - 3600, '/',env('HOST_IP_FRONTEND'));
            setcookie('nc_token', '', time() - 3600, '/',".".env('DOMAIN_IP_FRONTEND'));
            setcookie('nc_token', '', time() - 3600, '/',".".env('HOST_IP_FRONTEND'));
        }
        if ($request->cookies->has('nc_session_id')) {
            setcookie('nc_session_id', '', time() - 3600, '/');
            setcookie('nc_session_id', '', time() - 3600, '/',env('DOMAIN_IP_FRONTEND'));
            setcookie('nc_session_id', '', time() - 3600, '/',env('HOST_IP_FRONTEND'));
            setcookie('nc_session_id', '', time() - 3600, '/',".".env('DOMAIN_IP_FRONTEND'));
            setcookie('nc_session_id', '', time() - 3600, '/',".".env('HOST_IP_FRONTEND'));
        }
        if ($request->cookies->has('nc_sameSiteCookiestrict')) {
           setcookie('nc_sameSiteCookiestrict', '', time() - 3600, '/');
           setcookie('nc_sameSiteCookiestrict', '', time() - 3600, '/',env('DOMAIN_IP_FRONTEND'));
           setcookie('nc_sameSiteCookiestrict', '', time() - 3600, '/',env('HOST_IP_FRONTEND'));
           setcookie('nc_sameSiteCookiestrict', '', time() - 3600, '/',".".env('DOMAIN_IP_FRONTEND'));
           setcookie('nc_sameSiteCookiestrict', '', time() - 3600, '/',".".env('HOST_IP_FRONTEND'));
        }
        if ($request->cookies->has('__Host-nc_sameSiteCookiestrict')) {
            setcookie('__Host-nc_sameSiteCookiestrict', '', time() - 3600, '/');
            setcookie('__Host-nc_sameSiteCookiestrict', '', time() - 3600, '/',env('DOMAIN_IP_FRONTEND'));
            setcookie('__Host-nc_sameSiteCookiestrict', '', time() - 3600, '/',env('HOST_IP_FRONTEND'));
            setcookie('__Host-nc_sameSiteCookiestrict', '', time() - 3600, '/',".".env('DOMAIN_IP_FRONTEND'));
            setcookie('__Host-nc_sameSiteCookiestrict', '', time() - 3600, '/',".".env('HOST_IP_FRONTEND'));
        }
        if ($request->cookies->has(env('OCSSESSION'))) {
            setcookie(env('OCSSESSION'), '', time() - 3600, '/');
            setcookie(env('OCSSESSION'), '', time() - 3600, '/',env('DOMAIN_IP_FRONTEND'));
            setcookie(env('OCSSESSION'), '', time() - 3600, '/',env('HOST_IP_FRONTEND'));
            setcookie(env('OCSSESSION'), '', time() - 3600, '/',".".env('DOMAIN_IP_FRONTEND'));
            setcookie(env('OCSSESSION'), '', time() - 3600, '/',".".env('HOST_IP_FRONTEND'));
        }
        if ($request->cookies->has('nc_sameSiteCookielax')) {
            setcookie('nc_sameSiteCookielax', '', time() - 3600, '/');
            setcookie('nc_sameSiteCookielax', '', time() - 3600, '/',env('DOMAIN_IP_FRONTEND'));
            setcookie('nc_sameSiteCookielax', '', time() - 3600, '/',env('HOST_IP_FRONTEND'));
            setcookie('nc_sameSiteCookielax', '', time() - 3600, '/',".".env('DOMAIN_IP_FRONTEND'));
            setcookie('nc_sameSiteCookielax', '', time() - 3600, '/',".".env('HOST_IP_FRONTEND'));
        }
        if ($request->cookies->has('__Host-nc_sameSiteCookielax')) {
            setcookie('__Host-nc_sameSiteCookielax', '', time() - 3600, '/');
            setcookie('__Host-nc_sameSiteCookielax', '', time() - 3600, '/',env('DOMAIN_IP_FRONTEND'));
            setcookie('__Host-nc_sameSiteCookielax', '', time() - 3600, '/',env('HOST_IP_FRONTEND'));
            setcookie('__Host-nc_sameSiteCookielax', '', time() - 3600, '/',".".env('DOMAIN_IP_FRONTEND'));
            setcookie('__Host-nc_sameSiteCookielax', '', time() - 3600, '/',".".env('HOST_IP_FRONTEND'));
        }
        return true;
    }
    
    public function destroyCookie1(Request $request)
    {

        if ($request->cookies->has('nc_username')) {
             setcookie('nc_username', '', time() - 3600, '/');
          
        }
        if ($request->cookies->has('oc_sessionPassphrase')) {
           setcookie('oc_sessionPassphrase', '', time() - 3600, '/');
        }
        if ($request->cookies->has('nc_token')) {
            setcookie('nc_token', '', time() - 3600, '/');
        }
        if ($request->cookies->has('nc_session_id')) {
            setcookie('nc_session_id', '', time() - 3600, '/');
        }
        if ($request->cookies->has('nc_sameSiteCookiestrict')) {
           setcookie('nc_sameSiteCookiestrict', '', time() - 3600, '/');
        }
        if ($request->cookies->has('__Host-nc_sameSiteCookiestrict')) {
            setcookie('__Host-nc_sameSiteCookiestrict', '', time() - 3600, '/');
        }
        if ($request->cookies->has(env('OCSSESSION'))) {
            setcookie(env('OCSSESSION'), '', time() - 3600, '/');
        }
        if ($request->cookies->has('nc_sameSiteCookielax')) {
            setcookie('nc_sameSiteCookielax', '', time() - 3600, '/');
        }
        if ($request->cookies->has('__Host-nc_sameSiteCookielax')) {
            setcookie('__Host-nc_sameSiteCookielax', '', time() - 3600, '/');
        }
        return true;
    }
    
    public function validateemail(Request $request)
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
            'max'             => 1,        // allow at most 10 redirects.
            'strict'          => true,      // use "strict" RFC compliant redirects.
            'referer'         => true,      // add a Referer header
            'protocols'       => ['http','https'], // only allow https URLs
            'on_redirect'     => $onRedirect,
            'track_redirects' => true],'cookies' => $jar]);
            //take token

            $data = $request->json()->all();
 
            //call api login 
            $res = $client->request('POST', env('API_DRIVE_URL').'index.php/apps/registration',['http_errors'=>false,'json'=>$data]);
           
           
            if (strcmp('200',$res->getStatusCode())==0)
            {
                //read html response
                $dom = new \DOMDocument;
                @$dom->loadHTML($res->getBody());
                $token="";
                //retrive token by field data-requesttoken in head 
                $heads = $dom->getElementsByTagName('li')->item(0)->nodeValue;
                $token = $heads;
                 

                return response()->json(['token' => $token,'status' => $res->getStatusCode(),'message'=>$res->getReasonPhrase(),'totp'=> false],$res->getStatusCode(),['Access-Control-Allow-Origin'=>env('HOST_IP_FRONTEND') , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']);
 

                
                
            }
            else {
                return  response()->json(['token' => '', 'status' => $res->getStatusCode(),'message'=>$res->getReasonPhrase(),'totp'=> false],$res->getStatusCode(),['Access-Control-Allow-Origin'=>env('HOST_IP_FRONTEND') , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']); // Status
            }
            
        } 
        catch (GuzzleHttp\Exception\ClientException $ex) {
            return  response()->json(['token' => '','status' => Response::HTTP_UNAUTHORIZED,'message'=>$res->getReasonPhrase(),'totp'=> false],$res->getStatusCode(),['Access-Control-Allow-Origin'=>env('HOST_IP_FRONTEND') , 'Access-Control-Allow-Methods'=>'*','Access-Control-Allow-Headers'=>'Content-Type, Authorization']);
        }
 
    }
    
    public function verifytoken(Request $request)
    {
         
        $token = '';
        if ($request->query->has('token')) {
            $token = $request->input('token');
        }
        return CommonService::simpleResponse($request, 'index.php/apps/registration/verify/'.$token,false,'GET'); 
    }
    
    public function qrcodeimage(Request $request)
    {
          $size =300;
        if ($request->query->has('size')) {
            $token = $request->input('size');
        }
         $secretkey = 'ok';
        if ($request->query->has('secretkey')) {
            $secretkey = $request->input('secretkey');
        }
         
        return \SimpleSoftwareIO\QrCode\Facades\QrCode::size($size)->generate($secretkey); 
    }
    
     public function trueip(Request $request)
    {
         
        $trueip = '';
        
        $ip = $_SERVER['REMOTE_ADDR'];

        $hostname = gethostbyaddr($_SERVER['REMOTE_ADDR']);
// if (strcmp($ip, $hostname) !== 0) {
// echo nl2br("PTR: $hostname\n");
// } else {
// echo nl2br("YOUR IP DO NOT HAVE A PTR\n");
// }

        return $ip;
    }
}