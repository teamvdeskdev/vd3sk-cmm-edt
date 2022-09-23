const WFARUOLO = {
    R: 'R',
    C: 'C',
    A: 'A',
    D: 'D',
}

const WFAGROUPSAUTH = {
    GR: false,
    GC: false,
    GA: false,
    GD: false,
    GADMIN: false,
    GSUPERADMIN: false
}

const WFAFILESYSTEMTYPE = {
    ALLEGATI: 'Allegati',
    DELIBERA: 'Delibera',
}

const VIEWTYPE = {
    NONE: 'NONE',
    RICHIESTE: 'RICHIESTE',
    INCORSO: 'INCORSO',
    DELIBERATE: 'DELIBERATE'
}

let modelUtenti = {
    "Model": {
        "DtosGR": [],
        "DtosGC": [],
        "DtosGA": [],
        "DtosDipendenti": []
    }
};
let currentUser = {
    "Model": {
        "Dto": {}
    }
};
var viewType = VIEWTYPE.NONE;
bnlhrAjaxGetCurrentUser(currentUser, function(response) {
    currentUser = response;
    if (currentUser) {
        let url = new URL(window.location.href);
        var pid = url.searchParams.get("pid");
        EnableMenu(function() {
            if (pid != null) {
                DirectLinkPraticaWfa(pid);
            } else {
                if (WFAGROUPSAUTH.GD || WFAGROUPSAUTH.GADMIN) {
                    navigation.BreadcrumbAdd("WFA", "/apps/wfam/", null, 0);
                    let url = OC.generateUrl("/apps/wfam/gestione_wfa");
                    navigation.GoTo("Gestione WFA", url, {}, function() {
                        LoadWfa();
                    });
                } else if (WFAGROUPSAUTH.GR || WFAGROUPSAUTH.GC || WFAGROUPSAUTH.GA || WFAGROUPSAUTH.GSUPERADMIN) {
                    let url = OC.generateUrl("apps/wfam/cruscotto");
                    navigation.BreadcrumbAdd("WFA", "/apps/wfam/", null, 0);
                    if (WFAGROUPSAUTH.GR) {
                        viewType = VIEWTYPE.RICHIESTE;
                    } else {
                        viewType = VIEWTYPE.INCORSO;
                    }
                    var breadcrumbtitle = GetTitle();
                    navigation.GoTo(breadcrumbtitle, url, {}, function() {
                        if (WFAGROUPSAUTH.GR) {
                            LoadCruscotto();
                        } else {
                            LoadCruscotto();
                        }
                    });
                } else {
                    OC.dialogs.alert('L’utente non ha accesso a questa funzionalità di Drive. Contattare l’amministratore di sistema.', 'AVVISO')
                }
            }
        });

    }
});

function ShowDialogFile($template, type, action) { //type=Allegati/Delibera
    try {

        var dialogName = "dlgFileSystem";
        var dialogId = '#' + dialogName;
        var $dlg = $template.octemplate({
            dialog_name: dialogName
        });
        if (type && type == "Delibera") {
            var buttonlist = [{
                    text: 'Genera file',
                    classes: 'bnlhr-dialogbutton',
                    click: function(e) {
                        if (action) {
                            action(dialogId);
                        }
                    }
                },
                {
                    text: 'Chiudi',
                    classes: 'bnlhr-dialogbutton-white ',
                    click: function() {
                        $(dialogId).ocdialog('close');
                    },
                    defaultButton: true
                }
            ];
        } else {
            var buttonlist = [{
                    text: 'Conferma',
                    classes: 'bnlhr-dialogbutton',
                    click: function(e) {
                        if (action) {
                            var targetPath = $("#tbPath").val();
                            if (targetPath && targetPath.length >= 1)
                                action(dialogId, targetPath);
                            else {
                                OC.dialogs.info('Selezionare una cartella di destinazione.', 'Info');

                            }
                        }
                    }
                },
                {
                    text: 'Chiudi',
                    classes: 'bnlhr-dialogbutton-white ',
                    click: function() {
                        $(dialogId).ocdialog('close');
                    },
                    defaultButton: true
                }
            ];
        }
        $('.app-wfam').append($dlg);
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

        $("#bnlhr-directory").bind("click", function() {
            OC.dialogs.filepicker(t('wfam', 'Scelta cartella di destinazione'), function(targetPath, type) {
                $("#tbPath").val(targetPath);
            }, false, "httpd/unix-directory", true);
        });


    } catch (error) {}
}

function GetTemplate(templateName, html, params) {
    var defer = $.Deferred();
    if (templateName != null) {
        var self = this;
        $.get(OC.filePath('wfam', 'templates/content', templateName + '.html'), function(tmpl) {
                if (!html)
                    defer.resolve($(tmpl, params));
                else
                    defer.resolve(tmpl, params);

            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                defer.reject(jqXHR.status, errorThrown);
            });
    } else {
        defer.resolve(null);
    }
    return defer.promise();
}

