<?php
Route::post('/{first}', 'MailBridge\MailBridgeService@postRequestProxy');
Route::post('/{first}/{second}', 'MailBridge\MailBridgeService@postRequestProxy');
Route::post('/{first}/{second}/{third}', 'MailBridge\MailBridgeService@postRequestProxy');
Route::post('/{first}/{second}/{third}/{fourth}', 'MailBridge\MailBridgeService@postRequestProxy');
Route::post('/{first}/{second}/{third}/{fourth}/{fifth}', 'MailBridge\MailBridgeService@postRequestProxy');

Route::get('/{first}', 'MailBridge\MailBridgeService@getRequestProxy');
Route::get('/{first}/{second}', 'MailBridge\MailBridgeService@getRequestProxy');
Route::get('/{first}/{second}/{third}', 'MailBridge\MailBridgeService@getRequestProxy');
Route::get('/{first}/{second}/{third}/{fourth}', 'MailBridge\MailBridgeService@getRequestProxy');
Route::get('/{first}/{second}/{third}/{fourth}/{fifth}', 'MailBridge\MailBridgeService@getRequestProxy');

// Route::post('/get','MailBridge\MailBridgeService@get');
// Route::post('/setflag','MailBridge\MailBridgeService@setflag');
// Route::post('/move','MailBridge\MailBridgeService@moveMail');
// Route::post('/delete','MailBridge\MailBridgeService@deleteMail');
// Route::post('/send','MailBridge\MailBridgeService@send');
// Route::post('/folder/get','MailBridge\MailBridgeService@getFolder');
// Route::post('/folder/create','MailBridge\MailBridgeService@createFolder');
// Route::post('/folder/delete','MailBridge\MailBridgeService@deleteFolder');
// Route::post('/folder/rename','MailBridge\MailBridgeService@renameFolder');
// Route::post('/getchanges','MailBridge\MailBridgeService@getChanges');
// Route::post('/emptytrash','MailBridge\MailBridgeService@emptyTrash');
// Route::get('/getpecfilelist','MailBridge\MailBridgeService@getPecFileList');
// Route::post('/saveattachmentbyid','MailBridge\MailBridgeService@saveAttachmentToDriveById');

// /**
//  * USER CONFIG ROUTES
//  */
// Route::get('/config/account/get','MailBridge\MailBridgeService@getConfig');
// Route::post('/config/account/set','MailBridge\MailBridgeService@setConfig');
// Route::post('/config/account/delete','MailBridge\MailBridgeService@deleteAccount');
// Route::post('/config/account/add','MailBridge\MailBridgeService@addAccount');
// Route::post('/config/account/update','MailBridge\MailBridgeService@updateAccount');
// Route::post('/config/account/activation','MailBridge\MailBridgeService@activateAccount');
// Route::get('/config/account/list','MailBridge\MailBridgeService@getAccount');
// /**
//  * ADMIN CONFIG ROUTES
//  */
// Route::get('/getdomains','MailBridge\MailBridgeService@getDomains');
// Route::get('/config/admin/get','MailBridge\MailBridgeService@getAdminConfig');
// Route::post('/config/admin/set','MailBridge\MailBridgeService@setAdminConfig');
// Route::post('/config/admin/domain/add','MailBridge\MailBridgeService@addDomain');
// Route::post('/config/admin/domain/delete','MailBridge\MailBridgeService@deleteDomain');
