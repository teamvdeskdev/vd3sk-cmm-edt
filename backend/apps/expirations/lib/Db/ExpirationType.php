<?php

namespace OCA\Expirations\Db;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class ExpirationType extends Entity implements JsonSerializable {
	
    protected $label;
	public $uidOwner;
	
	public function jsonSerialize(): array {
		return [
			'id' => $this->id,
			'uid_owner' => $this->uidOwner,
			'label' => $this->label
		];
	}
}
