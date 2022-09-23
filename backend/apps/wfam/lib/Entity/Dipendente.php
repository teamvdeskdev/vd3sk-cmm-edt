<?php
namespace OCA\Wfam\Entity;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class Dipendente extends Entity implements JsonSerializable {
  //$id is automatically setted in base class   
    protected $nomeDipendente;
    protected $inquadramento;
    protected $uo;
    protected $sede;
    protected $mansione;
    protected $contratto;
    protected $uid;

    public function __construct() {
        // add types in constructor
        $this->addType('id', 'integer');
        $this->addType('uid', 'string');
    }

    public function jsonSerialize() {
        return [
            'Id' => $this->id,
            'NomeDipendente' => $this->nomeDipendente,
            'Inquadramento' => $this->inquadramento,
            'UO' => $this->uo,
            'Sede' => $this->sede,
            'Mansione' => $this->mansione,
            'Contratto' => $this->contratto,
            'Uid' => $this->uid
        ];
    }
}
