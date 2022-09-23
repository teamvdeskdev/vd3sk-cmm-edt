<?php

/* Mobile Calls*/ 
Route::post('/flow/client/{token}','VdeskIntegrationBridge\VdeskIntegrationBridgeService@flowV2MobileFlow');

/* VDesk and Shared Calls */ 
Route::post('/','VdeskIntegrationBridge\VdeskIntegrationBridgeService@flowV2Init');
Route::get('/flow/{token}','VdeskIntegrationBridge\VdeskIntegrationBridgeService@flowV2Flow');
Route::post('/poll','VdeskIntegrationBridge\VdeskIntegrationBridgeService@flowV2Poll');
Route::post('/grant','VdeskIntegrationBridge\VdeskIntegrationBridgeService@flowV2Grant');
Route::get('/grant','VdeskIntegrationBridge\VdeskIntegrationBridgeService@flowV2GrantPage');
Route::get('/flow','VdeskIntegrationBridge\VdeskIntegrationBridgeService@flowV2ShowAuthPickerPage');
