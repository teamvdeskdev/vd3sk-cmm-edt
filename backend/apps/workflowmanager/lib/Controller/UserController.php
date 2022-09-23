<?php

namespace OCA\WorkflowManager\Controller;

use OCA\WorkflowManager\Entity\UserModel;
use OCA\WorkflowManager\Mapper\UserMapper;
use OCP\IRequest;
use OCP\AppFramework\Controller;
use Exception;
use OCP\Files\Folder as FilesFolder;

class UserController extends Controller
{
    private $userId;
    private $Mapper;
    private $Model;
    private $Folder;

    public function __construct($AppName, IRequest $request, UserMapper $mapper, FilesFolder $folder, UserModel $model)
    {
        parent::__construct($AppName, $request, $mapper, $model);
        $this->Mapper = $mapper;
        $this->Model = $model;
        $this->Folder = $folder;
    }

    /**    
     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function LoadLdapSearchUsers($Model)
    {
        try {
            if ($Model != null) {
                $search = $Model["Search"];
                $take = $Model["Take"];
                $config = $this->Mapper->GetWFConfig();
                if ($config != null) {
                    $username = $config->getValue('username');
                    $password = $config->getValue('password');
                    $port=$config->getValue('server_port');
                    $ldapUsers = $this->Mapper->LoadLdapSearchUsers($search, $take, $username, $password,$port);
                    if ($ldapUsers != null) {
                        foreach ($ldapUsers->element as $ldapUser) {
                            $userLDAP = $this->Mapper->GetLDAPUserByUsername($ldapUser, $username, $password,$port);
                            $dto = $this->Mapper->BuildUsersDto($userLDAP);
                            $dto["Id"] = 0;
                            $dto["RuoloId"] = 0;
                            array_push($this->Model->Dtos, $dto);
                        }
                    }
                }
                $this->Model->Performed = true;
                return $this->Model;
            }
        } catch (Exception $e) {
        }
        return null;
    }

    /**    
     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function GetUsers($Model)
    {
        try {
            if ($Model != null) {

                $config = $this->Mapper->GetWFConfig();
                if ($config != null) {
                    $username = $config->getValue('username');
                    $password = $config->getValue('password');
                    $port=$config->getValue('server_port');
                    $ldapUsers = $this->Mapper->GetUsers($username, $password,$port);
                    if ($ldapUsers != null) {
                        foreach ($ldapUsers->element as $ldapUser) {
                            $userLDAP = $this->Mapper->GetLDAPUserByUsername($ldapUser, $username, $password,$port);
                            $dto = $this->Mapper->BuildUsersDto($userLDAP);
                            $dto["Id"] = 0;
                            $dto["RuoloId"] = 0;
                            array_push($this->Model->Dtos, $dto);
                        }
                    }
                }
                $this->Model->Performed = true;
                return $this->Model;
            }
        } catch (Exception $e) {
        }
        return null;
    }

    /**    
     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function GetCurrentUser($Model)
    {
        try {
            if ($Model != null && !is_null($Model["Dto"]["Id"])) {
                $config = $this->Mapper->GetWFConfig();
                if ($config != null) {
                    $username = $config->getValue('username');
                    $password = $config->getValue('password');
                    $port=$config->getValue('server_port');
                    $ldapUser = $Model["Dto"]["Id"];
                    if ($ldapUser != null) {
                        $userLDAP = $this->Mapper->GetLDAPUserByUsername($ldapUser, $username, $password,$port);
                        $dto = $this->Mapper->BuildUsersDto($userLDAP);
                        $dto["Id"] = 0;
                        $dto["RuoloId"] = 0;
                        $this->Model->Dto = $dto;
                    }
                }
                $this->Model->Performed = true;
                return $this->Model;
            }
        } catch (Exception $e) {
        }
        return null;
    }

    /**    
     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function LoadGroup($Model)
    {
        try {
            if ($Model != null) {
                $config = $this->Mapper->GetWFConfig();
                if ($config != null) {
                    $username = $config->getValue('username');
                    $password = $config->getValue('password');
                    $port=$config->getValue('server_port');
                    $dtos = $this->Mapper->LoadGroup($username, $password, $Model["Search"],$port);
                    if (!is_null($dtos)) {
                        foreach ($dtos->element as $group) {
                            $dto = $this->Mapper->BuildGroupDto($group);
                            if (!is_null($dto))
                                array_push($this->Model->Dtos, $dto);
                        }
                    }
                }
            }
            $this->Model->Performed = true;
            return $this->Model;
        } catch (Exception $e) {
        }
        return null;
    }

    /**    
     * @NoCSRFRequired
     * @NoAdminRequired
     *
     */
    public function GetMailNotification($Model)
    {
        try {
            if ($Model != null) {
                $usersId = $Model["UsersId"];
                $groupsName = $Model["GroupsName"];
                $config = $this->Mapper->GetWFConfig();
                if ($config != null) {
                    $username = $config->getValue('username');
                    $password = $config->getValue('password');
                    $port=$config->getValue('server_port');
                    if ($usersId != null) {
                        foreach ($usersId as $userId) {
                            $userLDAP = $this->Mapper->GetLDAPUserByUsername($userId, $username, $password,$port);
                            $dto = $this->Mapper->BuildUsersDto($userLDAP);
                            array_push($this->Model->Dtos, $dto);
                        }
                    }
                    if ($groupsName != null) {
                        foreach ($groupsName as $groupName) {
                            $members = $this->Mapper->GetMembersGroup($groupName, $username, $password,$port);
                            if ($members != null) {
                                foreach ($members->element as $userId) {
                                    $userLDAP = $this->Mapper->GetLDAPUserByUsername($userId, $username, $password,$port);
                                    $dto = $this->Mapper->BuildUsersDto($userLDAP);
                                    array_push($this->Model->Dtos, $dto);
                                }
                            }
                        }
                    }
                }
                $this->Model->Performed = true;
                return $this->Model;
            }
        } catch (Exception $e) {
        }
        return null;
    }
}
