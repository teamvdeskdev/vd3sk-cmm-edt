<?php
/**
 * @copyright Copyright (c) 2016, ownCloud, Inc.
 *
 * @author Georg Ehrke <oc.list@georgehrke.com>
 * @author Lukas Reschke <lukas@statuscode.ch>
 * @author Morris Jobke <hey@morrisjobke.de>
 * @author Thomas Müller <thomas.mueller@tmit.eu>
 * @author Thomas Pulzer <t.pulzer@kniel.de>
 *
 * @license AGPL-3.0
 *
 * This code is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License, version 3,
 * along with this program.  If not, see <http://www.gnu.org/licenses/>
 *
 */

namespace OC\Settings\Controller;

use OC\Log;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\StreamResponse;
use OCP\IRequest;

/**
 * Class LogSettingsController
 *
 * @package OC\Settings\Controller
 */
class LogSettingsController extends Controller {

	/** @var Log */
	private $log;

	public function __construct(string $appName, IRequest $request, Log $logger) {
		parent::__construct($appName, $request);
		$this->log = $logger;
	}

	/**
	 * download logfile
	 *
	 * @NoCSRFRequired
	 *
	 * @return StreamResponse
	 */
	public function download() {
		if(!$this->log instanceof Log) {
			throw new \UnexpectedValueException('Log file not available');
		}
		$resp = new StreamResponse($this->log->getLogPath());
		$resp->addHeader('Content-Type', 'application/octet-stream');
		$resp->addHeader('Content-Disposition', 'attachment; filename="drive.log"');
		return $resp;
	}
}
