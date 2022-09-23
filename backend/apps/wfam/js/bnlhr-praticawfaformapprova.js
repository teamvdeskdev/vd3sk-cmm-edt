let modelPraticaApprova = null;
var nomeBeneficiario = null;
var dragStartPosition;

function LoadPraticaWFAFormApprova(model, callback) {
    modelPraticaApprova = model;

    if (modelPraticaApprova.Model.Dto.ModificaRichiesta && modelPraticaApprova.Model.Dto.ModificaRichiesta !== null) {
        $("#bnlhr-modifichePraticaWfaForm").show();
        $("#Modificatext").text(modelPraticaApprova.Model.Dto.ModificaRichiesta);
    } else {
        $("#bnlhr-modifichePraticaWfaForm").hide();
    }
    $("#FormTitle").text(modelPraticaApprova.Model.NomeWfa);
    let modelFilterWfa = {
        "Model": {}
    };
    modelFilterWfa.Model.Filter = {};
    modelFilterWfa.Model.Filter.Id = modelPraticaApprova.Model.Dto.WfaId;
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
                //$("#bnlhr-templatepdf").html(dto.Templatepdf);
                $($tmpl).find("#bnlhr-templatepdf #dynamicContent").removeAttr("style");
                $($tmpl).find("#bnlhr-templatepdf #dynamicFooter").css("background", "");
                $($tmpl).find("#bnlhr-templatepdf #dynamicContent").empty();
                $($tmpl).find("#bnlhr-templatepdf #dynamicContent").append(tablePreview);


                SetDialogPraticaPreview($tmpl, function(dialogId) {
                    $(nav).prependTo($(dialogId));
                    $('#bnlhr-printpdfApprova').unbind();
                    $('#bnlhr-printpdfApprova').bind('click', function() {
                        PrintPdfApprova(true);
                    });
                    $("#bnlhr-publishpdfApprova").unbind();
                    $("#bnlhr-publishpdfApprova").bind('click', function() {
                        ShowConfirmMessage('Il processo sarà deliberato. Continuare?', 'Delibera processo', 'notice', OC.dialogs.YES_NO_BUTTONS, function(response) {
                            if (response) {
                                PrintPdfApprova(false, function(performed) {
                                    DeliberaPratica(performed);
                                });
                            }
                        }, true);
                    });
                    BindViewPraticaFormApprova(callback);
                })
            })
        } else {
            $.when(GetTemplate("templatepdfpreview", false, null)).then(function($tmpl, model) {
                SetDialogPraticaPreview($tmpl, function(dialogId) {
                    $('#bnlhr-printpdfApprova').unbind();
                    $('#bnlhr-printpdfApprova').bind('click', function() {
                        PrintPdfApprova(true);
                    });
                    $("#bnlhr-publishpdfApprova").unbind();
                    $("#bnlhr-publishpdfApprova").bind('click', function() {
                        ShowConfirmMessage('Il processo sarà deliberato. Continuare?', 'Delibera processo', 'notice', OC.dialogs.YES_NO_BUTTONS, function(response) {
                            if (response) {
                                PrintPdfApprova(false, function(performed) {
                                    DeliberaPratica(performed);
                                });
                            }
                        }, true);
                    });
                    BindViewPraticaFormApprova(callback);
                })
            })
        }
    })

}

