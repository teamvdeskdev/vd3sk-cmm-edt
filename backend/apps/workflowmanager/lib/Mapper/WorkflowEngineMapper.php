<?php

namespace OCA\WorkflowManager\Mapper;

use OCP\IDbConnection;
use OCP\AppFramework\Db\QBMapper;

use OCA\WorkflowManager\Entity\WorkflowEngineEntity;
use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;

class WorkflowEngineMapper extends QBMapper
{

    public function __construct(IDbConnection $db)
    {
        parent::__construct($db, 'wf_workflow_engine', WorkflowEngineEntity::class);
    }

    public function Read(int $ownerId, $workflowDataId)
    {
        try {
            $qb = $this->db->getQueryBuilder();

            if ($qb) {

                $qb->Select('*');
                $qb->from($this->getTableName())
                    ->where($qb->expr()->eq('owner_id', $qb->createNamedParameter($ownerId)))
                    ->andWhere($qb->expr()->eq('workflow_data_id', $qb->createNamedParameter($workflowDataId)));
                return  $this->findEntity($qb);
            }
        } catch (DoesNotExistException $e) {
            $response["Performed"] = true;
            $response["Dto"] = null;
        } catch (MultipleObjectsReturnedException $e) {
            $response["Performed"] = true;
            $response["Exception"] = $e->getMessage();
        } catch (\Exception $e) {
            $response["Performed"] = true;
            $response["Exception"] = $e->getMessage();
        }
    }

    public function Get($filter)
    {
        try {
            $qb = $this->db->getQueryBuilder();

            if ($qb) {
                $qb->Select('q.id as Id');
                $qb->addSelect('q.workflow_data_id as WorkflowDataId');
                $qb->addSelect('q.owner_id as OwnerId');
                $qb->addSelect('q.workflow_model as WorkflowModel');
                $qb->addSelect('wd.app_id as AppId');
                $qb->addSelect('wd.workflow_id as WorkflowId');

                $qb->from($this->getTableName(), 'q')
                    ->leftJoin('q', 'wf_workflow_data', 'wd', 'wd.workflow_id = q.workflow_data_id');
                $qb = $this->Where($qb, $filter);

                return  $this->findEntities($qb);
            }
        } catch (\Exception $e) {
            return $e;
        }
        return null;
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

    public function CreateOrUpdate($filter, $workflowModel)
    {
        try {
            if ($filter) {
                $ownerId = $filter["OwnerId"];
                $workflowId = $filter["WorkflowId"];
                $workflowEngineModel = $this->Read($ownerId, $workflowId);

                if (!$workflowEngineModel) {
                    $entity = new WorkflowEngineEntity();
                    //$entity->setWorkflowDataId($workflowModel["Dto"]["Id"]); 
                    $entity->setOwnerId($ownerId);
                    $entity->setWorkflowModel($workflowModel["Dto"]->workflowModel);
                    $entity->setWorkflowDataId($workflowId); //($workflowModel["Dto"]->getId());
                    $dto = $this->insert($entity);
                } else {
                    $entity = $workflowEngineModel;
                    //TODO : Temporary hack. Review input params
                    if (property_exists($workflowModel["Dto"], 'workflowModel')) {
                        $entity->setWorkflowModel($workflowModel["Dto"]->workflowModel);
                    } else {
                        $entity->setWorkflowModel($workflowModel["Dto"]["WorkflowModel"]);
                    }
                    $dto = $this->update($entity);
                }
                $response["Performed"] = true;
                $response["Dto"] = $dto;
                return $response;
            }
            $response["Performed"] = false;
            $response["Dto"] = null;
            return $response;
        } catch (\Exception $e) {
            $response["Performed"] = false;
            $response["Dto"] = $e->getMessage();
            return $response;
        }
    }

    public function Where($qb, $filter)
    {
        try {
            if ($qb) {
                $and = $qb->expr()->andX();
                if ($filter !== null) {

                    if (isset($filter["WorkflowDataId"])) {
                        $and->add("workflow_data_id = " . $filter['WorkflowDataId'] . " ");
                    }

                    if (isset($filter["OwnerId"])) {
                        $and->add("owner_id = " . $filter['OwnerId'] . " ");
                    }

                    if ($and->count() > 0) {
                        $qb->where($and);
                    }
                }
                return $qb;
            }
        } catch (\Exception $e) {
            return $e;
        }
        // return $this->handleException('Operazione non riuscita.');
    }
}
