<?php


//get all
Route::get('/all','ActivityBridge\ActivityBridgeService@all');
//get list filter
Route::get('/filters','ActivityBridge\ActivityBridgeService@filters');
//get filter
Route::get('/filter','ActivityBridge\ActivityBridgeService@filter');
//get byyou
Route::get('/byyou','ActivityBridge\ActivityBridgeService@byyou');
//get byothers
Route::get('/byothers','ActivityBridge\ActivityBridgeService@byothers');
//get favorities
Route::get('/favorities','ActivityBridge\ActivityBridgeService@favorities');
//get filechanges
Route::get('/filechanges','ActivityBridge\ActivityBridgeService@filechanges');
//get security
Route::get('/security','ActivityBridge\ActivityBridgeService@security');
//get fileshares
Route::get('/fileshares','ActivityBridge\ActivityBridgeService@fileshares');
//get calendar
Route::get('/calendar','ActivityBridge\ActivityBridgeService@calendar');
//get todos
Route::get('/todos','ActivityBridge\ActivityBridgeService@todos');
//get comments
Route::get('/comments','ActivityBridge\ActivityBridgeService@comments');
