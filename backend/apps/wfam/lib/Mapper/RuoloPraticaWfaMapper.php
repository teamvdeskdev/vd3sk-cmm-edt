<?php

namespace OCA\Wfam\Mapper;
use Exception;
use OCP\IDbConnection;
use OCP\AppFramework\Db\QBMapper;
use OCA\Wfam\Entity\RuoloPraticaWfa;


class RuoloPraticaWfaMapper extends QBMapper
{


    public function __construct(IDbConnection $db)
    {
        parent::__construct($db, 'wfam_ruolo_pratica_wfa', RuoloPraticaWfa::class);
    }

    public function find(int $Id)
    {
        try {
            $qb = $this->db->getQueryBuilder();

            if ($qb) {

                $qb->Select('q.id as Id');
                $qb->addSelect('q.ruolo_wfa_id as RuoloWfaId');
                $qb->addSelect('q.pratica_wfa_id as PraticaWfaId');
                $qb->addSelect('q.stato as Stato');
                $qb->addSelect('q.utente_id as UtenteId');
                $qb->addSelect('q.nome_utente as NomeUtente');
                $qb->addSelect('q.groups as Groups');      
                $qb->from($this->getTableName(),'q')
                    ->having($qb->expr()->eq('Id', $qb->createNamedParameter($Id)));

                return  $this->findEntity($qb);
            }
        } catch (Exception $e) {
            return $e;
        }
        return null;
    }

    public function FindAll($Filter, $Search=null, $Order=null)
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
                $qb->addSelect('q.stato as Stato');
                $qb->addSelect('q.pratica_wfa_id as PraticaWfaId');
                $qb->addSelect('q.utente_id as UtenteId');
                $qb->addSelect('r.id as CodiceRuoloWfaId');
                $qb->addSelect('rw.utente_id as CodiceRuolo');
                $qb->addSelect('r.codifica as CodificaRuolo');
                $qb->addSelect('r.descrizione as DescrizioneRuolo');
                $qb->addSelect('q.nome_utente as NomeUtente');
                $qb->addSelect('q.groups as Groups');                

                 $qb->from($this->getTableName(),'q')
                    ->leftJoin('q', 'wfam_ruolo_wfa', 'rw', 'q.ruolo_wfa_id = rw.id')
                    ->leftJoin('rw', 'wfam_ruolo', 'r', 'rw.ruolo_id = r.id');

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

                    if (isset($filter["PraticaWfaId"]) && $filter["PraticaWfaId"] > 0) {
                        $and->add("PraticaWfaId = " . $filter['PraticaWfaId']);
                    }       
                    
                    if (isset($filter["CodiceRuolo"])) {
                        $and->add("CodiceRuolo = '" . $filter['CodiceRuolo'] . "'");
                    }
                    
                    if (isset($filter["RuoloWfaId"]) && $filter["RuoloWfaId"] > 0) {
                        $and->add("RuoloWfaId = " . $filter['RuoloWfaId']);
                    }                       

                    if (isset($filter["Stato"])) {
                        $and->add("Stato = '" . $filter['Stato']. "'");
                    }
                    if (isset($filter["UtenteId"])) {
                        $and->add("UtenteId = '" . $filter['UtenteId']. "'");
                    }
                    if (isset($filter["CodificaRuolo"])) {
                        $and->add("CodificaRuolo = '" . $filter['CodificaRuolo']. "'");
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


        }
    }    
}
