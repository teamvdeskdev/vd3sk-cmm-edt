<?php

namespace OCA\Wfam\Mapper;

//simonefase3

use Exception;
use OCP\IDbConnection;
use OCP\AppFramework\Db\QBMapper;
use OCA\Wfam\Entity\PraticaGruppoRuolo;
use OCP\ILogger;

//simonefase3

class PraticaGruppoRuoloMapper extends QBMapper
{

    private $logger;

    public function __construct(IDbConnection $db, ILogger $logger)
    {
        parent::__construct($db, 'wfam_pratica_gruppo_ruolo', PraticaGruppoRuolo::class);
        $this->logger = $logger;
    }

    public function find(int $Id)
    {
        try {
            $qb = $this->db->getQueryBuilder();

            if ($qb) {

                $qb->Select('q.id as Id');
                $qb->addSelect('q.ruolo_wfa_id as RuoloWfaId');
                $qb->addSelect('pr.id as PraticaWfaId');
                $qb->addSelect('g.gid as GroupName');
                $qb->addSelect('q.active as Active');
                $qb->addSelect('rw.utente_id as CodificaRuolo');
                // $qb->addSelect('rw.wfa_id as WfaId');
                // $qb->addSelect('rw.utente_id as UtenteId');
                // $qb->addSelect('r.codifica as CodificaRuolo');
                // $qb->addSelect('r.id as RuoloId');

                $qb->from($this->getTableName(), 'q')
                    ->leftJoin('q', 'wfam_pratica_wfa', 'pr', 'pr.id = q.pratica_wfa_id')
                    ->leftJoin('q', 'wfam_ruolo_wfa', 'rw', 'rw.id = q.ruolo_wfa_id')
                        ->leftJoin('rw', 'wfam_ruolo', 'r', 'r.id = rw.ruolo_id')
                    ->leftJoin('q', 'groups', 'g', 'g.gid = q.group_name')
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

                // $this->logger->debug("mapper skip: ".$Skip);
                // $this->logger->debug("mapper take: ".$Take);

                //Check Skip/Take 's not null
                if (false === is_null($Skip) && false === is_null($Take)) {

                    $qb = $this->qbSelect($qb);

                    $qb = $this->having($qb, $Filter, $Search, $Order);

                    $qb->setFirstResult($Skip);

                    $qb->setMaxResults($Take);

                    $entities = $this->findEntities($qb);

                    $this->logger->debug(json_encode($entities));
                    return $entities;

                }
            }
        } catch (Exception $e) {

            return $e;
        }
        return null;
    }

    public function deleteByPraticaWfaId($dtos) {
        try {
            $this->logger->debug("ci entro nel delete");
            $qb = $this->db->getQueryBuilder();
            if($qb) {
                //TODO delete query
                // $this->logger->debug('pratica_wfa_id to delete: '.$praticaWfaId);

                // $query = $qb->delete($this->getTableName(), 'q')
                //     //->where($qb->expr()->eq('q.pratica_wfa_id', $qb->createNamedParameter((int)$praticaWfaId)))
                //     ->where('q.pratica_wfa_id = :pid')
                //     ->setParameter(':pid', $praticaWfaId);
                // $this->logger->debug('query: '.$sql);
                // $query->execute();
                // return true;
            }
        } catch (Exception $e) {
            $this->logger->debug('ERRORE DELETEBYPRATICAERRORE: '. $e->getMessage());
            return $e;
        }
        return null;
    }

    public function qbSelect($qb)
    {
        try {
            if ($qb) {
                $qb->Select('q.id as Id');
                $qb->addSelect('q.ruolo_wfa_id as RuoloWfaId');
                $qb->addSelect('pr.id as PraticaWfaId');
                $qb->addSelect('g.gid as GroupName');
                $qb->addSelect('q.active as Active');
                $qb->addSelect('rw.utente_id as CodificaRuolo');
                
                // $qb->addSelect('rw.wfa_id as WfaId');
                // $qb->addSelect('rw.utente_id as UtenteId');
                // $qb->addSelect('r.codifica as CodificaRuolo');
                // $qb->addSelect('r.id as RuoloId');

                $qb->from($this->getTableName(), 'q')
                    ->leftJoin('q', 'wfam_pratica_wfa', 'pr', 'pr.id = q.pratica_wfa_id')
                    ->leftJoin('q', 'wfam_ruolo_wfa', 'rw', 'rw.id = q.ruolo_wfa_id')
                        ->leftJoin('rw', 'wfam_ruolo', 'r', 'r.id = rw.ruolo_id')
                    ->leftJoin('q', 'groups', 'g', 'g.gid = q.group_name');

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
                    // if (isset($filter["WfaId"]) && $filter["WfaId"] > 0) {
                    //     $and->add("WfaId = " . $filter['WfaId']);
                    // }

                    if (isset($filter["Id"]) && $filter["Id"] > 0) {
                        $and->add("Id = " . $filter['Id']);
                    }

                    if (isset($filter["RuoloWfaId"]) && $filter["RuoloWfaId"] > 0) {
                        $and->add("RuoloWfaId = " . $filter['RuoloWfaId']);
                    }
                    if (isset($filter["PraticaWfaId"])) { //removed 0 for new request
                        $and->add("PraticaWfaId = " . $filter['PraticaWfaId']);
                    }
                    if (isset($filter["GroupName"])) {
                        $and->add("GroupName = '" . $filter['GroupName'] . "'");
                    }
                    if (isset($filter["Active"])) {
                        $and->add("Active = '" . $filter['Active'] . "'");
                    }
                    if (isset($filter["CodificaRuolo"])) {
                        $and->add("CodificaRuolo = '" . $filter['CodificaRuolo'] . "'");
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
