class BaseModel {
    constructor() {
        this.Skip = 0;
        this.Take = 10;
        this.Count = 0;
        this.Dtos = null;
        this.Dto = null;
        this.Entity = null;
        this.Search = null;
        this.Order = null;
        this.Filter = null;
        this.Performed = false;
        this.Properties = null
    }
}

class UserModel extends BaseModel {
    constructor() {
        super();

    }

    LoadSearchUsers = function(user, callback) {
        try {
            let url = OC.generateUrl('apps/workflowmanager/api/user/search');
            WFAjaxCallPOST(url, user, function(response) {
                if (callback)
                    callback(response);
            })
        } catch (error) {

        }
    }
}
class UserEntity {
    constructor() {
        this.Nome = null;
        this.Cognome;
        this.Email;
        this.Account;
    }
}
class UserDto extends UserEntity {
    constructor() {

    }
}

class GroupModel extends BaseModel {
    constructor() {
        super();

    }

    LoadSearchGroups = function(user, callback) {
        try {
            let url = OC.generateUrl('apps/workflowmanager/api/group/load');
            WFAjaxCallPOST(url, user, function(response) {
                if (callback)
                    callback(response);
            })
        } catch (error) {

        }
    }
}
class GroupEntity {
    constructor() {
        this.Nome = null;
    }
}
class GroupDto extends UserEntity {
    constructor() {

    }
}

class WorkflowModel extends BaseModel {
    constructor() {
        super().Take = 10;
    }

    BuildRow = function(dto) {
        let row = "<tr style=\"height:30px;\" id=\"row-" + dto.id + "\" data-workflow-id=\"" + dto.WorkflowId + "\" >\n" +
            "               <td align=\"right\" valign=\"middle\" >\n" +
            "               <i style=\"margin-right:10px\">&nbsp;&nbsp;&nbsp;&nbsp;</i>\n" +
            "               </td>\n" +
            "                <td style=\"border-bottom:1px solid lightgrey;\" align=\"left\" valign=\"middle\" >\n" +
            "                <span class=\"bnlhr-text-pre-wrap\">" + dto.Name + "</span>\n" +
            "                </td>\n" +
            "                <td style=\"border-bottom:1px solid lightgrey;\" align=\"left\" valign=\"middle\">\n" +
            "                    <span style=\"color:#05F\"><b>" + dto.DateTime + "</b></span>\n" +
            "                </td>\n" +
            "                <td style=\"border-bottom:1px solid lightgrey;\" align=\"left\" valign=\"middle\" >\n" +
            "                   <button id=\"btnLoad-" + dto.id + "\" data-workflow-id=\"" + dto.WorkflowId + "\" data-workflow-appid=\"" + dto.AppId + "\" >Carica</button>\n" +
            "                </td>\n" +
            "            </tr>";
        $(row).appendTo("#wf-workflowview-table tbody");
        $("#btnLoad-" + dto.id).bind('click', function(event) {
            let workflowId = event.currentTarget.dataset.workflowId;
            let appId = event.currentTarget.dataset.workflowAppid;
            ncWorkflow.LoadFromDB(workflowId, appId);
            $("#workflowview").ocdialog('close');
        })
    }

    Load = function(appId, skip) {
        ncWorkflow.ShowPageLoader('', 'content', 10000);
        $("#wf-workflowview-table tbody").empty();
        let url = OC.generateUrl('apps/workflowmanager/api/load');
        let model = new WorkflowModel();
        model.Filter = new WorkflowFilter();
        model.Filter.AppId = appId;
        model.Skip = skip;
        self = this;
        WFAjaxCallPOST(url, model, function(response) {
            self.ShowHidePagination(response);
            if (response != null && response.Performed) {

                let dtos = response.Dtos;
                if (dtos != null) {
                    for (var dto of dtos) {
                        model.BuildRow(dto);
                    }
                }


            }
            ncWorkflow.HidePageLoader('content');
        })
    }

