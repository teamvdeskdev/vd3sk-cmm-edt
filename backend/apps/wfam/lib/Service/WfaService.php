<?php

namespace OCA\Wfam\Service;

use Exception;
use OCA\Wfam\Entity\CategoriaWfa;
use OCA\Wfam\Entity\Wfa;
use OCA\Wfam\Mapper\WfaMapper;
use OCA\Wfam\Mapper\PraticaWfaMapper;
use OCA\Wfam\Mapper\DipendenteMapper;
use OCA\Wfam\Mapper\ElementoWfaMapper;
use OCA\Wfam\Mapper\ValoreElementoWfaMapper;
use OCA\Wfam\Mapper\RuoloWfaMapper;
use OCA\Wfam\Mapper\GruppoRuoloMapper;
use OCA\Wfam\Mapper\RuoloPraticaWfaMapper;
use OCA\Wfam\Mapper\NotificheRuoloWfaMapper;
use OCA\Wfam\Mapper\AzioneWfaMapper;
use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;

class WfaService
{

    private $mapper;
    private $mapperDipendente;
    private $mapperElementoWfa;
    private $mapperValoreElemntoWfa;
    private $mapperPratica;
    private $mapperRuoloWfa;
    private $mapperRuoloPraticaWfa;
    private $mapperNotificheRuoloWfa;
    private $mapperAzioneWfa;
    private $mapperGruppoRuolo;

    public function __construct(
        WfaMapper $mapper,
        PraticaWfaMapper $mapperPratica,
        DipendenteMapper $mapperDipendente,
        ElementoWfaMapper $mapperElementoWfa,
        ValoreElementoWfaMapper $mapperValoreElemntoWfa,
        RuoloWfaMapper $mapperRuoloWfa,
        RuoloPraticaWfaMapper $mapperRuoloPraticaWfa,
        NotificheRuoloWfaMapper $mapperNotificheRuoloWfa,
        AzioneWfaMapper $mapperAzioneWfa,
        GruppoRuoloMapper $mapperGruppoRuolo
    ) {
        $this->mapper = $mapper;
        $this->mapperDipendente = $mapperDipendente;
        $this->mapperElementoWfa = $mapperElementoWfa;
        $this->mapperValoreElemntoWfa = $mapperValoreElemntoWfa;
        $this->mapperPratica = $mapperPratica;
        $this->mapperRuoloWfa = $mapperRuoloWfa;
        $this->mapperRuoloPraticaWfa = $mapperRuoloPraticaWfa;
        $this->mapperNotificheRuoloWfa = $mapperNotificheRuoloWfa;
        $this->mapperAzioneWfa = $mapperAzioneWfa;
        $this->mapperGruppoRuolo = $mapperGruppoRuolo;
    }

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

    public function Create($dto)
    {
        try {
            if (!is_null($dto)) {
                $entity = new Wfa();

                if ($entity) {
                    $properties = $this->GetProperties($dto);

                    foreach ($properties as $property) {
                        $value = $dto[$property];
                        $type = gettype($value);
                        if ($type == "boolean") {
                            if (!$value)
                                $value = 0;
                        }
                        $entity->__call('set' . $property, [$value]);
                    }
                    if ($dto = $this->mapper->insert($entity)) {
                        $response["Performed"] = true;
                        $response["Dto"] = $dto;
                        return $response;
                    }
                }
                $response["Performed"] = false;
                $response["Dto"] = [];
                return $response;
            }
        } catch (Exception $e) {
            return $e;
        }
    }
    public function Update($dto)
    {
        try {
            if (!is_null($dto)) {
                $entity = $this->mapper->find((int) $dto['Id']);

                if ($entity) {
                    $properties = $this->GetProperties($dto);

                    foreach ($properties as $property) {
                        $value = $dto[$property];
                        $type = gettype($value);
                        if ($type == "boolean") {
                            if (!$value)
                                $value = 0;
                        }
                        $entity->__call('set' . $property, [$value]);
                    }
                    if ($dto = $this->mapper->update($entity)) {
                        $response["Performed"] = true;
                        $response["Dto"] = $dto;
                        return $response;
                    }
                }
                $response["Performed"] = false;
                $response["Dto"] = [];
                return $response;
            }
        } catch (Exception $e) {
            return $e;
        }
    }

    public function Delete($id)
    {

        try {
            if (!is_null($id)) {
                $entity = $this->mapper->find((int) $id);
                if ($entity) {
                    $performed = !is_null($this->mapper->delete($entity));
                    return $performed;
                }
            }
        } catch (Exception $e) {
            return $e;
        }
        return false;
    }

