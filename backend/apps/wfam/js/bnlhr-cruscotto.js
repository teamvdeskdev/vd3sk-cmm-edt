function LoadCruscotto() {
    if (viewType && viewType != VIEWTYPE.NONE) {
        var title = GetTitle();
        $("#titleView").text(title);
        if (viewType != VIEWTYPE.DELIBERATE)
            $("#bnlhr-listPraticheWfa thead tr>td[id='tdDataDelibera']").remove();
        else if (viewType == VIEWTYPE.DELIBERATE)
            $("#bnlhr-listPraticheWfa thead tr>td[id='tdAzione']").remove();
        dal = null;
        al = null;
        let skip = 0;
        let take = 30;
        this.SetCalendarCruscotto();
        let model = {
            "Model": {}
        };
        model.Model.Skip = skip;
        model.Model.Take = take;
        model.Model.Order = {};
        model.Model.Order.Name = "DataRichiesta";
        model.Model.Order.Direction = "asc";
        model.Model.Filter = {};
        model.Model.Filter.Status = GetFasiUtente(viewType);
        BindViewFiltriCruscotto();
        LoadPraticheUtente(model, viewType, function(response) {
            if (response !== null && response.Model.Performed && response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                $("#bnlhr-listPraticheWfa tbody").empty();
                var dtos = response.Model.Dtos;
                response.Model.Dtos.forEach(function(dto, index) {
                    var id = dto.Id;
                    var exist = dtos.find(q => q.Id == id) != null;
                    if (!exist) {
                        dtos.push(dto);
                    }
                });
                dtos.forEach(function(dto, index) {
                    BindViewRowsPraticaWFA(dto);
                });
                Pagination(response, "bnlhr-listPraticheWfa");
                HidePageLoader();

            } else {
                Pagination(response, "bnlhr-listPraticheWfa");
                HidePageLoader();
            }
        })
    }
}


function BindViewRowsPraticaWFA(dto) {
    var row = GetTemplateRowPraticaWFA(dto);
    $(row).appendTo("#bnlhr-listPraticheWfa tbody");
    $("#bnlhr-listPraticheWfa tbody td#cell-" + dto.Id).unbind("click");
    $("#bnlhr-listPraticheWfa tbody td#cell-" + dto.Id).bind("click", PraticaWfa_Click);


}