function ShowDialogFirmaDigitale(model, $template, action) {
    try {

        var form_title = 'Seleziona il tipo di firma';
        var dialogName = "dlgFirmaDigitale";
        var dialogId = '#' + dialogName;
        var $dlg = $template.octemplate({
            dialog_name: dialogName,
            title: form_title,

        });
        $('.app-wfam').append($dlg);
        var buttonlist = [{
            text: 'Chiudi',
            // classes: 'signbuttoncancel custom-btn cutstom-btn-grigio ',
            click: function() {
                $(dialogId).ocdialog('close');
            },
            defaultButton: true
        }];
        AddEventMenuDigitalSign(model);
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

    } catch (error) {

    }
}

function AddEventMenuDigitalSign(model) {
    $("#btnPades").bind("click", function(e) {
        DigitalSignPades(model);
    })

    $("#btnCades").bind("click", function(e) {
        DigitalSignCades(model);
    })
}

function DigitalSignPades(model) {
    var path = model.Model.Dto.Pdf;
    var fileName = path.substring(path.lastIndexOf('/') + 1);
    var targetPath = path.replace("/" + fileName, '')
    var context = null;
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: OC.generateUrl('apps/digitalpa_aruba/currentUser'),
        dataType: 'json',
        success: function(data) {
            SignDialogsPades.showsignWizard(fileName, targetPath, context, data['name'], data['sign_user']);
        }
    });
}

function DigitalSignCades(model) {

    var path = model.Model.Dto.Pdf;
    var fileName = path.substring(path.lastIndexOf('/') + 1);
    var targetPath = path.replace("/" + fileName, '')
    var context = null;
    var mimetype = "application/pdf";
    var iconurl = OC.MimeType.getIconUrl(mimetype);
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: OC.generateUrl('apps/digitalpa_aruba/currentUser'),
        dataType: 'json',
        success: function(data) {
            SignDialogs.showsignWizard(fileName, data['name'], targetPath, context, DigitalpaUtil.CADES, iconurl, data['sign_user']);
        }
    });
}

function ShowDialogPec($template, action) {
    try {
        var appmailurl = OC.generateUrl("/apps/mail");
        ExistPage(appmailurl, function(exist) {
            if (exist) {
                var appmailurl = OC.generateUrl("/apps/mail");

                var dialogName = "dlgPec";
                var dialogId = '#' + dialogName;
                var $dlg = $template.octemplate({
                    dialog_name: dialogName,
                    title: "",
                    appmailurl: appmailurl
                });
                var buttonlist = [];
                $('.app-wfam').append($dlg);
                SetStyle();
                $(dialogId).ocdialog({
                    width: '90%',
                    height: 500,
                    modal: true,
                    buttons: buttonlist,
                    style: {
                        buttons: 'aside',
                    },
                    close: function() {}
                });
            } else {
                OC.dialogs.info("Questa funzionalità richiede l'insallazione dell'app Mail.", 'Info');
            }
        })
    } catch (error) {}
}

function SetStyle() {

    var ifrm = document.getElementById('ifrmPec');
    $("#ifrmPec").load(function() {
        var doc = ifrm.contentDocument ? ifrm.contentDocument : ifrm.contentWindow.document;
        var header = doc.getElementsByTagName('header');
        var templateHeader = '<h1 style="font-size: 2em;padding: 15px;font-weight: bold;color: white;">Invio Pec</h1>';
        $(header).empty();
        $(header).css("border-radius", "10px");
        $(header).css("width", "98%");
        $(header).html(templateHeader);
        $(ifrm).show();
    })
}

function ExistPage(url, callback) {
    $.ajax({
        url: url,
        type: 'GEt',
        contentType: 'application/json',

    }).done(function(htmlString) {
        var exist = false;
        html = document.createElement('html'),
            frag = document.createDocumentFragment();
        html.innerHTML = htmlString;
        frag.appendChild(html);
        var titleText = frag.firstChild.getElementsByTagName('title')[0].textContent || frag.firstChild.getElementsByTagName('title')[0].innerText;
        exist = (titleText.trim() != "Files - Nextcloud")
        if (callback)
            callback(exist);
    }).fail(function(response, code) {
        if (callback)
            callback(false);
    });
}

function SendMailNotification(model, callback) {
    if (model != null) {
        GetMailsNotificheRuoloWfa(model, function(response) {
            if (response != null && response.Performed && response.Dtos != null && response.Dtos.length > 0) {
                SendMail(model, response.Dtos);
                if (callback)
                    callback();
                return;
            } else {
                if (callback)
                    callback();
                return;
            }
        })
    } else {
        if (callback)
            callback();
        return;
    }
}

function SendPec(model, callback) {
    let url = OC.generateUrl('apps/workflowmanager/api/sendmail');
    bnlhrAjaxCallPOST(url, model, function(response) {
        if (callback)
            callback(response);
    });
}

