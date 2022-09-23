//Initialize Workflow
ncWorkflow.Init();
ncWorkflow.ConsoleDebug = false;
ncWorkflow.allowLabeling = true;
ncWorkflow.noElementLabels = false;
ncWorkflow.setNoGrid();

// var url = new URL(window.location.href);
// var AppId = url.searchParams.get("AppId");
// var WorkflowId = url.searchParams.get("WorkflowId");
// var OwnerId = url.searchParams.get("OwnerId");

var engineCheck = null;

$('#btnWriteDbandExit').css('display', 'none');

if (ncWorkflow.AppId && ncWorkflow.WorkflowId) {

    switch (ncWorkflow.AppId) {
        case 'wfam':
            {
                ncWorkflow.loadBnlhrStencilModels();
                $('#btnWriteDbandExit').css('display', 'block');
                $('#btnLoadEngineLabels').show();

                break;
            }
        default:
            {
                ncWorkflow.LoadFromDB(ncWorkflow.WorkflowId, ncWorkflow.AppId);
                $("#btnLoadDb").css('display', 'none');
                break;
            }
    }
} else {
    ncWorkflow.loadDefaultStencilModels();
}

//Left menu panel
$('#btnLoadDb').bind('click', function(event) {
    event.preventDefault();

    return $.when(ncWorkflow.getBlockTemplate("workflowview")).then(function($template) {
        var form_title = 'Carica Workflow';
        var dialogName = "workflowview";
        var dialogId = '#' + dialogName;
        var $dlg = $template.octemplate({
            dialog_name: dialogName,
            title: form_title,
            dialogId: dialogName
        });
        $('.app-workflowmanager').append($dlg);
        $('#btnWorkflowviewBack').bind('click', function(event) {
            let skip = parseInt($("#wf-workflowview-table").attr("data-skip"));
            let page = parseInt($("#wf-workflowview-table").attr("data-page"));
            let model = new WorkflowModel();
            model.Skip = skip;
            model.Skip -= model.Take;
            model.Load(ncWorkflow.AppId, model.Skip);
            $("#wf-workflowview-table").attr("data-page", page - 1);
            $("#wf-workflowview-table").attr("data-skip", model.Skip.toString());
        })
        $('#btnWorkflowviewNext').bind('click', function(event) {
            let skip = parseInt($("#wf-workflowview-table").attr("data-skip"));
            let page = parseInt($("#wf-workflowview-table").attr("data-page"));
            let model = new WorkflowModel();
            model.Skip += skip;
            model.Skip += model.Take;
            model.Load(ncWorkflow.AppId, model.Skip);
            $("#wf-workflowview-table").attr("data-page", page + 1);
            $("#wf-workflowview-table").attr("data-skip", model.Skip.toString());
        })
        var buttonlist = [{
            text: 'Chiudi',
            click: function() {
                $(dialogId).ocdialog('close');
            },
            defaultButton: true
        }];

        $(dialogId).ocdialog({
            width: 900,
            height: 600,
            modal: true,
            buttons: buttonlist,
            style: {
                buttons: 'aside',
            },
            close: function() {}
        });
        let skip = parseInt($("#wf-workflowview-table").attr("data-skip"));
        let model = new WorkflowModel();
        //model.Skip += model.Take;
        model.Load(ncWorkflow.AppId, skip);
    })
});

$('#btnWriteDb').bind('click', function(event) {
    event.preventDefault();

    let appId = "workflowmanager";
    if ($('#AppId').val() != null && $('#AppId').val().length > 0) {
        appId = $('#AppId').val()
    } else appId = prompt("Inserisci ID del workflow: ", "workflowmanager");

    let workflowId = "ID1";
    if ($('#WorkflowId').val() != null && $('#WorkflowId').val().length > 0) {
        workflowId = $('#WorkflowId').val()
    } else workflowId = prompt("Inserisci ID del workflow: ", "ID1");

    ncWorkflow.WriteToDB(workflowId, appId);
});

