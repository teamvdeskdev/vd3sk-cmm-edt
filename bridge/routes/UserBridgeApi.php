<?php


Route::get('/searchuser','UserBridge\UserBridgeService@searchuser');

Route::get('/datauser','UserBridge\UserBridgeService@datauser');

Route::delete('/deleteuser','UserBridge\UserBridgeService@deleteuser');

Route::get('/searchgroup','UserBridge\UserBridgeService@searchgroup');

Route::get('/membersgroup','UserBridge\UserBridgeService@membersgroup');


//USER
/////////////////////////////////////////////////////////////////////////////////////////////////////////
    

Route::get('/getusers','UserBridge\UserBridgeService@getusers');

Route::get('/getusersdetails','UserBridge\UserBridgeService@getusersdetails');

Route::post('/adduser','UserBridge\UserBridgeService@adduser');

Route::get('/getuser','UserBridge\UserBridgeService@getuser');

Route::get('/currentuser','UserBridge\UserBridgeService@currentuser'); 

Route::get('/geteditablefields','UserBridge\UserBridgeService@geteditablefields');

Route::put('/updateuser','UserBridge\UserBridgeService@updateuser');

Route::get('/wipeuserdevices','UserBridge\UserBridgeService@wipeuserdevices'); 

Route::put('/enableuser','UserBridge\UserBridgeService@enableuser');

Route::put('/disableuser','UserBridge\UserBridgeService@disableuser');

//GROUP
/////////////////////////////////////////////////////////////////////////////////////////////////////////
Route::get('/usersgroup','UserBridge\UserBridgeService@usersgroup');

Route::post('/addtogroup','UserBridge\UserBridgeService@addtogroup');

Route::delete('/removefromgroup','UserBridge\UserBridgeService@removefromgroup');

Route::get('/getgroups','UserBridge\UserBridgeService@getgroups'); 

Route::get('/getgroupdetails','UserBridge\UserBridgeService@getgroupdetails'); 

Route::get('/getgroupusers','UserBridge\UserBridgeService@getgroupusers');

Route::get('/getgroupuserdetail','UserBridge\UserBridgeService@getgroupuserdetail'); 

Route::get('/getsubadminofgroup','UserBridge\UserBridgeService@getsubadminofgroup'); 

Route::post('/addgroup','UserBridge\UserBridgeService@addgroup');

Route::get('/getgroup','UserBridge\UserBridgeService@getgroup'); 
 
Route::delete('/deletegroup','UserBridge\UserBridgeService@deletegroup');

Route::get('/getuserssubadmin','UserBridge\UserBridgeService@getuserssubadmin'); 
    
Route::post('/addsubadmin','UserBridge\UserBridgeService@addsubadmin');

Route::delete('/deletesubadmin','UserBridge\UserBridgeService@deletesubadmin');

Route::post('/resendWelcomeMessage','UserBridge\UserBridgeService@resendWelcomeMessage');


// get list language
Route::get('/getlistlanguage','UserBridge\UserBridgeService@getlistlanguage'); 
// get list locale
Route::get('/getlistlocale','UserBridge\UserBridgeService@getlistlocale'); 

Route::get('/getusernoadmin','UserBridge\UserBridgeService@getusernoadmin');

Route::get('/searchusernoadmin','UserBridge\UserBridgeService@searchusernoadmin');
