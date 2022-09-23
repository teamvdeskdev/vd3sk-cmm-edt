function LoadElementiWfa(model) {

    let url = OC.generateUrl('apps/wfam/elemento/get');

    $('#WfaId').val(model.Model.Filter.WfaId);

    bnlhrAjaxCallPOST(url, model, function(response) {
        if (response !== null && response.Model.Performed) {
            if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                this.BindViewOptionsElementi(response.Model.Dtos);

                url = OC.generateUrl('apps/wfam/elementowfa/get');
                //Order by Ordine
                model.Model.Order = {};
                model.Model.Order.Name = 'Ordine';
                model.Model.Order.Direction = 'ASC';
                bnlhrAjaxCallPOST(url, model, function(response) {
                    if (response !== null && response.Model.Performed) {
                        if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                            this.BindViewElementi(response.Model.Dtos);
                            HidePageLoader();
                        } else {
                            HidePageLoader();
                        }
                    } else {
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

function BindViewOptionsElementi(dtos) {
    $("#bnlhr-selectElementiRichiesta").empty();
    $("<option value=\" - 1\" selected disabled hidden>Seleziona elementi</option>").appendTo("#bnlhr-selectElementiRichiesta");
    dtos.forEach(function(dto, index) {
        let row = GetTemplateElementi(dto);
        $(row).appendTo("#bnlhr-selectElementiRichiesta");
    });

}

function BindViewElementi(dtos) {
    $("#bnlhr - listElementiRichiesta tbody").empty();
    dtos.forEach(function(dto, index) {
        let row = GetTemplateRowElementi(dto);
        $(row).appendTo("#bnlhr-listElementiRichiesta tbody");
        if (dto.TipoElemento == "RowsList") {
            wfaTable = new WFATable($("#grid-table"));
            if (dto.Rows) {
                var dtoRows = JSON.parse(dto.Rows);
                wfaTable.BindView(dtoRows);
            }
        }
        BindEvents(dto);
        setDisabledSelectedElementi(row);
        SortTableInizialize();
    });
}

function setDisabledSelectedElementi(row) {
    let elementoId = parseInt(($(row).attr("data-elemento-id") ? $(row).attr("data-elemento-id") : 0));

    $('#bnlhr-selectElementiRichiesta > option[value="' + elementoId + '"]').attr('disabled', 'true');
}


function BindModelElemento(row) {
    let dto = {};
    dto.WfaId = parseInt($("#WfaId").val());
    dto.Id = parseInt(($(row).attr("data-id") ? $(row).attr("data-id") : 0));
    dto.ElementoId = parseInt(($(row).attr("data-elemento-id") ? $(row).attr("data-elemento-id") : 0));
    dto.Ordine = parseInt(($(row).attr('data-ordine') ? $(row).attr('data-ordine') : 0));
    dto.Required = $(row).find("input[type='checkbox']").prop("checked");
    dto.Rows = null;
    var type = $(row).find("#bnlhr-tipoElementoRichesta").find("span").text();
    if (type && type == "RowsList") {
        if (wfaTable) {
            wfaTable.BindModel();
            dto.Rows = wfaTable.GetJson();
        }
    }
    return dto;
}


function GetTemplateElementi(dto) {
    let row = "/n<option " +
        "data-descrizione=\"" + dto.Descrizione + "\"" +
        "data-tipo=\"" + dto.Tipo + "\"" +
        "value=\"" + dto.Id + "\">" + dto.Nome + "</option>";
    return row;
}



function GetTemplateRowElementi(dto) {

    var checked = (dto.Required ? 'checked' : "");
    let row = "<tr id=\"row-" + dto.Id + "\" data-ordine=\"" + dto.Ordine + "\" data-id=\"" + dto.Id + "\" data-elemento-id=\"" + dto.ElementoId + "\" data-type=\"" + dto.TipoElemento + "\">\n" +
        "                <td width=\"200px\" id=\"bnlhr-elementoRichesta\">\n" +
        "                    <span class=\"bnlhr-font-weight-bold\">" + dto.NomeElemento + "</span>\n" +
        "                </td>\n" +

        "                <td width=\"200px\"  id=\"bnlhr-tipoElementoRichesta\">\n" +
        "                   <span class=\"bnlhr-text-pre-wrap\">" + dto.TipoElemento + "</span>\n" +
        "                </td>\n" +
        "                <td id=\"bnlhr-descrizioneElementoRichesta\">\n" +
        "                   <span class=\"bnlhr-text-pre-wrap\">" + dto.DescrizioneElemento + "</span>\n" +
        "                </td>\n";
    if (dto.TipoElemento != "RowsList") {
        row += "<td width = \"100px\">" +
            "<span\">Required</span>\n" +
            "                  <label class=\"container\" style=\"margin-left: 20px;\">\n" +
            "                  <input type=\"checkbox\" id=\"cbRequired" + dto.ElementoId + "\" " + checked + "  >\n" +
            "                  <span class=\"checkmark\"></span>\n" +
            "                  </label>\n" +
            "</td>";
    } else {
        row += "<td width=\"100px\" style=\"padding-right: 12px;\"><div id=\"icon-settings-table\" class=\"icon icon-settings bnlhr-cursor-pointer\" style=\"width: 20px;height: 20px;float: right;\" ></div>" +
            "<div class=\"panel-popup\">" +
            "<div class=\"section-title\" style=\"padding-left:10px\">Configurazione elemento lista</div>" +
            "<span style=\"padding-left:10px;padding-right:5px\">Numero di righe:</span>" +
            "<input id=\"row-number\" type=\"number\" style=\"width: 50px;\" value='1' min='1' />" +
            "<input type=\"button\" id=\"btn-addcolumn\" value=\"Aggiungi colonna\" class=\"bnlhr-button-white \" style=\"width:fit-content\" />" +
            "<table id=\"grid-table\">\n" +
            "        <tbody id=\"grid-list\">\n" +
            "        </tbody>\n" +
            "    </table>\n" +
            "<div class='footer'><input id='btnCofirmSettings' type=\"button\" value=\"chiudi\" action=\"confirm\" class=\"bnlhr-button-white\" style=\"width: fit-content;float: right;\" ></div>" +
            "</div>" +
            "</div>" +
            "</td>";
        // row += "<td ><span class=\"bnlhr-drop-target bnlhr-icon-drag\"></span></td>\n";

    }
    row += "<td width=\"200px\">\n" +
        "                    <input type=\"button\" id=\"bnlhr-btnRimuoviElementoRichesta\" class=\"bnlhr-button-white\"\n" +
        "                           value=\"RIMUOVI\"/>\n" +
        "                </td>\n";
    row += "<td ><span class=\"bnlhr-drop-target bnlhr-icon-drag\"></span></td>\n";
    row += "</tr>";
    return row;
}


$("#app-pages").on('change', '#bnlhr-selectElementiRichiesta', function(e) {
    let value = e.currentTarget.value;
    if (value != -1) {
        let dto = {};
        dto.Id = 0;
        dto.ElementoId = value;
        dto.Ordine = $('#bnlhr-listElementiRichiesta tbody:first > tr').length + 1;

        dto.NomeElemento = e.target.options[e.target.selectedIndex].text;
        dto.TipoElemento = e.target.options[e.target.selectedIndex].getAttribute('data-tipo');
        dto.DescrizioneElemento = e.target.options[e.target.selectedIndex].getAttribute('data-descrizione');

        var row = GetTemplateRowElementi(dto);
        $("#bnlhr-listElementiRichiesta tbody:first").append(row);
        BindEvents(dto);
        let selected = e.target.options[e.target.selectedIndex];
        $(selected).attr('disabled', true);
        SortTableInizialize();
    }
    e.preventDefault();
});

$("#app-pages").on('click', '#bnlhr-btnIndietroElementiRichiesta', function(event) {
    EnableControlsElementiRichiesta(false);

    let model = {
        "Model": {
            "Filter": {}
        }
    };
    model.Model.Filter.Id = parseInt($('#WfaId').val());
    navigation.Back(model, function(response) {
        ReadWfa(response);
    });
    event.preventDefault();
});

$("#app-pages").on('click', '#bnlhr-btnRimuoviElementoRichesta', function(event) {
    let row = $(this).closest("tr");
    let model = {};
    model = {
        "Model": {}
    };
    model.Model.Dto = {};

    let el = $('#bnlhr-selectElementiRichiesta option[value="' + $(row).attr('data-elemento-id') + '"]');
    $(el).removeAttr('disabled');

    if (row.attr('data-id') > 0) {
        row.attr('to-delete', true).hide();
    } else {
        row.remove();
    }
    if ($(row).attr("data-type") == "RowsList") {
        wfaTable = null;
        $(".panel-popup").remove();
    }
    event.preventDefault();
});


function SaveElementoRichiesta(i, row) {

    let toDelete = ($(row).attr('to-delete') ? $(row).attr('to-delete') : false);
    let model = {
        "Model": {}
    };
    let dto = BindModelElemento(row);
    dto.WfaId = parseInt($("#WfaId").val());

    model.Model.Dto = dto;
    if (toDelete && $(row).attr('data-id') > 0) {
        url = OC.generateUrl('apps/wfam/elementowfa/delete');
        bnlhrAjaxCallPOST(url, model, function(response) {
            if (response !== null && !response.Performed) {
                return;
            }
        });
    } else {
        dto.Ordine = i;
        //Update row Ordine 
        $(row).attr('data-ordine', i);
        url = OC.generateUrl('apps/wfam/elementowfa/createorupdate');
        bnlhrAjaxCallPOST(url, model, function(response) {
            if (response !== null && !response.Model.Performed) {
                return;
            }
        });
    }

}

//Save & Close
$("#app-pages").on('click', '#bnlhr-btnSalvaEsciElementiRichiesta', function() {
    EnableControlsElementiRichiesta(false);
    let rowOrder = 0;
    let url = "";
    // let WfaId =  parseInt($("#WfaId").val());
    model = {
        "Model": {}
    };
    model.Model.Dto = {};
    if ($("#bnlhr-listElementiRichiesta tbody:first > tr").length > 0) {
        $("#bnlhr-listElementiRichiesta tbody:first > tr").each(function(i, row) {
            //Save
            SaveElementoRichiesta(i, row);

            if (!$(row).attr('to-delete')) {
                rowOrder++;
            }
            if (i == $("#bnlhr-listElementiRichiesta tbody > tr").length - 1) {
                navigation.Clear();
                url = OC.generateUrl("/apps/wfam/gestione_wfa");
                navigation.GoTo("Gestione WFA", url, model, function(model) {
                    LoadWfa();
                });
            }
        });
    } else {
        navigation.Clear();
        url = OC.generateUrl("/apps/wfam/gestione_wfa");
        navigation.GoTo("Gestione WFA", url, model, function(model) {
            LoadWfa();
        });

    }
});

//Save & Proceed
$("#app-pages").on('click', '#bnlhr-btnAvantiElementiRichiesta', function() {

    EnableControlsElementiRichiesta(false);
    var validation = Validation();

    let rowOrder = 0;
    let url = "";
    let WfaId = parseInt($("#WfaId").val());
    model = {
        "Model": {}
    };
    model.Model.Dto = {};

    if ($("#bnlhr-listElementiRichiesta tbody:first > tr").length > 0 && validation) {
        $("#bnlhr-listElementiRichiesta tbody:first > tr").each(function(i, row) {
            //Save
            SaveElementoRichiesta(rowOrder, row);
            if (!$(row).attr('to-delete')) {
                rowOrder++;
            }
            if (i == $("#bnlhr-listElementiRichiesta tbody:first > tr").length - 1) {
                IsAzioniDeliberaPageEnabled(function(enabled) {
                    if (enabled) {
                        url = OC.generateUrl("/apps/wfam/azioniDelibera_wfa");
                        navigation.GoTo("Azioni di Delibera", url, model, function(model) {
                            model = {
                                "Model": {}
                            };
                            model.Model.Filter = {};
                            model.Model.Filter.WfaId = WfaId;
                            LoadAzioniWfa(model);

                        });
                    } else {
                        model = {
                            "Model": {}
                        };
                        model.Model.Filter = {};
                        model.Model.Filter.WfaId = WfaId;
                        SaveSkipAzioniDelibera(model, function(performed) {
                            if (performed) {
                                let url = OC.generateUrl("apps/wfam/riepilogo_wfa");
                                navigation.GoTo('Riepilogo', url, model, function(model) {
                                    ReadRiepilogo(model);
                                })
                            } else {
                                EnableControlsElementiRichiesta(true);
                            }
                        });
                    }
                })
            }
        });
    } else {
        if (!validation)
            OC.dialogs.alert('Selezionare le colonne del controllo Lista per proseguire.', 'AVVISO')
        else
            OC.dialogs.alert('Selezionare gli elementi richiesta.', 'AVVISO')
        EnableControlsElementiRichiesta(true);
    }
});

function EnableControlsElementiRichiesta(enable) {
    $("#bnlhr-btnAvantiElementiRichiesta").prop("disabled", !enable);
    $("#bnlhr-btnIndietroElementiRichiesta").prop("disabled", !enable);
    $("#bnlhr-btnSalvaEsciElementiRichiesta").prop("disabled", !enable);
}

function SaveSkipAzioniDelibera(modelFilter, callback) {
    url = OC.generateUrl('apps/wfam/azionewfa/get');
    bnlhrAjaxCallPOST(url, modelFilter, function(response) {
        if (response !== null && response.Model && response.Model.Performed && response.Model.Dtos !== null && response.Model.Dtos.length <= 0) {
            url = OC.generateUrl('apps/wfam/azione/get');
            bnlhrAjaxCallPOST(url, {
                "Model": {}
            }, function(response) {
                if (response !== null && response.Model && response.Model.Performed && response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                    var dtos = response.Model.Dtos;
                    var dtoApprovazione = dtos.find(x => x.Tipo == tipoAzione.APPROVAZIONE);
                    SaveAzione(dtoApprovazione, modelFilter.Model.Filter.WfaId, function(performed) {
                        if (performed) {
                            var dtoRifiuto = dtos.find(x => x.Tipo == tipoAzione.RIFIUTO);
                            SaveAzione(dtoRifiuto, modelFilter.Model.Filter.WfaId, function(performed) {
                                if (performed) {
                                    callback(performed);
                                } else {
                                    callback(performed);
                                    OC.dialogs.alert('Non è stato possibile definire azioni per il workflow.', 'Errore');
                                }
                            })
                        } else {
                            callback(performed);
                            OC.dialogs.alert('Non è stato possibile definire azioni per il workflow.', 'Errore');
                        }
                    })
                } else {
                    callback({
                        "Performed": false
                    });
                    OC.dialogs.alert('Nessuna azione disponibile per il workflow.', 'AVVISO');
                }
            });
        } else {
            callback({
                "Performed": true
            });
        }
    })
}

function SaveAzione(dto, wfaId, callback) {
    var model = {
        "Model": {
            "Dto": {}
        }
    };
    model.Model.Dto.Id = 0;
    model.Model.Dto.WfaId = wfaId;
    model.Model.Dto.AzioneId = dto.Id;
    model.Model.Dto.Tipo = dto.Tipo;
    let url = OC.generateUrl('apps/wfam/azionewfa/createorupdate');
    bnlhrAjaxCallPOST(url, model, function(response) {
        if (response !== null && response.Model !== null) {
            return callback({
                "Performed": response.Model.Performed
            });
        } else {
            callback({
                "Performed": false
            });
        }
    });
}

function BindEvents(dto) {
    if (dto.TipoElemento == "RowsList") {
        var rows = $("#bnlhr-listElementiRichiesta tbody>tr[data-type='RowsList']");
        $(rows).each(function(index, row) {
            var rowId = "#" + $(row).attr("id");
            var todelete = $(row).attr("to-delete");
            if (rowId == "#row-" + dto.Id && !todelete) {
                $(rowId + " #btn-addcolumn").unbind();
                $(rowId + " #btn-addcolumn").bind("click", function(e) {
                    e.preventDefault()
                    wfaTable.AddRowDesigner();
                });

                $(rowId + " #icon-settings-table").unbind("click");
                $(rowId + " #icon-settings-table").bind("click", function(e) {
                    var col = $(this).closest("td");
                    var panel = $(col).find(".panel-popup");
                    $(panel).show("fast");
                    if (!wfaTable)
                        wfaTable = new WFATable($("#grid-table"));
                });

                $(rowId + " #btnCofirmSettings").unbind("click");
                $(rowId + " #btnCofirmSettings").bind("click", function(e) {
                    if (wfaTable) {
                        var performed = wfaTable.BindModel();
                        if (performed)
                            $(".panel-popup").hide();
                        else
                            OC.dialogs.alert("I campi 'Etichetta' e 'Tipo' sono obbligatori", "AVVISO");
                    }
                })

            }
        })
    }
}

function Validation() {
    var validation = true;
    var rows = $("#bnlhr-listElementiRichiesta tbody>tr[data-type='RowsList']");
    if (rows.length > 0) {
        rows.each(function(index, row) {
            var todelete = $(row).attr("to-delete");
            if (!todelete) {
                if (!wfaTable) {
                    wfaTable = new WFATable($("#grid-table"));
                    validation = wfaTable.Validation("next");
                } else
                    validation = wfaTable.Validation("next");
                return;
            }
        })
    }
    return validation;
}