//Save & Exit
$('#btnWriteDbandExit').bind('click', function(event) {
    event.preventDefault();

    //Save with closure flag = true
    let appId = "workflowmanager";
    if ($('#AppId').val() != null && $('#AppId').val().length > 0) {
        appId = $('#AppId').val()
    } else appId = prompt("Inserisci App ID : ", "workflowmanager");

    let workflowId = "ID1";
    if ($('#WorkflowId').val() != null && $('#WorkflowId').val().length > 0) {
        workflowId = $('#WorkflowId').val()
    } else workflowId = prompt("Inserisci ID del workflow: ", "ID1");

    ncWorkflow.WriteToDB(workflowId, appId, 'true', function() {
        //close current window
        window.open('', '_parent', '');
        window.close();
    });
});

//Clear Paper
$('#btnClearPaper').bind('click', function(event) {
    event.preventDefault();
    ncWorkflow.ClearPaper();
    $("#btnStartWorkflow").hide();
    $("#btnLoadEngineLabels").hide();
    //Clear properties
    ncWorkflow.WorkflowId = null;
    ncWorkflow.OwnerId = null;
});

//Esport to FIle
$('#btnWriteFile').bind('click', function(event) {
    event.preventDefault();
    ncWorkflow.SaveToFile();
});

// $('#btnRemoveAll').bind("click", function (event) {
//     event.preventDefault();
//     ncWorkflow.ClearPaper();
// });

//Turn ON/OFF Edit 
$('#btnEnabDisab').bind('click', function(event) {
    event.preventDefault();
    if (Paper) {
        if (Paper.options.interactive) {
            Paper.setInteractivity(false);
            $('#stencil').css("display", "none");
            //$('#stencil').hide();
        } else {
            Paper.setInteractivity(true);
            $('#stencil').css("display", "block");
            //$('#stencil').show();
        }
    } else {
        OC.dialogs.alert('Errore - Paper non esiste', 'Error');
    }
});

//Show/hide grid
$('#btnShowHideGrid').bind('click', function(event) {
    event.preventDefault();
    if (Paper) {
        if (Paper.perpendicularLinks) {
            ncWorkflow.setNoGrid();
        } else {
            ncWorkflow.setGrid();
        }
    }
});

