const statoWfa = {
    BOZZA: 'Bozza',
    PUBBLICATO: 'Pubblicato',
    DISABILITATO: 'Disabilitato'
}
let dataIdRuoloWfaToremove = [];
let dataIdGruppoRuoloWfaToremove = [];
let dataIdNotificheToremove = [];
let tooltipRuoloC = null;

function ReadWfa(model) {
    tooltipRuoloC = null
    autocompleteGroups(document.getElementById("utentiR"));
    autocompleteGroups(document.getElementById("utentiC1"));
    autocompleteGroups(document.getElementById("utentiA"));

    BindViewTooltips();
    dataIdRuoloWfaToremove = [];
    dataIdGruppoRuoloWfaToremove = [];
    dataIdNotificheToremove = [];
    $('#WfaId').val(model.Model.Filter.Id);
    let url = OC.generateUrl('apps/wfam/categoriawfa/get');
    bnlhrAjaxCallPOST(url, null, function(response) {
        if (response !== null && response.Model.Performed) {
            if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                BindViewCategoriaWFA(response.Model.Dtos);

                let url = OC.generateUrl('apps/wfam/wfa/read');
                bnlhrAjaxCallPOST(url, model, function(response) {
                    if (response !== null && response.Model.Performed) {
                        if (response.Model.Dto !== null) {
                            $("#bnlhr-btnEliminaWfa").show();
                            BindViewDefinisciWFA(response.Model.Dto);
                            let wfaId = response.Model.Dto.Id;
                            DeleteDisableWFAAction(wfaId);
                            model = {
                                "Model": {}
                            };
                            model.Model.Filter = {};
                            model.Model.Filter.WfaId = wfaId;
                            model.Model.Order = {
                                "Name": "UtenteId",
                                "Direction": "desc"
                            }
                            let url = OC.generateUrl('apps/wfam/ruolowfa/get');
                            bnlhrAjaxCallPOST(url, model, function(response) {
                                if (response !== null && response.Model.Performed) {
                                    if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                                        BindViewRuoloWFA(response.Model.Dtos, function() {
                                            SetNotificheRuoloWFA(response.Model.Dtos)
                                                //SetRuoliNotificaWfa(response.Model.Dtos);
                                            model = {
                                                "Model": {}
                                            };
                                            model.Model.Filter = {};
                                            model.Model.Filter.WfaId = wfaId;
                                            let url = OC.generateUrl('apps/wfam/notificheruolowfa/get');
                                            bnlhrAjaxCallPOST(url, model, function(response) {
                                                if (response !== null && response.Model.Performed) {
                                                    if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                                                        SetRuoliNotificaWfa(response.Model.Dtos);
                                                        BindViewNotificheRuoloWFA(response.Model.Dtos);
                                                        HidePageLoader();
                                                    } else {
                                                        HidePageLoader();
                                                    }
                                                } else {
                                                    HidePageLoader();
                                                }
                                            });
                                        });

                                    } else {
                                        HidePageLoader();
                                    }
                                } else {
                                    HidePageLoader();
                                }
                            }); //ruolowfa/get


                        } else {
                            SetIconWfa();
                            $("#bnlhr-btnEliminaWfa").hide();
                            HidePageLoader();
                        }
                    } else {
                        HidePageLoader();
                    }
                }); //wfa/read

            } else {
                SetIconWfa();
                HidePageLoader();
            }
        } else {
            HidePageLoader();
        }


    }); //categoriawfa/get
}

function SetRuoliNotificaWfa(dtos) {
    dtos.forEach(function(dto) {
        var codiceRuoloFase = dto.UtenteId;
        var codiceRuolo = dto.CodiceRuoloInformed;
        var ruoloInformedId = dto.RuoloInformedId;
        var notificaId = dto.Id;
        var container = document.getElementById("listRuoliFase" + codiceRuolo);
        var exist = ($(container).find("#tblRuolo" + codiceRuolo).length > 0);

        if (!exist) {
            var col = GetTemplateColumnRuoloNotificheRuoloWFA("Ruolo " + codiceRuolo, codiceRuolo, ruoloInformedId, notificaId);
            $(col).appendTo("#listRuoliFase" + codiceRuoloFase);
            var rowsGruppo = $("#bnlhr-ruoliWfa tbody>tr #GruppiRuolo" + codiceRuolo + " tbody>tr");
            AddGruppiNotifica(rowsGruppo, codiceRuolo, codiceRuoloFase);
            BindEventCheckAllRuoloNotifiche(col);
        }

    })

}

function SetIconWfa(dto = null) {
    var icona = (dto != null && dto.Icon != null ? dto.Icon : "defaultIcon.png");
    $("#txtIcona").attr("data-name", icona);
    $("#txtIcona").val(icona);

}

function BindViewTooltips() {
    GetRuolo(function(response) {
        if (response != null && response.Model.Performed && response.Model.Dtos != null) {
            var dtos = response.Model.Dtos;
            var ruoloR = dtos.find(x => x.Codifica == WFARUOLO.R);
            if (ruoloR != null) {
                ToolTips($("#lblUtenteR"), ruoloR.Descrizione);
                ToolTips($("#icon-info-R"), ruoloR.Descrizione);
            }
            var ruoloC = dtos.find(x => x.Codifica == WFARUOLO.C);
            if (ruoloC != null) {
                tooltipRuoloC = ruoloC.Descrizione;
                ToolTips($("#lblUtenteC"), ruoloC.Descrizione);
                ToolTips($("#icon-info-C1"), ruoloC.Descrizione);
            }
            var ruoloA = dtos.find(x => x.Codifica == WFARUOLO.A);
            if (ruoloA != null) {
                ToolTips($("#lblUtenteA"), ruoloA.Descrizione);
                ToolTips($("#icon-info-A"), ruoloA.Descrizione);
            }
        }
    })
}

function BindViewCategoriaWFA(dtos) {
    $("#CategoriaId").empty();
    let option = "<option value=\"-1\" selected disabled hidden>Seleziona una categoria</option>";
    $(option).appendTo("#CategoriaId");

    dtos.forEach(function(dto, index) {
        let option = GetTemplateCategoriaWFAOption(dto);
        option = GetTemplateCategoriaWFAOption(dto);
        $(option).appendTo("#CategoriaId");
    });
}

function BindViewDefinisciWFA(dto) {
    $("#WfaId").val(dto.Id);
    $("#Nome").val(dto.Nome);
    $("#CategoriaId").val(dto.CategoriaId);
    $("#CodificaAlfanumerica").val(dto.CodificaAlfanumerica);
    var cifreProgressivo = (dto.CifreNumericheProgressivo == null ? 5 : dto.CifreNumericheProgressivo);
    $("#CifreNumericheProgressivo").val(cifreProgressivo);
    var checked = (dto.RichiestaPersonale == 1 ? true : false);
    $("#chbRichiestePersonali").prop("checked", checked);
    SetIconWfa(dto);
}

function BindViewRuoloWFA(dtos, callback) {
    var count = dtos.length;
    var counter = 0;
    $("#bnlhr-ruoliWfa tbody").empty();
    dtos.forEach(function(dto, i) {
        let row = GetTemplateRuoloWFA(dto, dto.UtenteId);
        if (dto.CodificaRuolo == WFARUOLO.R)
            $(row).prependTo("#bnlhr-ruoliWfa tbody:first");
        else if (dto.CodificaRuolo == WFARUOLO.A)
            $(row).appendTo("#bnlhr-ruoliWfa tbody:first");
        else {
            var rowA = $("#bnlhr-ruoliWfa tbody>tr[data-codifica-ruolo='A']");
            var rowC1 = $("#bnlhr-ruoliWfa tbody>tr[data-codifica='C1']");
            var countC = $("#bnlhr-ruoliWfa tbody>tr[data-codifica='C']").length;
            if (rowC1.length > 0)
                $(row).insertAfter(rowC1);
            else if (rowA.length > 0)
                $(row).insertBefore(rowA);
            else if (countC > 0) {
                var rowC = $("#bnlhr-ruoliWfa tbody>tr[data-codifica='C']:first");
                $(row).insertBefore(rowC);
            } else
                $(row).appendTo("#bnlhr-ruoliWfa tbody:first");
        }

        BindViewGruppiRuoloWfa(dto, function() {
            counter += 1;
            if (counter == count)
                callback();
        })
    });
}

