<?php
/**
 * @copyright Copyright (c) 2016, ownCloud, Inc.
 *
 * @author Joas Schilling <coding@schilljs.com>
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

namespace OCA\Activity\AppInfo;

use OC\Files\View;
use OCA\Activity\Capabilities;
use OCA\Activity\Consumer;
use OCA\Activity\Controller\Activities;
use OCA\Activity\Controller\APIv1;
use OCA\Activity\Controller\APIv2;
use OCA\Activity\Controller\Feed;
use OCA\Activity\Controller\RemoteActivity;
use OCA\Activity\Controller\Settings;
use OCA\Activity\FilesHooksStatic;
use OCA\Activity\Hooks;
use OCP\AppFramework\App;
use OCP\IL10N;
use OCP\Util;
use OCP\Share;
use OC\Files\Filesystem;

class Application extends App {
	public function __construct () {
		parent::__construct('activity');
		$container = $this->getContainer();

		// Allow automatic DI for the View, until we migrated to Nodes API
		$container->registerService(View::class, function() {
			return new View('');
		}, false);
		$container->registerService('isCLI', function() {
			return \OC::$CLI;
		});

		// Aliases for the controllers so we can use the automatic DI
		$container->registerAlias('ActivitiesController', Activities::class);
		$container->registerAlias('APIv1Controller', APIv1::class);
		$container->registerAlias('APIv2Controller', APIv2::class);
		$container->registerAlias('FeedController', Feed::class);
		$container->registerAlias('RemoteActivityController', RemoteActivity::class);
		$container->registerAlias('SettingsController', Settings::class);

		$container->registerCapability(Capabilities::class);
	}

	/**
	 * Register the different app parts
	 */
	public function register() {
		$this->registerActivityConsumer();
		$this->registerHooksAndEvents();
	}

	/**
	 * Registers the consumer to the Activity Manager
	 */
	public function registerActivityConsumer() {
		$c = $this->getContainer();
		/** @var \OCP\IServerContainer $server */
		$server = $c->getServer();

		$server->getActivityManager()->registerConsumer(function() use ($c) {
			return $c->query(Consumer::class);
		});
	}

	/**
	 * Register the hooks and events
	 */
	public function registerHooksAndEvents() {
		$eventDispatcher = $this->getContainer()->getServer()->getEventDispatcher();
		$eventDispatcher->addListener('OCA\Files::loadAdditionalScripts', [Hooks::class, 'onLoadFilesAppScripts']);

		Util::connectHook('OC_User', 'post_deleteUser', Hooks::class, 'deleteUser');
	//	Util::connectHook('OC_User', 'post_login', Hooks::class, 'setDefaultsForUser');

		$this->registerFilesActivity();
		$this->registerAllActivity();
	}


	/**
	 * Register the hooks for filesystem operations
	 */
	public function registerAllActivity() {
		//user action
		Util::connectHook('OC_User', 'post_createUser', FilesHooksStatic::class, 'userCreate');
		Util::connectHook('OC_User', 'post_deleteUser',	FilesHooksStatic::class, 'userDelete');
		Util::connectHook('OC_User', 'changeUser',	FilesHooksStatic::class, 'userChange');
		Util::connectHook('OC_User','post_setPassword',FilesHooksStatic::class,'setPassphrase');
		Util::connectHook('OC_User','pre_setPassword',FilesHooksStatic::class,'preSetPassphrase');
		Util::connectHook('\OC\Core\LostPassword\Controller\LostController','post_passwordReset',FilesHooksStatic::class,'postPasswordReset');
		Util::connectHook('\OC\Core\LostPassword\Controller\LostController','pre_passwordReset',FilesHooksStatic::class,'prePasswordReset');
	//	Util::connectHook('OC_User', 'pre_login',FilesHooksStatic::class,'preLogin');
	//	Util::connectHook('OC_User', 'post_login',FilesHooksStatic::class,'postLogin');
		Util::connectHook('OC_User', 'logout', FilesHooksStatic::class, 'logout');
	//	Util::connectHook('OC_User', 'loginFailed', FilesHooksStatic::class, 'loginFailed');
		//share action
		Util::connectHook(Share::class, 'post_shared', FilesHooksStatic::class, 'shared');
		Util::connectHook(Share::class, 'post_unshare', FilesHooksStatic::class, 'unshared');
		Util::connectHook(Share::class, 'post_update_permissions', FilesHooksStatic::class, 'updatePermissions');
		Util::connectHook(Share::class, 'post_update_password', FilesHooksStatic::class, 'updatePassword');
		Util::connectHook(Share::class, 'post_set_expiration_date', FilesHooksStatic::class, 'updateExpirationDate');
		Util::connectHook(Share::class, 'share_link_access', FilesHooksStatic::class, 'shareAccessed');

		//other file action	 
		Util::connectHook(Filesystem::CLASSNAME,Filesystem::signal_post_copy,FilesHooksStatic::class,'copyLog');
	//	Util::connectHook(Filesystem::CLASSNAME,Filesystem::signal_post_write,FilesHooksStatic::class,'writeLog');
	//	Util::connectHook(Filesystem::CLASSNAME,Filesystem::signal_read,FilesHooksStatic::class,'readLog');
		

		// Util::connectHook('\OCP\Versions', 'rollback', FilesHooksStatic::class, 'rollback');
		// Util::connectHook('\OCP\Versions', 'delete',FilesHooksStatic::class, 'delete');
		// Util::connectHook('\OCP\Trashbin', 'preDelete', FilesHooksStatic::class, 'delete');
		// Util::connectHook(Share::class,'federated_share_added',FilesHooksStatic::class,'addServerHook');
		
		// Util::connectHook('OC_Group', 'pre_createGroup', FilesHooksStatic::class,);
		// Util::connectHook('OC_User', 'post_createGroup', FilesHooksStatic::class,);
		// Util::connectHook('OC_Group', 'pre_deleteGroup', FilesHooksStatic::class,);
		// Util::connectHook('OC_User', 'post_deleteGroup', FilesHooksStatic::class,);
		// Util::connectHook('OC_Group', 'pre_addToGroup', FilesHooksStatic::class,);
		// Util::connectHook('OC_Group', 'post_addToGroup', FilesHooksStatic::class,);
		// Util::connectHook('OC_User', 'post_addToGroup', FilesHooksStatic::class,);
	}

	/**
	 * Register the hooks for filesystem operations
	 */
	public function registerFilesActivity() {
		// All other events from other apps have to be send via the Consumer
		Util::connectHook('OC_Filesystem', 'post_create', FilesHooksStatic::class, 'fileCreate');
	 	Util::connectHook('OC_Filesystem', 'post_update', FilesHooksStatic::class, 'fileUpdate');
		Util::connectHook('OC_Filesystem', 'delete', FilesHooksStatic::class, 'fileDelete');
		Util::connectHook('OC_Filesystem', 'rename', FilesHooksStatic::class, 'fileMove');
		Util::connectHook('OC_Filesystem', 'post_rename', FilesHooksStatic::class, 'fileMovePost');
		Util::connectHook('\OCA\Files_Trashbin\Trashbin', 'post_restore', FilesHooksStatic::class, 'fileRestore');
		Util::connectHook('OCP\Share', 'post_shared', FilesHooksStatic::class, 'share');

		$eventDispatcher = $this->getContainer()->getServer()->getEventDispatcher();
		$eventDispatcher->addListener('OCP\Share::preUnshare', [FilesHooksStatic::class, 'unShare']);
		$eventDispatcher->addListener('OCP\Share::postUnshareFromSelf', [FilesHooksStatic::class, 'unShareSelf']);
	}
}
