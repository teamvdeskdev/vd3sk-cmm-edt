let modelPratica = null;
var nomeBeneficiario = null;

// const statoRuoloPraticaWfa = {
//     CREATO: null,
//     BOZZA: 'Bozza',
//     COMPLETATO: 'Completato',
//     RIFIUTATO: 'Rifiutato',
//     MODIFICA: 'Modifica'
// }
const statoPraticaWfa = {
    MODIFICA: '!Modifica Richiesta',
    BOZZA: 'Bozza',
    APPROVAZIONE: '!Approvazione',
    RIFIUTATO: 'Rifiutato',
    DELIBERA: '!Delibera',
    COMPLETATA: 'Approvato',
    BLOCCATA: 'Bloccata per disabilitazione flusso'
}

function LoadPraticaWFAForm(model, callback) {
    modelPratica = model;
    if (modelPratica.Model.Dto.ModificaRichiesta && modelPratica.Model.Dto.ModificaRichiesta !== null && modelPratica.Model.Dto.ModificaRichiesta !== "null") {
        $("#bnlhr-modifichePraticaWfaForm").show();
        $("#Modificatext").text(modelPratica.Model.Dto.ModificaRichiesta);
    } else {
        $("#bnlhr-modifichePraticaWfaForm").hide();
    }
    $("#FormTitle").text(modelPratica.Model.NomeWfa);
    BindViewSintesiProcesso(modelPratica.Model.Dto);


    let modelFilterWfa = {
        "Model": {}
    };
    modelFilterWfa.Model.Filter = {};
    modelFilterWfa.Model.Filter.Id = modelPratica.Model.Dto.WfaId;
    let urlWfa = OC.generateUrl('apps/wfam/wfa/read');
    bnlhrAjaxCallPOST(urlWfa, modelFilterWfa, function(response) {
        if (response !== null && response.Model != null && response.Model.Performed &&
            response.Model.Dto !== null && response.Model.Dto.Templatepdf != null) {
            var dto = response.Model.Dto;
            $.when(GetTemplate("templatepdfpreview", false, null)).then(function($tmpl, model) {
                var tablePreview = $($tmpl).find("#bnlhr-praticaWfaFormPreview");
                $($tmpl).find("#bnlhr-praticaWfaFormPreview").remove();
                var nav = $($tmpl).find("nav");
                $($tmpl).find("nav").remove();
                $($tmpl).find("#bnlhr-templatepdf").html(dto.Templatepdf);
                $($tmpl).find("#bnlhr-templatepdf #dynamicContent").removeAttr("style");
                $($tmpl).find("#bnlhr-templatepdf #dynamicFooter").css("background", "");
                $($tmpl).find("#bnlhr-templatepdf #dynamicContent").empty();
                $($tmpl).find("#bnlhr-templatepdf #dynamicContent").append(tablePreview);


                SetDialogPraticaPreview($tmpl, function(dialogId) {
                    $(nav).prependTo($(dialogId));
                    $('#bnlhr-printpdfApprova').unbind();
                    $('#bnlhr-printpdfApprova').bind('click', function() {
                        PrintPdf(true);
                    });
                    $("#bnlhr-publishpdfApprova").unbind();
                    $("#bnlhr-publishpdfApprova").bind('click', function() {
                        PrintPdf(false);
                    });
                    BindViewPraticaForm(callback);
                })
            })
        } else {
            $.when(GetTemplate("templatepdfpreview", false, null)).then(function($tmpl, model) {
                SetDialogPraticaPreview($tmpl, function(dialogId) {
                    $('#bnlhr-printpdfApprova').unbind();
                    $('#bnlhr-printpdfApprova').bind('click', function() {
                        PrintPdf(true);
                    });
                    $("#bnlhr-publishpdfApprova").unbind();
                    $("#bnlhr-publishpdfApprova").bind('click', function() {
                        PrintPdf(false);
                    });
                    BindViewPraticaForm(callback);
                })
            })
        }
    })
}

