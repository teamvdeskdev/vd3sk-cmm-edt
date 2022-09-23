<?php

namespace OCA\Wfam\Mapper;

use Exception;
use OCP\IDbConnection;
use OCP\AppFramework\Db\QBMapper;
use OCA\Wfam\Entity\PraticaWfa;
use OCP\DB\QueryBuilder\IQueryBuilder;

class PraticaWfaMapper extends QBMapper
{


    public function __construct(IDbConnection $db)
    {
        parent::__construct($db, 'wfam_pratica_wfa', PraticaWfa::class);
    }

    public function find(int $id)
    {
        try {
            $qb = $this->db->getQueryBuilder();

            if ($qb) {
                $qb->Select('q.id as Id');
                $qb->addSelect('q.data_richiesta as DataRichiesta');
                $qb->addSelect('q.dipendente_id as DipendenteId');
                $qb->addSelect('q.wfa_id as WfaId');
                $qb->addSelect('q.modifica_richiesta as ModificaRichiesta');
                $qb->addSelect('q.stato as Stato');
                $qb->addSelect('q.pdf as Pdf');
                $qb->addSelect('q.codifica_progressivo as CodificaProgressivo');
                $qb->addSelect('q.progressivo as Progressivo');
                $qb->addSelect('w.categoria_id as CategoriaId');
                $qb->addSelect('c.nome as NomeCategoria');
                $qb->addSelect('w.nome as NomeWfa');
                $qb->addSelect('d.nome_dipendente as NomeDipendente');
                $qb->addSelect('d.uid as Uid');
                $qb->addSelect('w.richiesta_personale as RichiestaPersonale');


                $qb->from($this->getTableName(), 'q')
                    ->leftJoin('q', 'wfam_dipendente', 'd', 'q.dipendente_id = d.id')
                    ->leftJoin('q', 'wfam_wfa', 'w', 'q.wfa_id = w.id')
                    ->leftJoin('w', 'wfam_categoria', 'c', 'w.categoria_id = c.id')->where('q.id = ' . $id);
                $sql = $qb->getSql();
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
                //return $sql = $qb->getSQL();
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
                if (false === is_null($Skip) && false === is_null($Take)) {
                    $qb = $this->qbSelect($qb);
                    $qb = $this->having($qb, $Filter, $Search, $Order);

                    $qb->setFirstResult($Skip);
                    $qb->setMaxResults($Take);
                    //return $sql = $qb->getSQL();
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

                $qb->selectAlias($qb->createFunction('COUNT(Distinct q.id)'), 'count')->from($this->getTableName(), 'q');
                $qb->leftJoin('q', 'wfam_dipendente', 'd', 'q.dipendente_id = d.id')
                    ->leftJoin('q', 'wfam_wfa', 'w', 'q.wfa_id = w.id')
                    ->leftJoin('q', 'wfam_ruolo_pratica_wfa', 'rpw', 'rpw.pratica_wfa_id = q.id');
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
                $qb->Select('q.id as Id');
                $qb->addSelect('q.data_richiesta as DataRichiesta');
                $qb->addSelect('q.data_delibera as DataDelibera');
                $qb->addSelect('q.dipendente_id as DipendenteId');
                $qb->addSelect('q.wfa_id as WfaId');
                $qb->addSelect('q.modifica_richiesta as ModificaRichiesta');
                $qb->addSelect('q.stato as Stato');
                $qb->addSelect('q.pdf as Pdf');
                $qb->addSelect('q.codifica_progressivo as CodificaProgressivo');
                $qb->addSelect('q.progressivo as Progressivo');
                $qb->addSelect('w.categoria_id as CategoriaId');
                $qb->addSelect('c.nome as NomeCategoria');
                $qb->addSelect('w.nome as NomeWfa');
                $qb->addSelect('d.nome_dipendente as NomeDipendente');
                $qb->addSelect('d.uid as Uid');
                $qb->addSelect('rpw.utente_id as UtenteId');
                $qb->addSelect('rpw.ruolo_wfa_id as RuoloId');
                $qb->addSelect('w.richiesta_personale as RichiestaPersonale');


                $qb->from($this->getTableName(), 'q')
                    ->leftJoin('q', 'wfam_dipendente', 'd', 'q.dipendente_id = d.id')
                    ->leftJoin('q', 'wfam_wfa', 'w', 'q.wfa_id = w.id')
                    ->leftJoin('q', 'wfam_ruolo_pratica_wfa', 'rpw', 'rpw.pratica_wfa_id = q.id')
                    ->leftJoin('w', 'wfam_categoria', 'c', 'w.categoria_id = c.id');

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
                $or2  = $qb->expr()->orX();
                $orFilter = $qb->expr()->orX();
                if ($filter !== null) {

                    if (isset($filter["WfaId"]) && $filter["WfaId"] > 0) {
                        $and->add("q.wfa_id = " . $filter['WfaId']);
                    }

                    if (isset($filter["Uid"])) {
                        $and->add("d.uid = '" . $filter['Uid']. "'");
                    }

                    if (isset($filter["CategoriaId"]) && $filter["CategoriaId"] > 0) {
                        $and->add("w.categoria_id = " . $filter['CategoriaId']);
                    }
                    if (isset($filter["Stato"])) {
                        $and->add("q.stato = '" . $filter['Stato'] . "'");
                    }
                    if (isset($filter["DataRichiesta"])) {
                        $and->add("q.data_richiesta = '" . $filter['DataRichiesta'] . "'");
                    }

                    if (isset($filter["UtenteId"])) {
                        $and->add("rpw.utente_id = '" . $filter['UtenteId'] . "'");
                    }

                    if (isset($filter["Dal"])) {
                        $and->add("q.data_richiesta >= '" . $filter['Dal'] . "'");
                    }

                    if (isset($filter["Al"])) {
                        $and->add("q.data_richiesta <= '" . $filter['Al'] . "'");
                    }
                    if (isset($filter["RuoloWfaId"]) && $filter["RuoloWfaId"] > 0) {
                        $and->add("rw.id = " . $filter['RuoloWfaId']);
                    }

                    if (isset($filter) && $filter["CodificaProgressivo"] !== "") {
                        $and->add("LOWER(q.codifica_progressivo) like '%" . strtolower($filter["CodificaProgressivo"]) . "%'");
                    }

                    if (isset($filter) && $filter["uid"]) {
                        $and->add("LOWER(d.uid) = '" . $filter["uid"] . "'");
                    }

                }

                
                if (isset($filter["Status"]) && $filter["Status"] !== "") {
                    if (is_array($filter["Status"])) {
                        $status = $filter["Status"];
                        foreach ($status as $stato) {
                            if (count($status) == 1)
                                $and->add("q.Stato ='" . $stato . "'");
                            else
                                $or->add("q.Stato ='" . $stato . "'");
                        }
                        if (count($or) >= 1) {
                            $and->add($or);
                            $or  = $qb->expr()->orX();
                        }
                    } else
                        $or->add("q.Stato ='" . $filter["Status"] . "'");
                }


                if (isset($search) && $search !== "") {
                    if (is_array($search)) {
                        $wfaIds = $search["WfaId"];
                        foreach ($wfaIds as $wfaId) {
                            if (count($wfaIds) == 1)
                                $and->add("q.wfa_id =" . $wfaId);
                            else
                                $or2->add("q.wfa_id =" . $wfaId);
                        }
                        if (count($or2) >= 1)
                            $and->add($or2);
                    }
                }

                if (isset($filter["RuoloWfaIdsRichieste"]) && $filter["RuoloWfaIdsRichieste"] > 0) {
                    if (is_array($filter["RuoloWfaIdsRichieste"])) {
                        $ruoloIds = $filter["RuoloWfaIdsRichieste"];
                        foreach ($ruoloIds as $ruoloId) {
                            if (count($ruoloIds) == 1)
                                $and->add("rpw.ruolo_wfa_id =" . $ruoloId);
                            else
                                $or->add("rpw.ruolo_wfa_id =" . $ruoloId);
                        }
                        // if (count($or) >= 1)
                        //     $and->add($or);
                    }
                }

                if ($filter !== null && isset($filter["UtenteId"]) && !isset($filter["RuoloWfaIdsRichieste"]) && !isset($filter["Uid"])) {
                    $subquery = "((q.id  in (SELECT praticaId FROM pratica_ruoli_view ";
                    //ruoli
                    if (isset($filter["RuoloIds"]) && $filter["RuoloIds"] > 0) {
                        if (is_array($filter["RuoloIds"])) {
                            $ruoloIds = $filter["RuoloIds"];
                            $counter = 0;
                            $count = count($ruoloIds);
                            $subquery .= "WHERE ";
                            foreach ($ruoloIds as $ruoloId) {
                                $counter += 1;
                                $subquery .= "ruoloId=" . $ruoloId;
                                if ($counter < $count)
                                    $subquery .= " OR ";
                            }
                            //ruoloWfaId
                            if (isset($filter["RuoloWfaIds"]) && $filter["RuoloWfaIds"] > 0) {
                                if (is_array($filter["RuoloWfaIds"])) {
                                    $ruoloIds = $filter["RuoloWfaIds"];
                                    $counter = 0;
                                    $count = count($ruoloIds);
                                    $subquery .= " AND (";
                                    foreach ($ruoloIds as $ruoloId) {
                                        $counter += 1;
                                        $subquery .= "ruoloWfaId=" . $ruoloId;
                                        if ($counter < $count)
                                            $subquery .= " OR ";
                                    }
                                    $subquery .= ") ";
                                }
                            }
                            $subquery .= ")) ";
                        }
                    }


                    //wfaId
                    if (isset($search) && $search !== "") {
                        if (is_array($search)) {
                            $wfaIds = $search["WfaId"];
                            $counter = 0;
                            $count = count($wfaIds);
                            $subquery .= " AND (";
                            foreach ($wfaIds as $wfaId) {
                                $counter += 1;
                                $subquery .= "(q.wfa_id=" . $wfaId . ")";
                                if ($counter < $count)
                                    $subquery .= " OR ";
                            }
                            $subquery .= ")) ";
                        }
                    }

                    if (isset($filter["Status"])) {
                        if (is_array($filter["Status"])) {
                            $status = $filter["Status"];
                            $counter = 0;
                            $count = count($status);
                            $subquery .= " AND (";
                            foreach ($status as $stato) {
                                $counter += 1;
                                $subquery .= "(q.Stato='" . $stato . "')";
                                if ($counter < $count)
                                    $subquery .= " OR ";
                            }
                            $subquery .= ") ";
                        }
                    }
                    if (isset($search) && $search !== "") {                       
                        $subquery .= " AND ";
                        $subquery .= "(LOWER(q.codifica_progressivo) like '%" . strtolower($search) . "%')";
                    }
                    $orFilter->add($subquery);
                }


                if ($and->count() > 0) {
                    $qb->where($and);
                }

                if ($or->count() > 0) {
                    $qb = ($and->count() > 0) ? $qb->andWhere($or) : $qb->where($or);
                }
                if ($orFilter->count() > 0) {
                    $qb = ($and->count() > 0) ? $qb->orWhere($orFilter) : $qb->where($orFilter);
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
