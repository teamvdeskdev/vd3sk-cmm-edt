<?php

namespace OCA\Wfam\Entity;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class RuoloWfa extends Entity implements JsonSerializable
{
    //$id is automatically setted in base class   
    protected $wfaId;
    public $utenteId;
    protected $ruoloId;
    //Joined Fields
    protected $codiceRuolo;
    protected $codificaRuolo;
    protected $descrizioneRuolo;

    public function __construct()
    {
        // add types in constructor
        $this->addType('id', 'integer');
        $this->addType('wfaId', 'integer');
        $this->addType('ruoloId', 'integer');
    }

    public function jsonSerialize()
    {
        return [
            'Id' => $this->id,
            'WfaId' => $this->wfaId,
            'UtenteId' => $this->utenteId,
            'RuoloId' => $this->ruoloId,
            'CodiceRuolo' => $this->codiceRuolo,
            'CodificaRuolo' => $this->codificaRuolo,
            'DescrizioneRuolo' => $this->descrizioneRuolo
        ];
    }
}
