<?php
/**
 * @copyright Copyright (c) 2016, ownCloud, Inc.
 *
 * @author Andreas Fischer <bantu@owncloud.com>
 * @author Bart Visscher <bartv@thisnet.nl>
 * @author duritong <peter.meier+github@immerda.ch>
 * @author Georg Ehrke <oc.list@georgehrke.com>
 * @author Joas Schilling <coding@schilljs.com>
 * @author Juan Pablo Villafáñez <jvillafanez@solidgear.es>
 * @author Lukas Reschke <lukas@statuscode.ch>
 * @author Michael Gapczynski <GapczynskiM@gmail.com>
 * @author Morris Jobke <hey@morrisjobke.de>
 * @author Phiber2000 <phiber2000@gmx.de>
 * @author Robin Appelman <robin@icewind.nl>
 * @author Roeland Jago Douma <roeland@famdouma.nl>
 * @author Roger Szabo <roger.szabo@web.de>
 * @author Thomas Müller <thomas.mueller@tmit.eu>
 * @author Thomas Pulzer <t.pulzer@kniel.de>
 * @author Vincent Petry <pvince81@owncloud.com>
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

namespace OC\Log;
use OC\SystemConfig;
use OCP\Log\IFileBased;
use OCP\Log\IWriter;
use OCP\Log\IWriterCollector;
use OCP\ILogger;

/**
 * logging utilities
 *
 * Log is saved at data/drive.log (on default)
 */

class File extends LogDetails implements IWriter , IWriterCollector, IFileBased {
	/** @var string */
	protected $logFile;
	/** @var int */
	protected $logFileMode;
	/** @var SystemConfig */
	private $config;

	public function __construct(string $path, string $fallbackPath = '', SystemConfig $config) {
		parent::__construct($config);
		$this->logFile = $path;
		if (!file_exists($this->logFile)) {
			if(
				(
					!is_writable(dirname($this->logFile))
					|| !touch($this->logFile)
				)
				&& $fallbackPath !== ''
			) {
				$this->logFile = $fallbackPath;
			}
		}
		$this->config = $config;
		$this->logFileMode = $config->getValue('logfilemode', 0644);
	}

	/**
	 * write a message in the log
	 * @param string $app
	 * @param string|array $message
	 * @param int $level
	 */
	public function write(string $app, $message, int $level) {
		$entry = $this->logDetailsAsJSON($app, $message, $level);
		$handle = @fopen($this->logFile, 'a');
		if ($this->logFileMode > 0 && (fileperms($this->logFile) & 0777) != $this->logFileMode) {
			@chmod($this->logFile, $this->logFileMode);
		}
		if ($handle) {
			fwrite($handle, $entry."\n");
			fclose($handle);
		} else {
			// Fall back to error_log
			error_log($entry);
		}
		if (php_sapi_name() === 'cli-server') {
			if (!\is_string($message)) {
				$message = json_encode($message);
			}
			error_log($message, 4);
		}
	}

	/**
	 * write a message in the log
	 * @param string $message
	 * @param string $contextKey
	 * @param string $contextValue
	 */
	public function writeCollector(string $message,string $contextValue,string $app) {
		$entry = $this->logDetailsAsJSONCollector($message, $contextValue,$app);
		$handle = @fopen($this->logFile, 'a');
		if ($this->logFileMode > 0 && (fileperms($this->logFile) & 0777) != $this->logFileMode) {
			@chmod($this->logFile, $this->logFileMode);
		}
		if ($handle) {
			fwrite($handle, $entry."\n");
			fclose($handle);
		} else {
			// Fall back to error_log
			error_log($entry);
		}
		if (php_sapi_name() === 'cli-server') {
			if (!\is_string($message)) {
				$message = json_encode($message);
			}
			error_log($message, 4);
		}
	}

	/**
	 * get entries from the log in reverse chronological order
	 * @param int $limit
	 * @param int $offset
	 * @return array
	 */
	public function getEntries(int $limit=50, int $offset=0):array {
		$minLevel = $this->config->getValue("loglevel", ILogger::WARN);
		$entries = array();
		$handle = @fopen($this->logFile, 'rb');
		if ($handle) {
			fseek($handle, 0, SEEK_END);
			$pos = ftell($handle);
			$line = '';
			$entriesCount = 0;
			$lines = 0;
			// Loop through each character of the file looking for new lines
			while ($pos >= 0 && ($limit === null ||$entriesCount < $limit)) {
				fseek($handle, $pos);
				$ch = fgetc($handle);
				if ($ch == "\n" || $pos == 0) {
					if ($line != '') {
						// Add the first character if at the start of the file,
						// because it doesn't hit the else in the loop
						if ($pos == 0) {
							$line = $ch.$line;
						}
						$entry = json_decode($line);
						// Add the line as an entry if it is passed the offset and is equal or above the log level
						if ($entry->level >= $minLevel) {
							$lines++;
							if ($lines > $offset) {
								$entries[] = $entry;
								$entriesCount++;
							}
						}
						$line = '';
					}
				} else {
					$line = $ch.$line;
				}
				$pos--;
			}
			fclose($handle);
		}
		return $entries;
	}

	/**
	 * @return string
	 */
	public function getLogFilePath():string {
		return $this->logFile;
	}
}
