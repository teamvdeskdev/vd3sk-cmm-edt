<?php

namespace OCA\Expirations\Db;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class ExpirationSupervisor extends Entity implements JsonSerializable {
	
    public $idExpiration;
	public $idSupervisor;
	public $typeSupervisor;
	
	public function jsonSerialize(): array {
		return [
			'id_expiration' => $this->idExpiration,
			'id_supervisor' => $this->idSupervisor,
			'type_supervisor' => $this->typeSupervisor,
		];
	}
}
