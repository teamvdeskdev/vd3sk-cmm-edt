<?php

namespace OCA\Expirations\Service;

use Exception;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;

use OCA\Expirations\Db\ExpirationAlert;
use OCA\Expirations\Db\ExpirationAlertMapper;


class ExpirationAlertService {

	/** @var ExpirationAlertMapper */
	private $mapper;

	public function __construct(ExpirationAlertMapper $mapper) {
		$this->mapper = $mapper;
	}

	
	public function has(int $idExpiration, string $alertDatetime, string $notifyTo) : bool {
		return $this->mapper->has($idExpiration, $alertDatetime, $notifyTo);
	}

	public function insert(int $idExpiration, string $alertDatetime, string $notifyTo){
		return $this->mapper->insert_($idExpiration, $alertDatetime, $notifyTo);
	}
	
}
