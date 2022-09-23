<?php

namespace OCA\Expirations\AppInfo;

use OCP\AppFramework\App;

class Application extends App {
	public const APP_ID = 'expirations';

	public function __construct() {
		parent::__construct(self::APP_ID);
	}
}
