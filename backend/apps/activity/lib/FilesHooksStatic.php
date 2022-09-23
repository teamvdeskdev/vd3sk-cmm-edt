<?php
/**
 * @copyright Copyright (c) 2016, ownCloud, Inc.
 * @copyright Copyright (c) 2017, Joas Schilling <coding@schilljs.com>
 *
 * @author Joas Schilling <coding@schilljs.com>
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

namespace OCA\Activity;

use OCP\Share\IShare;
use Symfony\Component\EventDispatcher\GenericEvent;

/**
 * The class to handle the filesystem hooks
 */
class FilesHooksStatic {

	/**
	 * @return FilesHooks
	 */
	static protected function getHooks() {
		return \OC::$server->query(FilesHooks::class);
	}

	/**
	 * Store the create hook events
	 * @param array $params The hook params
	 */
	public static function fileCreate($params) {
		self::getHooks()->fileCreate($params['path']);
		self::getHooks()->fileCreateLog($params);
	}

	/**
	 * Store the update hook events
	 * @param array $params The hook params
	 */
	public static function fileUpdate($params) {
		self::getHooks()->fileUpdate($params['path']);
		self::getHooks()->fileUpdateLog($params);
	}

	/**
	 * Store the delete hook events
	 * @param array $params The hook params
	 */
	public static function fileDelete($params) {
		self::getHooks()->fileDelete($params['path']);
		self::getHooks()->fileDeleteLog($params);
	}

	/**
	 * Store the rename hook events
	 * @param array $params The hook params
	 */
	public static function fileMove($params) {
		self::getHooks()->fileMove($params['oldpath'], $params['newpath']);
		self::getHooks()->fileMoveLog($params);
	}

	/**
	 * Store the rename hook events
	 * @param array $params The hook params
	 */
	public static function fileMovePost($params) {
		self::getHooks()->fileMovePost($params['oldpath'], $params['newpath']);
		self::getHooks()->fileMovedLog($params);
	}

	/**
	 * Store the restore hook events
	 * @param array $params The hook params
	 */
	public static function fileRestore($params) {
		self::getHooks()->fileRestore($params['filePath']);
		self::getHooks()->fileRestoreLog($params);
	}


	/**
	 * Store the restore hook events
	 * @param array $params The hook params
	 */
	public static function copyLog($params) {
		self::getHooks()->copyLog($params);
	}

	/**
	 * Store the restore hook events
	 * @param array $params The hook params
	 */
	public static function writeLog($params) {
		self::getHooks()->writeLog($params);
	}

	/**
	 * Store the restore hook events
	 * @param array $params The hook params
	 */
	public static function readLog($params) {
		self::getHooks()->readLog($params);
	}

		/**
	 * Store the create hook events
	 * @param array $params The hook params
	 */
	public static function shared($params) {
		self::getHooks()->shared($params);
	}
	/**
	 * Store the create hook events
	 * @param array $params The hook params
	 */
	public static function unshared($params) {
		self::getHooks()->unshared($params);
	}
	/**
	 * Store the create hook events
	 * @param array $params The hook params
	 */
	public static function updatePermissions($params) {
		self::getHooks()->updatePermissions($params);
	}
	/**
	 * Store the create hook events
	 * @param array $params The hook params
	 */
	public static function updatePassword($params) {
		self::getHooks()->updatePassword($params);
	}
	/**
	 * Store the create hook events
	 * @param array $params The hook params
	 */
	public static function updateExpirationDate($params) {
		self::getHooks()->updateExpirationDate($params);
	}
	/**
	 * Store the create hook events
	 * @param array $params The hook params
	 */
	public static function shareAccessed($params) {
		self::getHooks()->shareAccessed($params);
	}


		/**
	 * Store the create hook events
	 * @param array $params The hook params
	 */
	public static function userCreate($params) {
		self::getHooks()->userCreate($params);
	}

	/**
	 * Store the create hook events
	 * @param array $params The hook params
	 */
	public static function userDelete($params) {
		self::getHooks()->userDelete($params);
	}

	/**
	 * Store the create hook events
	 * @param array $params The hook params
	 */
	public static function userChange($params) {
		self::getHooks()->userChange($params);
	}

	 /**
	 * Store the create hook events
	 * @param array $params The hook params
	 */
	public static function setPassphrase($params) {
		self::getHooks()->setPassphrase($params);
	}

	 /**
	 * Store the create hook events
	 * @param array $params The hook params
	 */
	public static function preSetPassphrase($params) {
		self::getHooks()->preSetPassphrase($params);
	}

	 /**
	 * Store the create hook events
	 * @param array $params The hook params
	 */
	public static function postPasswordReset($params) {
		self::getHooks()->postPasswordReset($params);
	}

	 /**
	 * Store the create hook events
	 * @param array $params The hook params
	 */
	public static function prePasswordReset($params) {
		self::getHooks()->prePasswordReset($params);
	}
  
	/**
	 * Store the create hook events
	 * @param array $params The hook params
	 */
	public static function postLogin($params) {
		self::getHooks()->postLogin($params);
	}

    /**
	 * Store the create hook events
	 * @param array $params The hook params
	 */
	public static function preLogin($params) {
		self::getHooks()->preLogin($params);
	}
	
	/**
	 * Store the create hook events
	 * @param array $params The hook params
	 */
	public static function logout($params) {
		self::getHooks()->logout($params);
	}

	/**
	 * Store the create hook events
	 * @param array $params The hook params
	 */
	public static function loginFailed($params) {
		self::getHooks()->loginFailed($params);
	}

	/**
	 * Manage sharing events
	 * @param array $params The hook params
	 */
	public static function share($params) {
		self::getHooks()->share($params);
	}

	/**
	 * Unsharing event
	 * @param GenericEvent $event
	 */
	public static function unShare(GenericEvent $event) {
		$share = $event->getSubject();
		if ($share instanceof IShare) {
			self::getHooks()->unShare($share);
		}
	}

	/**
	 * "Unsharing a share from self only" event
	 * @param GenericEvent $event
	 */
	public static function unShareSelf(GenericEvent $event) {
		$share = $event->getSubject();
		if ($share instanceof IShare) {
			self::getHooks()->unShareSelf($share);
		}
	}




	


	
}
