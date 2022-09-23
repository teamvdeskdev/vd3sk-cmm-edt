<?php

namespace OCA\WorkflowManager\Service;

use DateTime;
use Exception;

use OCA\WorkflowManager\Entity\Workflow;
use OCA\WorkflowManager\Mapper\WorkflowMapper;
use OCA\WorkflowManager\Mapper\WorkflowEngineMapper;
use OCA\WorkflowManager\Mapper\WorkflowLogsMapper;
use OCA\WorkflowManager\Service\WorkflowLogsService;
use OCA\WorkflowManager\Mapper\UserMapper;
use OCA\Wfam\Service\WfaService;
use OCA\Wfam\Service\RuoloWfaService;
use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\IURLGenerator;

class WorkflowService
{
    /**
     * Service Mapper
     * @var WorkflowMapper
     */
    protected $mapper;

    /**
     * User id 
     * @var string
     */
    protected $userId;
    /**
     * Engine Mapper
     * @var WorkflowEngineMapper
     */
    protected $mapperEngine;
    /**
     * Logger Mapper
     * @var WorkflowLogsMapper
     */
    private $mapperLogger;
    private $serviceWfa;
    private $serviceRuoloWfa;
    private $controllerUser;
    private $urlGenerator;
    private $timeFactory;
    /**
     * Class Constructor
     * @param WorkflowMapper $mapper
     * @param WorkflowLogsMapper $mapperLogger
     * @param WorkflowEngineMapper $mapperEngine
     * @param string $userId
     */
    public function __construct(WorkflowMapper $mapper, WorkflowLogsMapper $mapperLogger, WorkflowEngineMapper $mapperEngine, $userId, WfaService $serviceWfa, RuoloWfaService $serviceRuoloWfa, UserMapper $controllerUser, IURLGenerator $urlGenerator, ITimeFactory $timeFactory)
    {
        $this->mapper = $mapper;
        $this->mapperEngine = $mapperEngine;
        $this->mapperLogger = $mapperLogger;
        $this->userId = $userId;
        $this->serviceWfa = $serviceWfa;
        $this->controllerUser = $controllerUser;
        $this->urlGenerator = $urlGenerator;
        $this->timeFactory = $timeFactory;
        $this->serviceRuoloWfa = $serviceRuoloWfa;
    }

    /**
     * Get Dto properties 
     * @param array $dto
     * @return array
     */
    public function GetProperties($dto)
    {
        $properties = [];
        if ($dto) {
            $obj = get_object_vars(json_decode(json_encode($dto)));
            if ($obj) {
                foreach ($obj as $property => $value) {
                    if ($property != "Id") {
                        array_push($properties, $property);
                    }
                }
            }
        }
        return $properties;
    }

    /**
     * read Workflow from database
     * @param array $filter
     * @return array
     */
    public function Read($filter)
    {
        try {
            $dto = $this->mapper->Read($filter['AppId'], $filter['WorkflowId']);
            $response["Performed"] = true;
            $response["Dto"] = $dto;
            return $response;
        } catch (DoesNotExistException $e) {
            $response["Performed"] = true;
            $response["Dto"] = null;
        } catch (MultipleObjectsReturnedException $e) {
            $response["Performed"] = true;
            $response["Exception"] = $e->getMessage();
        } catch (Exception $e) {
            $response["Exception"] = $e->getMessage();
        }
        return $response;
    }

    /**
     * read engine data from database
     * @param array $filter
     * @return array
     */
    public function ReadEngine($filter)
    {
        try {
            if (!is_null($filter['OwnerId'] && !is_null($filter['WorkflowId']))) {
                $dto = $this->mapperEngine->Read($filter['OwnerId'], $filter['WorkflowId']);
                $response["Performed"] = true;
                $response["Dto"] = $dto;
                return $response;
            } else {
                throw new Exception('Engine OwnerId not found');
                //    $response["Performed"] = true;
                //     $response["Dto"] = null;
                //     return $response;
            }
        } catch (DoesNotExistException $e) {
            $response["Performed"] = true;
            $response["Dto"] = null;
        } catch (MultipleObjectsReturnedException $e) {
            $response["Performed"] = true;
            $response["Exception"] = $e->getMessage();
        } catch (Exception $e) {
            $response["Exception"] = $e->getMessage();
        } finally {
            return $response;
        }
    }

    /**
     * Get workflow data from database applying filters
     * @param array $filter
     * @return array
     */
    public function Get($filter)
    {
        try {
            $entities = $this->mapper->Get($filter);
            $response["Performed"] = true;
            $response["Dtos"] = $entities;
            return $response;
        } catch (Exception $e) {
            $response["Exception"] = $e->getMessage();
        }
        return $response;
    }

    /**
     * Get workflow data from database applying filters
     * @param array $filter
     * @return array
     */
    public function Load($skip, $take, $filter)
    {
        try {
            $entities = $this->mapper->Load($filter);
            if (!is_null($entities)) {
                $entities->setFirstResult($skip);
                $entities->setMaxResults($take);
            }
            $entities = $this->mapper->ToList($entities);
            $response["Performed"] = true;
            $response["Dtos"] = $entities;
            $response["Count"] = $this->mapper->Count($filter);
            return $response;
        } catch (Exception $e) {
            $response["Exception"] = $e->getMessage();
        }
        return $response;
    }

    /**
     * Delete record from database
     * @param array $dto
     * @return array
     */
    public function Delete($dto)
    {
        try {
            if (!is_null($dto)) {
                $entity = $this->mapper->Read($dto['AppId'], $dto['WorkflowId']);

                if ($entity) {
                    $performed = !is_null($this->mapper->delete($entity));
                    return $performed;
                }
            }
        } catch (Exception $e) {
        }
        return false;
    }

    /**
     * Create or Update workflow model data
     * @param array $model
     * @return $response ;
     */
    public function CreateOrUpdate($model)
    {
        try {
            if ($model) {
                $AppId = $model["Workflow"]["AppId"];
                $WorkflowId = $model["Workflow"]["WorkflowId"];
                $workflow = $this->mapper->Read($AppId, $WorkflowId);

                if (!$workflow) {
                    $entity = new Workflow();
                } else {
                    $entity = $workflow;
                }

                $properties = $this->GetProperties($model["Workflow"]);

                foreach ($properties as $property) {
                    $value = $model["Workflow"][$property];
                    $entity->__call('set' . $property, [$value]);
                }

                if (!$workflow) {
                    $dto = $this->mapper->insert($entity);
                } else {
                    $dto = $this->mapper->update($entity);
                }
                if ($dto) {
                    $response["Performed"] = true;
                    $response["Dto"] = $dto;
                    return $response;
                }
            }
            $response["Performed"] = false;
            $response["Dto"] = null;
            return $response;
        } catch (Exception $e) {
            $response["Performed"] = false;
            return $e;
        }
    }

