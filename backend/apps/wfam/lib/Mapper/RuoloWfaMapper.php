<?php

namespace OCA\Wfam\Mapper;

use Exception;
use OCP\IDbConnection;
use OCP\AppFramework\Db\QBMapper;
use OCA\Wfam\Entity\RuoloWfa;


class RuoloWfaMapper extends QBMapper
{


    public function __construct(IDbConnection $db)
    {
        parent::__construct($db, 'wfam_ruolo_wfa', RuoloWfa::class);
    }


    public function find(int $Id)
    {
        try {
            $qb = $this->db->getQueryBuilder();

            if ($qb) {

                $qb->Select('id as Id');
                $qb->addSelect('wfa_id as WfaId');
                $qb->addSelect('utente_id as UtenteId');
                $qb->addSelect('ruolo_id as RuoloId');
                $qb->from($this->getTableName())
                    ->having($qb->expr()->eq('Id', $qb->createNamedParameter($Id)));

                return  $this->findEntity($qb);
            }
        } catch (Exception $e) {
            return $e;
        }
        return null;
    }

    public function FindAll($Filter=null, $Search=null, $Order=null)
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
                $qb->addSelect('q.wfa_id as WfaId');
                $qb->addSelect('q.utente_id as UtenteId');
                $qb->addSelect('q.ruolo_id as RuoloId');
                $qb->addSelect('r.codice as CodiceRuolo');
                $qb->addSelect('r.codifica as CodificaRuolo');
                $qb->addSelect('r.descrizione as DescrizioneRuolo');

                $qb->from($this->getTableName(), 'q')
                    ->leftJoin('q', 'wfam_ruolo', 'r', 'r.id = q.ruolo_id');
                    //->leftJoin('q','wfam_gruppo_ruolo','gr','gr.ruolo_id=q.ruolo_id');

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
                    if (isset($filter["CodificaRuolo"])) {
                        $and->add("CodificaRuolo = '" . $filter['CodificaRuolo'] . "'");
                    }                   
                    if (isset($filter["UtenteId"])) {
                        $and->add("UtenteId = '" . $filter['UtenteId'] . "'");
                    }
                    // if (isset($filter["GroupName"])) {
                    //     $and->add("GroupName = '" . $filter['GroupName'] . "'");
                    // }
                }

                //Search        
				 $or = $qb->expr()->orX();
				// if (isset($search) && $search !== "") {
                //     if(is_array($search))
                //     {
                //         $groupsName=$search["GroupName"];
                //         foreach($groupsName as $group)
                //         {
                //             $or->add("LOWER(q.group_name) ='" . strtolower($group) ."'");
                //         }
                //     } 
                    // else
                    // {
                    //     $or->add("LOWER(q.group_name) ='" . strtolower($group) ."'");
                    // }                  
				//}

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
