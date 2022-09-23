<?php
namespace OCA\WorkflowManager\Entity;

use JsonSerializable; 

use OCP\AppFramework\Db\Entity;

class WorkflowLogs extends Entity implements JsonSerializable {
    
    protected $appId;
    protected $workflowId;
    protected $logDate;
    protected $logText;
    protected $userId;
    protected $nodeId;

    public function __construct() {
        $this->addType('id', 'integer');
    }
    
    public function jsonSerialize() {
        return [
            'Id' => $this->id,
            'WorkflowId' => $this->workflowId,            
            'AppId' => $this->appId,
            'NodeId' => $this->nodeId,
            'LogDate' => $this->logDate,
            'LogText' => $this->logText,
            'UserId' => $this->userId
        ];
    }
}