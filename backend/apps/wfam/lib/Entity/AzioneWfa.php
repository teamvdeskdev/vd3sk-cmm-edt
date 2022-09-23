<?php
namespace OCA\Wfam\Entity;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class AzioneWfa extends Entity implements JsonSerializable {
  //$id is automatically setted in base class   
    protected $wfaId;
    protected $azioneId;
    protected $tipo;

    //Joined Fields
    protected $nomeAzione;
    protected $tipoAzione;
    protected $descrizioneAzione;


    public function __construct() {
        // add types in constructor
        $this->addType('id', 'integer');
        $this->addType('azioneId', 'integer');
        $this->addType('wfaId', 'integer');
    }

    public function jsonSerialize() {
        return [
            'Id' => $this->id,
            'WfaId' => $this->wfaId,
            'AzioneId' => $this->azioneId,
            'Tipo' => $this->tipo,
            'NomeAzione' => $this->nomeAzione,
            'TipoAzione' => $this->tipoAzione,
            'DescrizioneAzione' => $this->descrizioneAzione
        ];
    }
}
