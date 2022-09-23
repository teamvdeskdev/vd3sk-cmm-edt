<?php
namespace OCA\WorkflowManager\Entity;

use JsonSerializable; 

use OCP\AppFramework\Db\Entity;

class WorkflowEngineEntity extends Entity implements JsonSerializable {
    
    protected $workflowDataId;
    public $ownerId;
    public $workflowModel;
    //join
    public $appId;
    public $workflowId;

    public function jsonSerialize() {
        return [
            'Id' => $this->id,
            'WorkflowDataId' => $this->workflowDataId,
            'OwnerId' => $this->ownerId,
            'WorkflowModel' => $this->workflowModel,
            'AppId' => $this->appId,
            'WorkflowId' => $this->workflowId
        ];
    }
}