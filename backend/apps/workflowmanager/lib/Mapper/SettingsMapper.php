<?php

namespace OCA\WorkflowManager\Mapper;

use OCA\WorkflowManager\Mapper\UserMapper;
use Exception;
use OCP\AppFramework\Db\QBMapper;
use OCP\IDBConnection;
use OCP\Security\ICrypto;

class SettingsMapper extends QBMapper
{
    private $mapperUser;
    private $crypto;
    public function __construct(IDBConnection $db, UserMapper $mapperUser, ICrypto $crypto)
    {
        parent::__construct($db, '');
        $this->mapperUser = $mapperUser;
        $this->crypto = $crypto;
    }

    public function Load($dto)
    {
        try {
            $config = $this->mapperUser->GetWfConfig();
            if (!is_null($config) && !is_null($dto)) {
                $properties = $this->GetProperties($dto);
                if (!is_null($properties)) {
                    foreach ($properties as $property) {
                        $dto[$property] = $config->getValue($property);
                    }
                    $response["Performed"] = true;
                } else {
                    $response["Performed"] = false;
                }
            }
        } catch (Exception $ex) {
            $response["Message"] = $ex->getMessage();
            $response["Performed"] = false;
        } finally {

            $response["Dto"] = $dto;
            return $response;
        }
    }

    public function Save($dto)
    {
        try {
            $config = $this->mapperUser->GetWfConfig();
            if (!is_null($config) && !is_null($dto)) {
                $properties = $this->GetProperties($dto);
                if (!is_null($properties)) {
                    foreach ($properties as $property) {
                        if (strpos($property, 'password') !== false) {
                            $currentValue = $config->getValue($property);
                            if (strcmp($currentValue, $dto[$property]) !== 0 && $dto[$property]!=="") {
                                $value = $this->crypto->encrypt($dto[$property]);
                                $config->setValue($property, $value);
                                $dto[$property] = $value;
                            } else {
                                $config->setValue($property, $dto[$property]);
                                $dto[$property] = $value;
                            }
                        } else {
                            $config->setValue($property, $dto[$property]);
                        }
                    }
                    $response["Performed"] = true;
                } else {
                    $response["Performed"] = false;
                }
            }
        } catch (Exception $ex) {
            $response["Message"] = $ex->getMessage();
            $response["Performed"] = false;
        } finally {

            $response["Dto"] = $dto;
            return $response;
        }
    }

    private function GetProperties($dto)
    {
        $properties = [];
        if ($dto) {
            $obj = get_object_vars(json_decode(json_encode($dto)));
            if ($obj) {
                foreach ($obj as $property => $value) {
                    if ($property != "Id") {
                        array_push($properties, $property);
                    }
                }
            }
        }
        return $properties;
    }
}
