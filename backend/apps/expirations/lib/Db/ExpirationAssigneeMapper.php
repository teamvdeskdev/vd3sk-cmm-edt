<?php

namespace OCA\Expirations\Db;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\Entity;
use OCP\AppFramework\Db\QBMapper;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;

class ExpirationAssigneeMapper extends QBMapper {
	public function __construct(IDBConnection $db) {
		parent::__construct($db, 'expiration_assignee', ExpirationAssignee::class);
	}

	


	/**
	 * @param int $id
	 * @param int $idExpiration
	 * @param string $idAssignee
	 * @return Entity|ExpirationAssignee
	 * @throws \OCP\AppFramework\Db\MultipleObjectsReturnedException
	 * @throws DoesNotExistException
	 */
	public function find(int $idExpiration, string $idAssignee) {
		$fields[] = 'exp.id_expiration';
		$fields[] = 'exp.id_assignee';
		
		$query = $this->db->getQueryBuilder();
		$query->select($fields)
			->from('expiration_assignee', 'exp_assignee')
			->where($query->expr()->eq('exp_assignee.id_expiration', $query->createNamedParameter($idExpiration)))
			->where($query->expr()->eq('exp_assignee.id_assignee', $query->createNamedParameter($idAssignee)));
		$stmt = $query->execute();
		$row = $stmt->fetch();
		return $row;
	}


	/**
	 * @param int $id
	 * @param int $idExpiration
	 * @return Entity|ExpirationAssignee
	 * @throws \OCP\AppFramework\Db\MultipleObjectsReturnedException
	 * @throws DoesNotExistException
	 */
	public function findAll(int $idExpiration) {
		$fields[] = 'id_expiration';
		$query = $this->db->getQueryBuilder();
		$query->select("*")
			->from('expiration_assignee')
			->where($query->expr()->eq('id_expiration', $query->createNamedParameter($idExpiration)));
		$stmt = $query->execute();
		$row = $stmt->fetchAll();
		return $row;
	}

	public function delete_($id_expiration) {
		$qb = $this->db->getQueryBuilder();
		$qb->delete('expiration_assignee')
			->where('id_expiration = :ID_EXPIRATION')
			->setParameter('ID_EXPIRATION', $id_expiration);
		
		return $qb->execute();;
			
	}


}
