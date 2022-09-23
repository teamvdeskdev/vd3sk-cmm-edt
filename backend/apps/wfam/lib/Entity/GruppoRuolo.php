<?php

namespace OCA\Wfam\Entity;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class GruppoRuolo extends Entity implements JsonSerializable
{
    protected $ruoloWfaId;
    public $groupName;
    // //Joined Fields
    //protected $codiceRuolo;
    protected $codificaRuolo;
    // protected $descrizioneRuolo;

    protected $wfaId;
    public $utenteId;
    protected $ruoloId;

    public function __construct()
    {
        // add types in constructor
        $this->addType('id', 'integer');
        $this->addType('ruoloWfaId', 'integer');
        $this->addType('wfaId', 'integer');
        $this->addType('ruoloId', 'integer');
    }

    public function jsonSerialize()
    {
        return [
            'Id' => $this->id,
            'RuoloWfaId' => $this->ruoloWfaId,
            'GroupName' => $this->groupName,
            'WfaId' => $this->wfaId,
            'UtenteId' => $this->utenteId,
            //'CodiceRuolo' => $this->codiceRuolo,
            'CodificaRuolo' => $this->codificaRuolo,
            'RuoloId' => $this->ruoloId,
            // 'DescrizioneRuolo' => $this->descrizioneRuolo
        ];
    }
}