// TESTS
//Load Engine labels
$('#btnLoadEngineLabels').bind('click', function(event) {
        event.preventDefault();
        if (Paper.model.attributes.cells.length && Paper.model.attributes.cells.length > 0) {
            if (!engineCheck) {
                if (!ncWorkflow.OwnerId) {
                    ncWorkflow.OwnerId = prompt("Inserisci Identificativo flusso pratica (OwnerId) ", "1");
                }
                if (ncWorkflow.OwnerId) {
                    engineCheck = setInterval(function() {
                        if (Paper && Paper.model) {
                            //Prepare RESTful Base URL
                            baseUrl = OC.generateUrl('/apps/workflowmanager');

                            //Prepare Filter
                            let jsonData = {
                                "Model": {}
                            };
                            jsonData.Model = {
                                "Filter": {
                                    "AppId": ncWorkflow.AppId,
                                    "WorkflowId": ncWorkflow.WorkflowId,
                                    "OwnerId": ncWorkflow.OwnerId
                                }
                            };

                            $.ajax({
                                url: baseUrl + '/api/readengine',
                                type: 'POST',
                                contentType: 'application/json',
                                data: JSON.stringify(jsonData),
                                beforeSend: function(xhr) {
                                    xhr.setRequestHeader('Authorization', ncWorkflow.MakeBaseAuth());
                                }
                            }).done(function(response) {
                                if (response.Model && response.Model.Performed) {
                                    //Engine model exists
                                    if (response.Model && response.Model.Dto && response.Model.Dto.WorkflowModel) {
                                        let engineModel = response.Model.Dto.WorkflowModel;
                                        //Load Model into Paper
                                        ncWorkflow.ClearPaper();
                                        ncWorkflow.FromString(engineModel);
                                        //Show model's tags 
                                        ncWorkflow.ShowWorkflowEngineTags(Paper.model);
                                    }
                                }
                            })
                        }

                    }, 5000);
                    //Show Engine Running-Status icon
                    let engineActiveSvg = "<div title=\"Engine workflow attivo\" style=\"position:absolute;right:0;top:10px;margin-right:20px\" id=\"EngineOnIcon\" width=\"100\" height=\"100\">\n" +
                        "<span style=\"position:relative;margin-left:20px\" class=\"icon loading\"></span>" +
                        "</div>";
                    //Disable actions
                    ncWorkflow.DisablePaper();
                    ncWorkflow.DisableStencilPaper();

                    $('#btnWriteDbandExit').addClass('disable-menu-item');
                    $('#btnClearPaper').addClass('disable-menu-item');
                    $('#btnLoadDb').addClass('disable-menu-item');
                    $('#btnWriteDb').addClass('disable-menu-item');
                    $('#btnWriteFile').addClass('disable-menu-item');
                    $('#btnVisioInput').addClass('disable-menu-item');
                    $('#btnFileInput').addClass('disable-menu-item');

                    // $("#wfTitle").append('<span id="EngineOnIcon" style="position:relative;margin-left:20px" class="icon loading"></span>');
                    $("#paper").append(engineActiveSvg);
                }
            } else {
                clearInterval(engineCheck);
                engineCheck = null;
                $("#EngineOnIcon").remove();
                //Re-Enable actions
                ncWorkflow.EnablePaper();
                ncWorkflow.EnableStencilPaper();
                //Reload base WfModel
                ncWorkflow.LoadFromDB(ncWorkflow.WorkflowId, ncWorkflow.AppId);
                $('#btnWriteDbandExit').removeClass('disable-menu-item');
                $('#btnClearPaper').removeClass('disable-menu-item');
                $('#btnLoadDb').removeClass('disable-menu-item');
                $('#btnWriteDb').removeClass('disable-menu-item');
                $('#btnWriteFile').removeClass('disable-menu-item');
                $('#btnVisioInput').removeClass('disable-menu-item');
                $('#btnFileInput').removeClass('disable-menu-item');
            }
        } else {
            OC.dialogs.alert('Non é presente nessun Workflow', 'No Data');
        }
    })
    // ENDTESTS

$('#btnTest').bind('click', function(event) {
    event.preventDefault();
    if (ncWorkflow) {
        ncWorkflow.ClearPaper();
        ncWorkflow.ClearStencil();
        ncWorkflow.loadBnlhrStencilModels();
    } else {
        OC.dialogs.alert('Errore - ncWorkflow non esiste', 'Error');
    }
});

function getLogsTemplate() {
    var defer = $.Deferred();
    if (!this.$messageTemplate) {
        var self = this;
        $.get(OC.filePath('workflowmanager', 'templates/content', 'logs.html'), function(tmpl) {
                self.$messageTemplate = $(tmpl);
                defer.resolve(self.$messageTemplate);
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                defer.reject(jqXHR.status, errorThrown);
            });
    } else {
        defer.resolve(this.$messageTemplate);
    }
    return defer.promise();
};

