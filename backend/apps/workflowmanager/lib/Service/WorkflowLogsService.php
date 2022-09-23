<?php

namespace OCA\WorkflowManager\Service;

use Exception;

use OCA\WorkflowManager\Entity\WorkflowLogs;
use OCA\WorkflowManager\Mapper\WorkflowLogsMapper;


class WorkflowLogsService
{

    protected $mapper;

    public function __construct(WorkflowLogsMapper $mapper)
    {
        $this->mapper = $mapper;
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

    public function Read($filter)
    {
        try {
            $dto = $this->mapper->Find($filter['Id']);
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

    public function Delete($dto)
    {
        try {
            if (!is_null($dto)) {
                $entity = $this->mapper->Read($dto['AppId']);

                if ($entity) {
                    $performed = !is_null($this->mapper->delete($entity));
                    return $performed;
                }
            }
        } catch (Exception $e) {
            throw $e ;
        }
        return false;
    }

    public function Create($model)
    {
        try {
            if (isset($model) && !empty($model)) {
                $log = new WorkflowLogs();
                $properties = $this->GetProperties($model["Dto"]);

                foreach ($properties as $property) {
                    $value = $model["Dto"][$property];
                    $log->__call('set' . $property, [$value]);
                }

                if (isset($log) && !empty($log)) {
                    $dto = $this->mapper->insert($log);
                }
                $response["Performed"] = true;
                $response["Dto"] = $dto;
                return $response;
            } else {
                $response["Performed"] = false;
                $response["Dto"] = null;
                return $response;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }
    
}
