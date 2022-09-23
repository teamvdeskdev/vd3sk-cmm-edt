<?php

namespace OCA\WorkflowManager\Controller;

use OCA\WorkflowManager\Entity\UserModel;
use OCA\WorkflowManager\Mapper\SapMapper;
use OCP\IRequest;
use OCP\AppFramework\Controller;
use Exception;

class SapController extends Controller
{

    private $userId;
    private $Mapper;
    private $Model;

    public function __construct($AppName, IRequest $request, SapMapper $mapper, UserModel $model)
    {
        parent::__construct($AppName, $request, $mapper, $model);
        $this->Mapper = $mapper;
        $this->Model = $model;
    }

    /**    
     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function LoadSapUsers($Model)
    {
        try {
            if ($Model != null) {
                $search = $Model["Search"];
                $order = $Model["Order"];
                $skip = $Model["Skip"];
                $take = $Model["Take"];
                $sapUsers = $this->Mapper->LoadSapUsers($skip, $take, $order, $search);
                if ($sapUsers != null) {
                    if (is_null($sapUsers->error)) {
                        foreach ($sapUsers->value as $sapUser) {
                            $dto = $this->Mapper->BuildSapUsersDto($sapUser);
                            $dto->id = 0;
                            $dto->ruoloId = 0;
                            array_push($this->Model->Dtos, $dto);
                        }
                        $this->Model->Performed = true;
                    } else {
                        $this->Model->Performed = false;
                        $this->Model->Error = $sapUsers->error;
                    }
                }
                // }
                return $this->Model;
            }
        } catch (Exception $e) {
        }
        return null;
    }
}
