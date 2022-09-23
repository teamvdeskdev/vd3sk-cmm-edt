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
use OCA\VdeskIntegration\Mapper\UserDetailMapper;
use OCA\VdeskIntegration\Entity\UserDetailEntity;
abstract class LogDetails {

	/** @var SystemConfig */
	private $config;

	/** @var String */
	protected $ip;


	public function __construct(SystemConfig $config) {
		$this->config = $config;
		
	}

	public function logDetailsCollector(string $type,string $contextValue,string $app): array {
		// default to ISO8601
	 
		$format = $this->config->getValue('logdateformat', \DateTime::ATOM);
		$logTimeZone = $this->config->getValue('logtimezone', 'Europe/Rome');
	 
		try {
			$timezone = new \DateTimeZone($logTimeZone);
		} catch (\Exception $e) {
			$timezone = new \DateTimeZone('Europe/Rome');
		}
 
		$Timestamp = \DateTime::createFromFormat("U.u", number_format(microtime(true), 4, ".", ""));
		if ($Timestamp === false) {
			$Timestamp = new \DateTime(null, $timezone);
		} else {
			// apply timezone if $time is created from UNIX timestamp
			$Timestamp->setTimezone($timezone);
		}
		 
		$Time = $Timestamp->format('d-m-Y Hi-s');
		$request = \OC::$server->getRequest();
		

		$addressId = $request->getHeader('AddressIp');
		if (empty($addressId)) {
			// return null;
			$addressId  = \OC::$server->getSystemConfig()->getValue('SERVERNAME'," ");
		}
		$userAgent = $request->getHeader('User-Agent');
		$ID_Sessione = session_id();
	
        //  $Destinazione = $_SERVER['SERVER_ADDR'].":".$_SERVER['SERVER_PORT'];
		$Destinazione = $this->getDestinationIP();
	 	
        $Sorgente = $addressId;
		if (\OC::$server->getUserSession()->getUser()!=null)
		{
			$Utenza = \OC::$server->getUserSession()->getUser()->getUID();
			$useDetailMapper = new UserDetailMapper($Utenza,\OC::$server->getDatabaseConnection());
			$useDetailEntity= $useDetailMapper->find($Utenza);
			$isUserManager=false;
			$isFolderManager=false;
			if ($useDetailEntity instanceof UserDetailEntity) {
                $isUserManager=$useDetailEntity->getIsUserManager();
				$isFolderManager=$useDetailEntity->getIsFolderManager();
            }
			 
			$userGroups = \OC::$server->getGroupManager()->getUserGroupIds(\OC::$server->getUserSession()->getUser());
			$strGroups = "";
			$isAdmin = false;
			foreach ($userGroups as $userGroup) {
				if ($userGroup=="admin")
				{
					$isAdmin = true;
				}
			}

			$Profilo_Utenza="User";
			if ($isUserManager)
			{
				$Profilo_Utenza="GGU";
			}
			else if ($isFolderManager)
			{
				$Profilo_Utenza="FGM";
			}
			else if ($isAdmin)
			{
				$Profilo_Utenza="Admin";
			}
			 

			// $userGroups = \OC::$server->getGroupManager()->getUserGroupIds(\OC::$server->getUserSession()->getUser());
			// $strGroups = "";
			// foreach ($userGroups as $userGroup) {
			// 	$strGroups = $strGroups.$userGroup.";";
			// }
			// $Profilo_Utenza = substr_replace($strGroups, "", -1);
		}
		else
		{
			$Utenza = "ND";
			$Profilo_Utenza = "ND";
		}
       
	 
        $Servizio =  "vDesk";
 
        $Tipo_Evento = $type;
	 
		$Evento = $contextValue;
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
			'Time',
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

	public function logDetails(string $app, $message, int $level): array {
		// default to ISO8601
		$format = $this->config->getValue('logdateformat', \DateTime::ATOM);
		$logTimeZone = $this->config->getValue('logtimezone', 'UTC');
		try {
			$timezone = new \DateTimeZone($logTimeZone);
		} catch (\Exception $e) {
			$timezone = new \DateTimeZone('UTC');
		}
		$time = \DateTime::createFromFormat("U.u", number_format(microtime(true), 4, ".", ""));
		if ($time === false) {
			$time = new \DateTime(null, $timezone);
		} else {
			// apply timezone if $time is created from UNIX timestamp
			$time->setTimezone($timezone);
		}
		$request = \OC::$server->getRequest();
		$reqId = $request->getId();
		$remoteAddr = $request->getRemoteAddress();
		// remove username/passwords from URLs before writing the to the log file
		$time = $time->format($format);
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
			'reqId',
			'level',
			'time',
			'remoteAddr',
			'user',
			'app',
			'method',
			'url',
			'message',
			'userAgent',
			'version'
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

	public function logDetailsAsJSONCollector(string $type,string $contextValue,string $app): string {
		$entry = $this->logDetailsCollector($type, $contextValue,$app);
		// PHP's json_encode only accept proper UTF-8 strings, loop over all
		// elements to ensure that they are properly UTF-8 compliant or convert
		// them manually.
		$strEntry="";
		foreach($entry as $key => $value) {
			if(is_string($value)) {
				$testEncode = json_encode($value);
				if($testEncode === false) {
					$value = utf8_encode($value);
					// $entry[$key] = utf8_encode($value);
				}
				$strEntry = $strEntry . $value. ",";
			}
		}
		return substr_replace($strEntry, "", -1);
		//return json_encode($entry, JSON_PARTIAL_OUTPUT_ON_ERROR);
	}

	public function getDestinationIP()
	{
		
			 
			return getenv('SERVERNAME');
		
	}
	 
}
