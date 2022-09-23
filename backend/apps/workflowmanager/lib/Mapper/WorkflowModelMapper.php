<?php

namespace OCA\WorkflowManager\Mapper;

use OCP\IDbConnection;
use OCP\AppFramework\Db\QBMapper;

use OCA\WorkflowManager\Entity\WorkflowModel;
use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;

class WorkflowModelMapper extends QBMapper
{

    public function __construct(IDbConnection $db)
    {
        parent::__construct($db, 'wf_library_models', WorkflowModel::class);
    }

    public function Find(int $Id)
    {
        try {
            $qb = $this->db->getQueryBuilder();

            if ($qb) {

                $qb->Select('*');
                $qb->from($this->getTableName())
                    ->where($qb->expr()->eq('id', $qb->createNamedParameter($Id)));

                return  $this->findEntity($qb);
            }
        } catch (DoesNotExistException $e) {
            $response["Performed"] = true;
            $response["Dto"] = null;
        } catch (MultipleObjectsReturnedException $e) {
            $response["Performed"] = true;
            $response["Exception"] = $e->getMessage();
        } catch (Exception $e) {
            $response["Performed"] = true;
            $response["Exception"] = $e->getMessage();
        }
        
    }

    public function Read($AppId, $ModelId)
    {
        try {
            $qb = $this->db->getQueryBuilder();

            if ($qb) {

                $qb->Select('*');
                $qb->from($this->getTableName())
                    ->where($qb->expr()->eq('app_id', $qb->createNamedParameter($AppId)))
                    ->andWhere($qb->expr()->eq('model_id', $qb->createNamedParameter($ModelId)));

                return  $this->findEntity($qb);
            }
        } catch (DoesNotExistException $e) {
            $response["Performed"] = true;
            $response["Dto"] = null;
        } catch (MultipleObjectsReturnedException $e) {
            $response["Performed"] = true;
            $response["Exception"] = $e->getMessage();
        } catch (Exception $e) {
            $response["Performed"] = true;
            $response["Exception"] = $e->getMessage();
        }
    }

    public function Get($filter)
    {
        try {
            $qb = $this->db->getQueryBuilder();

            if ($qb) {
                
                $qb->Select('*');
                $qb->from($this->getTableName(), 'q');
                $qb = $this->Where($qb, $filter);

                return  $this->findEntities($qb);
            }
        } catch (Exeption $e) {
            return $e;
        }
        return null;
    }


    public function Where($qb,$filter)
    {
        try {
            if ($qb) {
                $and = $qb->expr()->andX();
                if ($filter !== null) {

                    if (isset($filter["AppId"])) {
                        $and->add("app_id = '" . $filter['AppId'] . "'");
                    }

                    // if (isset($filter["ModelId"])) {
                    //     $and->add("model_id = '" . $filter['ModelId'] . "'");
                    // }

                    if ($and->count() > 0) {
                        $qb->where($and);
                    }
                }
                return $qb;
            }
        } catch (Exception $e) {
            return $e;
        }
        return $this->handleException('Operazione non riuscita.');
    }
}
