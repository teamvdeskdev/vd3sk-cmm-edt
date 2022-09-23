const tipoAzione = {
    APPROVAZIONE: 'Approvazione',
    RIFIUTO: 'Rifiuto'
}

function LoadAzioniWfa(model) {

    let url = OC.generateUrl('apps/wfam/azione/get');
    $("#WfaId").val(model.Model.Filter.WfaId);

    //Caricamento Azioni in Select

    bnlhrAjaxCallPOST(url, model, function(response) {
        if (response !== null && response.Model.Performed) {
            if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                this.BindViewSelectAzione(response.Model.Dtos);

                //Load Azioni on table
                url = OC.generateUrl('apps/wfam/azionewfa/get');
                //Approvazione
                model.Model.Filter.Tipo = tipoAzione.APPROVAZIONE;

                bnlhrAjaxCallPOST(url, model, function(response) {
                    if (response !== null && response.Model.Performed) {
                        if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                            this.BindViewAzioneApprovazione(response.Model.Dtos);
                        }
                    }
                });

                //Rifiuto
                model.Model.Filter.Tipo = tipoAzione.RIFIUTO;

                bnlhrAjaxCallPOST(url, model, function(response) {
                    if (response !== null && response.Model.Performed) {
                        if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                            this.BindViewAzioneRifiuto(response.Model.Dtos);
                            HidePageLoader();
                        } else
                            HidePageLoader();
                    }
                });

            } else {
                HidePageLoader();
            }
        } else {
            HidePageLoader();
        }
    });

}


function BindViewSelectAzione(dtos) {
    $("#bnlhr-selectAzioneApprovazioneDelibera").empty();
    $("#bnlhr-selectAzioneRifiutoDelibera").empty();
    $("<option value=\"-1\" selected disabled hidden>Seleziona azione</option>").appendTo("#bnlhr-selectAzioneApprovazioneDelibera");
    $("<option value=\"-1\" selected disabled hidden>Seleziona azione</option>").appendTo("#bnlhr-selectAzioneRifiutoDelibera");
    dtos.forEach(function(dto, index) {
        let row = GetTemplateAzione(dto);
        if (dto.Tipo == tipoAzione.APPROVAZIONE) {
            $(row).appendTo("#bnlhr-selectAzioneApprovazioneDelibera");
        } else {
            $(row).appendTo("#bnlhr-selectAzioneRifiutoDelibera");
        }
    });
}



function GetTemplateAzione(dto) {
    let row = "/n<option " +
        "data-descrizione=\"" + dto.Descrizione + "\"" +
        "data-tipo=\"" + dto.Tipo + "\"" +
        "value=\"" + dto.Id + "\">" + dto.Nome + "</option>";
    return row;
}

function BindViewAzioneApprovazione(dtos) {
    $("#bnlhr-listAzioniApprovazioneDelibera tbody").empty();
    dtos.forEach(function(dto, index) {
        let row = GetTemplateRowAzioneApprovazione(dto);
        $(row).appendTo("#bnlhr-listAzioniApprovazioneDelibera tbody");
        setDisabledSelectedAzione(row, tipoAzione.APPROVAZIONE)
    });
}

function BindViewAzioneRifiuto(dtos) {
    $("#bnlhr-listAzioniRifiutoDelibera tbody").empty();
    dtos.forEach(function(dto, index) {
        let row = GetTemplateRowAzioneRifiuto(dto);
        $(row).appendTo("#bnlhr-listAzioniRifiutoDelibera tbody");
        setDisabledSelectedAzione(row, tipoAzione.RIFIUTO)
    });
}

