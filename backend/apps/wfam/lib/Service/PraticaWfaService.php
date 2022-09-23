<?php

namespace OCA\Wfam\Service;

use Exception;

use OCA\Wfam\Entity\PraticaWfa;
use OCA\Wfam\Mapper\PraticaWfaMapper;
use OCA\Wfam\Mapper\WfaMapper;
use OCA\WorkflowManager\Mapper\UserMapper;
use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;
use OCP\Security\ICrypto;


class PraticaWfaService
{

    private $mapper;
    private $mapperWfa;
    private $mapperUser;
    private $crypto;

    public function __construct(
        PraticaWfaMapper $mapper,
        WfaMapper $mapperWfa,
        UserMapper $mapperUser,
        ICrypto $crypto
    ) {
        $this->mapper = $mapper;
        $this->mapperWfa = $mapperWfa;
        $this->mapperUser = $mapperUser;
        $this->crypto = $crypto;
    }

    public function GetProperties($dto)
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

    public function Create($dto)
    {
        try {
            if (!is_null($dto)) {
                $entity = new PraticaWfa();

                if ($entity) {
                    //Leggo l'ultimo progressivo e genero il prossimo dalla codifica specificata nel wfa
                    //Se configurato il servizio per ottenere il progressivo lo chiamo
                    $dto = $this->GetProgressivo($dto);
                    if (!is_null($dto["Progressivo"])) {
                        $properties = $this->GetProperties($dto);
                        foreach ($properties as $property) {
                            $value = $dto[$property];
                            $entity->__call('set' . $property, [$value]);
                        }

                        if (!is_null($entity->progressivo) && $dto = $this->mapper->insert($entity)) {
                            $response["Performed"] = true;
                            $response["Dto"] = $dto;
                            return $response;
                        }
                    } else {
                        $response["Message"] = "Errore nel salvataggio della pratica. Non è stato possibile generare il progressivo";
                    }
                }
                $response["Performed"] = false;
                $response["Dto"] = [];
                return $response;
            }
        } catch (Exception $e) {
            return $e;
        }
    }

    public function Update($dto)
    {
        try {
            if (!is_null($dto)) {
                $entity = $this->mapper->find((int) $dto['Id']);

                if ($entity) {
                    $properties = $this->GetProperties($dto);

                    foreach ($properties as $property) {
                        $value = $dto[$property];
                        $entity->__call('set' . $property, [$value]);
                    }
                    if ($dto = $this->mapper->update($entity)) {
                        $response["Performed"] = true;
                        $response["Dto"] = $dto;
                        return $response;
                    }
                }
                $response["Performed"] = false;
                $response["Dto"] = [];
                return $response;
            }
        } catch (Exception $e) {
            return $e;
        }
    }

    public function Delete($dto)
    {

        try {
            if (!is_null($dto)) {
                $entity = $this->mapper->find((int) $dto['Id']);

                if ($entity) {
                    $performed = !is_null($this->mapper->delete($entity));
                    return $performed;
                }
            }
        } catch (Exception $e) {
            return $e;
        }
        return false;
    }

    public function Find($filter)
    {
        try {
            $dto = $this->mapper->find((int) $filter['Id']); //todo: $entity-->$dto
            $response["Performed"] = true;
            $response["Dto"] = $dto;
            return $response;
        } catch (DoesNotExistException $e) {
            $response["Performed"] = true;
            $response["Dto"] = null;
        } catch (MultipleObjectsReturnedException $e) {
            $response["Performed"] = true;
            $response["Exception"] = $e->getMessage();
        } catch (Exception $e) {
            $response["Exception"] = $e->getMessage();
        }
        return $response;
    }

    public function FindAll($filter, $search, $order)
    {

        try {
            $entities = $this->mapper->FindAll($filter, $search, $order);
            $response["Performed"] = true;
            $response["Dtos"] = $this->FilterDuplicate($entities);
            $count = $this->mapper->Count($filter, $search);
            $response["Count"] = $count;
            return $response;
        } catch (Exception $e) {
            $response["Exception"] = $e->getMessage();
        }
        return $response;
    }

    public function Load($skip, $take, $filter, $search, $order)
    {

        try {
            $entities = $this->mapper->Load($skip, $take, $filter, $search, $order);
            $response["Performed"] = true;
            $response["Dtos"] = $this->FilterDuplicate($entities);
            $response["Skip"] = $skip;
            $response["Take"] = $take;
            $count = $this->mapper->Count($filter, $search);
            $response["Count"] = $count;
            return $response;
        } catch (Exception $e) {
            $response["Exception"] = $e->getMessage();
        }
        return $response;
    }