//Open logs' window
$('#btnWfLog').bind('click', function() {
    //ToDO: Pagination & Tool Buttons (Delete, etc)
    try {
        //Show PageLoader
        ncWorkflow.ShowPageLoader('', 'content', 10000);
        //Retrieve data
        let url = OC.generateUrl('apps/workflowmanager/api/logs/get');
        let requestModel = {
            "Model": {
                "Filter": {}
            }
        };
        requestModel.Model.Filter.WorkflowId = ncWorkflow.WorkflowId;
        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestModel),

        }).done(function(response) {
            return $.when(getLogsTemplate()).then(function($tmpl) {
                var dialogName = 'logsform';
                var dialogId = '#' + dialogName;
                var $dlg = $tmpl.octemplate({
                    dialog_name: dialogName,
                    title: 'Workflow Operational Logs'
                });
                $('body').append($dlg);

                //BindView
                let dtos = response.Model.Dtos;
                dtos.forEach(function(dto) {
                    //Format logDateTime
                    let logDate = new Date(dto.LogDate.toString().replace(/-/g, '/'));
                    logDate = logDate.getDate() + '/' + (logDate.getMonth() + 1) + '/' + logDate.getFullYear() + ' - ' + logDate.getHours() + ':' + logDate.getMinutes() + ':' + logDate.getSeconds();
                    //Retrieve Block data from current Paper for each block
                    let blockData = ncWorkflow.GetBlockPropertiesFromRootId(dto.NodeId);
                    let row = "<tr style=\"height:30px;\" id=\"row-" + dto.Id + "\" data-id=\"" + dto.Id + "\" >\n" +
                        "               <td align=\"right\" valign=\"middle\" >\n" +
                        "               <i style=\"margin-right:10px\" class=\"icon-category-monitoring\">&nbsp;&nbsp;&nbsp;&nbsp;</i>\n" +
                        "               </td>\n" +
                        "                <td style=\"border-bottom:1px solid lightgrey;\" align=\"left\" valign=\"middle\">\n" +
                        "                    <span style=\"color:#05F\"><b>" + logDate + "</b></span>\n" +
                        "                </td>\n" +
                        "                <td style=\"border-bottom:1px solid lightgrey;\" align=\"left\" valign=\"middle\" >\n" +
                        "                <span class=\"bnlhr-text-pre-wrap\">" + dto.LogText + "</span>\n" +
                        "                </td>\n" +
                        "                <td style=\"border-bottom:1px solid lightgrey;\" align=\"left\" valign=\"middle\" >\n" +
                        "                <span class=\"bnlhr-text-pre-wrap\">" + dto.UserId + "</span>\n" +
                        "                </td>\n" +
                        "                <td style=\"border-bottom:1px solid lightgrey;\" align=\"left\" valign=\"middle\" >\n" +
                        "                    <span class=\"bnlhr-text-pre-wrap\"><b >" + (blockData ? blockData.Label : 'N/D') + "</b></span>\n" +
                        "                </td>\n" +
                        "            </tr>";
                    $(row).appendTo("#wf-logs-table tbody");

                })

                $(dialogId).ocdialog({
                    width: 900,
                    height: 600,
                    modal: true,
                    close: function() {}
                });
                //Hide PageLoader
                ncWorkflow.HidePageLoader('content');
            });
        }).fail(function(response, code) {
            OC.dialogs.alert('Errore nel caricamento dei logs', 'Error');
        });


    } catch (error) {
        console.log(error);
    }
})

//popup upload
var btnFileInput = document.getElementById('btnFileInput');
if (btnFileInput) {

    btnFileInput.addEventListener('click', function(e) {
        if (!$('#wfImporta-pupupMenu').is(':visible')) {
            $("#wfImporta-pupupMenu").show();
        } else {
            $("#wfImporta-pupupMenu").hide();
        }
    })
}

$("#wf-lnkDriveImporta").on("click", function(e) {
    OC.dialogs.filepicker('Seleziona file', function(file) {
        var textType = /(csv|xml|json|xpdl).*/
        var type = file.split('.')[file.split('.').length - 1];
        if (file && type.match(textType)) {
            ncWorkflow.ShowPageLoader('Attentere', 'content', 30000);
            GetFileContent(file, function(result) {
                if (result != null) {
                    //Clear Paper
                    ncWorkflow.ClearPaper();
                    switch (type) {
                        case 'json':
                            Paper.model.fromJSON(JSON.parse(result));
                            break;
                        case 'xml':
                            ncWorkflow.ImportFromXML(result);
                            break;
                        case 'xpdl':
                            ncWorkflow.ImportFromXPDL(result);
                            break;
                        case 'csv':
                            ncWorkflow.ImportFromCsv(result);
                            break;
                        default:
                            OC.dialogs.alert('Impossibile importare il file', 'Warning');
                            break;
                    }

                } else {
                    OC.dialogs.alert('Impossibile importare il file', 'Warning');
                }
                ncWorkflow.HidePageLoader('content');

            })

            $("#wfImporta-pupupMenu").hide();
        } else {
            $("#wfImporta-pupupMenu").hide();
            OC.dialogs.alert("File non supportato. (Supportati : json,csv,xml)", "Warning");
        }
    }, false);
});