function BindViewGruppiRuoloWfa(dto, callback) {
    let url = OC.generateUrl('apps/wfam/grupporuolo/get');
    var model = {
        "Model": {
            "Filter": {
                "RuoloWfaId": dto.Id
            }
        }
    };
    bnlhrAjaxCallPOST(url, model, function(response) {
        if (response !== null && response.Model.Performed) {
            var gruppoRuoloDtos = response.Model.Dtos;
            gruppoRuoloDtos.forEach(function(dtoGruppo, i) {
                var index = $("#bnlhr-ruoliWfa tbody>tr[data-codifica-ruolo='" + dto.UtenteId + "'] #GruppiRuolo" + dto.UtenteId + " tbody>tr:last").attr("data-index-ruolo");
                index = (index != null ? parseInt(index) + 1 : 1);
                dtoGruppo.CodiceRuolo = dto.UtenteId;
                row = GetTemplateGruppoRuoloWfa(dtoGruppo, index);
                $(row).appendTo("#GruppiRuolo" + dto.UtenteId + " tbody");
                BindEventDeleteGroupRuoloWfa(dto.UtenteId + index, dto.UtenteId)
                dto.GroupName = dtoGruppo.Groupname;
            })
        }
        if (callback)
            callback();
    })
}

function BindViewNotificheRuoloWFA(dtos) {

    dtos.forEach(function(dto) {
        var rowNotifica = $("#bnlhr-notificheRuoloWfa tbody>tr[data-ruolo='" + dto.UtenteId + "']");
        $(rowNotifica).attr("data-id", dto.Id);

        if (dto.GroupsInformed != null) {
            var dtosInformed = JSON.parse(dto.GroupsInformed);
            dtosInformed.forEach(function(dto) {
                var rowId = (rowNotifica).attr("id");
                $("#" + rowId + " #cb" + dto.Name.replace(/[^a-z0-9]/gi, '')).prop("checked", dto.Informed);
            })
        }
    })
}

function SetRowsNotifiche() {

    var rowsRuolo = $("#bnlhr-ruoliWfa tbody:first").children();
    if (rowsRuolo.length > 0) {
        var dtos = [];
        $(rowsRuolo).each(function(index, rowRuolo) {
            let dto = {};
            dto.Id = parseInt($(rowRuolo).attr("data-id"));
            if (dto.Id >= 0) {
                dto.UtenteId = $(rowRuolo).attr("data-codifica-ruolo");
                dto.CodificaRuolo = $(rowRuolo).attr("data-codifica");
                dtos.push(dto);
            }
        })
        SetDataIdNotificheToremove();
        $("#bnlhr-notificheRuoloWfa tbody").empty();
        SetNotificheRuoloWFA(dtos);
    }

}

function SetNotificheRuoloWFA(dtos) {

    dtos.forEach(function(dto) {
        let dtoRuolo = {};
        dtoRuolo.Id = dto.Id;
        dtoRuolo.CodiceRuolo = dto.UtenteId;
        dtoRuolo.CodificaRuolo = dto.CodificaRuolo;
        var rowInsertTo = null;
        if (dtoRuolo.CodificaRuolo == WFARUOLO.C) {
            rowInsertTo = $("#bnlhr-notificheRuoloWfa tbody>tr[data-codifica-ruolo='C']:first").prev();
            if (rowInsertTo)
                rowInsertTo = $(rowInsertTo).prev();
        }
        SetNotificaRuoloWFA(dtoRuolo, rowInsertTo);
    });
    dtos.forEach(function(dto) {
        $("#bnlhr-notificheRuoloWfa tbody #rowFase-" + dto.UtenteId).attr("data-ruolo-id", dto.Id);
    });
    BindViewComboSelezionaRuoliNotifica();

}


function SetNotificaRuoloWFA(dto, rowInsertTo = null, refresh = true) {
    if (dto.CodificaRuolo === WFARUOLO.R) {
        var existRow = ($("#bnlhr-notificheRuoloWfa tbody #rowFase-" + dto.CodiceRuolo).length > 0);
        if (!existRow)
            AddNotifica(dto);
    }
    if (dto.CodificaRuolo === WFARUOLO.C) {
        var existRow = ($("#bnlhr-notificheRuoloWfa tbody #rowFase-" + dto.CodiceRuolo).length > 0);
        if (!existRow) {
            AddNotifica(dto, rowInsertTo);
        }
    }
    if (dto.CodificaRuolo === WFARUOLO.A) {
        var existRow = ($("#bnlhr-notificheRuoloWfa tbody #rowFase-" + dto.CodiceRuolo).length > 0);
        if (!existRow) {
            AddNotifica(dto);
        }
    }
}

//if (rowAfter) {
function AddNotifica(dto, rowInsertTo = null) {
    //var ruoloNotifiche = $(rowAfter).attr("data-codifica-ruolo");
    let row = GetTemplateRowNotificheRuoloWFA(dto);
    // var count = $("#bnlhr-notificheRuoloWfa tbody #rowFase-" + dto.CodiceRuolo).length;
    // if (count <= 0) {
    var body = $("#bnlhr-notificheRuoloWfa tbody").first();
    if (dto.CodificaRuolo == WFARUOLO.R)
        $(row).prependTo($(body)).first();
    else if (dto.CodificaRuolo == WFARUOLO.A)
        $(row).appendTo($(body)).first();
    else {
        if (rowInsertTo == null || (rowInsertTo != null && rowInsertTo.length <= 0)) {
            var countA = $("#bnlhr-notificheRuoloWfa tbody #rowFase-" + WFARUOLO.A).length;
            if (countA <= 0)
                $(row).appendTo($(body)).first();
            else {
                var rowA = $("#bnlhr-notificheRuoloWfa tbody #rowFase-" + WFARUOLO.A);
                $(row).insertBefore($(rowA).prev());
            }
        } else
            $(row).insertAfter(rowInsertTo);
    }
}

function AddGruppiNotifica(rowsGruppo, codificaRuolo, codiceRuoloFase) {
    if (codiceRuoloFase) {
        $(rowsGruppo).each(function(index, row) {
            var gruppo = $(row).attr("data-group");
            var col = GetTemplateColumnGroupsNotificheRuoloWFA(gruppo);
            $(col).appendTo("#listRuoliFase" + codiceRuoloFase + " #listGruppi" + codificaRuolo);
        })
    } else {
        $(rowsGruppo).each(function(index, row) {
            var gruppo = $(row).attr("data-group");
            var rowsFase = $("#bnlhr-notificheRuoloWfa tbody>tr");
            rowsFase.each(function(i, rowFase) {
                //for (var rowFase of rowsFase) {
                var rowId = $(rowFase).attr("id");
                if (rowId) {
                    var exist = ($("#" + rowId + " #listGruppi" + codificaRuolo + " li[data-group='" + gruppo + "']").length > 0);
                    if (!exist) {
                        var col = GetTemplateColumnGroupsNotificheRuoloWFA(gruppo);
                        $(col).appendTo("#" + rowId + " #listGruppi" + codificaRuolo);
                    }
                }
            })

        })
    }
}

function BindEventCheckAllRuoloNotifiche(col) {
    var colId = "#" + $(col).attr("id");
    var idControl = "#" + $(col).find(":input[type='checkbox']").attr("id");
    $(colId + " " + idControl).unbind();
    $(colId + " " + idControl).bind("click", function() {
        let row = $(this).closest("tr");
        $(row).find("input[type='checkbox']").prop('checked', this.checked);
    })

}

function BindViewComboSelezionaRuoliNotifica() {
    var ruoli = GetRuoliGui();
    for (var ruolo of ruoli) {
        var dtos = [];
        ruoli.filter(function(value) {
            if (value != ruolo) {
                var dto = {
                    "Nome": value
                };
                dtos.push(dto);
                return dto;
            }
        })
        var combo = document.getElementById("cmbRuoliFase" + ruolo);
        var container = document.getElementById("listRuoliFase" + ruolo);
        BindEventComboSelezionaRuoli(combo, dtos, container, ruolo);

        var arrow = document.getElementById("cmbRuoliFase" + ruolo + "Arrow");
        var container = document.getElementById("listRuoliFase" + ruolo);
        BindEventComboSelezionaRuoli(arrow, dtos, container, ruolo);

    }
}

