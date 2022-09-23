<?php

return [
	'resources' => [
		'expiration' => ['url' => '/expirations'],
		'expiration_type' => ['url' => '/expiration-types'],
		'expiration_assignee' => ['url' => '/expiration-assignees'],
		'expiration_supervisor' => ['url' => '/expiration-supervisors'],
		'expiration_vpec' => ['url' => '/expiration-vpecs'],
	],
	'routes' => [
		['name' => 'expiration#updateStatus', 'url' => '/expirations/{id_expiration}/status/{status}', 'verb' => 'PUT'],
		['name' => 'expiration#getByVpecEmail', 'url' => '/expirations/vpec/email/{email}', 'verb' => 'GET'],
		['name' => 'expiration_assignee#findAll', 'url' => '/expiration-assignees/{id_expiration}', 'verb' => 'GET'],
		['name' => 'expiration_assignee#destroy_', 'url' => '/expiration-assignees/{id_expiration}', 'verb' => 'DELETE'],
		['name' => 'expiration_supervisor#findAll', 'url' => '/expiration-supervisors/{id_expiration}', 'verb' => 'GET'],
		['name' => 'expiration_supervisor#destroy_', 'url' => '/expiration-supervisors/{id_expiration}', 'verb' => 'DELETE'],
		['name' => 'expiration#checkReminders', 'url' => '/reminders', 'verb' => 'POST'],
		['name' => 'expiration#getAllGroupExpirations', 'url' => '/group-expirations', 'verb' => 'POST']
    ]
	
];

