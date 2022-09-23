<?php

namespace OCA\Wfam\Entity;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class RuoloPraticaWfa extends Entity implements JsonSerializable
{
    //$id is automatically setted in base class   
    public $ruoloWfaId;
    protected $praticaWfaId;
    public $stato;
    public $nomeUtente;
    public $groups;
    //joined Fields
    public $utenteId;
    public $codiceRuolo;
    protected $codificaRuolo;
    protected $descrizioneRuolo;
    protected $codiceRuoloWfaId;

    public function __construct()
    {
        // add types in constructor
        $this->addType('id', 'integer');
        $this->addType('ruoloWfaId', 'integer');
        $this->addType('codiceRuoloWfaId', 'integer');
 }

    public function jsonSerialize()
    {
        return [
            'Id' => $this->id,
            'RuoloWfaId' => $this->ruoloWfaId,
            'Stato' => $this->stato,
            'UtenteId' => $this->utenteId,
            'PraticaWfaId'=>$this->praticaWfaId,
            'CodiceRuoloWfaId'=>$this->codiceRuoloWfaId,
            'CodiceRuolo' => $this->codiceRuolo,
            'CodificaRuolo' => $this->codificaRuolo,
            'DescrizioneRuolo' => $this->descrizioneRuolo,
            'NomeUtente'=>$this->nomeUtente,
            'Groups'=>$this->groups
        ];
    }
}