function GetTemplateRowPraticaWFA(dto) {

    let dataRichiesta = new moment(dto.DataRichiesta);
    dataRichiesta = dataRichiesta.format("DD/MM/YYYY");

    let dataDelibera = "";
    if (dto.DataDelibera) {
        dataDelibera = new moment(dto.DataDelibera);
        dataDelibera = dataDelibera.format("DD/MM/YYYY");
    }
    var deliberata = (dto.Stato == statoPraticaWfa.COMPLETATA);
    var stato = dto.Stato;

    var gruppiFaseString = "";
    var gruppiFase = (dto.NomeUtente ? "<i>" + dto.NomeUtente + "</i><br/>" : "");
    if (dto.NomeUtente) {
        gruppiFase += dto.Groups;
        gruppiFaseString += dto.Groups;

    } else {
        for (var gruppo of dto.Groups) {
            gruppiFaseString += gruppo.GroupName + ", ";
            gruppiFase += gruppo.GroupName + ", ";
        }
        if (gruppiFase.substring(gruppiFase.length - 2, gruppiFase.length - 1) == ",")
            gruppiFase = gruppiFase.substring(0, gruppiFase.length - 2);

        if (gruppiFaseString.substring(gruppiFaseString.length - 2, gruppiFaseString.length - 1) == ",")
            gruppiFaseString = gruppiFaseString.substring(0, gruppiFaseString.length - 2);

    }

    //filtro stato per rimozione ! nelle utenze che non sono abilitate alla modifica  
    if (!dto.Authorized)
        stato = stato.replace("!", "");

    var dtoFile = (IsJsonString(dto.Pdf) ? JSON.parse(dto.Pdf) : null);
    var pathFileName = (dtoFile ? dtoFile.UrlShare : null);
    var cellId = "cell-" + dto.Id;
    let row = "<tr id='row-" + dto.Id + "' data-id=\"" + dto.Id + "\" data-dipendente-id=\"" + dto.DipendenteId + "\" data-wfa-id=\"" + dto.WfaId + "\" stato-id='" + dto.Stato + "' pdf='" + pathFileName + "' data-codifica-progressivo='" + dto.CodificaProgressivo + "' data-categoria='" + dto.NomeCategoria + "' data-richiesta-personale='" + dto.RichiestaPersonale + "' data-ruolo-fase='" + dto.CodiceRuolo + "' height=\"40px\">\n" +
        "                <td id='" + cellId + "'><span class=\"bnlhr-text-pre-wrap bnlhr-font-weight-bold\" id='NomeWFA'>" + dto.NomeWfa + "</span></td>\n" +
        "                <td id='" + cellId + "'><span class=\"bnlhr-text-pre-wrap bnlhr-font-weight-bold\" id=\"CodificaProgressivo\">" + dto.CodificaProgressivo + "</span></td>\n" +
        "                <td id='" + cellId + "'><span class=\"bnlhr-text-pre-wrap bnlhr-font-weight-bold\" id=\"Stato\">" + GetGestioneHtml(dto.Stato, dto.Authorized, dto.StatoRuolo) + "</span></td>\n";
    if (viewType != VIEWTYPE.DELIBERATE)
        row += "<td id='" + cellId + "'><span class=\"bnlhr-text-pre-wrap\" id='GruppiFase' data-groups=\"" + gruppiFaseString + "\" >" + gruppiFase + "</span></td>\n";
    else if (viewType == VIEWTYPE.DELIBERATE)
        row += "<td id='" + cellId + "'><span class=\"bnlhr-text-pre-wrap\"  id=\"DataDelibera\" data-datadelibera=\"" + dto.DataDelibera + "\">" + dataDelibera + "</span></td>\n";
    row += "<td id='" + cellId + "'><span class=\"bnlhr-text-pre-wrap\" id=\"DataRichiesta\" data-datarichiesta=\"" + dto.DataRichiesta + "\">" + dataRichiesta + "</span></td>\n" +
        "                <td id='" + cellId + "'><span class=\"bnlhr-text-pre-wrap\">" + dto.NomeDipendente + "</span>" +
        "                <textarea id=\"ModificaRichiesta\" style=\"display: none\">" + dto.ModificaRichiesta + "</textarea></td>\n" +
        "                <td>" +
        (pathFileName != null ? "<a href='" + pathFileName + "' target='_blank' class=\"bnlhr-text-pre-wrap\"><img src='" + OC.generateUrl("/apps/wfam/img/icona-pdf.png").replace("/index.php", "") + "' style='width:20px; height:20px; left:5px;display:" + (deliberata ? '' : 'none') + "' class='bnlhr-cursor-pointer'/></a>" : "") +

        "            </td></tr>";
    return row;

}

function GetGestioneHtml(stato, authorized, statoRuolo) {
    var cssClass = "circle color-green";
    if ((stato == statoPraticaWfa.MODIFICA && !authorized) || statoRuolo == statoPraticaWfa.MODIFICA)
        cssClass = "circle color-yellow";
    else if (stato == statoPraticaWfa.RIFIUTATO)
        cssClass = "circle color-red";
    var gestione = "<div class=\'" + cssClass + "'>";
    if (authorized)
        gestione += "<div class=\"subcircle\"></div>";
    gestione += "</div>";
    return gestione;
}

