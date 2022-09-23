<?php
namespace OCA\Wfam\Entity;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class Elemento extends Entity implements JsonSerializable {
  //$id is automatically setted in base class   
    protected $nome;
    protected $tipo;
    protected $descrizione;

    public function __construct() {
        // add types in constructor
        $this->addType('id', 'integer');
    }

    public function jsonSerialize() {
        return [
            'Id' => $this->id,
            'Nome' => $this->nome,
            'Tipo' => $this->tipo,
            'Descrizione' => $this->descrizione
        ];
    }
}
