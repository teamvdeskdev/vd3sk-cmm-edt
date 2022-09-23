let dal = null;
let al = null;

function LoadWfa() {
    let dal = null;
    let al = null;
    let skip = 0;
    let take = 30;
    this.EnableButton();
    this.SetCalendar();
    this.BindViewStatoWFA();
    let url = OC.generateUrl('apps/wfam/categoriawfa/get');
    bnlhrAjaxCallPOST(url, null, function(response) {
        if (response !== null && response.Model.Performed) {
            if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                $("#CategoriaIdFilter").empty();
                BindViewCategoriaGestioneWFA(response.Model.Dtos);
            }
        }
        let url = OC.generateUrl('apps/wfam/wfa/load');
        let model = {
            "Model": {
                "Skip": skip,
                "Take": take
            }
        };
        model.Model.Order = {};
        model.Model.Order.Name = "DataCreazione";
        model.Model.Order.Direction = "asc";

        bnlhrAjaxCallPOST(url, model, function(response) {
            if (response !== null && response.Model.Performed) {
                if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                    $("#bnlhr-listWfa tbody").empty();
                    this.BindViewWFA(response.Model.Dtos);
                    Pagination(response, "bnlhr-listWfa");
                    HidePageLoader();
                } else {
                    HidePageLoader();
                }
            } else {
                HidePageLoader();
            }
        }); //wfaLoad

    });
}

function BindViewWFA(dtos) {
    dtos.forEach(function(dto, index) {
        let row = GetTemplateRowWFA(dto);
        $(row).appendTo("#bnlhr-listWfa tbody");
        if (WFAGROUPSAUTH.GD) {
            $("#bnlhr-listWfa tbody td#cell-" + dto.Id).unbind("click");
            $("#bnlhr-listWfa tbody td#cell-" + dto.Id).bind("click", WFARow_Click);

            $("#bnlhr-listWfa tbody #bnlhr-editPdf-" + dto.Id).unbind("click");
            $("#bnlhr-listWfa tbody #bnlhr-editPdf-" + dto.Id).bind("click", function(e) {
                WFAEditPdf_Click(dto);
            });
        }

        if (WFAGROUPSAUTH.GADMIN) {
            $("#bnlhr-listWfa tbody #bnlhr-exportXml-" + dto.Id).unbind("click");
            $("#bnlhr-listWfa tbody #bnlhr-exportXml-" + dto.Id).bind("click", function(e) {
                WFAExportXml_Click(dto);
            });
        }
        SetWFAButton(dto);
    });

}

//BindView
function BindViewStatoWFA() {
    $("<option value=\"-1\" >Seleziona uno stato</option>\n").appendTo("#StatoWFA");
    $("<option value=\"" + statoWfa.BOZZA + "\">" + statoWfa.BOZZA + "</option>").appendTo("#StatoWFA");
    $("<option value=\"" + statoWfa.PUBBLICATO + "\">" + statoWfa.PUBBLICATO + "</option>").appendTo("#StatoWFA");

}