function SendMail(model, users) {
    if (model != null && users != null) {
        $.when(GetTemplate("templateNotificaEmail", true, model)).then(function($tmpl, model) {
            var template = $tmpl;
            if (template != null) {
                var utente = currentUser.Model.Dto.Nome;
                var beneficiario = nomeBeneficiario;
                var fase = GetFase(model.Model.Dto.Stato);
                var processo = (model.Model.NomeWfa ? model.Model.NomeWfa : model.Model.Dto.NomeWfa);
                var getUrl = window.location;
                var baseUrl = getUrl.protocol + "//" + getUrl.host + getUrl.pathname;
                var link = baseUrl + '?pid=' + model.Model.Dto.Id;
                template = template.replace("{DISPLAYNAME}", utente).replace("{DIPENDENTE}", beneficiario)
                    .replace("{FASE}", fase).replace("{PROCESSO}", processo).replace("{REDIRECTLINK}", link).replace("{REDIRECTLINK}", link)
                    .replace("src=\"\"", "src=\"" + baseUrl + "\img/header_email.jpg\"");

                var templateNotifica = "{DISPLAYNAME} ha concluso la fase di {FASE} del processo {PROCESSO} a uso di {DIPENDENTE}.";
                templateNotifica = templateNotifica.replace("{DISPLAYNAME}", utente).replace("{DIPENDENTE}", beneficiario)
                    .replace("{FASE}", fase).replace("{PROCESSO}", processo);

                var modelNotifica = {
                    "Model": {}
                };
                modelNotifica.Model.Dto = users;
                modelNotifica.Model.Subject = "WFA: informazione processo " + processo;
                modelNotifica.Model.Body = template;
                modelNotifica.Model.BodyNotifica = templateNotifica;
                modelNotifica.Model.Type = "Email";
                modelNotifica.Model.PID = model.Model.Dto.Id;
                let url = OC.generateUrl('apps/workflowmanager/api/sendmail');
                bnlhrAjaxCallPOST(url, modelNotifica);
            }
        })

    }
}

function BindViewModelPec(dialogId) {
    var emails = $("#tbTo").val().split(';');
    var subject = $("#tbSubject").val();
    var body = $("#txtBody").val();

    var model = {
        "Model": {}
    };
    model.Model.To = emails;
    model.Model.Subject = subject;
    model.Model.Body = body;
    model.Model.Type = "pec";
    return model;
}

function GetFase(stato) {
    var fase = "Richiesta";
    if (stato == statoPraticaWfa.DELIBERA) //|| stato == statoPraticaWfa.APPROVAZIONE)
        fase = "Consulenza";
    else if (stato == statoPraticaWfa.COMPLETATA) {
        fase = "Delibera";
    } else if (stato == statoPraticaWfa.MODIFICA) {
        fase = "Delibera(Modifica)";
    } else if (stato == statoPraticaWfa.RIFIUTATO) {
        fase = "Delibera(Rifiutato)";
    }
    return fase;
}


function GetRuoloPraticaWFA(dto, codificaRuolo, callback) {
    let modelFilter = {
        "Model": {
            "Filter": {}
        }
    };
    modelFilter.Model.Filter.WfaId = dto.WfaId;
    let url = OC.generateUrl('apps/wfam/ruolowfa/get');
    bnlhrAjaxCallPOST(url, modelFilter, function(response) {
        if (response != null && response.Model != null && response.Model.Performed) {
            var dtos = response.Model.Dtos;
            if (dtos != null) {
                var utentiCodifica = [];
                dtos.forEach(function(dto, index) {
                    if (dto.CodificaRuolo == codificaRuolo)
                        utentiCodifica.push(dto);
                })
                var modelFilter = {
                    "Model": {}
                };
                modelFilter.Model.Filter = {};
                modelFilter.Model.Filter.PraticaWfaId = dto.Id;
                let url = OC.generateUrl('apps/wfam/ruolopraticawfa/get');
                bnlhrAjaxCallPOST(url, modelFilter, function(response) {
                    if (response != null && response.Model != null && response.Model.Performed) {
                        if (response.Model.Dtos != null) {
                            var trovato = false;
                            for (var utenteCodifica of utentiCodifica) {
                                var ruoloPraticaWfa = response.Model.Dtos.find(q => q.RuoloWfaId == utenteCodifica.Id);
                                if (ruoloPraticaWfa == null) {
                                    trovato = true;
                                    var ruoloWfaId = utenteCodifica.Id;
                                    if (callback) {
                                        callback(ruoloWfaId, null);
                                        break;
                                    }
                                }
                            }
                            if (!trovato) {
                                var ruoloPraticaWfa = response.Model.Dtos.find(q => q.UtenteId == currentUser.Model.Dto.Id);
                                if (callback) {
                                    callback(ruoloPraticaWfa.RuoloWfaId, ruoloPraticaWfa);
                                    return;
                                }
                            }
                        }
                    } else {
                        if (callback)
                            callback(null);
                    }
                })


            }
        }
    })

}

