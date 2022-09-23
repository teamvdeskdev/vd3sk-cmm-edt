<?php


Route::get('/token','Login\LoginService@token');

Route::get('/home','Login\LoginService@home');

Route::get('/logout','Login\LoginService@logout');

Route::post('/login','Login\LoginService@login');

Route::post('/loginTest','Login\LoginService@loginTest');


Route::post('/password-recovery','Login\LoginService@password_recovery');


//confirm password
Route::post('/confirmTest','Login\LoginService@confirmTest');

//confirm password
Route::post('/confirm','Login\LoginService@confirm');
//Twofactor auth by admin
Route::post('/twofactorauth','Login\LoginService@twofactorauth');
//Twofactor enable setting by yourself
Route::post('/twofactorenable','Login\LoginService@twofactorenable');
//Twofactor authentication code
Route::post('/challenge','Login\LoginService@challenge');
//confirm password
//Route::post('/confirm','Login\LoginService@confirm');

// 
Route::post('/validateemail','Login\LoginService@validateemail');
Route::get('/verifytoken','Login\LoginService@verifytoken');

Route::get('/qrcodeimage','Login\LoginService@qrcodeimage');
Route::get('/trueip','Login\LoginService@trueip');