function GetTemplateRowWFA(dto) {

    var cellId = "cell-" + dto.Id;
    let date = new moment(dto.DataCreazione);
    date = date.format("DD/MM/YYYY");
    let row = "<tr id=\"row-" + dto.Id + "\" data-id=\"" + dto.Id + "\">\n" +
        "                <td id='" + cellId + "'><span class=\"bnlhr-text-pre-wrap bnlhr-font-weight-bold\">" + dto.Nome + "</span></td>\n" +
        "                <td id='" + cellId + "'><span class=\"bnlhr-text-pre-wrap\">" + dto.NomeCategoria + "</span></td>\n" +
        "                <td id='stato-" + cellId + "'><span class=\"bnlhr-text-pre-wrap\">" + dto.Stato + "</span></td>\n" +
        "                <td id='" + cellId + "'><span class=\"bnlhr-text-pre-wrap\">" + date + "</span></td>\n" +
        "                <td id='" + cellId + "'><span class=\"bnlhr-text-pre-wrap\">" + dto.Creatore + "</span></td>\n";
    // "                <td align='center' valign='middle'>";
    if (WFAGROUPSAUTH.GD) {
        row += "<td align='center' valign='middle' width=\"85px\"><input type=\"button\"  id=\"wfam-btnEliminaWfa-" + dto.Id + "\"  data-action=\"\" class=\"bnlhr-button-white\" value=\"\" style=\"width: 85px;\" /></td>\n";
        row += "<td align='center' valign='middle' width=\"85px\"><input type=\"button\"  id=\"wfam-btnPublishWfa-" + dto.Id + "\"  data-action=\"\" class=\"bnlhr-button-white\" value=\"\" style=\"width: 85px;\" / ></td>\n";
    }
    row += "<td align='center' valign='middle'>";
    if (WFAGROUPSAUTH.GD) {
        row += "<img id=\"bnlhr-editPdf-" + dto.Id + "\" title=\"Personalizza Pdf\" src=\"" + OC.generateUrl("/apps/wfam/img/edit-pdf.png").replace("/index.php", "") + "\" width=\"20px\" class=\"bnlhr-cursor-pointer\" style=\"margin-right:6px\" />";
    }
    if (WFAGROUPSAUTH.GADMIN)
        row += "<img id=\"bnlhr-exportXml-" + dto.Id + "\" title=\"Esporta in XML\" src=\"" + OC.generateUrl("/apps/wfam/img/icon-xml.png").replace("/index.php", "") + "\" width=\"20px\"  class=\"bnlhr-cursor-pointer\" />\n";

    row += "</td>\n</tr>";
    return row;
}

function FilterWfa(modelRequest = null) {
    ShowPageLoader();
    let categoriaId = $("#CategoriaIdFilter option:selected").val();
    let stato = $("#StatoWFA option:selected").val();
    let model = modelRequest;
    if (model == null) {
        model = {
            "Model": {}
        };
        model.Model.Skip = 0;
        model.Model.Take = 30;
    }
    model.Model.Filter = {};
    model.Model.Filter.CategoriaId = (categoriaId != -1 ? categoriaId : null);
    model.Model.Filter.Stato = (stato != -1 ? stato : null);
    model.Model.Filter.Dal = (dal != null ? dal : null);
    model.Model.Filter.Al = (al != null ? al : null);
    if (!model.Model.Order) {
        model.Model.Order = {};
        model.Model.Order.Name = "DataCreazione";
        model.Model.Order.Direction = "asc";
    }
    $("#bnlhr-listWfa tbody").empty();
    let url = OC.generateUrl('apps/wfam/wfa/load');
    bnlhrAjaxCallPOST(url, model, function(response) {
        if (response !== null && response.Model.Performed) {
            if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                this.BindViewWFA(response.Model.Dtos);
                Pagination(response, "bnlhr-listWfa");
                HidePageLoader();
            } else
                HidePageLoader();
        } else
            HidePageLoader();

    }); //wfaLoad
}

function EnableButton() {
    if (WFAGROUPSAUTH.GADMIN && !WFAGROUPSAUTH.GD)
        $("#bnlhr-btnCreaWFA").remove();
    else
        $("#bnlhr-btnCreaWFA").show();
}