//ToDo : Change with only one function by "tipo"
function setDisabledSelectedAzione(row, tipo) {
    let azioneId = parseInt(($(row).attr("data-azione-id") ? $(row).attr("data-azione-id") : 0));
    switch (tipo) {
        case tipoAzione.APPROVAZIONE:
            $('#bnlhr-selectAzioneApprovazioneDelibera > option[value="' + azioneId + '"]').attr('disabled', 'true');
            break;
        case tipoAzione.RIFIUTO:
            $('#bnlhr-selectAzioneRifiutoDelibera > option[value="' + azioneId + '"]').attr('disabled', 'true');
            break;
    }
}


function GetTemplateRowAzioneApprovazione(dto) {

    let row = "<tr id=\"row-" + dto.Id + "\" data-id=\"" + dto.Id + "\" data-azione-id=\"" + dto.AzioneId + "\" to-delete=\"false\" data-tipo=\"" + dto.TipoAzione + "\">\n" +
        "                <td width=\"200px\" id=\"bnlhr-AzioneApprovazioneDelibera\">\n" +
        "                    <span class=\"bnlhr-font-weight-bold\">" + dto.NomeAzione + "</span>\n" +
        "                </td>\n" +
        "                <td width=\"200px\" id=\"id=\" bnlhr-tipoazioneapprovazionedelibera\"=\"\">\n" +
        "                    <span class=\"bnlhr-text-pre-wrap\">" + dto.TipoAzione + "</span>\n" +
        "                </td>\n" +
        "                <td id=\"id=\" bnlhr-descrizioneazioneapprovazionedelibera\"=\"\" width=\"500px\">\n" +
        "                <span class=\"bnlhr-text-pre-wrap\">" + dto.DescrizioneAzione + "</span>\n" +
        "                </td>\n" +
        "                <td width=\"100px\">\n" +
        "                    <input type=\"button\" id=\"bnlhr-btnRimuoviAzioneApprovazioneDelibera\" class=\"bnlhr-button-white\" value=\"RIMUOVI\">\n" +
        "                </td>\n" +
        "            </tr>";
    return row;
};


function BindModelAzione(row) {
    let dto = {};
    dto.Id = parseInt($(row).attr("data-id"));
    dto.WfaId = $("#WfaId").val();
    dto.AzioneId = parseInt($(row).attr("data-azione-id"));
    dto.Tipo = $(row).attr("data-tipo");
    return dto;
}

function GetTemplateRowAzioneRifiuto(dto) {

    let row = "<tr id=\"row-" + dto.Id + "\" data-id=\"" + dto.Id + "\" data-azione-id=\"" + dto.AzioneId + "\" to-delete=\"false\" data-tipo=\"" + dto.TipoAzione + "\">\n" +
        "                <td width=\"200px\" id=\"bnlhr-AzioneRifiutoDelibera\">\n" +
        "                    <span class=\"bnlhr-font-weight-bold\">" + dto.NomeAzione + "</span>\n" +
        "                </td>\n" +
        "                <td width=\"200px\" id=\"id=\" bnlhr-tipoazionerifiutodelibera\"=\"\">\n" +
        "                <span class=\"bnlhr-text-pre-wrap\">" + dto.TipoAzione + "</span>\n" +
        "                </td>\n" +
        "                <td width=\"500px\" id=\"id=\" bnlhr-descrizioneazionerifiutodelibera\"=\"\">\n" +
        "                <span class=\"bnlhr-text-pre-wrap\">" + dto.DescrizioneAzione + "</span>\n" +
        "                </td>\n" +
        "                <td width=\"100px\">\n" +
        "                    <input type=\"button\" id=\"bnlhr-btnRimuoviAzioneRifiutoDelibera\" class=\"bnlhr-button-white\" value=\"RIMUOVI\">\n" +
        "                </td>\n" +
        "            </tr>";
    return row;
};




