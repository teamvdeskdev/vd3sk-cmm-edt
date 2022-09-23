<?php

namespace OCA\WorkflowManager\Mapper;

use Exception;
use OCA\WorkflowManager\Entity\UserDto;
use OCP\IDbConnection;
use OCP\AppFramework\Db\QBMapper;
use OCP\Security\ICrypto;
class SapMapper extends QBMapper
{
    protected $Host;
    private $crypto;
    public function __construct(IDbConnection $db, ICrypto $crypto)
    {
        parent::__construct($db, '', UserDto::class);
        $this->Host =  \OC::$server->getRequest()->getServerHost();
        $this->crypto = $crypto;
    }

    public function LoadSapUsers($skip, $take, $order, $search)
    {
        try {
            $config = $this->GetWFConfig();
            if ($config != null) {
                $enableSap = $config->getValue('enable_sap');
                if (!is_null($enableSap) && !empty($enableSap) && $enableSap) {
                    $url = $config->getValue('sap_service_url');
                    if (!is_null($url) && !empty($url)) {
                        $url = $url . "?" . '$format=json&$top=' . $take .
                            '&$skip=' . $skip . '&$select=FirstName,LastName,Emails,UserName';
                        if (isset($search)) {
                            $search = strtolower($search);
                            $filter = '$filter';
                            $url .= "&$filter=contains(tolower(FirstName),'$search')";
                            $url .= "%20or%20contains(tolower(LastName),'$search')";
                            $url .= "%20or%20contains(tolower(UserName),'$search')";
                        }
                        if (!is_null($order) && !is_null($order["Name"])) {
                            $direction = (is_null($order["Direction"]) ? "asc" : $order["Direction"]);
                            $url .= '&$orderby=' . $order["Name"] . '%20' . $direction;
                        }
                        $ch = curl_init();
                        curl_setopt($ch, CURLOPT_URL, $url);
                        curl_setopt($ch, CURLOPT_HTTPGET, true);
                        $auth = $this->GetTypeAuthorization($config);
                        if ($auth != null ) {
                            $username = $config->getValue('sap_username');
                            $password = $config->getValue('sap_password');
                            if($password!=="")
                                $password = $this->crypto->decrypt($password);
                            curl_setopt($ch, CURLOPT_HTTPAUTH, $auth);
                            if ($auth != CURLAUTH_NONE)
                                curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
                        }
                        curl_setopt($ch, CURLOPT_HTTPHEADER, array('OCS-APIRequest: true'));
                        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
                        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

                        $response = curl_exec($ch);
                        curl_close($ch);
                        if (!is_null($response)) {
                            $json = json_decode($response);
                            return $json;
                        }
                    }
                }               
            }
            //$xml=simplexml_load_string($response);
        } catch (Exception $ex) {
            return null;
        }
        return null;
    }

    public function BuildSapUsersDto($sapUser)
    {
        try {
            if ($sapUser != null) {
                if ($this->entityClass != null) {
                    $dtoEntity = new $this->entityClass();
                    $dtoEntity->nome = $sapUser->FirstName . " " . $sapUser->LastName;
                    $dtoEntity->account = $sapUser->UserName;
                    $dtoEntity->email = $sapUser->Emails;
                    //$dtoEntity->groups = $sapUser->Groups;
                    return $dtoEntity;
                }
            }
        } catch (Exception $e) {
        }
        return null;
    }

    private function GetTypeAuthorization($config)
    {
        try {
            if (!is_null($config)) {
                $authentication = $config->getValue('sap_authentication');
                if ($authentication == "BASIC")
                    return CURLAUTH_BASIC;
                else if ($authentication == "BEARER")
                    return CURLAUTH_BEARER;
                return CURLAUTH_NONE;
            }
        } catch (Exception $e) {
        }
        return null;
    }
    public function GetWfConfig()
    {
        $config = new \OC\Config(getcwd() . '/apps/workflowmanager/config/');
        return $config;
    }
}