function SetCalendar() {
    $('input[name="IntervalloCreazione"]').daterangepicker({
        autoUpdateInput: false,
        locale: {
            format: "DD/MM/YYYY",
            separator: " al ",
            applyLabel: "Ok",
            cancelLabel: "Annulla",
            fromLabel: "Da",
            toLabel: "A",
            daysOfWeek: [
                "Dom",
                "Lun",
                "Mar",
                "Mer",
                "Gio",
                "Ven",
                "Sab"

            ],
            monthNames: [
                "Gennaio",
                "Febbraio",
                "Marzo",
                "Aprile",
                "Maggio",
                "Giugno",
                "Luglio",
                "Agosto",
                "Settembre",
                "Ottobre",
                "Novembre",
                "Dicembre"
            ],
        }
    });

    $('input[name="IntervalloCreazione"]').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
        dal = picker.startDate.format('YYYY-MM-DD 00:00:00');
        al = picker.endDate.format('YYYY-MM-DD 00:00:00');
        $("#bnlhr-listWfa tbody").empty();
        $("#bnlhr-listWfa").attr("data-page", 0);
        $("#bnlhr-listWfa").attr("data-skip", 0);
        ResetOrderWfa();
        FilterWfa();

    });

    $('input[name="IntervalloCreazione"]').on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
        dal = null;
        al = null;
        $("#bnlhr-listWfa tbody").empty();
        $("#bnlhr-listWfa").attr("data-page", 0);
        $("#bnlhr-listWfa").attr("data-skip", 0);
        ResetOrderWfa();
        FilterWfa();

    });
}


//event
$('#IntervalloCreazione').on('cancel.daterangepicker', function(ev, picker) {
    $(this).val('');
});

function WFARow_Click(e) {
    let row = e.currentTarget.parentElement;
    let model = {
        "Model": {}
    };
    model.Model.Filter = {};
    model.Model.Filter.Id = row.getAttribute("data-id");
    let url = OC.generateUrl("/apps/wfam/definisci_wfa");
    navigation.GoTo("Definisci WFA", url, model, function(model) {
        ReadWfa(model);
    });
    e.preventDefault();
}

function WFAEditPdf_Click(dto) {

    let model = {};
    model.Dto = dto;
    let url = OC.generateUrl("/apps/wfam/editor");
    navigation.GoTo("PDF editor", url, model, function(model) {
        model.BaseUrl = OC.generateUrl("");
        var editorWfa = new EditorWfa(model);
        editorWfa.PageLoad();
    });

}

function WFAExportXml_Click(dto) {

    let model = {};
    model.Dto = dto;
    let url = OC.generateUrl("/apps/wfam/export_wfa");
    navigation.GoTo("Export Xml", url, model, function(model) {
        WfaExport = new ExportWfa(model);
        WfaExport.PageLoad();
    });
}

$("#app-pages").on('change', '#CategoriaIdFilter', function() {
    $("#bnlhr-listWfa tbody").empty();
    $("#bnlhr-listWfa").attr("data-page", 0);
    $("#bnlhr-listWfa").attr("data-skip", 0);
    ResetOrderWfa();
    FilterWfa();
});
$("#app-pages").on('change', '#StatoWFA', function() {
    $("#bnlhr-listWfa tbody").empty();
    $("#bnlhr-listWfa").attr("data-page", 0);
    $("#bnlhr-listWfa").attr("data-skip", 0);
    ResetOrderWfa();
    FilterWfa();
});

function BindViewCategoriaGestioneWFA(dtos) {
    $("<option value=\"-1\" >Seleziona una categoria</option>").appendTo("#CategoriaIdFilter");
    dtos.forEach(function(dto, index) {
        let option = GetTemplateCategoriaWFAOption(dto);
        $(option).appendTo("#CategoriaIdFilter");
    });
}

$("#app-pages").on('click', '#bnlhr-btnCreaWFA', function(event) {

    let model = {
        "Model": {}
    };
    model.Model.Filter = {};
    model.Model.Filter.Id = 0;
    let url = OC.generateUrl("/apps/wfam/definisci_wfa");
    navigation.GoTo("Definisci WFA", url, model, function(model) {
        ReadWfa(model);
    });
    event.preventDefault();
});