    ShowHidePagination = function(model) {
        if (model != null) {
            var totalPages = parseInt(Math.ceil(parseFloat(model.Count) / parseFloat(model.Take)));
            var currentPage = parseInt($("#wf-workflowview-table").attr("data-page"));
            if (totalPages > 1) {
                $("#wf-workflowview-table tfoot").show();
                if (currentPage <= 0) {
                    currentPage = 1;
                    $("#wf-workflowview-table").attr("data-page", currentPage);
                }
                if (model.Skip > 0)
                    $("#wf-workflowview-table #btnWorkflowviewBack").attr("disabled", false);
                else
                    $("#wf-workflowview-table #btnWorkflowviewBack").attr("disabled", true);

                if (currentPage >= totalPages)
                    $("#wf-workflowview-table #btnWorkflowviewNext").attr("disabled", true);
                else
                    $("#wf-workflowview-table #btnWorkflowviewNext").attr("disabled", false);

            } else
                $("#wf-workflowview-table tfoot").hide();
        }

    }

}
class WorkflowEntity {
    constructor() {
        this.id = null;
        this.AppId = null;
        this.WorkflowId = null;
    }
}
class WorkflowDto extends WorkflowEntity {
    constructor() {
        super();
        this.DateTime = null;
        this.Stato = null;
    }
}
class WorkflowFilter extends WorkflowDto {
    constructor() {
        super();

    }
}

var timerAutocompleteSearch = null;
WFAutocompleteUtente = function(control, loader) {
    control.addEventListener("input", function(e) {

        let user = new UserModel();
        if (timerAutocompleteSearch != null)
            clearTimeout(timerAutocompleteSearch);
        $("#autocompleteLoading").show();
        user.Search = this.value;
        timerAutocompleteSearch = setTimeout(function() {
            if (user.Search != null && user.Search.length >= 1) {
                user.LoadSearchUsers(user, function(response) {
                    if (response != null && response.Performed) {
                        BindViewAutocomplete(response.Dtos);
                        $("#autocompleteLoading").hide();
                    }
                });
            } else {
                $("#autocomplete-list").empty();
                $("#autocompleteLoading").hide();
            }
        }, 2000);
    })
}
AutocompleteItem_Click = function(e) {
    var dataSet = e.currentTarget.dataset;
    if (dataSet != null) {
        var nome = dataSet.name;
        var email = dataSet.email != null ? dataSet.email : "";
        var account = dataSet.account;
        var editUtenteSelected = document.getElementById("UtenteSelected");
        if (editUtenteSelected != null) {
            editUtenteSelected.setAttribute('data-name', nome);
            editUtenteSelected.setAttribute('data-email', email);
            editUtenteSelected.setAttribute('data-account', account);
        }
        $("#autocomplete-list").empty();
        $("#tbUtenteAutocomplete").val(nome + " " + email);
    }
}


function BindViewAutocomplete(dtos) {
    $("#autocomplete-list").empty();

    if (dtos != null) {
        var index = 0;
        for (var dto of dtos) {
            index += 1;
            var row = '<div id="rowItem' + index.toString() + '" data-name="' + dto.Nome + '"  data-email="' + (dto.Email != null ? dto.Email : "") + '" data-account="' + dto.Account + '">' + dto.Nome + '&nbsp;&nbsp;&nbsp;&nbsp;' + (dto.Email != null ? dto.Email : "-") + '</div>';
            $(row).appendTo("#autocomplete-list");
            $('#rowItem' + index.toString()).on("click", AutocompleteItem_Click);
        }
    }
}

function BuildConfigurationFirmaDigitale(sender, blockIdentifier, $template) {
    try {
        let jsonModel = {
            "Filter": {}
        };
        jsonModel.Filter.AppId = ncWorkflow.AppId;
        jsonModel.Filter.WorkflowId = ncWorkflow.WorkflowId;
        jsonModel.Filter.OwnerId = ncWorkflow.OwnerId;
        jsonModel.Filter.Id = sender.model.attr('root/id');
        GetAuthorizzation(jsonModel, function(authorized) {
            if (authorized) {
                var form_title = 'Seleziona il tipo di firma';
                var dialogName = blockIdentifier;
                var dialogId = '#' + dialogName;
                var $dlg = $template.octemplate({
                    dialog_name: dialogName,
                    title: form_title,

                });
                $('.app-workflowmanager').append($dlg);
                var buttonlist = [{
                    text: 'Chiudi',
                    // classes: 'signbuttoncancel custom-btn cutstom-btn-grigio ',
                    click: function() {
                        $(dialogId).ocdialog('close');
                    },
                    defaultButton: true
                }];
                AddEventMenuDigitalSign(sender);
                $(dialogId).ocdialog({
                    width: 300,
                    height: 200,
                    modal: true,
                    buttons: buttonlist,
                    style: {
                        buttons: 'aside',
                    },
                    close: function() {}
                });
            }
        })

    } catch (error) {

    }
}

