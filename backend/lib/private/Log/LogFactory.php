<?php
/**
 * @copyright Copyright (c) 2018 Arthur Schiwon <blizzz@arthur-schiwon.de>
 *
 * @author Arthur Schiwon <blizzz@arthur-schiwon.de>
 * @author Johannes Ernst <jernst@indiecomputing.com>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

namespace OC\Log;

use OC\Log;
use OC\SystemConfig;
use OCP\ILogger;
use OCP\IServerContainer;
use OCP\Log\ILogFactory;
use OCP\Log\IWriter;

class LogFactory implements ILogFactory {
	/** @var IServerContainer */
	private $c;
	/** @var SystemConfig */
	private $systemConfig;

	public function __construct(IServerContainer $c, SystemConfig $systemConfig) {
		$this->c = $c;
		$this->systemConfig = $systemConfig;
	}

	/**
	 * @throws \OCP\AppFramework\QueryException
	 */
	public function get(string $type):IWriter {
		 
		switch (strtolower($type)) {
			case 'errorlog':
				return new Errorlog();
			case 'syslog':
				return $this->c->resolve(Syslog::class);
			case 'systemd':
				return $this->c->resolve(Systemdlog::class);
			case 'file':
				return $this->buildLogFile();
			case 'file_collector':
				//$serverip="HOSTNAME"; 
				$serverip = getenv('SERVERNAME'); 
		 		//$serverip = $_SERVER['SERVER_ADDR'];
				if (!empty($serverip))
				{
					$three_days_ago = date('Y-m-d', strtotime("-3 day"));
					$path_three_days_ago = $this->systemConfig->getValue('logdirectory', \OC::$SERVERROOT).'/VDESK.STDAPPL.1.1.'.$serverip.".".$three_days_ago.'_00-00.STANDARD-10.log';
					if (file_exists($path_three_days_ago)) {
						!unlink($path_three_days_ago);
					}	
					return $this->buildLogFile($this->systemConfig->getValue('logdirectory', \OC::$SERVERROOT).'/VDESK.STDAPPL.1.1.'.$serverip.".".date('Y-m-d',time()).'_00-00.STANDARD-10.log'); 
				}
				return $this->buildLogFile('ERROR'); 
			// Backwards compatibility for old and fallback for unknown log types
			case 'owncloud':
			case 'nextcloud':
			default:
				return $this->buildLogFile();
		}
	}

	public function getCustomLogger(string $path):ILogger {
		$log = $this->buildLogFile($path);
		return new Log($log, $this->systemConfig);
	}

	protected function buildLogFile(string $logFile = ''):File {
		$defaultLogFile = $this->systemConfig->getValue('datadirectory', \OC::$SERVERROOT.'/data').'/drive.log';
		if($logFile === '') {
			$logFile = $this->systemConfig->getValue('logfile', $defaultLogFile);
		}
		$fallback = $defaultLogFile !== $logFile ? $defaultLogFile : '';

		return new File($logFile, $fallback, $this->systemConfig);
	}
}
