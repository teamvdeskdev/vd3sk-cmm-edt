<?php

/**
 * Create your routes in here. The name is the lowercase name of the controller
 * without the controller part, the stuff after the hash is the method.
 * e.g. page#index -> OCA\Wfam\Controller\PageController->index()
 *
 * The controller class has to be registered in the application.php file since
 * it's instantiated in there
 */
return [
    'routes' => [
        ['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
        ['name' => 'page#do_echo', 'url' => '/echo', 'verb' => 'POST'],
        ['name' => 'cruscotto#index', 'url' => '/cruscotto', 'verb' => 'POST'],
        ['name' => 'gestionewfa#index', 'url' => '/gestione_wfa', 'verb' => 'POST'],
        ['name' => 'definisciwfa#index', 'url' => '/definisci_wfa', 'verb' => 'POST'],
        ['name' => 'elementi_richiestawfa#index', 'url' => '/elementiRichiesta_wfa', 'verb' => 'POST'],
        ['name' => 'azioni_deliberawfa#index', 'url' => '/azioniDelibera_wfa', 'verb' => 'POST'],
        ['name' => 'riepilogowfa#index', 'url' => '/riepilogo_wfa', 'verb' => 'POST'],
        ['name' => 'avviawfa#index', 'url' => '/avvia_wfa', 'verb' => 'POST'],
        ['name' => 'avviawfa#view', 'url' => '/apps_wfa', 'verb' => 'POST'],
        ['name' => 'export#index', 'url' => '/export_wfa', 'verb' => 'POST'],
        ['name' => 'pratica_wfa_form#index', 'url' => '/pratica_wfa_form', 'verb' => 'POST'],
        ['name' => 'pratica_wfa_form#UploadFile', 'url' => '/upload', 'verb' => 'POST'],
        ['name' => 'pratica_wfa_form#PublishFile', 'url' => '/publish', 'verb' => 'POST'],
        ['name' => 'pratica_wfa_form#templatepdf', 'url' => '/templatepdf', 'verb' => 'GET'],
        ['name' => 'pratica_wfa_form#GetFilesPratica', 'url' => '/get_files_pratica', 'verb' => 'POST'],
        ['name' => 'pratica_wfa_form_approva#index', 'url' => '/pratica_wfa_formapprova', 'verb' => 'POST'],
        ['name' => 'editor_wfa#index', 'url' => '/editor', 'verb' => 'POST'],
        //Routes Data Controller

        /*  Azione  */
        ['name' => 'azione#preflighted_cors', 'url' => '/azione/{path}', 'verb' => 'OPTIONS', 'requirements' => ['path' => '.+']],
        ['name' => 'azione#Create', 'url'   => '/azione/create', 'verb' => 'POST'],
        ['name' => 'azione#CreateOrUpdate', 'url'   => '/azione/createorupdate', 'verb' => 'POST'],
        ['name' => 'azione#Read', 'url'     => '/azione/read',   'verb' => 'POST'],
        ['name' => 'azione#Update', 'url'   => '/azione/update', 'verb' => 'POST'],
        ['name' => 'azione#Delete', 'url'   => '/azione/delete', 'verb' => 'POST'],
        //['name' => 'azione#Count', 'url'    => '/azione/count',  'verb' => 'POST'],
        ['name' => 'azione#Load', 'url'     => '/azione/load',   'verb' => 'POST'],
        ['name' => 'azione#FindAll', 'url'  => '/azione/get',    'verb' => 'POST'],

        /*  Azione WFA */
        ['name' => 'azione_wfa#preflighted_cors', 'url' => '/azionewfa/{path}', 'verb' => 'OPTIONS', 'requirements' => ['path' => '.+']],
        ['name' => 'azione_wfa#Create', 'url'   => '/azionewfa/create', 'verb' => 'POST'],
        ['name' => 'azione_wfa#CreateOrUpdate', 'url'     => '/azionewfa/createorupdate',   'verb' => 'POST'],
        ['name' => 'azione_wfa#Read', 'url'     => '/azionewfa/read',   'verb' => 'POST'],
        ['name' => 'azione_wfa#Update', 'url'   => '/azionewfa/update', 'verb' => 'POST'],
        ['name' => 'azione_wfa#Delete', 'url'   => '/azionewfa/delete', 'verb' => 'POST'],
        //['name' => 'azione_wfa#Count', 'url'    => '/azionewfa/count',  'verb' => 'POST'],
        ['name' => 'azione_wfa#Load', 'url'     => '/azionewfa/load',   'verb' => 'POST'],
        ['name' => 'azione_wfa#FindAll', 'url'  => '/azionewfa/get',    'verb' => 'POST'],

        /*  Categoria WFA */
        ['name' => 'categoria_wfa#preflighted_cors', 'url' => '/categoriawfa/{path}', 'verb' => 'OPTIONS', 'requirements' => ['path' => '.+']],
        ['name' => 'categoria_wfa#Create', 'url'   => '/categoriawfa/create', 'verb' => 'POST'],
        ['name' => 'categoria_wfa#CreateOrUpdate', 'url'     => '/categoriawfa/createorupdate',   'verb' => 'POST'],
        ['name' => 'categoria_wfa#Read', 'url'     => '/categoriawfa/read',   'verb' => 'POST'],
        ['name' => 'categoria_wfa#Update', 'url'   => '/categoriawfa/update', 'verb' => 'POST'],
        ['name' => 'categoria_wfa#Delete', 'url'   => '/categoriawfa/delete', 'verb' => 'POST'],
        //['name' => 'azione_wfa#Count', 'url'    => '/categoriawfa/count',  'verb' => 'POST'],
        ['name' => 'categoria_wfa#Load', 'url'     => '/categoriawfa/load',   'verb' => 'POST'],
        ['name' => 'categoria_wfa#FindAll', 'url'  => '/categoriawfa/get',    'verb' => 'POST'],

        /*  Dipendente WFA */
        ['name' => 'dipendente#preflighted_cors', 'url' => '/dipendente/{path}', 'verb' => 'OPTIONS', 'requirements' => ['path' => '.+']],
        ['name' => 'dipendente#Create', 'url'   => '/dipendente/create', 'verb' => 'POST'],
        ['name' => 'dipendente#CreateOrUpdate', 'url'     => '/dipendente/createorupdate',   'verb' => 'POST'],
        ['name' => 'dipendente#Read', 'url'     => '/dipendente/read',   'verb' => 'POST'],
        ['name' => 'dipendente#Update', 'url'   => '/dipendente/update', 'verb' => 'POST'],
        ['name' => 'dipendente#Delete', 'url'   => '/dipendente/delete', 'verb' => 'POST'],
        //['name' => 'dipendente#Count', 'url'    => '/dipendente/count',  'verb' => 'POST'],
        ['name' => 'dipendente#Load', 'url'     => '/dipendente/load',   'verb' => 'POST'],
        ['name' => 'dipendente#FindAll', 'url'  => '/dipendente/get',    'verb' => 'POST'],

        /*  Elemento  */
        ['name' => 'elemento#preflighted_cors', 'url' => '/elemento/{path}', 'verb' => 'OPTIONS', 'requirements' => ['path' => '.+']],
        ['name' => 'elemento#Create', 'url'   => '/elemento/create', 'verb' => 'POST'],
        ['name' => 'elemento#CreateOrUpdate', 'url'     => '/elemento/createorupdate',   'verb' => 'POST'],
        ['name' => 'elemento#Read', 'url'     => '/elemento/read',   'verb' => 'POST'],
        ['name' => 'elemento#Update', 'url'   => '/elemento/update', 'verb' => 'POST'],
        ['name' => 'elemento#Delete', 'url'   => '/elemento/delete', 'verb' => 'POST'],
        //['name' => 'elemento#Count', 'url'    => '/elemento/count',  'verb' => 'POST'],
        ['name' => 'elemento#Load', 'url'     => '/elemento/load',   'verb' => 'POST'],
        ['name' => 'elemento#FindAll', 'url'  => '/elemento/get',    'verb' => 'POST'],

        /*  Elemento WFA */
        ['name' => 'elemento_wfa#preflighted_cors', 'url' => '/elementowfa/{path}', 'verb' => 'OPTIONS', 'requirements' => ['path' => '.+']],
        ['name' => 'elemento_wfa#Create', 'url'   => '/elementowfa/create', 'verb' => 'POST'],
        ['name' => 'elemento_wfa#CreateOrUpdate', 'url'     => '/elementowfa/createorupdate',   'verb' => 'POST'],
        ['name' => 'elemento_wfa#Read', 'url'     => '/elementowfa/read',   'verb' => 'POST'],
        ['name' => 'elemento_wfa#Update', 'url'   => '/elementowfa/update', 'verb' => 'POST'],
        ['name' => 'elemento_wfa#Delete', 'url'   => '/elementowfa/delete', 'verb' => 'POST'],
        //['name' => 'elemento_wfa#Count', 'url'    => '/elementowfa/count',  'verb' => 'POST'],
        ['name' => 'elemento_wfa#Load', 'url'     => '/elementowfa/load',   'verb' => 'POST'],
        ['name' => 'elemento_wfa#FindAll', 'url'  => '/elementowfa/get',    'verb' => 'POST'],

        /*  Notifiche Ruolo WFA */
        ['name' => 'notifiche_ruolo_wfa#preflighted_cors', 'url' => '/notificheruolowfa/{path}', 'verb' => 'OPTIONS', 'requirements' => ['path' => '.+']],
        ['name' => 'notifiche_ruolo_wfa#Create', 'url'   => '/notificheruolowfa/create', 'verb' => 'POST'],
        ['name' => 'notifiche_ruolo_wfa#CreateOrUpdate', 'url'     => '/notificheruolowfa/createorupdate',   'verb' => 'POST'],
        ['name' => 'notifiche_ruolo_wfa#Read', 'url'     => '/notificheruolowfa/read',   'verb' => 'POST'],
        ['name' => 'notifiche_ruolo_wfa#Update', 'url'   => '/notificheruolowfa/update', 'verb' => 'POST'],
        ['name' => 'notifiche_ruolo_wfa#Delete', 'url'   => '/notificheruolowfa/delete', 'verb' => 'POST'],
        //['name' => 'notifiche_ruolo_wfa#Count', 'url'    => '/notificheruolowfa/count',  'verb' => 'POST'],
        ['name' => 'notifiche_ruolo_wfa#Load', 'url'     => '/notificheruolowfa/load',   'verb' => 'POST'],
        ['name' => 'notifiche_ruolo_wfa#FindAll', 'url'  => '/notificheruolowfa/get',    'verb' => 'POST'],

        /*  Pratica WFA */
        ['name' => 'pratica_wfa#preflighted_cors', 'url' => '/praticawfa/{path}', 'verb' => 'OPTIONS', 'requirements' => ['path' => '.+']],
        ['name' => 'pratica_wfa#Create', 'url'   => '/praticawfa/create', 'verb' => 'POST'],
        ['name' => 'pratica_wfa#CreateOrUpdate', 'url'     => '/praticawfa/createorupdate',   'verb' => 'POST'],
        ['name' => 'pratica_wfa#Read', 'url'     => '/praticawfa/read',   'verb' => 'POST'],
        ['name' => 'pratica_wfa#Update', 'url'   => '/praticawfa/update', 'verb' => 'POST'],
        ['name' => 'pratica_wfa#Delete', 'url'   => '/praticawfa/delete', 'verb' => 'POST'],
        ['name' => 'pratica_wfa#Count', 'url'    => '/praticawfa/count',  'verb' => 'POST'],
        ['name' => 'pratica_wfa#Load', 'url'     => '/praticawfa/load',   'verb' => 'POST'],
        ['name' => 'pratica_wfa#FindAll', 'url'  => '/praticawfa/get',    'verb' => 'POST'],
        ['name' => 'pratica_wfa#PraticaFilter', 'url'     => '/praticawfa/praticafilter',   'verb' => 'POST'],
        ['name' => 'pratica_wfa#GetSintesiProcessoItems', 'url'     => '/praticawfa/processo',   'verb' => 'POST'],
        /*  Ruolo */
        ['name' => 'ruolo#preflighted_cors', 'url' => '/ruolo/{path}', 'verb' => 'OPTIONS', 'requirements' => ['path' => '.+']],
        ['name' => 'ruolo#Create', 'url'   => '/ruolo/create', 'verb' => 'POST'],
        ['name' => 'ruolo#CreateOrUpdate', 'url'     => '/ruolo/createorupdate',   'verb' => 'POST'],
        ['name' => 'ruolo#Read', 'url'     => '/ruolo/read',   'verb' => 'POST'],
        ['name' => 'ruolo#Update', 'url'   => '/ruolo/update', 'verb' => 'POST'],
        ['name' => 'ruolo#Delete', 'url'   => '/ruolo/delete', 'verb' => 'POST'],
        //['name' => 'ruolo#Count', 'url'    => '/ruolo/count',  'verb' => 'POST'],
        ['name' => 'ruolo#Load', 'url'     => '/ruolo/load',   'verb' => 'POST'],
        ['name' => 'ruolo#FindAll', 'url'  => '/ruolo/get',    'verb' => 'POST'],

        /*  Ruolo Pratica WFA */
        ['name' => 'ruolo_pratica_wfa#preflighted_cors', 'url' => '/ruolopraticawfa/{path}', 'verb' => 'OPTIONS', 'requirements' => ['path' => '.+']],
        ['name' => 'ruolo_pratica_wfa#Create', 'url'   => '/ruolopraticawfa/create', 'verb' => 'POST'],
        ['name' => 'ruolo_pratica_wfa#CreateOrUpdate', 'url'     => '/ruolopraticawfa/createorupdate',   'verb' => 'POST'],
        ['name' => 'ruolo_pratica_wfa#Read', 'url'     => '/ruolopraticawfa/read',   'verb' => 'POST'],
        ['name' => 'ruolo_pratica_wfa#Update', 'url'   => '/ruolopraticawfa/update', 'verb' => 'POST'],
        ['name' => 'ruolo_pratica_wfa#Delete', 'url'   => '/ruolopraticawfa/delete', 'verb' => 'POST'],
        //['name' => 'ruolo_pratica_wfa#Count', 'url'    => '/ruolopraticawfa/count',  'verb' => 'POST'],
        ['name' => 'ruolo_pratica_wfa#Load', 'url'     => '/ruolopraticawfa/load',   'verb' => 'POST'],
        ['name' => 'ruolo_pratica_wfa#FindAll', 'url'  => '/ruolopraticawfa/get',    'verb' => 'POST'],

        /*  RuoloWFA */
        ['name' => 'ruolo_wfa#preflighted_cors', 'url' => '/ruolowfa/{path}', 'verb' => 'OPTIONS', 'requirements' => ['path' => '.+']],
        ['name' => 'ruolo_wfa#Create', 'url'   => '/ruolowfa/create', 'verb' => 'POST'],
        ['name' => 'ruolo_wfa#CreateOrUpdate', 'url'     => '/ruolowfa/createorupdate',   'verb' => 'POST'],
        ['name' => 'ruolo_wfa#Read', 'url'     => '/ruolowfa/read',   'verb' => 'POST'],
        ['name' => 'ruolo_wfa#Update', 'url'   => '/ruolowfa/update', 'verb' => 'POST'],
        ['name' => 'ruolo_wfa#Delete', 'url'   => '/ruolowfa/delete', 'verb' => 'POST'],
        //['name' => 'ruolo_wfa#Count', 'url'    => '/ruolowfa/count',  'verb' => 'POST'],
        ['name' => 'ruolo_wfa#Load', 'url'     => '/ruolowfa/load',   'verb' => 'POST'],
        ['name' => 'ruolo_wfa#FindAll', 'url'  => '/ruolowfa/get',    'verb' => 'POST'],

        /*  Valore Elemento WFA */
        ['name' => 'valore_elemento_wfa#preflighted_cors', 'url' => '/valoreelementowfa/{path}', 'verb' => 'OPTIONS', 'requirements' => ['path' => '.+']],
        ['name' => 'valore_elemento_wfa#Create', 'url'   => '/valoreelementowfa/create', 'verb' => 'POST'],
        ['name' => 'valore_elemento_wfa#CreateOrUpdate', 'url'     => '/valoreelementowfa/createorupdate',   'verb' => 'POST'],
        ['name' => 'valore_elemento_wfa#Read', 'url'     => '/valoreelementowfa/read',   'verb' => 'POST'],
        ['name' => 'valore_elemento_wfa#Update', 'url'   => '/valoreelementowfa/update', 'verb' => 'POST'],
        ['name' => 'valore_elemento_wfa#Delete', 'url'   => '/valoreelementowfa/delete', 'verb' => 'POST'],
        //['name' => 'valore_elemento_wfa#Count', 'url'    => '/valoreelementowfa/count',  'verb' => 'POST'],
        ['name' => 'valore_elemento_wfa#Load', 'url'     => '/valoreelementowfa/load',   'verb' => 'POST'],
        ['name' => 'valore_elemento_wfa#FindAll', 'url'  => '/valoreelementowfa/get',    'verb' => 'POST'],

        /*  WFA */
        ['name' => 'wfa#preflighted_cors', 'url' => '/wfa/{path}', 'verb' => 'OPTIONS', 'requirements' => ['path' => '.+']],
        ['name' => 'wfa#Create', 'url'   => '/wfa/create', 'verb' => 'POST'],
        ['name' => 'wfa#CreateOrUpdate', 'url'     => '/wfa/createorupdate',   'verb' => 'POST'],
        ['name' => 'wfa#Read', 'url'     => '/wfa/read',   'verb' => 'POST'],
        ['name' => 'wfa#Update', 'url'   => '/wfa/update', 'verb' => 'POST'],
        ['name' => 'wfa#Delete', 'url'   => '/wfa/delete', 'verb' => 'POST'],
        //['name' => 'wfa#Count', 'url'    => '/wfa/count',  'verb' => 'POST'],
        ['name' => 'wfa#Load', 'url'     => '/wfa/load',   'verb' => 'POST'],
        ['name' => 'wfa#FindAll', 'url'  => '/wfa/get',    'verb' => 'POST'],
        ['name' => 'wfa#Export', 'url'  => '/wfa/export',    'verb' => 'POST'],
        ['name' => 'wfa#UploadFile', 'url'  => '/wfa/localupload',    'verb' => 'POST'],
        ['name' => 'wfa#GetIcon', 'url'  => '/wfa/geticon',    'verb' => 'POST'],

        //filemanager
        ['name' => 'filemanager#preflighted_cors', 'url' => '/filemanager/{path}', 'verb' => 'OPTIONS', 'requirements' => ['path' => '.+']],
        ['name' => 'filemanager#Get', 'url'  => '/filemanager/get',    'verb' => 'POST'],
        ['name' => 'filemanager#Upload', 'url'  => '/filemanager/upload',    'verb' => 'POST'],
        ['name' => 'filemanager#Delete', 'url'  => '/filemanager/delete',    'verb' => 'POST'],
        ['name' => 'filemanager#GetServerRoot', 'url'  => '/filemanager/getserverroot',    'verb' => 'POST'],

        /*  GruppoRuolo */
        ['name' => 'gruppo_ruolo#preflighted_cors', 'url' => '/grupporuolo/{path}', 'verb' => 'OPTIONS', 'requirements' => ['path' => '.+']],
        ['name' => 'gruppo_ruolo#Create', 'url'   => '/grupporuolo/create', 'verb' => 'POST'],
        ['name' => 'gruppo_ruolo#CreateOrUpdate', 'url'     => '/grupporuolo/createorupdate',   'verb' => 'POST'],
        ['name' => 'gruppo_ruolo#Read', 'url'     => '/grupporuolo/read',   'verb' => 'POST'],
        ['name' => 'gruppo_ruolo#Update', 'url'   => '/grupporuolo/update', 'verb' => 'POST'],
        ['name' => 'gruppo_ruolo#Delete', 'url'   => '/grupporuolo/delete', 'verb' => 'POST'],
        ['name' => 'gruppo_ruolo#Load', 'url'     => '/grupporuolo/load',   'verb' => 'POST'],
        ['name' => 'gruppo_ruolo#FindAll', 'url'  => '/grupporuolo/get',    'verb' => 'POST'],

        //simonefase3
        /*  Pratica Gruppo Ruolo */
        ['name' => 'pratica_gruppo_ruolo#preflighted_cors', 'url' => '/praticagrupporuolo/{path}', 'verb' => 'OPTIONS', 'requirements' => ['path' => '.+']],
        ['name' => 'pratica_gruppo_ruolo#Create', 'url' => '/praticagrupporuolo/create', 'verb' => 'POST'],
        ['name' => 'pratica_gruppo_ruolo#CreateOrUpdate', 'url' => '/praticagrupporuolo/createorupdate', 'verb' => 'POST'],
        ['name' => 'pratica_gruppo_ruolo#Read', 'url' => '/praticagrupporuolo/read', 'verb' => 'POST'],
        ['name' => 'pratica_gruppo_ruolo#Update', 'url' => '/praticagrupporuolo/update', 'verb' => 'POST'],
        ['name' => 'pratica_gruppo_ruolo#Delete', 'url' => '/praticagrupporuolo/delete', 'verb' => 'POST'],
        ['name' => 'pratica_gruppo_ruolo#DeleteAllByPraticaWfaId', 'url' => '/praticagrupporuolo/deletebypratica', 'verb' => 'POST'],
        ['name' => 'pratica_gruppo_ruolo#Load', 'url' => '/praticagrupporuolo/load', 'verb' => 'POST'],
        ['name' => 'pratica_gruppo_ruolo#FindAll', 'url' => '/praticagrupporuolo/get', 'verb' => 'POST'],


    ],

    'ocs' => [

        ['name' => 'pratica_wfa_form#UploadFile', 'url' => '/upload', 'verb' => 'POST'],
        ['name' => 'pratica_wfa_form#PublishFile', 'url' => '/publish', 'verb' => 'POST'],
        ['name' => 'pratica_wfa_form#templatepdf', 'url' => '/templatepdf', 'verb' => 'GET'],
        ['name' => 'pratica_wfa_form#GetFilesPratica', 'url' => '/get_files_pratica', 'verb' => 'POST'],
        //Routes Data Controller

        /*  Azione  */
        ['name' => 'azione#Create', 'url'   => '/azione/create', 'verb' => 'POST'],
        ['name' => 'azione#CreateOrUpdate', 'url'   => '/azione/createorupdate', 'verb' => 'POST'],
        ['name' => 'azione#Read', 'url'     => '/azione/read',   'verb' => 'POST'],
        ['name' => 'azione#Update', 'url'   => '/azione/update', 'verb' => 'POST'],
        ['name' => 'azione#Delete', 'url'   => '/azione/delete', 'verb' => 'POST'],
        //['name' => 'azione#Count', 'url'    => '/azione/count',  'verb' => 'POST'],
        ['name' => 'azione#Load', 'url'     => '/azione/load',   'verb' => 'POST'],
        ['name' => 'azione#FindAll', 'url'  => '/azione/get',    'verb' => 'POST'],

        /*  Azione WFA */
        ['name' => 'azione_wfa#Create', 'url'   => '/azionewfa/create', 'verb' => 'POST'],
        ['name' => 'azione_wfa#CreateOrUpdate', 'url'     => '/azionewfa/createorupdate',   'verb' => 'POST'],
        ['name' => 'azione_wfa#Read', 'url'     => '/azionewfa/read',   'verb' => 'POST'],
        ['name' => 'azione_wfa#Update', 'url'   => '/azionewfa/update', 'verb' => 'POST'],
        ['name' => 'azione_wfa#Delete', 'url'   => '/azionewfa/delete', 'verb' => 'POST'],
        //['name' => 'azione_wfa#Count', 'url'    => '/azionewfa/count',  'verb' => 'POST'],
        ['name' => 'azione_wfa#Load', 'url'     => '/azionewfa/load',   'verb' => 'POST'],
        ['name' => 'azione_wfa#FindAll', 'url'  => '/azionewfa/get',    'verb' => 'POST'],

        /*  Categoria WFA */
        ['name' => 'categoria_wfa#Create', 'url'   => '/categoriawfa/create', 'verb' => 'POST'],
        ['name' => 'categoria_wfa#CreateOrUpdate', 'url'     => '/categoriawfa/createorupdate',   'verb' => 'POST'],
        ['name' => 'categoria_wfa#Read', 'url'     => '/categoriawfa/read',   'verb' => 'POST'],
        ['name' => 'categoria_wfa#Update', 'url'   => '/categoriawfa/update', 'verb' => 'POST'],
        ['name' => 'categoria_wfa#Delete', 'url'   => '/categoriawfa/delete', 'verb' => 'POST'],
        //['name' => 'azione_wfa#Count', 'url'    => '/categoriawfa/count',  'verb' => 'POST'],
        ['name' => 'categoria_wfa#Load', 'url'     => '/categoriawfa/load',   'verb' => 'POST'],
        ['name' => 'categoria_wfa#FindAll', 'url'  => '/categoriawfa/get',    'verb' => 'POST'],

        /*  Dipendente WFA */
        ['name' => 'dipendente#Create', 'url'   => '/dipendente/create', 'verb' => 'POST'],
        ['name' => 'dipendente#CreateOrUpdate', 'url'     => '/dipendente/createorupdate',   'verb' => 'POST'],
        ['name' => 'dipendente#Read', 'url'     => '/dipendente/read',   'verb' => 'POST'],
        ['name' => 'dipendente#Update', 'url'   => '/dipendente/update', 'verb' => 'POST'],
        ['name' => 'dipendente#Delete', 'url'   => '/dipendente/delete', 'verb' => 'POST'],
        //['name' => 'dipendente#Count', 'url'    => '/dipendente/count',  'verb' => 'POST'],
        ['name' => 'dipendente#Load', 'url'     => '/dipendente/load',   'verb' => 'POST'],
        ['name' => 'dipendente#FindAll', 'url'  => '/dipendente/get',    'verb' => 'POST'],

        /*  Elemento  */
        ['name' => 'elemento#Create', 'url'   => '/elemento/create', 'verb' => 'POST'],
        ['name' => 'elemento#CreateOrUpdate', 'url'     => '/elemento/createorupdate',   'verb' => 'POST'],
        ['name' => 'elemento#Read', 'url'     => '/elemento/read',   'verb' => 'POST'],
        ['name' => 'elemento#Update', 'url'   => '/elemento/update', 'verb' => 'POST'],
        ['name' => 'elemento#Delete', 'url'   => '/elemento/delete', 'verb' => 'POST'],
        //['name' => 'elemento#Count', 'url'    => '/elemento/count',  'verb' => 'POST'],
        ['name' => 'elemento#Load', 'url'     => '/elemento/load',   'verb' => 'POST'],
        ['name' => 'elemento#FindAll', 'url'  => '/elemento/get',    'verb' => 'POST'],

        /*  Elemento WFA */
        ['name' => 'elemento_wfa#Create', 'url'   => '/elementowfa/create', 'verb' => 'POST'],
        ['name' => 'elemento_wfa#CreateOrUpdate', 'url'     => '/elementowfa/createorupdate',   'verb' => 'POST'],
        ['name' => 'elemento_wfa#Read', 'url'     => '/elementowfa/read',   'verb' => 'POST'],
        ['name' => 'elemento_wfa#Update', 'url'   => '/elementowfa/update', 'verb' => 'POST'],
        ['name' => 'elemento_wfa#Delete', 'url'   => '/elementowfa/delete', 'verb' => 'POST'],
        //['name' => 'elemento_wfa#Count', 'url'    => '/elementowfa/count',  'verb' => 'POST'],
        ['name' => 'elemento_wfa#Load', 'url'     => '/elementowfa/load',   'verb' => 'POST'],
        ['name' => 'elemento_wfa#FindAll', 'url'  => '/elementowfa/get',    'verb' => 'POST'],

        /*  Notifiche Ruolo WFA */
        ['name' => 'notifiche_ruolo_wfa#Create', 'url'   => '/notificheruolowfa/create', 'verb' => 'POST'],
        ['name' => 'notifiche_ruolo_wfa#CreateOrUpdate', 'url'     => '/notificheruolowfa/createorupdate',   'verb' => 'POST'],
        ['name' => 'notifiche_ruolo_wfa#Read', 'url'     => '/notificheruolowfa/read',   'verb' => 'POST'],
        ['name' => 'notifiche_ruolo_wfa#Update', 'url'   => '/notificheruolowfa/update', 'verb' => 'POST'],
        ['name' => 'notifiche_ruolo_wfa#Delete', 'url'   => '/notificheruolowfa/delete', 'verb' => 'POST'],
        //['name' => 'notifiche_ruolo_wfa#Count', 'url'    => '/notificheruolowfa/count',  'verb' => 'POST'],
        ['name' => 'notifiche_ruolo_wfa#Load', 'url'     => '/notificheruolowfa/load',   'verb' => 'POST'],
        ['name' => 'notifiche_ruolo_wfa#FindAll', 'url'  => '/notificheruolowfa/get',    'verb' => 'POST'],

        /*  Pratica WFA */
        ['name' => 'pratica_wfa#Create', 'url'   => '/praticawfa/create', 'verb' => 'POST'],
        ['name' => 'pratica_wfa#CreateOrUpdate', 'url'     => '/praticawfa/createorupdate',   'verb' => 'POST'],
        ['name' => 'pratica_wfa#Read', 'url'     => '/praticawfa/read',   'verb' => 'POST'],
        ['name' => 'pratica_wfa#Update', 'url'   => '/praticawfa/update', 'verb' => 'POST'],
        ['name' => 'pratica_wfa#Delete', 'url'   => '/praticawfa/delete', 'verb' => 'POST'],
        ['name' => 'pratica_wfa#Count', 'url'    => '/praticawfa/count',  'verb' => 'POST'],
        ['name' => 'pratica_wfa#Load', 'url'     => '/praticawfa/load',   'verb' => 'POST'],
        ['name' => 'pratica_wfa#FindAll', 'url'  => '/praticawfa/get',    'verb' => 'POST'],
        ['name' => 'pratica_wfa#PraticaFilter', 'url'     => '/praticawfa/praticafilter',   'verb' => 'POST'],
        ['name' => 'pratica_wfa#GetSintesiProcessoItems', 'url'     => '/praticawfa/processo',   'verb' => 'POST'],
        /*  Ruolo */
        ['name' => 'ruolo#Create', 'url'   => '/ruolo/create', 'verb' => 'POST'],
        ['name' => 'ruolo#CreateOrUpdate', 'url'     => '/ruolo/createorupdate',   'verb' => 'POST'],
        ['name' => 'ruolo#Read', 'url'     => '/ruolo/read',   'verb' => 'POST'],
        ['name' => 'ruolo#Update', 'url'   => '/ruolo/update', 'verb' => 'POST'],
        ['name' => 'ruolo#Delete', 'url'   => '/ruolo/delete', 'verb' => 'POST'],
        //['name' => 'ruolo#Count', 'url'    => '/ruolo/count',  'verb' => 'POST'],
        ['name' => 'ruolo#Load', 'url'     => '/ruolo/load',   'verb' => 'POST'],
        ['name' => 'ruolo#FindAll', 'url'  => '/ruolo/get',    'verb' => 'POST'],

        /*  Ruolo Pratica WFA */
        ['name' => 'ruolo_pratica_wfa#Create', 'url'   => '/ruolopraticawfa/create', 'verb' => 'POST'],
        ['name' => 'ruolo_pratica_wfa#CreateOrUpdate', 'url'     => '/ruolopraticawfa/createorupdate',   'verb' => 'POST'],
        ['name' => 'ruolo_pratica_wfa#Read', 'url'     => '/ruolopraticawfa/read',   'verb' => 'POST'],
        ['name' => 'ruolo_pratica_wfa#Update', 'url'   => '/ruolopraticawfa/update', 'verb' => 'POST'],
        ['name' => 'ruolo_pratica_wfa#Delete', 'url'   => '/ruolopraticawfa/delete', 'verb' => 'POST'],
        //['name' => 'ruolo_pratica_wfa#Count', 'url'    => '/ruolopraticawfa/count',  'verb' => 'POST'],
        ['name' => 'ruolo_pratica_wfa#Load', 'url'     => '/ruolopraticawfa/load',   'verb' => 'POST'],
        ['name' => 'ruolo_pratica_wfa#FindAll', 'url'  => '/ruolopraticawfa/get',    'verb' => 'POST'],

        /*  RuoloWFA */
        ['name' => 'ruolo_wfa#Create', 'url'   => '/ruolowfa/create', 'verb' => 'POST'],
        ['name' => 'ruolo_wfa#CreateOrUpdate', 'url'     => '/ruolowfa/createorupdate',   'verb' => 'POST'],
        ['name' => 'ruolo_wfa#Read', 'url'     => '/ruolowfa/read',   'verb' => 'POST'],
        ['name' => 'ruolo_wfa#Update', 'url'   => '/ruolowfa/update', 'verb' => 'POST'],
        ['name' => 'ruolo_wfa#Delete', 'url'   => '/ruolowfa/delete', 'verb' => 'POST'],
        //['name' => 'ruolo_wfa#Count', 'url'    => '/ruolowfa/count',  'verb' => 'POST'],
        ['name' => 'ruolo_wfa#Load', 'url'     => '/ruolowfa/load',   'verb' => 'POST'],
        ['name' => 'ruolo_wfa#FindAll', 'url'  => '/ruolowfa/get',    'verb' => 'POST'],

        /*  Valore Elemento WFA */
        ['name' => 'valore_elemento_wfa#Create', 'url'   => '/valoreelementowfa/create', 'verb' => 'POST'],
        ['name' => 'valore_elemento_wfa#CreateOrUpdate', 'url'     => '/valoreelementowfa/createorupdate',   'verb' => 'POST'],
        ['name' => 'valore_elemento_wfa#Read', 'url'     => '/valoreelementowfa/read',   'verb' => 'POST'],
        ['name' => 'valore_elemento_wfa#Update', 'url'   => '/valoreelementowfa/update', 'verb' => 'POST'],
        ['name' => 'valore_elemento_wfa#Delete', 'url'   => '/valoreelementowfa/delete', 'verb' => 'POST'],
        //['name' => 'valore_elemento_wfa#Count', 'url'    => '/valoreelementowfa/count',  'verb' => 'POST'],
        ['name' => 'valore_elemento_wfa#Load', 'url'     => '/valoreelementowfa/load',   'verb' => 'POST'],
        ['name' => 'valore_elemento_wfa#FindAll', 'url'  => '/valoreelementowfa/get',    'verb' => 'POST'],

        /*  WFA */
        ['name' => 'wfa#Create', 'url'   => '/wfa/create', 'verb' => 'POST'],
        ['name' => 'wfa#CreateOrUpdate', 'url'     => '/wfa/createorupdate',   'verb' => 'POST'],
        ['name' => 'wfa#Read', 'url'     => '/wfa/read',   'verb' => 'POST'],
        ['name' => 'wfa#Update', 'url'   => '/wfa/update', 'verb' => 'POST'],
        ['name' => 'wfa#Delete', 'url'   => '/wfa/delete', 'verb' => 'POST'],
        //['name' => 'wfa#Count', 'url'    => '/wfa/count',  'verb' => 'POST'],
        ['name' => 'wfa#Load', 'url'     => '/wfa/load',   'verb' => 'POST'],
        ['name' => 'wfa#FindAll', 'url'  => '/wfa/get',    'verb' => 'POST'],
        ['name' => 'wfa#Export', 'url'  => '/wfa/export',    'verb' => 'POST'],
        ['name' => 'wfa#UploadFile', 'url'  => '/wfa/localupload',    'verb' => 'POST'],
        ['name' => 'wfa#GetIcon', 'url'  => '/wfa/geticon',    'verb' => 'POST'],
       
        //filemanager
        ['name' => 'filemanager#Get', 'url'  => '/filemanager/get',    'verb' => 'POST'],
        ['name' => 'filemanager#Upload', 'url'  => '/filemanager/upload',    'verb' => 'POST'],
        ['name' => 'filemanager#Delete', 'url'  => '/filemanager/delete',    'verb' => 'POST'],
        ['name' => 'filemanager#GetServerRoot', 'url'  => '/filemanager/getserverroot',    'verb' => 'POST'],

        /*  GruppoRuolo */
        ['name' => 'gruppo_ruolo#Create', 'url'   => '/grupporuolo/create', 'verb' => 'POST'],
        ['name' => 'gruppo_ruolo#CreateOrUpdate', 'url'     => '/grupporuolo/createorupdate',   'verb' => 'POST'],
        ['name' => 'gruppo_ruolo#Read', 'url'     => '/grupporuolo/read',   'verb' => 'POST'],
        ['name' => 'gruppo_ruolo#Update', 'url'   => '/grupporuolo/update', 'verb' => 'POST'],
        ['name' => 'gruppo_ruolo#Delete', 'url'   => '/grupporuolo/delete', 'verb' => 'POST'],
        ['name' => 'gruppo_ruolo#Load', 'url'     => '/grupporuolo/load',   'verb' => 'POST'],
        ['name' => 'gruppo_ruolo#FindAll', 'url'  => '/grupporuolo/get',    'verb' => 'POST'],

        //simonefase3
        /*  Pratica Gruppo Ruolo */
        ['name' => 'pratica_gruppo_ruolo#preflighted_cors', 'url' => '/praticagrupporuolo/{path}', 'verb' => 'OPTIONS', 'requirements' => ['path' => '.+']],
        ['name' => 'pratica_gruppo_ruolo#Create', 'url' => '/praticagrupporuolo/create', 'verb' => 'POST'],
        ['name' => 'pratica_gruppo_ruolo#CreateOrUpdate', 'url' => '/praticagrupporuolo/createorupdate', 'verb' => 'POST'],
        ['name' => 'pratica_gruppo_ruolo#Read', 'url' => '/praticagrupporuolo/read', 'verb' => 'POST'],
        ['name' => 'pratica_gruppo_ruolo#Update', 'url' => '/praticagrupporuolo/update', 'verb' => 'POST'],
        ['name' => 'pratica_gruppo_ruolo#Delete', 'url' => '/praticagrupporuolo/delete', 'verb' => 'POST'],
        ['name' => 'pratica_gruppo_ruolo#DeleteAllByPraticaWfaId', 'url' => '/praticagrupporuolo/deletebypratica', 'verb' => 'POST'],
        ['name' => 'pratica_gruppo_ruolo#Load', 'url' => '/praticagrupporuolo/load', 'verb' => 'POST'],
        ['name' => 'pratica_gruppo_ruolo#FindAll', 'url' => '/praticagrupporuolo/get', 'verb' => 'POST'],



    ]
];
