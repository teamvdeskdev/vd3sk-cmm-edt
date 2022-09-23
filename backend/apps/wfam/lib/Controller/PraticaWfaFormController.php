<?php

namespace OCA\Wfam\Controller;

use OC\Files\Node;
use OCP\AppFramework\Http\JSONResponse;
use OCP\IRequest;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Controller;
use Punic\Exception;
use OCP\Files\Folder;
use OCP\IUserManager;

class PraticaWfaFormController extends Controller
{
    private $userId;
    /** @var Folder */
    private $userFolder;
    private $userManager;

    public function __construct($AppName, IRequest $request, $UserId, Folder $userFolder, IUserManager $userManager)
    {
        parent::__construct($AppName, $request);
        $this->userId = $UserId;
        $this->userFolder = $userFolder;
        $this->userManager = $userManager;
    }


    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function index($object)
    {
        return new TemplateResponse('wfam', 'content/pratica_wfa_form');
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function templatepdf()
    {
        return new TemplateResponse('wfam', 'content/templatepdf');
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
            if (!$this->userFolder->nodeExists($dir)) {
                $this->userFolder->newFolder($dir);
            }

            if ($location == "local") {
                $data = $response["Stream"];
                list($type, $data) = explode(';', $data);
                list(, $data)      = explode(',', $data);
                $streamBase64Decoded = base64_decode($data);
                $this->userFolder->newFile($dir . "/" . $filename);
                $file = $this->userFolder->get($dir . "/" . $filename);
                $file->putContent($streamBase64Decoded);
            } else {
                $document = $this->userFolder->get($filename);
                $content = $document->{'getContent'}();
                $this->userFolder->newFile($dir . $filename);
                $file = $this->userFolder->get($dir . $filename);
                $file->putContent($content);
            }
            //file_get_contents()
            return new JSONResponse(
                [
                    $response,
                    'Performed' => true
                ]
            );
        } catch (Exception $ex) {
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
    public function PublishFile($Model)
    {
        try {
            $response = $Model["Dto"];
            $dir = $response["Path"];
            if (is_null($response["UtenteId"])) {
                $filename = $response["FileName"];
                $data = $response["Stream"];
                list($type, $data) = explode(';', $data);
                list(, $data)      = explode(',', $data);
                $streamBase64Decoded = base64_decode($data);
                if (!$this->userFolder->nodeExists($dir)) {
                    $this->userFolder->newFolder($dir);
                }
                $this->userFolder->newFile($dir . "/" . $filename);
                $file = $this->userFolder->get($dir . "/" . $filename);
                $file->putContent($streamBase64Decoded);
            } else {
                $document = $this->userFolder->get($dir);
                $dir = \OC::$server->getSystemConfig()->getValue("datadirectory"). DIRECTORY_SEPARATOR . $response["UtenteId"] . "/files" . $dir;
                $dirName = pathinfo($dir)["dirname"];
                if (!is_dir($dirName)) {
                    $this->CreatePath($dirName);
                }
                $content = $document->{'getContent'}();
                $fileCopy = file_put_contents($dir, $content);
                if (!is_bool($fileCopy)) {
                    $scanPath = $response["UtenteId"] . "/files" . pathinfo($response["Path"])["dirname"];
                    exec('php occ files:scan --path="' . $scanPath . '"');
                }
            }

            return new JSONResponse(
                [
                    $response,
                    'Performed' => true
                ]
            );
        } catch (Exception $ex) {
            return new JSONResponse(
                [
                    'Error' => $ex->getMessage(),
                    'Performed' => false
                ]
            );
        }
    }

    private function CreatePath($dirName)
    {
        $folders = explode("/", $dirName);
        $path="";
        foreach ($folders as $folder) {            
            if (!empty($folder)) {
                $path.="/".$folder;
                if (!is_dir($path)) {
                    mkdir($path);
                }
            }
        }
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function GetFilesPratica($path)
    {
        try {

            if (is_dir($path) !== false) {
                $files = scandir($path);

                return new JSONResponse(
                    [
                        'Model' => $files,
                        'Performed' => true
                    ]
                );
            }
        } catch (Exception $ex) {
            return new JSONResponse(
                [
                    'Error' => $ex->getMessage(),
                    'Performed' => false
                ]
            );
        }
    }
}
