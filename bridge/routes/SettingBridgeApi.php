<?php


//get Apps
Route::get('/overview/applistupdate','SettingBridge\SettingBridgeService@applistupdate');
Route::get('/overview/ocmprovider','SettingBridge\SettingBridgeService@ocmprovider');
Route::get('/overview/ocsprovider','SettingBridge\SettingBridgeService@ocsprovider');
Route::get('/overview/checksetup','SettingBridge\SettingBridgeService@checksetup');

Route::get('/info/avatar/currentavatar','SettingBridge\SettingBridgeService@currentavatar');
Route::get('/info/avatar/getavatar','SettingBridge\SettingBridgeService@getavatar');
Route::post('/info/avatar/uploadavatar','SettingBridge\SettingBridgeService@uploadavatar');
Route::post('/info/avatar/cropped','SettingBridge\SettingBridgeService@cropped');
Route::get('/info/avatar/deleteavatar','SettingBridge\SettingBridgeService@deleteavatar');

Route::post('/user/setdisplayname','SettingBridge\SettingBridgeService@setdisplayname');
Route::post('/user/settinguser','SettingBridge\SettingBridgeService@settinguser');
Route::get('/user/userslist','SettingBridge\SettingBridgeService@userslist');

Route::post('/security/changepassword','SettingBridge\SettingBridgeService@changepassword');
Route::post('/security/backupcode','SettingBridge\SettingBridgeService@backupcode');

Route::post('/activity/personalactivitysetting','SettingBridge\SettingBridgeService@personalactivitysetting');
Route::post('/accessibility/theme','SettingBridge\SettingBridgeService@theme');
Route::post('/accessibility/font','SettingBridge\SettingBridgeService@font');
//BASIC
Route::post('/basic/credential','SettingBridge\SettingBridgeService@credential');
Route::post('/basic/mailsetting','SettingBridge\SettingBridgeService@mailsetting');
Route::post('/basic/mailtest','SettingBridge\SettingBridgeService@mailtest');
Route::post('/basic/notificationgroup','SettingBridge\SettingBridgeService@notificationgroup');
//SHARING 
Route::post('/sharing/shareapienabled','SettingBridge\SettingBridgeService@shareapienabled');
Route::post('/sharing/shareapiallowlinks','SettingBridge\SettingBridgeService@shareapiallowlinks');
Route::post('/sharing/shareapiallowpublicupload','SettingBridge\SettingBridgeService@shareapiallowpublicupload');
Route::post('/sharing/shareapienablelinkpasswordbydefault','SettingBridge\SettingBridgeService@shareapienablelinkpasswordbydefault');
Route::post('/sharing/shareapienforcelinkspassword','SettingBridge\SettingBridgeService@shareapienforcelinkspassword');
Route::post('/sharing/shareapidefaultexpiredate','SettingBridge\SettingBridgeService@shareapidefaultexpiredate');
Route::post('/sharing/shareapienforceexpiredate','SettingBridge\SettingBridgeService@shareapienforceexpiredate');
Route::post('/sharing/shareapiexpireafterndays','SettingBridge\SettingBridgeService@shareapiexpireafterndays');
Route::post('/sharing/shareapiallowresharing','SettingBridge\SettingBridgeService@shareapiallowresharing');
Route::post('/sharing/shareapiallowgroupsharing','SettingBridge\SettingBridgeService@shareapiallowgroupsharing');
Route::post('/sharing/shareapionlysharewithgroupmembers','SettingBridge\SettingBridgeService@shareapionlysharewithgroupmembers');
Route::post('/sharing/shareapiexcludegroups','SettingBridge\SettingBridgeService@shareapiexcludegroupss');
Route::post('/sharing/shareapiexcludegroupslist','SettingBridge\SettingBridgeService@shareapiexcludegroupslist');
Route::post('/sharing/shareapiallowsharedialoguserenumeration','SettingBridge\SettingBridgeService@shareapiallowsharedialoguserenumeration');
Route::post('/sharing/shareapipubliclinkdisclaimertext','SettingBridge\SettingBridgeService@shareapipubliclinkdisclaimertext');
Route::delete('/sharing/shareapipubliclinkdisclaimertextdelete','SettingBridge\SettingBridgeService@shareapipubliclinkdisclaimertextdelete');
Route::post('/sharing/shareapidefaultpermissioncancreate','SettingBridge\SettingBridgeService@shareapidefaultpermissioncancreate');
Route::post('/sharing/shareapidefaultpermissioncanupdate','SettingBridge\SettingBridgeService@shareapidefaultpermissioncanupdate');
Route::post('/sharing/shareapidefaultpermissioncandelete','SettingBridge\SettingBridgeService@shareapidefaultpermissioncandelete');
Route::post('/sharing/shareapidefaultpermissioncanshare','SettingBridge\SettingBridgeService@shareapidefaultpermissioncanshare');
Route::post('/sharing/shareapidefaultpermissions','SettingBridge\SettingBridgeService@shareapidefaultpermissions');
 
 //EXTERNAL STORAGE
