<?php

namespace OCA\Expirations\Service;

use Exception;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;

use OCA\Expirations\Db\ExpirationSupervisor;
use OCA\Expirations\Db\ExpirationSupervisorMapper;


class ExpirationSupervisorService {

	/** @var ExpirationSupervisorMapper */
	private $mapper;

	public function __construct(ExpirationSupervisorMapper $mapper) {
		$this->mapper = $mapper;
	}

	public function findAll($idExpiration): array {
		return $this->mapper->findAll($idExpiration);
	}

	private function handleException(Exception $e): void {
		if ($e instanceof DoesNotExistException ||
			$e instanceof MultipleObjectsReturnedException) {
			throw new ExceptionError(); 
		} else {
			throw new ExceptionError($e->getMessage()); 
		}
	}

	public function find($id_expiration, $id_supervisor) {
		try {
			return $this->mapper->find($id_expiration, $id_supervisor);

		} catch (Exception $e) {
			$this->handleException($e);
		}
	}

	public function create($id_expiration, $type_supervisor, $id_supervisor) {
		$item = new ExpirationSupervisor();
		$item->setIdExpiration($id_expiration);
		$item->setTypeSupervisor($type_supervisor);
		$item->setIdSupervisor($id_supervisor);
		$result = $this->mapper->insert($item);
		return $result;
	}

	public function delete($id_expiration) {
		try {
			return $this->mapper->delete_($id_expiration);
		} catch (Exception $e) {
			$this->handleException($e);
		}
	}
}
