<?php

namespace OCA\Wfam\Entity;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class ValoreElementoWfa extends Entity implements JsonSerializable
{
    //$id is automatically setted in base class   
    protected $elementoWfaId;
    protected $praticaWfaId;
    protected $valore;
    protected $valoreChild;

    //joined Fields
    protected $wfaId;
    protected $elementoId;
    protected $ordine;
    protected $nomeElemento;
    protected $tipoElemento;
    protected $descrizioneElemento;

    public function __construct()
    {
        // add types in constructor
        $this->addType('id', 'integer');
        $this->addType('elementoWfaId', 'integer');
        $this->addType('praticaWfaId', 'integer');
        $this->addType('valoreChild', 'string');
    }

    public function jsonSerialize()
    {
        return [
            'Id' => $this->id,
            'ElementoWfaId' => $this->elementoWfaId,
            'PraticaWfaId' => $this->praticaWfaId,
            'Valore' => $this->valore,
            'ValoreChild' => $this->valoreChild ? $this->valoreChild : null,
            'WfaId' => $this->wfaId,
            'ElementoId' => $this->elementoId,
            'Ordine' => $this->ordine,
            'NomeElemento' => $this->nomeElemento,
            'TipoElemento' => $this->tipoElemento,
            'DescrizioneElemento' => $this->descrizioneElemento
        ];
    }
}