function DirectLinkPraticaWfa(pid) {

    let url = OC.generateUrl('apps/wfam/praticawfa/read');
    let model = {
        "Model": {
            "Filter": {}
        }
    };
    model.Model.Filter.Id = pid;
    bnlhrAjaxCallPOST(url, model, function(response) {
        if (response !== null && response.Model != null && response.Model.Performed) {
            if (response.Model.Dto !== null) {
                var praticaModel = {
                    "Model": {
                        "Dto": {}
                    }
                };
                praticaModel.Model.Dto.CodificaProgressivo = response.Model.Dto.CodificaProgressivo;
                praticaModel.Model.Dto.DataRichiesta = response.Model.Dto.DataRichiesta;
                praticaModel.Model.Dto.DipendenteId = response.Model.Dto.DipendenteId;
                praticaModel.Model.Dto.Id = response.Model.Dto.Id;
                praticaModel.Model.Dto.ModificaRichiesta = response.Model.Dto.ModificaRichiesta;
                praticaModel.Model.Dto.Pdf = response.Model.Dto.Pdf;
                praticaModel.Model.Dto.Stato = response.Model.Dto.Stato;
                praticaModel.Model.Dto.WfaId = response.Model.Dto.WfaId;

                praticaModel.Model.NomeWfa = response.Model.Dto.NomeWfa;
                praticaModel.Model.RuoloFase = response.Model.Dto.CodiceRuolo;
                praticaModel.Model.RichiestaPersonale = response.Model.Dto.RichiestaPersonale;
                praticaModel.Model.NomeCategoria = response.Model.Dto.NomeCategoria;
                var groups = [];
                for (var gruppo of response.Model.Dto.Groups) {
                    groups.push(gruppo.GroupName);
                }
                praticaModel.Model.GruppiFase = groups;
                GetAuth(response, function(response) {
                    if (response.Model.Performed) {
                        praticaModel.Model.Authorized = response.Model.Authorized;
                        praticaModel.Model.AuthorizedView = response.Model.AuthorizedView;
                        if (response.Model.Authorized && praticaModel.Model.AuthorizedView) {
                            if (praticaModel.Model.Dto.Stato == statoPraticaWfa.BOZZA || praticaModel.Model.Dto.Stato == statoPraticaWfa.MODIFICA) {
                                navigation.BreadcrumbAdd("WFA", "/apps/wfam/", null, 0);
                                let url = OC.generateUrl("/apps/wfam/pratica_wfa_form");
                                navigation.GoTo(praticaModel.Model.NomeWfa, url, praticaModel, function(response) {
                                    LoadPraticaWFAForm(response);
                                });
                            } else if (praticaModel.Model.Dto.Stato == statoPraticaWfa.APPROVAZIONE || praticaModel.Model.Dto.Stato == statoPraticaWfa.DELIBERA) {
                                navigation.BreadcrumbAdd("WFA", "/apps/wfam/", null, 0);
                                let url = OC.generateUrl("/apps/wfam/pratica_wfa_formapprova");
                                navigation.GoTo(praticaModel.Model.NomeWfa, url, praticaModel, function(response) {
                                    LoadPraticaWFAFormApprova(response);
                                });
                            }
                        } else if (!response.Model.Authorized && praticaModel.Model.AuthorizedView && praticaModel.Model.Dto.Stato !== statoPraticaWfa.BOZZA) {
                            navigation.BreadcrumbAdd("WFA", "/apps/wfam/", null, 0);
                            let url = OC.generateUrl("/apps/wfam/pratica_wfa_formapprova");
                            navigation.GoTo(praticaModel.Model.NomeWfa, url, praticaModel, function(response) {
                                LoadPraticaWFAFormApprova(response);
                            });
                        } else {
                            url = OC.generateUrl("/apps/wfam/cruscotto");
                            navigation.Clear();
                            var breadcrumbtitle = GetTitle();
                            navigation.GoTo(breadcrumbtitle, url, model, function(model) {
                                LoadCruscotto();
                                if (praticaModel.Model.Dto.Stato !== statoPraticaWfa.BOZZA) {
                                    OC.dialogs.info('Pratica già presa in carico.', 'Info');
                                }
                            });
                        }

                    } else {
                        let url = OC.generateUrl("apps/wfam/");
                        location.replace(url);
                    }

                });
            } else {

                OC.dialogs.alert("Qualcosa non ha funzionato correttamente, contattare l'amministratore di sistema", 'Avviso');
            }
        } else {

            OC.dialogs.alert("Qualcosa non ha funzionato correttamente, contattare l'amministratore di sistema", 'Avviso');
        }
    })

}

function SetAuthWorkflow(modelPratica, stato, callback, method = 'setauthorization') {
    GetCodiceRuolo(modelPratica.Model.Dto.WfaId, modelPratica.Model.Dto.Id, function(codiceRuolo) {
        if (codiceRuolo != null) {
            let model = {
                "Model": {
                    "Filter": {}
                }
            };
            model.Model.Filter.AppId = "wfam";
            model.Model.Filter.WorkflowId = modelPratica.Model.Dto.WfaId;
            model.Model.Filter.Id = codiceRuolo;
            model.Model.Filter.OwnerId = modelPratica.Model.Dto.Id;
            model.Model.Filter.Stato = stato;
            model.Model.Filter.Bozza = (modelPratica.Bozza != null ? modelPratica.Bozza : false);
            url = OC.generateUrl('apps/workflowmanager/api/' + method);
            bnlhrAjaxCallPOST(url, model, function(response) {
                if (response !== null) {
                    if (callback)
                        callback(response.Model.Performed, codiceRuolo);
                }
            });
        } else {
            if (callback)
                callback(false, codiceRuolo);
        }
    })
}