function BindEventComboSelezionaRuoli(control, dtos, container, ruolo) {
    if (dtos && dtos.length > 0) {
        customSelect(control, dtos, container, function(checked, codiceRuoloFase, codiceRuolo, containerRuolo) {
            var exist = ($(containerRuolo).find("#tblRuolo" + codiceRuolo).length > 0);
            if (checked) {
                if (!exist) {
                    var ruoloWfaId = $("#bnlhr-ruoliWfa tbody>tr[data-codifica-ruolo='" + codiceRuolo + "']").attr("data-id");
                    var col = GetTemplateColumnRuoloNotificheRuoloWFA("Ruolo " + codiceRuolo, codiceRuolo, ruoloWfaId, 0);
                    $(col).appendTo("#listRuoliFase" + codiceRuoloFase);
                    var rowsGruppo = $("#bnlhr-ruoliWfa tbody>tr #GruppiRuolo" + codiceRuolo + " tbody>tr");
                    AddGruppiNotifica(rowsGruppo, codiceRuolo, codiceRuoloFase);
                    BindEventCheckAllRuoloNotifiche(col);
                }
            } else {
                var containerFase = document.getElementById("listRuoliFase" + codiceRuoloFase);

                var rowInformed = $(containerFase).find("#tblRuolo" + codiceRuolo);
                let dataId = parseInt($(rowInformed).attr("data-id"));
                if (dataId > 0) {
                    if (!dataIdNotificheToremove.includes(dataId))
                        dataIdNotificheToremove.push(dataId);
                }
                $(containerFase).find("#tblRuolo" + codiceRuolo).remove();
            }
        });
        var exist = ($("#tblRuolo" + ruolo).length > 0);
        if (exist) {
            var rowsGruppo = $("#bnlhr-ruoliWfa tbody>tr #GruppiRuolo" + ruolo + " tbody>tr");
            AddGruppiNotifica(rowsGruppo, ruolo, null);
        }
    } else
        customSelect(control, dtos, container, function(checked, codiceRuoloFase, codiceRuolo, containerRuolo) {});
}

function GetRuoliGui() {
    var rowsRuoli = $("#bnlhr-ruoliWfa tbody>tr");
    if (rowsRuoli.length >= 1) {
        var ruoli = [];
        rowsRuoli.filter(function(index, row) {
            var codifica = $(row).attr("data-codifica-ruolo");
            if (codifica)
                ruoli.push(codifica);
            return true;
        })
        return ruoli;
    }
    return null;
}

//Template
function GetTemplateCategoriaWFAOption(dto) {
    let option = "<option value=\"" + dto.Id + "\">" + dto.Nome + "</option>";
    return option;
}

function GetTemplateRuoloWFA(dto, index) {
    let row = "<tr id=\"row-" + dto.Id + "\" data-id=\"" + dto.Id + "\" data-codifica-ruolo='" + index + "' data-codifica='" + dto.CodificaRuolo + "' >\n" +
        "                <td width=\"20%\" id=\"Codice\">\n" +
        "                  <input id=\"RuoloId\" type=\"hidden\" value='" + dto.RuoloId + "'>\n" +
        "                  <table id='GruppiRuolo" + index + "' >" +
        "                   <tbody>" +
        "                   </tbody>" +
        "                  </table>" +
        "                </td>\n" +
        "                <td width=\"20%\" id=\"Codifica\">\n" +
        "                    <span class=\"bnlhr-text-pre-wrap\" data-codifica-ruolo='" + dto.CodificaRuolo + "'>Ruolo " + index + "</span>\n" +
        "                </td>\n" +
        "                <td width=\"40%\" id=\"descrizione\">\n" +
        "                    <span class=\"bnlhr-text-pre-wrap\">" + dto.DescrizioneRuolo + "</span>\n" +
        "                </td>\n" +
        "                <td width=\"20%\">\n" +
        "                    <input class=\"bnlhr-button-white\" id=\"btnRimuoviUtente\" type=\"button\" value=\"RIMUOVI\">\n" +
        "                </td>\n" +
        "            </tr>";
    return row;
}

function GetTemplateGruppoRuoloWfa(dto, index) {
    var row = "<tr data-id='" + dto.Id + "' data-group='" + dto.GroupName + "' data-index-ruolo='" + index + "'><td style=\"border:0;padding:0 0 0 2px;height: 10px\"><input id=\"GroupName\" type=\"hidden\" value='" + dto.GroupName + "'>\n" +
        "<span class=\"bnlhr-font-weight-bold\">" + dto.GroupName + "</span>\n</td>" +
        "<td style=\"border:0\"><span id='btnDeleteGroup" + dto.CodiceRuolo + index + "' data-group='" + dto.GroupName + "' class=\"delete-ruolo-icon\" >X</span></td>"
    "</tr>"
    return row;
}


function GetTemplateRowNotificheRuoloWFA(dto) {
    var dataRuoloId = (dto.Id ? dto.Id : 0);
    let row = "<tr>\n" +
        "      <td></td>\n" +
        "      <td width=\"250px\" height=\"35px\">\n" +
        "      <div class=\"custom-select\">\n" +
        "          <input id=\"cmbRuoliFase" + dto.CodiceRuolo + "\" data-id=\"-1\" type=\"text\" name=\"utenti" + dto.CodiceRuolo + "\" data-ruolo=\"" + dto.CodiceRuolo + "\" placeholder=\"SEL. RUOLO\" autocomplete=\"off\" readonly=\"readonly\" data-multiselect=\"true\">\n" +
        "          <span id=\"cmbRuoliFase" + dto.CodiceRuolo + "Arrow\" data-ruolo=\"" + dto.CodiceRuolo + "\" class=\"icon-triangle-s\"></span>\n" +
        "          </input>\n" +
        "      </div>\n" +
        "      </td>\n";
    if (dto.CodiceRuolo == WFARUOLO.R) {
        row += "<td>\n" +
            "          <span class=\"bnlhr-font-weight-bold\" style=\"padding: 0;padding-right:22px\">SEL. GRUPPI</span>\n" +
            "      </td>\n";
    }
    row += "  </tr>\n" +
        "<tr id=\"rowFase-" + dto.CodiceRuolo + "\" data-id=\"0\" data-codifica-ruolo=\"" + dto.CodiceRuolo.substring(0, 1) + "\" data-ruolo=\"" + dto.CodiceRuolo + "\" >\n" + //data-ruoloinformed-id=\"" + dataRuoloId + "\"
        "<td width=\"70px\" style=\"vertical-align: top;\"><span class=\"bnlhr-font-weight-bold\">Fase " + dto.CodiceRuolo + ":</span></td>\n" +
        "<td style=\"vertical-align: top;\" colspan=\"2\">" +
        "<div id='listRuoliFase" + dto.CodiceRuolo + "'></div>" +
        "</td>" +
        "</tr>\n";
    return row;
}

// function GetTemplateRowHeaderNotificheRuoloWFA(dto) {
//     var dataRuoloId = (dto.Id ? dto.Id : 0);
//     let row = "<tr>" +
//         "<td></td>" +
//         "<td width=\"250px\" height=\"35px\">" +
//         "    <div class=\"autocomplete\" style=\"width:80px;\">" +
//         "        " +
//         "        " +
//         "    </div>" +
//         "</td>" +
//         "<td>" +
//         "    <span class=\"bnlhr-font-weight-bold\" style=\"padding: 0;padding-right:22px\">SEL. GRUPPI</span>" +
//         "</td>" +
//         "</tr>";
//     return row;
// }