function BuildConfigurationPec(sender, blockIdentifier, $template) {
    try {
        var form_title = 'Pec';
        var mailSubject = sender.model.attr('root/mailSubject') ? sender.model.attr('root/mailSubject') + ' ' : '';
        var mailText = sender.model.attr('root/mailText') ? sender.model.attr('root/mailText') + ' ' : '';
        var dialogName = blockIdentifier;
        var dialogId = '#' + dialogName;
        var $dlg = $template.octemplate({
            dialog_name: dialogName,
            title: form_title,
            mailSubject: mailSubject,
            mailText: mailText,
        });
        $('.app-workflowmanager').append($dlg);
        var buttonlist = [{
            text: 'Chiudi',
            // classes: 'signbuttoncancel custom-btn cutstom-btn-grigio ',
            click: function() {
                $(dialogId).ocdialog('close');
            }
        }, {
            text: 'Salva',
            click: function() {
                var mailSubject = $("#mailSubject").val();
                var mailText = $("#mailText").val();
                sender.model.attr('root/mailSubject', (mailSubject != null ? mailSubject : ""));
                sender.model.attr('root/mailText', (mailText != null ? mailText : ""));
                OC.dialogs.info('I dati verranno aggiornati dopo il salvataggio.', 'Info');
                $(dialogId).ocdialog('close');
            },
            defaultButton: true
        }];

        $(dialogId).ocdialog({
            width: 900,
            height: 550,
            modal: true,
            buttons: buttonlist,
            style: {
                buttons: 'aside',
            },
            close: function() {}
        });


    } catch (error) {

    }
}

function BuildConfigurationEmail(sender, blockIdentifier, $template) {
    try {
        var form_title = 'Email';
        var mailSubject = sender.model.attr('root/mailSubject') ? sender.model.attr('root/mailSubject') + ' ' : '';
        var mailText = sender.model.attr('root/mailText') ? sender.model.attr('root/mailText') + ' ' : '';
        var dialogName = blockIdentifier;
        var dialogId = '#' + dialogName;
        var $dlg = $template.octemplate({
            dialog_name: dialogName,
            title: form_title,
            mailSubject: mailSubject,
            mailText: mailText,
        });
        $('.app-workflowmanager').append($dlg);
        var buttonlist = [{
            text: 'Chiudi',
            // classes: 'signbuttoncancel custom-btn cutstom-btn-grigio ',
            click: function() {
                $(dialogId).ocdialog('close');
            }
        }, {
            text: 'Salva',
            click: function() {
                var mailSubject = $("#mailSubject").val();
                var mailText = $("#mailText").val();
                sender.model.attr('root/mailSubject', (mailSubject != null ? mailSubject : ""));
                sender.model.attr('root/mailText', (mailText != null ? mailText : ""));
                OC.dialogs.info('I dati verranno aggiornati dopo il salvataggio.', 'Info');
                $(dialogId).ocdialog('close');
            },
            defaultButton: true
        }];

        $(dialogId).ocdialog({
            width: 900,
            height: 550,
            modal: true,
            buttons: buttonlist,
            style: {
                buttons: 'aside',
            },
            close: function() {}
        });


    } catch (error) {

    }
}

function BuildConfigurationStep(sender, blockIdentifier, $template) {
    try {

        var label = sender.model.attr('label/text');
        var enableNotifica = sender.model.attr('root/enableNotifica');
        var utenteNome = sender.model.attr('root/utenteNome') ? sender.model.attr('root/utenteNome') + ' ' : '';
        var utenteEmail = sender.model.attr('root/utenteEmail') || '';

        var form_title = 'Configurazione Step';
        var dialogName = blockIdentifier;
        var dialogId = '#' + dialogName;
        var $dlg = $template.octemplate({
            dialog_name: dialogName,
            stepLabel: label,
            notifyDaysValue: sender.model.attr('root/notifyDaysValue') || '',
            title: form_title,
            enablenotifica: (enableNotifica ? 'checked' : ''),
            utente: utenteNome + utenteEmail,
            utenteNome: utenteNome,
            utenteEmail: utenteEmail
        });

        var buttonlist = [{
            text: 'Chiudi',
            // classes: 'signbuttoncancel custom-btn cutstom-btn-grigio ',
            click: function() {
                $(dialogId).ocdialog('close');
            }
        }, ];
        $('.app-workflowmanager').append($dlg);
        BindEventsFirmaDigitale();

        AddButton(sender, buttonlist, function() {
            $(dialogId).ocdialog({
                width: 500,
                height: 400,
                modal: true,
                buttons: buttonlist,
                style: {
                    buttons: 'aside',
                },
                close: function() {}
            });

            //SHow Hide Ritardo 
            ShowHideRitardoDiv(enableNotifica, document.getElementById('notifyDaysTr'));

            //Call Autocomplete
            WFAutocompleteUtente(document.getElementById("tbUtenteAutocomplete"));

            //Enable/Disable Event Listener on Flag Ritardo
            EnDisRitardo(document.getElementById('enableNotificaRitardo'), document.getElementById('notifyDaysTr'));
            $(dialogId).show();
        });
    } catch (error) {

    }
}

