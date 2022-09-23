<?php
namespace OCA\WorkflowManager\Entity;

use JsonSerializable; 

use OCP\AppFramework\Db\Entity;

class WorkflowModel extends Entity implements JsonSerializable {
    
    protected $appId;
    protected $modelId;
    protected $model;
    protected $modelElements;
    protected $modelName;
    protected $modelDescription;   
    

    public function jsonSerialize() {
        return [
            'Id' => $this->id,
            'AppId' => $this->appId,
            'ModelId' => $this->modelId,
            'WorkflowModel' => $this->model,
            'ModelElements' => $this->modelElements,
            'ModelName' => $this->modelName,
            'ModelDescription' => $this->modelDescription                                                            
        ];
    }
}