function GetTemplateColumnRuoloNotificheRuoloWFA(utente, codiceRuolo, ruoloInformedId, notificaId) {
    let col = "<table id=\"tblRuolo" + codiceRuolo + "\" data-id=\"" + notificaId + "\" data-codice-ruolo=\"" + codiceRuolo + "\" data-ruoloinformed-id=\"" + ruoloInformedId + "\">\n<tr>\n" +
        "<td width=\"250px\" style=\"vertical-align: top;padding-left: 5px;\">\n" +
        "<div style=\"width:107px\">" + utente + "\n" +
        "<label class=\"container\" style=\"float: right;\">\n" +
        "<input type=\"checkbox\" id=\"cbSelectAll" + codiceRuolo + "\">\n" +
        "<span class=\"checkmark\"></span>\n" +
        "</label></div>\n" +
        "</td>\n" +
        "<td style=\"padding-bottom: 15px;\">\n" +
        "<ul id='listGruppi" + codiceRuolo + "'>\n</ul>\n" +
        "</td>\n" +
        "</tr>\n</table>\n";
    return col;
}

function GetTemplateColumnGroupsNotificheRuoloWFA(gruppo) {

    var idGruppo = gruppo.replace(/[^a-z0-9]/gi, '');
    let col = "<li data-group='" + gruppo + "'>\n" +
        "<label class=\"container\" style=\"padding:0;padding-right: 13px;\">\n" +
        "<input type=\"checkbox\" id='cb" + idGruppo + "'>\n" +
        "<span class=\"checkmark\"></span>\n" +
        "</label><span>" + gruppo + "</span></li>\n";
    return col;
}

function GetTemplateAddRuoloC(currentIndex, index) {
    var rowId = "RowUtente" + currentIndex;
    var row = "<tr id=" + rowId + ">\n" +
        "<td width=\"100px\"><span class=\"bnlhr-font-weight-bold\" id='lblUtente" + currentIndex + "'>Ruolo " + currentIndex + "</span><span class=\"icon-info\" id=\"icon-info-" + currentIndex + "\"></span></td>\n" +
        "<td>\n" +
        "    <div class=\"autocomplete\" style=\"width:100%;\">\n" +
        "        <input id='utenti" + currentIndex + "' data-ruolo='" + currentIndex + "' data-id=\"-1\" type=\"text\" name='utenti" + currentIndex + "' placeholder=\"Cerca gruppo utenti\" autocomplete=\"off\" style=\"width:100%;border-radius: 5px 0 0 5px;\">\n" +
        "        <span id=\"autocompleteLoading\" class=\"icon-loading-small-dark\" style=\"display:none;top:0;left: -22px;padding:0\"></span>\n" +
        "    </div>\n" +
        "</td>\n" +
        "<td>\n" +
        "    <input type=\"button\" id='btnSelezionaUtente" + currentIndex + "' class=\"bnlhr-button-white button-form\" style=\"width: 100px\" data-index-ruolo='" + currentIndex + "' value=\"AGGIUNGI\">\n" +
        "    <input type=\"button\" id='btnAddUtente" + index + "' class=\"bnlhr-button-white\" data-index='" + index + "' value=\"+\" title='Aggiungi utente " + index + "' style=\"width:50px\">\n" +
        "    <input type=\"button\" id='btnDeleteUtente" + currentIndex + "' class=\"bnlhr-button-white\" data-index='" + currentIndex + "' value=\"-\" title='Elimina utente" + currentIndex + "' style=\"width:50px\">\n" +
        "</td>\n" +
        "<td></td>\n" +
        "<td></td>\n" +
        "</tr>\n";
    return row;
}

//BindModels

function BindModelDefinisciWFA(dto) {
    let date = moment(); //Get the current date
    date = date.format("YYYY-MM-DD"); //2014-07-10

    let model = {
        "Model": {}
    };
    model.Model.Dto = {};
    model.Model.Dto.Id = parseInt($("#WfaId").val());
    model.Model.Dto.Nome = $("#Nome").val();
    model.Model.Dto.CategoriaId = parseInt($("#CategoriaId").children("option:selected").val());
    model.Model.Dto.DataCreazione = date;
    model.Model.Dto.Creatore = OC.getCurrentUser().displayName; //utente che crea il wfa
    model.Model.Dto.Stato = statoWfa.BOZZA;
    model.Model.Dto.UrlStep = navigation.paths[navigation.paths.length - 1];
    model.Model.Dto.CodificaAlfanumerica = ($.trim($("#CodificaAlfanumerica").val()) == "" ? null : $.trim($("#CodificaAlfanumerica").val()));
    model.Model.Dto.CifreNumericheProgressivo = parseInt($.trim($("#CifreNumericheProgressivo").val()));
    model.Model.Dto.RichiestaPersonale = $("#chbRichiestePersonali").is(":checked");
    model.Model.Dto.Icon = ($("#txtIcona").attr("data-name") != "" ? $("#txtIcona").attr("data-name") : null);
    return model;
}

function BindModelRuoloWFA(row) {
    let model = {
        "Model": {}
    };
    model.Model.Dto = {};
    model.Model.Dto.Id = parseInt($(row).attr("data-id"));
    var ruoloIdControl = row.querySelector("td#Codice #RuoloId");
    if (model.Model.Dto.Id >= 0 && ruoloIdControl) {
        model.Model.Dto.WfaId = parseInt($('#WfaId').val());
        model.Model.Dto.UtenteId = $(row).attr("data-codifica-ruolo");
        model.Model.Dto.RuoloId = parseInt(row.querySelector("td#Codice #RuoloId").value);
        return model;
    }
    return null;
}

function BindModelNotificheRuoloWFA(column) {
    dtos.forEach(function(dto) {
        if (dto.CodificaRuoloWfa === "R") {
            $(column + " #check-" + dto.Ruol + dto.RuoloInformedId).prop('checked');
        }
        if (dto.CodificaRuoloWfa === "C") {
            $("#bnlhr-notificheRuoloWfaC" + dto.Id + " #check-" + dto.RuoloInformedId).prop('checked');
        }
        if (dto.CodificaRuoloWfa === "A") {
            $("#bnlhr-notificheRuoloWfaC" + dto.Id + " #check-" + dto.RuoloInformedId).prop('checked');
        }
    })
}

//events

//Select Utente R
$("#app-pages").on('click', '#btnSelezionaUtenteR', function(event) {
    let utenteId = $("#utentiR").attr("data-id");
    if (utenteId !== "-1") {
        let model = {
            "Model": {
                "Filter": {}
            }
        };
        model.Model.Filter.Codifica = "R";
        let url = OC.generateUrl('apps/wfam/ruolo/get');
        bnlhrAjaxCallPOST(url, model, function(response) {
            if (response !== null && response.Model.Performed) {
                if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                    let dtoRuolo = response.Model.Dtos[0];
                    let dto = {};
                    dto.Id = 0;
                    dto.RuoloId = dtoRuolo.Id;
                    dto.CodiceRuolo = WFARUOLO.R;
                    dto.CodificaRuolo = dtoRuolo.Codifica;
                    dto.DescrizioneRuolo = dtoRuolo.Descrizione;
                    dto.GroupName = $("#utentiR").attr("data-uid");
                    var existRowRuoloR = GetRowRuolo(WFARUOLO.R);
                    let row = "";
                    if (!existRowRuoloR) {
                        row = GetTemplateRuoloWFA(dto, WFARUOLO.R);
                        $(row).prependTo("#bnlhr-ruoliWfa tbody:first");
                    }
                    var index = $("#bnlhr-ruoliWfa tbody>tr[data-codifica-ruolo='R'] #GruppiRuolo" + dto.CodificaRuolo + " tbody>tr:last").attr("data-index-ruolo");
                    index = (index != null ? parseInt(index) + 1 : 1);
                    row = GetTemplateGruppoRuoloWfa(dto, index);
                    $(row).appendTo("#GruppiRuolo" + dto.CodificaRuolo + " tbody");
                    BindEventDeleteGroupRuoloWfa(dto.CodificaRuolo + index, dto.CodificaRuolo)
                    $('#utentiR').val("");
                    $("#utentiR").attr("data-id", -1);
                    //notificheWFA                   
                    SetNotificaRuoloWFA(dto);
                    BindViewComboSelezionaRuoliNotifica();
                }
            }
        });
    }
    event.preventDefault();
});

//Select Utente C
$("#app-pages").on('click', '#btnSelezionaUtenteC', function(e) {
    SelezionaGruppoRuoloC(e);
    e.preventDefault();
});

