<?php

namespace OCA\Wfam\Entity;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class PraticaWfa extends Entity implements JsonSerializable
{
    //$id is automatically setted in base class 
    public $dataRichiesta;
    public $dataDelibera;
    public $dipendenteId;
    public $wfaId;
    public $modificaRichiesta;
    public $stato;
    public $pdf;
    public $codificaProgressivo;
    public $progressivo;
    protected $nomeCategoria;
    // //joined Fields
    public $nomeDipendente;
    // protected $inquadramentoDipendente;
    // protected $uODipendente;
    // protected $sedeDipendente;
    // protected $mansioneDipendente;
    // protected $contrattoDipendente;
    public $nomeWfa;
    protected $utenteId;
    protected $richiestaPersonale;
    //Filtri
    protected $categoriaId;
    protected $ruoloId;

    public $codificaRuolo;
    public $codiceRuolo;
    public $groups;
    public $authorized;
    public $nomeUtente;
    public $statoRuolo;
    public $uid;

    public function __construct()
    {
        // add types in constructor
        $this->addType('id', 'integer');
        $this->addType('dipendenteId', 'integer');
        $this->addType('wfaId', 'integer');
        $this->addType('categoriaId', 'integer');
        $this->addType('ruoloId', 'integer');
        $this->addType('progressivo', 'integer');
        $this->addType('richiestaPersonale', 'integer');
        $this->addType('uid', 'string');
    }

    public function jsonSerialize()
    {
        return [
            'Id' => $this->id,
            'DataRichiesta' => $this->dataRichiesta,
            'DataDelibera' => $this->dataDelibera,
            'DipendenteId' => $this->dipendenteId,
            'WfaId' => $this->wfaId,
            'ModificaRichiesta' => $this->modificaRichiesta,
            'Stato' => $this->stato,
            'Pdf' => $this->pdf,
            'NomeDipendente' => $this->nomeDipendente,
            'CodificaProgressivo' => $this->codificaProgressivo,
            'Progressivo' => $this->progressivo,
            // 'InquadramentoDipendente' => $this->inquadramentoDipendente,
            // 'UODipendente' => $this->uODipendente,
            // 'SedeDipendente' => $this->sedeDipendente,
            // 'MansioneDipendente' => $this->mansioneDipendente,
            // 'ContrattoDipendente' => $this->contrattoDipendente,
            'CategoriaId' => $this->categoriaId,
            'NomeWfa' => $this->nomeWfa,
            'UtenteId' => $this->utenteId,
            'RuoloId' => $this->ruoloId,
            'CodificaRuolo' => $this->codificaRuolo,
            'CodiceRuolo' => $this->codiceRuolo,
            'Groups' => $this->groups,
            'Authorized' => $this->authorized,
            'NomeCategoria' => $this->nomeCategoria,
            'RichiestaPersonale' => $this->richiestaPersonale,
            'NomeUtente' => $this->nomeUtente,
            'StatoRuolo' => $this->statoRuolo,
            'Uid' => $this->uid
        ];
    }
}
