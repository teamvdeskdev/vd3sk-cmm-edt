<?php

namespace OCA\Expirations\Service;

use Exception;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;

use OCA\Expirations\Db\ExpirationType;
use OCA\Expirations\Db\ExpirationTypeMapper;


class ExpirationTypeService {

	/** @var ExpirationTypeMapper */
	private $mapper;

	public function __construct(ExpirationTypeMapper $mapper) {
		$this->mapper = $mapper;
	}

	public function findAll(string $userId): array {
		return $this->mapper->findAll($userId);
	}

	private function handleException(Exception $e): void {
		if ($e instanceof DoesNotExistException ||
			$e instanceof MultipleObjectsReturnedException) {
			throw new ExceptionError();  
		} else {
			throw new ExceptionError($e->getMessage());
		}
	}

	public function find($id) {
		try {
			return $this->mapper->find($id);

		} catch (Exception $e) {
			$this->handleException($e);
		}
	}

	public function create($userId, $label) {
		$item = new ExpirationType();
		$item->setUidOwner($userId);
		$item->setLabel($label);
		return $this->mapper->insert($item);
	}

	public function update($id, $label) {
		try {
			$item = $this->mapper->find($id);
			$item->setLabel($label);
			return $this->mapper->update($item);
		} catch (Exception $e) {
			$this->handleException($e);
		}
	}

	public function delete($id, $userId) {
		
		try {
			$item = $this->mapper->find($id, $userId);
			$this->mapper->delete($item);
			return $item;
		} catch (Exception $e) {
			$this->handleException($e);
		}
	}
}