function BindViewPraticaFormApprova(callback) {

    $("#oggettoPreview").text(modelPraticaApprova.Model.NomeWfa);
    if (modelPraticaApprova.Model.DipendenteUid && modelPraticaApprova.Model.DipendenteUid.length > 2) {
        modelUtenti.Model.DtosDipendenti.filter(function(dtoindex) {
            if (dtoindex.Uid == modelPraticaApprova.Model.DipendenteUid) {
                let dto = {};
                dto.Id = 0;
                dto.Uid = modelPraticaApprova.Model.DipendenteUid;
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
        modelFilterDipendente.Model.Filter.Id = modelPraticaApprova.Model.Dto.DipendenteId;
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
    modelFilterElementoWfa.Model.Filter.WfaId = modelPraticaApprova.Model.Dto.WfaId;
    modelFilterElementoWfa.Model.Order = {};
    modelFilterElementoWfa.Model.Order.Name = "Ordine";
    modelFilterElementoWfa.Model.Order.Direction = "asc";
    let urlPraticaWfa = OC.generateUrl('apps/wfam/elementowfa/get');
    bnlhrAjaxCallPOST(urlPraticaWfa, modelFilterElementoWfa, function(response) {
        if (response !== null && response.Model.Performed) {
            if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                this.SetPraticaWFAFormApprova(response.Model.Dtos, function() {
                    this.SetPraticaWFAFormPreview(response.Model.Dtos, function() {
                        if (modelPraticaApprova.Model.Dto.Id > 0) {
                            urlPraticaWfa = OC.generateUrl('apps/wfam/valoreelementowfa/get');
                            let modelFilterValoreElemento = {
                                "Model": {
                                    "Filter": {}
                                }
                            };
                            modelFilterValoreElemento.Model.Filter.PraticaWfaId = modelPraticaApprova.Model.Dto.Id;

                            let urlOrganoDeliberante = OC.generateUrl('apps/wfam/ruolowfa/get');
                            let modelFilterOrganoDeliberante = {
                                "Model": {
                                    "Filter": {}
                                }
                            };
                            modelFilterOrganoDeliberante.Model.Filter.WfaId = modelPraticaApprova.Model.Dto.WfaId;
                            modelFilterOrganoDeliberante.Model.Filter.CodificaRuolo = "A";
                            bnlhrAjaxCallPOST(urlOrganoDeliberante, modelFilterOrganoDeliberante, function(response) {
                                if (response !== null && response.Model.Performed) {
                                    if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                                        this.BindViewOrganoDeliberante(response.Model.Dtos);
                                        HidePageLoader();
                                    }
                                }
                            });

                            bnlhrAjaxCallPOST(urlPraticaWfa, modelFilterValoreElemento, function(response) {
                                if (response !== null && response.Model.Performed) {
                                    if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {

                                        this.BindViewValoreElementoWfaApprova(response.Model.Dtos);
                                        this.BindViewValoreElementoWfaPreview(response.Model.Dtos);
                                        if (callback)
                                            callback();
                                    }
                                }
                            });
                        }
                    });
                });
            }
        }
    });

    BindViewSintesiProcesso(modelPraticaApprova.Model.Dto);

}

function BindViewSintesiProcesso(praticaDto) {

    GetHtmlSintesiProcesso(praticaDto, function(html) {
        $("#sintesi-processo").empty();
        $("#sintesi-processo").append(html);
    });
}

function BindViewOrganoDeliberanteApprovaPreview(dtos) {
    dtos.forEach(function(dto, index) {
        let current = $("RuoloA").text();
        current += dto.CodiceRuolo;
        if (index < dtos.length - 1)
            current += " , "
        $("#RuoloA").text(current);
        $("#OrganoPreview").text(current);

    })
}

function GetTemplateRowOrganoDeliberanteApprovaPreview(dto) {
    let row = "<tr data-elementowfa-id=\"" + dto.Id + "\" >\n" +
        "                <td width=\"200px\" style=\"padding-left:10px;padding-top: 10px;\">Organo deliberante previsto: <span id=\"OrganoPreview\" style=\"font-weight:bold\"></span>\n" +
        "                </td>\n" +
        "            </tr>\n";
    return row;
}

function BindViewValoreElementoWfaApprova(dtos) {
    dtos.forEach(function(dto) {
        if (dto.NomeElemento.toLocaleLowerCase() === "organo deliberante") {
            if (dto.Valore !== null) {
                let id = dto.Valore;
                bnlhrAjaxGetUser(id, function(user) {
                    // modelUtenti.Model.DtosGA.filter(function (dtoindex) {
                    if (user != null) {
                        let nome = user.Nome;
                        let rowOrganoEccezione = GetTemplateRowOrganoEccezione(dto.Id, nome, dto.Valore);
                        $(rowOrganoEccezione).appendTo("#bnlhr-OrganoEccezione tbody");
                        $("#bnlhr-btnAggiungiOrganoEccezione").prop("disabled", true);
                        $("#comboDipendente").prop("disabled", true);
                        $("#row-organoEccezione").show();
                    }
                    ///});
                })

            }
        } else if (dto.NomeElemento.toLocaleLowerCase() == "allegati") {
            $("#row-allegati").attr("data-id", dto.Id);
            if (dto.Valore !== null && dto.Valore.length > 0) {
                $("#rowfiles td").text("Allegati");
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
                    let row = GetTemplateRowFileApprova(dtoFile);
                    $(row).insertAfter("#bnlhr-praticaWfaForm #rowfiles");
                }
            }
        } else if (dto.TipoElemento == "RowsList") {
            wfaTable.BindViewGUI(dto.Valore, true);
        } else {
            let elementoIdWfa = dto.ElementoWfaId;
            $("#bnlhr-praticaWfaForm tbody tr[data-elementowfa-id=" + elementoIdWfa + "]").attr("data-id", dto.Id);
            $("#bnlhr-praticaWfaForm tbody tr[data-elementowfa-id=" + elementoIdWfa + "] input:text").val(dto.Valore);
            $("#bnlhr-praticaWfaForm tbody tr[data-elementowfa-id=" + elementoIdWfa + "] input[type=\"number\"]").val(dto.Valore);
            $("#bnlhr-praticaWfaForm tbody tr[data-elementowfa-id=" + elementoIdWfa + "] textarea").val(dto.Valore);
        }
    })
}

function SetPraticaWFAFormApprova(dtos, callback) {
    $("#bnlhr-praticaWfaForm tbody").empty();
    dtos.forEach(function(dto) {
        if (dto.NomeElemento.toLocaleLowerCase() === "data decorrenza") {
            let row = GetTemplateRowDataDecorrenzaApprova(dto);
            $(row).appendTo("#bnlhr-praticaWfaForm");
        }
        if (dto.TipoElemento.toLocaleLowerCase() === "time range") {
            let row = GetTemplateRowIntervalloApprova(dto);
            $(row).appendTo("#bnlhr-praticaWfaForm");
        }
        if (dto.NomeElemento.toLocaleLowerCase() === "importo") {
            let row = GetTemplateRowImportoApprova(dto);
            $(row).appendTo("#bnlhr-praticaWfaForm");
        }
        if (dto.NomeElemento.toLocaleLowerCase() === "motivazione") {
            let row = GetTemplateRowMotivazioneApprova(dto);
            $(row).appendTo("#bnlhr-praticaWfaForm");
        }
        if (dto.NomeElemento.toLocaleLowerCase() === "organo deliberante") {
            let row = GetTemplateRowOrganoDeliberanteApprova(dto);
            $(row).appendTo("#bnlhr-praticaWfaForm");

        }
        if (dto.NomeElemento.toLocaleLowerCase() === "allegati") {

            $("<tr id='row-allegati' style=\"display:none\"><td style=\"padding-left:10px;height: 50px \">&nbsp;</td></tr>").appendTo("#bnlhr-praticaWfaForm");
            $("<tr id='rowfiles'><td style=\"padding-left:10px;height: 30px \">&nbsp;</td></tr>").appendTo("#bnlhr-praticaWfaForm");

        }
        if (dto.NomeElemento.toLocaleLowerCase() === "note aggiuntive") {
            let row = GetTemplateRowNoteAggiuntiveApprova(dto);
            $(row).appendTo("#bnlhr-praticaWfaForm");
        }
        if (dto.TipoElemento.toLocaleLowerCase() === "email") {
            let row = GetTemplateRowEmail(dto);

            $(row).appendTo("#bnlhr-praticaWfaForm");
            if (!modelPraticaApprova.Model.Authorized)
                $("#bnlhr-tbEmail").attr('readonly', true);
        }
        if (modelPraticaApprova.Model.Authorized && dto.TipoElemento.toLocaleLowerCase() === "pec") {
            let row = GetTemplateRowPEC(dto);
            $(row).prependTo("#bnlhr-tableAzioni");

        }
        if (modelPraticaApprova.Model.Authorized && modelPraticaApprova.Model.Dto.Stato == statoPraticaWfa.DELIBERA && dto.TipoElemento.toLocaleLowerCase() === "firmadigitale") {
            let row = GetTemplateRowFirmaDigitaleApprova(dto);
            $(row).appendTo("#bnlhr-btnAzioni");
        }
        if (dto.TipoElemento.toLocaleLowerCase() === "rowslist") {
            let row = GetTemplateRowsList(dto);
            $(row).appendTo("#bnlhr-praticaWfaForm");
            wfaTable = new WFATable($("#grid-table-pratica"));
            var model = JSON.parse(dto.Rows);
            wfaTable.SetTable(model, true);
        }
    });

    if (modelPraticaApprova.Model.Authorized) {
        $("#bnlhr-btnAzioni").empty();
        let rows = GetTemplateRowsBtnAzioni(modelPraticaApprova.Model.Dto.Stato);
        $(rows).appendTo("#bnlhr-btnAzioni");
    }
    if (modelPraticaApprova.Model.Dto.Stato == statoPraticaWfa.MODIFICA && !WFAGROUPSAUTH.GSUPERADMIN) {
        if (!modelPraticaApprova.Model.RichiestaPersonale)
            $("#bnlhr-btnDelegaPraticaFormApprova").show();
        else if (modelPraticaApprova.Model.RichiestaPersonale && modelPraticaApprova.Model.RuoloFase == WFARUOLO.R) { //&& modelPraticaApprova.Model.Authorized) {
            $("#bnlhr-btnDelegaPraticaFormApprova").remove();
        } else {
            $("#bnlhr-btnDelegaPraticaFormApprova").show();
        }
    } else
        $("#bnlhr-btnDelegaPraticaForm").remove();

    if (!modelPraticaApprova.Model.Authorized || modelPraticaApprova.Model.Dto.Stato != statoPraticaWfa.DELIBERA) {
        $("#bnlhr-publishpdfApprova").parent().remove();
    }
    if (callback)
        callback();
}

function GetTemplateRowFileApprova(dto) {
    let row = "<tr id=\"listFile\" data-id=\"" + dto.Id + "\" data-path=\"" + dto.Nome + "\" data-file-path=\"" + dto.Path + "\" data-location=\"" + dto.Location + "\">\n" +
        "    <td width=\"500\" style='border-bottom: 3px solid var(--color-primary); height: 30px;padding: 5px 5px 5px 10px;' >\n" +
        "       <a href='" + dto.UrlShare + "' target='_blank' class=\"bnlhr-text-pre-wrap\" >" + dto.Nome + "</a>" +
        //"       <span style='position: relative;'>" + dto.Nome + "</span>\n" +
        "    </td>\n" +
        "<td></td>\n" +
        "</tr>\n";
    return row;
}

function GetTemplateRowDipendentePraticaApprova(dto) {
    let row = "<tr id=\"row-" + dto.Id + "\" data-id=\"" + dto.Id + "\">\n" +
        "                <td><span class=\"bnlhr-text-pre-wrap bnlhr-font-weight-bold\">" + dto.NomeDipendente + "</span></td>\n" +
        "                <td><span class=\"bnlhr-text-pre-wrap\">" + dto.Inquadramento + "</span></td>\n" +
        "                <td><span class=\"bnlhr-text-pre-wrap\">" + dto.UO + "</span></td>\n" +
        "                <td><span class=\"bnlhr-text-pre-wrap\">" + dto.Sede + "</span></td>\n" +
        "                <td><span class=\"bnlhr-text-pre-wrap\">" + dto.Mansione + "</span></td>\n" +
        "                <td><span class=\"bnlhr-text-pre-wrap\">" + dto.Contratto + "</span></td>\n" +
        "</tr>";
    return row;
}

function GetTemplateRowDataDecorrenzaApprova(dto) {
    let row = "<tr >\n" +
        "                <td width=\"300px\" style=\"padding-left:10px;\" >Data decorrenza</td>\n" +
        "            </tr>\n" +
        "            <tr id=\"row-" + dto.Id + "\" data-wfa-id=\"" + dto.WfaId + "\" data-elementowfa-id=\"" + dto.Id + "\">\n" +
        "                <td width=\"300px\" style=\"padding-left:10px;padding-bottom: 20px;\" >\n" +
        "                    <input class=\"bnlhr-select\" type=\"text\" id=\"DataDecorrenza\" name=\"DataDecorrenza\"  style=\"width: 300px\" value='20/09/2019' readonly/>\n" +
        "                </td>\n" +
        "            </tr>";
    return row;
}

function GetTemplateRowIntervalloApprova(dto) {
    let row = "<tr >\n" +
        "                <td width=\"300px\" style=\"padding-left:10px;\" >Dal/Al</td>\n" +
        "            </tr>\n" +
        "            <tr id=\"row-" + dto.Id + "\" data-wfa-id=\"" + dto.WfaId + "\" data-elementowfa-id=\"" + dto.Id + "\" data-id=\"" + (dto.ValoreElementoWfaId ? dto.ValoreElementoWfaId : 0) + "\">\n" +
        "                <td width=\"300px\" style=\"padding-left:10px;padding-bottom: 20px;\" >\n" +
        "                    <input class=\"bnlhr-select\" type=\"text\" id=\"Intervallo\" name=\"Intervallo\"  style=\"width: 300px\" autocomplete=\"off\" readonly/>\n" +
        "                </td>\n" +
        "            </tr>";
    return row;
}

function GetTemplateRowImportoApprova(dto) {
    let row = "<tr>\n" +
        "                <td width=\"300px\" style=\"padding-left:10px\">Importo</td>\n" +
        "            </tr>\n" +
        "            <tr id=\"row-" + dto.Id + "\" data-wfa-id=\"" + dto.WfaId + "\" data-elementowfa-id=\"" + dto.Id + "\">\n" +
        "                <td width=\"300px\" style=\"padding-left:10px;padding-bottom: 20px;\">\n" +
        "                    <input class=\"bnlhr-select\" type=\"number\" id=\"Importo\"  style=\"width: 300px\" value=\"" + (dto.Valore ? dto.Valore : "") + "\" readonly/>\n" +
        "                </td>\n" +
        "            </tr>";
    return row;
}

function GetTemplateRowMotivazioneApprova(dto) {
    let row = "<tr>\n" +
        "                <td width=\"500px\" style=\"padding-left:10px\">Motivazione*</td>\n" +
        "            </tr>\n" +
        "            <tr id=\"row-" + dto.Id + "\" data-wfa-id=\"" + dto.WfaId + "\" data-elementowfa-id=\"" + dto.Id + "\">\n" +
        "                <td width=\"500px\" style=\"padding-left:10px;padding-bottom: 20px;\">\n" +
        "                    <textarea class=\"bnlhr-select\" type=\"text\" id=\"Motivazione\"   style=\"width: 500px; height:150px\" readonly>" + (dto.Valore ? dto.Valore : "") + "</textarea>\n" +
        "                </td>\n" +
        "            </tr>";
    return row;
}

function GetTemplateRowOrganoDeliberanteApprova(dto) {
    let row = "<tr>\n" +
        "                <td width=\"200px\" style=\"padding-left:10px;padding-bottom: 20px;\">Organo deliberante preposto: <span id=\"RuoloA\">-</span>\n" +
        "                </td>\n" +
        "            </tr>\n" +
        "             <tr id=\"row-organoEccezione\" data-wfa-id=\"" + dto.WfaId + "\" data-elementowfa-id=\"" + dto.Id + "\" style='display: none'>" +
        "<td style=\"padding-left:10px; \">Organo deliberante con eccezione\n" +
        "                    <select id=\"comboDipendente\" style=\"width: 300px; display:none\" >\n" +
        "                        <option value=\"-1\">Seleziona dipentente</option>\n" +
        "                        <option value=\"4\">Utente1 A</option>\n" +
        "                        <option value=\"5\">Utente2 A</option>\n" +
        "                    </select>\n" +
        "                <table id=\"bnlhr-OrganoEccezione\" class=\"bnlhr-table\" width=\"500\" data-wfa-id=\"" + dto.WfaId + "\"  >\n" +
        "                    <tbody>\n" +
        "                    </tbody>\n" +
        "                </table></td>\n" +
        "            </tr>";
    return row;
}

function GetTemplateRowNoteAggiuntiveApprova(dto) {
    let row = "<tr>\n" +
        "                <td width=\"200px\" style=\"padding-left:10px;  height: 50px;\">Note aggiuntive - non saranno aggiunte nel documento di delibera</td>\n" +
        "            </tr>\n" +
        "            <tr id=\"row-" + dto.Id + "\" data-wfa-id=\"" + dto.WfaId + "\" data-elementowfa-id=\"" + dto.Id + "\">\n" +
        "                <td width=\"200px\" style=\"padding-left:10px;padding-bottom: 20px;\">\n" +
        "                    <textarea class=\"bnlhr-select\" type=\"text\" id=\"NoteAggiuntive\"   style=\"width: 500px; height:150px\" readonly>" + (dto.Valore ? dto.Valore : "") + "</textarea>\n" +
        "                </td>\n" +
        "            </tr>";
    return row;
}

function GetTemplateRowOrganoEccezioneApprova(id, nome) {
    let row = "<tr id=\"UtenteEccezione\" data-utente-id=\"" + id + "\">\n" +
        "    <td width=\"500\" >\n" +
        "       <span >" + nome + "</span>\n" +
        "    </td>\n" +
        " </tr>";
    return row;
}

function GetTemplateRowFirmaDigitaleApprova(dto) {
    let row = "<tr>\n" +
        "                <td width=\"20%\" >\n" +
        "                    <input type=\"button\" id=\"bnlhr-btnFirmaDigitaleFormApprova\" class=\"bnlhr-button-white \" value=\"Firma digitalmente il file\" />\n" +
        "                </td>\n" +
        "            </tr>";
    return row;
}

function GetTemplateRowsBtnAzioni(statoPratica) {
    let row = "";
    if (statoPratica == statoPraticaWfa.APPROVAZIONE) {
        row = "<tr>\n" +
            "                <td width=\"20%\" >\n" +
            "                    <input type=\"button\" id=\"bnlhr-btnApprovaPraticaFormApprova\" class=\"bnlhr-button \" value=\"APPROVA\" />\n" +
            "                </td>\n" +
            "                <td width=\"5%\"></td>\n" +
            "                <td width=\"20%\">\n" +
            "                    <input type=\"button\" id=\"bnlhr-btnModificaPraticaFormApprova\" class=\"bnlhr-button-white \" value=\"RICHIEDI MODIFICA\" />\n" +
            "                </td>\n" +
            "            </tr>";
    } else if (statoPratica == statoPraticaWfa.DELIBERA) {
        row = "<tr>\n" +
            "                <td width=\"20%\" >\n" +
            "                    <input type=\"button\" id=\"bnlhr-btnDeliberaPraticaFormApprova\" class=\"bnlhr-button \" value=\"APPROVA IN DELIBERA\" />\n" +
            "                </td>\n" +
            "                <td width=\"5%\"></td>\n" +
            "                <td width=\"20%\">\n" +
            "                    <input type=\"button\" id=\"bnlhr-btnModificaPraticaFormApprova\" class=\"bnlhr-button-white \" value=\"RICHIEDI MODIFICA\" />\n" +
            "                </td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td width=\"20%\">\n" +
            "                    <input type=\"button\" id=\"bnlhr-btnRifiutaPraticaFormApprova\" class=\"bnlhr-button\" value=\"RIFIUTA IN DELIBERA\" />\n" +
            "                </td>\n" +
            "                <td width=\"5%\"></td>\n" +
            "                <td width=\"20%\">\n" +
            "                    <input type=\"button\" id=\"bnlhr-btnIndietroPraticaFormApprova\" class=\"bnlhr-button-white \" value=\"INDIETRO\" />\n" +
            "                </td>\n" +
            "            </tr>";
    }
    return row;
}

$("#app-pages").on('click', '#bnlhr-btnModificaPraticaFormApprova', function(event) {
    ShowPageLoader();
    EnableControlsFormPraticaApprova(false);
    let valid = ($("#Modifica").val().trim().length > 0);
    if (valid) {
        modelPraticaApprova.Model.Dto.Stato = statoPraticaWfa.MODIFICA;
        SalvaPraticaWfaApprova(modelPraticaApprova.Model.Dto, function(response) {
            let stato = false;
            SetAuthWorkflow(modelPraticaApprova, stato, function(performed, codificaRuolo) {
                if (performed) {
                    SalvaRuoloPraticaWorkflow(modelPraticaApprova.Model.Dto, codificaRuolo, modelPraticaApprova.Model.GruppiFase, function() {
                        SendMailNotification(modelPraticaApprova, function() {
                            var emails = $("#bnlhr-tbEmail").val();
                            if (emails != null && emails.length > 0) {
                                var mailsArray = emails.split(";")
                                SendMail(modelPratica, mailsArray);
                            }
                            UpdateProcessiInCorso();
                            navigation.Clear();
                            let url = OC.generateUrl("/apps/wfam/cruscotto");
                            if (viewType == VIEWTYPE.NONE)
                                viewType = VIEWTYPE.INCORSO;
                            var breadcrumbtitle = GetTitle();
                            navigation.GoTo(breadcrumbtitle, url, {
                                "Performed": true
                            }, function() {
                                HidePageLoader();
                                LoadCruscotto();
                                UnbindEvent();
                            });
                        });
                    })
                }
            })

        });
    } else {
        HidePageLoader();
        EnableControlsFormPraticaApprova(true);
        OC.dialogs.alert('Inserisci le modifiche da effettuare', 'AVVISO');
    }
    event.preventDefault();
});

$("#app-pages").on('click', '#bnlhr-btnApprovaPraticaFormApprova', function(event) {
    ShowPageLoader();
    EnableControlsFormPraticaApprova(false);
    GetAuth(modelPraticaApprova, function(response) {
        if (response != null && response.Model != null && response.Model.Authorized) {
            var stato = true;
            SetAuthWorkflow(modelPraticaApprova, stato, function(performed, codiceRuolo) {
                if (performed) {
                    GetCodificaRuolo(modelPraticaApprova.Model.Dto.WfaId, modelPraticaApprova.Model.Dto.Id, function(codificaRuolo) {
                        if (codificaRuolo) {
                            if (codificaRuolo != WFARUOLO.C)
                                modelPraticaApprova.Model.Dto.Stato = statoPraticaWfa.DELIBERA;
                            SalvaPraticaWfaApprova(modelPraticaApprova.Model.Dto, function(response) {
                                SalvaRuoloPraticaWorkflow(modelPraticaApprova.Model.Dto, codiceRuolo, modelPraticaApprova.Model.GruppiFase, function() {
                                    SendMailNotification(modelPraticaApprova, function() {
                                        var emails = $("#bnlhr-tbEmail").val();
                                        if (emails != null && emails.length > 0) {
                                            var mailsArray = emails.split(";")
                                            SendMail(modelPratica, mailsArray);
                                        }
                                        UpdateProcessiInCorso();
                                        navigation.Clear();
                                        let url = OC.generateUrl("/apps/wfam/cruscotto");
                                        if (viewType == VIEWTYPE.NONE)
                                            viewType = VIEWTYPE.INCORSO;
                                        var breadcrumbtitle = GetTitle();
                                        navigation.GoTo(breadcrumbtitle, url, {
                                            "Performed": true
                                        }, function() {
                                            HidePageLoader();
                                            LoadCruscotto();
                                            UnbindEvent();
                                        });
                                    });
                                });
                            });
                        }
                    });
                }
            })
        }
    })
    event.preventDefault();
});

$("#app-pages").on('click', '#bnlhr-btnDeliberaPraticaFormApprova', function(event) {
    //EnableControlsFormPraticaApprova(false);
    ShowPageLoader();

    GetAuth(modelPraticaApprova, function(response) {
        ShowAnteprima(true);
        // DeliberaPratica(response);
    }, "next")
    event.preventDefault();
});

$("#app-pages").on('click', '#bnlhr-btnRifiutaPraticaFormApprova', function(event) {
    ShowConfirmMessage('Il processo sarà deliberato con esito rifiutato. Continuare?', 'Delibera processo', 'notice', OC.dialogs.YES_NO_BUTTONS, function(response) {
        if (response) {
            ShowPageLoader();
            let valid = true;
            EnableControlsFormPraticaApprova(false);
            if (valid) {
                modelPraticaApprova.Model.Dto.Stato = statoPraticaWfa.RIFIUTATO;
                let date = moment(); //Get the current date
                date = date.format("YYYY-MM-DD"); //2014-07-10;
                modelPraticaApprova.Model.Dto.DataDelibera = date;
                SalvaPraticaWfaApprova(modelPraticaApprova.Model.Dto, function(response) {
                    let stato = false;
                    SetAuthWorkflow(modelPraticaApprova, stato, function(performed, codificaRuolo) {
                        if (performed) {
                            SalvaRuoloPraticaWorkflow(modelPraticaApprova.Model.Dto, codificaRuolo, modelPraticaApprova.Model.GruppiFase, function() {
                                SendMailNotification(modelPraticaApprova, function() {
                                    var emails = $("#bnlhr-tbEmail").val();
                                    if (emails != null && emails.length > 0) {
                                        var mailsArray = emails.split(";")
                                        SendMail(modelPratica, mailsArray);
                                    }
                                    var model = { "Model": { "Filter": {} } };
                                    model.Model.Filter.Status = GetFasiUtente(VIEWTYPE.INCORSO);
                                    CountPraticheUtente(model, VIEWTYPE.INCORSO, function(response) {
                                        if (response && response.Performed)
                                            $("#lblCountPraticheInCorsoMenu").text(response.Count);
                                        else
                                            $("#lblCountPraticheInCorsoMenu").text(0);
                                    })
                                    navigation.Clear();
                                    let url = OC.generateUrl("/apps/wfam/cruscotto");
                                    if (viewType == VIEWTYPE.NONE)
                                        viewType = VIEWTYPE.INCORSO;
                                    var breadcrumbtitle = GetTitle();
                                    navigation.GoTo(breadcrumbtitle, url, {
                                        "Performed": true
                                    }, function() {
                                        HidePageLoader();
                                        LoadCruscotto();
                                        UnbindEvent();
                                    });
                                });
                            })
                        }
                    }, 'endworkflow')
                });
            } else {
                HidePageLoader();
                EnableControlsFormPraticaApprova(true);
                OC.dialogs.alert('Inserisci motivazioni del rifiuto', 'AVVISO');
            }
        }
    }, true);

    event.preventDefault();
});

$("#app-pages").on('click', '#bnlhr-btnIndietroPraticaFormApprova', function(event) {
    EnableControlsFormPraticaApprova(false);
    navigation.Clear();
    let url = OC.generateUrl("/apps/wfam/cruscotto");
    if (viewType == VIEWTYPE.NONE)
        viewType = VIEWTYPE.INCORSO;
    var breadcrumbtitle = GetTitle();
    navigation.GoTo(breadcrumbtitle, url, {
        "Performed": true
    }, function() {
        LoadCruscotto();
        UnbindEvent();

    });
    event.preventDefault();
});

function DeliberaPratica(performed) {
    //if (responseAuthorization != null && responseAuthorization.Model != null && responseAuthorization.Model.Authorized)
    if (performed) {
        modelPraticaApprova.Model.Dto.Stato = statoPraticaWfa.COMPLETATA;
        var pdf = null
        if (IsJsonString(modelPraticaApprova.Model.Dto.Pdf)) {
            var dtoFile = JSON.parse(modelPraticaApprova.Model.Dto.Pdf);
            var pdf = dtoFile.Path;
        }
        if (pdf != null && pdf != "null" && pdf.length > 0) {
            ShareFile(pdf, function(response) {
                if (response && response.ocs.meta.status == "ok") {
                    if (IsJsonString(modelPraticaApprova.Model.Dto.Pdf)) {
                        var dtoFile = JSON.parse(modelPraticaApprova.Model.Dto.Pdf);
                        if (dtoFile) {
                            dtoFile.UrlShare = response.ocs.data.url;
                            modelPraticaApprova.Model.Dto.Pdf = JSON.stringify(dtoFile);
                        }
                    }
                }
                let date = moment(); //Get the current date
                date = date.format("YYYY-MM-DD"); //2014-07-10;
                modelPraticaApprova.Model.Dto.DataDelibera = date;
                SalvaPraticaWfaApprova(modelPraticaApprova.Model.Dto, function(response) {
                    let stato = true;
                    var method = (modelPraticaApprova.Model.Dto.Stato == statoPraticaWfa.COMPLETATA ? 'endworkflow' : 'setauthorization');
                    SetAuthWorkflow(modelPraticaApprova, stato, function(performed, codificaRuolo) {
                        if (performed) {
                            SalvaRuoloPraticaWorkflow(modelPraticaApprova.Model.Dto, codificaRuolo, modelPraticaApprova.Model.GruppiFase, function() {
                                SendMailNotification(modelPraticaApprova, function() {
                                    var emails = $("#bnlhr-tbEmail").val();
                                    if (emails != null && emails.length > 0) {
                                        var mailsArray = emails.split(";")
                                        SendMail(modelPratica, mailsArray);
                                    }
                                    ShareUtenteR(response.Model.Dto.Id, pdf, function(response) {
                                        var model = {
                                            "Model": {
                                                "Filter": {}
                                            }
                                        };
                                        model.Model.Filter.Status = GetFasiUtente(VIEWTYPE.INCORSO);
                                        CountPraticheUtente(model, VIEWTYPE.INCORSO, function(response) {
                                            if (response && response.Performed)
                                                $("#lblCountPraticheInCorsoMenu").text(response.Count);
                                            else
                                                $("#lblCountPraticheInCorsoMenu").text(0);
                                        })
                                        navigation.Clear();
                                        let url = OC.generateUrl("/apps/wfam/cruscotto");
                                        if (viewType == VIEWTYPE.NONE)
                                            viewType = VIEWTYPE.INCORSO;
                                        var breadcrumbtitle = GetTitle();
                                        navigation.GoTo(breadcrumbtitle, url, {
                                            "Performed": true
                                        }, function() {
                                            HidePageLoader();
                                            var obj = (modelPraticaApprova.Model.Dto.Pdf ? JSON.parse(modelPraticaApprova.Model.Dto.Pdf) : null);
                                            if (obj) {
                                                OC.dialogs.info('Delibera completata, il file è stato pubblicato in ' + obj.Path + '', 'Delibera processo');
                                            } else {
                                                OC.dialogs.info('La delibera sel processo è stata completata', 'Delibera processo');

                                            }
                                            LoadCruscotto();
                                            UnbindEvent();
                                        });
                                    });

                                });
                            })
                        }
                    }, method)

                });
            });
        } else {
            EnableControlsFormPraticaApprova(true);
            HidePageLoader();
            OC.dialogs.info('Prima di deliberare la pratica è necessario generare il documento.', 'Info');
        }
    } else {
        OC.dialogs.info('Pubblicazione non riuscita.', 'Info');
    }
}

function SalvaPraticaWfaApprova(dto, callback) {
    let model = {
        "Model": {}
    };
    model.Model.Dto = {};
    model.Model.Dto.Id = dto.Id;
    model.Model.Dto.Stato = dto.Stato;
    model.Model.Dto.Pdf = dto.Pdf;
    model.Model.Dto.ModificaRichiesta = ($("#Modifica").val());
    model.Model.Dto.DataDelibera = dto.DataDelibera;
    let urlPraticaWfa = OC.generateUrl('apps/wfam/praticawfa/createorupdate');
    bnlhrAjaxCallPOST(urlPraticaWfa, model, function(response) {
        if (response !== null && response.Model.Performed) {
            if (response.Model.Dto !== null) {
                if (callback)
                    callback(response);
            }
        }
    });
}


function SalvaRuoloPraticaWorkflow(dto, codiceRuolo, gruppiFase, callback) {
    var filter = {
        "WfaId": dto.WfaId,
        "UtenteId": codiceRuolo
    };
    GetRuoloWfa(filter, function(response) {
        if (response && response.Model && response.Model.Performed && response.Model.Dtos != null && response.Model.Dtos.length > 0) {
            var ruoloWfaId = response.Model.Dtos[0].Id;
            filter = {
                "PraticaWfaId": dto.Id,
                "RuoloWfaId": ruoloWfaId
            };
            GetRuoloPraticaWfa(filter, function(response) {
                if (response && response.Model && response.Model.Performed) {
                    var ruoloPraticaWfaId = 0;
                    if (response.Model.Dtos != null && response.Model.Dtos.length > 0) {
                        ruoloPraticaWfaId = response.Model.Dtos[0].Id;
                    }
                    let model = {
                        "Model": {}
                    };
                    model.Model.Dto = {};
                    model.Model.Dto.Id = ruoloPraticaWfaId;
                    model.Model.Dto.RuoloWfaId = ruoloWfaId;
                    model.Model.Dto.PraticaWfaId = dto.Id;
                    model.Model.Dto.UtenteId = currentUser.Model.Dto.Id;
                    model.Model.Dto.NomeUtente = currentUser.Model.Dto.Nome;
                    var groups = "";
                    for (var gruppo of gruppiFase) {
                        if (currentUser.Model.Dto.Groups.includes(gruppo))
                            groups += gruppo + ", ";
                    }
                    if (groups.substring(groups.length - 2, groups.length - 1) == ",")
                        groups = groups.substring(0, groups.length - 2);

                    model.Model.Dto.Groups = groups;

                    if (dto.Stato == statoPraticaWfa.MODIFICA)
                        model.Model.Dto.Stato = dto.Stato;
                    else
                        model.Model.Dto.Stato = null;
                    let url = OC.generateUrl('apps/wfam/ruolopraticawfa/createorupdate');
                    bnlhrAjaxCallPOST(url, model, function(response) {
                        if (response !== null && response.Model !== null) {
                            if (callback)
                                callback(response.Model.Performed);
                        }
                    })
                }
            })

        }
    })
}

$("#app-pages").on('click', '#bnlhr-btnFirmaDigitaleFormApprova', function() {
    if (modelPraticaApprova.Model.Dto.Pdf != null) {
        return $.when(GetTemplate("templatefirmadigitale")).then(function($tmpl) {
            ShowDialogFirmaDigitale(modelPraticaApprova, $tmpl);
        })
    } else
        OC.dialogs.info('Prima di firmare il file è necessario generare il documento.', 'Info');
})

function UnbindEvent() {
    $("#bnlhr-btnModificaPraticaFormApprova").unbind("click");
    $("#bnlhr-btnApprovaPraticaFormApprova").unbind("click");
    $("#bnlhr-btnDeliberaPraticaFormApprova").unbind("click");
    $("#bnlhr-btnRifiutaPraticaFormApprova").unbind("click");
    $("#bnlhr-btnIndietroPraticaFormApprova").unbind("click");
}

function EnableControlsFormPraticaApprova(enable) {
    $("#bnlhr-btnModificaPraticaFormApprova").prop("disabled", !enable);
    $("#bnlhr-btnApprovaPraticaFormApprova").prop("disabled", !enable);
    $("#bnlhr-btnDeliberaPraticaFormApprova").prop("disabled", !enable);
    $("#bnlhr-btnRifiutaPraticaFormApprova").prop("disabled", !enable);
    $("#bnlhr-btnIndietroPraticaFormApprova").prop("disabled", !enable);
}

$("#app-pages").on('click', '#bnlhr-showAnteprima', function() {
    ShowAnteprima(false);
});

function ShowAnteprima(delibera) {
    var dialogName = "dlgAnteprimaPratica";
    var dialogId = '#' + dialogName;
    var dlg = $(".oc-dialog-dim");
    if (dlg.length <= 0) {
        var buttonlist = [{
            text: 'Chiudi',
            // classes: 'signbuttoncancel custom-btn cutstom-btn-grigio ',
            click: function() {
                $(dialogId).parent().hide();
                $(".oc-dialog-dim").hide()
            },
            defaultButton: true
        }];
        $(dialogId).ocdialog({
            width: 'auto',
            height: '100%',
            modal: true,
            buttons: buttonlist,
            style: {
                buttons: 'aside',
            }
        });
        $(".oc-dialog-close").remove();
        if (delibera) {
            $("#bnlhr-printpdfApprova").parent().hide();
            $("#bnlhr-publishpdfApprova").parent().show();
            $(".oc-dialog-title").text("Delibera");
            $("#dlgAnteprimaSubTitle").text('Per deliberare il processo è necessario generare il documento. clicca su "Genera documento" per continuare.');
        } else {
            $("#bnlhr-printpdfApprova").parent().show();
            $("#bnlhr-publishpdfApprova").parent().hide();
            $("#dlgAnteprimaSubTitle").text("");
        }
        $(dialogId).show();
    } else {
        $(dialogId).parent().show();
        $(".oc-dialog-dim").show()
        if (delibera) {
            $("#bnlhr-printpdfApprova").parent().hide();
            $("#bnlhr-publishpdfApprova").parent().show();
            $(".oc-dialog-title").text("Delibera");
            $("#dlgAnteprimaSubTitle").text('Per deliberare il processo è necessario generare il documento. clicca su "Genera documento" per continuare.');
        } else {
            $("#bnlhr-printpdfApprova").parent().show();
            $("#bnlhr-publishpdfApprova").parent().hide();
            $("#dlgAnteprimaSubTitle").text("");
        }
    }
    HidePageLoader();
}

function PrintPdfApprova(preview, callback = null) {

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

    var progressivo = modelPraticaApprova.Model.Dto.CodificaProgressivo;
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
        $("#loader-printpdfApprova").show();
        html2pdf(element, options).then(function() {
            $("#loader-printpdfApprova").hide();
        });
    } else { //pubblicazione della stampa nel repository condiviso
        return $.when(GetTemplate("templateFileSystem")).then(function($tmpl) {
            var pathBeneficiario = nomeBeneficiario + "_PID" + modelPraticaApprova.Model.Dto.Id;
            var fileName = pathBeneficiario + ".pdf";
            options.filename = fileName;
            GeneraFilePdf(options, element, function(performed, pathPdf) {
                if (performed) {
                    modelPraticaApprova.Model.Dto.Pdf = JSON.stringify({
                        "Path": pathPdf,
                        "UrlShare": null
                    });
                    let urlPraticaWfa = OC.generateUrl('apps/wfam/praticawfa/createorupdate');
                    bnlhrAjaxCallPOST(urlPraticaWfa, modelPraticaApprova, function(response) {
                        if (response !== null && response.Model !== null && response.Model.Performed) {
                            modelPraticaApprova.Model.Dto.Pdf = response.Model.Dto.Pdf;
                            // $(dialogId).ocdialog('close');
                            // OC.dialogs.info('Pubblicazione documento avvenuta con successo.', 'Info');
                            if (callback)
                                callback(true);
                        } else {
                            //   OC.dialogs.info('Pubblicazione non riuscita.', 'Info');
                            if (callback)
                                callback(false);
                        }
                        //HidePageLoader();
                    });
                } else {
                    HidePageLoader();
                    OC.dialogs.info('Pubblicazione non riuscita.', 'Info');
                    if (callback)
                        callback(false);

                }
            });
        });
    }
}

