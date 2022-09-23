<?php

namespace OCA\Expirations\Db;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class ExpirationAlert extends Entity implements JsonSerializable {
	
    public $idExpiration;
	public $alertDatetime;
	public $notifyTo;
	
	public function jsonSerialize(): array {
		return [
			'id_expiration' => $this->idExpiration,
			'alert_datetime' => $this->alertDatetime,
			'notify_to' => $this->notifyTo
		];
	}
}
