<?php

namespace OCA\Expirations\Db;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\Entity;
use OCP\AppFramework\Db\QBMapper;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;

class ExpirationVpecMapper extends QBMapper {
	public function __construct(IDBConnection $db) {
		parent::__construct($db, 'expiration_vpec', ExpirationVpec::class);
	}

	/**
	 * @param int $id
	 * @param string $userId
	 * @return Entity|ExpirationVpec
	 * @throws \OCP\AppFramework\Db\MultipleObjectsReturnedException
	 * @throws DoesNotExistException
	 */
	public function find(int $id): ExpirationType {
		/* @var $qb IQueryBuilder */
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')
			->from('expiration_vpec')
			->where($qb->expr()->eq('id_expiration', $qb->createNamedParameter($id, IQueryBuilder::PARAM_INT)));
		return $this->findEntity($qb);
	}

	/**
	 * @param string $userId
	 * @return array
	 */
	public function findAll(): array {
		/* @var $qb IQueryBuilder */
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')
			->from('expiration_vpec');
		return $this->findEntities($qb);
	}

}