function GeneraFilePdf(options, element, callback) {
    ShowPageLoader();
    var praticaId = modelPraticaApprova.Model.Dto.Id;
    var codificaProgressivo = modelPraticaApprova.Model.Dto.CodificaProgressivo
    var path = GetPublishPath(modelPraticaApprova); //$("#tbPath").val();
    //if (path.length > 1) path += "/";
    if (path != null && path.length >= 1) {
        html2pdf().set(options).from(element).outputPdf('datauristring').then(function(pdfFile) {
            PublishPdf(praticaId, nomeBeneficiario, codificaProgressivo, path, pdfFile, function(performed, pathPdf) {
                if (callback)
                    callback(performed, pathPdf);
            });
        });
    } else {
        HidePageLoader();
        OC.dialogs.info('Selezionare una cartella.', 'Info');
    }
}


//############# WORKFLOW PREVIEW

// $("#app-pages").on('click', '#workflowPreview', function() {
//     ShowPageLoader();
//     GetWorkflowPreview(modelPraticaApprova);
// });

// function ShowWorkflowEngineTags(model) {
//     try {
//         function setNoTags(block) {
//             block.attr('tagElement/class', 'hideElement');
//         }

//         function setRunningTag(block) {
//             block.attr('tagElement/d', 'm6.94 0.5c-0.24 0-0.44 0.2-0.44 0.44v1.26c-0.5 0.14-1.05 0.35-1.53 0.65l-0.91-0.91c-0.16-0.18-0.46-0.19-0.62 0l-1.5 1.5c-0.18 0.17-0.18 0.46 0 0.62l0.91 0.91c-0.284 0.48-0.5 1-0.65 1.53h-1.26c-0.24 0-0.44 0.2-0.44 0.44v2.12c0 0.25 0.19 0.44 0.44 0.44h1.26c0.14 0.54 0.36 1.05 0.65 1.53l-0.91 0.91c-0.18 0.17-0.18 0.45 0 0.62l1.5 1.5c0.18 0.18 0.46 0.18 0.62 0l0.91-0.91c0.48 0.285 1 0.5 1.53 0.65v1.26c0 0.25 0.2 0.44 0.44 0.44h2.12c0.24 0 0.45-0.2 0.44-0.44v-1.26c0.54-0.14 1.05-0.36 1.53-0.65l0.91 0.91c0.17 0.18 0.45 0.18 0.62 0l1.5-1.5c0.18-0.17 0.18-0.45 0-0.62l-0.91-0.91c0.29-0.48 0.5-1 0.65-1.53h1.26c0.24 0 0.45-0.2 0.44-0.44v-2.12c0-0.24-0.2-0.44-0.44-0.44h-1.26c-0.14-0.54-0.36-1.05-0.65-1.53l0.91-0.91c0.18-0.17 0.18-0.45 0-0.62l-1.5-1.5c-0.17-0.18-0.45-0.18-0.62 0l-0.91 0.91c-0.48-0.29-1-0.5-1.53-0.65v-1.26c0-0.24-0.2-0.44-0.44-0.44h-2.12zm1.06 4a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1 -3.5 3.5 3.5 3.5 0 0 1 -3.5 -3.5 3.5 3.5 0 0 1 3.5 -3.5z');
//             block.attr('tagElement/transform', 'scale(1.4) translate(93,-5)');
//             block.attr('tagElement/transform-origin', '8px 8px');
//             block.attr('tagElement/title', 'In Esecuzione...');
//             block.attr('tagElement/fill', 'darkorange');
//             block.attr('tagElement/id', 'running' + block.attr('root/id'));
//             block.attr('tagElement/stroke', 'grey');
//             block.attr('tagElement/strokeWidth', '1');
//             block.attr('tagElement/class', 'rotateElement');
//         }

