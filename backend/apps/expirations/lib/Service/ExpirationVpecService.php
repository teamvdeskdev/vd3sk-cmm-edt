<?php

namespace OCA\Expirations\Service;

use Exception;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;

use OCA\Expirations\Db\ExpirationVpec;
use OCA\Expirations\Db\ExpirationVpecMapper;


class ExpirationVpecService {

	/** @var ExpirationVpecMapper */
	private $mapper;

	public function __construct(ExpirationVpecMapper $mapper) {
		$this->mapper = $mapper;
	}

	public function findAll(): array {
		return $this->mapper->findAll();
	}

	private function handleException(Exception $e): void {
		if ($e instanceof DoesNotExistException ||
			$e instanceof MultipleObjectsReturnedException) {
			throw new ExceptionError();  
		} else {
			throw new ExceptionError($e->getMessage());
		}
	}

	public function find(int $id_expiration) {
		try {
			return $this->mapper->find($id_expiration);

		} catch (Exception $e) {
			$this->handleException($e);
		}
	}

	public function create(int $id_expiration, int $id_account, string $email, string $id_msg) {
		$item = new ExpirationVpec();
		$item->setIdExpiration($id_expiration);
		$item->setIdAccount($id_account);
		$item->setEmail($email);
		$item->setIdMsg($id_msg);
		return $this->mapper->insert($item);
	}

	public function update(int $id_expiration, int $id_account, string $email, string $id_msg){
		try {
			$item = $this->mapper->find($id_expiration);
			$item->setIdAccount($id_account);
			$item->setEmail($email);
			$item->setIdMsg($id_msg);
			return $this->mapper->update($item);
		} catch (Exception $e) {
			$this->handleException($e);
		}
	}

	public function delete(int $id_expiration) {
		
		try {
			$item = $this->mapper->find($id_expiration);
			$this->mapper->delete($item);
			return $item;
		} catch (Exception $e) {
			$this->handleException($e);
		}
	}
}