$("#app-pages").on('click', "#btnBack", function(event) {
    let skip = parseInt($("#bnlhr-listWfa").attr("data-skip"));
    let page = parseInt($("#bnlhr-listWfa").attr("data-page"));
    let model = {
        "Model": {
            "Skip": 0,
            "Take": 30
        }
    };
    model.Model.Skip = skip;
    model.Model.Skip -= model.Model.Take;
    model.Model.Order = {};
    model.Model.Order.Name = $("#bnlhr-listWfa").attr("data-field-order");
    model.Model.Order.Direction = $("#bnlhr-listWfa").attr("data-direction-order");

    if (!model.Model.Order.Name || !model.Model.Order.Direction)
        model.Model.Order = null

    $("#bnlhr-listWfa").attr("data-page", page - 1);
    FilterWfa(model);
})
$("#app-pages").on('click', "#btnNext", function(event) {
    let skip = parseInt($("#bnlhr-listWfa").attr("data-skip"));
    let page = parseInt($("#bnlhr-listWfa").attr("data-page"));
    let model = {
        "Model": {
            "Skip": 0,
            "Take": 30
        }
    };
    model.Model.Skip += skip;
    model.Model.Skip += model.Model.Take;
    model.Model.Order = {};
    model.Model.Order.Name = $("#bnlhr-listWfa").attr("data-field-order");
    model.Model.Order.Direction = $("#bnlhr-listWfa").attr("data-direction-order");

    if (!model.Model.Order.Name || !model.Model.Order.Direction)
        model.Model.Order = null

    $("#bnlhr-listWfa").attr("data-page", page + 1);
    FilterWfa(model);
})

function SetWFAButton(dto) {
    if (dto.CountPratiche > 0) {
        $("#wfam-btnEliminaWfa-" + dto.Id).attr("data-action", "disabled");
        $("#wfam-btnEliminaWfa-" + dto.Id).val("Disabilita");
    } else {
        $("#wfam-btnEliminaWfa-" + dto.Id).attr("data-action", "delete");
        $("#wfam-btnEliminaWfa-" + dto.Id).val("Elimina");
    }

    if (dto.Stato == statoWfa.BOZZA) {
        $("#wfam-btnPublishWfa-" + dto.Id).attr("data-action", "publish");
        $("#wfam-btnPublishWfa-" + dto.Id).val("Pubblica");
        $("#wfam-btnEliminaWfa-" + dto.Id).show();
    } else {
        $("#wfam-btnPublishWfa-" + dto.Id).attr("data-action", "bozza");
        $("#wfam-btnPublishWfa-" + dto.Id).val("Bozza");
        $("#wfam-btnEliminaWfa-" + dto.Id).hide();
    }
    SetActionWFAButton(dto);
}

function SetActionWFAButton(dto) {
    $("#wfam-btnEliminaWfa-" + dto.Id).unbind("click");
    $("#wfam-btnEliminaWfa-" + dto.Id).bind("click", function(e) {
        DeleteDisableWfaAction(dto, e);
    });

    $("#wfam-btnPublishWfa-" + dto.Id).unbind("click");
    $("#wfam-btnPublishWfa-" + dto.Id).bind("click", function(e) {
        PublishUnpublishWfaAction(dto, e);
    });
}

function DeleteDisableWfaAction(dto, e) {
    ShowPageLoader();
    let model = {
        "Model": {
            "Dto": {}
        }
    };
    model.Model.Dto.Id = dto.Id;
    var target = e.target;
    var action = $(target).attr("data-action");
    if (action == "disabled") {
        model.Model.Dto.Disabled = true;
        model.Model.Dto.Stato = statoWfa.DISABILITATO;
        let url = OC.generateUrl('apps/wfam/wfa/update');
        bnlhrAjaxCallPOST(url, model, function(response) {
            if (response !== null && response.Model.Performed) {
                var row = $(target).closest('tr');
                $(row).find('#stato-cell-' + dto.Id).html(model.Model.Dto.Stato);
                SetWFAButton(response.Model.Dto);
            } else {
                OC.dialogs.alert("Non è stato possibile completare l'operazione", 'Avviso');
            }
            HidePageLoader();
        })
    } else if (action == "delete") {
        let url = OC.generateUrl('apps/wfam/wfa/delete');
        bnlhrAjaxCallPOST(url, model, function(response) {
            if (response !== null && response.Performed) {
                LoadWfa();
            } else {
                HidePageLoader();
                OC.dialogs.alert("Non è stato possibile completare l'operazione", 'Avviso');
            }
        })
    }
}