//Add listener to file Uploader
var fileInput = document.getElementById('file_upload_startImporta');
if (fileInput) {
    fileInput.addEventListener('change', function(e) {
        var file = fileInput.files[0];
        // var textType = /json.*/;
        var textType = /(csv|vnd.ms-excel|xml|json|xpdl).*/
        var extension = file.name.split('.').pop();
        if (file && file.type.match(textType) || extension == "xpdl") {
            var fileType = (file.type == "" ? extension : file.type);
            var reader = new FileReader();
            reader.onload = function(e) {
                //Clear Paper
                ncWorkflow.ClearPaper();
                switch (fileType) {
                    case 'application/json':
                        Paper.model.fromJSON(JSON.parse(reader.result));
                        break;
                    case 'text/xml':
                        ncWorkflow.ImportFromXML(reader.result);
                        break;
                    case 'xpdl':
                        ncWorkflow.ImportFromXPDL(reader.result);
                        break;
                    case 'text/csv', "application/vnd.ms-excel":
                        ncWorkflow.ImportFromCsv(reader.result);
                        break;
                    default:
                        OC.dialogs.alert('Impossibile importare il file', 'Warning');
                        break;
                }
            }

            reader.readAsText(file);
            $("#wfImporta-pupupMenu").hide();
            $('#file_upload_startImporta').val('');
        } else {
            $("#wfImporta-pupupMenu").hide();
            $('#file_upload_startImporta').val('');
            OC.dialogs.alert("File non supportato. (Supportati : json,csv,xml,xpdl)", "Warning");
        }
    });
}



var btnVisioInput = document.getElementById('btnVisioInput');
if (btnVisioInput) {

    btnVisioInput.addEventListener('click', function(e) {
        if (!$('#wfImportaVisio-pupupMenu').is(':visible')) {
            $("#wfImportaVisio-pupupMenu").show();
        } else {
            $("#wfImportaVisio-pupupMenu").hide();
        }
    })
}
//Add listener to Visio file Uploader
var visioInput = document.getElementById('visioInput');
if (visioInput) {
    visioInput.addEventListener('change', function(e) {
        //Show PageLoader
        ncWorkflow.ShowPageLoader('', 'content', 10000);
        var file = visioInput.files[0];
        let inputExt = (/[.]/.exec(file.name)) ? /[^.]+$/.exec(file.name) : undefined;
        if (inputExt == 'vsdx') {
            var reader = new FileReader();

            reader.onload = function(e) {
                    let model = {
                        "Model": {
                            "Dto": {}
                        }
                    };
                    model.Model.Dto.Path = "apps/workflowmanager/tmp";
                    model.Model.Dto.FileName = file.name;
                    model.Model.Dto.Stream = reader.result;

                    let url = OC.generateUrl('apps/workflowmanager/api/generatefromvisio');

                    $.ajax({
                        url: url,
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(model),

                    }).done(function(response) {
                        if (response.Performed) {
                            // console.log('performed');
                            //Clear Paper
                            ncWorkflow.ClearPaper();
                            //Clear Stencil
                            //ncWorkflow.ClearStencil();
                            //Create Workflow from Visio 2013 File                              
                            ncWorkflow.CreateFromVisio(response);
                            // $('#wfTitle').html('Workflow Manager - Importato da : ' + response.Model.InputFile);
                        } else {
                            console.log('not performed');
                        }
                        ncWorkflow.HidePageLoader('content');
                    }).fail(function(response, code) {
                        ncWorkflow.HidePageLoader('content');
                        console.log('error');
                    });

                }
                // reader.readAsArrayBuffer(file);
            reader.readAsDataURL(file);
            $('#visioInput').val('');
            $("#wfImportaVisio-pupupMenu").hide();
        } else {
            $("#wfImportaVisio-pupupMenu").hide();
            OC.dialogs.alert("File non supportato.", "Warning");
            ncWorkflow.HidePageLoader('content');
        }
    });
}

