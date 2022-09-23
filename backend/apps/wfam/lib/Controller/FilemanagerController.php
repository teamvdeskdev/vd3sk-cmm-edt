<?php

namespace OCA\Wfam\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Controller;

class FilemanagerController extends Controller
{
    use Errors;

    public function __construct($AppName, IRequest $request)
    {
        parent::__construct($AppName, $request);
    }

    /**

     * @NoCSRFRequired
     * @NoAdminRequired
     */
    public function Get($Model)
    {
        if ($Model != null) {
            $path = $Model["Path"];
            $files = scandir($path);
            foreach ($files as $file) {
                if (!is_dir($path . "/" . $file)) {
                    array_push($Model["Dtos"], $file);
                }
            }
        }
        return new DataResponse($Model);
    }

    /**

     * @NoCSRFRequired
     * @NoAdminRequired
     */
    public function Upload($Model)
    {
        $response = $Model["Dto"];
        $dir = $response["Path"];
        $filename = $response["FileName"];
        //$location = $response["Location"];
        if (!is_dir($dir)) {
            mkdir($dir);
        }

        //decode base64 uploaded file
        $stream = $response["Stream"];
        $data = substr($stream, strpos($stream, ',') + 1);
        $dataDecodedBase64 = base64_decode($data);
        file_put_contents($dir . "/" . $filename, $dataDecodedBase64);
        $Model["Performed"]=true;
        return new DataResponse($Model);
    }

     /**

     * @NoCSRFRequired
     * @NoAdminRequired
     */
    public function Delete($Model)
    {
        $performed=false;
        $response = $Model["Dto"];
        $dir = $response["Path"];           
        if (file_exists($dir)) {
            $performed=  unlink($dir);
        }
        $Model["Performed"]=$performed;
        return new DataResponse($Model);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function GetServerRoot($Model)
    {
        try {
            if ($Model != null) {
                $Model["Dto"]["ServerRoot"] = \OC::$SERVERROOT;
                $Model["Performed"]=true;
                return $Model;
            }
        } catch (\Exception $ex) {
        }
        return null;
    }
}
