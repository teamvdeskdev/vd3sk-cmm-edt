<?php

namespace OCA\Wfam\Mapper;

use Exception;
use OCP\IDbConnection;
use OCP\AppFramework\Db\QBMapper;
use OCA\Wfam\Entity\ElementoWfa;


class ElementoWfaMapper extends QBMapper
{


    public function __construct(IDbConnection $db)
    {
        parent::__construct($db, 'wfam_elemento_wfa', ElementoWfa::class);
    }

    public function find(int $id)
    {
        try {
            $qb = $this->db->getQueryBuilder();

            if ($qb) {

                $qb->select('q.id as Id');
                $qb->addSelect('q.wfa_id as WfaId');
                $qb->addSelect('q.elemento_id as ElementoId');
                $qb->addSelect('q.ordine as Ordine');
                $qb->from($this->getTableName(), 'q')
                    ->having($qb->expr()->eq('Id', $qb->createNamedParameter($id)));

                return  $this->findEntity($qb);
            }
        } catch (Exception $e) {
            return $e;
        }
        return null;
    }

    public function FindAll($Filter, $Search, $Order)
    {
        try {
            $qb = $this->db->getQueryBuilder();

            if ($qb) {

                $qb = $this->qbSelect($qb);
                $qb = $this->having($qb, $Filter, $Search, $Order);
                return  $this->findEntities($qb);
            }
        } catch (Exception $e) {
            return $e;
        }
        return null;
    }

    public function Load($Skip, $Take, $Filter, $Search, $Order)
    {
        try {
            $qb = $this->db->getQueryBuilder();

            if ($qb) {

                //Check Skip/Take 's not null
                if (false === is_null($Skip) && false === is_null($Take)) {

                    $qb = $this->qbSelect($qb);

                    $qb = $this->having($qb, $Filter, $Search, $Order);

                    $qb->setFirstResult($Skip);

                    $qb->setMaxResults($Take);

                    return $this->findEntities($qb);
                }
            }
        } catch (Exception $e) {

            return $e;
        }
        return null;
    }

    public function qbSelect($qb)
    {
        try {
            if ($qb) {
                $qb->select('q.id as Id');
                $qb->addSelect('q.wfa_id as WfaId');
                $qb->addSelect('q.elemento_id as ElementoId');
                $qb->addSelect('q.ordine as Ordine');
                $qb->addSelect('q.required as Required');
                $qb->addSelect('q.rows as Rows');
                $qb->addSelect('e.nome as NomeElemento');
                $qb->addSelect('e.tipo as TipoElemento');
                $qb->addSelect('e.descrizione as DescrizioneElemento');

                $qb->from($this->getTableName(), 'q')
                    ->leftJoin('q', 'wfam_elemento', 'e', 'e.id = q.elemento_id');

                return $qb;
            }
        } catch (Exception $e) {
            return $e;
        }
        return null;
    }

    public function having($qb, $filter = null, $search = null, $order = null)
    {
        try {
            if ($qb) {

                $and = $qb->expr()->andX();
                $or  = $qb->expr()->orX();

                if ($filter !== null) {

                    if (isset($filter["WfaId"]) && $filter["WfaId"] > 0) {
                        $and->add("WfaId = " . $filter['WfaId']);
                    }

                    if (isset($filter["ElementoId"]) && $filter["ElementoId"] > 0) {
                        $and->add("ElementoId = " . $filter['ElementoId']);
                    }
                }

                // //Search       
                // if ($search !== null && $search !== "") {

                //     $or->add("Nome like '%" . $search . "%'");

                //     $or->add($qb->expr()->orX("Cognome like '%" . $search . "%'"));
                // }

                if ($and->count() > 0) {
                    $qb->having($and);
                }

                if ($or->count() > 0) {
                    $qb = ($and->count() > 0) ? $qb->andHaving($or) : $qb->having($or);
                }

                if ($order != null && $order['Name'] != null) {
                    $qb->orderby($order['Name'], $order['Direction']);
                }

                return $qb;
            }
        } catch (Exception $e) {
            return $e;
        }
        return null;
    }
}
