<?php

namespace OCA\Expirations\Db;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\Entity;
use OCP\AppFramework\Db\QBMapper;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;

class ExpirationSupervisorMapper extends QBMapper {
	public function __construct(IDBConnection $db) {
		parent::__construct($db, 'expiration_supervisor', ExpirationSupervisor::class);
	}

	
	/**
	 * @param int $id
	 * @param int $idExpiration
	 * @param int $typeSupervisor 		1:user, 2:group
	 * @param string $idSupervisor
	 * @return Entity|ExpirationSupervisor
	 * @throws \OCP\AppFramework\Db\MultipleObjectsReturnedException
	 * @throws DoesNotExistException
	 */
	public function find(int $idExpiration, string $idSupervisor) {
		$fields[] = 'exp.id_expiration';
		$fields[] = 'exp.id_supervisor';
		
		$query = $this->db->getQueryBuilder();
		$query->select($fields)
			->from('expiration_supervisor', 'exp_supervisor')
			->where($query->expr()->eq('exp_supervisor.id_expiration', $query->createNamedParameter($idExpiration)))
			->where($query->expr()->eq('exp_supervisor.id_supervisor', $query->createNamedParameter($idSupervisor)));
		$stmt = $query->execute();
		$row = $stmt->fetch();
		return $row;
	}


	/**
	 * @param int $id
	 * @param int $idExpiration
	 * @return Entity|ExpirationSupervisor
	 * @throws \OCP\AppFramework\Db\MultipleObjectsReturnedException
	 * @throws DoesNotExistException
	 */
	public function findAll(int $idExpiration) {
		$fields[] = 'id_expiration';
		$query = $this->db->getQueryBuilder();
		$query->select("*")
			->from('expiration_supervisor')
			->where($query->expr()->eq('id_expiration', $query->createNamedParameter($idExpiration)));
		$stmt = $query->execute();
		$row = $stmt->fetchAll();
		return $row;
	}

	public function delete_($id_expiration) {
		$qb = $this->db->getQueryBuilder();
		$qb->delete('expiration_supervisor')
			->where('id_expiration = :ID_EXPIRATION')
			->setParameter('ID_EXPIRATION', $id_expiration);
		
		return $qb->execute();;
	}


}
