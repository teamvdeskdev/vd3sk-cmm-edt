<?php

namespace OCA\Wfam\Entity;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class Ruolo extends Entity implements JsonSerializable
{
    //$id is automatically setted in base class   
    protected $codice;
    protected $codifica;
    protected $descrizione;

    public function __construct()
    {
        // add types in constructor
        $this->addType('id', 'integer');
    }

    public function jsonSerialize()
    {
        return [
            'Id' => $this->id,
            'Codice' => $this->codice,
            'Codifica' => $this->codifica,
            'Descrizione' => $this->descrizione
        ];
    }
}
