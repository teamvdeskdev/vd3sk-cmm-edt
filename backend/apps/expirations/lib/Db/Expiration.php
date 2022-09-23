<?php

namespace OCA\Expirations\Db;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class Expiration extends Entity implements JsonSerializable {
	
    
	 /**
	 * @ManyToOne(targetEntity="ExpirationType")
     * @JoinColumn(name="id_type", referencedColumnName="id")
	 * 
     */
	public $id;
	public $uidOwner;
	public $linkTo;
	public $idType;
	public $labelType;
	public $description;
	/** @Column(type="datetime") */
	public $datetime;
	public $priority;
	public $alertType;
	/** @Column(type="datetime") */
	public $alertDatetime;
	public $mode;
	public $status;
	public $repetitionGroup;
	public $repetitionType;

	public function __construct() {
		$this->addType('id', 'integer');
		$this->addType('uid_owner', 'string');
		$this->addType('link_to', 'string');
		$this->addType('id_type', 'integer');
		$this->addType('priority', 'integer');
		$this->addType('datetime', 'datetime');
		$this->addType('alert_datetime', 'datetime');
		$this->addType('mode', 'string');
		$this->addType('status', 'string');
		$this->addType('repetition_group', 'string');
		$this->addType('repetition_type', 'string');
	}


	public function jsonSerialize(): array {
		return [
			'id' => $this->id,
			'uid_owner' => $this->uidOwner,
			'link_to' => $this->linkTo,
			'id_type' => $this->idType,
			'description' => $this->description,
			'datetime' => $this->datetime,
			'priority' => $this->priority,
			'alert_type' => $this->alertType,
			'alert_datetime' => $this->alertDatetime,
			'mode'=> $this->mode,
			'status'=> $this->status,
			'repetition_group'=> $this->repetitionGroup,
			'repetition_type'=> $this->repetitionType
		];
	}
}
