<?php

/**
 * Create your routes in here. The name is the lowercase name of the controller
 * without the controller part, the stuff after the hash is the method.
 * e.g. page#index -> OCA\WorkflowManager\Controller\PageController->index()
 *
 * The controller class has to be registered in the application.php file since
 * it's instantiated in there
 */
return [
  'routes' => [
    ['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
    // ['name' => 'page#LoadWorkflow', 'url' => '/loadWorkflow', 'verb' => 'POST'],
    ['name' => 'workflow_api#preflighted_cors', 'url' => '/api/workflow/{path}', 'verb' => 'OPTIONS', 'requirements' => ['path' => '.+']],
    ['name' => 'workflow_api#Read', 'url' => '/api/read', 'verb' => 'POST'],
    ['name' => 'workflow_api#Load', 'url' => '/api/load', 'verb' => 'POST'],
    ['name' => 'workflow_api#ReadEngine', 'url' => '/api/readengine', 'verb' => 'POST'],
    ['name' => 'workflow_api#Get', 'url' => '/api/get', 'verb' => 'POST'],
    ['name' => 'workflow_api#CreateOrUpdate', 'url' => '/api/createorupdate', 'verb' => 'POST'],
    ['name' => 'workflow_api#Delete', 'url' => '/api/delete', 'verb' => 'POST'],
    ['name' => 'workflow_api#GenerateFromVisio', 'url' => '/api/generatefromvisio', 'verb' => 'POST'],
    ['name' => 'workflow_api#SaveFile', 'url' => '/api/savefile', 'verb' => 'POST'],
    ['name' => 'workflow_api#GetFileContent', 'url' => '/api/file', 'verb' => 'POST'],
    ['name' => 'workflow_api#XPDLParser', 'url' => '/api/xpdlparser', 'verb' => 'POST'],
    ['name' => 'workflow_api#GetFileStream', 'url' => '/api/stream', 'verb' => 'POST'],
    ['name' => 'workflow_api#SignDocument', 'url' => '/api/digitalsignage', 'verb' => 'POST'],
    ['name' => 'workflow_api#GetCellFromId', 'url' => '/api/getcell', 'verb' => 'POST'],
    ['name' => 'workflow_api#SendMail', 'url' => '/api/sendmail', 'verb' => 'POST'],
    ['name' => 'workflow_api#GetCodificaRuoloCurrentNode', 'url' => '/api/getcurrentruolo', 'verb' => 'POST'],
    ['name' => 'workflow_api#GetCodiceRuoloCurrentNode', 'url' => '/api/getcodiceruolo', 'verb' => 'POST'],

    //Engine Auths
    ['name' => 'workflow_api#GetAuthorization', 'url' => '/api/getauthorization', 'verb' => 'POST'],
    ['name' => 'workflow_api#SetAuthorization', 'url' => '/api/setauthorization', 'verb' => 'POST'],
    ['name' => 'workflow_api#StartWorkflow', 'url' => '/api/startworkflow', 'verb' => 'POST'],
    ['name' => 'workflow_api#EndWorkflow', 'url' => '/api/endworkflow', 'verb' => 'POST'],
    ['name' => 'workflow_api#ClearAuthorizations', 'url' => '/api/clearauthorizations', 'verb' => 'POST'],
    ['name' => 'workflow_api#CanMoveNext', 'url' => '/api/next', 'verb' => 'POST'],
    ['name' => 'workflow_api#GetNextCodificaRuolo', 'url' => '/api/getnextruolo', 'verb' => 'POST'],
    //Library Models
    ['name' => 'workflow_model_api#Read', 'url' => '/api/model/read', 'verb' => 'POST'],
    ['name' => 'workflow_model_api#Get', 'url' => '/api/model/get', 'verb' => 'POST'],
    ['name' => 'workflow_model_api#CreateOrUpdate', 'url' => '/api/model/createorupdate', 'verb' => 'POST'],
    ['name' => 'workflow_model_api#Delete', 'url' => '/api/model/delete', 'verb' => 'POST'],
    //Logs
    ['name' => 'workflow_logs_api#Get', 'url' => '/api/logs/get', 'verb' => 'POST'],
    ['name' => 'workflow_logs_api#Create', 'url' => '/api/logs/create', 'verb' => 'POST'],
    //User
    ['name' => 'user#LoadLdapSearchUsers', 'url' => '/api/user/search', 'verb' => 'POST'],
    ['name' => 'user#GetUsers', 'url' => '/api/user/get', 'verb' => 'POST'],
    ['name' => 'user#GetCurrentUser', 'url' => '/api/user/read', 'verb' => 'POST'],
    ['name' => 'sap#LoadSapUsers', 'url' => '/api/sap/loadusers', 'verb' => 'POST'],
    //Groups
    ['name' => 'user#LoadGroup', 'url' => '/api/group/load', 'verb' => 'POST'],
    ['name' => 'user#GetMailNotification', 'url' => '/api/group/mail/get', 'verb' => 'POST'],
    //settings
    ['name' => 'settings#preflighted_cors', 'url' => '/filemanager/{path}', 'verb' => 'OPTIONS', 'requirements' => ['path' => '.+']],
    ['name' => 'settings#index', 'url' => '/settings', 'verb' => 'POST'],
    ['name' => 'settings#Update', 'url'  => '/settings/save',    'verb' => 'POST'],
    ['name' => 'settings#Load', 'url'  => '/settings/load',    'verb' => 'POST'],
    
    
    // ['name' => 'workflow_api#CheckRitardoEsecuzione', 'url'  => '/api/ritardo',    'verb' => 'POST'],
  ],

  'ocs' => [
    ['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
    // ['name' => 'page#LoadWorkflow', 'url' => '/loadWorkflow', 'verb' => 'POST'],
    ['name' => 'workflow_api#preflighted_cors', 'url' => '/api/workflow/{path}', 'verb' => 'OPTIONS', 'requirements' => ['path' => '.+']],
    ['name' => 'workflow_api#Read', 'url' => '/api/read', 'verb' => 'POST'],
    ['name' => 'workflow_api#Load', 'url' => '/api/load', 'verb' => 'POST'],
    ['name' => 'workflow_api#ReadEngine', 'url' => '/api/readengine', 'verb' => 'POST'],
    ['name' => 'workflow_api#Get', 'url' => '/api/get', 'verb' => 'POST'],
    ['name' => 'workflow_api#CreateOrUpdate', 'url' => '/api/createorupdate', 'verb' => 'POST'],
    ['name' => 'workflow_api#Delete', 'url' => '/api/delete', 'verb' => 'POST'],
    ['name' => 'workflow_api#GenerateFromVisio', 'url' => '/api/generatefromvisio', 'verb' => 'POST'],
    ['name' => 'workflow_api#SaveFile', 'url' => '/api/savefile', 'verb' => 'POST'],
    ['name' => 'workflow_api#GetFileContent', 'url' => '/api/file', 'verb' => 'POST'],
    ['name' => 'workflow_api#XPDLParser', 'url' => '/api/xpdlparser', 'verb' => 'POST'],
    ['name' => 'workflow_api#GetFileStream', 'url' => '/api/stream', 'verb' => 'POST'],
    ['name' => 'workflow_api#SignDocument', 'url' => '/api/digitalsignage', 'verb' => 'POST'],
    ['name' => 'workflow_api#GetCellFromId', 'url' => '/api/getcell', 'verb' => 'POST'],
    ['name' => 'workflow_api#SendMail', 'url' => '/api/sendmail', 'verb' => 'POST'],
    ['name' => 'workflow_api#GetCodificaRuoloCurrentNode', 'url' => '/api/getcurrentruolo', 'verb' => 'POST'],
    ['name' => 'workflow_api#GetCodiceRuoloCurrentNode', 'url' => '/api/getcodiceruolo', 'verb' => 'POST'],

    //Engine Auths
    ['name' => 'workflow_api#GetAuthorization', 'url' => '/api/getauthorization', 'verb' => 'POST'],
    ['name' => 'workflow_api#SetAuthorization', 'url' => '/api/setauthorization', 'verb' => 'POST'],
    ['name' => 'workflow_api#StartWorkflow', 'url' => '/api/startworkflow', 'verb' => 'POST'],
    ['name' => 'workflow_api#EndWorkflow', 'url' => '/api/endworkflow', 'verb' => 'POST'],
    ['name' => 'workflow_api#ClearAuthorizations', 'url' => '/api/clearauthorizations', 'verb' => 'POST'],
    ['name' => 'workflow_api#CanMoveNext', 'url' => '/api/next', 'verb' => 'POST'],
    ['name' => 'workflow_api#GetNextCodificaRuolo', 'url' => '/api/getnextruolo', 'verb' => 'POST'],
    //Library Models
    ['name' => 'workflow_model_api#Read', 'url' => '/api/model/read', 'verb' => 'POST'],
    ['name' => 'workflow_model_api#Get', 'url' => '/api/model/get', 'verb' => 'POST'],
    ['name' => 'workflow_model_api#CreateOrUpdate', 'url' => '/api/model/createorupdate', 'verb' => 'POST'],
    ['name' => 'workflow_model_api#Delete', 'url' => '/api/model/delete', 'verb' => 'POST'],
    //Logs
    ['name' => 'workflow_logs_api#Get', 'url' => '/api/logs/get', 'verb' => 'POST'],
    ['name' => 'workflow_logs_api#Create', 'url' => '/api/logs/create', 'verb' => 'POST'],
    //User
    ['name' => 'user#LoadLdapSearchUsers', 'url' => '/api/user/search', 'verb' => 'POST'],
    ['name' => 'user#GetUsers', 'url' => '/api/user/get', 'verb' => 'POST'],
    ['name' => 'user#GetCurrentUser', 'url' => '/api/user/read', 'verb' => 'POST'],
    ['name' => 'sap#LoadSapUsers', 'url' => '/api/sap/loadusers', 'verb' => 'POST'],
    //Groups
    ['name' => 'user#LoadGroup', 'url' => '/api/group/load', 'verb' => 'POST'],
    ['name' => 'user#GetMailNotification', 'url' => '/api/group/mail/get', 'verb' => 'POST'],
    //settings
    ['name' => 'settings#preflighted_cors', 'url' => '/filemanager/{path}', 'verb' => 'OPTIONS', 'requirements' => ['path' => '.+']],
    ['name' => 'settings#index', 'url' => '/settings', 'verb' => 'POST'],
    ['name' => 'settings#Update', 'url'  => '/settings/save',    'verb' => 'POST'],
    ['name' => 'settings#Load', 'url'  => '/settings/load',    'verb' => 'POST'],
    
    
    // ['name' => 'workflow_api#CheckRitardoEsecuzione', 'url'  => '/api/ritardo',    'verb' => 'POST'],
  ]
];