    /**
     * Create or Update Engine data
     * @param array $filter
     * @param array $workflowModel
     * @return $response ;
     */
    public function CreateOrUpdateEngine($filter, $workflowModel)
    {
        try {
            if ($filter) {
                $response = $this->mapperEngine->CreateOrUpdate($filter, $workflowModel);
                return $response;
            }
            $response["Performed"] = false;
            $response["Dto"] = null;
            return $response;
        } catch (Exception $e) {
            $response["Performed"] = false;
            error_log("error while saving model " . $e->getMessage());
            return $e;
        }
    }

    /**
     * Get the authorization status of a node.
     * @param  Json $model The input Model
     * @return $response
     */
    public function GetAuthorization($model)
    {
        try {
            if (!is_null($model) && !is_null($model["Filter"])) {
                $response = null;
                //Read jsonModel from Engine's Table
                $jsonModel = $this->ReadEngine($model["Filter"]); //$jsonModel = $this->Read($model["Filter"]); 
                if (!is_null($jsonModel) && !is_null($jsonModel["Dto"]) && !array_key_exists('Exception', $jsonModel)) {
                    $jsonModel = json_decode($jsonModel["Dto"]->getWorkflowModel());
                    $id = $model["Filter"]["Id"];
                    if (!is_null($jsonModel) && !is_null($id)) {
                        $engine = new WorkflowEngine($this);
                        $authorized = $engine->GetAuthorization($jsonModel, $id);
                        $response["Authorized"] = $authorized;
                        $response["Performed"] = true;
                    } else {
                        throw new Exception('GetAuth: NodeId or engine model is null');
                    }
                } else {
                    throw new Exception('GetAuth: ' . $jsonModel['Exception']);
                }
                // return $response;
            } else {
                throw new Exception('GetAuth: Null or wrong input model');
            }
        } catch (Exception $e) {
            $response["Performed"] = false;
            $response["Exception"] = $e->getMessage();
        } finally {
            return $response;
        }
    }

    /**
     * Set the authorization of a node.
     * @param Json $model The input Model
     * @return $response
     */
    public function SetAuthorization($model)
    {
        try {
            if (!is_null($model) && !is_null($model["Filter"])) {
                $response = null;
                //leggo jsonModel da tabella engine per OwnerId --> se esiste OK  |  se non esiste leggo jsonmodel da data e creo nuova riga in engine
                $jsonModelEngine = $this->ReadEngine($model["Filter"]);

                //verifica della presenza del workflow per Owner Id
                if (!is_null($jsonModelEngine) && $jsonModelEngine['Performed'] && is_null($jsonModelEngine['Dto'])) {
                    $workflowModel = $this->Read($model["Filter"]);
                    //$jsonModel = json_decode($jsonModel["Dto"]->getWorkflowModel()); 
                    if (!is_null($workflowModel)) {
                        $this->CreateOrUpdateEngine($model["Filter"], $workflowModel);
                        //rileggo il modello da engine
                        $jsonModelEngine = $this->ReadEngine($model["Filter"]);
                    }
                }
                //impostazione dell'autorizzazione sul modello jsonModelEngine
                if (!is_null($jsonModelEngine) && !empty($jsonModelEngine["Dto"])) {
                    $id = $model["Filter"]["Id"];
                    $stato = $model["Filter"]["Stato"];
                    if (!is_null($id) && !is_null($stato)) {
                        $engine = new WorkflowEngine($this);
                        $jsonModel = json_decode($jsonModelEngine["Dto"]->getWorkflowModel());
                        $authorized = $engine->SetAuthorization($jsonModel, $id, $stato, $model);
                        $response["Performed"] = $authorized;
                        //Log if performed=true
                        if ($authorized) {
                            $this->CreateLog($model);
                        }
                    } else {
                        throw new Exception('SetAuth: NodeId and/or State is null');
                    }
                } else {
                    throw new Exception('SetAuth: Error creating Engine Data from Workflow Data');
                }
                //return $response;
            } else {
                throw new Exception('SetAuth: Null or wrong input model');
            }
        } catch (Exception $e) {
            $response["Performed"] = false;
            $response["Exception"] = $e->getMessage();
        } finally {
            return $response;
        }
    }

    /**
     * Clear all authorizations on model setting start/end Dates to null and Stato = Clear on every cells
     * @param Json $model The input Model
     * @return $response
     */
    public function ClearAuthorizations($model)
    {
        try {
            if (!is_null($model) && !is_null($model["Filter"])) {
                $response = null;
                //Getting jsonModel from engine by OwnerId
                $jsonModelEngine = $this->ReadEngine($model["Filter"]);
                //If Exists and Performed is True
                if (!is_null($jsonModelEngine) && (bool) $jsonModelEngine['Performed']) {
                    $jsonModel = json_decode($jsonModelEngine["Dto"]->getWorkflowModel());
                    //set values
                    foreach ($jsonModel->cells as $cell) {
                        if (strcmp($cell->type, 'standard.Rectangle') === 0) {
                            if (property_exists($cell->attrs, 'root')) {
                                $cell->attrs->root->stato = 'clear';
                                $cell->attrs->root->endDate = null;
                                $cell->attrs->root->startDate = null;
                            }
                        }
                    }
                    //update Model
                    $jsonModelEngine["Dto"]->setWorkflowModel(json_encode($jsonModel));
                    $executed = $this->CreateOrUpdateEngine($model['Filter'], $jsonModelEngine);
                    //Return only performed true||false
                    if (!is_null($executed) && !is_null($executed["Performed"]) && (bool) $executed["Performed"]) {
                        $response["Performed"] = true;
                    } else {
                        $response["Performed"] = false;
                    }
                } else {
                    throw new Exception("ClearAuths: Error getting engine's jsonModel");
                }
            } else {
                throw new Exception('ClearAuths: Null or wrong input model');
            }
        } catch (Exception $e) {
            $response["Performed"] = false;
            $response["Exception"] = $e->getMessage();
        } finally {
            return $response;
        }
    }
    /**
     * Starts the workflow with startDate and Authorization on firstNode
     * @param Json $model The input Model
     * @return $response
     */
    public function StartWorkflow($model)
    {
        try {
            if (!is_null($model) && !is_null($model["Filter"])) {
                $response = null;
                //leggo jsonModel da tabella engine per OwnerId --> se esiste OK  |  se non esiste leggo jsonmodel da data e creo nuova riga in engine
                $jsonModelEngine = $this->ReadEngine($model["Filter"]);

                //verifica della presenza del workflow per Owner Id
                if (!is_null($jsonModelEngine) && $jsonModelEngine['Performed'] && is_null($jsonModelEngine['Dto']->getWorkflowModel)) {
                    $workflowModel = $this->Read($model["Filter"]);
                    //$jsonModel = json_decode($jsonModel["Dto"]->getWorkflowModel()); 
                    if (!is_null($workflowModel)) {
                        $this->CreateOrUpdateEngine($model["Filter"], $workflowModel);
                        //rileggo il modello da engine
                        $jsonModelEngine = $this->ReadEngine($model["Filter"]);
                    }
                }

                //impostazione dell'autorizzazione sul modello jsonModelEngine
                if (!is_null($jsonModelEngine) && !empty($jsonModelEngine["Dto"]->workflowModel)) {
                    $engine = new WorkflowEngine($this);
                    $jsonModel = json_decode($jsonModelEngine["Dto"]->getWorkflowModel());
                    $authorized = $engine->StartWorkflow($jsonModel, $model);
                    $response["Performed"] = $authorized;
                    if ($authorized) {
                        $this->CreateLog($model, 'Workflow avviato.');
                    }
                }
                // return $response;
            } else {
                throw new Exception('StartWF: Null or wrong input model');
            }
        } catch (Exception $e) {
            $response["Performed"] = false;
            $response["Exception"] = $e->getMessage();
        } finally {
            return $response;
        }
    }

