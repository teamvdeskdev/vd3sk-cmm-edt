<?php

namespace OCA\Wfam\Entity;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;
//simonefase3

class PraticaGruppoRuolo extends Entity implements JsonSerializable
{
    protected $praticaWfaId;
    protected $ruoloWfaId;
    public $groupName;
    public $active;

    //Joined Fields
    public $codificaRuolo;

    public function __construct()
    {
        // add types in constructor
        $this->addType('id', 'integer');
        $this->addType('praticaWfaId', 'integer');
        $this->addType('ruoloWfaId', 'integer');
        $this->addType('groupName', 'string');
        $this->addType('active', 'boolean');
    }

    public function jsonSerialize()
    {
        return [
            'Id' => $this->id,
            'PraticaWfaId' => $this->praticaWfaId,
            'RuoloWfaId' => $this->ruoloWfaId,
            'GroupName' => $this->groupName,
            'Active' => $this->active ? $this->active : false,
            'CodificaRuolo' => $this->codificaRuolo,
        ];
    }
}