function PublishUnpublishWfaAction(dto, e) {
    ShowPageLoader();
    let model = {
        "Model": {
            "Dto": {}
        }
    };
    var target = e.target;
    var action = $(target).attr("data-action");
    model.Model.Dto.Id = dto.Id;
    if (action == "publish")
        model.Model.Dto.Stato = statoWfa.PUBBLICATO;
    else
        model.Model.Dto.Stato = statoWfa.BOZZA;

    let url = OC.generateUrl('apps/wfam/wfa/update');
    bnlhrAjaxCallPOST(url, model, function(response) {
        if (response !== null && response.Model.Performed) {
            var row = $(target).closest('tr');
            $(row).find('#stato-cell-' + dto.Id).html(model.Model.Dto.Stato);
            SetWFAButton(response.Model.Dto);

        } else {
            OC.dialogs.alert("Non è stato possibile completare l'operazione", 'Avviso');
        }
        HidePageLoader();
    })
}

// ordinamento header
$("#app-pages").on('click', "#bnlhr-listWfa thead tr>td span", function(event) {

    var filterField = $(this).attr("data-filter");
    var order = null;
    if (filterField) {
        order = {};
        order.Name = filterField;
        if ($(this).hasClass("bnlhr-icon-caret") || $(this).hasClass("bnlhr-icon-caret-reverse")) {
            if ($(this).hasClass("bnlhr-icon-caret")) {
                order.Direction = "desc";
                $(this).removeClass("bnlhr-icon-caret");
                $(this).addClass("bnlhr-icon-caret-reverse");
            } else {
                $(this).addClass("bnlhr-icon-caret");
                $(this).removeClass("bnlhr-icon-caret-reverse");
                order.Direction = "asc";
            }
            ResetOrderWfa(this, false);
        } else {
            var col = $(this).closest("td");
            var icon = $(col).find("span.bnlhr-icon-caret");
            if (icon && icon.length > 0) {
                $(icon).removeClass("bnlhr-icon-caret");
                $(icon).addClass("bnlhr-icon-caret-reverse");
                order.Direction = "desc";
            } else {
                icon = $(col).find("span.bnlhr-icon-caret-reverse");
                if (icon && icon.length > 0) {
                    $(icon).addClass("bnlhr-icon-caret");
                    $(icon).removeClass("bnlhr-icon-caret-reverse");
                    order.Direction = "asc";
                }
            }
            ResetOrderWfa(icon, false);

        }
        if (!order.Direction)
            order.Direction = "asc";
        model = {
            "Model": {}
        };
        model.Model.Order = order;
        model.Model.Skip = 0;
        model.Model.Take = 30;
        $("#bnlhr-listWfa").attr("data-field-order", order.Name);
        $("#bnlhr-listWfa").attr("data-direction-order", order.Direction);
        $("#bnlhr-listWfa").attr("data-skip", 0);
        $("#bnlhr-listWfa").attr("data-page", 1);
        FilterWfa(model);
    }
})

function ResetOrderWfa(target = null, reset = true) {
    if (reset) {
        $("#bnlhr-listWfa").attr("data-field-order", "");
        $("#bnlhr-listWfa").attr("data-direction-order", "");
    }
    var controls = $("#bnlhr-listWfa thead tr>td span")
    if (controls && controls.length > 0) {
        if (target) {
            $(controls).each(function(index, control) {
                if (control != target[0]) {
                    if ($(control).hasClass("bnlhr-icon-caret-reverse")) {
                        $(control).removeClass("bnlhr-icon-caret-reverse");
                        $(control).addClass("bnlhr-icon-caret");
                    }
                }
            })
        } else {
            $(controls).each(function(index, control) {
                if ($(control).hasClass("bnlhr-icon-caret-reverse")) {
                    $(control).removeClass("bnlhr-icon-caret-reverse");
                    $(control).addClass("bnlhr-icon-caret");
                }
            })
        }
    }
}