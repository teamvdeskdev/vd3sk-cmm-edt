<?php
namespace OCA\WorkflowManager\Entity;

use JsonSerializable;
use OCP\AppFramework\Db\Entity;
use OCA\WorkflowManager\Entity\BaseModel;

class UserModel extends BaseModel
{ }


class UserEntity extends Entity
{    
    public $nome;
    public $cognome;
    public $email;
    public $account;
    public $groups;
    public function __construct()
    {
        $this->addType('id', 'integer');
    }
}

class UserDto extends UserEntity implements JsonSerializable
{
    public function __construct()
    {
        parent::__construct();
    }

    public function jsonSerialize()
    {
        return [
            'Id' => $this->id,           
            'Nome' => $this->nome,
            'Cognome' => $this->cognome,
            'Email' => $this->email,
            'Account' => $this->account,
            'Groups' =>$this->groups,
        ];
    }
}
