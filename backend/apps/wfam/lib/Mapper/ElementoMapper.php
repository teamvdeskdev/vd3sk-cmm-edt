<?php

namespace OCA\Wfam\Mapper;
use Exception;
use OCP\IDbConnection;
use OCP\AppFramework\Db\QBMapper;
use OCA\Wfam\Entity\Elemento;


class ElementoMapper extends QBMapper
{


    public function __construct(IDbConnection $db)
    {
        parent::__construct($db, 'wfam_elemento', Elemento::class);
    }

    public function find(int $id)
    {
        try
        {
            $qb = $this->db->getQueryBuilder();

            if ($qb) {

                $qb ->select('q.id as Id');
                $qb->addSelect('q.nome as Nome');
                $qb->addSelect('q.tipo as Tipo');
                $qb->addSelect('q.descrizione as Descrizione');
                $qb->from($this->getTableName(),'q')
                    ->having($qb->expr()->eq('Id', $qb->createNamedParameter($id)));

                return  $this->findEntity($qb);
            }
        }
        catch (Exception $e)
        {
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
                $qb ->select('q.id as Id');
                $qb->addSelect('q.nome as Nome');
                $qb->addSelect('q.tipo as Tipo');
                $qb->addSelect('q.descrizione as Descrizione');
                $qb->from($this->getTableName(),'q');                    

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

                    if (isset($filter["Nome"]) && $filter["Nome"] > 0) {
                        $and->add("Nome = '" . $filter['Nome']. "'");
                    }

                    if (isset($filter["Tipo"]) && $filter["Tipo"] > 0) {
                        $and->add("Tipo = '" . $filter['Tipo']. "'");
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