function GetEnteFase(dto) {
    if (dto.Stato == statoPraticaWfa.BOZZA || dto.Stato == statoPraticaWfa.MODIFICA) {
        return "HRBP";
    } else if (dto.Stato == statoPraticaWfa.APPROVAZIONE) {
        return "HRSPA";
    } else if (dto.Stato == statoPraticaWfa.DELIBERA || dto.Stato == statoPraticaWfa.COMPLETATA || statoPraticaWfa.RIFIUTATO) {
        return "Direttore RU";
    }

}

function GetFasiUtente(type) {
    var fasi = [];
    if (type == VIEWTYPE.INCORSO) {
        if (WFAGROUPSAUTH.GC || WFAGROUPSAUTH.GSUPERADMIN || WFAGROUPSAUTH.GA) {
            fasi.push(statoPraticaWfa.MODIFICA)
            fasi.push(statoPraticaWfa.APPROVAZIONE);
            fasi.push(statoPraticaWfa.DELIBERA);
        }
        // if (WFAGROUPSAUTH.GA || WFAGROUPSAUTH.GSUPERADMIN) {
        //     fasi.push(statoPraticaWfa.DELIBERA);
        // }
    }
    if (fasi.length <= 0) fasi = null;
    return fasi;
}
// function GetFaseAttuale(enteSelect) {
//     if (enteSelect == WFARUOLO.R) {
//         if (WFAGROUPSAUTH.GR)
//             return [statoPraticaWfa.BOZZA, statoPraticaWfa.MODIFICA];
//         else
//             return [statoPraticaWfa.MODIFICA];
//     } else if (enteSelect == WFARUOLO.C) {
//         return [statoPraticaWfa.APPROVAZIONE];
//     } else if (enteSelect == WFARUOLO.A) {
//         return [statoPraticaWfa.DELIBERA, statoPraticaWfa.COMPLETATA, statoPraticaWfa.RIFIUTATO];
//     }
//     return null;
// }

function GetStatoFilter(stato) {
    if (stato == statoPraticaWfa.COMPLETATA) {
        return [statoPraticaWfa.COMPLETATA];
    } else if (stato == statoPraticaWfa.RIFIUTATO) {
        return [statoPraticaWfa.RIFIUTATO];
    } else if (stato == "INCORSO") {
        return [statoPraticaWfa.DELIBERA, statoPraticaWfa.APPROVAZIONE, statoPraticaWfa.MODIFICA];
    }
    return null;
}



