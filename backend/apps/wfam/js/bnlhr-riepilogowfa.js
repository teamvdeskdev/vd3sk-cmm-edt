var dia = joint.dia;
var util = joint.util;
var standard = joint.shapes.standard;
var erd = joint.shapes.erd;
var devs = joint.shapes.devs;
var graph, paper;

var timerId;

function ReadRiepilogo(model) {
    //init Paper & graph
    graph = new dia.Graph;
    paper = new joint.dia.Paper({
        el: $('#paper'),
        width: 'auto !important',
        interactive: false,
        model: graph,
        gridSize: 1,
        drawGrid: false,
        perpendicularLinks: true,
        defaultLink: new devs.Link({
            attrs: {
                '.marker-target': {
                    d: 'M 8 0 L 0 4 L 8 8 z'
                }
            }
        })
    });

    paper.on('blank:pointerdown', function(event, x, y) {
        dragStartPosition = {
            x: x,
            y: y
        };
    });

    paper.on('cell:pointerup blank:pointerup', function(cellView, x, y) {
        dragStartPosition = null;
    });

    $('#WfaId').val(model.Model.Filter.WfaId);
    let modelWfa = {
        "Model": {
            "Filter": {}
        }
    };
    modelWfa.Model.Filter.Id = model.Model.Filter.WfaId;
    let urlWfa = OC.generateUrl('apps/wfam/wfa/read');
    bnlhrAjaxCallPOST(urlWfa, modelWfa, function(response) {
        if (response !== null && response.Model.Performed) {
            if (response.Model.Dto !== null) {
                this.BindViewRiepilogoWFA(response.Model.Dto);
            }
        }
    });

    let urlRuoloWfa = OC.generateUrl('apps/wfam/ruolowfa/get');
    bnlhrAjaxCallPOST(urlRuoloWfa, model, function(response) {
        if (response !== null && response.Model.Performed) {
            if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                this.BindViewRiepilogoRuoloWFA(response.Model.Dtos);
            }
        }
    });

    let urlElementoWfa = OC.generateUrl('apps/wfam/elementowfa/get');
    let modelFilterElementoWfa = {
        "Model": {}
    };
    modelFilterElementoWfa.Model.Filter = {};
    modelFilterElementoWfa.Model.Filter.WfaId = model.Model.Filter.WfaId;
    modelFilterElementoWfa.Model.Order = {};
    modelFilterElementoWfa.Model.Order.Name = "Ordine";
    modelFilterElementoWfa.Model.Order.Direction = "asc";
    bnlhrAjaxCallPOST(urlElementoWfa, modelFilterElementoWfa, function(response) {
        if (response !== null && response.Model.Performed) {
            if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                this.BindViewRiepilogoElementoWFA(response.Model.Dtos);
            }
        }
    });

    let urlAzioneWfa = OC.generateUrl('apps/wfam/azionewfa/get');
    bnlhrAjaxCallPOST(urlAzioneWfa, model, function(response) {
        if (response !== null && response.Model.Performed) {
            if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                this.BindViewAzioneWfa(response.Model.Dtos);
                HidePageLoader();
            } else {
                HidePageLoader();
            }
        } else {
            HidePageLoader();
        }
    });
}

function BindViewRiepilogoWFA(dto) {

    $("#Nome").html(dto.Nome);
    $("#NomeCategoria").html(dto.NomeCategoria);
    $("#NomeCategoria").attr("data-id", dto.CategoriaId);
    //Load WF if exists
    if (dto.Workflow && dto.Workflow != null) {
        graph.fromJSON(JSON.parse(dto.Workflow));
    }
}