function BindViewPraticaForm(callback) {
    var authorized = modelPratica.Model.Authorized;
    $("#oggettoPreview").text(modelPratica.Model.NomeWfa);
    if (modelPratica.Model.DipendenteUid && modelPratica.Model.DipendenteUid.length > 2) {
        modelUtenti.Model.DtosDipendenti.filter(function(dtoindex) {
            if (dtoindex.Uid == modelPratica.Model.DipendenteUid) {
                let dto = {};
                dto.Id = 0;
                dto.Uid = modelPratica.Model.DipendenteUid;
                dto.NomeDipendente = dtoindex.Nome;
                dto.Inquadramento = '-';
                dto.UO = '-';
                dto.Sede = '-';
                dto.Mansione = '-';
                dto.Contratto = '-';
                nomeBeneficiario = dto.NomeDipendente;
                this.BindViewRowDipendente(dto);
                this.BindViewRowDipendentePreview(dto);
            }
        });
    } else {
        //GetDipendentePratica
        let modelFilterDipendente = {
            "Model": {}
        };
        modelFilterDipendente.Model.Filter = {};
        modelFilterDipendente.Model.Filter.Id = modelPratica.Model.Dto.DipendenteId;
        let urlDipendente = OC.generateUrl('apps/wfam/dipendente/read');
        bnlhrAjaxCallPOST(urlDipendente, modelFilterDipendente, function(response) {
            if (response !== null && response.Model.Performed) {
                if (response.Model.Dto !== null) {
                    nomeBeneficiario = response.Model.Dto.NomeDipendente;
                    this.BindViewRowDipendente(response.Model.Dto);
                    this.BindViewRowDipendentePreview(response.Model.Dto);
                }
            }
        });
    }

    //Get elementoWfa
    let modelFilterElementoWfa = {
        "Model": {}
    };
    modelFilterElementoWfa.Model.Filter = {};
    modelFilterElementoWfa.Model.Filter.WfaId = modelPratica.Model.Dto.WfaId;
    modelFilterElementoWfa.Model.Order = {};
    modelFilterElementoWfa.Model.Order.Name = "Ordine";
    modelFilterElementoWfa.Model.Order.Direction = "asc";
    let urlPraticaWfa = OC.generateUrl('apps/wfam/elementowfa/get');
    bnlhrAjaxCallPOST(urlPraticaWfa, modelFilterElementoWfa, function(response) {
        if (response !== null && response.Model.Performed) {
            if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                this.SetPraticaWFAForm(response.Model.Dtos, function() {
                    this.SetPraticaWFAFormPreview(response.Model.Dtos, function() {
                        let urlOrganoDeliberante = OC.generateUrl('apps/wfam/ruolowfa/get');
                        let modelFilterOrganoDeliberante = {
                            "Model": {
                                "Filter": {}
                            }
                        };
                        modelFilterOrganoDeliberante.Model.Filter.WfaId = modelPratica.Model.Dto.WfaId;
                        modelFilterOrganoDeliberante.Model.Filter.CodificaRuolo = "A";
                        bnlhrAjaxCallPOST(urlOrganoDeliberante, modelFilterOrganoDeliberante, function(response) {
                            if (response !== null && response.Model.Performed) {
                                if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                                    this.BindViewOrganoDeliberante(response.Model.Dtos);
                                }
                            }
                        });

                        if (modelPratica.Model.Dto.Id > 0) {
                            urlPraticaWfa = OC.generateUrl('apps/wfam/valoreelementowfa/get');
                            let modelFilterValoreElemento = {
                                "Model": {
                                    "Filter": {}
                                }
                            };
                            modelFilterValoreElemento.Model.Filter.PraticaWfaId = modelPratica.Model.Dto.Id;
                            bnlhrAjaxCallPOST(urlPraticaWfa, modelFilterValoreElemento, function(response) {
                                if (response !== null && response.Model.Performed) {
                                    if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {

                                        this.BindViewValoreElementoWfa(response.Model.Dtos);
                                        this.BindViewValoreElementoWfaPreview(response.Model.Dtos);
                                        if (callback)
                                            callback();
                                    }
                                }
                            });
                        } else {
                            let modelFilterRuoloWfa = {};
                            modelFilterRuoloWfa.WfaId = modelPratica.Model.Dto.WfaId;
                            modelFilterRuoloWfa.UtenteId = WFARUOLO.R;
                            GetRuoloWfa(modelFilterRuoloWfa, function(response) {
                                if (response !== null && response.Model.Performed && response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                                    var ruoloWfa = response.Model.Dtos[0];
                                    let modelFilterGroups = {};
                                    modelFilterGroups.RuoloWfaId = ruoloWfa.Id;
                                    GetGroups(modelFilterGroups, function(response) {
                                        if (response !== null && response.Model.Performed && response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                                            modelPratica.Model.GruppiFase = [];
                                            for (var dto of response.Model.Dtos) {
                                                modelPratica.Model.GruppiFase.push(dto.GroupName);
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    });
                });
                $("#bnlhr-publishpdfApprova").parent().remove();
                if (modelPratica.Model.Dto.Id > 0) {
                    if (authorized == true) {
                        $("#bnlhr-praticaWfaForm input[type=button]").show();
                        $("#panelActions").show();
                        $("#bnlhr-praticaWfaForm input[type=text]").attr("readonly", false);
                        $("#bnlhr-praticaWfaForm textarea").attr("readonly", false);
                    }
                } else {
                    $("#bnlhr-praticaWfaForm input[type=button]").show();
                    $("#panelActions").show();
                    $("#bnlhr-praticaWfaForm input[type=text]").attr("readonly", false);
                    $("#bnlhr-praticaWfaForm textarea").attr("readonly", false);
                    $("#bnlhr-printpdfApprova").parent().remove();
                    $("#bnlhr-showAnteprima").remove();
                }
                if (modelPratica.Model.Dto.Stato == statoPraticaWfa.MODIFICA && !WFAGROUPSAUTH.GSUPERADMIN) {
                    if (!modelPratica.Model.RichiestaPersonale)
                        $("#bnlhr-btnDelegaPraticaForm").show();
                    else if (modelPratica.Model.RichiestaPersonale && modelPratica.Model.RuoloFase == WFARUOLO.R) {
                        $("#bnlhr-btnDelegaPraticaForm").remove();
                    } else {
                        $("#bnlhr-btnDelegaPraticaForm").show();
                    }
                } else
                    $("#bnlhr-btnDelegaPraticaForm").remove();
            }
        }
        HidePageLoader();
    });
}

function BindViewRowDipendente(dto) {
    $("#bnlhr-listDipendenti tbody").empty();
    let row = GetTemplateRowDipendentePratica(dto);
    $(row).appendTo("#bnlhr-listDipendenti");
}

function BindViewOrganoDeliberante(dtos) {
    dtos.forEach(function(dto, index) {
        let current = $("#RuoloA").text();
        current += dto.CodiceRuolo;
        if (index < dtos.length - 1)
            current += " , "
        $("#RuoloA").text(current);
        $("#OrganoPreview").text(current);

    })
}

function BindModelValoreElementoWfa(row, praticaId, dtosFileShare) {
    let dto = {};
    if (row.getAttribute("id") == "row-organoEccezione") {
        if ($("#" + row.getAttribute("id") + " table tbody tr").length == 1) {
            let rowOrganoEccezione = $("#" + row.getAttribute("id") + " table tbody #UtenteEccezione")
            dto.Id = parseInt(rowOrganoEccezione.attr("data-id"));
            dto.ElementoWfaId = parseInt(row.getAttribute("data-elementowfa-id"));
            dto.PraticaWfaId = praticaId;
            dto.Valore = rowOrganoEccezione.attr("data-utente-id");
        }
    } else if (row.getAttribute("id") == "row-allegati") {
        let rows = $("#bnlhr-praticaWfaForm tbody>tr[data-path]");
        let dtosFile = [];
        var path = GetPublishPath(modelPratica);
        var pathBeneficiario = nomeBeneficiario.replace(/[^a-z0-9]/gi, '_') + "_" + dto.CodificaProgressivo
        for (let i = 0; i < rows.length; i++) {
            var fileName = rows[i].getAttribute("data-path");
            var fileShare = dtosFileShare.find(x => x.FileName == fileName);
            var pathfile = path + pathBeneficiario + "/" + fileName;
            var dtoFile = {
                "FileName": fileName,
                "Path": pathfile,
                "ShareId": null,
                "UrlShare": null
            };
            if (fileShare) {
                dtoFile.ShareId = fileShare.Id;
                dtoFile.UrlShare = fileShare.Url;
            }
            dtosFile.push(dtoFile);
        }
        dto.Id = parseInt($(row).attr("data-id"));
        dto.ElementoWfaId = parseInt(row.getAttribute("data-elementowfa-id"));
        dto.PraticaWfaId = praticaId;
        dto.Valore = JSON.stringify(dtosFile);

    } else if (row.getAttribute("id") == "row-list") {
        dto.Id = parseInt(row.getAttribute("data-id"));
        dto.ElementoWfaId = parseInt(row.getAttribute("data-elementowfa-id"));
        dto.PraticaWfaId = praticaId;
        dto.Valore = wfaTable.GetJsonGUI();
    } else {
        dto.Id = parseInt(row.getAttribute("data-id"));
        dto.ElementoWfaId = parseInt(row.getAttribute("data-elementowfa-id"));
        dto.PraticaWfaId = praticaId;
        dto.Valore = GetValueElementoWfa(row);
    }
    return dto;
}

function BindViewValoreElementoWfa(dtos) {

    dtos.forEach(function(dto) {
        if (dto.NomeElemento.toLocaleLowerCase() === "organo deliberante") {
            if (dto.Valore !== null) {
                let id = dto.Valore;
                bnlhrAjaxGetUser(id, function(user) {
                    //modelUtenti.Model.DtosGA.filter(function (dtoindex) {
                    if (dtoindex.Id == id) {
                        let nome = user.Nome;
                        let rowOrganoEccezione = GetTemplateRowOrganoEccezione(dto.Id, nome, dto.Valore);
                        $("#bnlhr-btnAggiungiOrganoEccezione").prop("disabled", true);
                        $(rowOrganoEccezione).appendTo("#bnlhr-OrganoEccezione tbody");
                        $("#comboDipendente").prop("disabled", true);
                    }
                    // });
                })

            }
        } else if (dto.NomeElemento.toLocaleLowerCase() == "allegati") {
            $("#row-allegati").attr("data-id", dto.Id);
            if (dto.Valore !== null && dto.Valore.length > 0) {
                let dtosValue = JSON.parse(dto.Valore);
                for (var dtoValue of dtosValue) {
                    var dtoFile = {};
                    dtoFile.Id = dto.Id;
                    dtoFile.Path = dtoValue.Path;
                    dtoFile.Location = "drive";
                    dtoFile.Nome = dtoValue.FileName;
                    dtoFile.UrlShare = dtoValue.UrlShare;
                    let row = GetTemplateRowFile(dtoFile);
                    $(row).insertAfter("#bnlhr-praticaWfaForm #rowPathAllegati");
                }
            }
        } else if (dto.TipoElemento == "RowsList") {
            $("#bnlhr-praticaWfaForm tbody tr[data-elementowfa-id=" + dto.ElementoWfaId + "]").attr("data-id", dto.Id);
            wfaTable.BindViewGUI(dto.Valore);
        } else {
            let elementoIdWfa = dto.ElementoWfaId;
            $("#bnlhr-praticaWfaForm tbody tr[data-elementowfa-id=" + elementoIdWfa + "]").attr("data-id", dto.Id);
            $("#bnlhr-praticaWfaForm tbody tr[data-elementowfa-id=" + elementoIdWfa + "] input:text").val(dto.Valore);
            $("#bnlhr-praticaWfaForm tbody tr[data-elementowfa-id=" + elementoIdWfa + "] input[type=\"number\"]").val(dto.Valore);
            $("#bnlhr-praticaWfaForm tbody tr[data-elementowfa-id=" + elementoIdWfa + "] textarea").val(dto.Valore);
        }
    })
}

function GetValueElementoWfa(row) {
    let fieldValue = $("#" + row.getAttribute("id") + " td input").val();
    if (fieldValue) {
        return fieldValue;
    }
    fieldValue = $("#" + row.getAttribute("id") + " td textarea").val();
    if (fieldValue) {
        return fieldValue;
    }
}


function SetPraticaWFAForm(dtos, callback) {
    //clear delle righe della tabella
    $("#bnlhr-praticaWfaForm tbody").empty();

    dtos.forEach(function(dto) {
        if (dto.NomeElemento.toLocaleLowerCase() === "data decorrenza") {
            let row = GetTemplateRowDataDecorrenza(dto);
            $(row).appendTo("#bnlhr-praticaWfaForm");
            $('input[name="DataDecorrenza"]').datepicker({
                dateFormat: "dd/mm/yy",
                autocomplete: "off"
            });
        }
        if (dto.TipoElemento.toLocaleLowerCase() === "time range") {
            let row = GetTemplateRowIntervallo(dto);
            $(row).appendTo("#bnlhr-praticaWfaForm");
            SetDataRange();
            $('input[name="Intervallo"]').on('apply.daterangepicker', function(ev, picker) {
                $(this).val(picker.startDate.format('DD/MM/YYYY HH:mm') + ' - ' + picker.endDate.format('DD/MM/YYYY HH:mm'));
                dal = picker.startDate.format('YYYY-MM-DD H:mm:00');
                al = picker.endDate.format('YYYY-MM-DD H:mm:00');

            });
            $('input[name="Intervallo"]').on('cancel.daterangepicker', function(ev, picker) {
                $(this).val('');
                dal = null;
                al = null;
            });

            $("#Intervallo").inputmask("99/99/9999 99:99 - 99/99/9999 99:99");

        }
        if (dto.NomeElemento.toLocaleLowerCase() === "importo") {
            let row = GetTemplateRowImporto(dto);
            $(row).appendTo("#bnlhr-praticaWfaForm");
        }
        if (dto.NomeElemento.toLocaleLowerCase() === "motivazione") {
            let row = GetTemplateRowMotivazione(dto);
            $(row).appendTo("#bnlhr-praticaWfaForm");
        }
        if (dto.NomeElemento.toLocaleLowerCase() === "organo deliberante") {
            let row = GetTemplateRowOrganoDeliberante(dto);
            $(row).appendTo("#bnlhr-praticaWfaForm");
            autocomplete(document.getElementById("comboDipendente"), WFARUOLO.A);
        }
        if (dto.NomeElemento.toLocaleLowerCase() === "allegati") {
            let row = GetTemplateRowAllegati(dto);
            $(row).appendTo("#bnlhr-praticaWfaForm");
            $("#bnlhr-lnkDrive").on("click", function(e) {
                OC.dialogs.filepicker('Carica files', function(files) {
                    $("tr[data-location=drive]").remove();
                    for (let i = 0; i < files.length; i++) {
                        let dto = {};
                        dto.Id = 0;
                        dto.Valore = null;
                        dto.Path = files[i];
                        dto.Location = "drive";
                        dto.Nome = files[i].split('/')[files[i].split('/').length - 1];
                        let row = GetTemplateRowFile(dto);
                        $(row).insertAfter("#bnlhr-praticaWfaForm #rowPathAllegati");
                    }
                }, true);
            });

            $("#file_upload_start").on("change", function(e) {
                let files = $("#file_upload_start");
                $("tr[data-location=local]").remove();
                for (let i = 0; i < files[0].files.length; i++) {
                    let dto = {};
                    dto.Id = 0;
                    dto.Valore = files[0].files[i].name;
                    dto.Location = "local";
                    dto.Nome = files[0].files[i].name;
                    let row = GetTemplateRowFile(dto);
                    $(row).insertAfter("#bnlhr-praticaWfaForm #rowPathAllegati");
                }
                $("#bnlhr-pupupMenu").hide();
            });
            // $("#bnlhr-FileSystem").on("click", function(e) {
            //     return $.when(GetTemplate("templateFileSystem")).then(function($tmpl) {
            //         ShowDialogFile($tmpl, WFAFILESYSTEMTYPE.ALLEGATI, function(dialogId, path) {
            //             $("#bnlhr-pathAllegati").append(path);
            //             $("#bnlhr-pathAllegati").attr("data-path", path)

            //             $(dialogId).ocdialog('close');
            //         })
            //     })
            // })
        }
        if (dto.NomeElemento.toLocaleLowerCase() === "note aggiuntive") {
            let row = GetTemplateRowNoteAggiuntive(dto);
            $(row).appendTo("#bnlhr-praticaWfaForm");
        }
        if (dto.TipoElemento.toLocaleLowerCase() === "email") {
            let row = GetTemplateRowEmail(dto);
            $(row).appendTo("#bnlhr-praticaWfaForm");
        }
        if (dto.TipoElemento.toLocaleLowerCase() === "pec") {
            let row = GetTemplateRowPEC(dto);
            $(row).prependTo("#bnlhr-tableAzioni");

        }
        if (dto.TipoElemento.toLocaleLowerCase() === "rowslist") {
            let row = GetTemplateRowsList(dto);
            $(row).appendTo("#bnlhr-praticaWfaForm");
            wfaTable = new WFATable($("#grid-table-pratica"));
            var model = JSON.parse(dto.Rows);
            wfaTable.SetTable(model);
        }

    });
    if (callback)
        callback();

}

function GetTemplateRowDipendentePratica(dto) {
    let row = "<tr id=\"row-" + (dto.Id ? dto.Id : 0) + "\" data-id=\"" + (dto.Id ? dto.Id : 0) + "\" data-uid='" + dto.DipendenteUid + "'>\n" +
        "                <td><span class=\"bnlhr-text-pre-wrap bnlhr-font-weight-bold\" id='NomeDipendente'>" + dto.NomeDipendente + "</span></td>\n" +
        "                <td><span class=\"bnlhr-text-pre-wrap\" id='Sede'>" + dto.Sede + "</span></td>\n" +
        "                <td><span class=\"bnlhr-text-pre-wrap\" id='Mansione'>" + dto.Mansione + "</span></td>\n" +
        "                <td><span class=\"bnlhr-text-pre-wrap\" id='Inquadramento'>" + dto.Inquadramento + "</span></td>\n" +
        "</tr>";
    return row;
}

function GetTemplateRowDataDecorrenza(dto) {
    var required = (dto.Required ? 'required' : '');
    var charRequired = (dto.Required ? '*' : '');
    let row = "<tr >\n" +
        "                <td width=\"300px\" style=\"padding-left:10px;\" >Data decorrenza" + charRequired + "</td>\n" +
        "            </tr>\n" +
        "            <tr id=\"row-" + dto.Id + "\" data-wfa-id=\"" + dto.WfaId + "\" data-elementowfa-id=\"" + dto.Id + "\" data-id=\"" + (dto.ValoreElementoWfaId ? dto.ValoreElementoWfaId : 0) + "\">\n" +
        "                <td width=\"300px\" style=\"padding-left:10px;padding-bottom: 20px;\" >\n" +
        "                    <input class=\"bnlhr-select\" type=\"text\" id=\"DataDecorrenza\" name=\"DataDecorrenza\"  style=\"width: 300px\" autocomplete=\"off\" readonly " + required + " />\n" +
        "                </td>\n" +
        "            </tr>";
    return row;
}

function GetTemplateRowIntervallo(dto) {
    var required = (dto.Required ? 'required' : '');
    var charRequired = (dto.Required ? '*' : '');

    let row = "<tr >\n" +
        "                <td width=\"300px\" style=\"padding-left:10px;\" >Dal/Al" + charRequired + "</td>\n" +
        "            </tr>\n" +
        "            <tr id=\"row-" + dto.Id + "\" data-wfa-id=\"" + dto.WfaId + "\" data-elementowfa-id=\"" + dto.Id + "\" data-id=\"" + (dto.ValoreElementoWfaId ? dto.ValoreElementoWfaId : 0) + "\">\n" +
        "                <td width=\"300px\" style=\"padding-left:10px;padding-bottom: 20px;\" >\n" +
        "                    <input class=\"bnlhr-select\" type=\"text\" id=\"Intervallo\" name=\"Intervallo\"  style=\"width: 300px\" autocomplete=\"off\" readonly " + required + " />\n" +
        "                </td>\n" +
        "            </tr>";
    return row;
}

function GetTemplateRowImporto(dto) {
    var required = (dto.Required ? 'required' : '');
    var charRequired = (dto.Required ? '*' : '');

    let row = "<tr >\n" +
        "                <td width=\"300px\" style=\"padding-left:10px\">Importo" + charRequired + "</td>\n" +
        "            </tr>\n" +
        "            <tr id=\"row-" + dto.Id + "\" data-wfa-id=\"" + dto.WfaId + "\" data-elementowfa-id=\"" + dto.Id + "\" data-id=\"" + (dto.ValoreElementoWfaId ? dto.ValoreElementoWfaId : 0) + "\">\n" +
        "                <td width=\"300px\" style=\"padding-left:10px;padding-bottom: 20px;\">\n" +
        "                    <input class=\"bnlhr-select\" type=\"number\" id=\"Importo\"  style=\"width: 300px\" " + required + "  />\n" +
        "                </td>\n" +
        "            </tr>";
    return row;
}

function GetTemplateRowMotivazione(dto) {
    var required = (dto.Required ? 'required' : '');
    var charRequired = (dto.Required ? '*' : '');

    let row = "<tr >\n" +
        "                <td width=\"500px\" style=\"padding-left:10px\">Motivazione" + charRequired + "</td>\n" +
        "            </tr>\n" +
        "            <tr id=\"row-" + dto.Id + "\" data-wfa-id=\"" + dto.WfaId + "\" data-elementowfa-id=\"" + dto.Id + "\" data-id=\"" + (dto.ValoreElementoWfaId ? dto.ValoreElementoWfaId : 0) + "\">\n" +
        "                <td width=\"500px\" style=\"padding-left:10px;padding-bottom: 20px;\">\n" +
        "                    <textarea class=\"bnlhr-select\" type=\"text\" id=\"Motivazione\"   style=\"width: 500px;height:300px\" " + required + " ></textarea>\n" +
        "                </td>\n" +
        "            </tr>";
    return row;
}

function GetTemplateRowOrganoDeliberante(dto) {
    var required = (dto.Required ? 'required' : '');
    var charRequired = (dto.Required ? '*' : '');

    let row = "<tr>\n" +
        "                <td width=\"200px\" style=\"padding-left:10px;padding-bottom: 20px;\">Organo deliberante preposto: <span id=\"RuoloA\"></span>\n" +
        "                </td>\n" +
        "            </tr>\n" +
        "            <tr>\n" +
        "                <td width=\"500px\" style=\"padding-left:10px\">Organo deliberante con eccezione" + charRequired + "</td>\n" +
        "            </tr>\n" +
        "            <tr id=\"row-" + dto.Id + "\" >\n" +
        "                <td width=\"500px\" style=\"padding-left:10px;padding-bottom: 20px;\">\n" +
        "                <div class=\"autocomplete\" style=\"width:300px;\">\n" +
        "                   <input id=\"comboDipendente\" data-id=\"-1\" type=\"text\" name=\"comboDipendente\" placeholder=\"Cerca per CID o cognome\" style='width:300px' autocomplete=\"off\" >\n" +
        "                   <span id=\"autocompleteLoading\" class=\"icon-loading-small-dark\" style=\"display:none;top:0;left: -22px;\"></span>" +
        "                </div>\n" +
        "                    <input type=\"button\" id=\"bnlhr-btnAggiungiOrganoEccezione\" class=\"bnlhr-button-white\" value=\"AGGIUNGI\" style=\"width: 200px;\"/>\n" +
        "                </td>\n" +
        "            </tr>\n" +
        "             <tr id=\"row-organoEccezione\" data-wfa-id=\"" + dto.WfaId + "\" data-elementowfa-id=\"" + dto.Id + "\"><td>\n" +
        "                <table id=\"bnlhr-OrganoEccezione\" class=\"bnlhr-table\" width=\"515\" style=\"margin-top: 0;\" data-wfa-id=\"" + dto.WfaId + "\" " + required + " >\n" +
        "                    <tbody>\n" +
        "                    </tbody>\n" +
        "                </table></td>\n" +
        "            </tr>";
    return row;
}

function GetTemplateRowAllegati(dto) {
    var required = (dto.Required ? 'required' : '');
    var charRequired = (dto.Required ? '*' : '');


    let row = "<tr id=\"row-allegati\"  data-id='0' data-elementowfa-id=\"" + dto.Id + "\" data-wfa-id=\"" + dto.WfaId + "\" " + required + " >\n" +
        "                <td width=\"500px\" style=\"padding-left:10px\">Carica allegati" + charRequired + "</td>\n" +
        "            </tr>\n" +
        "            <tr id=\"row-" + dto.Id + "\"  data-elementowfa-id=\"" + dto.Id + "\" data-name=\"formUpload\">\n" +
        "                <td width=\"500px\" style=\"padding-left:10px;padding-bottom: 20px;\">\n" +
        "                   <div class=\"actions creatable\" >\n" +
        "                       <input class=\"bnlhr-select\" type=\"text\" id=\"Allegati\"  style=\"width: 300px\" readonly />\n" +
        "                       <input type=\"file\" id=\"file_upload_start\" class=\"hiddenuploadfield\" name=\"files[]\" multiple=\"multiple\">" +
        "                       <input type=\"button\" id=\"bnlhr-btnCaricaAllegati\" class=\"bnlhr-button-white\" value=\"CARICA\" style=\"width: 180px;\" />\n" +
        "                       <div id=\"uploadprogresswrapper\">\n" +
        "                           <div id=\"uploadprogressbar\">\n" +
        "                               <em class=\"label outer\" style=\"display:none\"><span class=\"desktop\">Caricamento in corso...</span><span class=\"mobile\">…</span></em>\n" +
        "                       </div>\n" +
        "                       <button class=\"stop icon-close\" style=\"display:none\">\n" +
        "                           <span class=\"hidden-visually\">Annulla caricamento</span>\n" +
        "                       </button>\n" +
        "                   </div>\n" +
        "            <div id='bnlhr-pupupMenu' class=\"newFileMenu popovermenu bubble menu open menu-left\" style=\"display: none;\"><ul>\n" +
        "                    <li>\n" +
        "                        <label id='bnlhr-lnkDrive' for=\"file_upload_start-drive\" class=\"menuitem\" data-action=\"upload\" title=\"\" tabindex=\"0\"><span class=\"svg icon icon-upload\"></span><span class=\"displayname\">Carica file dal cloud</span></label>\n" +
        "                    </li>\n" +
        "                    <li>\n" +
        "                        <label id='bnlhr-lnkLocal' for=\"file_upload_start\" class=\"menuitem\" data-action=\"upload\" title=\"\" tabindex=\"0\"><span class=\"svg icon icon-upload\"></span><span class=\"displayname\">Carica file locale</span></label>\n" +
        "                    </li>\n" +
        // "                    <li>\n" +
        // "                        <label id='bnlhr-FileSystem'  class=\"menuitem\" data-action=\"upload\" title=\"\" tabindex=\"0\"><span class=\"svg icon icon-folder\"></span><span class=\"displayname\">Salva in</span></label>\n" +
        // "                    </li>\n" +
        "                </ul>\n" +
        "            </div></div>\n" +
        "                </td>\n" +
        "            </tr>" +
        "            <tr id=\"rowPathAllegati\"><td width=\"500px\" style=\"padding-left:10px\">" +
        // "                <label id='bnlhr-pathAllegati' data-path=\"\"  title=\"\" ><span class=\"svg icon icon-folder\"></span><span class=\"displayname\">I file verranno salvati in </span></label>\n" +
        "            </td></tr>";
    return row;
}

function GetTemplateRowNoteAggiuntive(dto) {
    var required = (dto.Required ? 'required' : '');
    var charRequired = (dto.Required ? '*' : '');

    let row = "<tr >\n" +
        "                <td width=\"200px\" style=\"padding-left:10px; padding-top:20px \">Note aggiuntive" + charRequired + " - non saranno aggiunte nel documento di delibera</td>\n" +
        "            </tr>\n" +
        "            <tr id=\"row-" + dto.Id + "\" data-wfa-id=\"" + dto.WfaId + "\" data-elementowfa-id=\"" + dto.Id + "\" data-id=\"" + (dto.ValoreElementoWfaId ? dto.ValoreElementoWfaId : 0) + "\">\n" +
        "                <td width=\"200px\" style=\"padding-left:10px;padding-bottom: 20px;\">\n" +
        "                    <textarea class=\"bnlhr-select\" type=\"text\" id=\"NoteAggiuntive\"  style=\"width: 500px\" " + required + "></textarea>\n" +
        "                </td>\n" +
        "            </tr>";
    return row;
}

function GetTemplateRowOrganoEccezione(id, nome, utenteId) {
    let row = "<tr id=\"UtenteEccezione\" data-utente-id=\"" + utenteId + "\" data-id=\"" + id + "\">\n" +
        "    <td width=\"500\" >\n" +
        "       <span >" + nome + "</span>\n" +
        "    </td>\n" +
        " </tr>";
    return row;
}

function GetTemplateRowEmail(dto) {
    var required = (dto.Required ? 'required' : '');
    var charRequired = (dto.Required ? '*' : '');

    let row = "<tr >\n" +
        "         <td width=\"300px\" style=\"padding-left:10px\">Inserisci mail di notifica" + charRequired + "(separate da ;)</td>\n" +
        "      </tr>\n" +
        "            <tr id=\"row-" + dto.Id + "\" data-wfa-id=\"" + dto.WfaId + "\" data-elementowfa-id=\"" + dto.Id + "\" data-id=\"" + (dto.ValoreElementoWfaId ? dto.ValoreElementoWfaId : 0) + "\">\n" +
        "                <td width=\"300px\" style=\"padding-left:10px;padding-bottom: 20px;\">\n" +
        "                    <input class=\"bnlhr-select\" type=\"text\" id=\"bnlhr-tbEmail\"  style=\"width: 300px\" " + required + " />\n" +
        "                </td>\n" +
        "            </tr>";
    return row;
}

function GetTemplateRowsList(dto) {
    var row = "<tr id=\"row-list\" data-wfa-id=\"" + dto.WfaId + "\" data-elementowfa-id=\"" + dto.Id + "\" data-id=\"" + (dto.ValoreElementoWfaId ? dto.ValoreElementoWfaId : 0) + "\" data-type=\"RowList\">\n<td>\n<table id=\"grid-table-pratica\">\n" +
        "        <thead>\n" +
        "        </thead>\n" +
        "        <tbody>\n" +
        "        </tbody>\n" +
        "    </table>\n</td>\n</tr>\n";
    return row;
}


$("#app-pages").on('click', '#bnlhr-btnPec', function() {
    return $.when(GetTemplate("templatepec")).then(function($tmpl) {
        ShowDialogPec($tmpl, function(dialogId) {
            var modelPEC = BindViewModelPec(dialogId);
            if (modelPEC.Model.To != null && modelPEC.Model.Subject && modelPEC.Model.Body) {
                SendPec(modelPEC, function(response) {
                    if (response != null && response.Model != null) {
                        if (response.Performed)
                            OC.dialogs.info('Pec inviata.', 'Info');
                        else
                            OC.dialogs.info("Si è verificato uin errore durante l'invio della pec.", 'Info');
                    } else if (response.statusText) {
                        OC.dialogs.alert(response.statusText, 'Errore');
                    }
                });
            } else
                OC.dialogs.info('Compilare tutti i campi.', 'Info');

        });
    })
})

$("#app-pages").on('click', '#bnlhr-btnAggiungiOrganoEccezione', function() {
    let utenteId = $("#comboDipendente").attr("data-id");
    modelUtenti.Model.DtosGA.filter(function(dtoindex) {
        if (dtoindex.Id == utenteId) {
            let nome = dtoindex.Nome;
            let row = GetTemplateRowOrganoEccezione(0, nome, utenteId);
            $(row).appendTo("#bnlhr-OrganoEccezione tbody");
            $("#bnlhr-btnAggiungiOrganoEccezione").prop("disabled", true);
            $("#comboDipendente").prop("disabled", true);
        }
    });
})

function GetTemplateRowFile(dto) {
    let row = "<tr id=\"listFile\" data-id=\"" + dto.Id + "\" data-path=\"" + dto.Nome + "\" data-file-path=\"" + dto.Path + "\" data-location=\"" + dto.Location + "\">\n" +
        "    <td width=\"500\" style='border-bottom: 3px solid var(--color-primary); height: 30px;padding: 5px 5px 5px 10px;' >\n" +
        "       <span style='top: 15px;position: relative;'>" + dto.Nome + "</span>\n" +
        "          <input type=\"button\" id=\"bnlhr-btnRimuoviAllegato\" class=\"bnlhr-button-white\" value=\"RIMUOVI\"style='width: 100px;float: right;' />\n" +
        "    </td>\n" +
        "<td></td>\n" +
        "</tr>\n";


    return row;
}

function GetTemplateRowFilePreview(dto) {
    let row = "<tr id=\"listFile\" data-id=\"" + dto.Id + "\" data-path=\"" + dto.Nome + "\" data-file-path=\"" + dto.Path + "\" data-location=\"" + dto.Location + "\">\n" +
        "    <td class='allegati-preview-row' colspan='6' width=\"200\" style='height: 30px;padding: 5px 5px 5px 10px;' >\n" +
        "       <span>" + dto.Nome + "</span>\n" +
        "    </td>\n" +
        "</tr>\n";


    return row;
}

function GetTemplateRowPEC(dto) {
    let row = "<tr>\n" +
        "                <td width=\"20%\" >\n" +
        "                    <input type=\"button\" id=\"bnlhr-btnPec\" class=\"bnlhr-button-white \" value=\"Invia una pec\" />\n" +
        "                </td>\n" +
        "            </tr>";
    return row;
}

$("#app-pages").on('click', '#bnlhr-btnRimuoviAllegato', function() {
    let row = $(this).closest("tr");
    row.remove();
});

function EnableControlsFormPratica(enable) {
    $("#bnlhr-btnInviaPraticaForm").prop("disabled", !enable);
    $("#bnlhr-btnIndietroPraticaForm").prop("disabled", !enable);
    $("#bnlhr-btnAnnullaPraticaForm").prop("disabled", !enable);
    $("#bnlhr-btnSalvaBozzaPraticaForm").prop("disabled", !enable);
}

$("#app-pages").on('click', '#bnlhr-btnSalvaBozzaPraticaForm', function(event) {

    EnableControlsFormPratica(false);
    let valid = true; // ValidatePraticaWfa();
    if (valid) {
        ShowPageLoader();
        SalvaDipendentePratica(function(response) {
            if (response != null && response.Model.Performed) {
                modelPratica.Model.Dto.DipendenteId = response.Model.Dto.Id;
                modelPratica.Model.Dto.Stato = statoPraticaWfa.BOZZA;
                let engineMethod = 'startworkflow';
                let rows = $("#bnlhr-praticaWfaForm tbody>tr[data-wfa-id]");
                SalvaPraticaWfa(modelPratica, function(response) {
                    if (response.Model.Performed) {
                        modelPratica.Model.Dto.Id = response.Model.Dto.Id;
                        let stato = true;
                        modelPratica["Bozza"] = true;
                        SetAuthWorkflow(modelPratica, stato, function(performed, codificaRuolo) {
                            if (performed) {
                                SalvaRuoloPraticaWorkflow(modelPratica.Model.Dto, codificaRuolo, modelPratica.Model.GruppiFase, function() {
                                    DocumentUpload(response.Model.Dto, function(responseUpload) {
                                        DocumentUploadDrive(response.Model.Dto, function(responseUploaddrive) {
                                            SalvaValoreElementoPraticaWfa(response.Model.Dto, rows, function(responseElementoPraticaWfa) {
                                                navigation.Clear();
                                                let url = OC.generateUrl("/apps/wfam/cruscotto");
                                                var breadcrumbtitle = GetTitle();
                                                navigation.GoTo(breadcrumbtitle, url, {
                                                    "Performed": true
                                                }, function() {
                                                    HidePageLoader();
                                                    LoadCruscotto();
                                                });
                                            })
                                        }, 0);
                                    }, 0);
                                })
                            }
                        }, engineMethod)

                    } else {
                        if (response.Message != null && response.Message.length > 0) {
                            OC.dialogs.info(response.Message, 'Info');
                        } else {
                            OC.dialogs.alert('Errore nel salvataggio della pratica', 'ERRORE');
                        }
                        EnableControlsFormPratica(true);
                    }
                })


            } else {
                EnableControlsFormPratica(true);
                OC.dialogs.alert("Non è stato possibile completare il salvataggio. Se l'errore persiste contattare l'amministratore di sistema", 'AVVISO');
            }
        });
    } else {
        EnableControlsFormPratica(true);
        OC.dialogs.alert('Compilare i campi obblicgatori', 'AVVISO');
    }
    event.preventDefault();
});

$("#app-pages").on('click', '#bnlhr-btnInviaPraticaForm', function(event) {
    EnableControlsFormPratica(false);
    let valid = ValidatePraticaWfa();
    if (valid) {
        ShowPageLoader();
        SalvaDipendentePratica(function(response) {
            if (response != null && response.Model.Performed) {
                modelPratica.Model.Dto.DipendenteId = response.Model.Dto.Id;
                GetNextRuolo(modelPratica, true, function(codificaRuolo) {
                    let engineMethod = 'startworkflow';
                    if (modelPratica.Model.Dto.Stato != null) {
                        engineMethod = 'setauthorization';
                    }
                    if (codificaRuolo == WFARUOLO.A)
                        modelPratica.Model.Dto.Stato = statoPraticaWfa.DELIBERA;
                    else
                        modelPratica.Model.Dto.Stato = statoPraticaWfa.APPROVAZIONE;


                    let rows = $("#bnlhr-praticaWfaForm tbody>tr[data-wfa-id]");
                    var path = GetPublishPath(modelPratica);
                    modelPratica.Model.Path = path;
                    modelPratica.Model.NomeBeneficiario = nomeBeneficiario.replace(/[^a-z0-9]/gi, '_');
                    SalvaPraticaWfa(modelPratica, function(response) {
                        if (response.Model.Performed) {
                            modelPratica.Model.Dto.Id = response.Model.Dto.Id;
                            let stato = true;
                            SetAuthWorkflow(modelPratica, stato, function(performed, codificaRuolo) {
                                if (performed) {
                                    SalvaRuoloPraticaWorkflow(modelPratica.Model.Dto, codificaRuolo, modelPratica.Model.GruppiFase, function() {
                                        DocumentUpload(response.Model.Dto, function(responseUpload) {
                                            DocumentUploadDrive(response.Model.Dto, function(responseUploaddrive) {
                                                var dtosFileShare = responseUpload.Dtos.concat(responseUploaddrive.Dtos);
                                                SalvaValoreElementoPraticaWfa(response.Model.Dto, rows, dtosFileShare, function(responseElementoPraticaWfa) {
                                                    SendMailNotification(modelPratica, function() {
                                                        var emails = $("#bnlhr-tbEmail").val();
                                                        if (emails != null && emails.length > 0) {
                                                            var mailsArray = emails.split(";")
                                                            SendMail(modelPratica, mailsArray);
                                                        }
                                                        navigation.Clear();
                                                        let url = OC.generateUrl("/apps/wfam/cruscotto");
                                                        var breadcrumbtitle = GetTitle();
                                                        navigation.GoTo(breadcrumbtitle, url, {
                                                            "Performed": true
                                                        }, function() {
                                                            HidePageLoader();
                                                            LoadCruscotto();

                                                        });
                                                    });

                                                })

                                            }, 0);
                                        }, 0);
                                    })
                                }
                            }, engineMethod)

                        } else {
                            if (response.Message != null && response.Message.length > 0) {
                                OC.dialogs.info(response.Message, 'Info');
                            } else {
                                OC.dialogs.alert('Errore nel salvataggio della pratica', 'ERRORE');
                            }
                            EnableControlsFormPratica(true);

                        }
                    })

                })
            } else {
                EnableControlsFormPratica(true);
                OC.dialogs.alert("Non è stato possibile completare il salvataggio. Se l'errore persiste contattare l'amministratore di sistema", 'AVVISO');
            }
        });
    } else {
        EnableControlsFormPratica(true);
        OC.dialogs.alert('Compilare i campi obbligatori', 'AVVISO');
    }
    event.preventDefault();
});

$("#app-pages").on('click', '#bnlhr-btnAnnullaPraticaForm', function(event) {
    event.preventDefault();
    EnableControlsFormPratica(false);
    if (modelPratica.Model.Dto.Id > 0) {
        ShowPageLoader();
        let model = {
            "Model": {
                "Dto": {}
            }
        };
        model.Model.Dto.Id = modelPratica.Model.Dto.Id;
        let urlPraticaWfa = OC.generateUrl('apps/wfam/praticawfa/delete');
        bnlhrAjaxCallPOST(urlPraticaWfa, model, function(response) {
            if (response !== null && response.Performed) {
                //SendMailNotification(modelPratica, function () {
                var emails = $("#bnlhr-tbEmail").val();
                if (emails != null && emails.length > 0) {
                    var mailsArray = emails.split(";")
                    SendMail(modelPratica, mailsArray);
                }
                navigation.Clear();
                let url = OC.generateUrl("/apps/wfam/cruscotto");
                var breadcrumbtitle = GetTitle();
                navigation.GoTo(breadcrumbtitle, url, {
                    "Performed": true
                }, function() {
                    HidePageLoader();
                    LoadCruscotto();
                });
                // });
            } else {
                EnableControlsFormPratica(true);
                OC.dialogs.alert('Azione non completata.', 'ERRORE');
            }
        });
    } else {
        navigation.Clear();
        let url = OC.generateUrl("/apps/wfam/cruscotto");
        var breadcrumbtitle = GetTitle();
        navigation.GoTo(breadcrumbtitle, url, {
            "Performed": true
        }, function() {
            HidePageLoader();
            LoadCruscotto();
        });
    }
});

$("#app-pages").on('click', '#bnlhr-btnIndietroPraticaForm', function() {
    EnableControlsFormPratica(false);
    navigation.Clear();
    let url = OC.generateUrl("/apps/wfam/cruscotto");
    var breadcrumbtitle = GetTitle();
    navigation.GoTo(breadcrumbtitle, url, {}, function() {
        LoadCruscotto();
    });
});

function SalvaPraticaWfa(model, callback) {

    let urlPraticaWfa = OC.generateUrl('apps/wfam/praticawfa/createorupdate');
    bnlhrAjaxCallPOST(urlPraticaWfa, model, function(response) {
        if (response !== null && response.Model.Performed) {
            if (response.Model.Dto !== null) {
                if (callback)
                    callback(response);
                return;
            } else {
                if (callback)
                    callback(response);
                return;
            }
        } else {
            if (callback)
                callback(response);
            return;
        }
    });

}

function BindModelDipendentePratica() {
    let row = $("#bnlhr-listDipendenti tbody tr");
    let model = {
        "Model": {
            "Dto": {}
        }
    };
    model.Model.Dto.Id = parseInt($(row).attr("data-id"));
    model.Model.Dto.NomeDipendente = row.find("td").find("span#NomeDipendente").text()
    model.Model.Dto.Inquadramento = row.find("td").find("span#Inquadramento").text()
    model.Model.Dto.UO = row.find("td").find("span#UO").text()
    model.Model.Dto.Sede = row.find("td").find("span#Sede").text()
    model.Model.Dto.Mansione = row.find("td").find("span#Mansione").text()
    model.Model.Dto.Contratto = row.find("td").find("span#Contratto").text()
    return model;
}

function SalvaDipendentePratica(callback) {
    let model = BindModelDipendentePratica();
    let url = OC.generateUrl('apps/wfam/dipendente/createorupdate');
    bnlhrAjaxCallPOST(url, model, function(response) {
        if (response !== null && response.Model.Performed) {
            if (response.Model.Dto !== null) {
                if (callback)
                    callback(response);
            }
        }
    });

}

function SalvaValoreElementoPraticaWfa(dto, rows, dtosFileShare, callback) {

    if (rows && rows.length > 0) {
        rows.each(function(index, row) {
            let model = {
                "Model": {
                    "Dto": {}
                }
            };
            model.Model.Dto = BindModelValoreElementoWfa(row, dto.Id, dtosFileShare);
            //salva valore elemento
            let url = OC.generateUrl('apps/wfam/valoreelementowfa/createorupdate');
            bnlhrAjaxCallPOST(url, model, function(response) {

            });

            if (rows.length - 1 === index) {
                if (callback)
                    callback();
            }
        })
    }
}

function ValidatePraticaWfa() {
    var controlsRequired = $(".bnlhr-view #bnlhr-praticaWfaForm tbody:first >tr[data-type!= 'RowList'] [required]");
    var isValid = true;
    if (controlsRequired && controlsRequired.length > 0) {
        for (var control of controlsRequired.toArray()) {
            var controlType = $(control).prop("tagName").toLocaleLowerCase();
            if (controlType == "textarea") {
                isValid = ($(control).val().trim().length > 0);
            } else if (controlType == "input") {
                isValid = ($(control).val().trim().length > 0);
            } else if (controlType == "table") {
                isValid = ($("#" + control.getAttribute("id") + " tbody>tr").length > 0);
            } else if (controlType == "tr") {
                var id = $(control).attr("id");
                if (id == "row-allegati") {
                    isValid = ($("#list-file tbody>tr").length > 0);
                }
            }
            if (!isValid)
                return isValid;
        }
    }
    if (wfaTable) {
        isValid = wfaTable.ValidationGUI();
    }
    return isValid;
}

//Preview
function BindViewRowDipendentePreview(dto) {
    $("#rowDipendentePreview").empty();
    let row = GetTemplateRowDipendentePraticaPreview(dto);
    $(row).appendTo("#rowDipendentePreview");
}

function BindViewValoreElementoWfaPreview(dtos) {
    dtos.forEach(function(dto) {
        if (dto.NomeElemento.toLocaleLowerCase() === "organo deliberante") {
            if (dto.Valore !== null) {
                let id = dto.Valore;
                bnlhrAjaxGetUser(id, function(user) {
                    //modelUtenti.Model.DtosGA.filter(function (dtoindex) {
                    if (user != null) {
                        let nome = user.Nome;
                        $("#OrganoEccezionePreview").text(nome);
                        $("#bnlhr-praticaWfaFormPreview tr[data-elementowfa-id=" + dto.ElementoWfaId + "]").show();
                    }
                    //});
                })
            }
        } else if (dto.NomeElemento.toLocaleLowerCase() == "allegati") {
            // $("<tr><td class='allegati-preview-header' colspan='6'>Allegati</td></tr>").appendTo("#bnlhr-praticaWfaFormPreview");
            // $("#row-allegati").attr("data-id", dto.Id);
            // if (dto.Valore !== null && dto.Valore.length > 0) {
            //     let dtoFile = {};
            //     let names = dto.Valore.split('|');
            //     for (let i = 0; i < names.length; i++) {
            //         dtoFile.Id = dto.Id;
            //         dtoFile.Path = names[i];
            //         dtoFile.Location = "drive";
            //         dtoFile.Nome = names[i].split('/')[names[i].split('/').length - 1];
            //         let row = GetTemplateRowFilePreview(dtoFile);
            //         $(row).appendTo("#bnlhr-praticaWfaFormPreview");
            //     }
            // }
            $("#row-allegati-preview").attr("data-id", dto.Id);
            if (dto.Valore !== null && dto.Valore.length > 0) {
                $("#rowfiles-preview td").text("Allegati");
                // let dtoFile = {};
                // let names = dto.Valore.split('|');
                // for (let i = 0; i < names.length; i++) {
                //     dtoFile.Id = dto.Id;
                //     dtoFile.Path = names[i];
                //     dtoFile.Location = "drive";
                //     dtoFile.Nome = names[i].split('/')[names[i].split('/').length - 1];
                let dtosValue = JSON.parse(dto.Valore);
                for (var dtoValue of dtosValue) {
                    var dtoFile = {};
                    dtoFile.Id = dto.Id;
                    dtoFile.Path = dtoValue.Path;
                    dtoFile.Location = "drive";
                    dtoFile.Nome = dtoValue.FileName;
                    dtoFile.UrlShare = dtoValue.UrlShare;
                    let row = GetTemplateRowFilePreview(dtoFile);
                    $(row).insertAfter("#bnlhr-praticaWfaFormPreview #rowfiles-preview");
                }
            }
        } else if (dto.TipoElemento == "RowsList") {
            wfaTablePreview.BindViewGUI(dto.Valore, true);
        } else {
            let elementoIdWfa = dto.ElementoWfaId;
            //$("#bnlhr-praticaWfaFormPreview tbody tr[data-elementowfa-id=" + elementoIdWfa + "]").attr("data-id", dto.Id);
            $("#bnlhr-praticaWfaFormPreview tbody tr[data-elementowfa-id=" + elementoIdWfa + "] span").text(dto.Valore);

        }
    });
}

function SetPraticaWFAFormPreview(dtos, callback) {
    //clear delle righe della tabella
    $("#rowsElementiWFAPreview").empty();
    dtos.forEach(function(dto) {
        if (dto.NomeElemento.toLocaleLowerCase() === "data decorrenza") {
            let row = GetTemplateRowDataDecorrenzaPreview(dto);
            $(row).appendTo("#rowsElementiWFAPreview");
        }
        if (dto.TipoElemento.toLocaleLowerCase() === "time range") {
            let row = GetTemplateRowIntervalloPreview(dto);
            $(row).appendTo("#rowsElementiWFAPreview");
        }
        if (dto.NomeElemento.toLocaleLowerCase() === "importo") {
            let row = GetTemplateRowImportoPreview(dto);
            $(row).appendTo("#rowsElementiWFAPreview");
        }
        if (dto.NomeElemento.toLocaleLowerCase() === "motivazione") {
            let row = GetTemplateRowMotivazionePreview(dto);
            $(row).appendTo("#rowsElementiWFAPreview");
        }
        if (dto.NomeElemento.toLocaleLowerCase() === "organo deliberante") {
            let row = GetTemplateRowOrganoDeliberantePreview(dto);
            $(row).appendTo("#rowsElementiWFAPreview");
            let rowEccezione = GetTemplateRowOrganoEccezionePreview(dto.Id);
            $(rowEccezione).appendTo("#rowsElementiWFAPreview");
        }
        if (dto.NomeElemento.toLocaleLowerCase() === "allegati") {
            $("<tr id='row-allegati-preview' style=\"display:none\"><td style=\"padding-left:10px;height: 50px \">&nbsp;</td></tr>").appendTo("#rowsElementiWFAPreview");
            $("<tr id='rowfiles-preview'><td style=\"padding-left:10px;height: 30px;font-weight: bold \">&nbsp;</td></tr>").appendTo("#rowsElementiWFAPreview");

        }
        if (dto.TipoElemento.toLocaleLowerCase() === "rowslist") {
            let row = GetTemplateRowsListPreview(dto);
            $(row).appendTo("#rowsElementiWFAPreview");
            wfaTablePreview = new WFATable($("#grid-table-pratica-preview"));
            var model = JSON.parse(dto.Rows);
            wfaTablePreview.SetTable(model, true);
        }
    });

    if (callback)
        callback();

}

function GetTemplateRowDipendentePraticaPreview(dto) {
    let row = "<tr id=\"row-" + dto.Id + "\" data-id=\"" + dto.Id + "\">\n" +
        "                <td><span class=\"bnlhr-text-pre-wrap bnlhr-font-weight-bold\" style='padding:0'>" + dto.NomeDipendente + "</span></td>\n" +
        "                <td><span class=\"bnlhr-text-pre-wrap\" style='padding:0'>" + dto.Sede + "</span></td>\n" +
        "                <td><span class=\"bnlhr-text-pre-wrap\" style='padding:0'>" + dto.Mansione + "</span></td>\n" +
        "                <td><span class=\"bnlhr-text-pre-wrap\" style='padding:0'>" + dto.Inquadramento + "</span></td>\n" +
        "</tr>";
    return row;
}

function GetTemplateRowDataDecorrenzaPreview(dto) {
    let row = "<tr data-elementowfa-id=\"" + dto.Id + "\">\n" +
        "                <td width=\"300px\" style=\"padding-left:10px;padding-top: 10px;\" >Data decorrenza <span id=\"DataDecorrenzaPreview\" name=\"DataDecorrenzaPreview\" style=\"font-weight:bold\"></span></td>\n" +
        "            </tr>\n";
    return row;
}

function GetTemplateRowIntervalloPreview(dto) {
    let row = "<tr data-elementowfa-id=\"" + dto.Id + "\">\n" +
        "                <td width=\"300px\" style=\"padding-left:10px;padding-top: 10px;\" >Dal/Al <span id=\"IntervalloPreview\" name=\"IntervalloPreview\" style=\"font-weight:bold\"></span></td>\n" +
        "            </tr>\n";
    return row;
}

function GetTemplateRowImportoPreview(dto) {
    let row = "<tr data-elementowfa-id=\"" + dto.Id + "\" >\n" +
        "                <td width=\"300px\" style=\"padding-left:10px;padding-top: 10px;\">Importo €<span id=\"ImportoPreview\" style=\"font-weight:bold\"></span></td>\n" +
        "            </tr>\n";
    return row;
}

function GetTemplateRowMotivazionePreview(dto) {
    let row = "<tr data-elementowfa-id=\"" + dto.Id + "\" >\n" +
        "                <td width=\"500px\" style=\"padding-top: 10px;padding-left: 10px;padding-right: 10px\" class=\"bnlhr-text-pre-wrap\"><span id=\"MotivazionePreview\" style='padding:0'></span></td>\n" +
        "            </tr>\n";
    return row;
}

function GetTemplateRowOrganoDeliberantePreview(dto) {
    let row = "<tr data-elementowfa-id=\"" + dto.Id + "\" >\n" +
        "                <td width=\"200px\" style=\"padding-left:10px;padding-top: 10px;\">Organo deliberante previsto: <span id=\"OrganoPreview\" style=\"font-weight:bold\"></span>\n" +
        "                </td>\n" +
        "            </tr>\n";
    return row;
}

function GetTemplateRowOrganoEccezionePreview(id) {
    let row = "<tr data-elementowfa-id=\"" + id + "\" style='display: none'>\n" +
        "                <td width=\"200px\" style=\"padding-left:10px;padding-top: 10px;\">Organo deliberante con eccezione: <span id=\"OrganoEccezionePreview\" style=\"font-weight:bold\"></span>\n" +
        "                </td>\n" +
        "            </tr>\n";
    return row;
}

function GetTemplateRowsListPreview(dto) {
    var row = "<tr id=\"row-list-preview\" data-wfa-id=\"" + dto.WfaId + "\" data-elementowfa-id=\"" + dto.Id + "\" data-id=\"" + (dto.ValoreElementoWfaId ? dto.ValoreElementoWfaId : 0) + "\" data-type=\"RowList\">\n<td style=\"padding-top: 10px\">\n<table id=\"grid-table-pratica-preview\">\n" +
        "        <thead>\n" +
        "        </thead>\n" +
        "        <tbody>\n" +
        "        </tbody>\n" +
        "    </table>\n</td>\n</tr>\n";
    return row;
}

$("#app-pages").on('click', '#bnlhr-btnCaricaAllegati', function() {

    $(".popovermenu").show();

});

function PrintPdf(preview) {
    $("#loader-printpdf").show();
    let valid = ValidatePraticaWfa();
    if (valid) {

        SalvaDipendentePratica(function(response) {
            if (response != null && response.Model.Performed) {
                modelPratica.Model.Dto.DipendenteId = response.Model.Dto.Id;
                modelPratica.Model.Dto.Stato = (modelPratica.Model.Dto.Stato === null ? statoPraticaWfa.BOZZA : modelPratica.Model.Dto.Stato);
                let rows = $("#bnlhr-praticaWfaForm tbody>tr[data-wfa-id]");
                let engineMethod = 'startworkflow';
                if (modelPratica.Model.Dto.ModificaRichiesta && modelPratica.Model.Dto.ModificaRichiesta !== null && modelPratica.Model.Dto.ModificaRichiesta !== "null") {
                    engineMethod = 'setauthorization';
                }
                var path = GetPublishPath(modelPratica);
                modelPratica.Model.Path = path;
                modelPratica.Model.NomeBeneficiario = nomeBeneficiario.replace(/[^a-z0-9]/gi, '_');
                SalvaPraticaWfa(modelPratica, function(codificaProgressivo) {
                    if (response.Model.Performed) {
                        modelPratica.Model.Dto.Id = response.Model.Dto.Id;
                        let stato = true;
                        modelPratica["Bozza"] = true;
                        SetAuthWorkflow(modelPratica, stato, function(performed, codificaRuolo) {
                            if (performed) {
                                SalvaRuoloPraticaWorkflow(modelPratica.Model.Dto, codificaRuolo, modelPratica.Model.GruppiFase, function() {
                                    DocumentUpload(response.Model.Dto, function(responseUpload) {
                                        DocumentUploadDrive(response.Model.Dto, function(responseUploaddrive) {
                                            SalvaValoreElementoPraticaWfa(response.Model.Dto, rows, function(responseElementoPraticaWfa) {
                                                modelPratica.Model.Authorized = (modelPratica.Model.Authorized != null ? modelPratica.Model.Authorized : true);
                                                modelPratica.Model.Dto.CodificaProgressivo = response.Model.Dto.CodificaProgressivo;;
                                                LoadPraticaWFAForm(modelPratica, function() {
                                                    var clonedTable = jQuery("#bnlhr-print").clone(true);
                                                    $(clonedTable).css("height", "1020px");
                                                    $(clonedTable).find("#bnlhr-praticaWfaFormPreview").css("width", "100%");
                                                    $(clonedTable).find("#bnlhr-praticaWfaFormPreview").removeAttr("class");
                                                    $(clonedTable).find("#bnlhr-praticaWfaFormPreview").css("font-size", "0.8em");
                                                    $(clonedTable).find("#bnlhr-listDipendentiPreview tbody tr>td").removeAttr("style");
                                                    $(clonedTable).find("#bnlhr-listDipendentiPreview tbody tr>td").css("padding", "5px 5px 5px 10px");
                                                    $(clonedTable).find("#bnlhr-listDipendentiPreview tbody tr>td").css("border-bottom", "3px solid var(--color-primary)");
                                                    $(clonedTable).find("#bnlhr-listDipendentiPreview tbody tr>td").css("height", "30px");
                                                    $(clonedTable).find("#bnlhr-PrintTitoloDocumento").text(preview ? 'ANTEPRIMA DI STAMPA' : 'DOCUMENTO DEFINITIVO');
                                                    $(clonedTable).find("#dynamicFooter").css("position", "relative");
                                                    $(clonedTable).find("#dynamicFooter").css("top", "664px");
                                                    $(clonedTable).find("#grid-table-pratica-preview thead tr").css("height", "30px").css("background-color", "var(--color-primary)")
                                                        .css("color", "white");
                                                    $(clonedTable).find("#grid-table-pratica-preview thead tr>td").css(" white-space", "normal").css("padding-right", "5px")
                                                        .css("padding-left", "5px");
                                                    $(clonedTable).find("#grid-table-pratica-preview").css("margin-top", "20px").css("width", "100%");

                                                    var progressivo = response.Model.Dto.CodificaProgressivo;
                                                    $(clonedTable).prepend("<span id=\"bnlhr-progressivo-print\" style=\"font-size:10px\">" + progressivo + "</span>");

                                                    const options = {
                                                        margin: 0.5,
                                                        filename: 'PreviewPratica.pdf',
                                                        image: {
                                                            type: 'jpeg',
                                                            quality: 1
                                                        },

                                                        html2canvas: {
                                                            scale: 4
                                                        },

                                                        jsPDF: {
                                                            unit: 'in',
                                                            format: 'a4',
                                                            orientation: 'portrait'
                                                        }
                                                    };
                                                    const element = $(clonedTable)[0];
                                                    if (preview == true) { //anteprima di stampa
                                                        html2pdf(element, options).then(function() {
                                                            $("#loader-printpdf").hide();
                                                        });
                                                    } else { //pubblicazione della stampa nel repository condiviso
                                                        html2pdf().set(options).from(element).outputPdf('datauri').then(function(pdfFile) {
                                                            var praticaId = modelPratica.Model.Dto.Id;
                                                            //var nomeWfa = modelPratica.Model.NomeWfa;

                                                            PublishPdf(praticaId, nomeBeneficiario, progressivo, pdfFile, function(performed) {
                                                                OC.dialogs.info('Pubblicazione del documento effettuata con successo.', 'Info');
                                                            });
                                                            $("#loader-printpdf").hide();
                                                        });
                                                    }
                                                });
                                                //});
                                            });
                                        }, 0);
                                    }, 0);
                                })

                            }
                        }, engineMethod)

                    } else {
                        if (response.Message != null && response.Message.length > 0) {
                            OC.dialogs.info(response.Message, 'Info');
                        } else {
                            OC.dialogs.alert('Errore nel salvataggio della pratica', 'ERRORE');
                        }
                    }
                });
            }
        });

    } else {
        OC.dialogs.alert('Compilare i campi obbligatori', 'AVVISO');
        $("#loader-printpdf").hide();
    }
}

function PublishPdf(praticaId, nomeBeneficiario, codificaProgressivo, path, pdfFile, callback) {
    var performed = false;
    if (pdfFile != null && pdfFile != undefined && pdfFile.length >= 1) {
        var pathBeneficiario = nomeBeneficiario.replace(/[^a-z0-9]/gi, '_') + "_" + codificaProgressivo;
        let date = moment(); //Get the current date
        date = date.format("YYYY-MM-DD"); //2014-07-10;
        var fileName = codificaProgressivo + "_" + date + ".pdf";

        let model = {
            "Model": {
                "Dto": {}
            }
        };
        model.Model.Dto.Path = path + pathBeneficiario + "/";
        model.Model.Dto.FileName = fileName;
        model.Model.Dto.Stream = pdfFile;
        model.Model.Dto.Location = "cloud";

        let url = OC.generateUrl('apps/wfam/publish');
        bnlhrAjaxCallPOST(url, model, function(response) {
            if (response != null) {
                performed = response.Performed;
            }
            if (callback)
                callback(performed, path + pathBeneficiario + "/" + fileName);
        });
    }
}

$(document).on("click", function(e) {
    let elementId = e.currentTarget.activeElement.getAttribute("id");
    if (elementId !== "bnlhr-btnCaricaAllegati" && elementId !== "bnlhr-pupupMenu" &&
        elementId !== "bnlhr-lnkDrive" && elementId !== "bnlhr-lnkLocal") {
        if ($('.popovermenu').is(':visible')) {
            $(".popovermenu").hide();
        }
    }
});

function DocumentUpload(dto, callback, index, dtos = []) {
    let files = $("#file_upload_start");
    if (files != null && files.length >= 1 && files[0].files.length > 0) {
        let fReader = new FileReader();
        fReader.readAsDataURL(files[0].files[index]);
        fReader.onloadend = function(event) {
            var pathBeneficiario = nomeBeneficiario.replace(/[^a-z0-9]/gi, '_') + "_" + dto.CodificaProgressivo;
            let model = {
                "Model": {
                    "Dto": {}
                }
            };
            var path = GetPublishPath(modelPratica);
            model.Model.Dto.Path = path + pathBeneficiario;
            model.Model.Dto.FileName = files[0].files[index].name;
            model.Model.Dto.Stream = event.target.result;
            model.Model.Dto.Location = "local";

            let url = OC.generateUrl('apps/wfam/upload');
            bnlhrAjaxCallPOST(url, model, function(response) {
                if (response.Performed) {
                    index++;
                    ShareFile(response[0].Path + "/" + response[0].FileName, function(response) {
                        if (response && response.ocs.meta.status == "ok")
                            dtos.push({
                                "Id": response.ocs.data.id,
                                "FileName": response.ocs.data.file_target.replace(/\//gi, ""),
                                "Url": response.ocs.data.url
                            });
                        if (index < files[0].files.length) {
                            DocumentUpload(dto, callback, index, dtos);
                        } else {
                            if (callback)
                                callback({
                                    "Dtos": dtos,
                                    "Performed": true
                                });
                        }
                    });
                } else {
                    if (callback)
                        callback({
                            "Dtos": dtos,
                            "Performed": false
                        });
                }

            });
        };

    } else {
        if (callback)
            callback({
                "Dtos": dtos,
                "Performed": true
            });
    }
}

function DocumentUploadDrive(dto, callback, index, dtos = []) {
    let rows = $("tr[data-location=drive]");
    if (rows.length > 0) {
        var pathBeneficiario = nomeBeneficiario.replace(/[^a-z0-9]/gi, '_') + "_" + dto.CodificaProgressivo
        let model = {
            "Model": {
                "Dto": {}
            }
        };
        var path = GetPublishPath(modelPratica);
        model.Model.Dto.Path = path + "/" + pathBeneficiario;
        model.Model.Dto.FileName = rows[index].getAttribute("data-file-path");
        model.Model.Dto.Stream = null;
        model.Model.Dto.Location = "drive";

        let url = OC.generateUrl('apps/wfam/upload');
        bnlhrAjaxCallPOST(url, model, function(response) {
            if (response.Performed) {
                index++;
                ShareFile(response[0].Path + "/" + response[0].FileName, function(response) {
                    if (response)
                        dtos.push({
                            "Id": response.ocs.data.id,
                            "FileName": response.ocs.data.file_target.replace(/\//gi, ""),
                            "Url": response.ocs.data.url
                        });
                    if (index < rows.length) {
                        DocumentUploadDrive(dto, callback, index, dtos);
                    } else {
                        if (callback)
                            callback({
                                "Dtos": dtos,
                                "Performed": true
                            });
                    }
                });
            } else {
                if (callback)
                    callback({
                        "Dtos": dtos,
                        "Performed": false
                    });
            }
        });
    } else {
        if (callback)
            callback({
                "Dtos": dtos,
                "Performed": true
            });
    }
}

function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}

function SetDataRange() {
    $('input[name="Intervallo"]').daterangepicker({
        singleDatePicker: false,
        autoUpdateInput: false,
        timePicker: true,
        timePicker24Hour: true,
        timePickerSeconds: false,
        locale: {
            format: "DD/MM/YYYY H:mm",
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
    })
}

$("#app-pages").on('click', '#bnlhr-btnDelegaPraticaForm', function() {
    ShowConfirmMessage('La pratica sarà delegata ad un altro utente. Continuare?', 'Delega processo', 'notice', OC.dialogs.YES_NO_BUTTONS, function(response) {
        if (response) {
            DeleteRuoloPratica(modelPratica.Model.Dto, function(response) {
                if (response && response.Performed) {
                    $("#bnlhr-btnDelegaPraticaForm").remove();
                    OC.dialogs.info('Delega effettuata.', 'Info');
                } else
                    OC.dialogs.alert('Impossibile delegare il processo.', 'Avviso');
            })
        }

    }, true);
})

$("#app-pages").on('click', '#btnLegenda', function() {
    return $.when(GetTemplate("templateLegenda")).then(function($tmpl) {
        ShowDialogLegenda($tmpl, function(dialogId) {

        });
    })
})