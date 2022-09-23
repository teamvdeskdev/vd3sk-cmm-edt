<?php

namespace OCA\WorkflowManager\Controller;

use Closure;
use DateTime;
use Exception;
use OCP\IRequest;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\JSONResponse;
use OCP\AppFramework\ApiController;

use OCA\WorkflowManager\Service\WorkflowService;
use OCP\Files\Folder;
use OCA\DigitalpaAruba\Controller\DigitalPAController;

class WorkflowApiController extends ApiController
{

    private $service;
    private $userId;
    private $userFolder;
    private $digitalPAController;
    use Errors;

    public function __construct($AppName, IRequest $request, WorkflowService $service, $userId, Folder $userFolder, Closure $digitalPAController = null)
    {
        parent::__construct(
            $AppName,
            $request,
            'GET',
            'POST',
            'Authorization, Content-Type, Accept'
            //,1728000
        );
        $this->service = $service;
        $this->userId = $userId;
        $this->userFolder = $userFolder;
        $this->digitalPAController = $digitalPAController;
    }

    /**
     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function Load($Model)
    {
        if ($Model !== null) {
            $skip = $Model["Skip"];
            $take = $Model["Take"];
            $filter = $Model["Filter"];
            if (!is_null($filter) && isset($filter["AppId"])) {
                $response = $this->service->Load($skip, $take, $filter);
                $Model["Dtos"] = $response["Dtos"];
                $Model["Count"] = $response["Count"];
                $Model["Performed"] = $response["Performed"];
            } else {
                $Model["Performed"] = false;
            }
        }
        return new DataResponse($Model);
    }

    /**
     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function Read($Model)
    {
        $response = $Model;
        $response = $this->service->Read($response["Filter"]);
        $model["Model"] = $response;
        return new DataResponse($model);
    }

    /**
     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function ReadEngine($Model)
    {
        $response = $Model;
        $response = $this->service->ReadEngine($response["Filter"]);
        $model["Model"] = $response;
        return new DataResponse($model);
    }

    /**
     * @NoCSRFRequired
     * @NoAdminRequired
     */
    public function Get($Model)
    {
        $response = $Model;
        $response = $this->service->Get($response["Filter"]);
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
        $dto = $response["Workflow"];
        $response = $this->service->Delete($dto);
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
        $response = $this->service->CreateOrUpdate($response);
        $model["Model"] = $response;
        return new DataResponse($model);
    }

    /**    
     * @NoCSRFRequired
     * @NoAdminRequired
     */
    public function ClearAuthorizations($Model)
    {
        $response = $Model;
        $response = $this->service->ClearAuthorizations($response);
        $model["Model"] = $response;
        return new DataResponse($model);
    }

    /**    
     * @NoCSRFRequired
     * @NoAdminRequired
     */
    public function StartWorkflow($Model)
    {
        $response = $Model;
        $response = $this->service->StartWorkflow($response);
        $model["Model"] = $response;
        return new DataResponse($model);
    }

