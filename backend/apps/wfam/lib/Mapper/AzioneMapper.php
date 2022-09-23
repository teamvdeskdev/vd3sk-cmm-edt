<?php

namespace OCA\Wfam\Mapper;

use Exception;
use OCP\IDbConnection;
use OCP\AppFramework\Db\QBMapper;
use OCA\Wfam\Entity\Azione;


class AzioneMapper extends QBMapper
{


    public function __construct(IDbConnection $db)
    {
        parent::__construct($db, 'wfam_azione', Azione::class);
    }

    public function find(int $id)
    {
        try {
            $qb = $this->db->getQueryBuilder();
            if ($qb) {
                $qb->select('q.id as Id');
                $qb->addSelect('q.nome as Nome');
                $qb->addSelect('q.tipo as Tipo');
                $qb->addSelect('q.descrizione as Descrizione');
                $qb->from($this->getTableName(), 'q')
                    ->having($qb->expr()->eq('Id', $qb->createNamedParameter($id)));

                $dto = $this->findEntity($qb);
                return $dto;
            }
        } catch (Exception $e) {
            return $e;
        }
        return null;
    }

    // public function find(int $id)
    // {
    //     $qb = $this->db->getQueryBuilder();

    //     $qb->select('*')
    //         ->from($this->getTableName())
    //         ->where(
    //             $qb->expr()->eq('id', $qb->createNamedParameter($id))
    //         );

    //     return $this->findEntity($qb);
    // }

    public function FindAll($Filter = null, $Search = null, $Order = null)
    {
        try {
            $qb = $this->db->getQueryBuilder();

            if ($qb) {

                $qb = $this->qbSelect($qb);
                $qb = $this->having($qb, $Filter, $Search, $Order);
                $dtos = $this->findEntities($qb);
                return  $dtos;
            }
        } catch (Exception $e) {

            return $e;
        }
    }

    public function Load($Skip, $Take, $Filter= null, $Search= null, $Order= null)
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
                $qb->addSelect('q.nome as Nome');
                $qb->addSelect('q.tipo as Tipo');
                $qb->addSelect('q.descrizione as Descrizione');
                $qb->from($this->getTableName(), 'q');

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

                    if (isset($filter["Tipo"])) {
                        $and->add("Tipo = '" . $filter['Tipo'] . "'");
                    }

                    if (isset($filter["Nome"])) {
                        $and->add("Nome = '" . $filter['Nome'] . "'");
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
    }
}
