<?php
namespace OCA\VDeskStagingArea\Controller;
use OCP\AppFramework\Http\ParsedJSONResponse;
use OCA\VDeskStagingArea\Controller\StagingController;

class TableController extends StagingController {
	public function fetchTables(): ParsedJSONResponse {
        try {
            $tablesNames = $this->db->query("SELECT table_name FROM information_schema.tables WHERE table_schema='".$this->config->getSystemValue('stagingdbname')."'")->fetchAll();
            foreach($tablesNames as $tableName) {
                $tableName = $tableName['table_name'];
                if($tableName !== $this->config->getSystemValue('stagingdbtableprefix').'vdesk_saml_users') {
                    $elementsCount = $this->db->query("SELECT count(*) AS total FROM $tableName", \PDO::FETCH_ASSOC)->fetch();
                    $columns = $this->db->query("DESCRIBE $tableName", \PDO::FETCH_ASSOC)->fetchAll();
                    $tables[$tableName]["elements"] = $elementsCount["total"];
                    $tables[$tableName]["name"] = $tableName;
                    $filteredColumns = [];
                    //Columns
                    foreach ($columns as $key=>$column) {
                        $filteredColumns[$key]['tableName'] = $tableName;
                        $filteredColumns[$key]['name'] = $column['Field'];
                        $filteredColumns[$key]['primary'] = $column['Key'] === 'PRI';
                        if(strpos($column['Type'], "(") !== false) {
                            $arr = explode("(", $column['Type']);
                            $filteredColumns[$key]['type'] = $arr[0];
                            $filteredColumns[$key]['length'] = $trimmed = strstr($arr[1], ')', true);
                        } else {
                            $filteredColumns[$key]['type'] = $column['Type'];
                        }
                        $filteredColumns[$key]['nullable'] = $column['Null'] === 'YES' ? true : false;
                        $filteredColumns[$key]['default'] = $column['Default'];
                        $filteredColumns[$key]['autoIncrement'] = $column['Extra'] === 'auto_increment' ? true : false;
                    }

                    //Relationships
                    $relationships = $this->db->query("SELECT * FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA='".$this->config->getSystemValue('stagingdbname')."' AND TABLE_NAME='$tableName' AND REFERENCED_TABLE_NAME IS NOT NULL")->fetchAll();
                    $filteredRelationships = [];
                    foreach ($relationships as $key=>$relationship) {
                        $filteredRelationships[$key]['child'] = $relationship['TABLE_NAME'];
                        $filteredRelationships[$key]['name'] = $relationship['REFERENCED_TABLE_NAME'];
                        $filteredRelationships[$key]['foreign_key'] = $relationship['COLUMN_NAME'];
                    }
                    $tables[$tableName]['fields'] = $filteredColumns;
                    $tables[$tableName]['relationships']['parent'] = $filteredRelationships;
                    $tables[$tableName]['relationships']['child'] = []; 
                    $tables[$tableName]['data'] = $this->db->query("SELECT * FROM $tableName LIMIT 0, 10")->fetchAll();
                }
            }
            return $this->successResponse("Dati recuperati", $tables);
        } catch (\PDOException $e) {
            return $this->errorResponse($e->getMessage());
        }
		
	}

    public function create(string $tableName): ParsedJSONResponse {
        try {
            $result = $this->db->exec("CREATE TABLE `$tableName` (
                `id` int unsigned NOT NULL auto_increment,
                PRIMARY KEY (`id`) 
                )");
            return $this->successResponse("Tabella $tableName creata con successo");
        } catch (\PDOException $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function rename(string $oldTableName, string $newTableName): ParsedJSONResponse {
        try {
            $result = $this->db->exec("RENAME TABLE `$oldTableName` TO `$newTableName`");
            return $this->successResponse("Tabella $oldTableName rinominata in $newTableName con successo");
        } catch (\PDOException $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function delete(string $tableName): ParsedJSONResponse {
        try {
            $result = $this->db->exec("DROP TABLE `$tableName`");
            return $this->successResponse("Tabella $tableName eliminata con successo");
        } catch (\PDOException $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function fetchTableData(string $tableName, int $start = 0, int $end = 3): ParsedJSONResponse { //TODO SET END TO 10
        try {
            $data = $this->db->query("SELECT * FROM `$tableName` LIMIT $start, $end")->fetchAll();
            return $this->successResponse("Dati recuperati", $data);
        } catch (\PDOException $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

}