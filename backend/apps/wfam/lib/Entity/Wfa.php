<?php

namespace OCA\Wfam\Entity;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class Wfa extends Entity implements JsonSerializable
{
    //$id is automatically setted in base class   
    protected $nome;
    protected $categoriaId;
    protected $dataCreazione;
    protected $creatore;
    protected $stato;
    protected $workflow;
    protected $urlStep;
    protected $templatepdf;
    public $codificaAlfanumerica;
    public $cifreNumericheProgressivo;
    public $richiestaPersonale;
    public $disabled;
    public $icon;
    protected $countPratiche;
    //Joined Fields
    protected $nomeCategoria;

    public function __construct()
    {
        // add types in constructor
        $this->addType('id', 'integer');
        $this->addType('categoriaId', 'integer');
        $this->addType('countPratiche', 'integer');
    }

    public function jsonSerialize()
    {
        return [
            'Id' => $this->id,
            'Nome' => $this->nome,
            'CategoriaId' => $this->categoriaId,
            'DataCreazione' => $this->dataCreazione,
            'Creatore' => $this->creatore,
            'Stato' => $this->stato,
            'Workflow' => $this->workflow,
            'UrlStep' => $this->urlStep,
            'NomeCategoria' => $this->nomeCategoria,
            'Templatepdf'=>$this->templatepdf,
            'CodificaAlfanumerica'=>$this->codificaAlfanumerica,
            'CifreNumericheProgressivo'=>$this->cifreNumericheProgressivo,
            'RichiestaPersonale'=>$this->richiestaPersonale,
            'Disabled'=>$this->disabled,
            'Icon'=>$this->icon,
            'CountPratiche'=>$this->countPratiche
        ];
    }
}