function BuildConfigurationRuolo(sender, blockIdentifier, $template) {
    try {

        var label = sender.model.attr('label/text');
        var enableNotifica = sender.model.attr('root/enableNotifica');
        var form_title = 'Configurazione Ruolo';
        var dialogName = blockIdentifier;
        var dialogId = '#' + dialogName;
        var $dlg = $template.octemplate({
            dialog_name: dialogName,
            stepLabel: label,
            notifyDaysValue: sender.model.attr('root/notifyDaysValue') || '',
            title: form_title,
            enablenotifica: (enableNotifica ? 'checked' : '')
        });

        var buttonlist = [{
                text: 'Chiudi',
                click: function() {
                    $(dialogId).ocdialog('close');
                }
            },
            {
                text: 'Salva',
                // classes: 'signnextbutton custom-btn button.custom-btn.primary',
                click: function() {
                    //Save Utente
                    //Save Label
                    if (stepLabel && stepLabel.value) {
                        sender.model.attr('label/text', stepLabel.value);
                    }
                    //Notifica Ritardo
                    if (enableNotificaRitardo) {
                        let isChecked = enableNotificaRitardo.checked;
                        sender.model.attr('root/enableNotifica', isChecked);

                        //Save Days to go...
                        if (isChecked && $.isNumeric(notifyDaysValue.value)) {
                            sender.model.attr('root/notifyDaysValue', notifyDaysValue.value);
                        } else if (isChecked && !$.isNumeric(notifyDaysValue.value)) {
                            OC.dialogs.alert('Inserire un valore numerico per giorni', 'Avviso');
                            return this.click;
                        }
                        OC.dialogs.info('I dati verranno aggiornati dopo il salvataggio.', 'Info');
                    }
                },
                defaultButton: true
            }
        ];

        $('.app-workflowmanager').append($dlg);
        $(dialogId).ocdialog({
            width: 500,
            height: 400,
            modal: true,
            buttons: buttonlist,
            style: {
                buttons: 'aside',
            },
            close: function() {}
        });
        //Enable/Disable Event Listener on Flag Ritardo       
        ShowHideRitardoDiv(enableNotifica, document.getElementById('notifyDaysTr'));
        EnDisRitardo(document.getElementById('enableNotificaRitardo'), document.getElementById('notifyDaysTr'));

        $(dialogId).show();

    } catch (error) {

    }
}

function BindEventsFirmaDigitale() {
    $('#btnFileFirmaDigitale').bind("click", function(e) {
        ShowHidePopupFirmaDigitale();
        e.preventDefault();
    });

    $("#fileInputFirmaDigitale").bind("change", function(e) {
        $("#lblFileName").val('');
        var control = e.currentTarget;
        if (control != null) {
            for (var file of control.files)
                $("#lblFileName").val(file.name);
        }
        $("#fileInputFirmaDigitale").attr("data-bind", "local");
        ShowHidePopupFirmaDigitale();
        e.preventDefault();
    })

    $("#wf-lnkCloudFD").bind("click", function(e) {
        OC.dialogs.filepicker('Seleziona file', function(file) {
            $("#lblFileName").val(file);
            $("#fileInputFirmaDigitale").attr("data-bind", "cloud");
            ShowHidePopupFirmaDigitale();
            e.preventDefault();
        })
    })
}

function ShowHidePopupFirmaDigitale() {
    if (!$('#wfFirmaDigitale-pupupMenu').is(':visible')) {
        $("#wfFirmaDigitale-pupupMenu").show();
    } else {
        $("#wfFirmaDigitale-pupupMenu").hide();
    }
}