//         function setApprovedTag(block) {
//             block.attr('tagElement/d', 'M49.844,68.325c-1.416,0-2.748-0.554-3.75-1.557L27.523,48.191c-1.003-1.002-1.555-2.334-1.555-3.75 s0.552-2.749,1.555-3.75c1.001-1.001,2.333-1.552,3.75-1.552s2.75,0.551,3.753,1.553l14.019,14.017L82.14,5.504 c0.989-1.468,2.639-2.345,4.412-2.345c1.054,0,2.075,0.312,2.956,0.902c2.424,1.631,3.07,4.934,1.439,7.361L54.25,65.98 c-0.892,1.316-2.312,2.162-3.895,2.314C50.17,68.315,50.01,68.325,49.844,68.325z');
//             block.attr('tagElement/transform', 'scale(.3) translate(390,-45)');
//             block.attr('tagElement/title', '');
//             block.attr('tagElement/fill', 'green');
//             block.attr('tagElement/id', 'tagElement');
//             block.attr('tagElement/stroke', '#333');
//             block.attr('tagElement/strokeWidth', '1');
//             block.attr('tagElement/class', '');
//         }
//         if (model) {
//             let blocks = model.getElements();
//             if (blocks && blocks.length > 0) {
//                 blocks.forEach(function(block) {
//                     let blockType = block.attributes.type;
//                     if (block && blockType != 'standard.Polygon') {
//                         let startDate = block.attr('root/startDate');
//                         let endDate = block.attr('root/endDate');
//                         //check state and apply tags
//                         if (startDate || endDate) {
//                             //it's started...
//                             if (startDate && !endDate) {
//                                 setRunningTag(block);
//                             }
//                             //It's ended
//                             else if (startDate && endDate) {
//                                 //Check current/clear status                            
//                                 setApprovedTag(block);
//                             }
//                             //only endDate
//                             else if (!startDate || endDate) {
//                                 setNoTags(block);
//                             }
//                         } else {
//                             setNoTags(block);
//                         }
//                     }
//                 })
//             }
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }

