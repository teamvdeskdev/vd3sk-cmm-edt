<?php
return [
    'routes' => [
        ['name' => 'staging#testDBConnection', 'url' => '/testDBConnection', 'verb' => 'GET'],
	    ['name' => 'table#fetchTables', 'url' => '/table', 'verb' => 'GET'],
        ['name' => 'table#fetchTableData', 'url' => '/table/data', 'verb' => 'POST'],
        ['name' => 'table#create', 'url' => '/table', 'verb' => 'POST'],
        ['name' => 'table#rename', 'url' => '/table/rename', 'verb' => 'POST'],
        ['name' => 'table#delete', 'url' => '/table/delete', 'verb' => 'POST'],
        ['name' => 'field#create', 'url' => '/field', 'verb' => 'POST'],
        ['name' => 'field#update', 'url' => '/field/update', 'verb' => 'POST'],
        ['name' => 'field#delete', 'url' => '/field/delete', 'verb' => 'POST'],
        ['name' => 'relationship#create', 'url' => '/relationship', 'verb' => 'POST'],
        ['name' => 'relationship#delete', 'url' => '/relationship/delete', 'verb' => 'POST'],
        ['name' => 'dropdownDB#fetchTablesNames', 'url' => '/dropdowndb', 'verb' => 'GET'],
        ['name' => 'dropdownDB#fetchTablesFinalData', 'url' => '/dropdowndb/finaldata', 'verb' => 'POST'],
        ['name' => 'groupsManager#importGroups', 'url' => '/group/import', 'verb' => 'POST'],
    ]
];
