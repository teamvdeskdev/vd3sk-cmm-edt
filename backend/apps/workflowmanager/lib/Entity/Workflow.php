<?php
namespace OCA\WorkflowManager\Entity;

use JsonSerializable; 

use OCP\AppFramework\Db\Entity;

class Workflow extends Entity implements JsonSerializable {
    
    protected $appId;
    protected $dateTime;    
    protected $workflowId;
    public $workflowModel;
    protected $workflowSvg;
    protected $workflowLogic;
    protected $workflowObjects;
    protected $workflowElements;
    protected $note;    
    protected $close ;
    protected $name;
    public function __construct() {
        // add types in constructor
        $this->addType('id', 'integer');
        $this->addType('close', 'string');
    }
    

    public function jsonSerialize() {
        return [
            'id' => $this->id,
            'AppId' => $this->appId,
            'DateTime' => $this->dateTime,
            'WorkflowId' => $this->workflowId,
            'WorkflowModel' => $this->workflowModel,
            'WorkflowObjects' => $this->workflowObjects,
            'WorkflowSvg' => $this->workflowSvg,
            'WorkflowLogic' => $this->workflowLogic,
            'WorkflowElements' => $this->workflowElements,
            'Note' => $this->note,
            'Close' => $this->close,
            'Name'=>$this->name
        ];
    }
}