//Select Utente A
$("#app-pages").on('click', '#btnSelezionaUtenteA', function() {
    let utenteId = $("#utentiA").attr("data-id");
    if (utenteId !== "-1") {
        let model = {
            "Model": {
                "Filter": {}
            }
        };
        model.Model.Filter.Codifica = "A";
        let url = OC.generateUrl('apps/wfam/ruolo/get');
        bnlhrAjaxCallPOST(url, model, function(response) {
            if (response !== null && response.Model.Performed) {
                if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                    let dtoRuolo = response.Model.Dtos[0];
                    let dto = {};
                    dto.Id = 0;
                    //dto.UtenteId = utenteId;
                    dto.RuoloId = dtoRuolo.Id;
                    dto.CodiceRuolo = WFARUOLO.A; //dtoRuolo.Codice;
                    dto.CodificaRuolo = dtoRuolo.Codifica;
                    dto.DescrizioneRuolo = dtoRuolo.Descrizione;
                    dto.GroupName = $("#utentiA").attr("data-uid");
                    let row = "";
                    var existRowRuoloA = GetRowRuolo(WFARUOLO.A);
                    if (!existRowRuoloA) {
                        row = GetTemplateRuoloWFA(dto, WFARUOLO.A);
                        $(row).appendTo("#bnlhr-ruoliWfa tbody:first");
                    }
                    var index = $("#bnlhr-ruoliWfa tbody>tr[data-codifica-ruolo='A'] #GruppiRuolo" + dto.CodificaRuolo + " tbody>tr:last").attr("data-index-ruolo");
                    index = (index != null ? parseInt(index) + 1 : 1);
                    row = GetTemplateGruppoRuoloWfa(dto, index);
                    $(row).appendTo("#GruppiRuolo" + dto.CodificaRuolo + " tbody");
                    BindEventDeleteGroupRuoloWfa(dto.CodificaRuolo + index, dto.CodificaRuolo)
                    $('#utentiA').val("");
                    $("#utentiA").attr("data-id", -1);
                    //notificheWFA
                    SetNotificaRuoloWFA(dto);
                    BindViewComboSelezionaRuoliNotifica();
                }
            }
        });
    }
});

$("#app-pages").on('click', '#btnAddUtenteC2', function(e) {
    e.preventDefault();
    AddUtenteC(e);
})

function SelezionaGruppoRuoloC(e) {
    var indexC = $(e.currentTarget).attr("data-index-ruolo");
    let utenteId = $('#utenti' + indexC).attr("data-id");
    if (utenteId !== "-1") {
        let model = {
            "Model": {
                "Filter": {}
            }
        };
        model.Model.Filter.Codifica = "C";
        let url = OC.generateUrl('apps/wfam/ruolo/get');
        bnlhrAjaxCallPOST(url, model, function(response) {
            if (response !== null && response.Model.Performed) {
                if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                    let dtoRuolo = response.Model.Dtos[0];
                    let dto = {};
                    dto.Id = 0;
                    //dto.UtenteId = utenteId;
                    dto.RuoloId = dtoRuolo.Id;
                    dto.CodiceRuolo = indexC; //dtoRuolo.Codice;
                    dto.CodificaRuolo = dtoRuolo.Codifica;
                    dto.DescrizioneRuolo = dtoRuolo.Descrizione;
                    dto.GroupName = $("#utenti" + indexC).attr("data-uid");
                    let row = "";
                    var existRowRuoloC = GetRowRuolo(indexC);
                    if (!existRowRuoloC) {
                        row = GetTemplateRuoloWFA(dto, indexC);
                        var existRowRuoloA = GetRowRuolo(WFARUOLO.A);
                        if (!existRowRuoloA) {
                            $(row).appendTo("#bnlhr-ruoliWfa tbody:first");
                        } else {
                            var rowA = $("#bnlhr-ruoliWfa tbody>tr[data-codifica-ruolo='A']");
                            $(row).insertBefore(rowA);
                        }
                    }
                    var index = $("#bnlhr-ruoliWfa tbody>tr[data-codifica-ruolo='" + indexC + "'] #GruppiRuolo" + indexC + " tbody>tr:last").attr("data-index-ruolo");
                    index = (index != null ? parseInt(index) + 1 : 1);
                    row = GetTemplateGruppoRuoloWfa(dto, index);
                    $(row).appendTo("#GruppiRuolo" + indexC + " tbody");
                    BindEventDeleteGroupRuoloWfa(dto.CodiceRuolo + index, indexC)
                    $('#utenti' + indexC).val("");
                    $('#utenti' + indexC).attr("data-id", -1);
                    SetNotificaRuoloWFA(dto);
                    BindViewComboSelezionaRuoliNotifica();
                    var rowPrev = $("#bnlhr-ruoliWfa tbody tr[data-codifica-ruolo='" + indexC + "']").prev();
                    var dataCodifica = $(rowPrev).attr("data-codifica");
                    if (dataCodifica == WFARUOLO.C)
                        $(rowPrev).find(":input[type='button']").prop('disabled', true);
                }
            }
        });
    }
}

function AddUtenteC(e) {
    e.preventDefault();
    var control = e.currentTarget;
    var currentIndex = $(control).attr("data-index");
    var index = "C" + (parseInt(currentIndex.replace("C", "")) + 1);
    var row = GetTemplateAddRuoloC(currentIndex, index);
    var rowA = $("#tableAssegnaRuoliWfa tbody #RowUtenteA");
    $(row).insertBefore(rowA);
    autocompleteGroups(document.getElementById("utenti" + currentIndex));
    $("#btnAddUtente" + currentIndex).prop("disabled", true);
    ToolTips($("#lblUtente" + currentIndex), tooltipRuoloC);
    ToolTips($("#icon-info-" + currentIndex), tooltipRuoloC);
    $('#btnSelezionaUtente' + currentIndex).bind("click", function(e) {
        e.preventDefault();
        SelezionaGruppoRuoloC(e);
    });

    $('#btnAddUtente' + index).bind("click", function(e) {
        e.preventDefault();
        AddUtenteC(e)
        $("#btnDeleteUtente" + currentIndex).prop("disabled", true);
    });

    $('#btnDeleteUtente' + currentIndex).bind("click", function(e) {
        e.preventDefault();
        var rowId = "#RowUtente" + currentIndex;
        var previousIndex = "C" + (parseInt(currentIndex.replace("C", "")) - 1);
        $(this).unbind('click');
        $('#btnAddUtente' + index).unbind();
        $('#btnSelezionaUtente' + currentIndex).unbind();
        $("#tableAssegnaRuoliWfa tbody " + rowId).remove();
        $("#btnAddUtente" + currentIndex).prop("disabled", false);
        $("#btnDeleteUtente" + previousIndex).prop("disabled", false);
    });


}
//Save & Close
$("#app-pages").on('click', '#bnlhr-btnSalvaEsciDefinidciWFA', function(event) {
    EnableControlsDefinisciWFA(false);

    let modelWFA = BindModelDefinisciWFA();
    if (modelWFA.Model.Dto.Nome.length > 0 && modelWFA.Model.Dto.CategoriaId > 0) {
        DeleteNotifiche(dataIdNotificheToremove, function() {
            DeleteGroupsRuoloWfa(dataIdGruppoRuoloWfaToremove, function(response) {
                DeleteRuoliWFA(dataIdRuoloWfaToremove, function(response) { ///se false non deve andare avanti
                    SalvaDefinisciWFA(modelWFA, function(response) {
                        if (response.Model.Performed) {
                            SalvaRuoliDefinisciWFA(response, function(response) {
                                if (response.Model.Performed) {
                                    SalvaNotificheRuoloDefinisciWFA(function(response) {
                                        dataIdRuoloWfaToremove = [];
                                        dataIdGruppoRuoloWfaToremove = [];
                                        dataIdNotificheToremove = [];
                                        let model = {
                                            "Model": {}
                                        };
                                        model.Model.Filter = {};
                                        model.Model.Filter.WfaId = parseInt($('#WfaId').val());
                                        navigation.Clear();
                                        let url = OC.generateUrl("/apps/wfam/gestione_wfa");
                                        navigation.GoTo("Gestione WFA", url, model, function(model) {
                                            LoadWfa();
                                        });

                                    });
                                } else {
                                    EnableControlsDefinisciWFA(true);
                                    OC.dialogs.alert('Si è verificato un errore', 'Errore');
                                }
                            });
                        } else {
                            EnableControlsDefinisciWFA(true);
                            OC.dialogs.alert('Si è verificato un errore nella creazione del WFA', 'Errore');
                        }
                    });
                });
            });
        });
    } else {
        EnableControlsDefinisciWFA(true);
        OC.dialogs.info('Per proseguire è necessario\n inserire il nome del WFA da creare,\n selezionare una categoria,\n ' +
            ' selezionare gli utenti', 'AVVISO');
    }
    event.preventDefault();
});


