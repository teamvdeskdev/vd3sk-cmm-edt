<?php

// get capabilities
Route::get('/capabilities','NotificationBridge\NotificationBridgeService@capabilities');
// get notifications
Route::get('/notifications','NotificationBridge\NotificationBridgeService@notifications');
// get notification
Route::get('/getnotification','NotificationBridge\NotificationBridgeService@getnotification');
// delete notification
Route::get('/deletenotification','NotificationBridge\NotificationBridgeService@deletenotification');
// delete all notifications
Route::get('/deleteallnotification','NotificationBridge\NotificationBridgeService@deleteallnotification');
// create notification
Route::post('/createnotification','NotificationBridge\NotificationBridgeService@createnotification');