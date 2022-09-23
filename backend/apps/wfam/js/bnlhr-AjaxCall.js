function bnlhrAjaxCallPOST(url, jsonModel, callback) {
    let self = this;
    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(jsonModel),


    }).done(function(response) {
        if (callback)
            callback(response);
    }).fail(function(response, code) {
        if (callback)
            callback(response);
    });
}

function bnlhrAjaxGetUser(utenteId, callback) {

    try {
        let model = {
            "Dto": {
                "Id": utenteId
            }

        };
        let url = OC.generateUrl('apps/workflowmanager/api/user/read');
        WFAjaxCallPOST(url, model, function(response) {
            if (response != null && response.Performed) {
                var dto = response.Dto;
                if (dto != null) {
                    let nome = dto.Nome;
                    let email = dto.Email;
                    let groups = dto.Groups
                    let account = dto.Account;
                    let dtoUser = {
                        "Id": account,
                        "Nome": nome,
                        "Email": email,
                        "Group": groups
                    };
                    if (callback)
                        callback(dtoUser);
                    return;
                }
            }
            if (callback)
                callback(null);
        })
    } catch (error) {}
}

function bnlhrAjaxGetCurrentUser(currentUser, callback) {

    try {
        let model = {
            "Dto": {
                "Id": OC.currentUser
            }
        };
        let url = OC.generateUrl('apps/workflowmanager/api/user/read');
        WFAjaxCallPOST(url, model, function(response) {
            if (response != null && response.Performed) {
                var dto = response.Dto;
                if (dto != null) {
                    let nome = dto.Nome;
                    let email = dto.Email;
                    let groups = dto.Groups
                    let account = dto.Account;
                    let dtoUser = {
                        "Uid": account,
                        "Id": account,
                        "Nome": nome,
                        "Email": email,
                        "Groups": groups
                    };
                    currentUser.Model.Dto = dtoUser;
                }
            }
            if (callback)
                callback(currentUser);
        })
    } catch (error) {}
}

function GetGroupsAuthorization(userGroups, filter, callback) {
    let model = {
        "Model": {
            "Search": {
                "GroupName": userGroups
            },
            "Filter": filter,
            "Order": {
                "Name": "UtenteId",
                "Direction": "asc"
            }
        }
    };
    var url = OC.generateUrl("/apps/wfam/grupporuolo/get");
    bnlhrAjaxCallPOST(url, model, function(response) {
        if (callback)
            callback(response)
    })
}

function GetDesignerGroup(callback) {
    let model = {
        "Model": {
            "Dto": {
                "designer_group": null
            }
        }
    };
    var url = OC.generateUrl('apps/workflowmanager/settings/load');
    bnlhrAjaxCallPOST(url, model, function(response) {
        if (response != null && response.Performed) {
            if (response.Dto != null && response.Dto.designer_group != "") {
                if (callback)
                    callback(response);
                return;
            }
        }
        response.Message = "Il gruppo Designer non è stato definito nella configurazione. Contattare l'amministratore.";
        if (callback)
            callback(response);
    })
}

function GetSuperAdminGroup(callback) {
    let model = {
        "Model": {
            "Dto": {
                "super_admin_group": null
            }
        }
    };
    var url = OC.generateUrl('apps/workflowmanager/settings/load');
    bnlhrAjaxCallPOST(url, model, function(response) {
        if (response != null && response.Performed) {
            if (response.Dto != null && response.Dto.super_admin_group != "") {
                if (callback)
                    callback(response);
                return;
            }
        }
        //response.Message = "Il gruppo Super Admin non è stato definito nella configurazione. Contattare l'amministratore.";
        if (callback)
            callback(response);
    })
}

