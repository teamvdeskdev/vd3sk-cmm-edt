<?php

namespace OCA\WorkflowManager\Mapper;

use OCP\IDbConnection;
use OCP\AppFramework\Db\QBMapper;

use OCA\WorkflowManager\Entity\Workflow;
use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;

class WorkflowMapper extends QBMapper
{

    public function __construct(IDbConnection $db)
    {
        parent::__construct($db, 'wf_workflow_data', Workflow::class);
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
        } catch (\Exception $e) {
            $response["Performed"] = true;
            $response["Exception"] = $e->getMessage();
        }
    }

    public function Read($AppId, $WorkflowId)
    {
        try {
            $qb = $this->db->getQueryBuilder();

            if ($qb) {

                $qb->Select('*');
                $qb->from($this->getTableName())
                    ->where($qb->expr()->eq('app_id', $qb->createNamedParameter($AppId)))
                    ->andWhere($qb->expr()->eq('workflow_id', $qb->createNamedParameter($WorkflowId)));

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

                $qb->Select('*');
                $qb->from($this->getTableName(), 'q');
                $qb = $this->Where($qb, $filter);

                return  $this->findEntities($qb);
            }
        } catch (\Exception $e) {
            return $e;
        }
        return null;
    }

    public function Load( $filter)
    {
        try {
            $qb = $this->db->getQueryBuilder();
            if ($qb) {
                $qb->Select('*');
                $qb->from($this->getTableName(), 'q');
                $qb = $this->Where($qb, $filter);
                return  $qb;
            }
        } catch (\Exception $e) {
            return $e;
        }
        return null;
    }

    public function Where($qb, $filter)
    {
        try {
            if ($qb) {
                $and = $qb->expr()->andX();
                if ($filter !== null) {

                    if (isset($filter["AppId"])) {
                        $and->add("app_id = '" . $filter['AppId'] . "'");
                    }

                    if (isset($filter["WorkflowId"])) {
                        $and->add("workflow_id = '" . $filter['WorkflowId'] . "'");
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

    public function ToList($qb)
    {
        try {
            if ($qb != null) {
                $entities = $this->findEntities($qb);
                return $entities;
            }
        } catch (\Exception $e) {
            return $e;
         }
        return null;
    }

    public function Count($filter)
    {
        try {
           $entities=$this->Get($filter);
           if(!is_null($entities))
           {
               return count($entities);
           }
        } catch (\Exception $e) {
            return $e;
         }
        return 0;
    }
    // public function find(int $id)
    // {
    //     $qb = $this->db->getQueryBuilder();

    //     if ($qb) {

    //         $qb->Select('*')->from($this->getTableName())
    //             ->where($qb->expr()->eq('id', $qb->createNamedParameter($id)));

    //         //return $qb->getSQL();
    //         return  $this->findEntity($qb);
    //     } else return null;
    // }

    // public function findAll($filter, $search, $order)
    // {

    //     $qb = $this->db->getQueryBuilder();

    //     if ($qb) {
    //         $qb->Select('*')->from($this->getTableName());
    //         $qb = $this->where($qb, $filter, $search, $order);
    //         return $this->findEntities($qb);
    //     }
    //     return null;
    // }

    // public function get($filter, $search, $order)
    // {

    //     $qb = $this->db->getQueryBuilder();

    //     if ($qb) {
    //         $qb->Select('*')->from($this->getTableName());
    //         $qb = $this->where($qb, $filter, $search, $order);
    //         $qb->setMaxResults(1);
    //         return $qb->getSQL();
    //         return $this->findEntity($qb);
    //     }
    //     return null;
    // }

    // public function where($qb, $filter = null, $search = null, $order = null)
    // {
    //     try {
    //         if ($qb) {

    //             $and = $qb->expr()->andX();
    //             $or = $qb->expr()->orX();

    //             if ($filter !== null) {

    //                 if (isset($filter["AppId"]) && (string) $filter["AppId"] !== "") {
    //                     $and->add("LOWER(app_id) = '" . strtolower($filter['AppId']) . "'");
    //                 }

    //                 if (isset($filter["WorkflowId"]) && (string) $filter["WorkflowId"] !== "") {
    //                     $and->add("LOWER(workflow_id) = '" . strtolower($filter['WorkflowId']) . "'");
    //                 }

    //                 // if (isset($filter["DateTime"]) && (string) $filter["DateTime"] !== "") {

    //                 //     $wfDateTime = date('Y-m-d H:i:s', strtotime($filter["DateTime"]));
    //                 //     $and->add("date_time = '" . strtolower($wfDateTime) . "'");
    //                 // }
    //             }


    //             //Search          
    //             if ($search !== null && $search !== "") {

    //                 $or->add("LOWER(app_id) like '%" . strtolower($search) . "%'");
    //                 $or->add("LOWER(workflow_id) like '%" . strtolower($search) . "%'");
    //                 $or->add("CONVERT(date_time, CHAR) like '" . $search . "%'");
    //             }

    //             if ($and->count() > 0) {
    //                 $qb->where($and);
    //             }

    //             if ($or->count() > 0) {
    //                 $qb = ($and->count() > 0) ? $qb->andHaving($or) : $qb->having($or);
    //             }

    //             if ($order != null && $order['Name'] != null) {
    //                 $qb->orderby($order['Name'], $order['Direction']);
    //             }
    //             else $qb->orderby('id','DESC');

    //             return $qb;
    //         }
    //         return null;
    //     } catch (Exception $e) {
    //         $this->handleException($e);
    //     }
    //     return null;
    // }
}