    /**
     * Ends the workflow with start/endDate and correct end block
     * @param Json $model The input Model
     * @return $response
     */
    public function EndWorkflow($model)
    {
        //TODO: handle the 1-block exit situation... 
        try {
            if (!is_null($model) && !is_null($model["Filter"])) {
                //leggo jsonModel da tabella engine per OwnerId --> se esiste OK  |  se non esiste leggo jsonmodel da data e creo nuova riga in engine
                $jsonModelEngine = $this->ReadEngine($model["Filter"]);
                //impostazione dell'autorizzazione sul modello jsonModelEngine
                if ($jsonModelEngine && !empty($jsonModelEngine["Dto"])) {
                    $engine = new WorkflowEngine($this);
                    $jsonModel = json_decode($jsonModelEngine["Dto"]->getWorkflowModel());
                    $authorized = $engine->EndWorkflow($jsonModel, $model);
                    $response["Performed"] = $authorized;
                    if ($authorized) {
                        $esito = ((bool) $model['Filter']['Stato'] ? 'Approvato' : 'Rifiutato');
                        //Create log for last node settin' up the correct value for stato (at this point, it's not invalidate so it's true)
                        // $lastCellModel = $model;
                        // $lastCellModel['Filter']['Stato'] = 'true';
                        // $this->CreateLog($lastCellModel);
                        // unset($lastCellModel);
                        //Create ending log
                        $this->CreateLog($model, 'Workflow terminato con esito : ' . $esito);
                    }
                } else {
                    throw new Exception('EndWF : Engine model null');
                }
                // return $response;
            } else {
                throw new Exception('EndWF: Null or wrong input model');
            }
        } catch (Exception $e) {
            $response["Performed"] = false;
            $response["Exception"] = $e->getMessage();
        } finally {
            return $response;
        }
    }