function PraticaWfa_Click(e) {
    let row = e.currentTarget.parentElement;

    let model = {
        "Model": {
            "Dto": {}
        }
    };
    model.Model.Dto.Id = parseInt(row.getAttribute("data-id"));
    model.Model.Dto.DataRichiesta = $("#row-" + model.Model.Dto.Id + " #DataRichiesta").attr("data-datarichiesta");
    var dataDelibera = $("#row-" + model.Model.Dto.Id + " #DataDelibera").attr("data-datadelibera");
    model.Model.Dto.DataDelibera = (dataDelibera && dataDelibera.length > 0 ? dataDelibera : null);
    model.Model.Dto.DipendenteId = parseInt(row.getAttribute("data-dipendente-id"));

    model.Model.Dto.ModificaRichiesta = $("#row-" + model.Model.Dto.Id + " #ModificaRichiesta").text();
    model.Model.Dto.WfaId = parseInt(row.getAttribute("data-wfa-id"));
    model.Model.Dto.Stato = row.getAttribute("stato-id");
    model.Model.Dto.Pdf = row.getAttribute("pdf");
    model.Model.Dto.CodificaProgressivo = row.getAttribute("data-codifica-progressivo");
    model.Model.RichiestaPersonale = (row.getAttribute("data-richiesta-personale") == "0" ? false : true);
    model.Model.NomeCategoria = row.getAttribute("data-categoria");
    model.Model.NomeWfa = $("#row-" + model.Model.Dto.Id + " #NomeWFA").text();
    model.Model.RuoloFase = row.getAttribute("data-ruolo-fase");
    model.Model.GruppiFase = ($(row).find("#GruppiFase") && $(row).find("#GruppiFase").length > 0 ? $(row).find("#GruppiFase").attr("data-groups").split(",") : null);
    GetAuth(model, function(response) {
        if (response.Model.Performed) {
            model.Model.Authorized = response.Model.Authorized;

            if (response.Model.Authorized) {

                if (model.Model.Dto.Stato == statoPraticaWfa.BOZZA || model.Model.Dto.Stato == statoPraticaWfa.MODIFICA) {
                    let url = OC.generateUrl("/apps/wfam/pratica_wfa_form");
                    navigation.GoTo(model.Model.NomeWfa, url, model, function(response) {
                        LoadPraticaWFAForm(response);
                    });
                } else if (model.Model.Dto.Stato == statoPraticaWfa.APPROVAZIONE || model.Model.Dto.Stato == statoPraticaWfa.DELIBERA || model.Model.Dto.Stato == statoPraticaWfa.COMPLETATA) {
                    let url = OC.generateUrl("/apps/wfam/pratica_wfa_formapprova");
                    navigation.GoTo(model.Model.NomeWfa, url, model, function(response) {
                        LoadPraticaWFAFormApprova(response);
                    });
                }
            } else {
                let url = OC.generateUrl("/apps/wfam/pratica_wfa_formapprova");
                navigation.GoTo(model.Model.NomeWfa, url, model, function(response) {
                    LoadPraticaWFAFormApprova(response);
                });
            }
        } else {
            OC.dialogs.alert("Qualcosa non ha funzionato correttamente, contattare l'amministratore di sistema", 'Avviso');
        }

    });

}
//filtri
function BindViewFiltriCruscotto() {
    let url = OC.generateUrl('apps/wfam/categoriawfa/get');
    bnlhrAjaxCallPOST(url, null, function(response) {
        if (response !== null && response.Model.Performed) {
            if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                $("#CategoriaCruscotto").empty();
                this.BindViewFilterCategoriaWFACruscotto(response.Model.Dtos);
            }
        }
    });
    let urlWfa = OC.generateUrl('apps/wfam/wfa/get');
    let modelFilterWfa = {
        "Model": {
            "Filter": {}
        }
    };
    modelFilterWfa.Model.Filter.Stato = statoWfa.PUBBLICATO;
    bnlhrAjaxCallPOST(urlWfa, modelFilterWfa, function(response) {
        if (response !== null && response.Model.Performed) {
            if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                $("#CruscottoWFA").empty();
                this.BindViewFilterWFACruscotto(response.Model.Dtos);
            }
        }
    });

    //this.BindViewFilterEnteCruscotto(); //modificato in stati pratica

}


function SetCalendarCruscotto() {
    $('input[name="IntervalloCruscotto"]').daterangepicker({
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

    $('input[name="IntervalloCruscotto"]').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
        dal = picker.startDate.format('YYYY-MM-DD 00:00:00');
        al = picker.endDate.format('YYYY-MM-DD 00:00:00');
        ResetOrder();
        FilterPraticheCruscotto();

    });

    $('input[name="IntervalloCruscotto"]').on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
        dal = null;
        al = null;
        ResetOrder();
        FilterPraticheCruscotto();

    });
}

function BindViewFilterCategoriaWFACruscotto(dtos) {
    $("<option value=\"-1\" >Seleziona una categoria</option>").appendTo("#CategoriaCruscotto");

    dtos.forEach(function(dto, index) {
        let option = "<option value=\"" + dto.Id + "\">" + dto.Nome + "</option>";
        $(option).appendTo("#CategoriaCruscotto");
    });
}

function BindViewFilterWFACruscotto(dtos) {
    $("<option value=\"-1\">Seleziona un processo</option>").appendTo("#CruscottoWFA");
    dtos.forEach(function(dto) {
        let option = "<option value=\"" + dto.Id + "\">" + dto.Nome + "</option>";
        $(option).appendTo("#CruscottoWFA");
    });
}