    public function Find($filter)
    {
        try {
            $dto = null;
            if (!is_null($filter['Id']) && (int) $filter['Id'] > 0)
                $dto = $this->mapper->find((int) $filter['Id']); //todo: $entity-->$dto
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

    public function FindAll($filter = null, $search = null, $order = null)
    {

        try {
            $entities = $this->mapper->FindAll($filter, $search, $order);
            $response["Performed"] = true;
            $response["Dtos"] = $entities;
            return $response;
        } catch (Exception $e) {
            $response["Exception"] = $e->getMessage();
        }
        return $response;
    }

    public function Load($skip, $take, $filter, $search, $order)
    {

        try {
            $entities = $this->mapper->Load($skip, $take, $filter, $search, $order);
            $response["Performed"] = true;
            $response["Dtos"] = $entities;
            $response["Skip"] = $skip;
            $response["Take"] = $take;
            $count = $this->mapper->Count($filter, $search);
            $response["Count"] = $count;
            return $response;
        } catch (Exception $e) {
            $response["Exception"] = $e->getMessage();
        }
        return $response;
    }

    public function GetRuoloNotificaRitardo($model)
    {
        try {
            $response = array("Performed" => false, "GroupsName" => null, "UsersId" => null);
            if (!is_null($model) && !is_null($model["Filter"])) {
                $ruoloWfaId = $model["Filter"]["RuoloWfaId"];
                $praticaId = $model["Filter"]["PraticaWfaId"];
                if (isset($ruoloWfaId) && isset($praticaId)) {
                    $entities = $this->mapperRuoloPraticaWfa->FindAll($model["Filter"], null, null);
                    if (is_null($entities) || (!is_null($entities) && count($entities) <= 0)) {
                        $entities = $this->mapperGruppoRuolo->FindAll(array("RuoloWfaId"=>$ruoloWfaId));
                        if (!is_null($entities)) {
                            $groupsName=array();                           
                            foreach ($entities as $entity) {
                                 array_push($groupsName,$entity->groupName);                                
                            }
                            $response["GroupsName"] = $groupsName;
                        }
                    } else {
                        $usersId = array($entities[0]->utenteId);
                        $response["UsersId"] = $usersId;
                    }
                }
            }

            $response["Performed"] = true;
        } catch (Exception $e) {
            $response["Exception"] = $e->getMessage();
        }
        return $response;
    }

    public function ReadPraticaWfa($id)
    {
        try {
            if (!is_null($id)) {
                $filter = array("Id" => $id);
                $dto = $this->mapperPratica->find((int) $filter['Id']);
                $response["Dto"] = $dto;
            } else {
                $response["Dto"] = null;
            }
            $response["Performed"] = true;
            return $response;
        } catch (DoesNotExistException $e) {
            $response["Performed"] = true;
            $response["Dto"] = null;
        } catch (MultipleObjectsReturnedException $e) {
            $response["Performed"] = true;
            $response["Exception"] = $e->getMessage();
        } catch (Exception $e) {
            $response["Performed"] = false;
            $response["Exception"] = $e->getMessage();
        }
        return $response;
    }
    //Export Wfa
    public function Export($filter)
    {
        if (!is_null($filter) &&  !is_null($filter["WfaId"])) {
            $currentFilter = null;
            $wfaId = $filter["WfaId"];
            $wfa = $this->mapper->Find($wfaId);
            if (!is_null($wfa)) {
                $xw = xmlwriter_open_memory();
                xmlwriter_set_indent($xw, 1);
                $res = xmlwriter_set_indent_string($xw, ' ');
                xmlwriter_start_document($xw, '1.0', 'UTF-8');
                // A first element
                xmlwriter_start_element($xw, 'Wfa');
                // Attribute for element 'Wfa'        
                $entityProperties = ["CategoriaId", "Nome", "DataCreazione", "Creatore", "Stato", "Templatepdf", "Workflow", "CodificaAlfanumerica", "CifreNumericheProgressivo", "RichiestaPersonale", "Disabled"];
                $this->CreateAttributes($xw, $wfa, $entityProperties);

                //Categoria
                xmlwriter_start_element($xw, 'CategoriaWfa');
                $categoria = new CategoriaWfa();
                $wfaObj = get_object_vars(json_decode(json_encode($wfa)));
                $categoria->__call('setId', [$wfaObj["CategoriaId"]]);
                $categoria->__call('setNome', [$wfaObj["NomeCategoria"]]);
                $entityProperties = ["Nome"];
                $this->CreateAttributes($xw, $categoria, $entityProperties);
                xmlwriter_end_element($xw);

                //ruoli Wfa
                $ruoliWfa = $this->mapperRuoloWfa->FindAll($filter, null, null);
                if ($ruoliWfa != null) {
                    $notificheRuoloWfa = $this->mapperNotificheRuoloWfa->FindAll($filter, null, null);
                    foreach ($ruoliWfa as $ruoloWfa) {
                        xmlwriter_start_element($xw, 'RuoloWfa');
                        $entityProperties = ["WfaId", "UtenteId", "RuoloId"];
                        $this->CreateAttributes($xw, $ruoloWfa, $entityProperties);

                        //gruppiRuolo
                        $gruppiRuoloWfa = $this->mapperGruppoRuolo->FindAll($filter, null, null);
                        if (!is_null($gruppiRuoloWfa)) {
                            $gruppiRuolo = $this->GetGruppiRuolo($ruoloWfa->id, $gruppiRuoloWfa);
                            if (!is_null($gruppiRuolo) && count($gruppiRuolo) > 0) {
                                foreach ($gruppiRuolo as $gruppiRuolo) {
                                    xmlwriter_start_element($xw, 'GruppoRuolo');
                                    $entityProperties = ["GroupName", "RuoloId"];
                                    $this->CreateAttributes($xw, $gruppiRuolo, $entityProperties);
                                    xmlwriter_end_element($xw); // GruppoRuoloWfa
                                }
                            } else {
                                xmlwriter_start_element($xw, 'GruppoRuoloWfa');
                                xmlwriter_end_element($xw); // GruppoRuoloWfa
                            }
                        }
                        //notificheRuoloWfa                   
                        if (!is_null($notificheRuoloWfa)) {
                            $notificheRuolo = $this->GetNotificheRuolo($ruoloWfa->id, $notificheRuoloWfa);
                            if (!is_null($notificheRuolo) && count($notificheRuolo) > 0) {
                                foreach ($notificheRuolo as $notificaRuolo) {
                                    xmlwriter_start_element($xw, 'NotificaRuoloWfa');
                                    $entityProperties = ["RuoloWfaId", "RuoloInformedId", "GroupsInformed"];
                                    $this->CreateAttributes($xw, $notificaRuolo, $entityProperties);
                                    xmlwriter_end_element($xw); // NotificaRuoloWfa
                                }
                            } else {
                                xmlwriter_start_element($xw, 'NotificaRuoloWfa');
                                xmlwriter_end_element($xw); // NotificaRuoloWfa
                            }
                        } else {
                            xmlwriter_start_element($xw, 'NotificaRuoloWfa');
                            xmlwriter_end_element($xw); // NotificaRuoloWfa
                        }
                        xmlwriter_end_element($xw); // RuoloWfa
                    }
                }

                //azioniWfa
                $azioniWfa = $this->mapperAzioneWfa->FindAll($filter, null, null);
                if (!is_null($azioniWfa)) {
                    foreach ($azioniWfa as $azioneWfa) {
                        xmlwriter_start_element($xw, 'AzioneWfa');
                        $entityProperties = $this->GetProperties($azioneWfa);
                        $this->CreateAttributes($xw, $azioneWfa, $entityProperties);
                        xmlwriter_end_element($xw);
                    }
                }

                $order = array("Name" => "Ordine", "Direction" => "asc");
                $elementiWfa = $this->mapperElementoWfa->FindAll($filter, null, $order);
                if ($elementiWfa) {
                    foreach ($elementiWfa as $elementoWfa) {
                        xmlwriter_start_element($xw, 'ElementoWfa');
                        $entityProperties = ["WfaId", "ElementoId", "Required", "Ordine", "Rows"]; //$this->GetProperties($elementoWfa);
                        $this->CreateAttributes($xw, $elementoWfa, $entityProperties);
                        xmlwriter_end_element($xw); // ElementoWfa
                    }
                }

                $order = array("Name" => "DataRichiesta", "Direction" => "asc");
                $praticheWfa = $this->mapperPratica->FindAll($filter, null, $order);
                if (!is_null($praticheWfa)) {
                    $praticheWfa = $this->DeleteDuplicate($praticheWfa);
                    foreach ($praticheWfa as $praticaWfa) {
                        $order = null;
                        $dipendenteId = $praticaWfa->dipendenteId;
                        $praticaWfaId = $praticaWfa->id;

                        $dipendente = $this->mapperDipendente->Find($dipendenteId);

                        $praticaFilter = array("PraticaWfaId" => $praticaWfaId);
                        $ruoliPraticaWfa = $this->mapperRuoloPraticaWfa->FindAll($praticaFilter, null, null);

                        $valoreElementiWfa = $this->mapperValoreElemntoWfa->FindAll($praticaFilter, null, null);
                        $this->BuildPraticaXml($xw, $praticaWfa, $dipendente, $elementiWfa, $valoreElementiWfa, $ruoliPraticaWfa);
                    }
                }
                xmlwriter_end_element($xw); // wfa 
                $response["XML"] = xmlwriter_output_memory($xw);
                $response["Performed"] = true;
                return $response;
            }
        }
    }

    private function BuildPraticaXml($xw, $praticaWfa, $dipendente, $elementiWfa, $valoreElementiWfa, $ruoliPraticaWfa)
    {
        //PraticaWfa
        xmlwriter_start_element($xw, 'PraticaWfa');
        $entityProperties = ["DipendenteId", "WfaId", "DataRichiesta", "ModificaRichiesta", "Stato", "Pdf", "CodificaProgressivo", "Progressivo"];
        $this->CreateAttributes($xw, $praticaWfa, $entityProperties);

        //RuoliPraticaWfa
        if (!is_null($ruoliPraticaWfa)) {
            foreach ($ruoliPraticaWfa as $ruoloPraticaWfa) {
                xmlwriter_start_element($xw, 'RuoloPraticaWfa');
                $entityProperties = ["RuoloWfaId", "PraticaWfaId", "UtenteId"];
                $this->CreateAttributes($xw, $ruoloPraticaWfa, $entityProperties);
                xmlwriter_end_element($xw); // RuoloPraticaWfa
            }
        }


        //Dipendente
        if (!is_null($dipendente)) {
            xmlwriter_start_element($xw, 'Dipendente');
            $entityProperties = ["NomeDipendente", "Inquadramento", "UO", "Sede", "Mansione", "Contratto"];
            $this->CreateAttributes($xw, $dipendente, $entityProperties);
            xmlwriter_end_element($xw); // Dipendente
        }

        //ValoreElementoWfa
        if (!is_null($elementiWfa)) {
            foreach ($elementiWfa as $elementoWfa) {
                if (!is_null($valoreElementiWfa)) {
                    $valoreElementoWfa = $this->GetValoreElementoWfa($elementoWfa->id, $valoreElementiWfa);
                    if ($valoreElementoWfa !== null) {
                        xmlwriter_start_element($xw, 'ValoreElementoWfa');
                        $entityProperties = $this->GetProperties($valoreElementoWfa);
                        $this->CreateAttributes($xw, $valoreElementoWfa, $entityProperties);
                        xmlwriter_end_element($xw); // ValoreElementoWfa
                    }
                }
            }
        }
        xmlwriter_end_element($xw); // Pratica        
    }

    private function GetGruppiRuolo($ruoloWfaId, $gruppiRuolo)
    {
        $gruppi = array();
        if (!is_null($ruoloWfaId) && !is_null($gruppiRuolo)) {
            foreach ($gruppiRuolo as $gruppoRuolo) {
                $obj = get_object_vars(json_decode(json_encode($gruppoRuolo)));
                if ($obj["RuoloWfaId"] === $ruoloWfaId)
                    array_push($gruppi, $gruppoRuolo);
            }
        }
        return $gruppi;
    }

    private function GetNotificheRuolo($ruoloWfaId, $notificheRuoloWfa)
    {
        $notifiche = array();
        if (!is_null($ruoloWfaId) && !is_null($notificheRuoloWfa)) {
            foreach ($notificheRuoloWfa as $notificaRuoloWfa) {
                $obj = get_object_vars(json_decode(json_encode($notificaRuoloWfa)));
                if ($obj["RuoloWfaId"] === $ruoloWfaId)
                    array_push($notifiche, $notificaRuoloWfa);
            }
        }
        return $notifiche;
    }

    private function GetValoreElementoWfa($elementoWfaId, $valoreElementiWfa)
    {
        if (!is_null($elementoWfaId) && !is_null($valoreElementiWfa)) {
            foreach ($valoreElementiWfa as $valoreElementoWfa) {
                $obj = get_object_vars(json_decode(json_encode($valoreElementoWfa)));
                if ($obj["ElementoWfaId"] === $elementoWfaId)
                    return $valoreElementoWfa;
            }
        }
        return null;
    }

    private function CreateAttributes($xw, $dto, $entityProperties)
    {
        $obj = get_object_vars(json_decode(json_encode($dto)));
        $this->SetXMLAttribute($xw, "Id", $obj["Id"]);
        foreach ($entityProperties as $property) {
            $value = $obj[$property];
            if (is_bool($value)) {
                $value = ($value ? 1 : 0);
            }
            $this->SetXMLAttribute($xw, $property, $value);
        }
    }
    private function SetXMLAttribute($xw, $property, $value)
    {
        xmlwriter_start_attribute($xw, $property);
        xmlwriter_text($xw, (string) $value);
        xmlwriter_end_attribute($xw);
    }
    private function DeleteDuplicate($pratiche)
    {
        $praticheWfa = [];
        foreach ($pratiche as  $pratica) {
            $exist = array_search($pratica->id, array_column($praticheWfa, 'id'));
            if ($exist === false)
                array_push($praticheWfa, $pratica);
        }
        return $praticheWfa;
    }
    //End Export Wfa
}
