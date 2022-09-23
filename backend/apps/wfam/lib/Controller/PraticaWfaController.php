<?php

namespace OCA\Wfam\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Controller;

use OCA\Wfam\Service\PraticaWfaService;
use OCA\WorkflowManager\Controller\WorkflowApiController;
use OCA\Wfam\Service\GruppoRuoloService;
use OCA\Wfam\Service\RuoloPraticaWfaService;
use OCA\Wfam\Service\RuoloWfaService;

class PraticaWfaController extends Controller
{

    private $service;
    private $workflowController;
    private $serviceGruppoRuolo;
    private $ruoloPraticaService;
    private $ruoloWfaService;
    private $UserId;
    private $AppName;
    use Errors;

    public function __construct(
        $UserId,
        $AppName,
        IRequest $request,
        PraticaWfaService $service,
        WorkflowApiController $workflowController,
        GruppoRuoloService $serviceGruppoRuolo,
        RuoloPraticaWfaService $ruoloPraticaService,
        RuoloWfaService $ruoloWfaService
    ) {
        parent::__construct($AppName, $request);
        $this->service = $service;
        $this->workflowController = $workflowController;
        $this->serviceGruppoRuolo = $serviceGruppoRuolo;
        $this->ruoloPraticaService = $ruoloPraticaService;
        $this->ruoloWfaService = $ruoloWfaService;
        $this->UserId = $UserId;
        $this->AppName = $AppName;
        $this->userMapper;
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
        if ($response["Performed"]) {
            $dto = $response["Dto"];
            if ($dto->stato == STATOPRATICA::$COMPLETATA || $dto->stato == STATOPRATICA::$RIFIUTATO) {
                $filter = array('WfaId' => $dto->wfaId, "UtenteId" => WFARUOLO::$A);
                $responseGruppi = $this->serviceGruppoRuolo->FindAll($filter);
                if (!is_null($response) && $response["Performed"]) {
                    $dto->codificaRuolo = WFARUOLO::$A;
                    $dto->codiceRuolo = WFARUOLO::$A;
                    $dto->groups = $responseGruppi["Dtos"];
                }
            } else {
                $modelWF = array("Filter" => ['WorkflowId' => $dto->wfaId, 'OwnerId' => $dto->id]);
                $dto->codificaRuolo = $this->workflowController->GetCodificaRuoloCurrentNode($modelWF);
                $dto->codiceRuolo = $this->workflowController->GetCodiceRuoloCurrentNode($modelWF);
                $authorization = $this->GetAuth($dto, $Model["Filter"]["Groups"]);
                if (!is_null($authorization) && !is_null($authorization["Model"]) && $authorization["Model"]["Performed"])
                    $dto->authorized = $authorization["Model"]["Authorized"];
                else
                    $dto->authorized = false;


                $modelFilter = array("PraticaWfaId" => $dto->id, "CodiceRuolo" => $dto->codiceRuolo);
                $responseRuoloPratica = $this->ruoloPraticaService->FindAll($modelFilter);
                if (!is_null($responseRuoloPratica) && count($responseRuoloPratica["Dtos"])  > 0) {
                    $dto->nomeUtente = $responseRuoloPratica["Dtos"][0]->nomeUtente;
                    $dto->statoRuolo = $responseRuoloPratica["Dtos"][0]->stato;
                    $dto->groups = $responseRuoloPratica["Dtos"][0]->groups;
                }
                if (is_null($dto->groups)) {
                    $filter = array('WfaId' => $dto->wfaId, "UtenteId" => $dto->codiceRuolo);
                    $responseGruppi = $this->serviceGruppoRuolo->FindAll($filter);
                    if (!is_null($responseGruppi) &&  $responseGruppi["Performed"] && count($responseGruppi["Dtos"]) > 0) {
                        $dto->groups = $responseGruppi["Dtos"];
                    }
                }
            }
        }
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

        if (!is_integer($id)) {
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
                if ($response["Performed"])
                    $this->service->CreateFoldersTree($Model["NomeBeneficiario"], $response["Dto"]->codificaProgressivo, $Model["Path"]);
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

        $pkey = $dto["Id"];
        if ($pkey) {
            $performed = $this->service->Delete($dto);
            $response['Performed'] = $performed;
            return new DataResponse($response);
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
    public function Count($Model)
    {
        $response = $Model;
        $filter = (isset($Model["Filter"]) ? $Model["Filter"] : null);
        $search = (isset($Model["Search"]) ? $Model["Search"] : null);
        $response = $this->service->Count($filter, $search);
        return new DataResponse($response);
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
        if ($response["Performed"]) {
            $dtos = $response["Dtos"];
            foreach ($dtos as $dto) {
                if ($dto->stato == STATOPRATICA::$COMPLETATA || $dto->stato == STATOPRATICA::$RIFIUTATO) {
                    $filter = array('WfaId' => $dto->wfaId, "UtenteId" => WFARUOLO::$A);
                    $responseGruppi = $this->serviceGruppoRuolo->FindAll($filter);
                    if (!is_null($response) && $response["Performed"] && count($response["Dtos"]) > 0) {
                        $dto->codificaRuolo = WFARUOLO::$A;
                        $dto->codiceRuolo = WFARUOLO::$A;
                        $dto->groups = $responseGruppi["Dtos"];
                    }
                } else {
                    $modelWF = array("Filter" => ['WorkflowId' => $dto->wfaId, 'OwnerId' => $dto->id]);
                    $dto->codiceRuolo = $this->workflowController->GetCodiceRuoloCurrentNode($modelWF);
                    $authorization = $this->GetAuth($dto, $Model["Filter"]["Groups"]);

                    if (!is_null($authorization) && !is_null($authorization["Model"]) && $authorization["Model"]["Performed"] && !is_null($Model["Filter"]["Groups"]))
                        $dto->authorized = $authorization["Model"]["Authorized"];
                    else
                        $dto->authorized = false;

                    $modelFilter = array("PraticaWfaId" => $dto->id, "CodiceRuolo" => $dto->codiceRuolo);
                    $responseRuoloPratica = $this->ruoloPraticaService->FindAll($modelFilter);
                    if (!is_null($responseRuoloPratica) && count($responseRuoloPratica["Dtos"])  > 0) {
                        $dto->nomeUtente = $responseRuoloPratica["Dtos"][0]->nomeUtente;
                        $dto->statoRuolo = (is_null($responseRuoloPratica["Dtos"][0]->stato) ? $this->GetStatoRuoloPratica($dto->id) : $responseRuoloPratica["Dtos"][0]->stato);
                        $dto->groups = $responseRuoloPratica["Dtos"][0]->groups;
                    }
                    if (is_null($dto->groups)) {
                        $filter = array('WfaId' => $dto->wfaId, "UtenteId" => $dto->codiceRuolo);
                        $responseGruppi = $this->serviceGruppoRuolo->FindAll($filter);
                        if (!is_null($responseGruppi) &&  $responseGruppi["Performed"] && count($responseGruppi["Dtos"]) > 0) {
                            $dto->groups = $responseGruppi["Dtos"];
                        }
                    }
                }
            }
        }
        $model["Model"] = $response;
        return new DataResponse($model);
    }

    //simonefase3
    public function GetAuth($praticaDto, $userGroups)
    {
        $authorization["Authorized"] = false;
        $authorization["Performed"] = true;
        //AUTOPOPOLAMENTO
        $modelRuoloWfaFilter = array("WfaId" => $praticaDto->wfaId);
        $responseRuoloWfa = $this->ruoloWfaService->FindAll($modelRuoloWfaFilter);

        //$this->logger->debug("START CONDIZIONE praticaWfa: ".json_encode($praticaDto));

        //$this->logger->debug("ruoloWfa: ".json_encode($responseRuoloWfa));

        foreach($responseRuoloWfa["Dtos"] as $ruoloWfaDto) {
            $modelGruppoRuoloFilter = array("RuoloWfaId" => $ruoloWfaDto->id);
            //$this->logger->debug("ruoloWfa Filter: ".json_encode($modelGruppoRuoloFilter));
            $responseGruppoRuolo = $this->serviceGruppoRuolo->FindAll($modelGruppoRuoloFilter);
            //$this->logger->debug("gruppoRuolo del ruoloWfa ".$ruoloWfaDto->id.": ".json_encode($responseGruppoRuolo));
            foreach($responseGruppoRuolo["Dtos"] as $gruppoRuoloDto) {
                if($gruppoRuoloDto->groupName === "Autopopolamento") {
                    //$this->logger->debug("PraticaWfa (id ".$praticaDto->id.") autopopolata");
                    // //$this->logger->debug("PraticaWfa Dto corrente (id ".$dto->id."): ".json_encode($dto));
        
                    $modelPraticaGruppoRuoloFilter = array("Filter" => ['PraticaWfaId' => $praticaDto->id, 'Active' => 1]);
                    $responsePraticaGruppoRuolo = $this->praticaGruppoRuoloService->FindAll($modelPraticaGruppoRuoloFilter["Filter"]);
        
                    //$this->logger->debug("entro nel PraticaGruppoRuolo Load dell'autopolata, Dtos: ".json_encode($responsePraticaGruppoRuolo["Dtos"]));
                    
                    //check if one PraticaGruppoRuolo exists, then gives authorization
                    foreach($responsePraticaGruppoRuolo["Dtos"] as $praticaGruppoRuolo) {
                        if(in_array($praticaGruppoRuolo->groupName, $userGroups)) {
                            //$this->logger->debug("L'utente avrà i permessi per visualizzare la pratica ".$praticaDto->id." perché il gruppo ".$praticaGruppoRuolo->groupName." è autopopolato");
                            return array("Model" => ['Authorized' => true, 'Performed' => true]); //simonefase3 RIMUOVERE SE MALFUNZIONANTE
                        }
                    }
                }
            }
        }
        
        //simonefase3 end

        //STD
        $modelFilter = array("PraticaWfaId" => $praticaDto->id, "UtenteId" => $this->UserId);
        $responseRuoloPratica = $this->ruoloPraticaService->FindAll($modelFilter);
        if (!is_null($responseRuoloPratica) && $responseRuoloPratica["Performed"] && count($responseRuoloPratica["Dtos"]) > 0) {
            $ruoloPratica = $responseRuoloPratica["Dtos"][0];
            $modelWF = array("Filter" => ['AppId' => $this->AppName, 'WorkflowId' => $praticaDto->wfaId, 'OwnerId' => $praticaDto->id, "Id" => $ruoloPratica->codiceRuolo]);
            $authorization = $this->workflowController->GetAuthorization($modelWF);
            return $authorization->getData();
        } else {
            $filter = array('WfaId' => $praticaDto->wfaId);
            $search = array("GroupName" => $userGroups);
            $order = array("Name" => "UtenteId", "Direction" => "asc");
            $responseGruppi = $this->serviceGruppoRuolo->FindAll($filter, $search, $order);
            if (!is_null($responseGruppi) && $responseGruppi["Performed"] && count($responseGruppi["Dtos"]) > 0) {
                foreach ($responseGruppi["Dtos"] as $dto) {
                    $modelWF = array("Filter" => ['AppId' => $this->AppName, 'WorkflowId' => $praticaDto->wfaId, 'OwnerId' => $praticaDto->id, "Id" => $dto->utenteId]);
                    $responseAuthorization = $this->workflowController->GetAuthorization($modelWF);
                    if (!is_null($responseAuthorization)) {
                        $authorization = $responseAuthorization->GetData();
                        //$this->logger->debug(json_encode("authroization response: ".json_encode($authorization)));
                        if ($authorization["Model"]["Authorized"]) {
                            return $authorization;
                        }

                    }
                }
            }

        }

        return $authorization;
    }

    /**

     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function GetSintesiProcessoItems($Model)
    {
        try {
            $items = array();
            if (!is_null($Model["Filter"])) {
                $filterPratica = $Model["Filter"];
                $filter = array("WfaId" => $filterPratica["WfaId"]);
                $response = $this->ruoloWfaService->FindAll($filter, null, ["Name" => "UtenteId", "Direction" => "asc"]);
                if ($response["Performed"] && count($response["Dtos"]) > 0) {
                    $ruoloWfaDtos = $response["Dtos"];
                    if (intval($filterPratica["Id"]) > 0) {
                        $filter = array("PraticaWfaId" => $filterPratica["Id"]);
                        $response = $this->ruoloPraticaService->FindAll($filter);
                        $ruoloPraticaWfaDtos = ($response["Performed"] ? $response["Dtos"] : []);
                    } else {
                        $ruoloPraticaWfaDtos = [];
                    }

                    foreach ($ruoloWfaDtos as $ruoloWfaDto) {
                        $groups = array();
                        $codificaRuolo = substr($ruoloWfaDto->utenteId, 0, 1);
                        $filter = array("RuoloWfaId" => $ruoloWfaDto->id);
                        $response = $this->serviceGruppoRuolo->FindAll($filter);
                        $gruppoRuoloDtos = ($response["Performed"] ? $response["Dtos"] : []);
                        $key = array_search($ruoloWfaDto->id, array_column($ruoloPraticaWfaDtos, 'ruoloWfaId'));
                        if (!is_bool($key)) {
                            $value = $ruoloPraticaWfaDtos[$key];
                            //simonefase3 - per riportare alla normalità eliminare pezzo e scommentare l'explode
                            $isAutopopolato = false;
                            foreach ($gruppoRuoloDtos as $gruppoRuoloDto) {
                                if($gruppoRuoloDto->groupName === "Autopopolamento") {
                                    $isAutopopolato = true;
                                    array_push($groups, $gruppoRuoloDto->groupName);
                                }
                            }
                            if(!$isAutopopolato)
                                $groups = explode(",", $value->groups);
                            //simonefase3 end
                            //$groups = explode(",", $value->groups);
                            $item = ["NomeUtente" => $value->nomeUtente, "Groups" => $groups, "CodiceRuolo" => $ruoloWfaDto->utenteId, "CodificaRuolo" => $codificaRuolo, "Stato" => $value->stato];
                            array_push($items, $item);
                        } else {
                            foreach ($gruppoRuoloDtos as $gruppoRuoloDto) {
                                array_push($groups, $gruppoRuoloDto->groupName);
                            }
                            array_push($items, ["NomeUtente" => null, "Groups" => $groups, "CodiceRuolo" => $ruoloWfaDto->utenteId, "CodificaRuolo" => $codificaRuolo, "Stato" => null]);
                        }
                    }
                }
            }
        } catch (\Exception $ex) {
            new DataResponse(["Model" => ["Performed" => false, "Dtos" => []]]);
        }

        return new DataResponse(["Model" => ["Performed" => true, "Dtos" => $items]]);
    }

    private function GetStatoRuoloPratica($praticaWfaId)
    {
        $modelFilter = array("PraticaWfaId" => $praticaWfaId, "Stato" => STATOPRATICA::$MODIFICA);
        $response = $this->ruoloPraticaService->FindAll($modelFilter);
        if (!is_null($response) && count($response["Dtos"])  > 0) {
            return $response["Dtos"][0]->stato;
        }
        return null;
    }
    /**

     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    // public function DeletePraticaWfaRequest($Model)
    // {
    //     $response = $Model;
    //     $dto = $Model["Dto"];
    //     if (!is_null($dto)) {
    //         $response = $this->service->DeletePraticaWfaRequest($dto);
    //         $model["Model"] = $response;
    //         return new DataResponse($response);
    //     }
    //     $response['Performed'] = false;
    //     $model["Model"] = $response;
    //     return new DataResponse($response);
    // }
}

class STATOPRATICA
{
    public static $MODIFICA = '!Modifica Richiesta';
    public static $BOZZA = 'Bozza';
    public static $APPROVAZIONE = '!Approvazione';
    public static $RIFIUTATO = 'Rifiutato';
    public static $DELIBERA = '!Delibera';
    public static $COMPLETATA = 'Approvato';
    public static $BLOCCATA = 'Bloccata per disabilitazione flusso';
}
class WFARUOLO
{
    public static $R = 'R';
    public static $C = 'C';
    public static $A = 'A';
    public static $D = 'D';
}