function BindViewRiepilogoRuoloWFA(dtos) {
    dtos.forEach(function(dto) {
        var filter = { "WfaId": dto.WfaId };
        GetGroups(filter, function(response) {
            if (response && response.Model && response.Model.Performed) {
                var groupsName = "NON DEFINITO";
                if (response.Model.Dtos.length > 0) {
                    response.Model.Dtos.sort(function(a, b) { return a - b });
                    groupsName = "";
                    for (var gruppo of response.Model.Dtos) {
                        if (dto.UtenteId == gruppo.UtenteId)
                            groupsName += gruppo.GroupName + ", ";
                    }
                    if (groupsName.substring(groupsName.length - 2, groupsName.length - 1) == ",")
                        groupsName = groupsName.substring(0, groupsName.length - 2);

                    let row = "<tr data-codice=\"" + dto.UtenteId + "\">\n" +
                        "                <td style=\"white-space: normal;\">\n" +
                        "                  " + dto.UtenteId + ": <span id=\"CodiceRuolo" + dto.Id + "\">" + groupsName + "</span> \n" +
                        "                </td>\n" +
                        "            </tr>      ";
                    if (dto.CodificaRuolo == WFARUOLO.R)
                        $(row).prependTo("#bnlhr-RuoloWFA tbody");
                    else if (dto.CodificaRuolo == WFARUOLO.A)
                        $(row).appendTo("#bnlhr-RuoloWFA tbody");
                    else {
                        var exist = ($("#bnlhr-RuoloWFA tbody tr[data-codice='" + WFARUOLO.A + "']").length > 0);
                        if (exist) {
                            var rowA = $("#bnlhr-RuoloWFA tbody tr[data-codice='" + WFARUOLO.A + "']");
                            $(row).insertBefore(rowA);
                        } else
                            $(row).appendTo("#bnlhr-RuoloWFA tbody");
                    }

                }
            }


        })


    });

}

function BindViewRiepilogoElementoWFA(dtos) {
    dtos.forEach(function(dto) {
        let rows = "<tr>\n" +
            "                <td>\n" +
            "                    <span id=\"NomeElemento" + dto.Id + "\">" + dto.NomeElemento + "</span> - " + dto.TipoElemento + "\n" +
            "                </td>\n" +
            "            </tr>";
        $(rows).appendTo("#bnlhr-ElementoWFA tbody");
    });
}

function BindViewAzioneWfa(dtos) {
    dtos.forEach(function(dto) {
        let rows = "<tr>\n" +
            "                <td>\n" +
            "                    <span id=\"NomeAzione" + dto.Id + "\">" + dto.NomeAzione + "</span> - " + dto.TipoAzione + "\n" +
            "                </td>\n" +
            "            </tr>";
        $(rows).appendTo("#bnlhr-AzioneWFA tbody");
    });
}



function SaveWfaWorkflow(workflow) {
    let modelWfa = {
        "Model": {
            "Dto": {}
        }
    };
    modelWfa.Model.Dto.Id = parseInt($('#WfaId').val());
    modelWfa.Model.Dto.Workflow = workflow;
    // modelWfa.Model.Dto.Workflow = workflow ;
    let urlWfa = OC.generateUrl('apps/wfam/wfa/update');
    bnlhrAjaxCallPOST(urlWfa, modelWfa, function(response) {
        if (response !== null && response.Model.Performed) {
            if (response.Model.Dto !== null) {
                graph.fromJSON(JSON.parse(response.Model.Dto.Workflow));
            }
        }
    });
}

function CreateWorkflowElements(callback) {
    let elements = [];
    let url = OC.generateUrl('apps/wfam/azionewfa/get');
    bnlhrAjaxCallPOST(url, model, function(response) {
        if (response !== null && response.Model.Performed) {
            if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                response.Model.Dtos.forEach(function(row, i) {
                    let element = {};
                    element.Id = row.Id;
                    element.Label = row.NomeAzione;
                    // element.Type = "Azione-"+row.Tipo;
                    element.Type = "Azione";
                    element.Stato = 'clear';
                    element.Identificativo = row.TipoAzione;
                    elements.push(element);

                });
                url = OC.generateUrl('apps/wfam/ruolowfa/get');
                bnlhrAjaxCallPOST(url, model, function(response) {
                    if (response !== null && response.Model.Performed) {
                        if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                            // let countA = 0;
                            // let countC = 1;
                            response.Model.Dtos.forEach(function(row, i) {
                                element = {};
                                element.Id = row.Id;
                                element.Label = row.CodiceRuolo;
                                element.Type = row.CodificaRuolo;
                                element.Stato = 'clear';
                                element.Identificativo = row.UtenteId;
                                elements.push(element);
                            });
                            if (callback) {
                                callback(elements);
                            }
                        }
                    }
                });
            }
        }
    });
}

