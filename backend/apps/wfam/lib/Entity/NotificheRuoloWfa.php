<?php
namespace OCA\Wfam\Entity;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class NotificheRuoloWfa extends Entity implements JsonSerializable {
  //$id is automatically setted in base class   
    protected $ruoloWfaId;
    protected $ruoloInformedId;
    protected $groupsInformed;

    //Joined Fields
    protected $codiceRuoloInformed;
    protected $codificaRuoloInformed;
    protected $descrizioneRuoloInformed;
    protected $codiceRuoloWfa;
    protected $codificaRuoloWfa;
    protected $descrizioneRuoloWfa;
    protected $wfaId;
    protected $utenteId;
    public function __construct() {
        // add types in constructor
        $this->addType('id', 'integer');
        $this->addType('ruoloWfaId', 'integer');
        $this->addType('ruoloInformedId', 'integer');
    }

    public function jsonSerialize() {
        return [
            'Id' => $this->id,
            'RuoloWfaId' => $this->ruoloWfaId,
            'RuoloInformedId' => $this->ruoloInformedId,
            'CodiceRuoloInformed' => $this->codiceRuoloInformed,
            'CodificaRuoloInformed' => $this->codificaRuoloInformed,
            'DescrizioneRuoloInformed' => $this->descrizioneRuoloInformed,
            'CodiceRuoloWfa' => $this->codiceRuoloWfa,
            'CodificaRuoloWfa' => $this->codificaRuoloWfa,
            'DescrizioneRuoloWfa' => $this->descrizioneRuoloWfa,
            'WfaId' => $this->wfaId,
            'GroupsInformed' => $this->groupsInformed,
            'UtenteId' => $this->utenteId
        ];
    }
}
