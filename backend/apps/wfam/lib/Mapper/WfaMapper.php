<?php

namespace OCA\Wfam\Mapper;

use Exception;
use OCP\IDbConnection;
use OCP\AppFramework\Db\QBMapper;
use OCA\Wfam\Entity\Wfa;


class WfaMapper extends QBMapper
{

    public function __construct(IDbConnection $db)
    {
        parent::__construct($db, 'wfam_wfa', Wfa::class);
    }

    public function find(int $Id)
    {
        try {
            $qb = $this->db->getQueryBuilder();

            if ($qb) {
                $qb = $this->qbSelect($qb);
                $qb->having($qb->expr()->eq('Id', $qb->createNamedParameter($Id)));
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

    public function Count($filter = null, $search = null)
    {
        try {
            $qb = $this->db->getQueryBuilder();
            if ($qb) {
                $qb->selectAlias($qb->createFunction('COUNT(q.id)'), 'count')->from($this->getTableName(), 'q');
                $qb->leftJoin('q', 'wfam_categoria_wfa', 'c', 'c.id = q.categoria_id');
                $qb = $this->having($qb, $filter, $search);

                if ($qb != null) {
                    $cursor = $qb->execute();
                    $row = $cursor->fetch();
                    $cursor->closeCursor();
                    if ($row != null && isset($row['count']) && is_numeric($row['count'])) {
                        $count = (int) $row['count'];
                        return $count;
                    }
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
                $qbPraticaWfa = $this->db->getQueryBuilder();

                $qb->Select('q.id as Id');
                $qb->addSelect('q.nome as Nome');
                $qb->addSelect('q.categoria_id as CategoriaId');
                $qb->addSelect('q.data_creazione as DataCreazione');
                $qb->addSelect('q.creatore as Creatore');
                $qb->addSelect('q.stato as Stato');
                $qb->addSelect('q.workflow as Workflow');
                $qb->addSelect('q.url_step as UrlStep');
                $qb->addSelect('q.templatepdf as Templatepdf');
                $qb->addSelect('q.codifica_alfanumerica as CodificaAlfanumerica');
                $qb->addSelect('q.cifre_numeriche_progressivo as CifreNumericheProgressivo');
                $qb->addSelect('q.richiesta_personale as RichiestaPersonale');
                $qb->addSelect('q.disabled as Disabled');
                $qb->addSelect('q.icon as Icon');
                $qb->addSelect('c.nome as NomeCategoria');
				$qb->addSelect($qb->createFunction('(' . ($qbPraticaWfa->Select($qbPraticaWfa->createFunction('COUNT(*)'))->From('wfam_pratica_wfa', 'p')->Where($qbPraticaWfa->expr()->eq('p.wfa_id', 'q.id')))->getSQL() . ') as CountPratiche'));

                $qb->from($this->getTableName(), 'q')
                    ->leftJoin('q', 'wfam_categoria', 'c', 'c.id = q.categoria_id');

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
                    if (isset($filter["Id"]) && $filter["Id"] > 0) {
                        $and->add("q.id = " . $filter['Id']);
                    }
                    if (isset($filter["CategoriaId"]) && $filter["CategoriaId"] > 0) {
                        $and->add("q.categoria_id = " . $filter['CategoriaId']);
                    }
                    if (isset($filter["Disabled"])) {
                        $and->add("q.disabled = " . $filter['Disabled']);
                    }
                    if (isset($filter["Nome"])) {
                        $and->add("q.nome = '" . $filter['Nome'] . "'");
                    }                    

                    if (isset($filter["Stato"])) {
                        $and->add("q.stato = '" . $filter['Stato'] . "'");
                    }

                    if (isset($filter["DataCreazione"])) {
                        $and->add("q.data_creazione = '" . $filter['DataCreazione'] . "'");
                    }

                    if (isset($filter["Dal"])) {
                        $and->add("q.data_creazione >= '" . $filter['Dal'] . "'");
                    }

                    if (isset($filter["Al"])) {
                        $and->add("q.data_creazione <= '" . $filter['Al'] . "'");
                    }
                }

                //Search        
                $or = $qb->expr()->orX();
                if (isset($search) && $search !== "") {
                    if (is_array($search)) {
                        $wfaIds = $search["WfaId"];
                        foreach ($wfaIds as $wfaId) {
                            $or->add("q.Id =" . strtolower($wfaId));
                        }
                     }
                    // else {
                    //     $wfaId = $search["WfaId"];
                    //     $or->add("LOWER(q.Id) =" . strtolower($wfaId));
                    // }
                }

                if ($and->count() > 0) {
                    $qb->where($and);
                }

                if ($or->count() > 0) {
                    $qb = ($and->count() > 0) ? $qb->andWhere($or) : $qb->where($or);
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
