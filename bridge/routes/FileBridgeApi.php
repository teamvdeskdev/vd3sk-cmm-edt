<?php

 
//DAV get files folder
Route::get('/files','FilesBridge\FileBridgeService@files');
//DAV mobile get files folder
Route::propfind('/files','FilesBridge\FileBridgeService@files');



//DAV get list favorities   
Route::get('/favorites','FilesBridge\FileBridgeService@favorites');
//DAV mobile get list favorities   
Route::propfind('/favorites','FilesBridge\FileBridgeService@favorites');

//DAV list file user with tag    
Route::get('/tags','FilesBridge\FileBridgeService@tags');
//DAV list file user with tag    
Route::propfind('/tags','FilesBridge\FileBridgeService@tags');

//DAV get list tags   
Route::get('/listtags','FilesBridge\FileBridgeService@listtags');
//DAV mobile get list tags   
Route::propfind('/listtags','FilesBridge\FileBridgeService@listtags');

//remove files folder
Route::get('/removefavorities','FilesBridge\FileBridgeService@removefavorities');

//DAV get files folder
Route::get('/filestrash','FilesBridge\FileBridgeService@filestrash');
//DAV mobile get files folder
Route::propfind('/filestrash','FilesBridge\FileBridgeService@filestrash');

//DAV get files trash
Route::get('/trash','FilesBridge\FileBridgeService@trash');
//DAV mobile get files trash
Route::propfind('/trash','FilesBridge\FileBridgeService@trash');

//DAV get files trash
Route::get('/restore','FilesBridge\FileBridgeService@restore');
//DAV mobile get files trash
Route::move('/restore','FilesBridge\FileBridgeService@restore');

//DAV get files trash
Route::get('/trashbin','FilesBridge\FileBridgeService@trashbin');
//DAV mobile get files trash
Route::delete('/trashbin','FilesBridge\FileBridgeService@trashbin');

//DAV get file
Route::get('/getfile','FilesBridge\FileBridgeService@getfile');
//DAV mobile get file
Route::propfind('/getfile','FilesBridge\FileBridgeService@getfile');

//DAV delete file
Route::get('/delete','FilesBridge\FileBridgeService@delete');
//DAV delete file
Route::delete('/delete','FilesBridge\FileBridgeService@delete');

//DAV create folder
Route::get('/createfolder','FilesBridge\FileBridgeService@createfolder');
//DAV create folder
Route::mkcol('/createfolder','FilesBridge\FileBridgeService@createfolder');

//DAV move file
Route::get('/move','FilesBridge\FileBridgeService@move');
//DAV mobile move file
Route::move('/move','FilesBridge\FileBridgeService@move');

//DAV copy file
Route::get('/copy','FilesBridge\FileBridgeService@copy');
//DAV mobile copy file
Route::copy('/copy','FilesBridge\FileBridgeService@copy');

//DAV get version
Route::get('/version','FilesBridge\FileBridgeService@version');
//DAV mobile get version
Route::propfind('/version','FilesBridge\FileBridgeService@version');

//DAV get version
Route::get('/restoreversion','FilesBridge\FileBridgeService@restoreversion');
//DAV mobile get version
Route::move('/restoreversion','FilesBridge\FileBridgeService@restoreversion');


//get session document
Route::get('/createsession','FilesBridge\FileBridgeService@createsession');
//get fetch document
Route::get('/fetch','FilesBridge\FileBridgeService@fetch');

//get session document
Route::post('/push','FilesBridge\FileBridgeService@push');
//get fetch document
Route::post('/sync','FilesBridge\FileBridgeService@sync');

//get closesession 
Route::get('/closesession','FilesBridge\FileBridgeService@closesession');
 

//get storage stat
Route::get('/getstoragestat','FilesBridge\FileBridgeService@getstoragestat');
//get file
Route::get('/getresourcefile','FilesBridge\FileBridgeService@getresourcefile');
//get files recent
Route::get('/recents','FilesBridge\FileBridgeService@recents');
//get files recommendations
Route::get('/recommendations','FilesBridge\FileBridgeService@recommendations');
//get files share with others or share with you
Route::get('/sharedwith','FilesBridge\FileBridgeService@sharedwith');
//get files share with you by remote
Route::get('/sharedwithyouremote','FilesBridge\FileBridgeService@sharedwithyouremote');
//get shareesrecommended  
Route::get('/shareesrecommended','FilesBridge\FileBridgeService@shareesrecommended');

