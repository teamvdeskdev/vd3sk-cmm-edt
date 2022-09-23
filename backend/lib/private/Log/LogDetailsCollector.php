<?php
/**
 * @copyright Copyright (c) 2019 Julius Härtl <jus@bitgrid.net>
 *
 * @author Julius Härtl <jus@bitgrid.net>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

namespace OC\Log;

use OC\SystemConfig;

abstract class LogDetailsCollector {

	/** @var SystemConfig */
	private $config;

	public function __construct(SystemConfig $config) {
		$this->config = $config;
	}

	public function logDetails(string $app, $message, int $level): array {
		// default to ISO8601
		$format = $this->config->getValue('logdateformat', \DateTime::ATOM);
		$logTimeZone = $this->config->getValue('logtimezone', 'UTC');
		try {
			$timezone = new \DateTimeZone($logTimeZone);
		} catch (\Exception $e) {
			$timezone = new \DateTimeZone('UTC');
		}
		$Timestamp = \DateTime::createFromFormat("U.u", number_format(microtime(true), 4, ".", ""));
		if ($Timestamp === false) {
			$Timestamp = new \DateTime(null, $timezone);
		} else {
			// apply timezone if $time is created from UNIX timestamp
			$Timestamp->setTimezone($timezone);
		}
		$request = \OC::$server->getRequest();
		$ID_Sessione = session_id();
        $Sorgente = $request->gethostname();
        $Destinazione = $request->getRemoteAddress();
        $Utenza = \OC::$server->getUserSession()->getUser()->getUID();
        $Profilo_Utenza = "";
        $Servizio = \OC::$server->gettype();
        $Tipo_Evento = $app;

		// $remoteAddr = $request->getRemoteAddress();
		// remove username/passwords from URLs before writing the to the log file
		$Timestamp = $Timestamp->format($format);
		$url = ($request->getRequestUri() !== '') ? $request->getRequestUri() : '--';
		$method = is_string($request->getMethod()) ? $request->getMethod() : '--';
		if($this->config->getValue('installed', false)) {
			$user = \OC_User::getUser() ? \OC_User::getUser() : '--';
		} else {
			$user = '--';
		}
		$userAgent = $request->getHeader('User-Agent');
		if ($userAgent === '') {
			$userAgent = '--';
		}
		$version = $this->config->getValue('version', '');
		$entry = compact(
			'ID_Sessione',
			'Timestamp',
			'Sorgente',
			'Destinazione',
			'Utenza',
			'Profilo_Utenza',
			'Servizio',
			'Tipo_Evento',
			'Evento'
		);
		return $entry;
	}

	public function logDetailsAsJSON(string $app, $message, int $level): string {
		$entry = $this->logDetails($app, $message, $level);
		// PHP's json_encode only accept proper UTF-8 strings, loop over all
		// elements to ensure that they are properly UTF-8 compliant or convert
		// them manually.
		foreach($entry as $key => $value) {
			if(is_string($value)) {
				$testEncode = json_encode($value);
				if($testEncode === false) {
					$entry[$key] = utf8_encode($value);
				}
			}
		}
		return json_encode($entry, JSON_PARTIAL_OUTPUT_ON_ERROR);
	}
}
