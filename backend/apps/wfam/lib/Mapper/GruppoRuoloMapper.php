<?php

namespace OCA\Wfam\Mapper;

use Exception;
use OCP\IDbConnection;
use OCP\AppFramework\Db\QBMapper;
use OCA\Wfam\Entity\GruppoRuolo;


class GruppoRuoloMapper extends QBMapper
{


    public function __construct(IDbConnection $db)
    {
        parent::__construct($db, 'wfam_gruppo_ruolo', GruppoRuolo::class);
    }


    public function find(int $Id)
    {
        try {
            $qb = $this->db->getQueryBuilder();

            if ($qb) {

                $qb->Select('q.id as Id');
                $qb->addSelect('q.group_name as GroupName');
                $qb->addSelect('q.ruolo_wfa_id as RuoloWfaId');
                $qb->addSelect('rw.wfa_id as WfaId');
                $qb->addSelect('rw.utente_id as UtenteId');
                $qb->addSelect('r.codifica as CodificaRuolo');
                $qb->addSelect('r.id as RuoloId');

                $qb->from($this->getTableName(), 'q')
                    ->leftJoin('q', 'wfam_ruolo_wfa', 'rw', 'rw.id = q.ruolo_wfa_id')
                    ->leftJoin('rw', 'wfam_ruolo', 'r', 'r.id = rw.ruolo_id')
                    ->having($qb->expr()->eq('Id', $qb->createNamedParameter($Id)));
                return  $this->findEntity($qb);
            }
        } catch (Exception $e) {
            return $e;
        }
        return null;
    }

    public function FindAll($Filter = null, $Search = null, $Order = null)
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
                $qb->Select('q.id as Id');
                $qb->addSelect('q.group_name as GroupName');
                $qb->addSelect('q.ruolo_wfa_id as RuoloWfaId');
                $qb->addSelect('rw.wfa_id as WfaId');
                $qb->addSelect('rw.utente_id as UtenteId');
                $qb->addSelect('r.codifica as CodificaRuolo');
                $qb->addSelect('r.id as RuoloId');
                $qb->from($this->getTableName(), 'q')
                    ->leftJoin('q', 'wfam_ruolo_wfa', 'rw', 'rw.id = q.ruolo_wfa_id')
                    ->leftJoin('rw', 'wfam_ruolo', 'r', 'r.id = rw.ruolo_id');

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
                if ($filter !== null) {
                    if (isset($filter["WfaId"]) && $filter["WfaId"] > 0) {
                        $and->add("WfaId = " . $filter['WfaId']);
                    }

                    if (isset($filter["RuoloWfaId"]) && $filter["RuoloWfaId"] > 0) {
                        $and->add("RuoloWfaId = " . $filter['RuoloWfaId']);
                    }
                    if (isset($filter["GroupName"])) {
                        $and->add("GroupName = '" . $filter['GroupName'] . "'");
                    }
                    if (isset($filter["UtenteId"])) {
                        $and->add("UtenteId = '" . $filter['UtenteId'] . "'");
                    }
                }

                //Search        
                $or = $qb->expr()->orX();
                if (isset($search) && $search !== "") {
                    if (is_array($search)) {
                        $groupsName = $search["GroupName"];
                        foreach ($groupsName as $group) {
                            $or->add("LOWER(q.group_name) ='" . strtolower($group) . "'");
                        }
                    }
                }

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