function GetAuth(praticaModel, callback, method = 'getauthorization') {
    modelFilter = {
        "Model": {}
    }
    if (WFAGROUPSAUTH.GSUPERADMIN) {
        modelFilter.Model.AuthorizedView = true;
        modelFilter.Model.Authorized = false;
        modelFilter.Model.Performed = true;
        if (callback)
            callback(modelFilter);
        return;
    } else {
        modelFilter.Model.Filter = {};
        modelFilter.Model.Filter.PraticaWfaId = praticaModel.Model.Dto.Id;
        modelFilter.Model.Filter.UtenteId = currentUser.Model.Dto.Id;
        let url = OC.generateUrl('apps/wfam/ruolopraticawfa/get');
        bnlhrAjaxCallPOST(url, modelFilter, function(response) {
            if (response != null && response.Model != null && response.Model.Performed && response.Model.Dtos != null && response.Model.Dtos.length > 0) {
                var dto = response.Model.Dtos[0];
                GetAuthorizzationPratica(praticaModel, dto.CodiceRuolo, method, function(response) {
                    response.Model.AuthorizedView = true;
                    if (callback)
                        callback(response);
                    return;
                })
            } else {
                GetCodiceRuolo(praticaModel.Model.Dto.WfaId, praticaModel.Model.Dto.Id, function(codiceRuolo) {
                    if (codiceRuolo) {
                        filter = {
                            "WfaId": praticaModel.Model.Dto.WfaId
                        }
                        GetGroupsAuthorization(currentUser.Model.Dto.Groups, filter, function(response) {
                            if (response != null && response.Model != null && response.Model.Performed && response.Model.Dtos != null && response.Model.Dtos.length > 0) {
                                var count = 0;
                                var counter = response.Model.Dtos.length;
                                for (var dto of response.Model.Dtos) {
                                    GetAuthorizzationPratica(praticaModel, dto.UtenteId, method, function(response) {
                                        response.Model.AuthorizedView = true;
                                        if (response.Model.Authorized) {
                                            if (callback)
                                                callback(response);
                                            return;
                                        }
                                        if (count >= counter - 1) {
                                            if (callback)
                                                callback(response);
                                            return;
                                        }
                                        count++;

                                    })
                                }
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
                        })
                    }
                })
            }
        })
    }
}

function EnableMenu(callback) {
    var userGroups = currentUser.Model.Dto.Groups;
    if (userGroups != null && userGroups.length > 0) {
        GetGroupsAuthorization(userGroups, null, function(response) {
            if (response != null && response.Model.Performed && response.Model.Dtos != null && response.Model.Dtos.length > 0) {
                var codificaRuoloR = response.Model.Dtos.find(x => x.CodificaRuolo == WFARUOLO.R);
                var codificaRuoloC = response.Model.Dtos.find(x => x.CodificaRuolo == WFARUOLO.C);
                var codificaRuoloA = response.Model.Dtos.find(x => x.CodificaRuolo == WFARUOLO.A);
                WFAGROUPSAUTH.GR = (codificaRuoloR != null);
                WFAGROUPSAUTH.GC = (codificaRuoloC != null);
                WFAGROUPSAUTH.GA = (codificaRuoloA != null);

                if (codificaRuoloR) {
                    $("#app-navigation").on('click', '#bnlhr-lnkCruscottoMenu', function() {
                        navigation.Clear();
                        let url = OC.generateUrl("/apps/wfam/cruscotto");
                        viewType = VIEWTYPE.RICHIESTE;
                        var breadcrumbtitle = GetTitle();
                        navigation.GoTo(breadcrumbtitle, url, {}, function() {
                            LoadCruscotto();
                        });
                    });
                    $("#app-navigation").on('click', '#bnlhr-lnkAvviaWFAMenu', function() {
                        navigation.Clear();
                        let url = OC.generateUrl("/apps/wfam/apps_wfa");
                        navigation.GoTo("Le mie app", url, {}, function() {
                            var apps = new AppsWfa();
                            apps.PageLoad();
                        });
                    });
                    $('#bnlhr-lnkAvviaWFAMenu').removeClass("link-disabled");
                    $('#bnlhr-lnkCruscottoMenu').removeClass("link-disabled");
                }
                if (codificaRuoloC || codificaRuoloA) {
                    $("#app-navigation").on('click', '#bnlhr-lnkInCorsoMenu', function() {
                        navigation.Clear();
                        let url = OC.generateUrl("/apps/wfam/cruscotto");
                        viewType = VIEWTYPE.INCORSO;
                        var breadcrumbtitle = GetTitle();
                        navigation.GoTo(breadcrumbtitle, url, {}, function() {
                            LoadCruscotto();
                        });
                    });
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
                    $('#bnlhr-lnkInCorsoMenu').removeClass("link-disabled");
                }
                if (codificaRuoloR || codificaRuoloC || codificaRuoloA) {
                    $("#app-navigation").on('click', '#bnlhr-lnkDeliberatiMenu', function() {
                        navigation.Clear();
                        let url = OC.generateUrl("/apps/wfam/cruscotto");
                        viewType = VIEWTYPE.DELIBERATE;
                        var breadcrumbtitle = GetTitle();
                        navigation.GoTo(breadcrumbtitle, url, {}, function() {
                            LoadCruscotto();
                        });
                    });
                    $('#bnlhr-lnkDeliberatiMenu').removeClass("link-disabled");
                }
                GetDesignerGroup(function(response) {
                    if (response != null && response.Performed) {
                        var codificaRuoloAdmin = userGroups.find(x => x == 'admin');
                        WFAGROUPSAUTH.GADMIN = (codificaRuoloAdmin != null);

                        var codificaRuoloD = userGroups.find(x => x == response.Dto.designer_group);
                        WFAGROUPSAUTH.GD = (codificaRuoloD != null);
                        if (codificaRuoloD || WFAGROUPSAUTH.GADMIN) {
                            $("#app-navigation").on('click', '#bnlhr-lnkGestioneWFAMenu', function() {
                                if (timerId) {
                                    clearInterval(timerId);
                                };
                                navigation.Clear();
                                let url = OC.generateUrl("/apps/wfam/gestione_wfa");
                                navigation.GoTo("Gestione WFA", url, {}, function() {
                                    LoadWfa();
                                });
                            });
                            $('#bnlhr-lnkGestioneWFAMenu').removeClass("link-disabled");
                            $('#bnlhr-lnkGestioneWFAMenu').show();
                        } else {
                            if (response.Message != null)
                                OC.dialogs.alert(response.Message, 'Avviso');
                            $('#bnlhr-lnkGestioneWFAMenu').remove();
                        }
                    } else {
                        if (response.Message != null)
                            OC.dialogs.alert(response.Message, 'Avviso');
                    }

                    if (callback)
                        callback();
                })

            } else {
                GetSuperAdminGroup(function(response) {
                    if (response != null && response.Performed && response.Dto != null && response.Dto.super_admin_group != null && response.Dto.super_admin_group.length > 0) {
                        var codificaRuoloAdmin = userGroups.find(x => x == response.Dto.super_admin_group);
                        WFAGROUPSAUTH.GSUPERADMIN = (codificaRuoloAdmin != null);

                        if (WFAGROUPSAUTH.GSUPERADMIN) {
                            $("#app-navigation").on('click', '#bnlhr-lnkInCorsoMenu', function() {
                                navigation.Clear();
                                let url = OC.generateUrl("/apps/wfam/cruscotto");
                                viewType = VIEWTYPE.INCORSO;
                                var breadcrumbtitle = GetTitle();
                                navigation.GoTo(breadcrumbtitle, url, {}, function() {
                                    LoadCruscotto();
                                });
                            });
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

                            $("#app-navigation").on('click', '#bnlhr-lnkDeliberatiMenu', function() {
                                navigation.Clear();
                                let url = OC.generateUrl("/apps/wfam/cruscotto");
                                viewType = VIEWTYPE.DELIBERATE;
                                var breadcrumbtitle = GetTitle();
                                navigation.GoTo(breadcrumbtitle, url, {}, function() {
                                    LoadCruscotto();
                                });
                            });
                            $('#bnlhr-lnkDeliberatiMenu').removeClass("link-disabled");
                            $('#bnlhr-lnkInCorsoMenu').removeClass("link-disabled");
                        }
                    }
                    GetDesignerGroup(function(response) {
                        if (response != null && response.Performed) {
                            var codificaRuoloAdmin = userGroups.find(x => x == 'admin');
                            WFAGROUPSAUTH.GADMIN = (codificaRuoloAdmin != null);

                            var codificaRuoloD = userGroups.find(x => x == response.Dto.designer_group);
                            WFAGROUPSAUTH.GD = (codificaRuoloD != null);
                            if (codificaRuoloD || WFAGROUPSAUTH.GADMIN) {
                                $("#app-navigation").on('click', '#bnlhr-lnkGestioneWFAMenu', function() {
                                    if (timerId) {
                                        clearInterval(timerId);
                                    };
                                    navigation.Clear();
                                    let url = OC.generateUrl("/apps/wfam/gestione_wfa");
                                    navigation.GoTo("Gestione WFA", url, {}, function() {
                                        LoadWfa();
                                    });
                                });
                                $('#bnlhr-lnkGestioneWFAMenu').removeClass("link-disabled");
                                $('#bnlhr-lnkGestioneWFAMenu').show();
                            } else {
                                if (response.Message != null)
                                    OC.dialogs.alert(response.Message, 'Avviso');
                                $('#bnlhr-lnkGestioneWFAMenu').remove();
                            }
                        } else {
                            if (response.Message != null)
                                OC.dialogs.alert(response.Message, 'Avviso');
                        }

                        if (callback)
                            callback();
                    })


                })
            }
        })
    } else {
        if (callback)
            callback();
    }
}

function GetAuthorizzationPratica(praticaModel, codificaRuolo, method, callback) {
    let model = {
        "Model": {
            "Filter": {}
        }
    };
    model.Model.Filter.AppId = "wfam";
    model.Model.Filter.WorkflowId = praticaModel.Model.Dto.WfaId;
    model.Model.Filter.Id = codificaRuolo;
    model.Model.Filter.OwnerId = praticaModel.Model.Dto.Id;
    url = OC.generateUrl('apps/workflowmanager/api/' + method);
    bnlhrAjaxCallPOST(url, model, function(response) {
        if (response !== null) {
            if (callback)
                callback(response);
            return;
        } else {
            if (callback)
                callback(null);
        }
    });
    return;
}

function ToolTips(control, text) {
    control.tooltip({
        placement: 'right',
        trigger: 'manual',
        title: text
    });

    control.mouseover(function() {
        control.tooltip('show')
    }).mouseleave(function() {
        control.tooltip('hide')
    });
}

function SetDialogPraticaPreview($template, action) {
    try {

        var form_title = 'Anteprima';
        var dialogName = "dlgAnteprimaPratica";
        var dialogId = '#' + dialogName;
        var $dlg = $template.octemplate({
            dialog_name: dialogName,
            title: form_title,

        });
        $('.app-wfam').append($dlg);


        if (action)
            action(dialogId);
    } catch (error) {
        var errore = error;
    }
}

function GetPublishPath(model) {
    var nomeWfa = (model.Model.NomeWfa ? model.Model.NomeWfa : model.Model.Dto.NomeWfa);
    var categoria = model.Model.NomeCategoria;
    var path = "/WFA/" + categoria.toUpperCase().replace(/[^a-z0-9]/gi, '_') + "/" + nomeWfa.toUpperCase().replace(/[^a-z0-9]/gi, '_') + "/" + nomeBeneficiario.replace(/[^a-z0-9]/gi, '_') + "/";
    return path
}

function ShareFile(file, callback) {
    var datajson = {
        "path": file,
        "shareType": 3,
        "permissions": 1
    }
    let url = '/ocs/v2.php/apps/files_sharing/api/v1/shares?format=json';
    bnlhrAjaxCallPOST(url, datajson, function(response) {
        if (callback)
            callback(response);
    })
}

function ShareUtenteR(praticaId, file, callback = null) {
    var model = {
        "Model": {}
    };
    model.Model.Filter = {};
    model.Model.Filter.CodificaRuolo = WFARUOLO.R;
    model.Model.Filter.PraticaWfaId = praticaId;
    let url = OC.generateUrl('apps/wfam/ruolopraticawfa/get');
    bnlhrAjaxCallPOST(url, model, function(response) {
        if (response != null && response.Model != null && response.Model.Performed) {
            if (response.Model.Dtos != null && response.Model.Dtos.length > 0) {
                var utenteId = response.Model.Dtos[0].UtenteId;
                var model = {
                    "Model": {
                        "Dto": {
                            "UtenteId": utenteId,
                            "Path": file
                        }
                    }
                };
                let url = OC.generateUrl('apps/wfam/publish');
                bnlhrAjaxCallPOST(url, model, function(response) {
                    if (callback)
                        callback(response);
                })
            }
        }
    })
}

function ShowConfirmMessage(content, title, dialogType, buttons, callback, modal, allowHtml) {
    return $.when(OCdialogs._getMessageTemplate()).then(function($tmpl) {
            var dialogName = 'oc-dialog-' + OCdialogs.dialogsCounter + '-content';
            var dialogId = '#' + dialogName;
            var $dlg = $tmpl.octemplate({
                dialog_name: dialogName,
                title: title,
                message: content,
                type: dialogType
            }, allowHtml ? {
                escapeFunction: ''
            } : {});
            if (modal === undefined) {
                modal = false;
            }
            $('body').append($dlg);
            var buttonlist = [];
            switch (buttons) {
                case OC.dialogs.YES_NO_BUTTONS:
                    buttonlist = [{
                            text: t('core', 'No'),
                            click: function() {
                                if (callback !== undefined) {
                                    callback(false);
                                }
                                $(dialogId).ocdialog('close');
                            }
                        },
                        {
                            text: t('core', 'Si'),
                            click: function() {
                                if (callback !== undefined) {
                                    callback(true);
                                }
                                $(dialogId).ocdialog('close');
                            },
                            defaultButton: true
                        }
                    ];
                    break;
                case OCdialogs.OK_BUTTON:
                    var functionToCall = function() {
                        $(dialogId).ocdialog('close');
                        if (callback !== undefined) {
                            callback();
                        }
                    };
                    buttonlist[0] = {
                        text: t('core', 'OK'),
                        click: functionToCall,
                        defaultButton: true
                    };
                    break;
            }

            $(dialogId).ocdialog({
                closeOnEscape: true,
                modal: modal,
                buttons: buttonlist
            });
            OCdialogs.dialogsCounter++;
        })
        .fail(function(status, error) {
            if (status === 0) {
                alert(title + ': ' + content);
            } else {
                alert(t('core', 'Error loading message template: {error}', {
                    error: error
                }));
            }
        });
}

function GetTitle() {
    if (viewType == VIEWTYPE.RICHIESTE)
        return "Le mie richieste";
    else if (viewType == VIEWTYPE.INCORSO)
        return "Processi in corso";
    else if (viewType == VIEWTYPE.DELIBERATE)
        return "Processi deliberati";
    else
        return "WFA in corso";
}

function IsJsonString(str) {
    try {
        var result = JSON.parse(str);
        if (result == null)
            return false;
    } catch (e) {
        return false;
    }
    return true;
}

function GetHtmlSintesiProcesso(praticaDto, callback) {
    GetCodiceRuolo(praticaDto.WfaId, praticaDto.Id, function(codice) {
        codice = (praticaDto.Stato == statoPraticaWfa.RIFIUTATO ? WFARUOLO.A : codice);
        GetSintesiProcesso(praticaDto.WfaId, praticaDto.Id, function(response) {
            if (response != null && response.Model != null && response.Model.Performed) {
                var dtos = response.Model.Dtos;
                if (dtos.length > 0) {
                    var html = "<ul>";

                    //ruoloR
                    var ruoloR = dtos.find(x => x.CodiceRuolo == WFARUOLO.R);
                    if (ruoloR)
                        html += "<li>" + SetItemsintesiProcesso(ruoloR, codice, praticaDto.Stato) + "</li>";

                    //ruoloC                
                    var codificheC = [];
                    dtos.filter(function(dto) {
                        if (dto.CodificaRuolo == WFARUOLO.C)
                            codificheC.push(dto.CodiceRuolo);
                        return dto;
                    });
                    if (codificheC.length > 0) {
                        codificheC.sort();
                        codificheC.forEach(function(codifica, index) {
                            var ruolo = dtos.find(x => x.CodiceRuolo == codifica);
                            if (ruolo)
                                html += "<li>" + SetItemsintesiProcesso(ruolo, codice, praticaDto.Stato) + "</li>";
                        })
                    }

                    //ruoloA
                    var ruoloA = dtos.find(x => x.CodiceRuolo == WFARUOLO.A);
                    if (ruoloA)
                        html += "<li>" + SetItemsintesiProcesso(ruoloA, codice, praticaDto.Stato) + "</li>";

                    html += "</ul>";

                    callback(html);
                } else
                    callback("");
            } else
                callback("");
        })
    })
}

function SetItemsintesiProcesso(ruolo, codice, statoPratica) {
    var item = "";
    var cssBold = "";
    if (ruolo) {
        if (statoPratica == statoPraticaWfa.RIFIUTATO && ruolo.CodiceRuolo == WFARUOLO.A) {
            item += "<span class='item-circle color-red '>";
            item += "</span>";
            item += "<span class='text-position '>" + ruolo.NomeUtente + "</span><br>";
            for (var group of ruolo.Groups) {
                item += "<span class='subtext-position'>" + group + "</span>";
            }

        } else {
            if (ruolo.NomeUtente) {
                var cssClass = (ruolo.Stato && ruolo.Stato == statoPraticaWfa.MODIFICA ? "color-yellow" : "color-green");
                if (ruolo.CodiceRuolo == codice && statoPratica != statoPraticaWfa.COMPLETATA) {
                    cssBold = "font-weight-bold";
                    item += "<span class='item-circle2 " + cssClass + " '>";
                    item += "<span class='item-subcircle'></span>";
                    item += "</span>";
                } else {
                    item += "<span class='item-circle " + cssClass + " '>";
                    item += "</span>";
                }
                item += "<span class='text-position " + cssBold + " '>" + ruolo.NomeUtente + "</span><br>";
            } else {
                if (ruolo.CodiceRuolo == codice) {
                    cssBold = "font-weight-bold";
                    item += "<span class='item-circle2 color-gray'>";
                    item += "<span class='item-subcircle'></span>";
                    item += "</span>";
                } else {
                    item += "<span class='item-circle color-gray'>";
                    item += "</span>";
                }
            } //
            var index = 0;
            var count = ruolo.Groups.length;
            for (var group of ruolo.Groups) {
                if (index == 0 && !ruolo.NomeUtente) {
                    item += "<span class='subtext-position " + cssBold + " ' style='padding: 0;'>" + group + "</span>";
                } else
                    item += "<span class='subtext-position " + cssBold + " '>" + group + "</span>";
                index++;
                if (index < count)
                    item += "<br>";
            }
        }
    }
    return item;
}

function ShowDialogLegenda($template, action) {
    try {
        var dialogName = "dlgLegenda";
        var dialogId = '#' + dialogName;
        var $dlg = $template.octemplate({
            dialog_name: dialogName,
            title: "Legenda Stato del processo",
        });

        $('.app-wfam').append($dlg);
        $(dialogId).ocdialog({
            width: 'var(--variable-width)',

            modal: true,
            close: function() {}
        });
    } catch (error) {}
}