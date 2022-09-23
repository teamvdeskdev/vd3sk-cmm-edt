<?php

namespace OCA\Wfam\Mapper;
use Exception;
use OCP\IDbConnection;
use OCP\AppFramework\Db\QBMapper;
use OCA\Wfam\Entity\Dipendente;


class DipendenteMapper extends QBMapper
{


    public function __construct(IDbConnection $db)
    {
        parent::__construct($db, 'wfam_dipendente', Dipendente::class);
    }

    public function find(int $id)
    {
        try {
            $qb = $this->db->getQueryBuilder();

            if ($qb) {

                // $qb ->select('q.id as Id');
                // $qb->addSelect('q.nome_dipendente as NomeDipendente');
                // $qb->addSelect('q.inquadramento as Inquadramento');
                // $qb->addSelect('q.uo as UO');
                // $qb->addSelect('q.sede as Sede');
                // $qb->addSelect('q.mansione as Mansione');
                // $qb->addSelect('q.contratto as Contratto');
                // $qb->from($this->getTableName(),'q')
                //     ->having($qb->expr()->eq('Id', $qb->createNamedParameter($id)));
                $qb->select('*')->from($this->getTableName())->where('id = ' . $id);
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

                //$qb = $this->qbSelect($qb);

                $qb->select('*')->from($this->getTableName());
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

                    // $qb = $this->qbSelect($qb);
                    $qb->select('*')->from($this->getTableName());

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
                $qb->select('id as Id');
                $qb->addSelect('nome_dipendente as NomeDipendente');
                $qb->addSelect('inquadramento as Inquadramento');
                $qb->addSelect('uo as UO');
                $qb->addSelect('sede as Sede');
                $qb->addSelect('mansione as Mansione');
                $qb->addSelect('contratto as Contratto');
                $qb->addSelect('uid as Uid');

                $qb->from($this->getTableName());

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
                    if (isset($filter["Id"])) {
                        $and->add("Id = " . $filter['Id'] );
                    }
                    if (isset($filter["NomeDipendente"])) {
                        $and->add("NomeDipendente = '" . $filter['NomeDipendente'] . "'");
                    }
                }

                //Search       
                if ($search !== null && $search !== "") {

                    $or->add("NomeDipendente like '%" . $search . "%'");
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
