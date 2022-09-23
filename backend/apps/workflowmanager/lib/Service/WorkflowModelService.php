<?php

namespace OCA\WorkflowManager\Service;

use Exception;

use OCA\WorkflowManager\Entity\WorkflowModel;
use OCA\WorkflowManager\Mapper\WorkflowModelMapper;
use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;

class WorkflowModelService
{

    protected $mapper;

    public function __construct(WorkflowModelMapper $mapper)
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
            $dto = $this->mapper->Read($filter['AppId'], $filter['ModelId']);
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
                $entity = $this->mapper->Read($dto['AppId'], $dto['ModelId']);

                if ($entity) {
                    $performed = !is_null($this->mapper->delete($entity));
                    return $performed;
                }
            }
        } catch (Exception $e) {
        }
        return false;
    }

    public function CreateOrUpdate($model)
    {
        try {
            if ($model) {
                $AppId = $model["WorkflowModel"]["AppId"];
                $ModelId = $model["WorkflowModel"]["ModelId"];
                $workflowModel = $this->mapper->Read($AppId, $ModelId);

                if (!$workflowModel) {
                    $entity = new WorkflowModel();
                } else {
                    $entity = $workflowModel;
                }

                $properties = $this->GetProperties($model["WorkflowModel"]);

                foreach ($properties as $property) {
                    $value = $model["WorkflowModel"][$property];
                    $entity->__call('set' . $property, [$value]);
                }

                if (!$workflowModel) {
                    $dto = $this->mapper->insert($entity);
                } else {
                    $dto = $this->mapper->update($entity);
                }
                $response["Performed"] = true;
                $response["Dto"] = $dto;
                return $response;
            }
            $response["Performed"] = false;
            $response["Dto"] = null;
            return $response;
        } catch (Exception $e) {
            return $e;
        }
    }
}