// function getWfPreviewTemplate() {
//     var defer = $.Deferred();
//     if (!this.$messageTemplate) {
//         var self = this;
//         $.get(OC.filePath('wfam', 'templates/content', 'wfpreview.html'), function(tmpl) {
//                 self.$messageTemplate = $(tmpl);
//                 defer.resolve(self.$messageTemplate);
//             })
//             .fail(function(jqXHR, textStatus, errorThrown) {
//                 defer.reject(jqXHR.status, errorThrown);
//             });
//     } else {
//         defer.resolve(this.$messageTemplate);
//     }
//     return defer.promise();
// };

// function ShowWfPreview(model) {
//     if (model.Model && model.Model.Dto.WorkflowModel) {
//         let workflowModel = model.Model.Dto.WorkflowModel;
//         if (workflowModel) {
//             return $.when(getWfPreviewTemplate()).then(function($tmpl) {
//                 var dialogName = 'previewform';
//                 var dialogId = '#' + dialogName;
//                 var $dlg = $tmpl.octemplate({
//                     dialog_name: dialogName,
//                     title: 'Workflow Preview'
//                 });
//                 //append body
//                 $('body').append($dlg);

//                 //Create Temp Paper
//                 graph = new dia.Graph;
//                 paper = new joint.dia.Paper({
//                     el: $('#previewPaper'),
//                     width: 'auto !important',
//                     height: 'auto !important',
//                     interactive: false,
//                     model: graph,
//                     gridSize: 1,
//                     drawGrid: false,
//                     perpendicularLinks: true,
//                     defaultLink: new devs.Link({
//                         attrs: {
//                             '.marker-target': {
//                                 d: 'M 8 0 L 0 4 L 8 8 z'
//                             }
//                         }
//                     })
//                 });
//                 paper.on('blank:pointerdown', function(event, x, y) {
//                     dragStartPosition = {
//                         x: x,
//                         y: y
//                     };
//                 });

