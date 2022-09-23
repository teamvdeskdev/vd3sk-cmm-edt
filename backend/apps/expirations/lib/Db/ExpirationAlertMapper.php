<?php

namespace OCA\Expirations\Db;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\Entity;
use OCP\AppFramework\Db\QBMapper;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;

class ExpirationAlertMapper extends QBMapper {
	
	public function __construct(IDBConnection $db) {
		parent::__construct($db, 'expiration_alert', ExpirationAlert::class);
	}

	public function has(int $idExpiration, string $alertDatetime, string $notifyTo): bool {
		$fields[] = 'exp_alert.id_expiration';
		$fields[] = 'exp_alert.alert_datetime';
		$fields[] = 'exp_alert.notify_to';
		
		$query = $this->db->getQueryBuilder();
		$query->select($fields)
			->from('expiration_alert', 'exp_alert')
			->where($query->expr()->eq('exp_alert.id_expiration', $query->createNamedParameter($idExpiration)))
			->andWhere($query->expr()->eq('exp_alert.alert_datetime', $query->createNamedParameter($alertDatetime)))
			->andWhere($query->expr()->eq('exp_alert.notify_to', $query->createNamedParameter($notifyTo)));
		$stmt = $query->execute();
		$row = $stmt->fetch();
		return is_array($row);
	}

	public function insert_(int $idExpiration, string $alertDatetime, string $notifyTo) {
		$query = $this->db->getQueryBuilder();
     	$query->insert('expiration_alert')
		 	->values(['id_expiration' => '?', 
			 		  'alert_datetime' => '?', 
					  'notify_to' => '?'])
			 ->setParameter(0, $idExpiration)
			 ->setParameter(1, $alertDatetime)
			 ->setParameter(2, $notifyTo);
		$result = $query->execute();
		return $result;
	}

}
