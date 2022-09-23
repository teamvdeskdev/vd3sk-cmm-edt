<?php
namespace OCA\VDeskStagingArea\Controller;
use OCP\AppFramework\Http\ParsedJSONResponse;

use OCA\VDeskStagingArea\Controller\StagingController;

class GroupsManagerController extends StagingController {

    //------------------------------------------------------- Endpoints --------------------------------------------------------------//

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
    */
    public function importGroups(): ParsedJSONResponse {
        $stagingGroups = $this->fetchAllGroups("staging");
        foreach($stagingGroups as $stagingGroup) {
            if($this->groupExists($stagingGroup, "vdesk")) {
                //delete gruppo if exists
                $this->deleteGroup($stagingGroup, "vdesk");
            }               
            //import collegamenti group_user se esistono
            $imported = $this->insertGroup($stagingGroup, "vdesk");
            if($imported) {
                $currentGroupUsers = $this->fetchAllGroupUser($stagingGroup, "staging");
                foreach($currentGroupUsers as $currentGroupUser) {
                    if(!$this->groupUserExists($currentGroupUser, "vdesk")) {
                        $this->insertGroupUser($currentGroupUser, "vdesk");
                    }
                }
            }
        }
        return $this->successResponse("Gruppi importati", $stagingGroups);
    }





    //------------------------------------------------------- Services --------------------------------------------------------------//

    //Groups
	public function fetchAllGroups(string $area = "vdesk"): Array {
        try {
            if($area === "staging") {
                return $this->db->query("SELECT * FROM ".$this->config->getSystemValue('stagingdbtableprefix')."groups")->fetchAll();
            } else {
                $queryBuilder = $this->vdeskDb->createQueryBuilder();
                $queryBuilder->select('*')
				->from('`' . $this->config->getSystemValue('dbtableprefix') . 'groups`');
			    $query = $queryBuilder->execute();
                return $query->fetchAll();
            }
        } catch (\PDOException $e) {
			throw new \PDOException($e->getMessage(), (int)$e->getCode());
		}
    }

    public function insertGroup($group, $targetArea = "vdesk"): Bool {
        try {
            if($targetArea == "staging") {
                //TODO Implement
                return true;
            } else {
                //add group
                $queryBuilder = $this->vdeskDb->createQueryBuilder();
                $queryBuilder->insert($this->config->getSystemValue('dbtableprefix').'groups')
                    ->values([
                        'gid' => "?",
                    ])
                    ->setParameters([
                        0 => $group['gid'],
                    ])
                    ->execute();
            return true;
            }
            return false;
        } catch (\PDOException $e) {
			throw new \PDOException($e->getMessage(), (int)$e->getCode());
		}
    }

    public function deleteGroup($group, $area = "vdesk"): Bool {
        try {
            if($area == "staging") {
                //TODO Implement
                return true;
            } else {
                $queryBuilder = $this->vdeskDb->createQueryBuilder();
                $queryBuilder->delete($this->config->getSystemValue('dbtableprefix') . 'groups')
                    ->where('gid = ?')
                    ->setParameter(0, $group['gid']);
                $queryBuilder->execute();
                return true;
            }
            return false;
        } catch (\PDOException $e) {
			throw new \PDOException($e->getMessage(), (int)$e->getCode());
		}
    }

    public function groupExists($group, $area = "vdesk"): Bool {
        try {
            if($area == "staging") {
                //TODO Implement
            } else {
                $queryBuilder = $this->vdeskDb->createQueryBuilder();
                $queryBuilder->select('*')
                    ->from('`' . $this->config->getSystemValue('dbtableprefix') . 'groups`')
                    ->where('gid = ?')
                    ->setParameter(0, $group['gid']);
                $query = $queryBuilder->execute();
                if(count($query->fetchAll()) > 0)
                    return true;
            }
            return false;
        } catch (\PDOException $e) {
			throw new \PDOException($e->getMessage(), (int)$e->getCode());
		}
    }
    

    //Group Users
    
	public function fetchAllGroupUser($group = null, string $area = "vdesk"): Array {
        try {
            if($area === "staging") {
                $sql = "SELECT * FROM ".$this->config->getSystemValue('stagingdbtableprefix')."group_user";
                if(!is_null($group)) {
                    $sql.= " WHERE gid = '".$group['gid']."'";
                }
                return $this->db->query($sql)->fetchAll();
            } else {
                $queryBuilder = $this->vdeskDb->createQueryBuilder();
                $queryBuilder->select('*')
				->from('`' . $this->config->getSystemValue('dbtableprefix') . 'group_user`');
			    $query = $queryBuilder->execute();
            }
            return $query->fetchAll();
        } catch (\PDOException $e) {
			throw new \PDOException($e->getMessage(), (int)$e->getCode());
		}
    }

    public function insertGroupUser($groupUser, $targetArea = "vdesk"): Bool {
        try {
            if($targetArea == "staging") {
                //TODO Implement
                return true;
            } else {
                //add group
                $queryBuilder = $this->vdeskDb->createQueryBuilder();
                $queryBuilder->insert($this->config->getSystemValue('dbtableprefix').'group_user')
                    ->values([
                        'gid' => "?",
                        'uid' => "?",
                    ])
                    ->setParameters([
                        0 => $groupUser['gid'],
                        1 => $groupUser['uid']
                    ])
                    ->execute();
                return true;
            }
            return false;
        } catch (\PDOException $e) {
			throw new \PDOException($e->getMessage(), (int)$e->getCode());
		}
    }

    public function groupUserExists($groupUser, $area = "vdesk"): Bool {
        try {
            if($area == "staging") {
                //TODO Implement
            } else {
                $queryBuilder = $this->vdeskDb->createQueryBuilder();
                $queryBuilder->select('*')
                    ->from('`' . $this->config->getSystemValue('dbtableprefix') . 'group_user`')
                    ->where('gid = ?')
                    ->andWhere('uid = ?')
                    ->setParameter(0, $groupUser['gid'])
                    ->setParameter(1, $groupUser['uid']);
                $query = $queryBuilder->execute();
                if(count($query->fetchAll()) > 0)
                    return true;
            }
            return false;
        } catch (\PDOException $e) {
			throw new \PDOException($e->getMessage(), (int)$e->getCode());
		}
    }

}