function AddButton(sender, buttonList, callback) {

    try {
        let jsonModel = {
            "Filter": {}
        };
        jsonModel.Filter.AppId = ncWorkflow.AppId;
        jsonModel.Filter.WorkflowId = ncWorkflow.WorkflowId;
        jsonModel.Filter.OwnerId = ncWorkflow.OwnerId;
        jsonModel.Filter.Id = sender.model.attr('root/id');

        GetAuthorizzation(jsonModel, function(authorized) {
            if (authorized) {
                var cellType = GetNextCellType(sender);
                if (cellType != null) {
                    if (cellType == "condition") {
                        buttonList.push({
                            text: 'Accetta',
                            classes: 'align-left',
                            click: function(e) {
                                ncWorkflow.ShowPageLoader('Attentere', 'content');
                                var successors = Paper.model.getSuccessors(sender.model);
                                let jsonModel = {
                                    "Filter": {}
                                };
                                jsonModel.Filter.AppId = ncWorkflow.AppId;
                                jsonModel.Filter.WorkflowId = ncWorkflow.WorkflowId;
                                jsonModel.Filter.OwnerId = ncWorkflow.OwnerId;
                                jsonModel.Filter.Id = sender.model.attr('root/id');
                                jsonModel.Filter.Stato = true;
                                SetEndWorkflow(jsonModel, function(performed) {
                                    if (performed) {
                                        DisableButtons(e);
                                        OC.dialogs.info("Operazione completata.", 'Info');
                                    } else
                                        OC.dialogs.alert("Non è stato possibile completare l'operazione.", 'Info');
                                });
                                ncWorkflow.HidePageLoader('content')
                            }
                        }, {
                            text: 'Rifiuta',
                            classes: 'align-left',
                            click: function(e) {
                                ncWorkflow.ShowPageLoader('Attentere', 'content');
                                var successors = Paper.model.getSuccessors(sender.model);
                                let jsonModel = {
                                    "Filter": {}
                                };
                                jsonModel.Filter.AppId = ncWorkflow.AppId;
                                jsonModel.Filter.WorkflowId = ncWorkflow.WorkflowId;
                                jsonModel.Filter.OwnerId = ncWorkflow.OwnerId;
                                jsonModel.Filter.Id = sender.model.attr('root/id');
                                jsonModel.Filter.Stato = false;
                                SetEndWorkflow(jsonModel, function(performed) {
                                    if (performed) {
                                        DisableButtons(e);
                                        OC.dialogs.info("Operazione completata.", 'Info');
                                    } else
                                        OC.dialogs.alert("Non è stato possibile completare l'operazione.", 'Info');
                                });
                                ncWorkflow.HidePageLoader('content')
                            }
                        }, {
                            text: 'Modifica',
                            classes: 'align-left',
                            click: function(e) {
                                ncWorkflow.ShowPageLoader('Attentere', 'content');
                                var successors = Paper.model.getSuccessors(sender.model);
                                let jsonModel = {
                                    "Filter": {}
                                };
                                jsonModel.Filter.AppId = ncWorkflow.AppId;
                                jsonModel.Filter.WorkflowId = ncWorkflow.WorkflowId;
                                jsonModel.Filter.OwnerId = ncWorkflow.OwnerId;
                                jsonModel.Filter.Id = sender.model.attr('root/id');
                                jsonModel.Filter.Stato = false;
                                SetAuthorizzation(jsonModel, function(response) {
                                    if (response.Performed) {
                                        DisableButtons(e);
                                        OC.dialogs.info("Operazione completata.", 'Info');
                                    } else
                                        OC.dialogs.alert("Non è stato possibile completare l'operazione.", 'Info');
                                });
                                ncWorkflow.HidePageLoader('content')
                            }
                        })
                    } else if (cellType == "ifthen") {
                        buttonList.push({
                            text: 'Conferma',
                            classes: 'align-left',
                            click: function(e) {
                                ncWorkflow.ShowPageLoader('Attentere', 'content');
                                let jsonModel = {
                                    "Filter": {}
                                };
                                jsonModel.Filter.AppId = ncWorkflow.AppId;
                                jsonModel.Filter.WorkflowId = ncWorkflow.WorkflowId;
                                jsonModel.Filter.OwnerId = ncWorkflow.OwnerId;
                                jsonModel.Filter.Id = sender.model.attr('root/id');
                                jsonModel.Filter.Stato = true;
                                SetAuthorizzation(jsonModel, function(response) {
                                    if (response.Performed) {
                                        DisableButtons(e);
                                        OC.dialogs.info("Operazione completata.", 'Info');
                                    } else
                                        OC.dialogs.alert("Non è stato possibile completare l'operazione.", 'Info');
                                });
                                ncWorkflow.HidePageLoader('content')
                            }
                        }, {
                            text: 'Annulla',
                            classes: 'align-left',
                            click: function(e) {
                                ncWorkflow.ShowPageLoader('Attentere', 'content');
                                let jsonModel = {
                                    "Filter": {}
                                };
                                jsonModel.Filter.AppId = ncWorkflow.AppId;
                                jsonModel.Filter.WorkflowId = ncWorkflow.WorkflowId;
                                jsonModel.Filter.OwnerId = ncWorkflow.OwnerId;
                                jsonModel.Filter.Id = sender.model.attr('root/id');
                                jsonModel.Filter.Stato = false;
                                SetAuthorizzation(jsonModel, function(response) {
                                    if (response.Performed) {
                                        DisableButtons(e);
                                        OC.dialogs.info("Operazione completata.", 'Info');
                                    } else
                                        OC.dialogs.alert("Non è stato possibile completare l'operazione.", 'Info');
                                });
                                ncWorkflow.HidePageLoader('content')
                            }

                        })
                    } else {
                        if (cellType == "firmadigitale") {
                            $("#rowWfFirmaDigitale").show();
                        }
                        buttonList.push({
                            text: 'Completa step',
                            classes: 'align-left',
                            click: function(e) {
                                e.preventDefault();
                                ncWorkflow.ShowPageLoader('Attentere', 'content');
                                var successors = Paper.model.getSuccessors(sender.model);
                                if (successors != null && successors.length > 0) {
                                    var identificativo = successors[0].attr('root/identificativo');
                                    if (identificativo != null) {
                                        let jsonModel = {
                                            "Filter": {}
                                        };
                                        jsonModel.Filter.AppId = ncWorkflow.AppId;
                                        jsonModel.Filter.WorkflowId = ncWorkflow.WorkflowId;
                                        jsonModel.Filter.OwnerId = ncWorkflow.OwnerId;
                                        jsonModel.Filter.Id = sender.model.attr('root/id');
                                        if (identificativo == "condition") {
                                            jsonModel.Filter.Stato = true;
                                            SetEndWorkflow(jsonModel, function(performed) {
                                                if (performed) {
                                                    e.currentTarget.disabled = true;
                                                    OC.dialogs.info("Operazione completata.", 'Info');
                                                } else
                                                    OC.dialogs.alert("Non è stato possibile completare l'operazione.", 'Info');
                                            });

                                        } else if (identificativo == "firmadigitale") {
                                            var dataBind = $("#fileInputFirmaDigitale").attr("data-bind");
                                            if (dataBind != null && dataBind == "local") {
                                                var control = $('#fileInputFirmaDigitale');
                                                if (control != null) {
                                                    if (control[0].files.length <= 0) {
                                                        OC.dialogs.info("Selezionare il file da firmare digitalmente per proseguire.", 'Info');
                                                        e.preventDefault();
                                                    } else {
                                                        let fReader = new FileReader();
                                                        fReader.readAsDataURL(control[0].files[0]);
                                                        fReader.onloadend = function(event) {
                                                            jsonModel.Filter.Stato = true;
                                                            jsonModel.FileName = control[0].files[0].name;
                                                            jsonModel.Stream = event.target.result;
                                                            jsonModel.Location = "local";
                                                            SetAuthorizzation(jsonModel, function(response) {
                                                                if (response.Performed) {
                                                                    e.currentTarget.disabled = true;
                                                                    $("#step").ocdialog('close');
                                                                    return $.when(ncWorkflow.getBlockTemplate("firmadigitale")).then(function($template) {
                                                                            BuildConfigurationFirmaDigitale("firmadigitale", $template);
                                                                        })
                                                                        // OC.dialogs.info("Operazione completata.", 'Info');
                                                                } else {
                                                                    OC.dialogs.alert("Non è stato possibile completare l'operazione.", 'Info');
                                                                }
                                                            })

                                                        }
                                                    }
                                                }
                                            } else if (dataBind != null && dataBind == "cloud") {
                                                let model = {
                                                    "Dto": {}
                                                };
                                                var fileName = $("#lblFileName").val();
                                                model.Dto.FileName = fileName;
                                                model.Dto.Stream = null;
                                                model.Dto.Location = "cloud";
                                                GetFilestream(fileName, function(stream) {
                                                    if (stream != null) {
                                                        jsonModel.Filter.Stato = true;
                                                        jsonModel.FileName = fileName;
                                                        jsonModel.Stream = stream;
                                                        jsonModel.Location = "cloud";
                                                        SetAuthorizzation(jsonModel, function(response) {
                                                            if (response.Performed) {
                                                                e.currentTarget.disabled = true;
                                                                OC.dialogs.info("Operazione completata.", 'Info');
                                                            } else {
                                                                OC.dialogs.alert("Non è stato possibile completare l'operazione.", 'Info');
                                                            }
                                                        })
                                                    } else {
                                                        OC.dialogs.alert("Non è stato possibile completare l'operazione.", 'Info');
                                                    }
                                                })

                                            } else {
                                                OC.dialogs.info("Selezionare il file da firmare digitalmente per proseguire.", 'Info');
                                                e.preventDefault();
                                            }

                                        } else {
                                            jsonModel.Filter.Stato = true;
                                            SetAuthorizzation(jsonModel, function(response) {
                                                if (response.Performed) {
                                                    e.currentTarget.disabled = true;
                                                    if (successors.length >= 1) {
                                                        if (successors[0].attr('root/identificativo') == "end") {
                                                            // ||
                                                            //     successors[1].attr('root/identificativo') == "Approvazione" ||
                                                            //     successors[1].attr('root/identificativo') == "Rifiuto") {
                                                            jsonModel.Filter.Id = successors[0].attr('root/id');
                                                            SetAuthorizzation(jsonModel, function(response) {
                                                                if (response.Performed) {
                                                                    OC.dialogs.info("Operazione completata.", 'Info');
                                                                } else
                                                                    OC.dialogs.alert("Non è stato possibile completare l'operazione.", 'Info');
                                                            });
                                                        } else
                                                            OC.dialogs.info("Operazione completata.", 'Info');
                                                    } else
                                                        OC.dialogs.info("Operazione completata.", 'Info');
                                                } else
                                                    OC.dialogs.alert("Non è stato possibile completare l'operazione.", 'Info');
                                            });
                                        }
                                    }
                                }
                                ncWorkflow.HidePageLoader('content')
                            }
                        })
                    }
                }
            }
            // else {
            //     var cellType = GetNextCellType(sender);
            //     if (cellType != null) {
            //         if (cellType == "firmadigitale") {
            //             let jsonModel = {
            //                 "Filter": {}
            //             };
            //             jsonModel.Filter.AppId = ncWorkflow.AppId;
            //             jsonModel.Filter.WorkflowId = ncWorkflow.WorkflowId;
            //             jsonModel.Filter.OwnerId = ncWorkflow.OwnerId;
            //             jsonModel.Filter.Id = sender.model.attr('root/id');
            //             GetCellFromId(jsonModel, function(currentCell) {
            //                 if (currentCell != null) {
            //                     var stato = currentCell.attrs.root.stato;
            //                     if (stato == "current")
            //                         $.when(ncWorkflow.getBlockTemplate("firmadigitale")).then(function($template) {
            //                             BuildConfigurationFirmaDigitale("firmadigitale", $template, currentCell);
            //                         })
            //                 }
            //             })

            //         }
            //     }
            // }
            if (callback)
                callback();
        })

        let model = {
            "Model": {}
        };
        model.Model.Filter = jsonModel.Filter;
        ncWorkflow.IsEngineStarted(model, function(isStart) {
            if (isStart != null) {
                if (!isStart)
                    $('#chkNotifyRitardo').show();
                if (!isStart) {
                    buttonList.push({
                        text: 'Salva',
                        // classes: 'signnextbutton custom-btn button.custom-btn.primary',
                        click: function() {
                            //Save Utente
                            if (UtenteSelected != null) {
                                let utenteNome = UtenteSelected.dataset.name;
                                let utenteEmail = UtenteSelected.dataset.email;
                                let utenteAccount = UtenteSelected.dataset.account;
                                if (utenteNome !== '' && utenteEmail !== '') {
                                    //Save User Data
                                    sender.model.attr('root/utenteNome', utenteNome);
                                    sender.model.attr('root/utenteEmail', utenteEmail);
                                    sender.model.attr('root/utenteAccount', utenteAccount);
                                    sender.model.attr('root/id', utenteAccount);
                                }
                                //Save Label
                                if (stepLabel && stepLabel.value) {
                                    sender.model.attr('label/text', stepLabel.value);
                                }
                                //Notifica Ritardo
                                if (enableNotificaRitardo) {
                                    let isChecked = enableNotificaRitardo.checked;
                                    sender.model.attr('root/enableNotifica', isChecked);
                                }
                                //Save Days to go...
                                if (notifyDaysValue && notifyDaysValue.value) {
                                    if (!isNaN(notifyDaysValue.value)) {
                                        sender.model.attr('root/notifyDaysValue', notifyDaysValue.value);
                                    } else {
                                        OC.dialogs.alert('Inserire un valore numerico per giorni', 'NaN');
                                        return this.click;
                                    }
                                }
                                OC.dialogs.info('I dati verranno aggiornati dopo il salvataggio.', 'Info');


                                //$(dialogId).ocdialog('close');
                            }
                        },
                        defaultButton: true
                    })

                }
            }
            if (callback)
                callback();
        })
    } catch (error) {

    }

}

