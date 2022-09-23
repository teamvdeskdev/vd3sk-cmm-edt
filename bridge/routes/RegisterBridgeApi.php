<?php

 
//DAV get files folder
//Route::post('/settings','RegisterBridge\RegisterBridgeService@settings');
//Route::get('/','RegisterBridge\RegisterBridgeService@askEmail');
Route::post('/registrationSua','RegisterBridge\RegisterBridgeService@registrationSua');
Route::post('/validateEmail','RegisterBridge\RegisterBridgeService@validateEmail');
Route::get('/getapps','RegisterBridge\RegisterBridgeService@getApps');
Route::post('/checkPin','RegisterBridge\RegisterBridgeService@checkPin');
Route::get('/getUserGuestDetail','RegisterBridge\RegisterBridgeService@getUserGuestDetail');
Route::post('/updateDataUser','RegisterBridge\RegisterBridgeService@updateDataUser');
Route::post('/changePasswordUser','RegisterBridge\RegisterBridgeService@changePasswordUser');
//Route::get('/verify/{token}','RegisterBridge\RegisterBridgeService@verifyToken');
// Route::post('/verify/{token}','RegisterBridge\RegisterBridgeService@createAccount');

// Route::post('/v1/validate','RegisterBridge\RegisterBridgeService@validate');
// Route::post('/v1/status','RegisterBridge\RegisterBridgeService@status');
// Route::post('/v1/register','RegisterBridge\RegisterBridgeService@register');