//get files deleted shares
Route::get('/deletedshares','FilesBridge\FileBridgeService@deletedshares');

Route::get('/add-to-favorite','FilesBridge\FileBridgeService@add_to_favorite');
Route::get('/download','FilesBridge\FileBridgeService@download');
Route::get('/download-folder','FilesBridge\FileBridgeService@download_folder');
Route::get('/filebody','FilesBridge\FileBridgeService@filebody');
Route::get('/urlfile','FilesBridge\FileBridgeService@urlfile');


Route::get('/downloaddav','FilesBridge\FileBridgeService@downloaddav');

//DAV upload file
Route::post('/upload','FilesBridge\FileBridgeService@upload');
Route::post('/uploadgroup','FilesBridge\FileBridgeService@uploadgroup');

//DAV mobile upload file
Route::put('/upload','FilesBridge\FileBridgeService@upload');

//DAV upload file
Route::post('/newfile','FilesBridge\FileBridgeService@newfile');
//DAV mobile upload file
Route::put('/newfile','FilesBridge\FileBridgeService@newfile');

//DAV upload file
Route::post('/getnewfile','FilesBridge\FileBridgeService@getnewfile');
//DAV mobile upload file
Route::put('/getnewfile','FilesBridge\FileBridgeService@getnewfile');


//Route::get('/shares','FilesBridge\FileBridgeService@shares');
//get shares with others of folder or file
Route::get('/filesreshares','FilesBridge\FileBridgeService@filesreshares');
//Export Shares data
Route::get('/exportshares','FilesBridge\FileBridgeService@exportshares');
//get shares with me of folder or file
Route::get('/filessharedwithme','FilesBridge\FileBridgeService@filessharedwithme');
//get users to share file or folder
Route::get('/sharedsearch','FilesBridge\FileBridgeService@sharedsearch');
//insert new share for file and user
Route::post('/shares','FilesBridge\FileBridgeService@shares');

//insert new share for file and user
Route::get('/convertlink','FilesBridge\FileBridgeService@convertlink');

//update  share for file and user
Route::post('/updateshare','FilesBridge\FileBridgeService@updateshare');
//delete share for file and user
Route::get('/deleteshare','FilesBridge\FileBridgeService@deleteshare');
// add tag  
Route::post('/addtag','FilesBridge\FileBridgeService@addtag');
// add tag to file
Route::post('/addtagtofile','FilesBridge\FileBridgeService@addtagtofile');
// add tag to file
Route::get('/removetagtofile','FilesBridge\FileBridgeService@removetagtofile');

// get detail file
Route::get('/detail','FilesBridge\FileBridgeService@detail');


//app
//get files pec
Route::get('/pec','FilesBridge\FileBridgeService@pec');
//get files labels
Route::get('/labels','FilesBridge\FileBridgeService@labels');
//get external storage labels
Route::get('/mounts','FilesBridge\FileBridgeService@mounts');


//get search
Route::get('/search','FilesBridge\FileBridgeService@search');
//get body file
Route::get('/getbodyfile','FilesBridge\FileBridgeService@getbodyfile');

//get body file
Route::get('/getbodyfileurl','FilesBridge\FileBridgeService@getbodyfileurl');

//get preview
Route::get('/preview','FilesBridge\FileBridgeService@preview');
//get thumbnail
Route::get('/thumbnail','FilesBridge\FileBridgeService@thumbnail');
 
//Route::get('/token','Login\LoginService@token');
//
//Route::get('/home','Login\LoginService@home');
//
//Route::get('/logout','Login\LoginService@logout');
//
//Route::post('/login','Login\LoginService@login');
//
//Route::post('/password-recovery','Login\LoginService@password_recovery');

//DAV get files folder
Route::get('/filespublic','FilesBridge\FileBridgeService@filespublic');
//DAV mobile get files folder
Route::propfind('/filespublic','FilesBridge\FileBridgeService@filespublic');