// function BindViewFilterEnteCruscotto() {
//     $("#EnteCruscotto").empty();
//     $("<option value=\"-1\">Seleziona uno stato</option>\n").appendTo("#EnteCruscotto");
//     let option = "<option value=\"" + statoPraticaWfa.COMPLETATA + "\">" + statoPraticaWfa.COMPLETATA + "</option>";
//     $(option).appendTo("#EnteCruscotto");

//     option = "<option value=\"" + statoPraticaWfa.RIFIUTATO + "\">" + statoPraticaWfa.RIFIUTATO + "</option>";
//     $(option).appendTo("#EnteCruscotto");

//     //option = "<option value=\"INCORSO\">In corso</option>";
//     //$(option).appendTo("#EnteCruscotto");

//     // dtos.forEach(function(dto) {
//     //     let option = "<option value=\"" + dto.Codifica + "\">" + dto.Codifica + "</option>";
//     //     $(option).appendTo("#EnteCruscotto");
//     // });
// }

function FilterPraticheCruscotto(modelRequest = null) {
    ShowPageLoader();

    let categoriaSelect = parseInt($("#CategoriaCruscotto option:selected").val());
    let wfaSelect = parseInt($("#CruscottoWFA option:selected").val());
    //let stato = $("#EnteCruscotto option:selected").val();
    let model = modelRequest;
    if (model == null) {
        model = {
            "Model": {}
        };
        model.Model.Skip = 0;
        model.Model.Take = 30;
    }
    model.Model.Filter = {};
    model.Model.Filter.CategoriaId = (categoriaSelect != -1 ? categoriaSelect : null);
    model.Model.Filter.WfaId = (wfaSelect != -1 ? wfaSelect : null);
    //model.Model.Filter.UtenteId = currentUser.Model.Dto.Id;
    //model.Model.Filter.Status = GetFaseAttuale(enteSelect); //(enteSelect != -1 ? enteSelect : null);
    //model.Model.Filter.Status = GetStatoFilter(stato);
    model.Model.Filter.CodificaProgressivo = $("#Progressivo").val();
    model.Model.Filter.Dal = (dal != null ? dal : null);
    model.Model.Filter.Al = (al != null ? al : null);
    if (!model.Model.Order) {
        model.Model.Order = {};
        model.Model.Order.Name = "DataRichiesta";
        model.Model.Order.Direction = "asc";
    }
    $("#bnlhr-listPraticheWfa tbody").empty();
    LoadPraticheUtente(model, viewType, function(response) {
        if (response !== null && response.Model.Performed && response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
            $("#bnlhr-listPraticheWfa tbody").empty();
            var dtos = response.Model.Dtos;
            response.Model.Dtos.forEach(function(dto, index) {
                var id = dto.Id;
                var exist = dtos.find(q => q.Id == id) != null;
                if (!exist) {
                    dtos.push(dto);
                }
            });
            dtos.forEach(function(dto, index) {
                BindViewRowsPraticaWFA(dto);
            });
            Pagination(response, "bnlhr-listPraticheWfa");
            HidePageLoader();
        } else {
            Pagination(response, "bnlhr-listPraticheWfa");
            HidePageLoader();
        }
    })
}

$("#app-pages").on('change', '#CategoriaCruscotto', function() {
    $("#bnlhr-listPraticheWfa tbody").empty();
    $("#bnlhr-listPraticheWfa").attr("data-page", 0);
    $("#bnlhr-listPraticheWfa").attr("data-skip", 0);
    ResetOrder();
    FilterPraticheCruscotto();
});
$("#app-pages").on('change', '#CruscottoWFA', function() {
    $("#bnlhr-listPraticheWfa tbody").empty();
    $("#bnlhr-listPraticheWfa").attr("data-page", 0);
    $("#bnlhr-listPraticheWfa").attr("data-skip", 0);
    ResetOrder();
    FilterPraticheCruscotto();
});
// $("#app-pages").on('change', '#EnteCruscotto', function() {
//     $("#bnlhr-listPraticheWfa tbody").empty();
//     $("#bnlhr-listPraticheWfa").attr("data-page", 0);
//     $("#bnlhr-listPraticheWfa").attr("data-skip", 0);
//     ResetOrder();
//     FilterPraticheCruscotto();
// });