function GetWFAAuthorized(userGroups, filter, codiceRuolo, callback) {
    GetGroupsAuthorization(userGroups, null, function(response) {
        if (response != null && response.Model.Performed) {
            var dtos = response.Model.Dtos;
            if (dtos != null) {
                var wafaIds = [];
                dtos.filter(function(value) {
                    if (codiceRuolo != null) {
                        if (value.CodificaRuolo == codiceRuolo) {
                            var exist = wafaIds.find(q => q == value.WfaId) != null;
                            if (!exist)
                                wafaIds.push(value.WfaId);
                        }
                    } else {
                        var exist = wafaIds.find(q => q == value.WfaId) != null;
                        if (!exist)
                            wafaIds.push(value.WfaId);
                    }
                    return true;
                })
                if (wafaIds.length > 0) {
                    let model = {
                        "Model": {
                            "Filter": filter,
                            "Search": {
                                "WfaId": wafaIds
                            }
                        }
                    };
                    let url = OC.generateUrl('apps/wfam/wfa/get');
                    bnlhrAjaxCallPOST(url, model, function(response) {
                        if (callback)
                            callback(response);
                        return;
                    })
                }
            }
        } else {
            if (callback)
                callback(null);
        }

    })
}

function GetCodificaRuolo(wfaId, ownerId, callback) {
    let model = {
        "Model": {
            "Filter": {}
        }
    };
    model.Model.Filter.AppId = "wfam";
    model.Model.Filter.WorkflowId = wfaId;
    model.Model.Filter.OwnerId = ownerId;
    var url = OC.generateUrl("/apps/workflowmanager/api/getcurrentruolo");
    bnlhrAjaxCallPOST(url, model, function(response) {
        if (callback)
            callback(response)
    })
}

function GetCodiceRuolo(wfaId, ownerId, callback) {
    let model = {
        "Model": {
            "Filter": {}
        }
    };
    model.Model.Filter.AppId = "wfam";
    model.Model.Filter.WorkflowId = wfaId;
    model.Model.Filter.OwnerId = ownerId;
    var url = OC.generateUrl("/apps/workflowmanager/api/getcodiceruolo");
    bnlhrAjaxCallPOST(url, model, function(response) {
        if (callback)
            callback(response)
    })
}

function GetCodificheRuoloPratica(wfaId, praticaModel, callback) {
    let model = {
        "Model": {
            "Filter": {
                "WfaId": wfaId
            }
        }
    };
    var url = OC.generateUrl("/apps/wfam/ruolowfa/get");
    bnlhrAjaxCallPOST(url, model, function(response) {
        if (response != null && response.Performed) {
            if (response.Model.Dtos != null && response.Model.Dtos.length > 0) {
                var modelFilter = {
                    "Model": {}
                };
                modelFilter.Model.Filter = {};
                modelFilter.Model.Filter.PraticaWfaId = model.Model.Dto.Id;
                let url = OC.generateUrl('apps/wfam/ruolopraticawfa/get');
                bnlhrAjaxCallPOST(url, modelFilter, function(response) {
                    if (response != null && response.Model != null && response.Model.Performed) {
                        if (response.Model.Dtos != null) {
                            var authorizedView = false;
                            var ruoliPraticaDtos = response.Model.Dtos;
                            for (var ruoloWfa of response.Model.Dtos)
                                if (ruoloWfa.CodificaRuolo == WFARUOLO.R && WFAGROUPSAUTH.GR) {
                                    var ruoloPratica = ruoliPraticaDtos.find(x => x.CodificaRuolo == WFARUOLO.R)
                                    if (ruoloPratica) {
                                        if (ruoloPratica.UtenteId == currentUser.Dto.Id)
                                            authorizedView = true;
                                    }
                                } else if (codificaRuolo == WFARUOLO.C && WFAGROUPSAUTH.GC) {
                                var ruoloPratica = ruoliPraticaDtos.find(x => x.CodificaRuolo == WFARUOLO.C)
                                if (ruoloPratica) {
                                    if (ruoloPratica.UtenteId == currentUser.Dto.Id)
                                        authorizedView = true;
                                }
                            } else if (codificaRuolo == WFARUOLO.A && WFAGROUPSAUTH.GA) {
                                var ruoloPratica = ruoliPraticaDtos.find(x => x.CodificaRuolo == WFARUOLO.A)
                                if (ruoloPratica) {
                                    if (ruoloPratica.UtenteId == currentUser.Dto.Id)
                                        authorizedView = true;
                                }
                            }
                            GetAuth(praticaModel, function() {
                                if (response != null && response.Model != null) {
                                    response.Model.AuthorizedView = authorizedView;
                                    if (callback)
                                        callback(response);
                                    return;
                                }
                            })
                            return;
                        }
                    }
                })
            }
        }
    })
}