$("#app-pages").on('change', '#bnlhr-selectAzioneApprovazioneDelibera', function(e) {
    let value = e.currentTarget.value;
    if (value != -1) {
        let dto = {};
        dto.Id = 0;
        dto.AzioneId = value;
        dto.NomeAzione = e.target.options[e.target.selectedIndex].text;
        dto.TipoAzione = e.target.options[e.target.selectedIndex].getAttribute('data-tipo');
        dto.DescrizioneAzione = e.target.options[e.target.selectedIndex].getAttribute('data-descrizione');

        $("#bnlhr-listAzioniApprovazioneDelibera tbody").append(GetTemplateRowAzioneApprovazione(dto));
        let selected = e.target.options[e.target.selectedIndex];
        $(selected).attr('disabled', true);
    }
    e.preventDefault();
});

$("#app-pages").on('change', '#bnlhr-selectAzioneRifiutoDelibera', function(e) {
    let value = e.currentTarget.value;
    if (value != -1) {
        let dto = {};
        dto.Id = 0;
        dto.AzioneId = value;
        dto.NomeAzione = e.target.options[e.target.selectedIndex].text;
        dto.TipoAzione = e.target.options[e.target.selectedIndex].getAttribute('data-tipo');
        dto.DescrizioneAzione = e.target.options[e.target.selectedIndex].getAttribute('data-descrizione');

        $("#bnlhr-listAzioniRifiutoDelibera tbody").append(GetTemplateRowAzioneRifiuto(dto));
        let selected = e.target.options[e.target.selectedIndex];
        $(selected).attr('disabled', true);
    }
    e.preventDefault();
});

//Save & proceed
$("#app-pages").on('click', '#bnlhr-btnAvantiAzioniDelibera', function() {
    EnableControlsAzioneDeliberaWFA(false);

    if ($("#bnlhr-listAzioniApprovazioneDelibera tbody > tr").length > 0 &&
        $("#bnlhr-listAzioniRifiutoDelibera tbody > tr").length > 0) {
        let url = OC.generateUrl("apps/wfam/riepilogo_wfa");
        SaveAzioniDelibera(url, 'Riepilogo', true);
    } else {
        EnableControlsAzioneDeliberaWFA(true);
        OC.dialogs.alert('Seleziona almeno una azione per tipo.', 'Info');
    }
});

//Save Fn
function SaveAzioniDelibera(url, breadcrumbName, forward) {
    DeleteAzioniDelibera('bnlhr-listAzioniApprovazioneDelibera', function(performed) {
        if (performed) {
            DeleteAzioniDelibera('bnlhr-listAzioniRifiutoDelibera', function(performed) {
                if (performed) {
                    SaveAzioneDeliberaWfa('bnlhr-listAzioniApprovazioneDelibera', function(performed) {
                        if (performed) {
                            SaveAzioneDeliberaWfa('bnlhr-listAzioniRifiutoDelibera', function(performed) {
                                if (performed) {
                                    model = { "Model": {} };
                                    model.Model.Filter = {};
                                    model.Model.Filter.WfaId = parseInt($("#WfaId").val());

                                    if (!forward) { navigation.Clear(); };
                                    navigation.GoTo(breadcrumbName, url, model, function(model) {
                                        if (forward) {
                                            ReadRiepilogo(model);
                                        } else {
                                            LoadWfa();
                                        }
                                    });
                                } else { OC.dialogs.alert('Salvataggio non riuscito', 'Info'); }
                            });
                        } else { OC.dialogs.alert('Salvataggio non riuscito', 'Info'); }
                    });
                } else { OC.dialogs.alert('Salvataggio non riuscito', 'Info'); }
            });
        } else { OC.dialogs.alert('Salvataggio non riuscito', 'Info'); }
    });
}

//Save & Exit
$("#app-pages").on('click', '#bnlhr-btnSalvaEsciAzioniDelibera', function() {
    EnableControlsAzioneDeliberaWFA(false);

    if ($("#bnlhr-listAzioniApprovazioneDelibera tbody > tr").length > 0 &&
        $("#bnlhr-listAzioniRifiutoDelibera tbody > tr").length > 0) {
        let url = OC.generateUrl("apps/wfam/gestione_wfa");
        SaveAzioniDelibera(url, 'Le mie richieste', false);
    } else {
        EnableControlsAzioneDeliberaWFA(true);
        OC.dialogs.alert('Seleziona almeno una azione per tipo.', 'Info');
    }
});