function SalvaDefinisciWFA(modelWFA, callback) {
    let url = OC.generateUrl('apps/wfam/wfa/createorupdate');
    bnlhrAjaxCallPOST(url, modelWFA, function(response) {
        if (response !== null && response.Model.Performed) {
            if (response.Model.Dto !== null) {
                $('#WfaId').val(response.Model.Dto.Id);
                UploadIcon(function(responseUpload) {
                    if (!responseUpload.Performed)
                        OC.dialogs.alert("Errore nel caricamento dell'icona", 'Avviso');

                    if (callback)
                        callback(response);
                })

            }
        } else {
            if (callback)
                callback(response);
        }
    });
}

function SalvaRuoliDefinisciWFA(response, callback) {
    let count = $("#bnlhr-ruoliWfa tbody:first").children().length;
    let counter = 0;
    if (count > 0) {
        $("#bnlhr-ruoliWfa tbody:first").children().each(function(index, row) {
            let modelRuoloWFA = BindModelRuoloWFA(row);
            let url = OC.generateUrl('apps/wfam/ruolowfa/createorupdate');
            bnlhrAjaxCallPOST(url, modelRuoloWFA, function(response) {
                if (response !== null && response.Model.Performed) {
                    if (response.Model.Dto !== null) {
                        let dto = response.Model.Dto;
                        $(row).attr("id", "row-" + dto.Id + "");
                        $(row).attr("data-id", "" + dto.Id + "");
                        $("#bnlhr-notificheRuoloWfa tbody tr[data-ruolo='" + dto.UtenteId + "']").attr("data-ruolo-id", "" + dto.Id + "");
                        dto.CodiceRuolo = $(row).attr("data-codifica-ruolo");
                        dto.CodificaRuolo = $(row).attr("data-codifica");
                        //SetNotificaRuoloWFA(dto, null, false);
                        SalvaGruppiRuoloWfa(dto, function(response) {
                            //SetNotificaRuoloWFA(dto, null, false);
                            //BindViewComboSelezionaRuoliNotifica();
                            counter = counter + 1;
                            if (count == counter) {
                                if (callback)
                                    callback({
                                        "Model": {
                                            "Performed": true
                                        }
                                    });
                            }
                        })
                    }
                } else {
                    counter = counter + 1;
                    if (count == counter) {
                        if (callback)
                            callback({
                                "Model": {
                                    "Performed": true
                                }
                            });
                    }
                }
            })
        });
    } else {
        if (callback)
            callback({
                "Model": {
                    "Performed": true
                }
            });
        return;
    }
}

function SalvaGruppiRuoloWfa(ruoloDto, callback) {
    let count = $("#bnlhr-ruoliWfa tbody>tr[data-id=" + ruoloDto.Id + "] table tbody>tr").length
    let counter = 0;
    if (count > 0) {
        var rowsGruppi = $("#bnlhr-ruoliWfa tbody>tr[data-id=" + ruoloDto.Id + "] table tbody>tr");
        $(rowsGruppi).each(function(index, rowGruppo) {
            var model = BindModelGruppoRuolo(rowGruppo, ruoloDto);
            if (model != null) {
                let url = OC.generateUrl('apps/wfam/grupporuolo/createorupdate');
                bnlhrAjaxCallPOST(url, model, function(response) {
                    if (response !== null && response.Model.Performed) {
                        if (response.Model.Dto !== null) {
                            let dto = response.Model.Dto;
                            $(rowGruppo).attr("data-id", dto.Id);
                            $(rowGruppo).attr("data-ruolo-id", ruoloDto.Id);

                            $("#bnlhr-notificheRuoloWfa tbody>tr ul>li[data-group='" + dto.GroupName + "']").attr("data-id", dto.Id);
                            counter = counter + 1;
                            if (count == counter) {
                                if (callback)
                                    callback({
                                        "Model": {
                                            "Performed": true
                                        }
                                    });
                            }
                        }
                    } else {
                        if (callback)
                            callback(response);
                        return;
                    }
                })
            } else {
                counter = counter + 1;
            }
            if (count == counter) {
                if (callback)
                    callback({
                        "Model": {
                            "Performed": true
                        }
                    });
                return;
            }
        })
    } else {
        if (callback)
            callback({
                "Model": {
                    "Performed": true
                }
            });
        return;
    }
}

function BindModelGruppoRuolo(row, ruoloDto) {
    let model = {
        "Model": {}
    };
    model.Model.Dto = {};
    model.Model.Dto.Id = parseInt($(row).attr("data-id"));
    if (model.Model.Dto.Id >= 0) {
        model.Model.Dto.RuoloWfaId = ruoloDto.Id;
        model.Model.Dto.GroupName = $(row).attr("data-group");
        return model;
    }
    return null;
}

function DeleteRuoliWFA(array, callback) {
    let count = array.length;
    let counter = 0;
    if (array.length > 0) {
        array.forEach(function(id, index) {
            let modelFilter = {
                "Model": {
                    "Filter": {}
                }
            };
            modelFilter.Model.Filter.RuoloWfaId = id;
            DeleteNotificheRouloWFA(modelFilter, function(response) {
                modelFilter = {
                    "Model": {
                        "Filter": {}
                    }
                };
                modelFilter.Model.Filter.RuoloInformedId = id;
                DeleteNotificheRouloWFA(modelFilter, function(response) {
                    let model = {
                        "Model": {
                            "Dto": {}
                        }
                    };
                    model.Model.Dto.Id = id;
                    let url = OC.generateUrl('apps/wfam/ruolowfa/delete');
                    bnlhrAjaxCallPOST(url, model, function(response) {
                        counter += 1;
                        if (count == counter) {
                            if (callback)
                                callback({
                                    "Model": {
                                        "Performed": true
                                    }
                                });
                        }
                    })
                })
            })
        })
    } else {
        if (callback)
            callback({
                "Model": {
                    "Performed": true
                }
            });
    }
}

function DeleteNotificheRouloWFA(modelFilter, callback) {

    //modelFilter.Model.Filter.RuoloInformedId=ruoloWfaId;
    let count = 0;
    let url = OC.generateUrl('apps/wfam/notificheruolowfa/get');
    bnlhrAjaxCallPOST(url, modelFilter, function(response) {
        if (response !== null && response.Model.Performed) {
            if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                count = response.Model.Dtos.length;
                let counter = 0;
                response.Model.Dtos.forEach(function(dto, index) {
                    let model = {
                        "Model": {
                            "Dto": {}
                        }
                    };
                    model.Model.Dto = dto;
                    let url = OC.generateUrl('apps/wfam/notificheruolowfa/delete');
                    bnlhrAjaxCallPOST(url, model, function(responseDelete) {
                        counter = counter + 1;
                        if (count == counter) {
                            if (callback)
                                callback({
                                    "Model": {
                                        "Performed": true
                                    }
                                });
                        }
                    })
                })


            } else {
                if (callback)
                    callback({
                        "Model": {
                            "Performed": true
                        }
                    });
            }
        }
    })
}

function DeleteGroupsRuoloWfa(array, callback) {
    let count = array.length;
    let counter = 0;
    if (array.length > 0) {
        array.forEach(function(id, index) {
            let model = {
                "Model": {
                    "Dto": {}
                }
            };
            model.Model.Dto.Id = id;
            let url = OC.generateUrl('apps/wfam/grupporuolo/delete');
            bnlhrAjaxCallPOST(url, model, function(response) {
                counter += 1;
                if (counter == count) {
                    if (callback)
                        callback({
                            "Model": {
                                "Performed": true
                            }
                        });
                    return;
                }
            })
        })
    } else {
        if (callback)
            callback({
                "Model": {
                    "Performed": true
                }
            });
    }
}

