<?php
namespace OCA\VDeskStagingArea\Controller;
use OCP\AppFramework\Http\ParsedJSONResponse;
use OCA\VDeskStagingArea\Controller\StagingController;

class DropdownDBController extends StagingController {
	public function fetchTablesNames(): ParsedJSONResponse {
        try {
            $tablesNames = $this->db->query("SELECT table_name FROM information_schema.tables WHERE table_schema='".$this->config->getSystemValue('stagingdbname')."'")->fetchAll();
            $finalData = [];
            foreach($tablesNames as $key => $tableName) {
                $tableName = $tableName['table_name'];
                if($tableName !== $this->config->getSystemValue('stagingdbtableprefix').'vdesk_saml_users') {
                    $childrenList = $this->db->query("SELECT TABLE_NAME as name FROM information_schema.KEY_COLUMN_USAGE WHERE table_schema='".$this->config->getSystemValue('stagingdbname')."' AND referenced_table_name = '$tableName'")->fetchAll();

                    $finalData[$key]['name'] = $tableName;
                    $finalData[$key]['rows'] = $this->getRowsNames($tableName);

    
                    if($childrenList && sizeOf($childrenList) > 0)
                        $finalData[$key]['children'] = $childrenList;
                        foreach($childrenList as $i => $childName) {
                            $finalData[$key]['children'][$i]['rows'] = $this->getRowsNames($finalData[$key]['children'][$i]['name']);
                        }
                }
            }
            return $this->successResponse("Dati tendina recuperati", $finalData);
        } catch (\PDOException $e) {
            return $this->errorResponse($e->getMessage());
        }
	}

    public function fetchTablesFinalData(string $name, string $key, string $value, array $child = [], bool $preview = false): ParsedJSONResponse {
        $finalData = [];
        $finalData["name"] = $name;
        $finalData["items"] = $this->getDropdownDBFinalItem($name, $key, $value, $preview);
        if($child) {
            $finalData["child"]["name"] = $child["name"];
            $finalData["child"]["items"] = $this->getDropdownDBFinalItem($child["name"], $child["key"], $child["value"], $preview, $name);
        }
        return $this->successResponse("test", $finalData);
    }

    public function getRowsNames($tableName): Array {
        $rows = [];
        $columns = $this->db->query("DESCRIBE $tableName")->fetchAll();
        foreach($columns as $column)
            array_push($rows, $column['Field']);
        return $rows;
    }

    public function getDropdownDBFinalItem(string $tableName, string $key, string $value, bool $preview, string $parentTableName = ""): Array {
        $limit = "";
        $paramsToFetch = "id AS 'id', $key AS 'key', $value AS 'value'";

        if($parentTableName !== "")
            $paramsToFetch .= ", $parentTableName"."_id AS 'foreign_key'";

        if($preview)
            $limit = "LIMIT 25";

        return $this->db->query("SELECT $paramsToFetch FROM $tableName $limit")->fetchAll();
    }
 
}