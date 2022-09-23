<?php

namespace OCA\Expirations\Db;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class ExpirationAssignee extends Entity implements JsonSerializable {
	
    public $idExpiration;
	public $idAssignee;
	
	public function jsonSerialize(): array {
		return [
			'id_expiration' => $this->idExpiration,
			'id_assignee' => $this->idAssignee
		];
	}
}