function DeleteNotifiche(array, callback) {
    let count = array.length;
    let counter = 0;
    if (array.length > 0) {
        array.forEach(function(id, index) {
            let model = {
                "Model": {
                    "Dto": {}
                }
            };
            model.Model.Dto.Id = id;
            let url = OC.generateUrl('apps/wfam/notificheruolowfa/delete');
            bnlhrAjaxCallPOST(url, model, function(responseDelete) {
                counter = counter + 1;
                if (count == counter) {
                    if (callback)
                        callback({
                            "Model": {
                                "Performed": true
                            }
                        });
                }
            })
        })
    } else {
        if (callback)
            callback({
                "Model": {
                    "Performed": true
                }
            });
    }
}

function SalvaNotificheRuoloDefinisciWFA(callback) {
    let count = $("#bnlhr-notificheRuoloWfa tbody>tr[id]").length;
    let counter = 0;
    if (count > 0) {
        var rows = $("#bnlhr-notificheRuoloWfa tbody>tr[id]");
        $(rows).each(function(index, row) {
            var id = $(row).attr("id");
            if (id) {
                var model = {
                    "Model": {
                        "Dto": {}
                    }
                };
                model.Model.Dto.RuoloWfaId = parseInt($(row).attr("data-ruolo-id"));
                var ruoloUtente = $(row).attr("data-ruolo");
                var rowsInformed = row.querySelectorAll("table");
                if ($(rowsInformed) && $(rowsInformed).length > 0) {
                    $(rowsInformed).each(function(index, rowInformed) {
                        var ruoloInformed = $(rowInformed).attr("data-codice-ruolo");
                        var ruoloInformedId = $("#bnlhr-ruoliWfa tbody>tr[data-codifica-ruolo='" + ruoloInformed + "']").attr("data-id");
                        $(rowInformed).attr("data-ruoloinformed-id", ruoloInformedId);

                        model.Model.Dto.Id = parseInt($(rowInformed).attr("data-id"));
                        model.Model.Dto.RuoloInformedId = parseInt($(rowInformed).attr("data-ruoloinformed-id"));

                        var groups = rowInformed.querySelectorAll("ul>li");
                        var dtos = [];
                        $(groups).each(function(index, group) {
                            var dto = {};
                            dto.Id = parseInt($(group).attr("data-id"));
                            dto.Name = $(group).attr("data-group");
                            var idGruppo = dto.Name.replace(/[^a-z0-9]/gi, '');
                            dto.Informed = group.querySelector("#cb" + idGruppo).checked;
                            dtos.push(dto);
                        })
                        model.Model.Dto.GroupsInformed = JSON.stringify(dtos);
                        let url = OC.generateUrl('apps/wfam/notificheruolowfa/createorupdate');
                        bnlhrAjaxCallPOST(url, model, function(response) {
                            if (response != null && response.Model != null && response.Model.Performed) {
                                $(rowInformed).attr("data-id", response.Model.Dto.Id);
                            }
                            counter += 1;
                            if (count == counter)
                                callback();
                        })
                    })
                } else {
                    counter += 1;
                    if (count == counter)
                        callback();
                }
            }
        });
    } else {
        if (callback)
            callback();
    }
}

//Save & Proceed
$("#app-pages").on('click', '#bnlhr-btnAvantiDefinidciWFA', function(event) {
    ShowPageLoader();
    EnableControlsDefinisciWFA(false);
    let modelWFA = BindModelDefinisciWFA();
    if (modelWFA.Model.Dto.Nome.length > 0 && modelWFA.Model.Dto.CategoriaId > 0) {
        DeleteNotifiche(dataIdNotificheToremove, function() {
            DeleteGroupsRuoloWfa(dataIdGruppoRuoloWfaToremove, function(response) {
                DeleteRuoliWFA(dataIdRuoloWfaToremove, function(response) { ///se false non deve andare avanti
                    SalvaDefinisciWFA(modelWFA, function(response) {
                        if (response.Model.Performed) {
                            SalvaRuoliDefinisciWFA(response, function(response) {
                                if (response.Model.Performed) {
                                    SalvaNotificheRuoloDefinisciWFA(function(response) {
                                        dataIdRuoloWfaToremove = [];
                                        dataIdGruppoRuoloWfaToremove = [];
                                        dataIdNotificheToremove = [];
                                        let model = {
                                            "Model": {}
                                        };
                                        model.Model.Filter = {};
                                        model.Model.Filter.WfaId = parseInt($('#WfaId').val());
                                        let url = OC.generateUrl("/apps/wfam/elementiRichiesta_wfa");
                                        navigation.GoTo("Elementi di richiesta", url, model, function(model) {
                                            LoadElementiWfa(model);
                                            HidePageLoader();
                                        });

                                    });
                                } else {
                                    HidePageLoader();
                                    EnableControlsDefinisciWFA(true);
                                    OC.dialogs.alert('Si è verificato un errore', 'Errore');
                                }
                            });
                        } else {
                            HidePageLoader();
                            EnableControlsDefinisciWFA(true);
                            OC.dialogs.alert('Si è verificato un errore nella creazione del WFA', 'Errore');
                        }
                    });
                });
            })
        })
    } else {
        HidePageLoader();
        EnableControlsDefinisciWFA(true);
        OC.dialogs.info('Per proseguire è necessario\n inserire il nome del WFA da creare,\n selezionare una categoria,\n ' +
            ' selezionare gli utenti', 'AVVISO');
    }
    event.preventDefault();
});

function EnableControlsDefinisciWFA(enable) {
    $("#bnlhr-btnAvantiDefinidciWFA").prop("disabled", !enable);
    $("#bnlhr-btnIndietroDefinidciWFA").prop("disabled", !enable);
    $("#bnlhr-btnSalvaEsciDefinidciWFA").prop("disabled", !enable);
    $("#bnlhr-btnEliminaWfa").prop("disabled", !enable);
}

function EnableCategoria(enable) {
    $("#bnlhr-btnAggiungiCategoria").prop("disabled", !enable);
}

//Back
$("#app-pages").on('click', '#bnlhr-btnIndietroDefinidciWFA', function(event) {
    EnableControlsDefinisciWFA(false);

    let model = {
        "Model": {
            "Filter": {}
        }
    };
    model.Model.Filter.Id = parseInt($('#WfaId').val());
    navigation.Back(model, function() {
        LoadWfa();
    });
    event.preventDefault();
});
//delete
$("#app-pages").on('click', '#bnlhr-btnEliminaWfa', function(event) {
    event.preventDefault();
    EnableControlsDefinisciWFA(false);
    let model = {
        "Model": {
            "Dto": {}
        }
    };
    model.Model.Dto.Id = parseInt($('#WfaId').val());
    var action = $("#bnlhr-btnEliminaWfa").attr("data-action");
    if (action == "disabled") {
        model.Model.Dto.Disabled = true;
        model.Model.Dto.Stato = statoWfa.DISABILITATO;
        let url = OC.generateUrl('apps/wfam/wfa/update');
        bnlhrAjaxCallPOST(url, model, function(response) {
            if (response !== null && response.Model.Performed) {
                navigation.Back(model, function() {
                    LoadWfa();
                });
            }
        })
    } else if (action == "delete") {
        let url = OC.generateUrl('apps/wfam/wfa/delete');
        bnlhrAjaxCallPOST(url, model, function(response) {
            if (response !== null && response.Performed) {
                navigation.Back(model, function() {
                    LoadWfa();
                });
            }
        })
    }
});

function DeleteDisableWFAAction(wfaId) {
    CountPraticheWfa(wfaId, function(count) {
        if (count > 0) {
            $("#bnlhr-btnEliminaWfa").attr("data-action", "disabled");
            $("#bnlhr-btnEliminaWfa").val("Disabilita");
        } else {
            $("#bnlhr-btnEliminaWfa").attr("data-action", "delete");
            $("#bnlhr-btnEliminaWfa").val("Elimina");
        }
    })
}

