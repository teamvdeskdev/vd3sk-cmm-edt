<?php
namespace OCA\Wfam\Entity;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class ElementoWfa extends Entity implements JsonSerializable {
  //$id is automatically setted in base class   
    protected $wfaId;
    protected $elementoId;
    protected $ordine;
    protected $required;
    protected $rows;
    //Joined Fields
    protected $nomeElemento;
    protected $tipoElemento;
    protected $descrizioneElemento;


    public function __construct() {
        // add types in constructor
        $this->addType('id', 'integer');
        $this->addType('wfaId', 'integer');
        $this->addType('elementoId', 'integer');
        $this->addType('ordine', 'integer');
        $this->addType('required', 'bool');
        
    }

    public function jsonSerialize() {
        return [
            'Id' => $this->id,
            'WfaId' => $this->wfaId,
            'ElementoId' => $this->elementoId,
            'Required' => $this->required,
            'Ordine' => $this->ordine,
            'Rows'=>$this->rows,
            'NomeElemento' => $this->nomeElemento,
            'TipoElemento' => $this->tipoElemento,
            'DescrizioneElemento' => $this->descrizioneElemento
        ];
    }
}