function GetMailsNotificheRuoloWfa(model, callback) {
    GetUsersNotificheRuoloWfa(model, function(usersId, groupsName) {
        if ((usersId != null && usersId.length > 0) || (groupsName != null && groupsName.length > 0)) {
            modelFilter = {
                "Model": {
                    "UsersId": usersId,
                    "GroupsName": groupsName
                }
            };
            let url = OC.generateUrl('apps/workflowmanager/api/group/mail/get');
            bnlhrAjaxCallPOST(url, modelFilter, function(response) {
                if (callback)
                    callback(response);
                return;
            })
        } else {
            if (callback)
                callback(null);
        }
    })
}

function GetUsersNotificheRuoloWfa(model, callback) {
    var modelFilter = {
        "Model": {}
    };
    modelFilter.Model.Filter = {};
    modelFilter.Model.Filter.WfaId = model.Model.Dto.WfaId;
    let url = OC.generateUrl('apps/wfam/notificheruolowfa/get');
    bnlhrAjaxCallPOST(url, modelFilter, function(response) {
        if (response !== null && response.Model !== null && response.Model.Performed) {
            if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                var notificheWfa = response.Model.Dtos;
                modelFilter = {
                    "Model": {}
                };
                modelFilter.Model.Filter = {};
                modelFilter.Model.Filter.PraticaWfaId = model.Model.Dto.Id;
                let url = OC.generateUrl('apps/wfam/ruolopraticawfa/get');
                bnlhrAjaxCallPOST(url, modelFilter, function(response) {
                    if (response != null && response.Model != null && response.Model.Performed) {
                        if (response.Model.Dtos != null && response.Model.Dtos.length > 0) {
                            var ruoliPratica = response.Model.Dtos;
                            var usersId = [];
                            var groupsName = [];
                            var modelFilter = {
                                "Model": {
                                    "Filter": {
                                        "WfaId": model.Model.Dto.WfaId
                                    }
                                }
                            };
                            var url = OC.generateUrl("/apps/wfam/ruolowfa/get");
                            bnlhrAjaxCallPOST(url, modelFilter, function(response) {
                                if (response != null && response.Model != null && response.Model.Performed) {
                                    var ruoliWfa = response.Model.Dtos;
                                    var ruoloPraticaUtente = ruoliPratica.find(x => x.UtenteId == currentUser.Model.Dto.Id);
                                    if (ruoloPraticaUtente) {
                                        var notificheRuolo = notificheWfa.filter(x => x.RuoloWfaId == ruoloPraticaUtente.RuoloWfaId);
                                        for (var notifica of notificheRuolo) {
                                            var utenteRuolo = ruoliPratica.find(x => x.RuoloWfaId == notifica.RuoloInformedId);
                                            if (utenteRuolo) {
                                                var exist = usersId.find(x => x == utenteRuolo.UtenteId);
                                                if (!exist)
                                                    usersId.push(utenteRuolo.UtenteId);
                                            } else {
                                                var ruoloWfa = ruoliWfa.find(x => x.Id == notifica.RuoloInformedId);
                                                if (ruoloWfa) {
                                                    var groupsInformed = JSON.parse(notifica.GroupsInformed);
                                                    if (groupsInformed && groupsInformed.length > 0) {
                                                        for (var groupInformed of groupsInformed) {
                                                            if (groupInformed.Informed) {
                                                                var exist = groupsName.find(x => x == groupInformed.Name);
                                                                if (!exist)
                                                                    groupsName.push(groupInformed.Name);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                if (callback)
                                    callback(usersId, groupsName);
                                return;
                            })
                        } else {
                            if (callback)
                                callback(null, null);
                            return;
                        }
                    } else {
                        if (callback)
                            callback(null, null);
                        return;
                    }
                })
            } else {
                if (callback)
                    callback(null, null);
                return;
            }
        } else {
            if (callback)
                callback(null, null);
            return;
        }
    })
}

function CountPraticheWfa(wfaId, callback) {
    let model = {
        "Model": {
            "Filter": {
                "WfaId": wfaId
            }
        }
    };
    var url = OC.generateUrl('apps/wfam/praticawfa/count');
    bnlhrAjaxCallPOST(url, model, function(response) {
        if (response != null && response.Performed) {
            if (callback)
                callback(response.Count);
            return;
        } else {
            if (callback)
                callback(0);
            return;
        }
    })
}

function GetRuolo(callback) {
    let model = {
        "Model": {}
    };
    var url = OC.generateUrl('apps/wfam/ruolo/get');
    bnlhrAjaxCallPOST(url, model, function(response) {
        if (callback)
            callback(response);
    })
}

function GetServerRoot(callback) {

    try {
        let model = {
            "Dto": {
                "ServerRoot": null
            }
        };
        let url = OC.generateUrl('apps/wfam/filemanager/getserverroot');
        WFAjaxCallPOST(url, model, function(response) {
            if (response != null && response.Performed) {
                var dto = response.Dto;
                if (dto != null) {
                    if (callback)
                        callback(dto.ServerRoot);
                    return;
                }
            }
            if (callback)
                callback(null);
        })
    } catch (error) {}
}

function GetRuoloWfa(filter, callback) {
    let model = {
        "Model": {
            "Filter": filter
        }
    };
    var url = OC.generateUrl("/apps/wfam/ruolowfa/get");
    bnlhrAjaxCallPOST(url, model, function(response) {
        if (callback)
            callback(response);
    })
}

function GetRuoloPraticaWfa(filter, callback) {
    var modelFilter = {
        "Model": {}
    };
    modelFilter.Model.Filter = filter;
    let url = OC.generateUrl('apps/wfam/ruolopraticawfa/get');
    bnlhrAjaxCallPOST(url, modelFilter, function(response) {
        if (callback)
            callback(response);
    })
}

function IsAzioniDeliberaPageEnabled(callback) {
    let model = {
        "Model": {
            "Dto": {}
        }
    };
    model.Model.Dto.enable_page_action = false;
    var url = OC.generateUrl('apps/workflowmanager/settings/load');
    bnlhrAjaxCallPOST(url, model, function(response) {
        if (response != null && response.Performed) {
            return callback(response.Dto.enable_page_action);
        }
        return callback(false);
    })
}

function LoadPraticheUtente(model, viewType, callback) {
    var filter = null;
    var codiceRuolo = null;
    if (WFAGROUPSAUTH.GSUPERADMIN) {
        if (!model.Model.Filter.Status) {
            if (viewType == VIEWTYPE.RICHIESTE || viewType == VIEWTYPE.INCORSO) {
                model.Model.Filter.Status = [statoPraticaWfa.MODIFICA, statoPraticaWfa.DELIBERA, statoPraticaWfa.APPROVAZIONE];
            } else if (viewType == VIEWTYPE.DELIBERATE) {
                model.Model.Filter.Status = [statoPraticaWfa.RIFIUTATO, statoPraticaWfa.COMPLETATA, statoPraticaWfa.BLOCCATA];
            }
        }
        let url = OC.generateUrl('apps/wfam/praticawfa/load');
        bnlhrAjaxCallPOST(url, model, function(response) {
            if (callback)
                callback(response);
        });
    } else {
        GetWFAAuthorized(currentUser.Model.Dto.Groups, filter, codiceRuolo, function(response) {
            if (response !== null && response.Model.Performed && response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                var wfaIds = [];
                var ruoloIds = [];
                var ruoloWfaIds = [];
                response.Model.Dtos.filter(function(value) {
                    wfaIds.push(value.Id);
                    return value.Id;
                });
                model.Model.Search = {
                    "WfaId": wfaIds
                };
                GetGroupsAuthorization(currentUser.Model.Dto.Groups, null, function(response) {
                    if (response !== null && response.Model.Performed && response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                        response.Model.Dtos.filter(function(value) {
                            if (!ruoloIds.includes(value.RuoloId)) {
                                if (viewType && viewType != VIEWTYPE.NONE) {
                                    if (viewType == VIEWTYPE.RICHIESTE) {
                                        if (value.CodificaRuolo == WFARUOLO.R)
                                            ruoloIds.push(value.RuoloId);
                                    } else if (viewType == VIEWTYPE.INCORSO) {
                                        if (value.CodificaRuolo == WFARUOLO.C || value.CodificaRuolo == WFARUOLO.A)
                                            ruoloIds.push(value.RuoloId);
                                    } else if (viewType == VIEWTYPE.DELIBERATE) {
                                        ruoloIds.push(value.RuoloId);
                                    }
                                }
                            }
                            return value.RuoloId;
                        })
                        response.Model.Dtos.filter(function(value) {
                            if (!ruoloWfaIds.includes(value.RuoloWfaId)) {
                                if (viewType && viewType != VIEWTYPE.NONE) {
                                    if (viewType == VIEWTYPE.RICHIESTE) {
                                        if (value.CodificaRuolo == WFARUOLO.R)
                                            ruoloWfaIds.push(value.RuoloWfaId);
                                    } else if (viewType == VIEWTYPE.INCORSO) {
                                        if (value.CodificaRuolo == WFARUOLO.C || value.CodificaRuolo == WFARUOLO.A)
                                            ruoloWfaIds.push(value.RuoloWfaId);
                                    } else if (viewType == VIEWTYPE.DELIBERATE) {
                                        ruoloWfaIds.push(value.RuoloWfaId);
                                    }
                                }
                            }
                            return value.RuoloWfaId;
                        })
                        if (!model.Model.Filter) {
                            model.Model.Filter = {}
                        }
                        // if (!WFAGROUPSAUTH.GR && !model.Model.Filter.Status) {
                        //     model.Model.Filter.Status = [statoPraticaWfa.MODIFICA, statoPraticaWfa.RIFIUTATO, statoPraticaWfa.DELIBERA,
                        //         statoPraticaWfa.APPROVAZIONE, statoPraticaWfa.COMPLETATA, statoPraticaWfa.BLOCCATA
                        //     ];
                        // }else
                        if (!model.Model.Filter.Status) {
                            if (viewType == VIEWTYPE.RICHIESTE || viewType == VIEWTYPE.INCORSO) {
                                model.Model.Filter.Status = [statoPraticaWfa.MODIFICA, statoPraticaWfa.DELIBERA, statoPraticaWfa.APPROVAZIONE];
                            } else if (viewType == VIEWTYPE.DELIBERATE) {
                                model.Model.Filter.Status = [statoPraticaWfa.RIFIUTATO, statoPraticaWfa.COMPLETATA, statoPraticaWfa.BLOCCATA];
                            }
                        }
                        model.Model.Filter.RuoloIds = ruoloIds;
                        if (viewType == VIEWTYPE.RICHIESTE)
                            model.Model.Filter.RuoloWfaIdsRichieste = ruoloWfaIds;
                        else
                            model.Model.Filter.RuoloWfaIds = ruoloWfaIds;
                        model.Model.Filter.UtenteId = currentUser.Model.Dto.Uid;
                        model.Model.Filter.Groups = currentUser.Model.Dto.Groups;
                        let url = OC.generateUrl('apps/wfam/praticawfa/load');
                        bnlhrAjaxCallPOST(url, model, function(response) {
                            if (callback)
                                callback(response);
                        });
                    }
                })
            } else {
                if (callback)
                    callback({
                        "Model": {
                            "Performed": response.Model.Performed,
                            "Dtos": []
                        }
                    });
            }
        })
    }
}

function CountPraticheUtente(model, viewType, callback) {
    var filter = null;
    var codiceRuolo = null;
    if (WFAGROUPSAUTH.GSUPERADMIN) {
        if (!model.Model.Filter.Status) {
            if (viewType == VIEWTYPE.RICHIESTE || viewType == VIEWTYPE.INCORSO) {
                model.Model.Filter.Status = [statoPraticaWfa.MODIFICA, statoPraticaWfa.DELIBERA, statoPraticaWfa.APPROVAZIONE];
            } else if (viewType == VIEWTYPE.DELIBERATE) {
                model.Model.Filter.Status = [statoPraticaWfa.RIFIUTATO, statoPraticaWfa.COMPLETATA, statoPraticaWfa.BLOCCATA];
            }
        }
        let url = OC.generateUrl('apps/wfam/praticawfa/count');
        bnlhrAjaxCallPOST(url, model, function(response) {
            if (callback)
                callback(response);
        });
    } else {
        GetWFAAuthorized(currentUser.Model.Dto.Groups, filter, codiceRuolo, function(response) {
            if (response !== null && response.Model.Performed && response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                var wfaIds = [];
                var ruoloIds = [];
                var ruoloWfaIds = [];
                response.Model.Dtos.filter(function(value) {
                    wfaIds.push(value.Id);
                    return value.Id;
                });
                model.Model.Search = {
                    "WfaId": wfaIds
                };
                GetGroupsAuthorization(currentUser.Model.Dto.Groups, null, function(response) {
                    if (response !== null && response.Model.Performed && response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                        response.Model.Dtos.filter(function(value) {
                            if (!ruoloIds.includes(value.RuoloId)) {
                                if (viewType && viewType != VIEWTYPE.NONE) {
                                    if (viewType == VIEWTYPE.RICHIESTE) {
                                        if (value.CodificaRuolo == WFARUOLO.R)
                                            ruoloIds.push(value.RuoloId);
                                    } else if (viewType == VIEWTYPE.INCORSO) {
                                        if (value.CodificaRuolo == WFARUOLO.C || value.CodificaRuolo == WFARUOLO.A)
                                            ruoloIds.push(value.RuoloId);
                                    } else if (viewType == VIEWTYPE.DELIBERATE) {
                                        ruoloIds.push(value.RuoloId);
                                    }
                                }
                            }
                            return value.RuoloId;
                        })
                        response.Model.Dtos.filter(function(value) {
                            if (!ruoloWfaIds.includes(value.RuoloWfaId)) {
                                if (viewType && viewType != VIEWTYPE.NONE) {
                                    if (viewType == VIEWTYPE.RICHIESTE) {
                                        if (value.CodificaRuolo == WFARUOLO.R)
                                            ruoloWfaIds.push(value.RuoloWfaId);
                                    } else if (viewType == VIEWTYPE.INCORSO) {
                                        if (value.CodificaRuolo == WFARUOLO.C || value.CodificaRuolo == WFARUOLO.A)
                                            ruoloWfaIds.push(value.RuoloWfaId);
                                    } else if (viewType == VIEWTYPE.DELIBERATE) {
                                        ruoloWfaIds.push(value.RuoloWfaId);
                                    }
                                }
                            }
                            return value.RuoloWfaId;
                        })
                        if (!model.Model.Filter) {
                            model.Model.Filter = {}
                        }
                        if (!model.Model.Filter.Status) {
                            if (viewType == VIEWTYPE.RICHIESTE || viewType == VIEWTYPE.INCORSO) {
                                model.Model.Filter.Status = [statoPraticaWfa.MODIFICA, statoPraticaWfa.DELIBERA, statoPraticaWfa.APPROVAZIONE];
                            } else if (viewType == VIEWTYPE.DELIBERATE) {
                                model.Model.Filter.Status = [statoPraticaWfa.RIFIUTATO, statoPraticaWfa.COMPLETATA, statoPraticaWfa.BLOCCATA];
                            }
                        }
                        model.Model.Filter.RuoloIds = ruoloIds;
                        if (viewType == VIEWTYPE.RICHIESTE)
                            model.Model.Filter.RuoloWfaIdsRichieste = ruoloWfaIds;
                        else
                            model.Model.Filter.RuoloWfaIds = ruoloWfaIds;
                        model.Model.Filter.UtenteId = currentUser.Model.Dto.Uid;
                        model.Model.Filter.Groups = currentUser.Model.Dto.Groups;
                        let url = OC.generateUrl('apps/wfam/praticawfa/count');
                        bnlhrAjaxCallPOST(url, model, function(response) {
                            if (callback)
                                callback(response);
                        });
                    }
                })
            } else {
                if (callback)
                    callback({
                        "Model": {
                            "Performed": response.Model.Performed,
                            "Dtos": []
                        }
                    });
            }
        })
    }
}

function GetNextRuolo(pratica, stato, callback) {
    let model = {
        "Model": {
            "Filter": {}
        }
    };
    model.Model.Filter.AppId = "wfam";
    model.Model.Filter.WorkflowId = pratica.Model.Dto.WfaId;
    model.Model.Filter.Id = null;
    model.Model.Filter.Stato = stato;
    model.Model.Filter.OwnerId = pratica.Model.Dto.Id;
    let url = OC.generateUrl('apps/workflowmanager/api/getnextruolo');
    bnlhrAjaxCallPOST(url, model, function(codificaRuolo) {
        if (callback)
            return callback(codificaRuolo);
    });
}

function GetGroups(filter, callback) {
    let model = {
        "Model": {
            "Filter": filter,
            "Order": {
                "Name": "GroupName",
                "Direction": "asc"
            }
        }
    };
    var url = OC.generateUrl("/apps/wfam/grupporuolo/get");
    bnlhrAjaxCallPOST(url, model, function(response) {
        if (callback)
            callback(response)
    })
}

function UpdateProcessiInCorso() {
    var model = { "Model": { "Filter": {} } };
    model.Model.Filter.Status = GetFasiUtente(VIEWTYPE.INCORSO);
    CountPraticheUtente(model, VIEWTYPE.INCORSO, function(response) {
        if (response && response.Performed)
            $("#lblCountPraticheInCorsoMenu").text(response.Count);
        else
            $("#lblCountPraticheInCorsoMenu").text(0);
    })
}

function DeleteRuoloPratica(praticaDto, callback) {
    GetCodiceRuolo(praticaDto.WfaId, praticaDto.Id, function(codice) {
        if (codice != null) {
            var model = { "Model": {} };
            model.Model.Filter = {};
            model.Model.Filter.PraticaWfaId = praticaDto.Id;
            model.Model.Filter.CodiceRuolo = codice;
            let url = OC.generateUrl('apps/wfam/ruolopraticawfa/get');
            bnlhrAjaxCallPOST(url, model, function(response) {
                if (response && response.Model && response.Model.Performed) {
                    if (response.Model.Dtos.length > 0) {
                        var dto = response.Model.Dtos[0];
                        var model = { "Model": {} };
                        model.Model.Dto = dto;
                        let url = OC.generateUrl('apps/wfam/ruolopraticawfa/delete');
                        bnlhrAjaxCallPOST(url, model, function(response) {
                            if (callback)
                                callback(response);
                        })
                    } else {
                        if (callback)
                            callback(response);
                    }
                } else {
                    if (callback)
                        callback(response);
                }
            })
        } else {
            if (callback)
                callback({ "Model": { "Performed": false } });
        }
    })

}

function GetSintesiProcesso(wfaId, praticaId, callback) {
    let model = {
        "Model": {
            "Filter": { "WfaId": wfaId, "Id": praticaId }
        }
    };
    var url = OC.generateUrl("/apps/wfam/praticawfa/processo");
    bnlhrAjaxCallPOST(url, model, function(response) {
        if (callback)
            callback(response)
    })
}