    /**    
     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function EndWorkflow($Model)
    {
        $response = $Model;
        $response = $this->service->EndWorkflow($response);
        $model["Model"] = $response;
        return new DataResponse($model);
    }

    /**    
     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function SetAuthorization($Model)
    {
        //Digital signage
        $digitalSignatureStep = $this->service->GetChildDigitalSignature($Model);
        if (!is_null($digitalSignatureStep)) {
            if (!isset($Model["Stream"])) {
                $this->service->CreateLog($Model, 'SetAuthorization: Digital signage file missing.');
                $model["Model"]["Performed"] = false;
                $model["Model"]["Message"] = 'Digital signagnature file missing.';
            } else {
                $date = new DateTime();
                $folder = (string) $date->getTimestamp();
                $Model["Path"] = "apps/workflowmanager/tmp/" . $folder;
                $performed = $this->SaveFile($Model);
                if ($performed) {
                    $response = $this->service->SetAuthorization($Model);
                    $model["Model"] = $response;
                } else {
                    $model["Model"]["Performed"] = false;
                    $model["Model"]["Message"] = 'The file could not be written.';
                }
            }
        } else {
            $response = $Model;
            $response = $this->service->SetAuthorization($response);
            $model["Model"] = $response;
            if ($model["Model"]["Performed"]) {
                $this->NotificationStep($Model);
            }
        }
        return new DataResponse($model);
    }

    /**
     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function GetAuthorization($Model)
    {
        $response = $Model;
        $response = $this->service->GetAuthorization($response);
        $model["Model"] = $response;
        return new DataResponse($model);
    }

    /**
     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function CanMoveNext($Model)
    {
        $response = $Model;
        $response = $this->service->CanMoveNext($response);
        $model["Model"] = $response;
        return new DataResponse($model);
    }

    /**
     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function GetCodificaRuoloCurrentNode($Model)
    {
        try {
            if (!is_null($Model)) {
                $response = $this->service->GetCellCurrentNode($Model);
                if (!is_null($response) && $response["Performed"]) {
                    if (!is_null($response["Cell"])) {
                        $cell = $response["Cell"];
                        $codificaRuolo = substr($cell->attrs->root->identificativo, 0, 1);
                        return $codificaRuolo;
                    } else
                        return "R";
                }
            }
        } catch (\Exception $ex) {
            return null;
        }
        return null;
    }

    /**
     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function GetCodiceRuoloCurrentNode($Model)
    {
        try {
            if (!is_null($Model)) {
                $response = $this->service->GetCellCurrentNode($Model);
                if (!is_null($response) && $response["Performed"]) {
                    if (!is_null($response["Cell"])) {
                        $cell = $response["Cell"];
                        $codiceRuolo = $cell->attrs->root->id;
                        return $codiceRuolo;
                    } else
                        return "R";
                }
            }
        } catch (\Exception $ex) {
            return null;
        }
        return null;
    }

    /**
     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function GetNextCodificaRuolo($Model)
    {
        try {
            if (!is_null($Model)) {
                $stato = $Model["Filter"]["Stato"];
                $jsonModelEngine = $this->service->ReadEngine($Model["Filter"]);
                if (!is_null($jsonModelEngine)) {
                    $response = $this->service->GetCellCurrentNode($Model);
                    if (!is_null($response) && $response["Performed"]) {
                        if (!is_null($response["Cell"])) {
                            $currentCell = $response["Cell"];
                            $nextNodes = $this->service->GetNextNodeCell($currentCell->attrs->root->id, $jsonModelEngine, $stato);
                            if (!is_null($nextNodes) && count($nextNodes) > 0) {                               
                                    $codificaRuolo = substr($nextNodes[0]->Identificativo, 0, 1);
                                    return $codificaRuolo;
                                
                            }
                        }
                    }
                  
                }
            }
        } catch (\Exception $ex) {
            return null;
        }
        return null;
    }

    /**
     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function GenerateFromVisio($Model)
    {
        try {

            $response = $Model["Dto"];
            $dir = $response["Path"];
            $filename = $response["FileName"];

            if (is_dir($dir) === false) {
                mkdir($dir);
            }

            //decode base64 uploaded file
            $stream = $response["Stream"];
            $data = substr($stream, strpos($stream, ',') + 1);
            $dataDecodedBase64 = base64_decode($data);
            $outputFilePath = $dir . "/" . $filename;
            file_put_contents($outputFilePath, $dataDecodedBase64);

            //Generate JsonModel for WorkflowManager from Vsdx
            $jsonModel = $this->service->CreateJsonModelFromVisio($outputFilePath);

            return new JSONResponse(
                [
                    //        'InputModel' => $response,
                    'Model' => $jsonModel,
                    'Performed' => true
                ]
            );
        } catch (\Exception $ex) {
            return new JSONResponse(
                [
                    'Error' => $ex->getMessage(),
                    'InputModel' => $response,
                    'Performed' => false
                ]
            );
        }
    }

    /**
     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function XPDLParser($Model)
    {
        try {
            if (!is_null($Model)) {
                $response = $this->service->XPDLParser($Model);
                $Model["Performed"] = $response["Performed"];
                $Model["XML"] = $response["XML"];
                $Model["Error"] = $response["Error"];
            }
        } catch (\Exception $ex) {
            $Model["Error"] = $ex->getMessage();
            $Model["Performed"] = false;
        } finally {
            return $Model;
        }
    }

    private function NotificationStep($Model)
    {
        try {
            $stato = $Model["Filter"]["Stato"];
            $mailSubject = $Model["Subject"];
            $mailText = $Model["MailText"];
            $jsonModelEngine = $this->service->ReadEngine($Model["Filter"]);
            if (!is_null($jsonModelEngine)) {
                $nextNodes = $this->service->GetNextNodeCell($Model['Filter']['Id'], $jsonModelEngine, $stato);
                foreach ($nextNodes as $nextNode) {
                    if (!is_null($nextNode) && count($nextNode) > 0 && ($nextNode->Identificativo == "mail" || $nextNode->Identificativo == "pec")) {
                        $mailBlock = $nextNode;
                        $nextNode = $this->service->GetNextNodeCell($mailBlock->Id, $jsonModelEngine, true);
                        $arrayBlock = ["mail", "pec", "firmadigitale"];
                        if (!is_null($nextNode) && count($nextNode) > 0 && !in_array($nextNode[0]->Identificativo, $arrayBlock)) {
                            $cell = $this->service->GetCellFromId($nextNode[0]->Id, $jsonModelEngine);
                            $cellMail = $this->service->GetCellFromId($mailBlock->Id, $jsonModelEngine);
                            if (!is_null($cell) && !is_null($cellMail)) {
                                if (is_null($mailSubject))
                                    $mailSubject = !is_null($cellMail->attrs->root->mailSubject) ? $cellMail->attrs->root->mailSubject : 'Workflowmanager notification';
                                if (is_null($mailText))
                                    $mailText = !is_null($cellMail->attrs->root->mailText) ? $cellMail->attrs->root->mailText : 'Workflowmanager notification';
                                $emailAddress = $cell->attrs->root->utenteEmail;
                                $this->service->SendMail($emailAddress, $mailSubject,  $mailText, $mailBlock->Identificativo);
                                $Model['Filter']['Id'] = $mailBlock->Id;
                                $this->service->SetAuthorization($Model);
                            }
                        }
                    }
                }
            }
            return true;
        } catch (\Exception $ex) {
            //throw $th;
        }
        return null;
    }

    /**
     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function GetCellFromId($Model)
    {
        try {
            if (!is_null($Model)) {
                $engineModel = $this->service->ReadEngine($Model["Filter"]);
                if (!is_null($engineModel)) {
                    $cell =  $this->service->GetCellFromId($Model["Filter"]["Id"], $engineModel);
                    return $cell;
                }
            }
        } catch (Exception $e) {
            throw $e;
        }
        return null;
    }

    private function SaveFile($Model)
    {
        $response = false;
        try {

            if (!is_null($Model) && !is_null($Model["Path"]) && !is_null($Model["Location"]) && !is_null($Model["Stream"])) {
                $dir = $Model["Path"];
                $filename = $Model["FileName"];
                $location = $Model["Location"];
                if (is_dir($dir) === false) {
                    mkdir($dir);
                }

                //decode base64 uploaded file
                $stream = $Model["Stream"];
                $data = substr($stream, strpos($stream, ',') + 1);
                $dataDecodedBase64 = base64_decode($data);

                if ($location == "local") {
                    $result = file_put_contents($dir . "/" . $filename, $dataDecodedBase64);
                    $response = (is_bool($result) ? $result : true);
                } else {
                    // $content = file_get_contents($this->userFolder . $filename);
                    $result = file_put_contents($dir .  $filename, $dataDecodedBase64);
                    $response = (is_bool($result) ? $result : true);
                }
            }
        } catch (Exception $ex) {
            $this->RemoveFile($Model["Path"], $Model["FileName"]);
        } finally {
            return $response;
        }
    }

    private function RemoveFile($folder, $filename)
    {
        try {
            if (!is_null($folder) && isset($filename)) {
                $performed = false;

                $file = str_replace("/", "", $filename);
                $filePath = $folder . "/" . $file;
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
                if (is_dir($folder))
                    $performed = rmdir($folder);

                return $performed;
            }
        } catch (\Exception $ex) {
            //throw $th;
        }
        return  false;;
    }

    /**
     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function SignDocument($Model)
    {

        try {
            $response = null;
            if (!is_null($Model) && !is_null($Model["Filter"])  && !is_null($Model["OTP"])) {
                $cell = $this->GetCellFromId($Model);
                if (!is_null($cell)) { //todo:controllare il ritorno del'app firma
                    if (!is_null($Model["Type"]) && $Model["Type"] == "cades") {
                        $mt = $Model["MarcaTemporale"];
                        $pm7 = $Model["PM7"];
                        $otp = $Model["OTP"];
                        $signpincode = $Model["PIN"];
                        $signcert = $Model["SignCert"];
                        $filename = $cell->attrs->root->tempfolder . '/' . $cell->attrs->root->filename;
                        $target_folder = $Model["TargetFolder"];

                        $response = $this->digitalPAController->{"signfile"}($mt, $pm7, $otp, $signpincode, $signcert, $filename, $target_folder);
                        if ($response != null && $response["status"] == 'ok') {
                            $this->RemoveFile($response["TempFolder"], $response["FileName"]);
                            $this->SetAuthorization($Model);
                        }
                    } else if (!is_null($Model["Type"]) && $Model["Type"] == "pades") {
                        $mt = $Model["MarcaTemporale"];
                        $pm7 = $Model["PM7"];
                        $otp = $Model["OTP"];
                        $signpincode = $Model["PIN"];
                        $signcert = $Model["SignCert"];
                        $filename = $cell->attrs->root->tempfolder . '/' . $cell->attrs->root->filename;
                        $target_folder = $Model["TargetFolder"];

                        $response = $this->digitalPAController->{"signpades"}($mt, $pm7, $otp, $signpincode, $signcert, $filename, $target_folder);
                        if ($response != null && $response["status"] == 'ok') {
                            $this->RemoveFile($response["TempFolder"], $response["FileName"]);
                            $this->SetAuthorization($Model);
                        }
                    }
                    return $response;
                }
                return null; //$response;
            }
        } catch (Exception $ex) {
        }
        return null;
    }

    /**    
     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function GetFileContent($Model)
    {
        try {
            if ($Model != null) {
                $fileName = $Model;
                $document = $this->userFolder->get($fileName);
                $content = $document->{'getContent'}();
                return  $content;
            }
        } catch (Exception $e) {
            //throw $th;
        }
        return null;
    }

    /**    
     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function GetFileStream($Model)
    {
        try {
            if ($Model != null) {
                $fileName = $Model;
                $document = $this->userFolder->get($fileName);
                $content = $document->{'getContent'}();
                $mimeType = $document->{'getMimeType'}();
                $stream = base64_encode($content);
                $stream = "data:$mimeType;base64," . $stream;
                return  $stream;
            }
        } catch (Exception $e) {
            //throw $th;
        }
        return null;
    }

    /**    
     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function SendMail($Model)
    {
        try {
            $users = $Model["Dto"];
            $mailSubject = $Model["Subject"];
            $mailText = $Model["Body"];
            $mailNotificaText = $Model["BodyNotifica"];
            $type = $Model["Type"];
            $pid = $Model["PID"];
            $link = $Model["Link"];
            foreach ($users as $user) {
                if ($user["Email"] != "") {
                    try {
                        $this->service->SendMail($user["Email"], $mailSubject,  $mailText, $type);
                    } catch (Exception $e) {
                    }
                }
                $userId = $user["Account"];
                $this->service->SendNotification($userId, $mailSubject,  $mailNotificaText, $pid, $link);
            }

            return new JSONResponse(
                [
                    'Model' => $Model,
                    'Performed' => true
                ]
            );
        } catch (Exception $e) {
            return new JSONResponse(
                [
                    'Model' => $Model,
                    'Performed' => false
                ]
            );
        }
    }

    /**    
     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function CheckRitardoEsecuzione($Model)
    {
        $this->service->CheckRitardoEsecuzione(null);
    }
}
