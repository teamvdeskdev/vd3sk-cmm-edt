<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
//Route::middleware('auth:api')->get('/thumbnail/{x}/{y}/{file}','FileController@thumbnail');
//Route::middleware('auth:api')->post('/files/{path}','FileController@files');
//Route::middleware('auth:api')->get('/recent','FileController@recent');

Route::middleware('auth:api')->post('/files/{path}','FileService@files');

//				'name' => 'API#getThumbnail',
//				'url' => '/api/v1/thumbnail/{x}/{y}/{file}',
//				'verb' => 'GET',
//				'requirements' => ['file' => '.+']
//			
//				'name' => 'API#updateFileTags',
//				'url' => '/api/v1/files/{path}',
//				'verb' => 'POST',
//				'requirements' => ['path' => '.+'],
//			
//				'name' => 'API#getRecentFiles',
//				'url' => '/api/v1/recent/',
//				'verb' => 'GET'
//			
//				'name' => 'API#updateFileSorting',
//				'url' => '/api/v1/sorting',
//				'verb' => 'POST'
//			
//				'name' => 'API#showHiddenFiles',
//				'url' => '/api/v1/showhidden',
//				'verb' => 'POST'
//			
//				'name' => 'API#showGridView',
//				'url' => '/api/v1/showgridview',
//				'verb' => 'POST'
//			
//				'name' => 'API#getGridView',
//				'url' => '/api/v1/showgridview',
//				'verb' => 'GET'
//			
//				'name' => 'view#index',
//				'url' => '/',
//				'verb' => 'GET',
//			
//				'name' => 'ajax#getStorageStats',
//				'url' => '/ajax/getstoragestats.php',
//				'verb' => 'GET',
//			
//				'name' => 'API#toggleShowFolder',
//				'url' => '/api/v1/toggleShowFolder/{key}',
//				'verb' => 'POST'
//			
//				'name' => 'API#getNodeType',
//				'url' => '/api/v1/quickaccess/get/NodeType',
//				'verb' => 'GET',
			