function DeleteAzioniDelibera(idTable, callback) {
    if ($("#" + idTable + " tbody > tr[to-delete=true]").length > 0) {
        $("#" + idTable + " tbody > tr[to-delete=true]").each(function(i, row) {
            let model = { "Model": { "Dto": {} } };
            dto = BindModelAzione(row);
            dto.WfaId = parseInt($("#WfaId").val());
            model.Model.Dto = dto;

            if ($(row).attr('data-id') > 0) {
                url = OC.generateUrl('apps/wfam/azionewfa/delete');
                bnlhrAjaxCallPOST(url, model, function(response) {
                    if (response !== null && response.Performed) {
                        if ($("#" + idTable + " tbody > tr[to-delete=true]").length - 1 == i) {
                            if (callback) { callback({ "Performed": true }); }
                        }
                    } else {
                        if (callback) { callback({ "Performed": false }); }
                    }
                });
            }
        })
    } else {
        if (callback) { callback({ "Performed": true }); }
    }
}

function SaveAzioneDeliberaWfa(idTable, callback) {

    if ($("#" + idTable + " tbody > tr[to-delete=false]").length > 0) {
        $("#" + idTable + " tbody > tr[to-delete=false]").each(function(i, row) {
                let model = { "Model": { "Dto": {} } };

                dto = BindModelAzione(row);

                dto.WfaId = parseInt($("#WfaId").val());
                model.Model.Dto = dto;

                let url = OC.generateUrl('apps/wfam/azionewfa/createorupdate');
                bnlhrAjaxCallPOST(url, model, function(response) {
                    if (response !== null && response.Model.Performed) {
                        if ($("#" + idTable + " tbody > tr[to-delete=false]").length - 1 == i) {
                            if (callback) { callback({ "Performed": true }); }
                        }
                    } else { callback({ "Performed": false }); }
                });

            })
            // } else { callback({ "Performed": false }); }
    }
}



//ToDo : Make only one Function
$("#app-pages").on('click', '#bnlhr-btnRimuoviAzioneApprovazioneDelibera', function(event) {
    let row = $(this).closest("tr");

    let el = $('#bnlhr-selectAzioneApprovazioneDelibera option[value="' + $(row).attr('data-azione-id') + '"]');
    $(el).removeAttr('disabled');

    if (row.attr('data-id') > 0) {
        row.attr('to-delete', true).hide();
    } else {
        row.remove();
    }
    event.preventDefault();
});

$("#app-pages").on('click', '#bnlhr-btnRimuoviAzioneRifiutoDelibera', function(event) {
    let row = $(this).closest("tr");

    let el = $('#bnlhr-selectAzioneRifiutoDelibera option[value="' + $(row).attr('data-azione-id') + '"]');
    $(el).removeAttr('disabled');

    if (row.attr('data-id') > 0) {
        row.attr('to-delete', true).hide();
    } else {
        row.remove();
    }
    event.preventDefault();
});

$("#app-pages").on('click', '#bnlhr-btnIndietroAzioniDelibera', function(event) {
    EnableControlsAzioneDeliberaWFA(false);

    let model = { "Model": { "Filter": {} } };
    model.Model.Filter.WfaId = parseInt($('#WfaId').val());
    navigation.Back(model, function(response) {
        LoadElementiWfa(response);
    });
    event.preventDefault();
});

function EnableControlsAzioneDeliberaWFA(enable) {
    $("#bnlhr-btnAvantiAzioniDelibera").prop("disabled", !enable);
    $("#bnlhr-btnIndietroAzioniDelibera").prop("disabled", !enable);
    $("#bnlhr-btnSalvaEsciAzioniDelibera").prop("disabled", !enable);
}