//                 paper.on('cell:pointerup blank:pointerup', function(cellView, x, y) {
//                     dragStartPosition = null;
//                 });
//                 //show Modal dialog
//                 $(dialogId).ocdialog({
//                     width: '65%',
//                     height: 'inherit',
//                     modal: true,
//                     close: function() {}
//                 });
//                 //load paper data
//                 if (paper) {
//                     $("#previewPaper").mousemove(function(event) {
//                         if (dragStartPosition)
//                             paper.translate(
//                                 event.offsetX - dragStartPosition.x,
//                                 event.offsetY - dragStartPosition.y);

//                     });
//                     paper.model.fromJSON(JSON.parse(workflowModel));
//                     //paint wf state
//                     ShowWorkflowEngineTags(paper.model);
//                     HidePageLoader();
//                 } else {
//                     OC.dialogs.alert('Errore caricamento Paper.', 'Error');
//                 }
//             });
//         }
//     } else {
//         OC.dialogs.alert('Impossibile caricare i dati del workflow.', 'Errore');
//     }
// }

// function GetWorkflowPreview(praticaModel) {
//     GetAuth(modelPraticaApprova, function(response) {
//         if (response && response.Model && response.Model.AuthorizedView) {
//             let model = {
//                 "Model": {
//                     "Filter": {}
//                 }
//             };
//             model.Model.Filter.AppId = "wfam";
//             model.Model.Filter.WorkflowId = praticaModel.Model.Dto.WfaId;
//             model.Model.Filter.Id = null;
//             model.Model.Filter.OwnerId = praticaModel.Model.Dto.Id;
//             url = OC.generateUrl('apps/workflowmanager/api/readengine');
//             bnlhrAjaxCallPOST(url, model, function(response) {
//                 if (response !== null && response.Model.Performed) {
//                     ShowWfPreview(response);
//                 }
//             });
//         }
//     })
// }

$("#app-pages").on('click', '#bnlhr-btnDelegaPraticaFormApprova', function() {
    ShowConfirmMessage('La pratica sarà delegata ad un altro utente. Continuare?', 'Delega processo', 'notice', OC.dialogs.YES_NO_BUTTONS, function(response) {
        if (response) {
            DeleteRuoloPratica(modelPraticaApprova.Model.Dto, function(response) {
                if (response && response.Performed) {
                    $("#bnlhr-btnDelegaPraticaFormApprova").remove();
                    OC.dialogs.info('Processo delegato.', 'Info');
                } else
                    OC.dialogs.alert('Impossibile delegare il processo.', 'Avviso');
            })
        }

    }, true);
})