//DAV delete file
Route::get('/deletepublic','FilesBridge\FileBridgeService@deletepublic');
//DAV delete file
Route::delete('/deletepublic','FilesBridge\FileBridgeService@deletepublic');

//DAV create folder
Route::get('/createfolderpublic','FilesBridge\FileBridgeService@createfolderpublic');
//DAV create folder
Route::mkcol('/createfolderpublic','FilesBridge\FileBridgeService@createfolderpublic');

//DAV move file and rename
Route::get('/movepublic','FilesBridge\FileBridgeService@movepublic');
//DAV mobile move file
Route::move('/movepublic','FilesBridge\FileBridgeService@movepublic');

//DAV copy file
Route::get('/copypublic','FilesBridge\FileBridgeService@copypublic');
//DAV mobile copy file
Route::copy('/copypublic','FilesBridge\FileBridgeService@copypublic');

//DAV upload file
Route::post('/uploadpublic','FilesBridge\FileBridgeService@uploadpublic');
//DAV mobile upload file
Route::put('/uploadpublic','FilesBridge\FileBridgeService@uploadpublic');

//DAV upload file
Route::post('/newfilepublic','FilesBridge\FileBridgeService@newfilepublic');
//DAV mobile upload file
Route::put('/newfilepublic','FilesBridge\FileBridgeService@newfilepublic');

//DAV   file
Route::get('/download-folder-public','FilesBridge\FileBridgeService@download_folder_public');

//DAV   file
Route::get('/download-public','FilesBridge\FileBridgeService@download_public');

//DAV upload file
Route::get('/download-public-password','FilesBridge\FileBridgeService@download_public_password');

//DAV upload file
Route::post('/downloadshare_public','FilesBridge\FileBridgeService@downloadshare_public');

Route::get('/viewpublic','FilesBridge\FileBridgeService@viewpublic');
 

Route::post('/getpassword','FilesBridge\FileBridgeService@getpassword');

 
Route::get('/config_onlyoffice','FilesBridge\FileBridgeService@config_onlyoffice');

Route::post('/new_onlyoffice','FilesBridge\FileBridgeService@new_onlyoffice');

Route::post('/new_onlyoffice_password','FilesBridge\FileBridgeService@new_onlyoffice_password');

Route::post('/save_onlyoffice','FilesBridge\FileBridgeService@save_onlyoffice');

Route::post('/convert_onlyoffice','FilesBridge\FileBridgeService@convert_onlyoffice');

Route::post('/truck_onlyoffice','FilesBridge\FileBridgeService@truck_onlyoffice');

Route::get('/getfile_onlyoffice','FilesBridge\FileBridgeService@getfile_onlyoffice');

Route::get('/getfile_public_onlyoffice','FilesBridge\FileBridgeService@getfile_public_onlyoffice');

Route::get('/url_onlyoffice','FilesBridge\FileBridgeService@url_onlyoffice');

Route::get('/download_onlyoffice','FilesBridge\FileBridgeService@download_onlyoffice');

Route::get('/empty_onlyoffice','FilesBridge\FileBridgeService@empty_onlyoffice');

//allegati
Route::post('/shareandcopy','FilesBridge\FileBridgeService@shareAndCopy');
Route::post('/sharewithvmeet','FilesBridge\FileBridgeService@shareWithVMeet');

Route::post('/attachFromVshare','FilesBridge\FileBridgeService@attachFromVshare');
Route::post('/shareFromVshare','FilesBridge\FileBridgeService@shareFromVshare');

Route::get('/closeproject','FilesBridge\FileBridgeService@closeproject');
Route::get('/finddatecloseproject','FilesBridge\FileBridgeService@finddatecloseproject');
Route::get('/filesresharesdouble','FilesBridge\FileBridgeService@filesresharesdouble');   

// get detail file
Route::get('/getsoursefileid','FilesBridge\FileBridgeService@getsoursefileid');
Route::get('/getinfofileid','FilesBridge\FileBridgeService@getinfofileid');

//DAV delete file
Route::get('/deletefileingroup','FilesBridge\FileBridgeService@deletefileingroup');
//DAV delete file
Route::delete('/deletefileingroup','FilesBridge\FileBridgeService@deletefileingroup');
