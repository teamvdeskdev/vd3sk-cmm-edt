<?php

namespace OCA\Wfam\Service;

use Exception;

use OCA\Wfam\Entity\PraticaGruppoRuolo;
use OCA\Wfam\Mapper\PraticaGruppoRuoloMapper;
use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;
use OCP\ILogger;

//simonefase3

class PraticaGruppoRuoloService
{

    private $mapper;

    public function __construct(PraticaGruppoRuoloMapper $mapper, ILogger $logger)
    {
        $this->mapper = $mapper;
        $this->logger = $logger;
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
                $entity = new PraticaGruppoRuolo();

                if ($entity) {
                    $properties = $this->GetProperties($dto);

                    foreach ($properties as $property) {
                        $value = $dto[$property];
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

    public function Delete($dto)
    {

        try {
            if (!is_null($dto)) {
                $entity = $this->mapper->find((int) $dto['Id']);

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

    public function DeleteAllByPraticaWfaId($dtos)
    {
        $performed = false;
        try {
            // if (!is_null($dtos && sizeOf($dtos) > 0)) {
            //     return $this->mapper->deleteByPraticaWfaId($dtos);
            // }
            foreach($dtos as $dto) {
                if (!is_null($dto)) {
                    $entity = $this->mapper->find((int) $dto['Id']);
    
                    if ($entity) {
                        $performed = !is_null($this->mapper->delete($entity));
                    }
                }
            }
            return $performed;
        } catch (Exception $e) {
            return $e;
        }
        return false;
    }

    public function Find($filter)
    {
        try {
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
            //if (!is_null($filter) && count($filter) > 0 && $filter["WfaId"] > 0) {
            $entities = $this->mapper->FindAll($filter, $search, $order);
            // $this->logger->debug("i am here");
            // $this->logger->debug(json_encode($entities));
            //}
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

        // $this->logger->debug('service skip: '.$skip);
        // $this->logger->debug('service take: '.$take);

        try {
            $entities = $this->mapper->Load($skip, $take, $filter, $search, $order);
            $response["Performed"] = true;
            $response["Dtos"] = $entities;
            return $response;
        } catch (Exception $e) {
            $response["Exception"] = $e->getMessage();
        }
        return $response;
    }
}
