<?php

use OCA\Wfam\Controller\Notifier;

// for nextcloud 17
$manager = \OC::$server->getNotificationManager();
$manager->registerNotifierService(Notifier::class);

// for nextcloud < 17
// $manager = \OC::$server->getNotificationManager();
// $manager->registerNotifier(function() {
	
//     return new Notifier(
// 		\OC::$server->getL10NFactory(),\OC::$server->getURLGenerator()
//     );
// }, function() {
// 		return [
// 			'id' => 'wfam',
// 			'name' =>'wfam',
// 		];
// });
