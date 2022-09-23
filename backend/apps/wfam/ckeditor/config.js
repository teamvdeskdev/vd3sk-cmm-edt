/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */


CKEDITOR.editorConfig = function(config) {
    // Define changes to default configuration here. For example:
    // config.language = 'fr';
    //config.uiColor = '#0082c9';	

    //Dimensioni del file in pixel per la stampa in qualità 300 DPI: 2480 x 3508 px
    //Dimensioni del file in pixel per la stampa in qualità 72 DPI: 595 x 842 px
    //config.width=595;
    //config.height = 842;
    config.removePlugins = 'elementspath';
    config.resize_enabled = false;
    config.extraPlugins = 'filebrowser';
    config.extraPlugins = 'notification';
    config.extraPlugins = 'inlinesave';
    config.skin = 'office2013';
    // config.filebrowserUploadMethod = 'form';
    config.toolbarGroups = [
        { name: 'document', groups: ['mode', 'document', 'doctools'] },
        { name: 'clipboard', groups: ['clipboard', 'undo'] },
        { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
        { name: 'forms', groups: ['forms'] },
        '/',
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
        { name: 'links', groups: ['links'] },
        { name: 'insert', groups: ['insert'] },
        '/',
        { name: 'styles', groups: ['styles'] },
        { name: 'colors', groups: ['colors'] },
        { name: 'tools', groups: ['tools'] },
        { name: 'others', groups: ['others'] },
        '/',
        '/',
        { name: 'about', groups: ['about'] }
    ];

    config.removeButtons = 'Maximize,Save,NewPage,Scayt,Form,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Checkbox,Blockquote,Language,Anchor,Flash,Smiley,PageBreak,Iframe,Styles,Format,ShowBlocks,About';
    // CreateDiv,

    let url = new URL(window.location.href);
    var requestUrl = url.searchParams.get("baseurl");
    config.inlinesave = {
        postUrl: requestUrl + 'apps/wfam/wfa/createorupdate',
        postData: { test: true },
        successMessage: 'Salvataggio eseguito con successo.',
        errorMessage: 'Errore durante il salvataggio.',
        useJSON: true,
        useColorIcon: false
    };

};