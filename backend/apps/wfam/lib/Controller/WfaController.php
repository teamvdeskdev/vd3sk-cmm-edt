<?php

namespace OCA\Wfam\Controller;

use OC;
use OCP\AppFramework\Http\JSONResponse;
use OCP\IRequest;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Controller;
use OCA\Wfam\Service\WfaService;
use OCP\Files\Folder;

class WfaController extends Controller
{

    private $service;
    use Errors;
    /** @var Folder */
    private $userFolder;

    public function __construct($AppName, IRequest $request, WfaService $service, Folder $userFolder)
    {
        parent::__construct($AppName, $request);
        $this->service = $service;
        $this->userFolder = $userFolder;
    }


    /**

     * @NoCSRFRequired
     * @NoAdminRequired
     */
    public function FindAll($Model)
    {
        $response = $Model;
        $response = $this->service->FindAll($response["Filter"], $response["Search"], $response["Order"]);
        $model["Model"] = $response;
        return new DataResponse($model);
    }

    /**

     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function Read($Model)
    {
        $response = $Model;
        $response = $this->service->find($response["Filter"]);
        $model["Model"] = $response;
        return new DataResponse($model);
    }

    /**

     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function Create($Model)
    {
        $response = $Model;
        $dto = $response["Dto"];
        $response = $this->service->Create($dto);
        $model["Model"] = $response;
        return new DataResponse($model);
    }

    /**

     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function CreateOrUpdate($Model)
    {
        $response = $Model;
        $dto = $response["Dto"];
        $id = $dto["Id"];

        if ($id && !is_integer($id)) {
            $response['Performed'] = false;
            $model["Model"] = $response;
            return new DataResponse($model);
        } else {
            if ((int) $dto["Id"] > 0) {
                $response = $this->service->Update($dto);
                $model["Model"] = $response;
                return new DataResponse($model);
            } else { //Id = 0
                $response = $this->service->Create($dto);
                $model["Model"] = $response;
                return new DataResponse($model);
            }
        }
    }

    /**

     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function Update($Model)
    {
        $response = $Model;
        $dto = $response["Dto"];
        $response = $this->service->Update($dto);
        $model["Model"] = $response;
        return new DataResponse($model);
    }

    /**

     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function Delete($Model)
    {
        $response = $Model;
        $dto = $response["Dto"];
        if (!is_null($dto)) {
            $id = $dto["Id"];
            if ($id) {
                $performed = $this->service->Delete($id);
                $response['Performed'] = $performed;
                return new DataResponse($response);
            }
        }

        $response['Performed'] = false;
        $model["Model"] = $response;
        return new DataResponse($model);
    }

    /**

     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function Load($Model)
    {
        $response = $Model;
        $response = $this->service->Load($response["Skip"], $response["Take"], $response["Filter"], $response["Search"], $response["Order"]);
        $model["Model"] = $response;
        return new DataResponse($model);
    }

    /**
     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function Export($Model)
    {
        $response = $this->service->Export($Model["Filter"]);
        $model = $response;
        return new DataResponse($model);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function UploadFile($Model)
    {
        try {
            $response = $Model["Dto"];
            $dir = $response["Path"];
            $filename = $response["FileName"];
            $location = $response["Location"];
            if (!is_dir($dir)) {
                $ok = mkdir($dir);
            }
            $path= __FILE__;
            $index=strpos($path, "apps");
            $uploadFolder=substr($path, 0,$index);
            $uploadFolder .= $dir;
            if ($location == "local") {
                $data = $response["Stream"];
                list($type, $data) = explode(';', $data);
                list(, $data)      = explode(',', $data);
                $streamBase64Decoded = base64_decode($data);
                file_put_contents($uploadFolder . "/" . $filename, $streamBase64Decoded);
                // $this->userFolder->newFile($dir . "/" . $filename);
                // $file = $this->userFolder->get($dir . "/" . $filename);
                // $file->putContent($streamBase64Decoded);
            } else {
                $name = explode("/", $filename);
                $document = $this->userFolder->get($filename);
                $content = $document->{'getContent'}();
                file_put_contents($dir . "/" . $name[count($name) - 1], $content);

                // $this->userFolder->newFile($dir . $filename);
                // $file = $this->userFolder->get($dir . $filename);
                // $file->putContent($content);
            }
            //file_get_contents()
            return new JSONResponse(
                [
                    $response,
                    'Performed' => true
                ]
            );
        } catch (\Exception $ex) {
            return new JSONResponse(
                [
                    'Error' => $ex->getMessage(),
                    'Performed' => false
                ]
            );
        }
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function GetIcon($Model)
    {
        try {
            $response = $Model["Dto"];
            $dir = $response["Path"];
            $filename = $response["FileName"];           
            $path= __FILE__;

            $index=strpos($path, "apps");
            $uploadFolder=substr($path, 0,$index);
            $uploadFolder .= $dir;
            //if ($location == "local") {               
                $content=file_get_contents($uploadFolder . "/" . $filename);
                $content=base64_encode($content);
                $parts = pathinfo($uploadFolder. "/" . $filename);
                $extension=$parts['extension'];
                $content=  "data:image/$extension;base64," . $content;
                $response["Stream"]=$content;
            //}

            return new JSONResponse(
                [
                    $response,
                    'Performed' => true
                ]
            );
        } catch (\Exception $ex) {
            return new JSONResponse(
                [
                    'Error' => $ex->getMessage(),
                    'Performed' => false
                ]
            );
        }
    }
    
}
