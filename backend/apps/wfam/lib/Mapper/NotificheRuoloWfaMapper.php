<?php

namespace OCA\Wfam\Mapper;
use Exception;
use OCP\IDbConnection;
use OCP\AppFramework\Db\QBMapper;
use OCA\Wfam\Entity\NotificheRuoloWfa;


class NotificheRuoloWfaMapper extends QBMapper
{


    public function __construct(IDbConnection $db)
    {
        parent::__construct($db, 'wfam_notificheruolowfa', NotificheRuoloWfa::class);
    }

    public function find(int $Id)
    {
        try {
            $qb = $this->db->getQueryBuilder();

            if ($qb) {

                $qb->Select('id as Id');
                $qb->addSelect('ruolo_wfa_id as RuoloWfaId');
                $qb->addSelect('ruolo_informed_id as RuoloInformedId');
                $qb->from($this->getTableName())
                    ->having($qb->expr()->eq('Id', $qb->createNamedParameter($Id)));

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
                $qb->Select('q.id as Id');
                $qb->addSelect('q.ruolo_wfa_id as RuoloWfaId');
                $qb->addSelect('q.ruolo_informed_id as RuoloInformedId');
                $qb->addSelect('q.groups_informed as GroupsInformed');
                $qb->addSelect('rwi.utente_id as CodiceRuoloInformed');
                $qb->addSelect('ri.codifica as CodificaRuoloInformed');
                $qb->addSelect('ri.descrizione as DescrizioneRuoloInformed');
                $qb->addSelect('r.codice as CodiceRuoloWfa');
                $qb->addSelect('r.codifica as CodificaRuoloWfa');
                $qb->addSelect('r.descrizione as DescrizioneRuoloWfa');
                $qb->addSelect('rw.wfa_id as WfaId');
                $qb->addSelect('rw.utente_id as UtenteId');
                
                $qb->from($this->getTableName(), 'q')
                    ->leftJoin('q', 'wfam_ruolo_wfa', 'rw', 'rw.id = q.ruolo_wfa_id')
                    ->leftJoin('rw', 'wfam_ruolo', 'r', 'r.id = rw.ruolo_id')

                    ->leftJoin('q', 'wfam_ruolo_wfa', 'rwi', 'rwi.id = q.ruolo_informed_id')
                    ->leftJoin('rwi', 'wfam_ruolo', 'ri', 'ri.id = rwi.ruolo_id');

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

                    if (isset($filter["RuoloWfaId"]) && $filter["RuoloWfaId"] > 0) {
                        $and->add("RuoloWfaId = " . $filter['RuoloWfaId']);
                    }

                    if (isset($filter["RuoloInformedId"]) && $filter["RuoloInformedId"] > 0) {
                        $and->add("RuoloInformedId = " . $filter['RuoloInformedId']);
                    }

                }

                // //Search
                 /*if ($search !== null && $search !== "") {

                     $or->add("Nome like '%" . $search . "%'");

                     $or->add($qb->expr()->orX("Cognome like '%" . $search . "%'"));
                }*/

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