function DisableButtons(e) {
    if (e != null) {
        var buttons = e.currentTarget.parentElement.getElementsByClassName("align-left");
        for (button of buttons) {
            button.disabled = true;
        }
    }
}

function ShowHideRitardoDiv(state, target) {
    if (state) {
        $(target).css('display', 'block');
    } else {
        $(target).css('display', 'none');
    }
}

function EnDisRitardo(control, target) {
    control.addEventListener('click', function() {
        var check = $(control).is(':checked');
        ShowHideRitardoDiv(check, target);
    })
}

function GetNextCellType(sender) {
    try {
        var successors = Paper.model.getSuccessors(sender.model);
        if (successors != null && successors.length > 0) {
            var identificativo = successors[0].attr('root/identificativo');
            if (identificativo != null) {
                return identificativo;
            }
        }
    } catch (error) {

    }
    return null;
}

function GetLocalFileContent(file, callback) {
    var reader = new FileReader();
    reader.onload = function(e) {
        reader.result;
        if (callback != null)
            callback(reader.result);
    }
    reader.readAsDataURL(file);
}

function SignDocument(jsonModel) {
    SignDialogs.showsignWizard();
    DigitalSignage(jsonModel, function(response) {

    })

}

function AddEventMenuDigitalSign(sender) {
    $("#btnPades").bind("click", function(e) {
        DigitalSignPades(sender);
    })

    $("#btnCades").bind("click", function(e) {
        DigitalSignCades(sender);
    })
}