Route::post('/fileexternal/displaynames','SettingBridge\SettingBridgeService@displaynames');
Route::get('/fileexternal/globalstoragegetall','SettingBridge\SettingBridgeService@globalstoragegetall');
Route::get('/fileexternal/globalstorageget','SettingBridge\SettingBridgeService@globalstorageget');
Route::delete('/fileexternal/globalstoragedelete','SettingBridge\SettingBridgeService@globalstoragedelete');
Route::post('/fileexternal/globalstorageupdate','SettingBridge\SettingBridgeService@globalstorageupdate');
Route::post('/fileexternal/globalstoragecreate','SettingBridge\SettingBridgeService@globalstoragecreate');
 

Route::get('/security/getstatus','SettingBridge\SettingBridgeService@getstatus');
Route::post('/security/setencrypthomestorage','SettingBridge\SettingBridgeService@setencrypthomestorage');


Route::post('/privacy/fulldiskencryption','SettingBridge\SettingBridgeService@fulldiskencryption');

Route::get('/groupfolder/getsearch','SettingBridge\SettingBridgeService@getsearch');
Route::get('/groupfolder/getfolder','SettingBridge\SettingBridgeService@getfolder');
Route::get('/groupfolder/getfolderid','SettingBridge\SettingBridgeService@getfolderid');
Route::post('/groupfolder/createfolder','SettingBridge\SettingBridgeService@createfolder');
Route::post('/groupfolder/addpermission','SettingBridge\SettingBridgeService@addpermission');
Route::get('/groupfolder/deletefolder','SettingBridge\SettingBridgeService@deletefolder');
Route::post('/groupfolder/addfolder','SettingBridge\SettingBridgeService@addfolder');
Route::get('/groupfolder/deletegroupfolder','SettingBridge\SettingBridgeService@deletegroupfolder');

Route::post('/groupfolder/addquota','SettingBridge\SettingBridgeService@addquota');
Route::post('/groupfolder/addacl','SettingBridge\SettingBridgeService@addacl');
Route::post('/groupfolder/manageacl','SettingBridge\SettingBridgeService@manageacl');
Route::post('/groupfolder/updatefolder','SettingBridge\SettingBridgeService@updatefolder');

Route::get('/logging/getlog','SettingBridge\SettingBridgeService@getlog');

Route::post('/onlyoffice/address_onlyoffice','SettingBridge\SettingBridgeService@address_onlyoffice');
Route::post('/onlyoffice/common_onlyoffice','SettingBridge\SettingBridgeService@common_onlyoffice');
Route::post('/onlyoffice/watermark_onlyoffice','SettingBridge\SettingBridgeService@watermark_onlyoffice');
Route::get('/onlyoffice/get_onlyoffice','SettingBridge\SettingBridgeService@get_onlyoffice');

Route::get('/fileexternal/getbackends','SettingBridge\SettingBridgeService@getbackends');
Route::get('/fileexternal/getmechanisms','SettingBridge\SettingBridgeService@getmechanisms');
Route::post('/fileexternal/saveglobalcredentials','SettingBridge\SettingBridgeService@saveglobalcredentials');
Route::get('/fileexternal/getglobalcredential','SettingBridge\SettingBridgeService@getglobalcredential');

Route::get('/onlyoffice/getUrlServerOnlyOffice','SettingBridge\SettingBridgeService@getUrlServerOnlyOffice');
Route::post('/onlyoffice/updateUrlServerOnlyOffice','SettingBridge\SettingBridgeService@updateUrlServerOnlyOffice');

Route::get('/security/getDeviceSession','SettingBridge\SettingBridgeService@getDeviceSession');
Route::post('/security/canceldevices','SettingBridge\SettingBridgeService@canceldevices');
Route::delete('/security/revokedevices','SettingBridge\SettingBridgeService@revokedevices');
Route::post('/security/updatedevices','SettingBridge\SettingBridgeService@updatedevices');