$("#app-pages").on('click', '#bnlhr-btnCreaFlusso', function(e) {
    EnableControlsFlussoWFA(false);

    CreateWorkflowElements(function(elements) {

        //Create or Update Record for current Workflow and store elements Model into workflow_elements
        let jsonData = {
            "Model": {}
        };
        jsonData.Model = {
            "Workflow": {
                "AppId": "wfam",
                "WorkflowId": parseInt($('#WfaId').val()),
                "WorkflowElements": JSON.stringify(elements),
                "Close": "false",
                "Name": $("#Nome").html()
            }
        };
        let url = OC.generateUrl('/apps/workflowmanager/api/createorupdate');
        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(jsonData),
        }).done(function(response) {
            if (response != null && response.Model.Performed) {
                let url = OC.generateUrl("apps/workflowmanager/?AppId=wfam&WorkflowId=" + parseInt($('#WfaId').val()));
                window.open(url, '_blank');

                //Check closeFlag and load worlflow if true
                timerId = setInterval(function() {
                    let requestData = {
                        "Model": {}
                    };
                    requestData.Model = {
                        "Filter": {
                            "AppId": jsonData.Model.Workflow.AppId,
                            "WorkflowId": jsonData.Model.Workflow.WorkflowId
                        }
                    };

                    let url = OC.generateUrl('/apps/workflowmanager/api/read');
                    $.ajax({
                        url: url,
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(requestData),

                    }).done(function(response) {
                        closeFlag = response.Model.Dto.Close;
                        if (closeFlag == "true") {
                            $('#bnlhr-btnCaricaFlusso').click();
                            clearInterval(timerId);

                        }
                    }).fail(function(response, code) {
                        OC.dialogs.alert('Errore lettura dati (polling)', 'Error');
                        clearInterval(timerId);
                    });
                }, 2000);


            } else {
                OC.dialogs.info("Errore nell'avvio creazione workflow.", "INFO");
            }
            EnableControlsFlussoWFA(true);

        }).fail(function(response, code) {
            EnableControlsFlussoWFA(true);
            OC.dialogs.alert("Non è stato possibile avviare la creazione del flusso. ", "INFO");
        });


    });
    e.preventDefault();
});

$("#app-pages").on('click', '#bnlhr-btnCaricaFlusso', function() {
    EnableControlsFlussoWFA(false);
    if (timerId) {
        clearInterval(timerId);
    };

    let jsonData = {
        "Model": {}
    };
    jsonData.Model = {
        "Filter": {
            "AppId": "wfam",
            "WorkflowId": parseInt($('#WfaId').val())
        }
    };
    let url = OC.generateUrl('/apps/workflowmanager/api/get');
    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(jsonData),

    }).done(function(response) {
        if (response != null && response.Model.Performed && response.Model.Dtos.length > 0) {
            if (response.Model.Dtos[0].WorkflowSvg != null)
                SaveWfaWorkflow(response.Model.Dtos[0].WorkflowSvg);
            else {
                OC.dialogs.info("Non è presente nessun flusso da caricare", "INFO");
            }
        } else {
            OC.dialogs.info("Non è presente nessun flusso da caricare", "INFO");
        }
        EnableControlsFlussoWFA(true);

    }).fail(function(response, code) {
        EnableControlsFlussoWFA(true);
        OC.dialogs.alert("Non è stato possibile effettuare il caricamento ", "INFO");
    });

});

$("#app-pages").on('click', '#bnlhr-btnPubblicaRiepilogo', function() {
    EnableControlsRiepilogoWFA(false);

    if (paper && paper.isDefined) {
        let urlWfa = OC.generateUrl('apps/wfam/wfa/createorupdate');
        let modelWfa = {
            "Model": {
                "Dto": {}
            }
        };
        modelWfa.Model.Dto.Id = parseInt($('#WfaId').val());
        modelWfa.Model.Dto.Stato = statoWfa.PUBBLICATO;
        bnlhrAjaxCallPOST(urlWfa, modelWfa, function(response) {
            if (response !== null && response.Model.Performed) {
                if (response.Model.Dto !== null) {
                    navigation.Clear();
                    let url = OC.generateUrl("/apps/wfam/gestione_wfa");
                    navigation.GoTo("Gestione WFA", url, {}, function() {
                        LoadWfa();
                    });
                }
            }
        });
    } else {
        EnableControlsRiepilogoWFA(true);
        OC.dialogs.alert('Definire o caricare un flusso', 'Info');
    }

});

