<?php

script('wfam', 'jquery-sortable');
script('wfam', 'moment.min');
script('wfam', 'daterangepicker');
script('wfam', 'jquery.inputmask.min');
script('wfam', 'bnlhr-table');
script('wfam', 'bnlhr-navigation');
script('wfam', 'bnlhr-autocomplete');
script('wfam', 'bnlhr-AjaxCall');
script('wfam', 'html2pdf.bundle.min');
script('wfam', 'bnlhr-script');
script('wfam', 'wfa-table-control');
script('wfam', 'bnlhr-cruscotto');
script('wfam', 'bnlhr-appsWfa');
script('wfam', 'bnlhr-gestionewfa');
script('wfam', 'bnlhr-pagination');
script('wfam', 'bnlhr-avviawfa');
script('wfam', 'bnlhr-praticawfaform');
script('wfam', 'bnlhr-definisciwfa');
script('wfam', 'bnlhr-elementiRichiestawfa');
script('wfam', 'bnlhr-azioniDeliberawfa');
script('wfam', 'bnlhr-riepilogowfa');
script('wfam', 'bnlhr-praticawfaformapprova');
script('wfam', 'bnlhr-editorWfa');
script('wfam', 'bnlhr-exportwfa');
style('wfam', 'style');
style('workflowmanager', 'style');
style('wfam', 'daterangepicker');


?>

<div id="app">
    <div id="app-navigation">
        <?php print_unescaped($this->inc('navigation/index')); ?>
        <?php print_unescaped($this->inc('settings/index')); ?>
    </div>

    <div id="app-content">
        <div id="app-content-wrapper">
            <?php  print_unescaped($this->inc('breadcrumb/index')); ?>
            <div id="app-pages">
                <?php  print_unescaped($this->inc('content/index')); ?>
            </div>
        </div>
    </div>
</div>

