<?php

namespace OCA\Expirations\Db;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class ExpirationVpec extends Entity implements JsonSerializable {
	
    public $idExpiration;
	public $idAccount;
	public $email;
	public $idMsg;
	
	public function jsonSerialize(): array {
		return [
			'id_expiration' => $this->idExpiration,
			'id_account' => $this->idAccount,
			'email' => $this->email,
			'id_msg' => $this->idMsg
		];
	}
}