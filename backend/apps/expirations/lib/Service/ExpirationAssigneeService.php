<?php

namespace OCA\Expirations\Service;

use Exception;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;

use OCA\Expirations\Db\ExpirationAssignee;
use OCA\Expirations\Db\ExpirationAssigneeMapper;


class ExpirationAssigneeService {

	/** @var ExpirationAssigneeMapper */
	private $mapper;

	public function __construct(ExpirationAssigneeMapper $mapper) {
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

	public function find($id_expiration, $id_assignee) {
		try {
			return $this->mapper->find($id_expiration, $id_assignee);

		} catch (Exception $e) {
			$this->handleException($e);
		}
	}

	public function create($id_expiration, $id_assignee) {
		$item = new ExpirationAssignee();
		$item->setIdExpiration($id_expiration);
		$item->setIdAssignee($id_assignee);
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