$("#app-pages").on('click', '#IconSearchProgressivo', function(event) {

    $("#bnlhr-listPraticheWfa tbody").empty();
    $("#bnlhr-listPraticheWfa").attr("data-page", 0);
    $("#bnlhr-listPraticheWfa").attr("data-skip", 0);
    ResetOrder();
    FilterPraticheCruscotto();
});

$("#app-pages").on('keyup', '#Progressivo', function() {
    if (event.keyCode === 13) {
        $("#bnlhr-listPraticheWfa tbody").empty();
        $("#bnlhr-listPraticheWfa").attr("data-page", 0);
        $("#bnlhr-listPraticheWfa").attr("data-skip", 0);
        ResetOrder();
        FilterPraticheCruscotto();
    }
});

$("#app-pages").on('click', "#btnBack", function(event) {
    let skip = parseInt($("#bnlhr-listPraticheWfa").attr("data-skip"));
    let page = parseInt($("#bnlhr-listPraticheWfa").attr("data-page"));
    let model = {
        "Model": {
            "Skip": 0,
            "Take": 30
        }
    };
    model.Model.Skip = skip;
    model.Model.Skip -= model.Model.Take;
    model.Model.Order = {};
    model.Model.Order.Name = $("#bnlhr-listPraticheWfa").attr("data-field-order");
    model.Model.Order.Direction = $("#bnlhr-listPraticheWfa").attr("data-direction-order");

    if (!model.Model.Order.Name || !model.Model.Order.Direction)
        model.Model.Order = null

    $("#bnlhr-listPraticheWfa").attr("data-page", page - 1);
    FilterPraticheCruscotto(model);
})
$("#app-pages").on('click', "#btnNext", function(event) {
    let skip = parseInt($("#bnlhr-listPraticheWfa").attr("data-skip"));
    let page = parseInt($("#bnlhr-listPraticheWfa").attr("data-page"));
    let model = {
        "Model": {
            "Skip": 0,
            "Take": 30
        }
    };
    model.Model.Skip += skip;
    model.Model.Skip += model.Model.Take;
    model.Model.Order = {};
    model.Model.Order.Name = $("#bnlhr-listPraticheWfa").attr("data-field-order");
    model.Model.Order.Direction = $("#bnlhr-listPraticheWfa").attr("data-direction-order");

    if (!model.Model.Order.Name || !model.Model.Order.Direction)
        model.Model.Order = null

    $("#bnlhr-listPraticheWfa").attr("data-page", page + 1);
    FilterPraticheCruscotto(model);
})


// ordinamento header
$("#app-pages").on('click', "#bnlhr-listPraticheWfa thead tr>td span", function(event) {

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
            ResetOrder(this, false);
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
            ResetOrder(icon, false);

        }
        if (!order.Direction)
            order.Direction = "asc";
        model = {
            "Model": {}
        };
        model.Model.Order = order;
        model.Model.Skip = 0;
        model.Model.Take = 30;
        $("#bnlhr-listPraticheWfa").attr("data-field-order", order.Name);
        $("#bnlhr-listPraticheWfa").attr("data-direction-order", order.Direction);
        $("#bnlhr-listPraticheWfa").attr("data-skip", 0);
        $("#bnlhr-listPraticheWfa").attr("data-page", 1);
        FilterPraticheCruscotto(model);
    }
})

function ResetOrder(target = null, reset = true) {
    if (reset) {
        $("#bnlhr-listPraticheWfa").attr("data-field-order", "");
        $("#bnlhr-listPraticheWfa").attr("data-direction-order", "");
    }
    var controls = $("#bnlhr-listPraticheWfa thead tr>td span")
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