    /**
     * Create a log record of the event defined in $model and descripted in $message     
     * @param Json $model Log Data model
     * @param string $message 
     * @return void or Exception
     */
    function CreateLog($model, $message = null)
    {
        //TODO Identify Node Label!!
        try {
            //Create new LogsService
            $now = (new \DateTime())->format('Y-m-d H:i:s');
            $serviceLogger = new WorkflowLogsService($this->mapperLogger);
            if (!is_null($serviceLogger)) {
                $appId = $model["Filter"]["AppId"];
                $nodeId = $model["Filter"]['Id'];
                $stato = (bool) $model["Filter"]["Stato"];
                $auth = (boolval($stato) ? 'Approva' : 'Modifica');

                if (is_null($message)) {
                    $message = "Set autorizzazione utente : $auth";
                }

                $dto = [
                    "WorkflowId" => $model["Filter"]["WorkflowId"],
                    "AppId" => $appId,
                    "NodeId" => $nodeId,
                    "LogDate" => $now,
                    "LogText" => $message,
                    "UserId" => $this->userId
                ];
                $model["Dto"] = $dto;
                //Execute Create()
                $serviceLogger->Create($model);
            } else {
                throw new Exception('Log: Error creating LogsService');
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    // ###################################################################
    // Microsoft Visio File Convert...
    // ###################################################################

    /**
     * Create the workflow from MS Visio and converts it to WFManager format
     * @param string $filePath The path of the Visio vsdx file
     * @return array
     */
    public function CreateJsonModelFromVisio($filePath)
    {
        try {
            //Init Result object 
            $result = null;
            //Open the downloaded File
            $vsdx = $this->ReadFileVsdx($filePath);
            //Get visio paper dimensions
            $pageDimensions = $this->GetPageDimensions(simplexml_load_string($vsdx->getFromName("visio/pages/pages.xml")));
            //Get Pages data from page1.xml (the default is always page1.xml)
            //ToDo: add support for multipages, not just the main/first page
            $visioPage = simplexml_load_string($vsdx->getFromName("visio/pages/page1.xml"));
            //Get Links from Connectors
            $links = $this->GetLinksFromVisioConnects($visioPage->Connects);
            //Get Blocks from Shapes
            $blocks = $this->GetBlocksFromVisioShapes($visioPage->Shapes, $links);
            //Make output model for JS
            $result = $this->GetResultModel($links, $blocks, $pageDimensions, $filePath);
            if (!is_null($result)) {
                return $result;
            } else {
                throw new Exception("Error Processing Data. Result is null.", 1);
            }
        } catch (Exception $e) {
            return $e;
        } finally {
            if (file_exists($filePath)) {
                //delete zip temp File
                unlink($filePath);
            }
        }
    }

    /**
     * Read the MS Visio FIle
     * @param string $inputFilePath The input file path 
     * @return void
     */
    public function ReadFileVsdx($inputFilePath)
    {
        try {
            $VisioFile = new \ZipArchive();
            if ($VisioFile->open($inputFilePath) === TRUE) {
                return $VisioFile;
            } else {
                throw new Exception('File Not found.', 404);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Get the links (aka Connects on Visio)
     * @param array $pageConnects
     * @return void
     */
    public function GetLinksFromVisioConnects($pageConnects)
    {
        try {
            $Links = array();
            if (!is_null($pageConnects)) {
                foreach ($pageConnects->Connect as $connect) {

                    $value = $connect['FromCell'];
                    if ($value == 'BeginX') {
                        $link = array();
                        $link['LinkId']   =  $connect['FromSheet']->__toString();
                        $link['SourceId'] =  $connect['ToSheet']->__toString();
                        $link['TargetId'] =  $this->GetTargetId($connect['FromSheet']->__toString(), $pageConnects);

                        // //Get Links Port for output 
                        // $outputPort = '';
                        // $portOrigin = $connect['ToPart']->__toString();
                        // if ($portOrigin) {
                        //     switch ($portOrigin) {
                        //         case 0:
                        //             $outputPort = '';   //None Port
                        //             break;
                        //         case 1:
                        //             $outputPort = 'Left';   //Left Edge
                        //             break;
                        //         case 3:
                        //             $outputPort = 'Right';   //Right Edge
                        //             break;
                        //         case 4:
                        //             $outputPort = 'Bottom';   //Bottom Edge  
                        //             break;
                        //         case 6:
                        //             $outputPort = 'Top';   //Top Edge
                        //             break;                                
                        //     }
                        // }

                        // $link['OutPort'] =  $outputPort ;

                        array_push($Links, $link);
                    }
                }
                return $Links;
            } else {
                throw new Exception('Error reading Connectors.', 205);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Get the Visio Page dimensions
     * @param string $pageFile The page file that contains Visio Page infos 
     * @return array
     */
    public function GetPageDimensions($pageFile)
    {
        try {
            $dimensions = [];
            if (key_exists('Page', $pageFile)) {
                if ($pageFile['Page']->ID == 0) {
                    $pageProperties = $pageFile->Page->PageSheet;
                    foreach ($pageProperties->Cell as $pageProperty) {
                        switch ($pageProperty['N']) {
                            case 'PageWidth':
                                $dimensions['Width'] = $pageProperty['V']->__toString();
                                break;
                            case 'PageHeight':
                                $dimensions['Height'] = $pageProperty['V']->__toString();
                                break;
                        }
                    }
                }
            }
        } catch (Exception $e) {
            throw $e;
        } finally {
            return $dimensions;
        }
    }

    /**
     * Converts Visio Shapes into WFManager Blocks
     * @param stdObject $shapes
     * @param array $links
     * @return void
     */
    public function GetBlocksFromVisioShapes($shapes, $links)
    {
        try {
            $blocks = [];
            //Get Links Ids
            $linksIds = array();
            foreach ($links as $link) {
                foreach ($link as $key => $value) {
                    if ($key == "LinkId") {
                        $linksIds[] = $value;
                    }
                }
            }

            foreach ($shapes->Shape as $shape) {
                $block = [];
                $identificativo = $this->GetIdentificativoShape($shape);
                if ($identificativo) {
                    /** @var SimpleXMLElement $shape */
                    $shapeId = $shape['ID']->__toString();
                    //Not in LinksArray... means it's a block...
                    if (!in_array($shapeId, $linksIds)) {
                        $block['Id'] = $shapeId;
                        $block['Identificativo'] = (string) $identificativo;
                        //Get Links that starts at Block
                        $blockLinks = $this->GetBlockLinks($shapeId, $links);
                        $block['Links'] = (!empty($blockLinks) ? $blockLinks : null);

                        //Search for X Y params
                        if (key_exists('Cell', $shape)) {
                            //Get Shape's Parameters               
                            foreach ($shape->Cell as $cell) {
                                //Get Source X Position     
                                if ($cell['N']->__toString() == 'PinX') {
                                    $block['PosX'] = $cell['V']->__toString();
                                }

                                //Get Source Y Position
                                if ($cell['N']->__toString() == 'PinY') {
                                    $block['PosY'] = $cell['V']->__toString();
                                }
                            }
                        }

                        if (key_exists('Text', $shape)) {
                            if (!is_null($shape->Text->fld->__toString())) {
                                $block['Label'] = $shape->Text->fld->__toString();
                            }
                        }
                        array_push($blocks, $block);
                    }
                }
            }
        } catch (Exception $e) {
            throw $e;
        } finally {
            return $blocks;
        }
    }

    function GetIdentificativoShape($shape)
    {
        try {
            if (key_exists('Section', $shape)) {
                $section = $shape->Section;
                if (!is_null($section) && count($section) > 0) {
                    if ($section["N"] == "Property") {
                        if (property_exists($section, 'Row')) {
                            foreach ($section->Row as $row) {
                                if ($row["N"] == "Identificativo") {
                                    foreach ($row->Cell as $cell) {
                                        if ($cell["N"] == "Value") {
                                            return $cell["V"];
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception $ex) {
            throw $ex;
        }
        return null;
    }

    /**
     * Get the Target's id by its Link
     * @param string $LinkId
     * @param array $Connects
     * @return string
     */
    public function GetTargetId($LinkId, $Connects)
    {
        foreach ($Connects->Connect as $connect) {
            $value = $connect['FromCell']->__toString();
            $currentId = $connect['FromSheet']->__toString();
            if ($value == 'EndX' &&  $currentId == $LinkId) {
                //return Link target's Id
                return  $connect['ToSheet']->__toString();
            }
        }
    }

    /**
     * Get a block's links
     * @param string $blockId
     * @param array $links
     * @return array
     */
    public function GetBlockLinks($blockId, $links)
    {
        try {
            $blockLinks = array();

            foreach ($links as $link) {
                if ($link['SourceId'] == $blockId || $link['TargetId'] == $blockId) {
                    array_push($blockLinks, $link);
                }
            }
        } catch (Exception $e) {
            throw $e;
        } finally {
            return $blockLinks;
        }
    }

    /**
     * Get the Result model 
     * @param array $links
     * @param array $blocks
     * @param array $pageDimensions
     * @param string $inputFilePath
     * @return array
     */
    public function GetResultModel($links, $blocks, $pageDimensions, $inputFilePath)
    {
        try {
            $results = null;
            if (!is_null($links) && !is_null($blocks)) {

                $results = [];
                $results['InputFile'] = basename($inputFilePath);
                $results['Blocks'] = (!empty($blocks) ? $blocks : null);
                $results['Links']  = (!empty($links) ? $links : null);
                $results['PageDimensions']  = (!empty($pageDimensions) ? $pageDimensions : null);
            }
        } catch (Exception $e) {
            throw $e;
        } finally {
            return $results;
        }
    }

    public function SendMail($email, $subject, $body, $identificativo)
    {
        try {
            $config = $this->GetSMPTConfig($identificativo);
            if ($config != null && $email != null) {
                if ($identificativo == "pec") {
                    $mail_from_address = $config["mail_from_address"];
                    $mail_domain = $config["mail_domain"];
                    $mailer = \OC::$server->getMailer();
                    $message = $mailer->createMessage();
                    $message->setSubject($subject);
                    $message->setFrom(["$mail_from_address@$mail_domain"]);
                    $message->setTo([$email]);
                    $message->setPlainBody($subject);
                    $message->setHtmlBody($body);
                    $response = $mailer->send($message);
                } else {
                    $mail_from_address = $config->getValue('mail_from_address');
                    $mail_domain = $config->getValue('mail_domain');
                    $mailer = \OC::$server->getMailer();
                    $message = $mailer->createMessage();
                    $message->setSubject($subject);
                    $message->setFrom(["$mail_from_address@$mail_domain"]);
                    $message->setTo([$email]);
                    $message->setPlainBody($subject);
                    $message->setHtmlBody($body);
                    $response = $mailer->send($message);
                }
            }
        } catch (Exception $ex) {
            throw $ex;
        }
    }

    public function SendNotification($userId, $mailSubject,  $mailText, $pid, $link=null)
    {
        try {
            $time = $this->timeFactory->getTime();
            $manager = \OC::$server->getNotificationManager();
            $notification = $manager->createNotification();
            $time = $this->timeFactory->getTime();
            $datetime = new \DateTime();
            $datetime->setTimestamp($time);

            $notification->setApp('wfam')
                ->setUser($userId)
                ->setDateTime($datetime)
                ->setObject('wfam_notifications', dechex($time))
                ->setSubject('ocs', [$mailSubject, $pid]);

            if ($mailText !== '') {
                $notification->setMessage('ocs', [$mailText]);
            }
            if(!is_null($link)){
                $notification->setLink($link);
            }
            $manager->notify($notification);
            return true;
        } catch (\InvalidArgumentException $e) {
            //return new DataResponse(null, Http::STATUS_INTERNAL_SERVER_ERROR);
        }
        return false;
    }

    public function GetNextNodeCell($nodeId, $jsonModelEngine, $stato)
    {
        try {
            $engine = new WorkflowEngine($this);

            $jsonModel = json_decode($jsonModelEngine["Dto"]->getWorkflowModel());

            $modelTree = $engine->GetModelTree($jsonModel->cells);

            $links = $engine->GetLinks($jsonModel->cells);

            $currentNode = $engine->GetNode($modelTree, $nodeId);
            if ($stato)
                $nextNode = $engine->GetChildrenFromCells($jsonModel->cells, $links, $currentNode);
            else
                $nextNode =  [$currentNode->Invalidate];
            return $nextNode;
        } catch (Exception $e) {
            throw $e;
        }
        return null;
    }

    public function GetCellFromId($blockId, $jsonModelEngine)
    {
        try {
            $engine = new WorkflowEngine($this);
            $jsonModel = json_decode($jsonModelEngine["Dto"]->getWorkflowModel());
            $cell = $engine->GetCellFromId($blockId, $jsonModel->cells);
            return $cell;
        } catch (Exception $e) {
            throw $e;
        }
        return null;
    }

    public function CheckNotifyDate($startDate, $days)
    {
        try {
            if (!is_null($startDate) && !is_null($days)) {
                $notifyDate  = new DateTime($startDate);
                date_add($notifyDate, date_interval_create_from_date_string($days . ' days'));
                $today = new DateTime('now');
                if ($today->format('Y-m-d') >= $notifyDate->format('Y-m-d')) {
                    return true;
                }
            }
            return false;
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function CheckRitardoEsecuzione($args)
    {
        try {
            //Check all current Workflows having an engine.
            $engines = $this->mapperEngine->Get(null);
            foreach ($engines as $engine) {
                //Get engine's Workflow jsonModel                    
                $engineJsonModel = $engine->workflowModel;
                $engineJsonModel = json_decode($engineJsonModel);
                $cells = $engineJsonModel->cells;
                foreach ($cells as $cell) {
                    //if (strcmp($cell->type, 'devs.Link') != 0) {
                    if (strcmp($cell->type, 'standard.Rectangle') == 0) {
                        $dateStart = (property_exists($cell->attrs->root, 'startDate') ? $cell->attrs->root->startDate : null);
                        $dateEnd = (property_exists($cell->attrs->root, 'endDate') ? $cell->attrs->root->endDate : null);
                        //Got the Current Block!      
                        if ((!is_null($dateStart) && $dateStart !== "") && (is_null($dateEnd) || (!is_null($dateEnd) && $dateEnd === ""))) {
                            //Check if the block has an active Notify control and it's true   
                            $doNotify = (property_exists($cell->attrs->root, 'enableNotifica') ? $cell->attrs->root->enableNotifica : false);
                            if (!is_null($doNotify) && $doNotify) {
                                $days = $cell->attrs->root->notifyDaysValue;
                                $isLate = $this->CheckNotifyDate($dateStart, $days);
                                if ($isLate) {
                                    if ($engine->appId !== "wfam") {
                                        $destName = $cell->attrs->root->utenteNome;
                                        $destEmail = $cell->attrs->root->utenteEmail;
                                        //Email and Days has to exists
                                        if (!is_null($days) && !is_null($destEmail)) {
                                            //Send Notify mail...
                                            //TODO : Gestire Template Mail Notifica
                                            $this->SendMail($destEmail, 'Notifica Ritardo Workflow Manager', '<p align="center"><b>Ritardo esecuzione flusso</b><br/><p align="center">Attenzione! Ritardo esecuzione flusso workflow per ' . $destName . '.</p></p>', $destName);
                                        }
                                    } else {
                                        $config = new \OC\Config(\OC::$SERVERROOT . '/config/');
                                        $base_url = $config->getValue('domain_url');
                                        $port = $this->controllerUser->GetWfConfig()->getValue('server_port');
                                        $host = $this->controllerUser->GetUrlRequest($base_url, $port);
                                        $url = \OC::$SERVERROOT . '/apps/workflowmanager/templates/content/templateNotificaEmailRitardo.html';
                                        $templateMail = file_get_contents($url);
                                        if ($templateMail) {
                                            $praticaId = $engine->ownerId;
                                            $responseRuoloWfa = $this->serviceRuoloWfa->FindAll(array("WfaId"=>$engine->workflowId, "UtenteId" => $cell->attrs->root->id));
                                            if (!is_null($responseRuoloWfa) && $responseRuoloWfa["Performed"] && count($responseRuoloWfa["Dtos"]) > 0) {
                                                $ruoloWfaId=$responseRuoloWfa["Dtos"][0]->id;
                                                $model = array("Filter" => ["RuoloWfaId" => $ruoloWfaId, "PraticaWfaId" => $praticaId]);
                                                $response = $this->serviceWfa->GetRuoloNotificaRitardo($model);
                                                if (!is_null($response) && $response["Performed"]) {
                                                    $response["Performed"] = false;
                                                    $response = $this->GetMailNotification($response);
                                                    if (!is_null($response) && $response->Performed && !is_null($response->Dtos)) {
                                                        $users = $response->Dtos;
                                                        $response = $this->serviceWfa->ReadPraticaWfa($praticaId);
                                                        if (!is_null($response) && $response["Performed"] && !is_null($response["Dto"])) {
                                                            if (!is_null($response["Dto"]->id) && $response["Dto"]->stato != "Bozza") {
                                                                $praticaWfa = $response["Dto"];
                                                                $search = array("{DIPENDENTE}", "{PROCESSO}", "{REDIRECTLINK}", "src=\"");
                                                                $dipendente = $praticaWfa->nomeDipendente;
                                                                $processo = $praticaWfa->nomeWfa;
                                                                $routeUrl = $host . $this->urlGenerator->linkToRoute('wfam.page.index', array('pid' => $praticaId));
                                                                $redirectLink = $routeUrl;
                                                                $image = "src=\"" .  $host . $this->urlGenerator->linkTo('wfam', 'img/header_email.jpg') . "\"";
                                                                $values = array($dipendente, $processo, $redirectLink, $image);
                                                                $body = str_replace($search, $values, $templateMail);
                                                                foreach ($users as $user) {
                                                                    if (isset($user["Email"]) && $user["Email"] != '') {
                                                                        try {
                                                                            $this->SendMail($user["Email"], "Notifica Ritardo WFA", $body, "mail");
                                                                        } catch (Exception $ex) {
                                                                        }
                                                                    }
                                                                    $userId = $user["Account"];
                                                                    $templateNotifica = "Salve, Il processo {PROCESSO} a uso di {DIPENDENTE} è in attesa di essere analizzato.";
                                                                    $bodyNotifica = str_replace($search, $values, $templateNotifica);
                                                                    $this->SendNotification($userId, "Notifica Ritardo WFA",  $bodyNotifica, $praticaId);
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function GetUrlRequest($base_url)
    {
        $split = explode('/', $base_url);
        $path = "";
        for ($i = 0; $i < count($split); $i++) {
            if ($split[$i] !== "") {
                $path .= $split[$i];
                if ($i == 0) {
                    $path .= "//";
                } else if ($i == 2) {
                    if (!is_null($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] != "80" && $_SERVER['SERVER_PORT'] != "443")
                        $path .= ":" . $_SERVER['SERVER_PORT'] . "/";
                    else
                        $path .= "/";
                } else {
                    $path .= "/";
                }
            }
        }
        return $path;
    }

    private function GetSMPTConfig($identificativo)
    {
        $config = new \OC\Config(\OC::$SERVERROOT . '/config/');
        if ($identificativo == "pec") {
            $config = new \OC\Config(\OC::$SERVERROOT . '/apps/workflowmanager/config/');
            $config = $config->getValue('Pec');
        }
        return $config;
    }

    public function GetChildDigitalSignature($Model)
    {
        try {
            $stato = $Model["Filter"]["Stato"];
            if ($stato) {
                $jsonModelEngine = $this->ReadEngine($Model["Filter"]);
                if (!is_null($jsonModelEngine)) {
                    $nextNodes = $this->GetNextNodeCell($Model['Filter']['Id'], $jsonModelEngine, $stato);
                    if (!is_null($nextNodes)) {
                        foreach ($nextNodes as $nextNode) {
                            if (!is_null($nextNode) && ($nextNode->Identificativo == "firmadigitale"))
                                return $nextNode;
                        }
                    }
                }
            }
        } catch (\Exception $ex) {
        }
        return null;
    }


    private function GetFileBase64($folder, $filename)
    {
        try {
            if (isset($folder) && isset($filename)) {
                $path = $folder . "/" . $filename;
                $content = file_get_contents($path);
                $mimeType = mime_content_type($path);
                $stream = base64_encode($content);
                return  $stream;
            }
        } catch (Exception $e) {
        }
        return null;
    }

    private function SendFile($model, $serviceUrl)
    {
        try {
            //todo:to call service DS
            $model["Performed"] = true;
            return $model["Stream"];
        } catch (Exception $ex) {
            $model["Performed"] = false;
            $model["Stream"] = null;
            $model["Exception"] = $ex->getMessage();
        } finally {
            return $model;
        }
    }

    public function CanMoveNext($model)
    {
        try {
            if (!is_null($model) && !is_null($model["Filter"])) {
                $response = null;
                //Read jsonModel from Engine's Table
                $jsonModel = $this->ReadEngine($model["Filter"]); //$jsonModel = $this->Read($model["Filter"]); 
                if (!is_null($jsonModel) && !is_null($jsonModel["Dto"]) && !array_key_exists('Exception', $jsonModel)) {
                    $jsonModel = json_decode($jsonModel["Dto"]->getWorkflowModel());
                    $id = $model["Filter"]["Id"];
                    if (!is_null($jsonModel) && !is_null($id)) {
                        $engine = new WorkflowEngine($this);
                        $authorized = $engine->CanMoveNext($jsonModel, $id);
                        $response["Authorized"] = $authorized;
                        $response["Performed"] = true;
                    } else {
                        throw new Exception('GetAuth: NodeId or engine model is null');
                    }
                } else {
                    throw new Exception('GetAuth: ' . $jsonModel['Exception']);
                }
                // return $response;
            } else {
                throw new Exception('GetAuth: Null or wrong input model');
            }
        } catch (Exception $e) {
            $response["Performed"] = false;
            $response["Exception"] = $e->getMessage();
        } finally {
            return $response;
        }
    }

    public function GetCellCurrentNode($model)
    {
        try {
            if (!is_null($model) && !is_null($model["Filter"])) {
                $response = null;
                //Read jsonModel from Engine's Table
                $jsonModel = $this->ReadEngine($model["Filter"]);
                if (!is_null($jsonModel) && !is_null($jsonModel["Dto"]) && !array_key_exists('Exception', $jsonModel)) {
                    $jsonModel = json_decode($jsonModel["Dto"]->getWorkflowModel());
                    if (!is_null($jsonModel)) {
                        $engine = new WorkflowEngine($this);
                        $cell = $engine->GetCellCurrentNode($jsonModel);
                        $response["Cell"] = $cell;
                        $response["Performed"] = true;
                    } else {
                        throw new Exception('Exception:Node not found');
                    }
                } else if (!is_null($jsonModel) && is_null($jsonModel["Dto"]) && !array_key_exists('Exception', $jsonModel)) {
                    $response["Cell"] = null;
                    $response["Performed"] = true;
                } else {
                    throw new Exception('Exception: ' . $jsonModel['Exception']);
                }
                // return $response;
            } else {
                throw new Exception('Exception: Null or wrong input model');
            }
        } catch (Exception $e) {
            $response["Performed"] = false;
            $response["Exception"] = $e->getMessage();
        } finally {
            return $response;
        }
    }
    public function XPDLParser($model)
    {
        try {
            $xml = simplexml_load_string($model["XPDL"]);
            if ($xml !== false) {
                $processes = $xml->WorkflowProcesses;
                if (!is_null($processes) && count($processes) > 0) {
                    $elements = $this->GetElements($processes);
                    if (!is_null($elements) && !is_null($elements["Activities"]) && !is_null($elements["Transitions"])) {
                        $activities = $elements["Activities"];
                        $transitions = $elements["Transitions"];
                        $idEntries = array();
                        $transiotionEntries = array();
                        $startActivityId = $this->GetStartActivityId($transitions, $activities);
                        $endActivitiesId = $this->GetEndActivities($transitions);
                        if (!is_null($startActivityId)) {
                            $xw = $this->CreateXML();
                            $count = count($transitions);
                            for ($i = 0; $i < $count; $i++) {
                                $transition = $transitions[$i];
                                $transitionType = $this->CreateLink($xw, $transition, $transitions, $startActivityId, $transiotionEntries, $activities);
                                $idEntries = $this->CreateElements($xw, $transition, $activities, $idEntries, $startActivityId, $endActivitiesId, $transitionType);
                            }
                            xmlwriter_end_element($xw);
                            $response["XML"] = xmlwriter_output_memory($xw);
                            $response["Performed"] = true;
                        } else {
                            $response["Error"] = "File non corretto. Impossibile trovare il nodo start.";
                            $response["Performed"] = true;
                        }
                    }
                }
            }
        } catch (\Exception $ex) {
            $response["Error"] = $ex->getMessage();
            $response["Performed"] = false;
        } finally {
            return $response;
        }
    }

    private function GetElements($processes)
    {
        try {
            $elements["Activities"] = null;
            $elements["Transitions"] = null;
            foreach ($processes->children() as $process) {
                if (isset($process->Activities)) {
                    $elements["Activities"] = $process->Activities->children();
                    $elements["Transitions"] = $process->Transitions->children();
                    break;
                }
            }
        } catch (\Exception $ex) {
        } finally {
            return $elements;
        }
    }

    private function CreateXml()
    {
        $xw = xmlwriter_open_memory();
        xmlwriter_set_indent($xw, 1);
        $res = xmlwriter_set_indent_string($xw, ' ');
        xmlwriter_start_document($xw, '1.0', 'UTF-8');
        xmlwriter_start_element($xw, 'cells');
        return $xw;
    }

    private function CreateLink($xw, $transition, $transitions, $startActivityId, &$transiotionEntries, $activities)
    {
        try {
            $transitionType = "ifthen";
            $idTransition = (string) $transition['Id'];
            if ($idTransition == "a374a408-0f55-448e-993e-4a9a4d9b242a")
                $ok = true;
            $from = (string) $transition['From'];
            $to = (string) $transition['To'];
            $type = (string) $transition->Condition["Type"];
            $elementType = "block";
            if (strtolower($type) == "condition")
                $elementType = "conditional";
            xmlwriter_start_element($xw, 'link');
            $this->SetXMLAttribute($xw, "Id", $idTransition);
            $this->SetXMLAttribute($xw, "SourceId", $from);
            $this->SetXMLAttribute($xw, "TargetId", $to);
            $this->SetXMLAttribute($xw, 'TargetPort', 'PortInput');
            if ($elementType != 'conditional') {
                $this->SetXMLAttribute($xw, 'SourcePort', 'PortOutput');
            } else {
                $visited = array();
                $isBanchChild = $this->IsBranchActivity($idTransition, $from, $transitions, $to, $startActivityId, $visited);
                if (!$isBanchChild) {
                    $links = $this->GetLinks($from, $idTransition, $transitions);
                    foreach ($links as $link) {
                        $isBranchActivity = $this->IsBranchActivity((string) $link["Id"], (string) $link["From"], $transitions, (string) $link["To"], $startActivityId, $visited);
                        $visited = array();
                        if ($isBranchActivity) {
                            $transitionType = "conditional";
                            break;
                        }
                    }
                }
                $transitionEntry = $this->GetTransition($from, $idTransition, $transiotionEntries);
                if (is_null($transitionEntry)) {
                    if ($isBanchChild) {
                        $this->SetXMLAttribute($xw, 'SourcePort', 'PortModifica');
                        $transition->SourcePort = 'PortModifica';
                        array_push($transiotionEntries, $transition);
                    } else {
                        $this->SetXMLAttribute($xw, 'SourcePort', 'PortApprova');
                        $transition->SourcePort = 'PortApprova';
                        array_push($transiotionEntries, $transition);
                    }
                } else {
                    $sourcePort = $transitionEntry->SourcePort;
                    if ($sourcePort == 'PortApprova') {
                        $activityTarget = $this->GetActivity($to, $activities);
                        if ($activityTarget["Identifier"] == "Rifiuto")
                            $this->SetXMLAttribute($xw, 'SourcePort', 'PortRifiuta');
                        else
                            $this->SetXMLAttribute($xw, 'SourcePort', 'PortModifica');
                    } else
                        $this->SetXMLAttribute($xw, 'SourcePort', 'PortApprova');
                }
            }
            $connectorGraphicsInfos = (array) $transition->ConnectorGraphicsInfos->ConnectorGraphicsInfo->children();
            if (!is_null($connectorGraphicsInfos)) {
                $count = count($connectorGraphicsInfos["Coordinates"]);
                for ($i = 0; $i < $count; $i++) {
                    $coordinate = $connectorGraphicsInfos["Coordinates"][$i];
                    $x = $coordinate["XCoordinate"];
                    $y = $coordinate["YCoordinate"];
                    if ((!is_null($x) && $x !== "") && (!is_null($y) && $y !== "")) {
                        xmlwriter_start_element($xw, 'position');
                        $this->SetXMLAttribute($xw, 'top', $y);
                        $this->SetXMLAttribute($xw, 'left', $x + 50);
                        xmlwriter_end_element($xw);
                    }
                }
            }
            xmlwriter_end_element($xw);
        } catch (\Exception $ex) {
        }
        return $transitionType;
    }

    private function CreateElements($xw, $transition, $activities, $idEntries, $startActivityId, $endActivitiesId, $transitionType)
    {
        try {
            $from = (string) $transition['From'];
            $to = (string) $transition['To'];
            $type = (string) $transition->Condition["Type"];
            $elementType = "block";
            $identifier = "step";
            $activity = $this->GetActivity($from, $activities);

            if (strtolower($type) == "condition") {
                if (!is_null($activity["Identifier"]) && strlen((string) $activity["Identifier"]) > 0) {
                    $identifier = (string) $activity["Identifier"];
                } else
                    $identifier = "ifthen"; //$transitionType;
                $elementType = "conditional";
            }

            if (!is_null($activity) && !in_array((string) $activity["Id"], $idEntries)) {
                if (!is_null($activity["Identifier"]) && strlen((string) $activity["Identifier"]) > 0) {
                    $identifier = (string) $activity["Identifier"];
                } else {
                    if ((string) $activity["Id"] === $startActivityId)
                        $identifier = "start";
                    elseif (in_array((string) $activity["Id"], $endActivitiesId))
                        $identifier = "end";
                }
                $this->CreateElement($xw, $activity, $elementType, $identifier);
                array_push($idEntries, (string) $activity["Id"]);
            }
            $activity = $this->GetActivity($to, $activities);
            if (!is_null($activity) && !in_array((string) $activity["Id"], $idEntries)) {
                $elementType = "block";
                $identifier = "step";
                if (!is_null($activity["Identifier"]) && strlen((string) $activity["Identifier"]) > 0) {
                    $identifier = (string) $activity["Identifier"];
                } else {
                    if ((string) $activity["Id"] === $startActivityId)
                        $identifier = "start";
                    elseif (in_array((string) $activity["Id"], $endActivitiesId))
                        $identifier = "end";
                }
                $this->CreateElement($xw, $activity, $elementType, $identifier);
                array_push($idEntries, (string) $activity["Id"]);
            }
            return $idEntries;
        } catch (Exception $ex) {
            //throw $th;
        }
    }

    private function GetActivity($id, $activities)
    {
        foreach ($activities as $activity) {
            if ((string) $activity["Id"] == $id) {
                return $activity;
            }
        }
        return null;
    }

    private function GetLinks($from, $idTransition, $transitions)
    {
        $links = array();
        foreach ($transitions as $transition) {
            if ((string) $transition["Id"] != $idTransition && (string) $transition["From"] == $from) {
                array_push($links, $transition);
            }
        }
        return $links;
    }

    private function GetTransition($from, $idTransition, $transiotionEntries)
    {
        foreach ($transiotionEntries as $transition) {
            if ((string) $transition["Id"] != $idTransition && (string) $transition["From"] == $from) {
                return $transition;
            }
        }
        return null;
    }

    private function CreateElement($xw, $activity, $elementType, $identifier)
    {
        $id = (string) $activity["Id"];
        $label = (string) $activity["Name"];
        xmlwriter_start_element($xw, $elementType);
        $this->SetXMLAttribute($xw, "Id", $id);
        $this->SetXMLAttribute($xw, "Label", $label);
        $this->SetXMLAttribute($xw, "State", 'clear');
        $this->SetXMLAttribute($xw, "Identifier", $identifier);
        if ($elementType != 'conditional') {
            $this->SetXMLAttribute($xw, 'OutputPort', 'PortOutput');
            $this->SetXMLAttribute($xw, 'InputPort', 'PortInput');
        } else {
            $this->SetXMLAttribute($xw, 'TruePort', 'PortApprova');
            $this->SetXMLAttribute($xw, 'FalsePort', 'PortRifiuta');
            $this->SetXMLAttribute($xw, 'InvalidatePort', 'PortModifica');
        }
        $nodeGraphicsInfos = $activity->NodeGraphicsInfos->NodeGraphicsInfo->Coordinates;
        if (!is_null($nodeGraphicsInfos)) {
            $x = $nodeGraphicsInfos["XCoordinate"];
            $y = $nodeGraphicsInfos["YCoordinate"];
            if ((!is_null($x) && $x !== "") && (!is_null($y) && $y !== "")) {
                xmlwriter_start_element($xw, 'position');
                $this->SetXMLAttribute($xw, 'top', $y);
                $this->SetXMLAttribute($xw, 'left', $x);
                xmlwriter_end_element($xw);
            }
        }
        xmlwriter_end_element($xw);
    }

    private function SetXMLAttribute($xw, $property, $value)
    {
        xmlwriter_start_attribute($xw, $property);
        xmlwriter_text($xw, $value);
        xmlwriter_end_attribute($xw);
    }

    private function IsBranchActivity($currentId, $currentFrom, $transitions, $activityId, $startActivityId, $visited)
    {
        if ($currentFrom !== $startActivityId) {
            $count = count($transitions);
            for ($i = 0; $i < $count; $i++) {
                $transition = $transitions[$i];
                if (!in_array((string) $transition["Id"], $visited)) {
                    if ((string) $transition["Id"] !== $currentId && (string) $transition["To"] === $currentFrom) {
                        if ((string) $transition["From"] === $activityId)
                            $isBranchActivity = true;
                        else {
                            if ($isBranchActivity !== false && $isBranchActivity !== true) {
                                array_push($visited, (string) $transition["Id"]);
                                $isBranchActivity = $this->IsBranchActivity((string) $transition["Id"], (string) $transition["From"], $transitions, $activityId, $startActivityId, $visited);
                            }
                        }
                    }
                }
            }
        } else
            $isBranchActivity = false;

        return $isBranchActivity;
    }

    private function GetStartActivityId($transitions, $activities)
    {
        $trovato = false;
        $count = count($activities);
        for ($i = 0; $i < $count; $i++) {
            $activity = $activities[$i];
            if ((string) $activity["Identifier"] == "R") {
                return (string) $activity["Id"];
            }
        }

        $count = count($transitions);
        for ($i = 0; $i < $count; $i++) {
            $transition = $transitions[$i];
            $from = (string) $transition["From"];
            $id = (string) $transition["Id"];
            for ($j = 0; $j < $count; $j++) {
                $transitionJ = $transitions[$j];
                if ((string) $transitionJ["Id"] !== $id && (string) $transitionJ["To"] === $from) {
                    $trovato = true;
                    break;
                }
            }
            if (!$trovato)
                return (string) $from;
        }

        return null;
    }

    private function GetEndActivities($transitions)
    {
        $ids = array();
        $trovato = false;
        $count = count($transitions);
        for ($i = 0; $i < $count; $i++) {
            $transition = $transitions[$i];
            $to = (string) $transition["To"];
            $id = (string) $transition["Id"];
            for ($j = 0; $j < $count; $j++) {
                $transitionJ = $transitions[$j];
                if ((string) $transitionJ["Id"] !== $id && (string) $transitionJ["From"] === $to) {
                    $trovato = true;
                    break;
                }
            }
            if (!$trovato) {
                if (!in_array($to, $ids))
                    array_push($ids, $to);
            }
            $trovato = false;
        }
        return $ids;
    }

    //cron
    private function GetMailNotification($Model)
    {
        try {
            if ($Model != null) {
                $model = new \OCA\WorkflowManager\Entity\UserModel;
                $usersId = $Model["UsersId"];
                $groupsName = $Model["GroupsName"];
                $config = $this->controllerUser->GetWFConfig();
                if ($config != null) {
                    $username = $config->getValue('username');
                    $password = $config->getValue('password');
                    $port = $config->getValue('server_port');
                    if ($usersId != null) {
                        foreach ($usersId as $userId) {
                            $userLDAP = $this->controllerUser->GetLDAPUserByUsername($userId, $username, $password, $port);
                            $dto = $this->controllerUser->BuildUsersDto($userLDAP);
                            array_push($model->Dtos, $dto);
                        }
                    }
                    if ($groupsName != null) {
                        foreach ($groupsName as $groupName) {
                            $members = $this->controllerUser->GetMembersGroup($groupName, $username, $password, $port);
                            if ($members != null) {
                                foreach ($members->element as $userId) {
                                    $userLDAP = $this->controllerUser->GetLDAPUserByUsername($userId, $username, $password, $port);
                                    $dto = $this->controllerUser->BuildUsersDto($userLDAP);
                                    array_push($model->Dtos, $dto);
                                }
                            }
                        }
                    }
                }
                $model->Performed = true;
                return $model;
            }
        } catch (Exception $e) {
        }
        return null;
    }
}