//Add Categoria
$("#app-pages").on('click', '#bnlhr-btnAggiungiCategoria', function() {

    EnableCategoria(false);

    let model = {
        "Model": {}
    };
    model.Model.Dto = {};
    model.Model.Dto.Id = 0;
    model.Model.Dto.Nome = $("#NuovaCategoria").val();
    if (model.Model.Dto.Nome.length > 0) {
        let url = OC.generateUrl('apps/wfam/categoriawfa/create');
        bnlhrAjaxCallPOST(url, model, function(response) {
            if (response !== null && response.Model.Performed) {
                if (response.Model.Dto !== null) {
                    //get categorie
                    url = OC.generateUrl('apps/wfam/categoriawfa/get');
                    bnlhrAjaxCallPOST(url, null, function(response) {
                        if (response !== null && response.Model.Performed) {
                            if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                                $("#CategoriaId").empty();
                                BindViewCategoriaWFA(response.Model.Dtos);
                                EnableCategoria(true);
                                $("#NuovaCategoria").val("");
                            }
                        }
                    }); ////get categorie
                }
            }
        });
    } else {
        EnableCategoria(true);
        OC.dialogs.info('Inserire il nome della categoria', 'AVVISO');
    }
    event.preventDefault();
});

$("#app-pages").on('click', '#btnRimuoviUtente', function(event) {
    event.preventDefault();

    let row = $(this).closest("tr");
    let dataId = parseInt(row.attr("data-id"));
    let dataCodificaRuolo = row.attr("data-codifica-ruolo");
    if (dataId > 0) {
        if (!dataIdRuoloWfaToremove.includes(dataId))
            dataIdRuoloWfaToremove.push(dataId);
        SetDataIdGruppoRuoloWfaToremove(row);
    }
    if (dataCodificaRuolo != WFARUOLO.R && dataCodificaRuolo != WFARUOLO.A && dataCodificaRuolo != "C1") {
        rowPrev = row.prev();
        $(rowPrev).find(":input[type='button']").prop('disabled', false);
    }

    row.remove();
    $("#bnlhr-notificheRuoloWfa #rowFase-" + dataCodificaRuolo).prev().remove()
    $("#bnlhr-notificheRuoloWfa #rowFase-" + dataCodificaRuolo).remove();
    $("#bnlhr-notificheRuoloWfa #tblRuolo" + dataCodificaRuolo).remove();
    BindViewComboSelezionaRuoliNotifica();

    SetRowsNotifiche();
});

function SetDataIdGruppoRuoloWfaToremove(rowRuolo) {
    if (rowRuolo) {
        var rows = rowRuolo[0].querySelector("table tbody>tr");
        $(rows).each(function(index, row) {
            let dataId = parseInt($(row).attr("data-id"));
            if (dataId > 0) {
                if (!dataIdGruppoRuoloWfaToremove.includes(dataId))
                    dataIdGruppoRuoloWfaToremove.push(dataId);
            }
        })

    }
}

function SetDataIdNotificheToremove() {

    var rows = $("#bnlhr-notificheRuoloWfa tbody>tr");
    $(rows).each(function(index, row) {
        var rowsInformed = row.querySelectorAll("table");
        $(rowsInformed).each(function(index, rowInformed) {
            let dataId = parseInt($(rowInformed).attr("data-id"));
            if (dataId > 0) {
                if (!dataIdNotificheToremove.includes(dataId))
                    dataIdNotificheToremove.push(dataId);
            }
        })

    })
}

function GetRowRuolo(codifica) {
    var rows = $("#bnlhr-ruoliWfa tbody>tr[data-codifica-ruolo='" + codifica + "']").length;
    if (rows > 0) {
        return true;
    }
    return false;
}

function BindEventDeleteGroupRuoloWfa(id, codifica) {
    $("#btnDeleteGroup" + id).click(function(e) {
        var control = e.currentTarget;
        var group = $(control).attr("data-group");
        var row = $("#GruppiRuolo" + codifica + " tbody>tr[data-group='" + group + "']");
        if (row) {
            let dataId = parseInt(row.attr("data-id"));
            if (dataId > 0) {
                if (!dataIdGruppoRuoloWfaToremove.includes(dataId))
                    dataIdGruppoRuoloWfaToremove.push(dataId);
            }
            $(row).remove();
            var rowGroup = $("#bnlhr-notificheRuoloWfa tbody>tr ul>li[data-group='" + group + "']")
            if (rowGroup)
                $(rowGroup).remove();
        }
    });
}


function GetGroupsRuoloWfa(control) {
    var dtos = [];
    var rowsGruppo = $("#bnlhr-ruoliWfa tbody>tr table tbody>tr");
    $(rowsGruppo).each(function(index, row) {
        var gruppo = $(row).find("#GroupName").val();
        dtos.push(gruppo);
    })
    return dtos;
}

//icona
$("#app-pages").on('click', '#btnCaricaIcona', function() {
    $(".popovermenu").show();
});
$("#app-pages").on('click', '#bnlhr-lnkDrive', function(e) {
    OC.dialogs.filepicker('Carica files', function(files) {
        $("#txtIcona").attr("data-path", files);
        $("#txtIcona").attr("data-location", "drive");
        $("#txtIcona").attr("data-name", files.split('/')[files.split('/').length - 1]);
        $("#txtIcona").val(files);
        $("#bnlhr-pupupMenu").hide();
    }, false);
});

$("#app-pages").on('change', '#file_upload_start', function(e) {
    let files = $("#file_upload_start");
    for (let i = 0; i < files[0].files.length; i++) {
        $("#txtIcona").attr("data-path", files[0].files[i].name);
        $("#txtIcona").attr("data-location", "local");
        $("#txtIcona").attr("data-name", files[0].files[i].name);
        $("#txtIcona").val(files[0].files[i].name);
    }
    $("#bnlhr-pupupMenu").hide();
});
$("#app-pages").on('click', '#bnlhr-btnDeleteIcon', function(e) {
    $("#txtIcona").val("defaultIcon.png");
    $("#txtIcona").attr("data-path", "");
    $("#txtIcona").attr("data-location", "");
    $("#txtIcona").attr("data-name", "");
});



function UploadIcon(callback) {
    var location = $("#txtIcona").attr("data-location");
    if (location) {
        if (location == "local") {
            UploadIconLocal(function(response) {
                if (callback)
                    callback(response);
            })
        } else if (location == "drive") {
            UploadIconDrive(function(response) {
                if (callback)
                    callback(response);
            })
        }
    } else {
        if (callback)
            callback({
                "Performed": true
            });
    }
}

function UploadIconLocal(callback) {
    let files = $("#file_upload_start");
    if (files != null && files.length >= 1 && files[0].files.length > 0) {
        let fReader = new FileReader();
        fReader.readAsDataURL(files[0].files[0]);
        fReader.onloadend = function(event) {
            let model = {
                "Model": {
                    "Dto": {}
                }
            };
            var path = $("#txtIcona").attr("data-path");
            model.Model.Dto.Path = 'apps/wfam/uploads/wfaIcon';
            model.Model.Dto.FileName = files[0].files[0].name;
            model.Model.Dto.Stream = event.target.result;
            model.Model.Dto.Location = "local";
            let url = OC.generateUrl('apps/wfam/wfa/localupload');
            bnlhrAjaxCallPOST(url, model, function(response) {
                if (response != null) {
                    if (callback)
                        callback({
                            "Performed": response.Performed
                        });
                } else {
                    if (callback)
                        callback({
                            "Performed": false
                        });
                }
            });
        };

    } else {
        if (callback)
            callback({
                "Performed": true
            });
    }
}

function UploadIconDrive(callback) {
    var path = $("#txtIcona").attr("data-path");
    if (path != null && path != "") {
        let model = {
            "Model": {
                "Dto": {}
            }
        };
        model.Model.Dto.Path = 'apps/wfam/uploads/wfaIcon';
        model.Model.Dto.FileName = $("#txtIcona").val();
        model.Model.Dto.Stream = null;
        model.Model.Dto.Location = $("#txtIcona").attr("data-location");
        let url = OC.generateUrl('apps/wfam/wfa/localupload');
        bnlhrAjaxCallPOST(url, model, function(response) {
            if (response != null) {
                if (callback)
                    callback({
                        "Performed": response.Performed
                    });
            } else {
                if (callback)
                    callback({
                        "Performed": false
                    });
            }
        });
    } else {
        if (callback)
            callback({
                "Performed": true
            });
    }
}