function DigitalSignPades(sender) {
    var currentUser = OC.getCurrentUser();
    if (currentUser != null) {
        let jsonModel = {
            "Filter": {}
        };
        jsonModel.Filter.AppId = ncWorkflow.AppId;
        jsonModel.Filter.WorkflowId = ncWorkflow.WorkflowId;
        jsonModel.Filter.OwnerId = ncWorkflow.OwnerId;
        jsonModel.Filter.Id = currentUser.uid;
        GetCellFromId(jsonModel, function(userCell) {
            if (userCell != null && userCell.attrs.root.tempfolder != null && userCell.attrs.root.filename != null) {
                var path = userCell.attrs.root.tempfolder;
                var fileName = userCell.attrs.root.filename;
                var context = null;
                $.ajax({
                    type: 'POST',
                    contentType: 'application/json',
                    url: OC.generateUrl('apps/digitalpa_aruba/currentUser'),
                    dataType: 'json',
                    success: function(data) {
                        SignDialogsPades.showsignWizard(fileName, path, context, data['name'], data['sign_user'], function(response) {
                            ResponseDigitalSign(response, sender);
                        });
                    }
                });
            }
        });

    }
}

function DigitalSignCades(sender) {
    var currentUser = OC.getCurrentUser();
    if (currentUser != null) {
        let jsonModel = {
            "Filter": {}
        };
        jsonModel.Filter.AppId = ncWorkflow.AppId;
        jsonModel.Filter.WorkflowId = ncWorkflow.WorkflowId;
        jsonModel.Filter.OwnerId = ncWorkflow.OwnerId;
        jsonModel.Filter.Id = currentUser.uid;
        GetCellFromId(jsonModel, function(userCell) {
            if (userCell != null && userCell.attrs.root.tempfolder != null && userCell.attrs.root.filename != null) {
                var path = userCell.attrs.root.tempfolder;
                var fileName = userCell.attrs.root.filename;
                var context = null;
                var mimetype = "appplication/pdf";
                var iconurl = OC.MimeType.getIconUrl(mimetype);
                $.ajax({
                    type: 'POST',
                    contentType: 'application/json',
                    url: OC.generateUrl('apps/digitalpa_aruba/currentUser'),
                    dataType: 'json',
                    success: function(data) {

                        SignDialogs.showsignWizard(fileName, data['name'], path, context, DigitalpaUtil.CADES, iconurl, data['sign_user'], function(response) {
                            ResponseDigitalSign(response, sender);
                        });

                    }
                });
            }
        });

    }
}

function ResponseDigitalSign(result, sender) {
    ncWorkflow.ShowPageLoader('Attentere', 'content');
    if (result.status != "ko") {
        let jsonModel = {
            "Filter": {}
        };
        jsonModel.Filter.AppId = ncWorkflow.AppId;
        jsonModel.Filter.WorkflowId = ncWorkflow.WorkflowId;
        jsonModel.Filter.OwnerId = ncWorkflow.OwnerId;
        jsonModel.Filter.Id = sender.model.attr('root/id');
        jsonModel.Filter.Stato = true;
        SetAuthorizzation(jsonModel, function(response) {

            ncWorkflow.HidePageLoader('content')
        });
    }
}

function IsAuthorized(blockId) {
    var currentUser = OC.getCurrentUser();
    if (currentUser != null) {
        if (currentUser.uid == blockId)
            return true;
    }
    return false;
}