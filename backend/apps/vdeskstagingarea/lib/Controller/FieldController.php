<?php
namespace OCA\VDeskStagingArea\Controller;
use OCP\AppFramework\Http\ParsedJSONResponse;
use OCA\VDeskStagingArea\Controller\StagingController;

class FieldController extends StagingController {
    public function create(string $tableName, string $name, string $type, string $default = "", int $length = 255, bool $nullable = false, bool $autoIncrement = false): ParsedJSONResponse {
        try {
            $null = $nullable ? "NULL" : "NOT NULL";
            $default = $default === "" ? "" : "DEFAULT '".str_replace("'", "\\'", $default)."'";
            $autoIncrement = $autoIncrement ? "AUTO_INCREMENT" : "";
            switch($type) {
                case "text":
                    $typeLogic = $type;
                    break;
                case "datetime":
                    $typeLogic = $type;
                    $default = "DEFAULT CURRENT_TIMESTAMP";
                    break;
                default:
                    $typeLogic = "$type($length)";
                    break;
            }
            //return $this->successResponse("ALTER TABLE $tableName ADD $name $typeLogic $null $default $autoIncrement");
            $result = $this->db->exec("ALTER TABLE `$tableName` ADD $name $typeLogic $null $default $autoIncrement");
            return $this->successResponse("Campo $name nella tabella $tableName creato con successo");
        } catch (\PDOException $e) {
            return $this->errorResponse($e->getMessage());
        }
    }
    public function update(string $tableName, string $oldFieldName, string $newFieldName, string $type, string $default = "", int $length = 255, bool $nullable = false, bool $autoIncrement = false): ParsedJSONResponse {
        try {
            $null = $nullable ? "NULL" : "NOT NULL";
            $default = $default === "" ? "" : "DEFAULT '".str_replace("'", "\\'",$default)."'";
            $autoIncrement = $autoIncrement ? "AUTO_INCREMENT" : "";
            switch($type) {
                case "text":
                    $typeLogic = $type;
                    break;
                case "datetime":
                    $typeLogic = $type;
                    $default = "DEFAULT CURRENT_TIMESTAMP";
                    break;
                default:
                    $typeLogic = "$type($length)";
                    break;
            }
            //return $this->successResponse("ALTER TABLE $tableName CHANGE $oldFieldName $newFieldName $typeLogic $null $default");
            $result = $this->db->exec("ALTER TABLE `$tableName` CHANGE $oldFieldName $newFieldName $typeLogic $null $default");
            return $this->successResponse("Campo $oldFieldName nella tabella $tableName modificato con successo");
        } catch (\PDOException $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function delete(string $tableName, string $name): ParsedJSONResponse {
        try {
            $result = $this->db->exec("ALTER TABLE `$tableName` DROP COLUMN $name");
            return $this->successResponse("Campo $name nella tabella $tableName eliminato con successo");
        } catch (\PDOException $e) {
            return $this->errorResponse($e->getMessage());
        }
    }
    
}