    public function Count($filter = null, $search = null)
    {

        try {
            $count = $this->mapper->Count($filter, $search);
            $response["Performed"] = true;
            $response["Count"] = $count;
            return $response;
        } catch (Exception $e) {
            $response["Exception"] = $e->getMessage();
        }
        return $response;
    }

    private function GetProgressivo($dto)
    {
        $config = $this->mapperUser->GetWfConfig();
        if (!is_null($config)) {
            $dtoWfa = $this->ReadWfa($dto["WfaId"]);
            $serviceUrl = $config->getValue("progressive_service_url");
            if ($serviceUrl !== "") {
                $username = $config->getValue("progressive_service_username");
                $password = $config->getValue("progressive_service_password");
                $auth = $config->getValue("progressive_service_authentication");
                if ($password !== "")
                    $password = $this->crypto->decrypt($password);
                $progressivoPratica = $this->CallProgressivoService($serviceUrl, $username, $password, $auth);
                $dto = $this->BuildProgressiveCode($dtoWfa, $dto, $progressivoPratica);
            } else {
                $filter["WfaId"] = $dtoWfa->id;
                $order["Name"] = "Progressivo";
                $order["Direction"] = "desc";
                $praticaWfa = $this->mapper->Load(0, 1, $filter, null, $order);
                $progressivoPratica = 1;
                if (!is_null($praticaWfa))
                    if (!is_null($praticaWfa[0]->progressivo))
                        $progressivoPratica = $praticaWfa[0]->progressivo + 1;
                $dto = $this->BuildProgressiveCode($dtoWfa, $dto, $progressivoPratica);
            }
            return $dto;
        }
        return null;
    }

    private function ReadWfa($wfaId)
    {
        try {
            $response = $this->mapperWfa->Find($wfaId);
            return $response;
        } catch (Exception $e) {
            $response["Exception"] = $e->getMessage();
        }
        return $response;
    }

    private function BuildProgressiveCode($dtoWfa, $dto, $progressivoPratica)
    {
        try {
            if (!is_null($dtoWfa) && !is_null($progressivoPratica)) {
                $codificaAlfanumerica = $dtoWfa->codificaAlfanumerica;
                $cifreNumericheProgressivo = $dtoWfa->cifreNumericheProgressivo;
                $progressivo = str_pad($progressivoPratica, $cifreNumericheProgressivo, '0', STR_PAD_LEFT);
                $codificaProgressivo = $codificaAlfanumerica . $progressivo;
                $dto["Progressivo"] = $progressivoPratica;
                $dto["CodificaProgressivo"] = $codificaProgressivo;
            }
        } catch (Exception $e) {
            $response["Exception"] = $e->getMessage();
        }
        return $dto;
    }

    private function CallProgressivoService($serviceUrl, $username, $password, $auth)
    {
        try {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $serviceUrl);
            curl_setopt($ch, CURLOPT_HTTPGET, true);
            if ($auth != null) {
                if ($password !== "")
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
        } catch (\Exception $ex) {
        }
        return null;
    }

    private function FilterDuplicate($pratiche)
    {
        $praticheWfa = [];
        foreach ($pratiche as  $pratica) {
            $exist = array_search($pratica->id, array_column($praticheWfa, 'id'));
            if ($exist === false)
                array_push($praticheWfa, $pratica);
        }
        return $praticheWfa;
    }

    public function CreateFoldersTree($nomeBeneficiario, $codificaProgressivo, $path)
    {
        $dir = $path . $nomeBeneficiario . "_" . $codificaProgressivo;
        $userFolder = \OC::$server->getUserFolder();
        if (!$userFolder->nodeExists($dir)) {
            $userFolder->newFolder($dir);
        }

        // if (!is_null($dir)) {
        //     if (!is_dir($dir)) {
        //         $folders = explode("/", $dir);
        //         $currentPath = "";
        //         foreach ($folders as $folder) {
        //             if (!empty($folder)) {
        //                 $currentPath .= "/$folder";
        //                 if (!is_dir($currentPath))
        //                     $performed = mkdir($currentPath);
        //             }
        //         }
        //     }
        //}
    }

    public function GetUser($user)
    {
        try {
            if (!is_null($user)) {
                $config = $this->mapperUser->GetWFConfig();
                if ($config != null) {
                    $username = $config->getValue('username');
                    $password = $config->getValue('password');
                    $port = $config->getValue('server_port');
                    $userLDAP = $this->mapperUser->GetLDAPUserByUsername($user, $username, $password, $port);
                    $dto = $this->mapperUser->BuildUsersDto($userLDAP);                    
                    return $dto;
                }
            }
        } catch (\Exception $ex) {
        }
        return null;
    }

    
}