$("#app-pages").on('click', '#bnlhr-btnSalvaEsciRiepilogo', function() {
    EnableControlsRiepilogoWFA(false);

    let urlWfa = OC.generateUrl('apps/wfam/wfa/createorupdate');
    let modelWfa = {
        "Model": {
            "Dto": {}
        }
    };
    modelWfa.Model.Dto = {};
    modelWfa.Model.Dto.Id = parseInt($('#WfaId').val());
    modelWfa.Model.Dto.Stato = statoWfa.BOZZA;
    bnlhrAjaxCallPOST(urlWfa, modelWfa, function(response) {
        if (response !== null && response.Model.Performed) {
            if (response.Model.Dto !== null) {
                navigation.Clear();
                url = OC.generateUrl("/apps/wfam/gestione_wfa");
                navigation.GoTo("Gestione WFA", url, model, function(model) {
                    LoadWfa();
                });
            }
        } else {
            EnableControlsRiepilogoWFA(true);
            OC.dialogs.alert('Definire o caricare un flusso', 'Info');
        }
    });
});

$("#app-pages").on('click', '#bnlhr-btnEditPdf', function(event) {
    EnableControlsRiepilogoWFA(false);

    let urlWfa = OC.generateUrl('apps/wfam/wfa/createorupdate');
    let modelWfa = {
        "Model": {
            "Dto": {}
        }
    };
    modelWfa.Model.Dto = {};
    modelWfa.Model.Dto.Id = parseInt($('#WfaId').val());
    modelWfa.Model.Dto.Stato = statoWfa.BOZZA;
    bnlhrAjaxCallPOST(urlWfa, modelWfa, function(response) {
        if (response !== null && response.Model.Performed) {
            if (response.Model.Dto !== null) {
                let model = {};
                model.Dto = response.Model.Dto;
                let url = OC.generateUrl("/apps/wfam/editor");
                navigation.GoTo("PDF editor", url, model, function(model) {
                    model.BaseUrl = OC.generateUrl("");
                    var editorWfa = new EditorWfa(model);
                    editorWfa.PageLoad();
                });
            }
        } else {
            EnableControlsRiepilogoWFA(true);
            OC.dialogs.alert('Definire o caricare un flusso', 'Info');
        }
    });




    event.preventDefault();
})


$("#app-pages").on('click', '#bnlhr-btnIndietroRiepilogo', function(event) {
    EnableControlsRiepilogoWFA(false);

    let model = {
        "Model": {
            "Filter": {}
        }
    };
    model.Model.Filter.WfaId = parseInt($('#WfaId').val());
    IsAzioniDeliberaPageEnabled(function(enabled) {
        if (enabled) {
            navigation.Back(model, function(response) {
                LoadAzioniWfa(response);
            });
        } else {
            navigation.Back(model, function(response) {
                LoadElementiWfa(response);
            });
        }
    })

    event.preventDefault();
});


function EnableControlsRiepilogoWFA(enable) {
    $("#bnlhr-btnPubblicaRiepilogo").prop("disabled", !enable);
    $("#bnlhr-btnIndietroRiepilogo").prop("disabled", !enable);
    $("#bnlhr-btnSalvaEsciRiepilogo").prop("disabled", !enable);
    $("#bnlhr-btnEditPdf").prop("disabled", !enable);

}

function EnableControlsFlussoWFA(enable) {
    $("#bnlhr-btnCaricaFlusso").prop("disabled", !enable);
    $("#bnlhr-btnCreaFlusso").prop("disabled", !enable);
}
$("#app-pages").on('mousemove', '#paper', function(event) {
    if (dragStartPosition)
        paper.translate(
            event.offsetX - dragStartPosition.x,
            event.offsetY - dragStartPosition.y);
});