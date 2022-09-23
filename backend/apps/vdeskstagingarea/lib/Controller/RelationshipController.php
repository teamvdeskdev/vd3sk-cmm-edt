<?php
namespace OCA\VDeskStagingArea\Controller;
use OCP\AppFramework\Http\ParsedJSONResponse;
use OCA\VDeskStagingArea\Controller\StagingController;
use OCA\VDeskStagingArea\Controller\FieldController;

class RelationshipController extends StagingController {
	public function create(string $parent, string $child, string $foreign_key): ParsedJSONResponse {
        try {
            $relationshipName = $parent."_".$child."_staging";
            //create foreign key if not exists
            $result = $this->db->query("SELECT * FROM information_schema.key_column_usage WHERE table_name = '$child' AND column_name = '$foreign_key'")->fetchAll();
            if(count($result) < 1) {
                $this->db->exec("ALTER TABLE `$child` ADD $foreign_key int(11) UNSIGNED");
            }
            $result = $this->db->exec("ALTER TABLE `$child` ADD CONSTRAINT $relationshipName FOREIGN KEY ($foreign_key) REFERENCES $parent(id) ON DELETE RESTRICT ON UPDATE CASCADE");
            return $this->successResponse("Relazione $relationshipName di $parent con il figlio $child creata con successo");
        } catch (\PDOException $e) {
            return $this->errorResponse($e->getMessage());
        }
	}

    public function delete(string $parent, string $child, string $foreign_key): ParsedJSONResponse {
        try {     
            $relationshipName = $parent."_".$child."_staging";                                 
            //return $this->successResponse("ALTER TABLE $child DROP FOREIGN KEY $foreign_key");
            $this->db->exec("ALTER TABLE `$child` DROP FOREIGN KEY $relationshipName");
            $this->db->exec("ALTER TABLE `$child` DROP COLUMN $foreign_key");
            return $this->successResponse("Relazione $relationshipName della tabella $parent con il figlio $child eliminata con successo");
        } catch (\PDOException $e) {
            return $this->errorResponse($e->getMessage());
        }
    }
 
}