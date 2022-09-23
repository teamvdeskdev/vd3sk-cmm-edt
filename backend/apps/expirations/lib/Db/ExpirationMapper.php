<?php

namespace OCA\Expirations\Db;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\Entity;
use OCP\AppFramework\Db\QBMapper;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;

class ExpirationMapper extends QBMapper {

	
	public function __construct(IDBConnection $db) {
		parent::__construct($db, 'expiration', Expiration::class);
	}

	/**
	 * @param int $id
	 * @param string $userId
	 * @return Entity|Expiration
	 * @throws \OCP\AppFramework\Db\MultipleObjectsReturnedException
	 * @throws DoesNotExistException
	 */
	public function find(int $id ) {
		
		$query = $this->queryFindAll();
		$query->where($query->expr()->eq('exp.id', $query->createNamedParameter($id, IQueryBuilder::PARAM_INT)));
		$stmt = $query->execute();
		$row = $stmt->fetch();

		return $this->formatExpiration($row);
	}

	/**
	 * @param string $userId
	 * 
	 * @return array
	 */
	public function findAll(string $userId): array {
		
		$query = $this->queryFindAll();
		$query->where($query->expr()->eq('exp.uid_owner', $query->createNamedParameter($userId)))
			->orWhere($query->expr()->eq('exp_assignee.id_assignee', $query->createNamedParameter($userId)))
			->orWhere($query->expr()->eq('exp_supervisor.id_supervisor', $query->createNamedParameter($userId)))
			;//->groupBy("assignee.id_expiration");

		$stmt = $query->execute();
		$rows = $stmt->fetchAll();
		$expirations = [];
		foreach($rows as $row) {
			$expiration = $this->formatExpiration($row);
			array_push($expirations, $expiration);
		}	
		return $expirations;
	}
	
	/**
	 * 
	 * @return array
	 */
	public function getByVpecEmail(string $email): array {
		
		$query = $this->queryFindAll();
		$query->innerJoin('exp', 'expiration_vpec', 'exp_vpec', $query->expr()->eq('exp.id', 'exp_vpec.id_expiration', IQueryBuilder::PARAM_INT))
			->where($query->expr()->eq('exp_vpec.email', $query->createNamedParameter($email)));
			
		$stmt = $query->execute();
		$rows = $stmt->fetchAll();
		$expirations = [];
		foreach($rows as $row) {
			$expiration = $this->formatExpiration($row);
			array_push($expirations, $expiration);
		}	
		return $expirations;
	}
	

	/**
	 * 
	 * @return array
	 */
	public function findByAlert(int $alertType, $alertDatetime=null): array {
		
		$query = $this->queryFindAll();
		$query->where($query->expr()->eq('exp.alert_type', $query->createNamedParameter($alertType)))
			  ->andWhere($query->expr()->eq('exp.status', $query->createNamedParameter('created')));
		if($alertDatetime){
			$query->andWhere($query->expr()->eq('exp.alert_datetime', $query->createNamedParameter($alertDatetime)));
		}

		$stmt = $query->execute();
		$rows = $stmt->fetchAll();
		$expirations = [];
		foreach($rows as $row) {
			$expiration = $this->formatExpiration($row);
			array_push($expirations, $expiration);
		}	
		return $expirations;
	}
	
	public function findByGroupId($groupId) {
		$query = $this->queryFindAll();
		$query->where($query->expr()->eq('exp.repetition_group', $query->createNamedParameter($groupId)));
		$stmt = $query->execute();
		$rows = $stmt->fetchAll();
		$expirations = [];
		foreach($rows as $row) {
			$expiration = $this->formatExpiration($row);
			array_push($expirations, $expiration);
		}	
		return $expirations;
	}

	public function findCreatedAndExpired(): array {
		
		$query = $this->queryFindAll();
		$query->where($query->expr()->eq('exp.status', $query->createNamedParameter('created')))
			  ->andWhere('exp.datetime < CURRENT_TIMESTAMP()');
		
		$stmt = $query->execute();
		$rows = $stmt->fetchAll();
		$expirations = [];
		foreach($rows as $row) {
			$expiration = $this->formatExpiration($row);
			array_push($expirations, $expiration);
		}
		return $expirations;
	}


	private function queryFindAll(){
		
		/* @var $query IQueryBuilder */
		$fields[] = 'exp.uid_owner';
		$fields[] = 'exp.id';
		$fields[] = 'exp.id_type as type_id';
		$fields[] = 'type.label as type_label';
		$fields[] = 'exp.description';
		$fields[] = 'exp.datetime';
		$fields[] = 'exp.priority';
		$fields[] = 'exp.alert_type';
		$fields[] = 'exp.alert_datetime';
		$fields[] = 'exp.link_to';
		$fields[] = 'exp.mode';
		$fields[] = 'exp.status';
		$fields[] = 'exp_assignee.id_assignee';
		$fields[] = 'exp_supervisor.id_supervisor';
		$fields[] = 'exp.repetition_group';
		$fields[] = 'exp.repetition_type';

		$query = $this->db->getQueryBuilder();
		$query->select($fields)
			->from('expiration', 'exp')
			->leftJoin('exp', 'expiration_type', 'type', $query->expr()->eq('exp.id_type', 'type.id', IQueryBuilder::PARAM_INT))
			->leftJoin('exp', 'expiration_assignee', 'exp_assignee', $query->expr()->eq('exp.id', 'exp_assignee.id_expiration', IQueryBuilder::PARAM_INT))
			->leftJoin('exp', 'expiration_supervisor', 'exp_supervisor', $query->expr()->eq('exp.id', 'exp_supervisor.id_expiration', IQueryBuilder::PARAM_INT));
		return $query;
	}


	public function updateStatus(int $id, string $status){
		$query = $this->db->getQueryBuilder();
		$query->update('expiration')
        	->set('status', $query->createNamedParameter($status))
			->where($query->expr()->eq('id', $query->createNamedParameter($id)));
		$rows = $query->execute();
		return $rows;
	}

	private function formatExpiration($row){
		$expiration = [];
		if($row){
			$expiration['owner_id'] = $row["uid_owner"];
			$expiration['id'] = (int)$row["id"];
			$expiration['description'] = $row["description"];
			$expiration['datetime'] = $row["datetime"];
			$expiration['priority'] = (int)$row["priority"];
			$expiration['link_to'] = $row["link_to"];
			$expiration['type'] = [];
			$expiration['type']['id'] = (int)$row["type_id"];
			$expiration['type']['label'] = $row["type_label"];
			$expiration['alert'] = [];
			$expiration['alert']['type'] = (int)$row["alert_type"];
			$expiration['alert']['datetime'] = $row["alert_datetime"];
			$expiration['mode'] = $row["mode"];
			$expiration['status'] = $row["status"];
			$expiration['repetition_group'] = $row["repetition_group"];
			$expiration['repetition_type'] = $row["repetition_type"];
		}
		return $expiration;
	}
}