$("#wf-lnkDriveVisio").on("click", function(e) {
    OC.dialogs.filepicker('Seleziona file', function(file) {
        //Show PageLoader
        ncWorkflow.ShowPageLoader('', 'content', 30000);

        let inputExt = (/[.]/.exec(file)) ? /[^.]+$/.exec(file) : undefined;
        if (inputExt == 'vsdx') {

            GetFilestream(file, function(result) {
                let model = {
                    "Model": {
                        "Dto": {}
                    }
                };
                model.Model.Dto.Path = "apps/workflowmanager/tmp";
                model.Model.Dto.FileName = file.replace("/", "");
                model.Model.Dto.Stream = result;
                let url = OC.generateUrl('apps/workflowmanager/api/generatefromvisio');
                $.ajax({
                    url: url,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(model),

                }).done(function(response) {
                    if (response.Performed) {
                        // console.log('performed');
                        //Clear Paper
                        ncWorkflow.ClearPaper();
                        //Clear Stencil
                        ncWorkflow.ClearStencil();
                        //Create Workflow from Visio 2013 File                                        
                        ncWorkflow.CreateFromVisio(response);
                        $('#wfTitle').html('Workflow Manager - Importato da : ' + response.Model.InputFile);
                    } else {
                        console.log('not performed');
                    }
                    $("#wfImportaVisio-pupupMenu").hide();
                    ncWorkflow.HidePageLoader('content');
                }).fail(function(response, code) {
                    console.log('error');
                    ncWorkflow.HidePageLoader('content');
                    $("#wfImportaVisio-pupupMenu").hide();
                });

            })

        } else {
            $("#wfImportaVisio-pupupMenu").hide();
            OC.dialogs.alert("File non supportato.", "Warning");
            ncWorkflow.HidePageLoader('content');
        }

    }, false);
});



//Load Library Models
if (ncWorkflow.AppId == null) {
    ncWorkflow.AppId = 'workflowmanager'
};
let jsonModel = {
    "Model": {}
};
jsonModel.Model.Filter = {};
jsonModel.Model.Filter.AppId = ncWorkflow.AppId;

url = OC.generateUrl("apps/workflowmanager/api/model/get");

$.ajax({
    url: url,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(jsonModel),

}).done(function(response) {
    let models = "";
    dtos = response.Model.Dtos;
    dtos.forEach(function(dto, i) {
        models += '<li><a class="menuItem link-disabled" id="libraryModelLoader"  data-modelId="' + dto.ModelId + '" href="#"><i class="icon-toggle-filelist"></i>' + dto.ModelName + '</a></li>';
    });
    $("#libraryMenu").after(models);


}).fail(function(response, code) {
    OC.dialogs.alert('Errore caricamento Libreria', 'Error');
});

$("#btnStartWorkflow").bind('click', function(event) {
    event.preventDefault();
    ncWorkflow.startWorkFlow();
})
$('#app-navigation').bind('click', '#libraryModelLoader', function(element) {
    // let modelId = element.srcElement.dataset.modelid;
    // let jsonModel = { "Model": {} };
    // jsonModel.Model.Filter = {};
    // jsonModel.Model.Filter.AppId = ncWorkflow.AppId;
    // jsonModel.Model.Filter.ModelId = modelId;

    // url = OC.generateUrl("apps/workflowmanager/api/model/read");

    // $.ajax({
    //     url: url,
    //     type: 'POST',
    //     contentType: 'application/json',
    //     data: JSON.stringify(jsonModel),

    // }).done(function (response) {
    //     dto = response.Model.Dto;
    //     if (dto) {
    //         ncWorkflow.ClearPaper();
    //         ncWorkflow.FromJSON(JSON.parse(dto.WorkflowModel));
    //         $('#wfTitle').html(ncWorkflow.Title+' | '+dto.ModelName);
    //         // ncWorkflow.FromJSON(dto.WorkflowModel);
    //     }
    // }).fail(function (response, code) {
    //     OC.dialogs.alert('Errore caricamento Modello', 'Error');
    // });
});