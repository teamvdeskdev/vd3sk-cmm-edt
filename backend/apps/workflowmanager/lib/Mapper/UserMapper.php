<?php

namespace OCA\WorkflowManager\Mapper;

use Exception;
use OCA\WorkflowManager\Entity\UserDto;
use OCP\IDbConnection;
use OCP\AppFramework\Db\QBMapper;
use \OCA\User_LDAP\Connection;
use OCP\Security\ICrypto;

class UserMapper extends QBMapper
{
    private $crypto;
    public function __construct(IDbConnection $db, ICrypto $crypto)
    {
        parent::__construct($db, '', UserDto::class);
        $this->crypto = $crypto;
    }

    public function LoadLdapSearchUsers($search, $take, $username, $password, $port)
    {
        try {
            if ((isset($search) && $search !== "") && $username !== "" && $password !== "") {
                $password = $this->crypto->decrypt($password);
                $config = new \OC\Config(\OC::$SERVERROOT.'/config/');
                $base_url = $config->getValue('domain_url');
                $path = $this->GetUrlRequest($base_url, $port) . "/ocs/v1.php/cloud/users?search=" . $search; // . "&limit=0" . "&offset=" . $take;
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $path);
                curl_setopt($ch, CURLOPT_HTTPGET, true);
                curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
                curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
                curl_setopt($ch, CURLOPT_HTTPHEADER, array('OCS-APIRequest: true'));
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

                $response = curl_exec($ch);
                curl_close($ch);
                if ($response != null) {
                    $response = \simplexml_load_string($response);
                    $status = strtoupper($response->meta->status);
                    if ($status == "OK") {
                        $data = $response->data->users;
                        return $data;
                    }
                }
            }
        } catch (Exception $e) {
        }
        return null;
    }

    public function GetUsers($username, $password, $port)
    {
        try {
            if ($username !== "" && $password !== "") {
                $password = $this->crypto->decrypt($password);
                $config = new \OC\Config(\OC::$SERVERROOT.'/config/');
                $base_url = $config->getValue('domain_url');
                $path = $this->GetUrlRequest($base_url, $port) . "/ocs/v1.php/cloud/users";
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $path);
                curl_setopt($ch, CURLOPT_HTTPGET, true);
                curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
                curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
                curl_setopt($ch, CURLOPT_HTTPHEADER, array('OCS-APIRequest: true'));
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

                $response = curl_exec($ch);
                curl_close($ch);
                if ($response != null) {
                    $response = \simplexml_load_string($response);
                    $status = strtoupper($response->meta->status);
                    if ($status == "OK") {
                        $data = $response->data->users;
                        return $data;
                    }
                }
            }
        } catch (Exception $e) {
        }
        return null;
    }

    public function GetLDAPUserByUsername($user, $username, $password, $port)
    {
        try {
            if ($username !== "" && $password !== "") {
                $password = $this->crypto->decrypt($password);
                $config = new \OC\Config(\OC::$SERVERROOT.'/config/');
                $base_url = $config->getValue('domain_url');
                $path = $this->GetUrlRequest($base_url, $port) . "/ocs/v1.php/cloud/users/" . $user . "?format=json";
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $path);
                curl_setopt($ch, CURLOPT_HTTPGET, true);
                curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
                curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
                curl_setopt($ch, CURLOPT_HTTPHEADER, array('OCS-APIRequest: true'));
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

                $response = curl_exec($ch);
                curl_close($ch);
                if ($response != null) {
                    $response = json_decode($response);
                    $status = strtoupper($response->ocs->meta->status);
                    if ($status == "OK") {
                        $data = $response->ocs->data;
                        return $data;
                    }
                }
            }
        } catch (Exception $e) {
        }
        return null;
    }

    public function BuildUsersDto($data)
    {
        try {
            if ($data != null) {
                if ($this->entityClass != null) {
                    //$dtoEntity = new $this->entityClass();
                    //$dtoEntity->nome = $data->displayname;
                    // $dtoEntity->account = $data->id;
                    // $dtoEntity->email = $data->email;
                    // $dtoEntity->groups = $data->groups;
                    $dtoEntity = array(
                        "Nome" => (string) $data->displayname,
                        "Account" => (string) $data->id,
                        "Email" => (string) $data->email,
                        "Groups" => $data->groups
                    );
                    return $dtoEntity;
                }
            }
        } catch (Exception $e) {
        }
        return null;
    }

    public function LoadGroup($username, $password, $search, $port)
    {
        try {
            if ($username !== "" && $password !== "") {
                $password = $this->crypto->decrypt($password);
                $config = new \OC\Config(\OC::$SERVERROOT.'/config/');
                $base_url = $config->getValue('domain_url');
                $path = $this->GetUrlRequest($base_url, $port) . "/ocs/v1.php/cloud/groups";
                if (!is_null($search))
                    $path .= "?search=" . $search;
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $path);
                curl_setopt($ch, CURLOPT_HTTPGET, true);
                curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
                curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
                curl_setopt($ch, CURLOPT_HTTPHEADER, array('OCS-APIRequest: true'));
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

                $response = curl_exec($ch);
                curl_close($ch);
                if ($response != null) {
                    $response = \simplexml_load_string($response);
                    $status = strtoupper($response->meta->status);
                    if ($status == "OK") {
                        $data = $response->data->groups;
                        return $data;
                    }
                }
            }
        } catch (Exception $e) {
        }
        return null;
    }

    public function GetMembersGroup($groupName, $username, $password, $port)
    {
        try {
            if (!is_null($groupName) && $groupName !== "" && $username !== "" && $password !== "") {
                $password = $this->crypto->decrypt($password);
                $config = new \OC\Config(\OC::$SERVERROOT.'/config/');
                $base_url = $config->getValue('domain_url');
                $path = $this->GetUrlRequest($base_url, $port) . "/ocs/v1.php/cloud/groups/" . $groupName;
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $path);
                curl_setopt($ch, CURLOPT_HTTPGET, true);
                curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
                curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
                curl_setopt($ch, CURLOPT_HTTPHEADER, array('OCS-APIRequest: true'));
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

                $response = curl_exec($ch);
                curl_close($ch);
                if ($response != null) {
                    $response = \simplexml_load_string($response);
                    $status = strtoupper($response->meta->status);
                    if ($status == "OK") {
                        $data = $response->data->users;
                        return $data;
                    }
                }
            }
        } catch (Exception $e) {
        }
        return null;
    }

    public function BuildGroupDto($group)
    {
        try {
            if ($group != null) {
                if ($this->entityClass != null) {
                    $dtoEntity = array("Nome" => (string) $group);

                    return $dtoEntity;
                }
            }
        } catch (Exception $e) {
        }
        return null;
    }
    public function GetWfConfig()
    {//getcwd()
        $config = new \OC\Config(\OC::$SERVERROOT . '/apps/workflowmanager/config/');
        return $config;
    }

    public function GetUrlRequest($base_url, $port)
    {
        $split = explode('/', $base_url);
        $path = "";
        for ($i = 0; $i < count($split); $i++) {
            if ($split[$i] !== "") {
                $path .= $split[$i];
                if ($i == 0) {
                    $path .= "//";
                } else if ($i == 2) {
                    if (!is_null($port) && $port !== "")
                        $path .= ":" . $port;
                    else
                        $path .= "/";
                } else {
                    if ($i < count($split) - 1)
                        $path .= "/";
                }
            }
        }
        return $path;
    }
}
