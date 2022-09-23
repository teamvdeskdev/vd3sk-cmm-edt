/*
  WorkflowManager for Nextcloud 
  workflow.js 
  @author Daniele De Rose <dderose@eway-solutions.it>
  @eWay Enterprise Solutions Srl 2019
*/

var dia = joint.dia;
var util = joint.util;
var standard = joint.shapes.standard;
var erd = joint.shapes.erd;
var devs = joint.shapes.devs;

//Initialize Paper & Graph
var Graph; //= new dia.Graph;
var StencilGraph; // = new dia.Graph;

//TODO: UpperCamelCase all functions' name

var ncWorkflow = {

    Id: "workflowmanager",
    Title: "Workflow Manager",
    NCVersion: "1",
    ConsoleDebug: false,
    allowChangeState: false,
    noElementLabels: false,
    dbBaseUrl: '/apps/workflowmanager',
    ncUsername: 'designer',
    ncPassword: 'designer',

    AppId: null,
    WorkflowId: null,
    OwnerId: null,

    Init: function() {
        //Set Title       
        let url = new URL(window.location.href);
        $('#wfTitle').html(ncWorkflow.Title);
        ncWorkflow.AppId = (url.searchParams.get("AppId") == null ? 'workflowmanager' : url.searchParams.get("AppId"));
        ncWorkflow.WorkflowId = url.searchParams.get("WorkflowId");
        ncWorkflow.OwnerId = url.searchParams.get("OwnerId");

        //TODO : Set AppId as 'workflowmanager'

        //Main Paper
        Paper = new joint.dia.Paper({
            el: $('#paper'),
            interactive: true,
            model: Graph,
            gridSize: 10,
            drawGrid: true,
            perpendicularLinks: true,
            defaultLink: new devs.Link({
                attrs: {
                    '.connection': {
                        stroke: '#999',
                        strokeWidth: '1'

                    },
                    '.marker-target': {
                        fill: '#999',
                        stroke: '#999',
                        // stroke: '#1aa1e2',
                        d: 'M 8 0 L 0 4 L 8 8 z'
                    }
                }
            })
        });

        //StencilPaper
        StencilPaper = new dia.Paper({
            el: $('#stencil'),
            width: 190,
            model: StencilGraph,
            interactive: false
        });


        //set headers for all future request made with jquery
        $.ajaxSetup({
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        this.BindViewTitle();
        //********************************************************StencilPaper events************************************************
        //scroll
        var stancilPaperY = 0;
        StencilPaper.on('blank:mousewheel', function(event, x, y, delta) {
            if (delta == -1) {
                var posY = stancilPaperY -= 10;
                StencilPaper.translate(0, posY);
            } else {
                var posY = stancilPaperY += 10;
                if (posY > 0) {
                    stancilPaperY = 0;
                    posY = 0;
                }
                StencilPaper.translate(0, posY);
            }
        });
        StencilPaper.on('cell:mousewheel', function(child, event, x, y, delta) {
            if (delta == -1) {
                var posY = stancilPaperY -= 10;
                StencilPaper.translate(0, posY);
            } else {
                var posY = stancilPaperY += 10;
                if (posY > 0) {
                    stancilPaperY = 0;
                    posY = 0;
                }
                StencilPaper.translate(0, posY);
            }
        });

        //Drag&Drop        
        StencilPaper.on('cell:pointerdown', function(cellView, e, x, y) {
            if (Paper.options.interactive) {
                if (!engineCheck) {
                    ncWorkflow.DisableStencilPaper();

                    $('#app-content-wrapper').append('<div id="flyPaper" style="background-color: transparent; position:fixed;z-index:100;opacity:0.7;pointer-event:none;"></div>');
                    var flyGraph = new joint.dia.Graph,
                        flyPaper = new joint.dia.Paper({
                            el: $('#flyPaper'),
                            model: flyGraph,
                            interactive: false
                        }),

                        flyShape = cellView.model.clone(),
                        pos = cellView.model.position(),
                        offset = {
                            x: x - pos.x,
                            y: y - pos.y
                        };

                    flyShape.position(0, 0);
                    flyGraph.addCell(flyShape);

                    $("#flyPaper").offset({
                        left: e.pageX - offset.x,
                        top: e.pageY - offset.y
                    });

                    $('#app-content-wrapper').on('mousemove.fly', function(e) {
                        $("#flyPaper").offset({
                            left: e.pageX - offset.x,
                            top: e.pageY - offset.y
                        });
                    });

                    $('#app-content-wrapper').on('mouseup.fly', function(e) {
                        var x = e.pageX,
                            y = e.pageY,
                            target = Paper.$el.offset();

                        // Dropped over paper ?
                        if (x > target.left && x < target.left + Paper.$el.width() && y > target.top && y < target.top + Paper.$el.height()) {
                            var s = flyShape.clone();
                            s.position(x - target.left - offset.x, y - target.top - offset.y);
                            if (cellView.model.attr('root/id') != null) {
                                s.attr('root/id', cellView.model.attr('root/id'));
                            } else {
                                s.attr('root/id', s.id);
                            }
                            Paper.model.addCell(s);
                            if (ncWorkflow.ConsoleDebug) {
                                console.log('DEBUG - Event: New element dropped from Stencil  "' + s.attributes.attrs.label.text + '" of type "' + s.attributes.type + '" with ID: ' + s.id)
                            }
                        }

                        $('#app-content-wrapper').off('mousemove.fly').off('mouseup.fly');
                        flyShape.remove();
                        $('#flyPaper').remove();

                    });
                }
            }
        });

        //********************************************************Paper events*********************************************************

        //Change Label text of an element on dblclick
        Paper.on('element:pointerdblclick', function(cellView, evt, x, y) {
            var appId = ncWorkflow.AppId;
            let blockIdentifier = cellView.model.attr('root/identificativo');
            var array = ["Approvazione", "Delibera", "Rifiuto", "ifthen", "end", "start", "condition"];
            var exists = array.find(x => x == blockIdentifier);
            if (exists == null) {
                //Show PageLoader
                ncWorkflow.ShowPageLoader('', 'content', 10000);
                array = ["step", "mail", "firmadigitale", "pec"];
                exists = array.find(x => x == blockIdentifier);
                if (exists == null)
                    blockIdentifier = "role";
                return $.when(ncWorkflow.getBlockTemplate(blockIdentifier)).then(function($template) {

                    if (blockIdentifier == "firmadigitale")
                        BuildConfigurationFirmaDigitale(cellView, blockIdentifier, $template);

                    else if (blockIdentifier === 'mail')
                        BuildConfigurationEmail(cellView, blockIdentifier, $template);

                    else if (blockIdentifier === 'pec')
                        BuildConfigurationPec(cellView, blockIdentifier, $template);

                    else if (blockIdentifier === 'step')
                        BuildConfigurationStep(cellView, blockIdentifier, $template);
                    else
                        BuildConfigurationRuolo(cellView, blockIdentifier, $template);
                    // //Hide PageLoader
                    ncWorkflow.HidePageLoader('content');
                });
            } else {
                if (ncWorkflow.allowLabeling) {
                    var newLabel = prompt("Inserisci nuova etichetta.", cellView.model.attr('label/text'));
                    if (newLabel != null) {
                        cellView.model.attr('label/text', newLabel);
                    }
                    if (ncWorkflow.ConsoleDebug) {
                        console.log('DEBUG - Event: Element\'s label changer for ' + cellView.model.attributes.type + ' with value ' + newLabel)
                    }
                }
            }
        });

        // //Show/Hide Delete Icon onMouseOver
        Paper.on('element:mouseenter element:mouseleave', function(cellView, e, x, y) {
            if (Paper.options.interactive) {
                if (e.type == "mouseenter") {
                    cellView.model.attr('removeElement/class', '');
                } else if (e.type == "mouseleave") {
                    cellView.model.attr('removeElement/class', 'hideElement');
                }

            }
        });

        //Click Event
        Paper.on('element:pointerdown', function(cellView, e, x, y) {
            if (Paper.options.interactive) {
                if (e.srcElement.id == 'remove') {
                    cellView.model.remove();
                }
            }
        });

        //Attr Change Event
        Paper.model.on('change:attrs', function(cellView) {

        });

        //On link Creates (& Fix mouseover for removeElement /Play Element)
        Paper.model.on('change:source change:target', function(link) {
            //get Source element
            source = Paper.model.getCell(link.get('source').id);
            //hide removeElement
            if (source) {
                source.attr('removeElement/class', 'hideElement');
            }
        });

        //On Right click on an element block (Contextmenu)
        Paper.on('element:contextmenu', function(cellView, evt, x, y) {

        });

        Paper.on('blank:pointerdown', function(event, x, y) {
            dragStartPosition = {
                x: x,
                y: y
            };
        });

        Paper.on('cell:pointerup blank:pointerup', function(cellView, x, y) {
            dragStartPosition = null;
        });
    },

    BindViewTitle: function() {
        let url = OC.generateUrl(ncWorkflow.dbBaseUrl + '/api/read');
        let jsonModel = {
            "Filter": {}
        };
        jsonModel.Filter.WorkflowId = ncWorkflow.WorkflowId;
        jsonModel.Filter.AppId = ncWorkflow.AppId;
        WFAjaxCallPOST(url, jsonModel, function(response) {
            if (response && response.Model && response.Model.Performed && response.Model.Dto) {
                ncWorkflow.Title += " - " + response.Model.Dto.Name;
                $('#wfTitle').html(ncWorkflow.Title);
            }
        })
    },
    //** WF ENGINE SUPPORT METHODS  */
    startWorkFlow: function() {
        try {
            ncWorkflow.ShowPageLoader('', 'content', 30000);
            //let senderID = sender.attr('root/id');
            let url = OC.generateUrl('apps/workflowmanager/api/startworkflow');
            let jsonModel = {
                "Filter": {}
            };
            jsonModel.Filter.AppId = ncWorkflow.AppId;
            jsonModel.Filter.WorkflowId = ncWorkflow.WorkflowId;
            jsonModel.Filter.OwnerId = ncWorkflow.OwnerId;
            jsonModel.Filter.Id = 1; //senderID;
            jsonModel.Filter.Stato = true;
            WFAjaxCallPOST(url, jsonModel, function(response) {
                if (response.Model != null && response.Model.Performed) {
                    let jsonData = {
                        "Model": {}
                    };
                    jsonData.Model = jsonModel
                    ncWorkflow.IsEngineStarted(jsonData, function(isStart) {
                        if (isStart != null && !isStart) {
                            $("#btnStartWorkflow").show();
                            $("#btnLoadEngineLabels").hide();
                        } else {
                            $("#btnStartWorkflow").hide();
                            $("#btnLoadEngineLabels").show();
                        }
                    })
                    OC.dialogs.info('Workflow avviato correttamente', 'Engine');

                } else {
                    OC.dialogs.alert('Errore avvio Workflow', 'Errore');
                }
                ncWorkflow.HidePageLoader('content');
            })
        } catch (error) {
            console.log('ERROR' + error);
        }
    },
    //**... */
    getBlockTemplate: function(type) {
        var defer = $.Deferred();
        if (type != null) { //!this.$messageTemplate) {
            var self = this;
            $.get(OC.filePath('workflowmanager', 'templates/content', type + 'config_template.html'), function(tmpl) {
                // self.$messageTemplate = $(tmpl);
                defer.resolve($(tmpl));
            }).fail(function(jqXHR, textStatus, errorThrown) {
                defer.reject(jqXHR.status, errorThrown);
            });
        } else {
            defer.resolve(null);
        }
        return defer.promise();
    },

    setNoGrid: function() {
        Paper.setGridSize(1);
        Paper.perpendicularLinks = false;
        Paper.drawGrid('grey');
        if (this.ConsoleDebug) {
            console.log('DEBUG - setNoGrid() called ')
        }
    },

    setGrid: function() {
        Paper.setGridSize(10);
        Paper.perpendicularLinks = true;
        Paper.drawGrid('grey');
        if (this.ConsoleDebug) {
            console.log('DEBUG - setGrid() called ')
        }
    },

    ClearPaper: function() {
        Paper.model.clear();
        if (this.ConsoleDebug) {
            console.log('DEBUG - ClearPaper() called ')
        }
    },

    ClearStencil: function() {
        StencilPaper.model.clear();
        if (this.ConsoleDebug) {
            console.log('DEBUG - ClearStencil() called ')
        }
    },

    EnablePaper: function() {
        Paper.setInteractivity(true);
        if (this.ConsoleDebug) {
            console.log('DEBUG - EnablePaper() called ')
        }
    },

    EnableStencilPaper: function() {
        StencilPaper.setInteractivity(true);
        if (this.ConsoleDebug) {
            console.log('DEBUG - EnableStencilPaper() called ')
        }
    },

    DisablePaper: function() {
        Paper.setInteractivity(false);
        if (this.ConsoleDebug) {
            console.log('DEBUG - DisablePaper() called ')
        }
    },

    DisableStencilPaper: function() {
        StencilPaper.setInteractivity(false);
        if (this.ConsoleDebug) {
            console.log('DEBUG - DisableStencilPaper() called ')
        }
    },

    FromString: function(data) {
        Paper.model.fromJSON(JSON.parse(data));
        if (this.ConsoleDebug) {
            console.log('DEBUG - FromString() called with params : ' + data)
        }
    },

    FromJSON: function(json) {
        this.ClearPaper;
        Paper.model.fromJSON(json);
        if (this.ConsoleDebug) {
            console.log('DEBUG - FromJSON() called with params : ' + json)
        }
    },

    stencilFromJSON: function(json) {
        this.ClearStencil;
        StencilPaper.model.fromJSON(json);
        if (this.ConsoleDebug) {
            console.log('DEBUG - Stencil FromJSON() called with params : ' + json)
        }
    },

    ToString: function() {
        let jsonString = JSON.stringify(Paper.model.toJSON());
        if (this.ConsoleDebug) {
            console.log('DEBUG - ToString() called with results : ' + jsonString)
        }
        return jsonString;
    },

    stencilToString: function() {
        let jsonString = JSON.stringify(StencilPaper.model.toJSON());
        if (this.ConsoleDebug) {
            console.log('DEBUG - Stencil ToString() called with results : ' + jsonString)
        }
        return jsonString;
    },

    MakeBaseAuth: function() {
        let tok = this.ncPassword + ':' + this.ncPassword;
        let hash = btoa(tok);
        if (this.ConsoleDebug) {
            console.log('DEBUG - MakeBaseAuth() called with params : ' + this.ncPassword + ':' + this.ncPassword)
        }
        return "Basic " + hash;
    },

    GetDateTime: function() {
        let today = new Date();
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = date + ' ' + time;
        if (this.ConsoleDebug) {
            console.log('DEBUG - GetDateTime() called with results : ' + dateTime)
        }
        return dateTime;
    },

    WriteToDB: function(workflowId, appId, close = "false", callback = null) {

        //Prepare Json Model
        let jsonData = {
            "Model": {}
        };
        jsonData.Model = {
            "Workflow": {
                "AppId": appId,
                "DateTime": ncWorkflow.GetDateTime(),
                "Note": "No note",
                "WorkflowId": workflowId,
                "WorkflowModel": ncWorkflow.ToString(),
                "WorkflowSvg": ncWorkflow.purifyModel(Paper.model),
                "WorkflowObjects": ncWorkflow.stencilToString(),
                "Close": close
            }
        };

        //restore Links status
        this.unpurifyModel(Paper.model);

        //Prepare REST Base URL
        baseUrl = OC.generateUrl(this.dbBaseUrl);

        //Execute AJAX call
        $.ajax({
            url: baseUrl + '/api/createorupdate',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(jsonData),
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', ncWorkflow.MakeBaseAuth());
            },
        }).done(function(response) {
            if (this.ConsoleDebug) {
                console.log('DEBUG - WriteToDB() Successfully executed with results : ' + response.Model)
            }
            if (response != null && response.Model != null && response.Model.Performed) {
                if (ncWorkflow.AppId == 'workflowmanager') {
                    ncWorkflow.OwnerId = response.Model.Dto.id
                    ncWorkflow.IsEngineStarted(jsonData, function(isStart) {
                        if (isStart != null && !isStart) {
                            $("#btnStartWorkflow").show();
                            $("#btnLoadEngineLabels").hide();
                        } else {
                            $("#btnStartWorkflow").hide();
                            $("#btnLoadEngineLabels").show();
                        }
                    })

                }
                ncWorkflow.WorkflowId = workflowId;
                OC.dialogs.info('Salvataggio effettuato.', 'Info');
            }
            if (callback) {
                callback();
            }

        }).fail(function(response, code) {
            if (this.ConsoleDebug) {
                console.log('DEBUG - WriteToDB() Fail to execute with ErrCode : ' + code)
            }
        });

    },

    GetWorkflowElements: function(workflowId, appId, callback) {
        //Prepare RESTful Base URL
        baseUrl = OC.generateUrl(this.dbBaseUrl);

        //Prepare Filter
        let jsonData = {
            "Model": {}
        };
        jsonData.Model = {
            "Filter": {
                "AppId": appId,
                "WorkflowId": workflowId
            }
        };

        $.ajax({
            url: baseUrl + '/api/read',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(jsonData),
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', ncWorkflow.MakeBaseAuth());
            }
        }).done(function(response) {
            if (JSON.parse(response.Model.Performed)) {
                if (response.Model.Dto) {
                    //Get Elements
                    if (response.Model.Dto.WorkflowElements) {
                        if (this.ConsoleDebug) {
                            console.log('DEBUG - GetWorkflowElements() Successfully executed with results : ' + response.Model.Dto)
                        }
                        if (callback) {
                            callback(response.Model.Dto.WorkflowElements, response.Model.Dto.WorkflowModel);
                        };
                    } else {
                        OC.dialogs.alert('No dynamic elements found.', 'Info');
                    }
                } else {
                    OC.dialogs.alert('No dynamic elements found.', 'Info');
                }

            } else {
                OC.dialogs.alert('Error retrieving data.', 'Error');
            }

        }).fail(function(response, code) {
            if (this.ConsoleDebug) {
                console.log('DEBUG - GetWorkflowElements() Fail to execute with ErrCode : ' + code)
            }
        });

    },

    IsEngineStarted: function(model, callback) {
        baseUrl = OC.generateUrl(this.dbBaseUrl);
        $.ajax({
            url: baseUrl + '/api/readengine',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(model),
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', ncWorkflow.MakeBaseAuth());
            }
        }).done(function(response) {
            if (response != null && response.Model != null) {
                if (response.Model.Performed && response.Model.Dto != null) {
                    //Engine not started, so return false
                    if (callback)
                        callback(true);
                } else {
                    if (callback)
                        callback(false);
                }
            } else {
                if (callback)
                    callback(false);
            }

        }).fail(function(response, code) {
            if (this.ConsoleDebug) {
                console.log('DEBUG - IsEngineStarted() Fail to execute with ErrCode : ' + code)
            }
            OC.dialogs.alert('Errore check Engine', 'Dati non trovati');
            if (callback)
                callback(null);
        });
    },

    LoadFromDB: function(workflowId, appId) {
        ncWorkflow.ShowPageLoader('', 'content', 30000);
        //Prepare RESTful Base URL
        baseUrl = OC.generateUrl(this.dbBaseUrl);
        ncWorkflow.AppId = appId;
        ncWorkflow.WorkflowId = workflowId;

        //Prepare Filter
        let jsonData = {
            "Model": {}
        };
        jsonData.Model = {
            "Filter": {
                "AppId": appId,
                "WorkflowId": workflowId
            }
        };

        $.ajax({
            url: baseUrl + '/api/read',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(jsonData),
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', ncWorkflow.MakeBaseAuth());
            }
        }).done(function(response) {
            if (JSON.parse(response.Model.Performed)) {
                if (response.Model.Dto) {
                    //Get Model Data
                    if (response.Model.Dto.WorkflowModel) {
                        Paper.model.fromJSON(JSON.parse(response.Model.Dto.WorkflowModel));
                    }
                    //Set owner as id if is ''workflowmanager'' app

                    //Chck OwnerId
                    if (response.Model.Dto.id) {
                        ncWorkflow.OwnerId = response.Model.Dto.id
                    }

                    //Check if EngineModel exists, if not append playStart                                                
                    jsonData.Model.Filter.OwnerId = response.Model.Dto.id;
                    ncWorkflow.IsEngineStarted(jsonData, function(isStart) {
                        if (isStart != null && !isStart) {
                            if (ncWorkflow.AppId == 'workflowmanager')
                                $("#btnStartWorkflow").show();
                            $("#btnLoadEngineLabels").hide();
                        } else {
                            if (ncWorkflow.AppId == 'workflowmanager')
                                $("#btnStartWorkflow").hide();
                            $("#btnLoadEngineLabels").show();

                        }
                    });


                    //Get Stencil Model Data
                    if (response.Model.Dto.WorkflowObjects && ncWorkflow.AppId != 'wfam') {
                        StencilPaper.model.fromJSON(JSON.parse(response.Model.Dto.WorkflowObjects))
                    } else {
                        if (ncWorkflow.AppId != 'wfam')
                            ncWorkflow.loadDefaultStencilModels();
                    }

                    if (this.ConsoleDebug) {
                        console.log('DEBUG - LoadFromDB() Successfully executed with results : ' + response.Model.Dto)
                    }
                } else {
                    OC.dialogs.alert('No Data found.', 'Info');
                    if (ncWorkflow.AppId != 'wfam')
                        ncWorkflow.loadDefaultStencilModels();
                }

            } else {
                OC.dialogs.alert('Error retrieving data.', 'Error');
                ncWorkflow.loadDefaultStencilModels();
            }
            ncWorkflow.HidePageLoader('content');
        }).fail(function(response, code) {
            if (this.ConsoleDebug) {
                console.log('DEBUG - LoadFromDB() Fail to execute with ErrCode : ' + code)
            }
            ncWorkflow.HidePageLoader('content');
        });
    },

    getDownloadName: function() {
        return "WorkFlow_" + this.Id + '_' + this.GetDateTime() + ".json";
    },

    SaveToFile: function() {
        var jsonString = this.ToString();
        (function() {
            var textFile = null,
                makeTextFile = function(text) {
                    var data = new Blob([text], {
                        type: 'text/plain'
                    });

                    if (textFile !== null) {
                        window.URL.revokeObjectURL(textFile);
                    }
                    textFile = window.URL.createObjectURL(data);
                    return textFile;
                };

            var link = document.getElementById('downloadlink');
            link.setAttribute('download', ncWorkflow.getDownloadName());
            link.href = makeTextFile(jsonString);
            link.click();

        })();
    },

    LoadFromFile: function(file) {

        var textType = /json.*/;

        if (file.type.match(textType)) {
            var reader = new FileReader();

            reader.onload = function(e) {
                Paper.model.fromJSON(JSON.parse(reader.result));
            }
            reader.readAsText(file);

        } else {
            OC.dialogs.alert('Tipo File non supportato.', 'Non Caricato');
        }
        if (ncWorkflow.ConsoleDebug) {
            console.log('DEBUG - LoadFromFile() Successfully executed with results : ' + file.type)
        }
    },

    purifyModel: function(model) {
        try {
            let cells = model.attributes.cells.models;
            for (i = 0; i < cells.length; i++) {
                //Purify links       
                if (cells[i].attributes.type == "devs.Link" || cells[i].attributes.type == "shapes.standard.Link") {

                    cells[i].attr('.link-tools/display', 'none');
                    cells[i].attr('.marker-vertices/display', 'none');
                    cells[i].attr('.marker-arrowheads/display', 'none');
                    cells[i].attr('.connection-wrap/display', 'none');
                    cells[i].attr('.marker-source/display', 'none');

                }
            }
            if (this.ConsoleDebug) {
                console.log('DEBUG - PurifyModel Successfully executed with results : ' + model)
            }
            return JSON.stringify(model);
        } catch (err) {

            if (this.ConsoleDebug) {
                console.log('DEBUG - PurifyModel Failed to execute')
            }
        }
    },

    unpurifyModel: function(model) {
        try {
            let cells = model.attributes.cells.models;
            for (i = 0; i < cells.length; i++) {
                //Purify links       
                if (cells[i].attributes.type == "devs.Link" || cells[i].attributes.type == "shapes.standard.Link") {

                    cells[i].removeAttr('.link-tools/display');
                    cells[i].removeAttr('.marker-vertices/display');
                    cells[i].removeAttr('.marker-arrowheads/display');
                    cells[i].removeAttr('.connection-wrap/display');
                    cells[i].removeAttr('.marker-source/display');

                }
            }
            if (this.ConsoleDebug) {
                console.log('DEBUG - unpurifyModel Successfully executed with results : ' + model)
            }
            return JSON.stringify(model);
        } catch (err) {

            if (this.ConsoleDebug) {
                console.log('DEBUG - unpurifyModel Failed to execute')
            }
        }
    },

    ShowPageLoader: function(loadingMsg, contentTag, forceHideTimeout) {
        $("body").append('<span id="PageLoader" style="position:absolute;left:50%;top:50%" class="icon loading">' + loadingMsg + '</span>"');
        $("#" + contentTag).css({
            opacity: 0.2
        });
        //Hide
        if (forceHideTimeout && forceHideTimeout > 1000) {
            setTimeout(function() {
                ncWorkflow.HidePageLoader(contentTag);
            }, forceHideTimeout);
        }
    },

    HidePageLoader: function(contentTag) {
        $("#PageLoader").remove();
        //Restore opacity
        $("#" + contentTag).css({
            opacity: 1
        });
    },



    //Default Stencils... 
    loadDefaultStencilModels: function() {

        //############################################# INIZIO ############################################################

        var inizio = new standard.Rectangle({
            ports: {
                items: [{
                    id: 'PortOutput',
                    markup: '<rect class="wfElementPortTop" width="110" height="10" y="11" rx="5" x="15" magnet="true" fill="transparent"/>'
                }]
            },
            markup: [{
                    tagName: 'rect',
                    selector: 'body'
                },
                {
                    tagName: 'text',
                    selector: 'label'
                },
                {
                    tagName: 'path',
                    selector: 'removeElement'
                },
                {
                    tagName: 'path',
                    selector: 'tagElement'
                }
            ]
        });
        inizio.position(20, 30);
        inizio.resize(140, 40);
        inizio.attr('root/stato', 'clear');
        inizio.attr('root/startDate', null);
        inizio.attr('root/endDate', null);
        inizio.attr('root/clearStateColor', '#1aa1e2');
        inizio.attr('root/magnet', false);
        inizio.attr('root/identificativo', 'start');
        inizio.attr('body/fill', '#1aa1e2');
        inizio.attr('body/stroke', 'blue');
        inizio.attr('body/strokeWidth', '0.5');
        inizio.attr('body/rx', '20');
        inizio.attr('body/ry', '20');
        inizio.attr('label/text', 'Inizio');
        inizio.attr('label/fontSize', '11');
        // inizio.attr('label/fontWeight', 'bold');
        inizio.attr('label/fill', 'white');
        inizio.attr('removeElement/id', 'remove');
        inizio.attr('removeElement/class', 'hideElement');
        inizio.attr('removeElement/d', 'M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z');
        inizio.attr('removeElement/title', 'Rimuovi');
        inizio.attr('removeElement/fill', 'red');
        inizio.attr('removeElement/cursor', 'pointer');
        inizio.attr('removeElement/stroke', 'red');
        inizio.attr('removeElement/strokeWidth', '3');
        inizio.attr('removeElement/transform', 'scale(.9) translate(-10,-10)');
        inizio.addTo(StencilPaper.model);

        //#############################################  END  ############################################################        
        var fine = new standard.Rectangle({
            ports: {
                items: [{
                    id: 'PortInput',
                    markup: '<rect class="wfElementPortBottom" width="110" height="10" y="-20" rx="5" x="15" magnet="passive" fill="transparent"/>'
                }]
            },
            markup: [{
                    tagName: 'rect',
                    selector: 'body'
                },
                {
                    tagName: 'text',
                    selector: 'label'
                },
                {
                    tagName: 'path',
                    selector: 'removeElement'
                },
                {
                    tagName: 'path',
                    selector: 'tagElement'
                }
            ]
        });
        fine.position(20, 80);
        fine.resize(140, 40);
        fine.attr('root/stato', 'clear');
        fine.attr('root/clearStateColor', '#0c4e7a');
        fine.attr('root/magnet', false);
        fine.attr('root/identificativo', 'end');
        fine.attr('body/fill', '#0c4e7a');
        fine.attr('body/stroke', 'darkblue');
        fine.attr('body/strokeWidth', '0.5');
        fine.attr('body/rx', '20');
        fine.attr('body/ry', '20');
        fine.attr('label/text', 'Fine');
        fine.attr('label/fontSize', '11');
        fine.attr('label/fill', 'white');
        fine.attr('removeElement/id', 'remove');
        fine.attr('removeElement/class', 'hideElement');
        fine.attr('removeElement/d', 'M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z');
        fine.attr('removeElement/title', 'Rimuovi');
        fine.attr('removeElement/fill', 'red');
        fine.attr('removeElement/cursor', 'pointer');
        fine.attr('removeElement/stroke', 'red');
        fine.attr('removeElement/strokeWidth', '3');
        fine.attr('removeElement/transform', 'scale(.9) translate(-10,-10)');

        fine.addTo(StencilPaper.model);

        //#############################################  END APPROVAZIONE ############################################################        
        var approvazione = new standard.Rectangle({
            ports: {
                items: [{
                    id: 'PortInput',
                    markup: '<rect class="wfElementPortBottom" width="110" height="10" y="-20" rx="5" x="15" magnet="passive" fill="transparent"/>'
                }]
            },
            markup: [{
                    tagName: 'rect',
                    selector: 'body'
                },
                {
                    tagName: 'text',
                    selector: 'label'
                },
                {
                    tagName: 'path',
                    selector: 'removeElement'
                },
                {
                    tagName: 'path',
                    selector: 'tagElement'
                }
            ]
        });
        approvazione.position(20, 130);
        approvazione.resize(140, 40);
        approvazione.attr('root/stato', 'clear');
        approvazione.attr('root/clearStateColor', '#0c4e7a');
        approvazione.attr('root/magnet', false);
        approvazione.attr('root/identificativo', 'Approvazione');
        approvazione.attr('body/fill', '#0c4e7a');
        approvazione.attr('body/stroke', 'darkblue');
        approvazione.attr('body/strokeWidth', '0.5');
        approvazione.attr('body/rx', '20');
        approvazione.attr('body/ry', '20');
        approvazione.attr('label/text', 'Approvazione');
        approvazione.attr('label/fontSize', '11');
        approvazione.attr('label/fill', 'white');
        approvazione.attr('removeElement/id', 'remove');
        approvazione.attr('removeElement/class', 'hideElement');
        approvazione.attr('removeElement/d', 'M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z');
        approvazione.attr('removeElement/title', 'Rimuovi');
        approvazione.attr('removeElement/fill', 'red');
        approvazione.attr('removeElement/cursor', 'pointer');
        approvazione.attr('removeElement/stroke', 'red');
        approvazione.attr('removeElement/strokeWidth', '3');
        approvazione.attr('removeElement/transform', 'scale(.9) translate(-10,-10)');

        approvazione.addTo(StencilPaper.model);

        //#############################################  END RIFIUTO ############################################################        
        var rifiuto = new standard.Rectangle({
            ports: {
                items: [{
                    id: 'PortInput',
                    markup: '<rect class="wfElementPortBottom" width="110" height="10" y="-20" rx="5" x="15" magnet="passive" fill="transparent"/>'
                }]
            },
            markup: [{
                    tagName: 'rect',
                    selector: 'body'
                },
                {
                    tagName: 'text',
                    selector: 'label'
                },
                {
                    tagName: 'path',
                    selector: 'removeElement'
                },
                {
                    tagName: 'path',
                    selector: 'tagElement'
                }
            ]
        });
        rifiuto.position(20, 180);
        rifiuto.resize(140, 40);
        rifiuto.attr('root/stato', 'clear');
        rifiuto.attr('root/clearStateColor', '#0c4e7a');
        rifiuto.attr('root/magnet', false);
        rifiuto.attr('root/identificativo', 'Rifiuto');
        rifiuto.attr('body/fill', '#0c4e7a');
        rifiuto.attr('body/stroke', 'darkblue');
        rifiuto.attr('body/strokeWidth', '0.5');
        rifiuto.attr('body/rx', '20');
        rifiuto.attr('body/ry', '20');
        rifiuto.attr('label/text', 'Rifiuto');
        rifiuto.attr('label/fontSize', '11');
        rifiuto.attr('label/fill', 'white');
        rifiuto.attr('removeElement/id', 'remove');
        rifiuto.attr('removeElement/class', 'hideElement');
        rifiuto.attr('removeElement/d', 'M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,24.248 16.447,18.746 21.948,24.248z');
        rifiuto.attr('removeElement/title', 'Rimuovi');
        rifiuto.attr('removeElement/fill', 'red');
        rifiuto.attr('removeElement/cursor', 'pointer');
        rifiuto.attr('removeElement/stroke', 'red');
        rifiuto.attr('removeElement/strokeWidth', '3');
        rifiuto.attr('removeElement/transform', 'scale(.9) translate(-10,-10)');

        rifiuto.addTo(StencilPaper.model);



        //############################################# CONDIZIONE  #################################        
        var condizione = new standard.Polygon({
            ports: {
                items: [{
                        id: "PortInput",
                        label: {
                            position: {
                                args: {
                                    x: 72,
                                    y: -12
                                }
                            },
                            markup: '<text font-size="9" class="label-text" fill="blue"/>'
                        },
                        attrs: {
                            text: {
                                text: 'In'
                            }
                        },
                        markup: '<polygon class="wfConditionPort" points="34,6 68,-8 102,6"  magnet="passive" fill="transparent"/>'
                    },
                    {
                        id: "PortRifiuta",
                        label: {
                            position: {
                                args: {
                                    x: 150,
                                    y: -5
                                }
                            },
                            markup: '<text font-size="9" class="label-text" fill="blue"/>'
                        },
                        attrs: {
                            text: {
                                text: 'Rifiuta'
                            }
                        },
                        markup: '<polygon  class="wfConditionPort" points="118,-2 118,15 139,7"  magnet="true" fill="#b620e0"/>'
                    },
                    {
                        id: "PortModifica",
                        label: {
                            position: {
                                args: {
                                    x: 12,
                                    y: -15
                                }
                            },
                            markup: '<text font-size="9" class="label-text" fill="blue"/>'
                        },
                        attrs: {
                            text: {
                                text: 'Modifica'
                            }
                        },
                        markup: '<polygon display="block" class="wfConditionPort" points="-3,-5 20,-12 20,2"  magnet="true" fill="transparent"/>'
                    },
                    {
                        id: "PortApprova",
                        label: {
                            position: {
                                args: {
                                    x: 84,
                                    y: 12
                                }
                            },
                            markup: '<text font-size="9" class="label-text" fill="blue"/>'
                        },
                        attrs: {
                            text: {
                                text: 'Accetta'
                            }
                        },
                        markup: '<polygon class="wfConditionPort" points="36,-5 68,8 100,-5"  magnet="true" fill="transparent"/>'
                    }
                ]
            },
            markup: [{
                    tagName: 'polygon',
                    selector: 'body'
                },
                {
                    tagName: 'text',
                    selector: 'label'
                },
                {
                    tagName: 'path',
                    selector: 'removeElement'
                }
            ]

        });
        condizione.position(23, 235);
        condizione.resize(136, 55);
        condizione.attr('root/stato', 'clear');
        condizione.attr('root/clearStateColor', '#DDD');
        condizione.attr('root/magnet', false);
        condizione.attr('root/condizione', '');
        condizione.attr('root/identificativo', 'condition');
        condizione.attr('body/refPoints', '0,10 10,0 20,10 10,20');
        condizione.attr('body/fill', '#b620e0');
        condizione.attr('body/stroke', '#b620e0');
        condizione.attr('body/rx', '20');
        condizione.attr('body/ry', '20');
        condizione.attr('label/text', 'Condizionale');
        condizione.attr('label/fontSize', '11');
        // condizione.attr('label/fontWeight', 'bold');
        condizione.attr('label/fill', 'white');
        condizione.attr('removeElement/id', 'remove');
        condizione.attr('removeElement/class', 'hideElement');
        condizione.attr('removeElement/d', 'M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z');
        condizione.attr('removeElement/title', 'Rimuovi');
        condizione.attr('removeElement/fill', 'red');
        condizione.attr('removeElement/cursor', 'pointer');
        condizione.attr('removeElement/stroke', 'red');
        condizione.attr('removeElement/strokeWidth', '3');
        condizione.attr('removeElement/transform', 'scale(.9) translate(15,-5)');

        if (this.noElementLabels) {
            condizione.portProp('PortInput', 'attrs/text/text', '');
            condizione.portProp('PortRifiuta', 'attrs/text/text', '');
            condizione.portProp('PortApprova', 'attrs/text/text', '');
        }

        condizione.addTo(StencilPaper.model);




        //############################################# RECT BASE (STEP) #################################   

        var baserect = new standard.Rectangle({
            ports: {
                items: [{
                        id: 'PortInput',
                        markup: '<rect class="wfElementPortTop" width="110" height="10" y="-11" rx="5" x="15" magnet="passive" fill="transparent"/>'
                    },
                    {
                        id: 'PortOutput',
                        markup: '<rect class="wfElementPortBottom" width="110" height="10" y="1" rx="5" x="15" magnet="true" fill="transparent"/>'
                    }
                ]
            },
            markup: [{
                    tagName: 'rect',
                    selector: 'body'
                },
                {
                    tagName: 'text',
                    selector: 'label'
                },
                {
                    tagName: 'path',
                    selector: 'removeElement'
                },
                {
                    tagName: 'path',
                    selector: 'tagElement'
                }
            ]
        });
        baserect.position(20, 305);
        baserect.resize(140, 40);
        baserect.attr('root/stato', 'clear');
        baserect.attr('root/clearStateColor', 'darkorange');
        baserect.attr('root/magnet', false);
        baserect.attr('root/identificativo', 'step');
        baserect.attr('body/fill', 'darkorange');
        baserect.attr('body/stroke', 'darkred');
        baserect.attr('body/strokeWidth', '0.5');
        baserect.attr('body/rx', '20');
        baserect.attr('body/ry', '20');
        baserect.attr('label/text', 'Step');
        baserect.attr('label/fontSize', '11');
        // baserect.attr('label/fontWeight', 'bold');
        baserect.attr('label/fill', 'white');
        baserect.attr('removeElement/id', 'remove');
        baserect.attr('removeElement/class', 'hideElement');
        baserect.attr('removeElement/d', 'M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z');
        baserect.attr('removeElement/title', 'Rimuovi');
        baserect.attr('removeElement/fill', 'red');
        baserect.attr('removeElement/cursor', 'pointer');
        baserect.attr('removeElement/stroke', 'red');
        baserect.attr('removeElement/strokeWidth', '3');
        baserect.attr('removeElement/transform', 'scale(.9) translate(-10,-10)');

        baserect.addTo(StencilPaper.model);

        //############################################# NOTIFICA MAIL #################################   

        var mailblock = new standard.Rectangle({
            ports: {
                items: [{
                        id: 'PortInput',
                        markup: '<rect class="wfElementPortTop" width="110" height="10" y="-11" rx="5" x="15" magnet="passive" fill="transparent"/>'
                    },
                    {
                        id: 'PortOutput',
                        markup: '<rect class="wfElementPortBottom" width="110" height="10" y="1" rx="5" x="15" magnet="true" fill="transparent"/>'
                    }
                ]
            },
            markup: [{
                    tagName: 'rect',
                    selector: 'body'
                },
                {
                    tagName: 'text',
                    selector: 'label'
                },
                {
                    tagName: 'path',
                    selector: 'removeElement'
                },
                {
                    tagName: 'path',
                    selector: 'tagElement'
                },
                {
                    tagName: 'path',
                    selector: 'icon'
                        // children: [{
                        //     tagName: 'rect',
                        //     selector: 'innerIconRect1',                                             
                        // }, {
                        //     tagName: 'rect',
                        //     selector: 'innerIconRect2',     
                        // }, {
                        //     tagName: 'path',
                        //     selector: 'innerIconPath',                       

                    // }]
                }
            ]
        });
        mailblock.position(20, 355);
        mailblock.resize(140, 40);
        mailblock.attr('root/stato', 'clear');
        mailblock.attr('root/clearStateColor', '#c4af3c');
        mailblock.attr('root/magnet', false);
        mailblock.attr('root/identificativo', 'mail');
        mailblock.attr('body/fill', '#ffff00d3');
        mailblock.attr('body/stroke', '#c4af3c');
        mailblock.attr('body/strokeWidth', '0.5');
        mailblock.attr('body/rx', '2');
        mailblock.attr('body/ry', '2');
        mailblock.attr('label/text', 'E-Mail');
        mailblock.attr('label/fontSize', '11');
        // mailblock.attr('label/fontWeight', 'bold');
        mailblock.attr('label/fill', 'black');
        mailblock.attr('removeElement/id', 'remove');
        mailblock.attr('removeElement/class', 'hideElement');
        mailblock.attr('removeElement/d', 'M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z');
        mailblock.attr('removeElement/title', 'Rimuovi');
        mailblock.attr('removeElement/fill', 'red');
        mailblock.attr('removeElement/cursor', 'pointer');
        mailblock.attr('removeElement/stroke', 'red');
        mailblock.attr('removeElement/strokeWidth', '3');
        mailblock.attr('removeElement/transform', 'scale(.9) translate(-10,-10)');

        mailblock.attr('icon/fill', 'darkorange');
        mailblock.attr('icon/d', 'm0.89 3c-0.4924 0-0.89 0.4-0.89 0.89v8.2202c0 0.493 0.4 0.89 0.89 0.89h14.22c0.492 0 0.89-0.4 0.89-0.89v-8.2202c0-0.4924-0.4-0.89-0.89-0.89zm0.75 1.0278 6.0827 6.0817h0.52773l6.1102-6.0817 0.611 0.6109-3.6384 3.6934 2.75 2.8047-0.61102 0.61092-2.8052-2.8047-2.0275 2.0549h-1.2776l-2.0271-2.0553-2.8053 2.8323-0.6111-0.639 2.7774-2.8046-3.666-3.6932z');
        mailblock.attr('icon/transform', 'scale(1.5) translate(-5,15)')

        mailblock.addTo(StencilPaper.model);


        //############################################# PEC BLOCK #################################   

        var pecblock = new standard.Rectangle({
            ports: {
                items: [{
                        id: 'PortInput',
                        markup: '<rect class="wfElementPortTop" width="110" height="10" y="-11" rx="5" x="15" magnet="passive" fill="transparent"/>'
                    },
                    {
                        id: 'PortOutput',
                        markup: '<rect class="wfElementPortBottom" width="110" height="10" y="1" rx="5" x="15" magnet="true" fill="transparent"/>'
                    }
                ]
            },
            markup: [{
                    tagName: 'rect',
                    selector: 'body'
                },
                {
                    tagName: 'text',
                    selector: 'label'
                },
                {
                    tagName: 'path',
                    selector: 'removeElement'
                },
                {
                    tagName: 'path',
                    selector: 'tagElement'
                },
                {
                    tagName: 'path',
                    selector: 'icon'
                }
            ]
        });
        pecblock.position(20, 405);
        pecblock.resize(140, 40);
        pecblock.attr('root/stato', 'clear');
        pecblock.attr('root/clearStateColor', 'darkkhaki');
        pecblock.attr('root/magnet', false);
        pecblock.attr('root/identificativo', 'pec');
        pecblock.attr('body/fill', 'darkkhaki');
        pecblock.attr('body/stroke', 'red');
        pecblock.attr('body/strokeWidth', '0.5');
        pecblock.attr('body/rx', '3');
        pecblock.attr('body/ry', '4');
        pecblock.attr('label/text', 'PEC');
        pecblock.attr('label/fontSize', '11');
        // pecblock.attr('label/fontWeight', 'bold');
        pecblock.attr('label/fill', 'darkred');
        pecblock.attr('removeElement/id', 'remove');
        pecblock.attr('removeElement/class', 'hideElement');
        pecblock.attr('removeElement/d', 'M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z');
        pecblock.attr('removeElement/title', 'Rimuovi');
        pecblock.attr('removeElement/fill', 'red');
        pecblock.attr('removeElement/cursor', 'pointer');
        pecblock.attr('removeElement/stroke', 'red');
        pecblock.attr('removeElement/strokeWidth', '3');
        pecblock.attr('removeElement/transform', 'scale(.9) translate(-10,-10)');
        pecblock.attr('icon/d', 'M312.686,223.086h16.718c-5.224,11.494-13.584,19.853-25.078,26.122c-12.539,7.314-28.212,10.449-47.02,10.449c-17.763,0-33.437-3.135-45.976-9.404c-12.539-6.269-22.988-14.629-29.257-27.167' +
            'c-6.269-11.494-9.404-25.078-9.404-38.661c0-15.673,3.135-29.257,10.449-42.841c7.314-13.584,16.718-22.988,29.257-29.257' +
            'c12.539-6.269,27.167-9.404,42.841-9.404c13.584,0,26.122,3.135,36.571,8.359c10.449,5.224,18.808,12.539,24.033,22.988' +
            'c5.224,9.404,8.359,20.898,8.359,32.392c0,13.584-4.18,26.122-12.539,37.616c-10.449,14.629-24.033,20.898-40.751,20.898' +
            'c-4.18,0-8.359-1.045-10.449-2.09c-2.09-2.09-4.18-4.18-4.18-7.314c-6.269,6.269-13.584,9.404-21.943,9.404' +
            'c-9.404,0-16.718-3.135-21.943-9.404c-6.269-6.269-9.404-14.629-9.404-25.078c0-12.539,3.135-24.033,10.449-35.527' +
            'c8.359-12.539,19.853-18.808,33.437-18.808c9.404,0,16.718,4.18,21.943,11.494l2.09-9.404h21.943l-12.539,58.514' +
            'c-1.045,4.18-1.045,6.269-1.045,7.314s0,2.09,1.045,3.135s1.045,1.045,2.09,1.045c2.09,0,6.269-2.09,10.449-5.224' +
            'c5.224-4.18,10.449-9.404,13.584-16.718c3.135-7.314,5.224-14.629,5.224-21.943c0-13.584-5.224-25.078-14.629-33.437' +
            'c-9.404-9.404-22.988-13.584-40.751-13.584c-14.629,0-27.167,3.135-37.616,9.404c-10.449,6.269-17.763,14.629-22.988,25.0' +
            's-7.314,21.943-7.314,34.482c0,11.494,3.135,21.943,8.359,31.347c6.269,9.404,13.584,16.718,24.033,20.898' +
            'c10.449,4.18,21.943,6.269,35.527,6.269c12.539,0,24.033-2.09,33.437-5.224C299.102,235.624,306.416,230.4,312.686,223.08' +
            ' M223.869,189.649c0,7.314,1.045,11.494,4.18,15.673c3.135,3.135,6.269,5.224,10.449,5.224c3.135,0,6.269-1.045,8.359-2.0' +
            'c2.09-1.045,4.18-3.135,6.269-5.224c3.135-3.135,5.225-8.359,7.314-14.629c2.09-6.269,3.135-12.539,3.135-17.763' +
            'c0-6.269-1.045-10.449-4.18-14.629c-3.135-3.135-6.269-5.224-10.449-5.224c-4.18,0-9.404,2.09-12.539,5.224' +
            'c-4.18,3.135-7.314,8.359-9.404,15.673C224.914,178.155,223.869,184.424,223.869,189.649z');
        pecblock.attr('icon/fill', 'red');
        pecblock.attr('icon/transform', 'scale(.14) translate(-230,50)')

        pecblock.addTo(StencilPaper.model);

        //############################################# FIRMA DIGITALE #################################   

        var firmadigitale = new standard.Rectangle({
            ports: {
                items: [{
                        id: 'PortInput',
                        markup: '<rect class="wfElementPortTop" width="110" height="10" y="-11" rx="5" x="15" magnet="passive" fill="transparent"/>'
                    },
                    {
                        id: 'PortOutput',
                        markup: '<rect class="wfElementPortBottom" width="110" height="10" y="1" rx="5" x="15" magnet="true" fill="transparent"/>'
                    }
                ]
            },
            markup: [{
                    tagName: 'rect',
                    selector: 'body'
                },
                {
                    tagName: 'text',
                    selector: 'label'
                },
                {
                    tagName: 'path',
                    selector: 'removeElement'
                },
                {
                    tagName: 'path',
                    selector: 'tagElement'
                },
                {
                    tagName: 'path',
                    selector: 'icon'
                }
            ]
        });
        firmadigitale.position(20, 455);
        firmadigitale.resize(140, 40);
        firmadigitale.attr('root/stato', 'clear');
        firmadigitale.attr('root/clearStateColor', '#DDD');
        firmadigitale.attr('root/magnet', false);
        firmadigitale.attr('root/identificativo', 'firmadigitale');
        firmadigitale.attr('body/fill', '#DDD');
        firmadigitale.attr('body/stroke', 'darkred');
        firmadigitale.attr('body/strokeWidth', '0.5');
        firmadigitale.attr('body/rx', '3');
        firmadigitale.attr('body/ry', '4');
        firmadigitale.attr('label/text', 'Firma Digitale');
        firmadigitale.attr('label/fontSize', '11');
        firmadigitale.attr('label/fill', 'blue');
        firmadigitale.attr('removeElement/id', 'remove');
        firmadigitale.attr('removeElement/class', 'hideElement');
        firmadigitale.attr('removeElement/d', 'M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z');
        firmadigitale.attr('removeElement/title', 'Rimuovi');
        firmadigitale.attr('removeElement/fill', 'red');
        firmadigitale.attr('removeElement/cursor', 'pointer');
        firmadigitale.attr('removeElement/stroke', 'red');
        firmadigitale.attr('removeElement/strokeWidth', '3');
        firmadigitale.attr('removeElement/transform', 'scale(.9) translate(-10,-10)');
        firmadigitale.attr('icon/d', 'M176 450 c-65 -20 -105 -93 -86 -159 5 -18 14 -39 20 -46 8 -9 -1 -33 -35 -90 l-46 -77 39 7 c39 6 40 6 49 -32 l9 -38 43 78 c49 88 41 90 101 -18 l34 -60 9 38 c8 34 13 38 33 34 34 -6 32 29 -6 93 -29 49 -29 52 -13 76 21 33 21 105 0 138 -33 49 -96 72 -151 56z m115 -49 c24 -24 29 -38 29 -76 0 -38 -5 -52 -29 -76 -42 -42 -110 -42 -152 0 -42 42 -42 110 0 152 24 24 38 29 76 29 38 0 52 -5 76 -29z');
        firmadigitale.attr('icon/fill', 'darkred');
        firmadigitale.attr('icon/transform', 'scale(.06) translate(-150,330)');

        firmadigitale.addTo(StencilPaper.model);

        //###########################################IF THEN #############################

        var if_then_mod = new standard.Polygon({
            ports: {
                items: [{
                        id: "PortInput",
                        label: {
                            position: {
                                args: {
                                    x: 72,
                                    y: -12
                                }
                            },
                            markup: '<text font-size="9" class="label-text" fill="blue"/>'
                        },
                        attrs: {
                            text: {
                                text: 'In'
                            }
                        },
                        markup: '<polygon class="wfConditionPort" points="34,6 68,-8 102,6"  magnet="passive" fill="transparent"/>'
                    },
                    {
                        id: "PortModifica",
                        label: {
                            position: {
                                args: {
                                    x: 150,
                                    y: -5
                                }
                            },
                            markup: '<text font-size="9" class="label-text" fill="blue"/>'
                        },
                        attrs: {
                            text: {
                                text: 'False'
                            }
                        },
                        markup: '<polygon  class="wfConditionPort" points="118,-2 118,15 139,7"  magnet="true" fill="transparent"/>'
                    },
                    {
                        id: "PortRifiuta",
                        label: {
                            position: {
                                args: {
                                    x: 12,
                                    y: -15
                                }
                            },
                            markup: '<text font-size="9" class="label-text" fill="blue"/>'
                        },
                        attrs: {
                            text: {
                                text: ''
                            }
                        },
                        markup: '<polygon style="display:none" class="wfConditionPort" points="-3,-5 20,-12 20,2"  magnet="true" fill="transparent"/>'
                    },
                    {
                        id: "PortApprova",
                        label: {
                            position: {
                                args: {
                                    x: 84,
                                    y: 12
                                }
                            },
                            markup: '<text font-size="9" class="label-text" fill="blue"/>'
                        },
                        attrs: {
                            text: {
                                text: 'True'
                            }
                        },
                        markup: '<polygon class="wfConditionPort" points="36,-5 68,8 100,-5"  magnet="true" fill="transparent"/>'
                    }
                ]
            },
            markup: [{
                    tagName: 'polygon',
                    selector: 'body'
                },
                {
                    tagName: 'text',
                    selector: 'label'
                },
                {
                    tagName: 'path',
                    selector: 'removeElement'
                }
            ]

        });
        if_then_mod.position(23, 510);
        if_then_mod.resize(136, 55);
        if_then_mod.attr('root/stato', 'clear');
        if_then_mod.attr('root/clearStateColor', '#646b25');
        if_then_mod.attr('root/magnet', false);
        if_then_mod.attr('root/condizione', '');
        if_then_mod.attr('root/identificativo', 'ifthen');
        if_then_mod.attr('body/refPoints', '0,10 10,0 20,10 10,20');
        if_then_mod.attr('body/fill', '#646b25');
        if_then_mod.attr('body/stroke', '#646b25');
        if_then_mod.attr('body/rx', '20');
        if_then_mod.attr('body/ry', '20');
        if_then_mod.attr('label/text', 'If Then');
        if_then_mod.attr('label/fontSize', '11');
        if_then_mod.attr('label/fill', 'white');
        if_then_mod.attr('removeElement/id', 'remove');
        if_then_mod.attr('removeElement/class', 'hideElement');
        if_then_mod.attr('removeElement/d', 'M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z');
        if_then_mod.attr('removeElement/title', 'Rimuovi');
        if_then_mod.attr('removeElement/fill', 'red');
        if_then_mod.attr('removeElement/cursor', 'pointer');
        if_then_mod.attr('removeElement/stroke', 'red');
        if_then_mod.attr('removeElement/strokeWidth', '3');
        if_then_mod.attr('removeElement/transform', 'scale(.9) translate(15,-5)');

        if (this.noElementLabels) {
            if_then_mod.portProp('PortInput', 'attrs/text/text', '');
            if_then_mod.portProp('PortRifiuta', 'attrs/text/text', '');
            if_then_mod.portProp('PortApprova', 'attrs/text/text', '');
        }
        //Add it to Stencil Paper
        if_then_mod.addTo(StencilPaper.model);
    },
    //...
    loadBnlhrStencilModels: function() {

        //############################################# USER R:HRBP ############################################################

        var ruser = new standard.Rectangle({
            ports: {
                items: [{
                    id: 'PortOutput',
                    markup: '<rect class="wfElementPortTop" width="110" height="10" y="11" rx="5" x="15" magnet="true" fill="#dc2987"/>'
                }]
            },
            markup: [{
                    tagName: 'rect',
                    selector: 'body'
                },
                {
                    tagName: 'text',
                    selector: 'label'
                },
                {
                    tagName: 'path',
                    selector: 'removeElement'
                },
                {
                    tagName: 'path',
                    selector: 'tagElement'
                }

            ]
        });
        //   ruser.position(20, 30);
        ruser.resize(140, 40);
        // rect.addPorts([port]);
        ruser.attr('root/stato', 'clear');
        ruser.attr('root/startDate', '');
        ruser.attr('root/endDate', '');
        ruser.attr('root/clearStateColor', '#dc2987');
        ruser.attr('root/magnet', false);
        ruser.attr('root/identificativo', 'R');
        ruser.attr('body/fill', '#dc2987');
        ruser.attr('body/stroke', '#dc2987');
        ruser.attr('body/rx', '20');
        ruser.attr('body/ry', '20');
        ruser.attr('label/text', 'R');
        ruser.attr('label/fontSize', '12');
        ruser.attr('label/fontWeight', 'bold');
        ruser.attr('label/fill', 'white');

        ruser.attr('removeElement/id', 'remove');
        ruser.attr('removeElement/class', 'hideElement');
        ruser.attr('removeElement/d', 'M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z');
        ruser.attr('removeElement/title', 'Rimuovi');
        ruser.attr('removeElement/fill', 'red');
        ruser.attr('removeElement/cursor', 'pointer');
        ruser.attr('removeElement/stroke', 'red');
        ruser.attr('removeElement/strokeWidth', '3');
        ruser.attr('removeElement/transform', 'scale(.9) translate(-10,-10)');

        ruser.attr('tagElement/d', 'M 50.0435 33.6075 L 56.2861 30.3061 C 56.1633 29.0828 55.9256 27.8949 55.6298 26.73 L 48.6953 25.77 C 48.0956 24.324 47.3027 22.9832 46.3701 21.7525 L 49.0139 15.2518 C 48.1451 14.4041 47.2063 13.6315 46.2184 12.9206 L 40.3313 16.6169 C 38.9499 15.8894 37.4625 15.3391 35.9004 14.9848 L 33.774 8.39176 C 33.1703 8.34778 32.5658 8.29958 31.9509 8.29958 S 30.7342 8.34633 30.1295 8.39176 L 28.0219 14.9267 C 26.4179 15.2693 24.8976 15.8273 23.4821 16.5609 L 17.686 12.9206 C 16.6995 13.6315 15.7608 14.4041 14.8917 15.2518 L 17.4622 21.5716 C 16.4602 22.8567 15.6217 24.2722 14.9918 25.8001 L 8.27596 26.7285 C 7.9812 27.8938 7.74226 29.0792 7.62207 30.3046 L 13.6484 33.4924 C 13.7166 35.1723 13.9949 36.7992 14.4871 38.3308 L 9.94068 43.358 C 10.4695 44.4544 11.0588 45.5186 11.7396 46.5164 L 18.4336 45.0798 C 19.5315 46.2722 20.7813 47.3195 22.1603 48.1849 L 21.9072 55.0332 C 23.0065 55.5292 24.1489 55.9442 25.3266 56.2758 L 29.5602 50.8324 C 30.3115 50.9288 31.072 50.9932 31.8486 50.9932 C 32.6887 50.9932 33.5117 50.9174 34.3202 50.8058 L 38.5771 56.2794 C 39.7557 55.9467 40.8955 55.5332 41.9946 55.0375 L 41.7366 48.0646 C 43.051 47.2148 44.2437 46.1961 45.295 45.0455 L 52.1625 46.5201 C 52.8444 45.5222 53.4326 44.4597 53.9614 43.3616 L 49.2668 38.1701 C 49.7184 36.7194 49.9703 35.1874 50.0435 33.6075 Z M 39.6695 41.5375 L 36.7098 43.4642 L 34.8895 40.6674 C 33.9419 41.0316 32.9224 41.253 31.8486 41.253 C 27.1542 41.253 23.3506 37.4467 23.3506 32.7551 C 23.3506 28.0607 27.1542 24.2582 31.8486 24.2582 C 36.5402 24.2582 40.3454 28.0607 40.3454 32.7551 C 40.3454 35.0991 39.3952 37.2204 37.861 38.7586 L 39.6695 41.5375 Z');
        ruser.attr('tagElement/transform', 'scale(.8) translate(150,-30)');
        ruser.attr('tagElement/title', 'In Corso...');
        ruser.attr('tagElement/fill', 'green');
        ruser.attr('tagElement/id', 'tagElement');
        ruser.attr('tagElement/stroke', '#333');
        ruser.attr('tagElement/strokeWidth', '1');
        ruser.attr('tagElement/class', 'hideElement');

        // ruser.addTo(StencilPaper.model);

        //############################################# Azione END  ############################################################        
        var azione = new standard.Rectangle({
            ports: {
                items: [{
                    id: 'PortInput',
                    markup: '<rect class="wfElementPortBottom" width="110" height="10" y="-20" rx="5" x="15" magnet="passive" fill="#d94494"/>'
                }]
            },
            markup: [{
                    tagName: 'rect',
                    selector: 'body'
                },
                {
                    tagName: 'text',
                    selector: 'label'
                },
                {
                    tagName: 'path',
                    selector: 'removeElement'
                },
                {
                    tagName: 'path',
                    selector: 'tagElement'
                }
            ]
        });
        // azione.position(20, 80);
        azione.resize(140, 40);
        azione.attr('root/stato', 'clear');
        azione.attr('root/clearStateColor', '#d94494');
        azione.attr('root/startDate', '');
        azione.attr('root/endDate', '');
        azione.attr('root/magnet', false);
        azione.attr('root/identificativo', 'Protocollo');
        azione.attr('body/fill', '#d94494');
        azione.attr('body/stroke', '#d94494');
        azione.attr('body/rx', '20');
        azione.attr('body/ry', '20');
        azione.attr('label/text', 'Protocollo Documenti');
        azione.attr('label/fontSize', '11');
        azione.attr('label/fontWeight', 'bold');
        azione.attr('label/fill', 'white');
        azione.attr('removeElement/id', 'remove');
        azione.attr('removeElement/class', 'hideElement');
        azione.attr('removeElement/d', 'M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z');
        azione.attr('removeElement/title', 'Rimuovi');
        azione.attr('removeElement/fill', 'red');
        azione.attr('removeElement/cursor', 'pointer');
        azione.attr('removeElement/stroke', 'red');
        azione.attr('removeElement/strokeWidth', '3');
        azione.attr('removeElement/transform', 'scale(.9) translate(-10,-10)');

        azione.attr('tagElement/d', 'M 50.0435 33.6075 L 56.2861 30.3061 C 56.1633 29.0828 55.9256 27.8949 55.6298 26.73 L 48.6953 25.77 C 48.0956 24.324 47.3027 22.9832 46.3701 21.7525 L 49.0139 15.2518 C 48.1451 14.4041 47.2063 13.6315 46.2184 12.9206 L 40.3313 16.6169 C 38.9499 15.8894 37.4625 15.3391 35.9004 14.9848 L 33.774 8.39176 C 33.1703 8.34778 32.5658 8.29958 31.9509 8.29958 S 30.7342 8.34633 30.1295 8.39176 L 28.0219 14.9267 C 26.4179 15.2693 24.8976 15.8273 23.4821 16.5609 L 17.686 12.9206 C 16.6995 13.6315 15.7608 14.4041 14.8917 15.2518 L 17.4622 21.5716 C 16.4602 22.8567 15.6217 24.2722 14.9918 25.8001 L 8.27596 26.7285 C 7.9812 27.8938 7.74226 29.0792 7.62207 30.3046 L 13.6484 33.4924 C 13.7166 35.1723 13.9949 36.7992 14.4871 38.3308 L 9.94068 43.358 C 10.4695 44.4544 11.0588 45.5186 11.7396 46.5164 L 18.4336 45.0798 C 19.5315 46.2722 20.7813 47.3195 22.1603 48.1849 L 21.9072 55.0332 C 23.0065 55.5292 24.1489 55.9442 25.3266 56.2758 L 29.5602 50.8324 C 30.3115 50.9288 31.072 50.9932 31.8486 50.9932 C 32.6887 50.9932 33.5117 50.9174 34.3202 50.8058 L 38.5771 56.2794 C 39.7557 55.9467 40.8955 55.5332 41.9946 55.0375 L 41.7366 48.0646 C 43.051 47.2148 44.2437 46.1961 45.295 45.0455 L 52.1625 46.5201 C 52.8444 45.5222 53.4326 44.4597 53.9614 43.3616 L 49.2668 38.1701 C 49.7184 36.7194 49.9703 35.1874 50.0435 33.6075 Z M 39.6695 41.5375 L 36.7098 43.4642 L 34.8895 40.6674 C 33.9419 41.0316 32.9224 41.253 31.8486 41.253 C 27.1542 41.253 23.3506 37.4467 23.3506 32.7551 C 23.3506 28.0607 27.1542 24.2582 31.8486 24.2582 C 36.5402 24.2582 40.3454 28.0607 40.3454 32.7551 C 40.3454 35.0991 39.3952 37.2204 37.861 38.7586 L 39.6695 41.5375 Z');
        azione.attr('tagElement/transform', 'scale(.8) translate(150,-30)');
        azione.attr('tagElement/fill', 'green');
        azione.attr('tagElement/title', 'In Corso...');
        azione.attr('tagElement/id', 'tagElement');
        azione.attr('tagElement/stroke', '#333');
        azione.attr('tagElement/strokeWidth', '1');
        azione.attr('tagElement/class', 'hideElement');

        // protocollo.addTo(StencilPaper.model);

        //############################################# CONDIZIONE ACCETTA/MODIFICA (APPROVAZIONE) #################################        
        var approvazione = new standard.Polygon({
            ports: {
                items: [{
                        id: "PortInput",
                        label: {
                            position: {
                                args: {
                                    x: 72,
                                    y: -12
                                }
                            },
                            markup: '<text font-size="9" class="label-text" fill="blue"/>'
                        },
                        attrs: {
                            text: {
                                text: 'In'
                            }
                        },
                        markup: '<polygon class="wfConditionPort" points="36,5 68,-8 100,5"  magnet="passive" fill="#b620e0"/>'
                    },
                    {
                        id: "PortRifiuta",
                        // label: { position: { args: { x: 150, y: -5 } }, markup: '<text display="none" font-size="9" class="label-text" fill="blue"/>' },
                        // attrs: { text: { text: 'Rifiuta' } }, 
                        markup: '<polygon display="none" class="wfConditionPort" points="115,-3 115,16 139,7"  magnet="true" fill="#b620e0"/>'
                    },
                    {
                        id: "PortModifica",
                        label: {
                            position: {
                                args: {
                                    x: 12,
                                    y: -15
                                }
                            },
                            markup: '<text font-size="9" class="label-text" fill="blue"/>'
                        },
                        attrs: {
                            text: {
                                text: 'Modifica'
                            }
                        },
                        markup: '<polygon class="wfConditionPort" points="-3,-7 20,-15 20,2"  magnet="true" fill="#b620e0"/>'
                    },
                    {
                        id: "PortApprova",
                        label: {
                            position: {
                                args: {
                                    x: 84,
                                    y: 12
                                }
                            },
                            markup: '<text font-size="9" class="label-text" fill="blue"/>'
                        },
                        attrs: {
                            text: {
                                text: 'Approva'
                            }
                        },
                        markup: '<polygon class="wfConditionPort" points="36,-5 68,8 100,-5"  magnet="true" fill="#b620e0"/>'
                    }
                ]
            },
            markup: [{
                    tagName: 'polygon',
                    selector: 'body'
                },
                {
                    tagName: 'text',
                    selector: 'label'
                },
                {
                    tagName: 'path',
                    selector: 'removeElement'
                }

            ]

        });
        // approvazione.position(23, 190);
        approvazione.position(23, 30);
        approvazione.resize(136, 55);
        approvazione.attr('root/stato', 'clear');
        approvazione.attr('root/clearStateColor', '#b620e0');
        approvazione.attr('root/magnet', false);
        approvazione.attr('root/identificativo', 'Approvazione');
        approvazione.attr('body/refPoints', '0,10 10,0 20,10 10,20');
        approvazione.attr('body/fill', '#b620e0');
        approvazione.attr('body/stroke', '#b620e0');
        approvazione.attr('body/rx', '20');
        approvazione.attr('body/ry', '20');
        approvazione.attr('label/text', 'Approvazione');
        approvazione.attr('label/fontSize', '12');
        approvazione.attr('label/fontWeight', 'bold');
        approvazione.attr('label/fill', 'white');
        approvazione.attr('removeElement/id', 'remove');
        approvazione.attr('removeElement/class', 'hideElement');
        approvazione.attr('removeElement/d', 'M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z');
        approvazione.attr('removeElement/title', 'Rimuovi');
        approvazione.attr('removeElement/fill', 'red');
        approvazione.attr('removeElement/cursor', 'pointer');
        approvazione.attr('removeElement/stroke', 'red');
        approvazione.attr('removeElement/strokeWidth', '3');
        approvazione.attr('removeElement/transform', 'scale(.9) translate(15,-5)');

        if (this.noElementLabels) {
            approvazione.portProp('PortInput', 'attrs/text/text', '');
            approvazione.portProp('PortRifiuta', 'attrs/text/text', '');
            approvazione.portProp('PortModifica', 'attrs/text/text', '');
            approvazione.portProp('PortApprova', 'attrs/text/text', '');
        }

        // approvazione.addTo(StencilPaper.model);

        //############################################# CONDIZIONE ACCETTA/RIFIUTA/MODIFICA (DELIBERA) #################################        
        var delibera = new standard.Polygon({
            ports: {
                items: [{
                        id: "PortInput",
                        label: {
                            position: {
                                args: {
                                    x: 72,
                                    y: -12
                                }
                            },
                            markup: '<text font-size="9" class="label-text" fill="blue"/>'
                        },
                        attrs: {
                            text: {
                                text: 'In'
                            }
                        },
                        markup: '<polygon class="wfConditionPort" points="36,5 68,-8 100,5"  magnet="passive" fill="#b620e0"/>'
                    },
                    {
                        id: "PortRifiuta",
                        label: {
                            position: {
                                args: {
                                    x: 150,
                                    y: -5
                                }
                            },
                            markup: '<text font-size="9" class="label-text" fill="blue"/>'
                        },
                        attrs: {
                            text: {
                                text: 'Rifiuta'
                            }
                        },
                        markup: '<polygon class="wfConditionPort" points="115,-3 115,16 139,7"  magnet="true" fill="#b620e0"/>'
                    },
                    {
                        id: "PortModifica",
                        label: {
                            position: {
                                args: {
                                    x: 12,
                                    y: -15
                                }
                            },
                            markup: '<text font-size="9" class="label-text" fill="blue"/>'
                        },
                        attrs: {
                            text: {
                                text: 'Modifica'
                            }
                        },
                        markup: '<polygon class="wfConditionPort" points="-3,-7 20,-15 20,2"  magnet="true" fill="#b620e0"/>'
                    },
                    {
                        id: "PortApprova",
                        label: {
                            position: {
                                args: {
                                    x: 84,
                                    y: 12
                                }
                            },
                            markup: '<text font-size="9" class="label-text" fill="blue"/>'
                        },
                        attrs: {
                            text: {
                                text: 'Approva'
                            }
                        },
                        markup: '<polygon class="wfConditionPort" points="36,-5 68,8 100,-5"  magnet="true" fill="#b620e0"/>'
                    }
                ]
            },
            markup: [{
                    tagName: 'polygon',
                    selector: 'body'
                },
                {
                    tagName: 'text',
                    selector: 'label'
                },
                {
                    tagName: 'path',
                    selector: 'removeElement'
                }
            ]

        });
        // delibera.position(23, 270);
        delibera.position(23, 110);
        delibera.resize(136, 55);
        delibera.attr('root/stato', 'clear');
        delibera.attr('root/clearStateColor', '#b620e0');
        delibera.attr('root/identificativo', 'Delibera');
        delibera.attr('body/refPoints', '0,10 10,0 20,10 10,20');
        delibera.attr('body/fill', '#b620e0');
        delibera.attr('body/stroke', '#b620e0');
        delibera.attr('body/rx', '20');
        delibera.attr('body/ry', '20');
        delibera.attr('label/text', 'Delibera');
        delibera.attr('label/fontSize', '12');
        delibera.attr('label/fontWeight', 'bold');
        delibera.attr('label/fill', 'white');
        delibera.attr('removeElement/id', 'remove');
        delibera.attr('removeElement/class', 'hideElement');
        delibera.attr('removeElement/d', 'M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z');
        delibera.attr('removeElement/title', 'Rimuovi');
        delibera.attr('removeElement/fill', 'red');
        delibera.attr('removeElement/cursor', 'pointer');
        delibera.attr('removeElement/stroke', 'red');
        delibera.attr('removeElement/strokeWidth', '3');
        delibera.attr('removeElement/transform', 'scale(.9) translate(15,-5)');

        if (this.noElementLabels) {
            delibera.portProp('PortInput', 'attrs/text/text', '');
            delibera.portProp('PortRifiuta', 'attrs/text/text', '');
            delibera.portProp('PortModifica', 'attrs/text/text', '');
            delibera.portProp('PortApprova', 'attrs/text/text', '');
        }
        // delibera.addTo(StencilPaper.model);

        //############################################# RECT BASE A: C. USERS #################################   

        var baserect = new standard.Rectangle({
            ports: {
                items: [{
                        id: 'PortInput',
                        markup: '<rect class="wfElementPortTop" width="110" height="10" y="-11" rx="5" x="15" magnet="passive" fill="#1aa1e2"/>'
                    },
                    {
                        id: 'PortOutput',
                        markup: '<rect class="wfElementPortBottom" width="110" height="10" y="1" rx="5" x="15" magnet="true" fill="#1aa1e2"/>'
                    }
                ]
            },
            markup: [{
                    tagName: 'rect',
                    selector: 'body'
                },
                {
                    tagName: 'text',
                    selector: 'label'
                },
                {
                    tagName: 'path',
                    selector: 'removeElement'
                },
                {
                    tagName: 'path',
                    selector: 'tagElement'
                }
            ]
        });
        baserect.position(20, 0);
        baserect.resize(140, 40);
        baserect.attr('root/stato', 'clear');
        baserect.attr('root/clearStateColor', '#1aa1e2');
        baserect.attr('root/startDate', '');
        baserect.attr('root/endDate', '');
        baserect.attr('root/magnet', false);
        baserect.attr('root/identificativo', 'U');
        baserect.attr('body/fill', '#1aa1e2');
        baserect.attr('body/stroke', '#1aa1e2');
        baserect.attr('body/rx', '20');
        baserect.attr('body/ry', '20');
        baserect.attr('label/text', 'User A..C');
        baserect.attr('label/fontSize', '12');
        baserect.attr('label/fontWeight', 'bold');
        baserect.attr('label/fill', 'white');
        baserect.attr('removeElement/id', 'remove');
        baserect.attr('removeElement/class', 'hideElement');
        baserect.attr('removeElement/d', 'M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z');
        baserect.attr('removeElement/title', 'Rimuovi');
        baserect.attr('removeElement/fill', 'red');
        baserect.attr('removeElement/cursor', 'pointer');
        baserect.attr('removeElement/stroke', 'red');
        baserect.attr('removeElement/strokeWidth', '3');
        baserect.attr('removeElement/transform', 'scale(.9) translate(-10,-10)');

        baserect.attr('tagElement/d', 'M 50.0435 33.6075 L 56.2861 30.3061 C 56.1633 29.0828 55.9256 27.8949 55.6298 26.73 L 48.6953 25.77 C 48.0956 24.324 47.3027 22.9832 46.3701 21.7525 L 49.0139 15.2518 C 48.1451 14.4041 47.2063 13.6315 46.2184 12.9206 L 40.3313 16.6169 C 38.9499 15.8894 37.4625 15.3391 35.9004 14.9848 L 33.774 8.39176 C 33.1703 8.34778 32.5658 8.29958 31.9509 8.29958 S 30.7342 8.34633 30.1295 8.39176 L 28.0219 14.9267 C 26.4179 15.2693 24.8976 15.8273 23.4821 16.5609 L 17.686 12.9206 C 16.6995 13.6315 15.7608 14.4041 14.8917 15.2518 L 17.4622 21.5716 C 16.4602 22.8567 15.6217 24.2722 14.9918 25.8001 L 8.27596 26.7285 C 7.9812 27.8938 7.74226 29.0792 7.62207 30.3046 L 13.6484 33.4924 C 13.7166 35.1723 13.9949 36.7992 14.4871 38.3308 L 9.94068 43.358 C 10.4695 44.4544 11.0588 45.5186 11.7396 46.5164 L 18.4336 45.0798 C 19.5315 46.2722 20.7813 47.3195 22.1603 48.1849 L 21.9072 55.0332 C 23.0065 55.5292 24.1489 55.9442 25.3266 56.2758 L 29.5602 50.8324 C 30.3115 50.9288 31.072 50.9932 31.8486 50.9932 C 32.6887 50.9932 33.5117 50.9174 34.3202 50.8058 L 38.5771 56.2794 C 39.7557 55.9467 40.8955 55.5332 41.9946 55.0375 L 41.7366 48.0646 C 43.051 47.2148 44.2437 46.1961 45.295 45.0455 L 52.1625 46.5201 C 52.8444 45.5222 53.4326 44.4597 53.9614 43.3616 L 49.2668 38.1701 C 49.7184 36.7194 49.9703 35.1874 50.0435 33.6075 Z M 39.6695 41.5375 L 36.7098 43.4642 L 34.8895 40.6674 C 33.9419 41.0316 32.9224 41.253 31.8486 41.253 C 27.1542 41.253 23.3506 37.4467 23.3506 32.7551 C 23.3506 28.0607 27.1542 24.2582 31.8486 24.2582 C 36.5402 24.2582 40.3454 28.0607 40.3454 32.7551 C 40.3454 35.0991 39.3952 37.2204 37.861 38.7586 L 39.6695 41.5375 Z');
        baserect.attr('tagElement/transform', 'scale(.8) translate(150,-30)');
        baserect.attr('tagElement/fill', 'green');
        baserect.attr('tagElement/id', 'tagElement');
        baserect.attr('tagElement/title', 'In Corso...');
        baserect.attr('tagElement/stroke', '#333');
        baserect.attr('tagElement/strokeWidth', '1');
        baserect.attr('tagElement/class', 'hideElement');
        // baserect.addTo(StencilPaper.model);

        var if_then_mod = new standard.Polygon({
            ports: {
                items: [{
                        id: "PortInput",
                        label: {
                            position: {
                                args: {
                                    x: 72,
                                    y: -12
                                }
                            },
                            markup: '<text font-size="9" class="label-text" fill="blue"/>'
                        },
                        attrs: {
                            text: {
                                text: 'In'
                            }
                        },
                        markup: '<polygon class="wfConditionPort" points="34,6 68,-8 102,6"  magnet="passive" fill="transparent"/>'
                    },
                    {
                        id: "PortModifica",
                        label: {
                            position: {
                                args: {
                                    x: 150,
                                    y: -5
                                }
                            },
                            markup: '<text font-size="9" class="label-text" fill="blue"/>'
                        },
                        attrs: {
                            text: {
                                text: 'False'
                            }
                        },
                        markup: '<polygon  class="wfConditionPort" points="118,-2 118,15 139,7"  magnet="true" fill="transparent"/>'
                    },
                    {
                        id: "PortRifiuta",
                        label: {
                            position: {
                                args: {
                                    x: 12,
                                    y: -15
                                }
                            },
                            markup: '<text font-size="9" class="label-text" fill="blue"/>'
                        },
                        attrs: {
                            text: {
                                text: ''
                            }
                        },
                        markup: '<polygon style="display:none" class="wfConditionPort" points="-3,-5 20,-12 20,2"  magnet="true" fill="transparent"/>'
                    },
                    {
                        id: "PortApprova",
                        label: {
                            position: {
                                args: {
                                    x: 84,
                                    y: 12
                                }
                            },
                            markup: '<text font-size="9" class="label-text" fill="blue"/>'
                        },
                        attrs: {
                            text: {
                                text: 'True'
                            }
                        },
                        markup: '<polygon class="wfConditionPort" points="36,-5 68,8 100,-5"  magnet="true" fill="transparent"/>'
                    }
                ]
            },
            markup: [{
                    tagName: 'polygon',
                    selector: 'body'
                },
                {
                    tagName: 'text',
                    selector: 'label'
                },
                {
                    tagName: 'path',
                    selector: 'removeElement'
                }
            ]

        });
        if_then_mod.position(23, 190);
        if_then_mod.resize(136, 55);
        if_then_mod.attr('root/stato', 'clear');
        if_then_mod.attr('root/clearStateColor', '#646b25');
        if_then_mod.attr('root/magnet', false);
        if_then_mod.attr('root/condizione', '');
        if_then_mod.attr('root/identificativo', 'ifthen');
        if_then_mod.attr('body/refPoints', '0,10 10,0 20,10 10,20');
        if_then_mod.attr('body/fill', '#646b25');
        if_then_mod.attr('body/stroke', '#646b25');
        if_then_mod.attr('body/rx', '20');
        if_then_mod.attr('body/ry', '20');
        if_then_mod.attr('label/text', 'If Then');
        if_then_mod.attr('label/fontSize', '11');
        if_then_mod.attr('label/fill', 'white');
        if_then_mod.attr('removeElement/id', 'remove');
        if_then_mod.attr('removeElement/class', 'hideElement');
        if_then_mod.attr('removeElement/d', 'M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z');
        if_then_mod.attr('removeElement/title', 'Rimuovi');
        if_then_mod.attr('removeElement/fill', 'red');
        if_then_mod.attr('removeElement/cursor', 'pointer');
        if_then_mod.attr('removeElement/stroke', 'red');
        if_then_mod.attr('removeElement/strokeWidth', '3');
        if_then_mod.attr('removeElement/transform', 'scale(.9) translate(15,-5)');

        if (this.noElementLabels) {
            if_then_mod.portProp('PortInput', 'attrs/text/text', '');
            if_then_mod.portProp('PortRifiuta', 'attrs/text/text', '');
            if_then_mod.portProp('PortApprova', 'attrs/text/text', '');
        }
        //Add it to Stencil Paper
        // if_then_mod.addTo(StencilPaper.model);
        //############################################# CREATE C&A USERS DINAMICALLY #################################           
        aUsers = this.GetWorkflowElements(ncWorkflow.WorkflowId, ncWorkflow.AppId, function(elements, workflow) {
            delibera.addTo(StencilPaper.model);
            approvazione.addTo(StencilPaper.model);
            if_then_mod.addTo(StencilPaper.model);
            //ToDo: Consts...
            let offsetY = 270;
            //Load Dynamic Stencil Elements
            if (elements) {
                nodes = JSON.parse(elements);
                nodes.forEach(function(node, index) {
                    if (node) {
                        switch (node.Type) {
                            case 'A':
                            case 'C':
                                {
                                    let element = baserect.clone();
                                    let elHeight = element.attributes.size.height + 10;
                                    let posY = (index * (elHeight)) + offsetY
                                    element.attr('root/id', node.Identificativo); //node.Type + node.Id);
                                    element.attr('root/stato', node.Stato);
                                    element.attr('label/text', node.Identificativo); //+ ': ' + node.Label);
                                    element.attr('root/identificativo', node.Identificativo);
                                    element.position(20, posY);
                                    //Add To StencilPaper
                                    element.addTo(StencilPaper.model);
                                }
                                break;
                            case "R":
                                {
                                    let element = ruser.clone();
                                    let elHeight = element.attributes.size.height + 10;
                                    let posY = (index * (elHeight)) + offsetY
                                    element.attr('root/id', node.Identificativo); //node.Type + node.Id);
                                    element.attr('root/stato', node.Stato);
                                    element.attr('label/text', node.Identificativo); //+ ': ' + node.Label);
                                    element.attr('root/identificativo', node.Identificativo);
                                    element.position(20, posY);
                                    //Add To StencilPaper
                                    element.addTo(StencilPaper.model);
                                }
                                break;
                            case "Azione":
                                {
                                    let element = azione.clone();
                                    let elHeight = element.attributes.size.height + 10;
                                    let posY = (index * (elHeight)) + offsetY
                                    element.attr('root/id', node.Type + node.Id);
                                    element.attr('root/stato', node.Stato);
                                    element.attr('label/text', node.Label);
                                    element.attr('root/identificativo', node.Identificativo);
                                    element.position(20, posY);
                                    //Add To StencilPaper
                                    element.addTo(StencilPaper.model);
                                }
                        }
                    }
                });
            }
            StencilPaper.setDimensions(StencilPaper.width, 190)
                //Load WOrkflow
            if (workflow) Paper.model.fromJSON(JSON.parse(workflow));
        });
    },

    CreateGenericRectBlock: function(block, posX, posY) {
        var type = block.Type;
        var el = null;
        var fill = "darkorange";
        var stroke = "darkred";
        if (type != null && type != "") {
            if (type == "start") {
                fill = "#1aa1e2";
                stroke = "blue";
                el = new standard.Rectangle({
                    ports: {
                        items: [{
                            id: 'PortOutput',
                            markup: '<rect class="wfElementPortTop" width="110" height="10" y="11" rx="5" x="15" magnet="true" fill="transparent"/>'
                        }]
                    },
                    markup: [{
                            tagName: 'rect',
                            selector: 'body'
                        },
                        {
                            tagName: 'text',
                            selector: 'label'
                        },
                        {
                            tagName: 'path',
                            selector: 'removeElement'
                        },
                        {
                            tagName: 'path',
                            selector: 'tagElement'
                        }
                    ]
                });
            } else if (type == "end") {
                fill = "#0c4e7a";
                stroke = "darkblue";
                el = new standard.Rectangle({
                    ports: {
                        items: [{
                            id: 'PortInput',
                            markup: '<rect class="wfElementPortBottom" width="110" height="10" y="-20" rx="5" x="15" magnet="passive" fill="transparent"/>'
                        }]
                    },
                    markup: [{
                            tagName: 'rect',
                            selector: 'body'
                        },
                        {
                            tagName: 'text',
                            selector: 'label'
                        },
                        {
                            tagName: 'path',
                            selector: 'removeElement'
                        },
                        {
                            tagName: 'path',
                            selector: 'tagElement'
                        }
                    ]
                });
            } else if (type == "step") {
                el = new standard.Rectangle({
                    ports: {
                        items: [{
                                id: 'PortInput',
                                markup: '<rect class="wfElementPortTop" width="110" height="10" y="-11" rx="5" x="15" magnet="passive" fill="transparent"/>'
                            },
                            {
                                id: 'PortOutput',
                                markup: '<rect class="wfElementPortBottom" width="110" height="10" y="1" rx="5" x="15" magnet="true" fill="transparent"/>'
                            }
                        ]
                    },
                    markup: [{
                            tagName: 'rect',
                            selector: 'body'
                        },
                        {
                            tagName: 'text',
                            selector: 'label'
                        },
                        {
                            tagName: 'path',
                            selector: 'removeElement'
                        },
                        {
                            tagName: 'path',
                            selector: 'tagElement'
                        }
                    ]
                });
            } else if (type == "R") {
                fill = "#dc2987";
                stroke = fill;
                el = new standard.Rectangle({
                    ports: {
                        items: [{
                            id: 'PortOutput',
                            markup: '<rect class="wfElementPortTop" width="110" height="10" y="11" rx="5" x="15" magnet="true" fill="transparent"/>'
                        }]
                    },
                    markup: [{
                            tagName: 'rect',
                            selector: 'body'
                        },
                        {
                            tagName: 'text',
                            selector: 'label'
                        },
                        {
                            tagName: 'path',
                            selector: 'removeElement'
                        },
                        {
                            tagName: 'path',
                            selector: 'tagElement'
                        }
                    ]
                });
            } else if (type == "C" || type == "A") {
                fill = "#1aa1e2";
                stroke = "#1aa1e2";
                el = new standard.Rectangle({
                    ports: {
                        items: [{
                                id: 'PortInput',
                                markup: '<rect class="wfElementPortTop" width="110" height="10" y="-11" rx="5" x="15" magnet="passive" fill="transparent"/>'
                            },
                            {
                                id: 'PortOutput',
                                markup: '<rect class="wfElementPortBottom" width="110" height="10" y="1" rx="5" x="15" magnet="true" fill="transparent"/>'
                            }
                        ]
                    },
                    markup: [{
                            tagName: 'rect',
                            selector: 'body'
                        },
                        {
                            tagName: 'text',
                            selector: 'label'
                        },
                        {
                            tagName: 'path',
                            selector: 'removeElement'
                        },
                        {
                            tagName: 'path',
                            selector: 'tagElement'
                        }
                    ]
                });
            } else if (type == "Approvazione" || type == "Rifiuto") {
                fill = "#d94494";
                stroke = fill;
                el = new standard.Rectangle({
                    ports: {
                        items: [{
                            id: 'PortInput',
                            markup: '<rect class="wfElementPortTop" width="110" height="10" y="-20" rx="5" x="15" magnet="passive" fill="transparent"/>'
                        }]
                    },
                    markup: [{
                            tagName: 'rect',
                            selector: 'body'
                        },
                        {
                            tagName: 'text',
                            selector: 'label'
                        },
                        {
                            tagName: 'path',
                            selector: 'removeElement'
                        },
                        {
                            tagName: 'path',
                            selector: 'tagElement'
                        }
                    ]
                });
            }
        } else {
            type = null;
            el = new standard.Rectangle({
                ports: {
                    items: [{
                            id: 'PortInput',
                            markup: '<rect class="wfElementPortTop" width="110" height="10" y="-11" rx="5" x="15" magnet="passive" fill="transparent"/>'
                        },
                        {
                            id: 'PortOutput',
                            markup: '<rect class="wfElementPortBottom" width="110" height="10" y="1" rx="5" x="15" magnet="true" fill="transparent"/>'
                        }
                    ]
                },
                markup: [{
                        tagName: 'rect',
                        selector: 'body'
                    },
                    {
                        tagName: 'text',
                        selector: 'label'
                    },
                    {
                        tagName: 'path',
                        selector: 'removeElement'
                    },
                    {
                        tagName: 'path',
                        selector: 'tagElement'
                    },
                    // {
                    //     tagName: 'path',
                    //     selector: 'playElement',

                    // }
                ]
            });
        }
        el.position(posX, posY);
        el.resize(140, 40);
        el.attr('root/id', block.Id);
        el.attr('root/stato', 'clear'); //Default
        // el.attr('label/text', block.Label + ' (' + block.Id + ')'); //id for debug
        el.attr('label/text', (block.Label ? block.Label : 'Blocco'));
        el.attr('root/identificativo', (block.Type ? block.Type : 'step'));
        el.attr('root/magnet', false);
        el.attr('body/fill', fill);
        el.attr('body/stroke', stroke);
        el.attr('body/strokeWidth', '0.5');
        el.attr('body/rx', '20');
        el.attr('body/ry', '20');
        el.attr('label/fontSize', '12');
        el.attr('label/fontWeight', 'bold');
        el.attr('label/fill', 'white');
        //Remove Element 
        el.attr('removeElement/id', 'remove');
        el.attr('removeElement/class', 'hideElement');
        el.attr('removeElement/d', 'M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z');
        el.attr('removeElement/title', 'Rimuovi');
        el.attr('removeElement/fill', 'red');
        el.attr('removeElement/cursor', 'pointer');
        el.attr('removeElement/stroke', 'red');
        el.attr('removeElement/strokeWidth', '3');
        el.attr('removeElement/transform', 'scale(.9) translate(-10,-10)');
        //Current Element
        el.attr('tagElement/d', 'M 50.0435 33.6075 L 56.2861 30.3061 C 56.1633 29.0828 55.9256 27.8949 55.6298 26.73 L 48.6953 25.77 C 48.0956 24.324 47.3027 22.9832 46.3701 21.7525 L 49.0139 15.2518 C 48.1451 14.4041 47.2063 13.6315 46.2184 12.9206 L 40.3313 16.6169 C 38.9499 15.8894 37.4625 15.3391 35.9004 14.9848 L 33.774 8.39176 C 33.1703 8.34778 32.5658 8.29958 31.9509 8.29958 S 30.7342 8.34633 30.1295 8.39176 L 28.0219 14.9267 C 26.4179 15.2693 24.8976 15.8273 23.4821 16.5609 L 17.686 12.9206 C 16.6995 13.6315 15.7608 14.4041 14.8917 15.2518 L 17.4622 21.5716 C 16.4602 22.8567 15.6217 24.2722 14.9918 25.8001 L 8.27596 26.7285 C 7.9812 27.8938 7.74226 29.0792 7.62207 30.3046 L 13.6484 33.4924 C 13.7166 35.1723 13.9949 36.7992 14.4871 38.3308 L 9.94068 43.358 C 10.4695 44.4544 11.0588 45.5186 11.7396 46.5164 L 18.4336 45.0798 C 19.5315 46.2722 20.7813 47.3195 22.1603 48.1849 L 21.9072 55.0332 C 23.0065 55.5292 24.1489 55.9442 25.3266 56.2758 L 29.5602 50.8324 C 30.3115 50.9288 31.072 50.9932 31.8486 50.9932 C 32.6887 50.9932 33.5117 50.9174 34.3202 50.8058 L 38.5771 56.2794 C 39.7557 55.9467 40.8955 55.5332 41.9946 55.0375 L 41.7366 48.0646 C 43.051 47.2148 44.2437 46.1961 45.295 45.0455 L 52.1625 46.5201 C 52.8444 45.5222 53.4326 44.4597 53.9614 43.3616 L 49.2668 38.1701 C 49.7184 36.7194 49.9703 35.1874 50.0435 33.6075 Z M 39.6695 41.5375 L 36.7098 43.4642 L 34.8895 40.6674 C 33.9419 41.0316 32.9224 41.253 31.8486 41.253 C 27.1542 41.253 23.3506 37.4467 23.3506 32.7551 C 23.3506 28.0607 27.1542 24.2582 31.8486 24.2582 C 36.5402 24.2582 40.3454 28.0607 40.3454 32.7551 C 40.3454 35.0991 39.3952 37.2204 37.861 38.7586 L 39.6695 41.5375 Z');
        el.attr('tagElement/transform', 'scale(.8) translate(150,-30)');
        el.attr('tagElement/fill', 'green');
        el.attr('tagElement/id', 'tagElement');
        el.attr('tagElement/title', 'In Corso...');
        el.attr('tagElement/stroke', '#333');
        el.attr('tagElement/strokeWidth', '1');
        el.attr('tagElement/class', 'hideElement');
        return el;
    },

    CreateGenericRhombusBlock: function(block, posX, posY, isTwoPorts) {
        //Create new Rhombus Element (Rhombus)
        var labelPortInput = (block.LabelPortInput != null && block.LabelPortInput != "" ? block.LabelPortInput : "In");
        var labelPortRifiuta = (block.LabelPortRifiuta != null && block.LabelPortRifiuta != "" ? block.LabelPortRifiuta : "Rifiuta");
        var labelPortModifica = (block.LabelPortModifica != null && block.LabelPortModifica != "" ? block.LabelPortModifica : "Modifica");
        var labelPortApprova = (block.LabelPortApprova != null && block.LabelPortApprova != "" ? block.LabelPortApprova : "Approva");
        var type = (block.Type != null && block.Type != "" ? block.Type : null);
        var el = null;
        if (type != null && type == "ifthen") {
            el = new standard.Polygon({
                ports: {
                    items: [{
                            id: "PortInput",
                            label: {
                                position: {
                                    args: {
                                        x: 72,
                                        y: -12
                                    }
                                },
                                markup: '<text font-size="9" class="label-text" fill="blue"/>'
                            },
                            attrs: {
                                text: {
                                    text: 'In'
                                }
                            },
                            markup: '<polygon class="wfConditionPort" points="34,6 68,-8 102,6"  magnet="passive" fill="transparent"/>'
                        },
                        {
                            id: "PortModifica",
                            label: {
                                position: {
                                    args: {
                                        x: 150,
                                        y: -5
                                    }
                                },
                                markup: '<text font-size="9" class="label-text" fill="blue"/>'
                            },
                            attrs: {
                                text: {
                                    text: 'False'
                                }
                            },
                            markup: '<polygon  class="wfConditionPort" points="118,-2 118,15 139,7"  magnet="true" fill="transparent"/>'
                        },
                        {
                            id: "PortRifiuta",
                            label: {
                                position: {
                                    args: {
                                        x: 12,
                                        y: -15
                                    }
                                },
                                markup: '<text font-size="9" class="label-text" fill="blue"/>'
                            },
                            attrs: {
                                text: {
                                    text: ''
                                }
                            },
                            markup: '<polygon style="display:none" class="wfConditionPort" points="-3,-5 20,-12 20,2"  magnet="true" fill="transparent"/>'
                        },
                        {
                            id: "PortApprova",
                            label: {
                                position: {
                                    args: {
                                        x: 84,
                                        y: 12
                                    }
                                },
                                markup: '<text font-size="9" class="label-text" fill="blue"/>'
                            },
                            attrs: {
                                text: {
                                    text: 'True'
                                }
                            },
                            markup: '<polygon class="wfConditionPort" points="36,-5 68,8 100,-5"  magnet="true" fill="transparent"/>'
                        }
                    ]
                },
                markup: [{
                        tagName: 'polygon',
                        selector: 'body'
                    },
                    {
                        tagName: 'text',
                        selector: 'label'
                    },
                    {
                        tagName: 'path',
                        selector: 'removeElement'
                    }
                ]

            });
            el.position(posX, posY);
            el.resize(136, 55);
            el.attr('root/stato', 'clear');
            el.attr('root/clearStateColor', '#646b25');
            el.attr('root/magnet', false);
            el.attr('root/condizione', '');
            el.attr('root/identificativo', 'ifthen');
            el.attr('root/id', block.Id);
            el.attr('body/refPoints', '0,10 10,0 20,10 10,20');
            el.attr('body/fill', '#646b25');
            el.attr('body/stroke', '#646b25');
            el.attr('body/rx', '20');
            el.attr('body/ry', '20');
            el.attr('label/text', (block.Label ? block.Label : 'If Then'));
            el.attr('label/fontSize', '11');
            el.attr('label/fill', 'white');
            el.attr('removeElement/id', 'remove');
            el.attr('removeElement/class', 'hideElement');
            el.attr('removeElement/d', 'M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z');
            el.attr('removeElement/title', 'Rimuovi');
            el.attr('removeElement/fill', 'red');
            el.attr('removeElement/cursor', 'pointer');
            el.attr('removeElement/stroke', 'red');
            el.attr('removeElement/strokeWidth', '3');
            el.attr('removeElement/transform', 'scale(.9) translate(15,-5)');

            if (this.noElementLabels) {
                if_then_mod.portProp('PortInput', 'attrs/text/text', '');
                if_then_mod.portProp('PortRifiuta', 'attrs/text/text', '');
                if_then_mod.portProp('PortApprova', 'attrs/text/text', '');
            }
        } else {
            el = new standard.Polygon({
                ports: {
                    items: [{
                            id: "PortInput",
                            label: {
                                position: {
                                    args: {
                                        x: 72,
                                        y: -12
                                    }
                                },
                                markup: '<text font-size="9" class="label-text" fill="blue"/>'
                            },
                            attrs: {
                                text: {
                                    text: labelPortInput
                                }
                            },
                            markup: '<polygon class="wfConditionPort" points="36,5 68,-8 100,5"  magnet="passive" fill="transparent"/>'
                        },
                        {
                            id: "PortRifiuta",
                            label: {
                                position: {
                                    args: {
                                        x: 150,
                                        y: -5
                                    }
                                },
                                markup: '<text font-size="9" class="label-text" fill="blue"/>'
                            },
                            attrs: {
                                text: {
                                    text: labelPortRifiuta
                                }
                            },
                            markup: '<polygon display="none" class="wfConditionPort" points="115,-3 115,16 139,7"  magnet="true" fill="transparent"/>'
                        },
                        {
                            id: "PortModifica",
                            label: {
                                position: {
                                    args: {
                                        x: 12,
                                        y: -15
                                    }
                                },
                                markup: '<text font-size="9" class="label-text" fill="blue"/>'
                            },
                            attrs: {
                                text: {
                                    text: labelPortModifica
                                }
                            },
                            markup: '<polygon class="wfConditionPort" points="-3,-7 20,-15 20,2"  magnet="true" fill="transparent"/>'
                        },
                        {
                            id: "PortApprova",
                            label: {
                                position: {
                                    args: {
                                        x: 84,
                                        y: 12
                                    }
                                },
                                markup: '<text font-size="9" class="label-text" fill="blue"/>'
                            },
                            attrs: {
                                text: {
                                    text: labelPortApprova
                                }
                            },
                            markup: '<polygon class="wfConditionPort" points="36,-5 68,8 100,-5"  magnet="true" fill="#b620e0"/>'
                        }
                    ]
                },
                markup: [{
                        tagName: 'polygon',
                        selector: 'body'
                    },
                    {
                        tagName: 'text',
                        selector: 'label'
                    },
                    {
                        tagName: 'path',
                        selector: 'removeElement'
                    }
                ]

            });
            el.position(posX, posY);
            el.resize(136, 55);
            el.attr('root/identificativo', type); //'condition');
            el.attr('root/id', block.Id);
            el.attr('root/stato', 'clear');
            el.attr('root/clearStateColor', '#b620e0');
            el.attr('body/refPoints', '0,10 10,0 20,10 10,20');
            el.attr('body/fill', '#b620e0');
            el.attr('body/stroke', '#b620e0');
            el.attr('body/rx', '20');
            el.attr('body/ry', '20');
            el.attr('label/text', (block.Label ? block.Label : 'Condizione'));
            el.attr('label/fontSize', '12');
            el.attr('label/fontWeight', 'bold');
            el.attr('label/fill', 'white');
            el.attr('removeElement/id', 'remove');
            el.attr('removeElement/class', 'hideElement');
            el.attr('removeElement/d', 'M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z');
            el.attr('removeElement/title', 'Rimuovi');
            el.attr('removeElement/fill', 'red');
            el.attr('removeElement/cursor', 'pointer');
            el.attr('removeElement/stroke', 'red');
            el.attr('removeElement/strokeWidth', '3');
            el.attr('removeElement/transform', 'scale(.9) translate(15,-5)');

            //Add third port (portRifiuta) if required...
            if (!isTwoPorts) {
                //remove "display none" on portRifiuta 
                //el.attr('root/identificativo', 'condition');
                el.portProp('PortRifiuta', 'attrs/polygon/display', 'block');
            }
            if (isTwoPorts)
                el.portProp('PortRifiuta', 'attrs/text/text', '');
        }


        return el;
    },

    CreateLinkById: function(link, condBlockPort) {
        let blocks = Paper.model.getElements();
        blocks.forEach(function(sourceBlock, index) {
            sourceblockId = sourceBlock.attr('root/id');
            if (sourceblockId == link.SourceId) {
                //Search for Target Block
                blocks.forEach(function(targetBlock, index) {
                    targetBlockId = targetBlock.attr('root/id');
                    if (targetBlockId == link.TargetId) {
                        //Create Graphical Link (Arrow)
                        graphLink = new dia.Link({
                            "attrs": {
                                '.connection': {
                                    stroke: '#999', //'#1aa1e2',
                                    strokeWidth: '1'

                                },
                                ".marker-target": {
                                    fill: '#999',
                                    stroke: '#999',
                                    "d": "M 10 0 L 0 5 L 10 10 z"
                                }
                            }
                        });

                        let sourcePort = link.SourcePort;
                        let targetPort = link.TargetPort;

                        if (sourcePort == null || (sourcePort != null && sourcePort == ""))
                            sourcePort = 'PortOutput';
                        if (targetPort == null || (targetPort != null && targetPort == ""))
                            targetPort = 'PortInput';

                        graphLink.source({
                            id: sourceBlock.id,
                            port: sourcePort
                        });
                        graphLink.target({
                            id: targetBlock.id,
                            port: targetPort
                        });
                        if (link.Vertices != null)
                            graphLink.vertices(link.Vertices);

                        //Add graphLink to Paper     
                        graphLink.addTo(Paper.model);

                    }
                })
            }
        });
    },

    GetLinkVerticesPositions: function(sourceBlock, targetBlock, paperLink) {
        //Get center of the blocks 
        //Retrieve values                   
        let linkViewtarget = Paper.findViewByModel(paperLink);
        let targetPoint = linkViewtarget.targetPoint;
        // let sourcePoint = linkViewtarget.sourcePoint ;

        let sourceX = sourceBlock.attributes.position.x;
        let sourceY = sourceBlock.attributes.position.y;
        let sourceWidth = sourceBlock.attributes.size.width;
        let sourceHeight = sourceBlock.attributes.size.height;

        let targetX = targetBlock.attributes.position.x;
        let targetY = targetPoint.y; //targetBlock.attributes.position.y;
        let targetWidth = targetBlock.attributes.size.width;
        //let targetHeight = targetBlock.attributes.size.height;

        //calculate source's center (G2)
        let sourceCenter = {};
        sourceCenter.X = (sourceX + (sourceX + sourceWidth)) / 2;

        //calculate target's center (G1)
        let targetCenter = {};
        targetCenter.X = (targetX + (targetX + targetWidth)) / 2;

        //calculate source block's link vertice (P2)
        let sourceVertice = {};
        sourceVertice.X = (sourceCenter.X - (sourceWidth / 2)) - (sourceWidth / 2);
        sourceVertice.Y = (sourceY + (sourceHeight) / 2);

        //calculate target block's link vertice (P1)
        let targetVertice = {};
        targetVertice.X = (targetCenter.X - (targetWidth / 2)) - (targetWidth / 2);
        targetVertice.Y = targetY; //(targetY + (targetHeight) / 2) ;            

        if (sourceVertice && targetVertice) {
            result = {
                "SourceVertice": {},
                "TargetVertice": {}
            };
            result.SourceVertice.X = sourceVertice.X;
            result.SourceVertice.Y = sourceVertice.Y;
            result.TargetVertice.X = targetVertice.X;
            result.TargetVertice.Y = targetVertice.Y;
            return result;
        }

        return null;

    },

    IsInvalidateBlock(block) {
        try {
            let result = false;
            //Retrieve block's direct Parents
            blockClosestParents = Paper.model.getNeighbors(block, {
                inbound: true
            });

            //Retrieve block's direct Children
            blockClosestChildren = Paper.model.getNeighbors(block, {
                outbound: true
            });

            if (blockClosestChildren.length > 1) {
                //get all paper-model links
                let modelLinks = Paper.model.getLinks();
                modelLinks.forEach(function(link) {
                    if (link.attributes.source.id == block.id) {
                        targetChild = Paper.model.getCell(link.attributes.target.id);
                        targetChildren = Paper.model.getSuccessors(targetChild);
                        targetChildren.forEach(function(targetChild) {
                            if (targetChild.id == block.id) {
                                result = true;
                            }
                        });
                    }
                });
                //    result  = true ;
            }

            return result;
        } catch (error) {
            return error;
        }
    },

    CreateFromVisio: function(model) {
        try {
            // function AddCreatedBlocksToStencil() {
            //     try {
            //         let blocks = Paper.model.getElements();
            //         if (blocks && blocks.length > 0) {
            //             let posX = 20;
            //             let posY = 20;
            //             blocks.forEach(function(block, index) {
            //                 if (block) {
            //                     let newBlock = block.clone();
            //                     let blockHeight = newBlock.attributes.size.height;
            //                     //Add To StencilPaper
            //                     newBlock.position(posX, posY);
            //                     newBlock.addTo(StencilPaper.model);
            //                     //Calc Next posY
            //                     posY = (posY + blockHeight) + 10;
            //                 }
            //             });
            //         }
            //     } catch (err) {
            //         console.log(err);
            //     }
            // }

            function NormalizeBlocksVisio() {
                blocks.forEach(function(block, index) {
                    if (block) {
                        let outputPortsCount = 0;
                        if (block.Links) {
                            block.Links.forEach(function(link) {
                                if (link.SourceId == block.Id) {
                                    outputPortsCount++;
                                }
                            });
                            if (outputPortsCount == 1) {
                                var id = block.Id;
                                block.Id = block.Identificativo;
                                blocks.forEach(function(_block, index) {
                                    _block.Links.forEach(function(link) {
                                        if (link.SourceId == id) {
                                            link.SourceId = block.Id;
                                        }
                                        if (link.TargetId == id) {
                                            link.TargetId = block.Id;
                                        }
                                    });
                                });
                                block.Type = block.Identificativo.substring(0, 1);
                            } else {
                                block.Type = block.Identificativo;
                            }
                        }
                    }
                })
            }

            function GetBlockPosition(block, visioPageDimensions, blockWidth, blockHeight) {
                let result = {};

                let x = block.PosX;
                let y = block.PosY;
                if (this.ConsoleDebug) {
                    console.log('Blocco Visio X : ' + x);
                    console.log('Blocco Visio Y : ' + y);
                }
                //Visio  Page 
                let xMin = 0;
                let yMin = visioPageDimensions.Height;
                let xMax = visioPageDimensions.Width;
                let yMax = 0;
                let dX = xMax - xMin;
                let dY = yMax - yMin;
                if (this.ConsoleDebug) {
                    console.log('VISIO : xMin = ' + xMin + ' - xMax = ' + xMax + ' - yMin = ' + yMin + ' - yMax = ' + yMax);
                }

                //WFPaper Page                                 
                let x1Min = 0;
                let y1Min = 0;
                let x1Max = this.Paper.options.width;
                let y1Max = this.Paper.options.height;
                let dX1 = x1Max - x1Min;
                let dY1 = y1Max - y1Min;
                if (this.ConsoleDebug) {
                    console.log('PAPER : x1Min = ' + x1Min + ' - x1Max = ' + x1Max + ' - y1Min = ' + y1Min + ' - y1Max = ' + y1Max);
                }
                let x1 = x * (dX1 / dX);
                let y1 = y * (dY1 / dY) + dY1;
                if (this.ConsoleDebug) {
                    console.log('Coordinata Baricentro X1 : ' + x1);
                    console.log('Coordinata Baricentro Y1 : ' + y1);
                }
                let posX1 = x1 - (blockWidth / 2);
                let posY1 = y1 - (blockHeight / 2);

                if (this.ConsoleDebug) {
                    console.log('Posizione Blocco X : ' + posX1);
                    console.log('Posizione Blocco Y : ' + posY1);
                }
                result.X = posX1;
                result.Y = posY1;

                return result;
            }

            function GenerateJsonModel(blocks, visioPageDimensions) {
                let blockPositions = null;
                //Cycling block elements and create blocks on Paper            
                blocks.forEach(function(block, index) {
                    if (block) {
                        //ToAsk: Do i have to Create stencil elements too ???
                        //element to draw...
                        let cellBlock;
                        //Retrieve Number of output ports (Temporary workaround)
                        //ToDo: Identify objects not by ports ('cause a non-conditional block could have more then 2 links...)
                        //to do that, evaluate the possibility to create ad-hoc stencils for Visio...
                        let outputPortsCount = 0; //= (block.Links != null ? block.Links.length : 1);
                        if (block.Links) {
                            block.Links.forEach(function(link) {
                                if (link.SourceId == block.Id) {
                                    outputPortsCount++;
                                }
                            });
                        }
                        //Switch type by ports number
                        switch (outputPortsCount) {
                            case 2:
                                //Get proportional position visio/pape
                                blockPositions = GetBlockPosition(block, visioPageDimensions, 136, 55);
                                cellBlock = this.ncWorkflow.CreateGenericRhombusBlock(block, blockPositions.X, blockPositions.Y, true);
                                break;
                            case 3:
                                //Get proportional position visio/pape
                                blockPositions = GetBlockPosition(block, visioPageDimensions, 136, 55);
                                cellBlock = this.ncWorkflow.CreateGenericRhombusBlock(block, blockPositions.X, blockPositions.Y, false);
                                break;
                            default:
                                //Get proportional position visio/pape
                                blockPositions = GetBlockPosition(block, visioPageDimensions, 140, 40);
                                cellBlock = this.ncWorkflow.CreateGenericRectBlock(block, blockPositions.X, blockPositions.Y);
                                break;
                        }

                        cellBlock.addTo(Paper.model);
                    }
                });

                //Cycling link elements and create block links 
                blocks.forEach(function(block) {
                    block.Links.forEach(function(link, index) {
                        if (link.TargetId == block.Id) {
                            if (block.Links) {
                                //Create link object bounded to block itself
                                this.ncWorkflow.CreateLinkById(link);
                            }
                        }
                    });
                })

                //Adjust elements' graphical links
                let paperLinks = Paper.model.getLinks();
                if (paperLinks && paperLinks.length > 0) {
                    paperLinks.forEach(function(paperLink) {
                        //Get source and target block through paperLink
                        let sourceBlock = Paper.model.getCell(paperLink.attributes.source.id);
                        let targetBlock = Paper.model.getCell(paperLink.attributes.target.id);
                        //Check if sourceBlock is Conditional
                        let sourceBlockType = sourceBlock.attributes.type;
                        if (sourceBlockType == 'standard.Polygon') {
                            let isInvalidateSource = ncWorkflow.IsInvalidateBlock(sourceBlock);
                            //**Temporary workaround based on Y Position on target Block
                            if (sourceBlock.attributes && targetBlock.attributes && sourceBlock.attributes.position.y > targetBlock.attributes.position.y) {
                                paperLink.attributes.source.port = "PortModifica";
                            } else {
                                paperLink.attributes.source.port = "PortApprova";
                            }

                            let linkVertices = this.ncWorkflow.GetLinkVerticesPositions(sourceBlock, targetBlock, paperLink);
                            //if sourceBlock in invalidating 
                            if (isInvalidateSource && paperLink.attributes.source.port == "PortModifica") {
                                paperLink.set('vertices', [{
                                        x: linkVertices.SourceVertice.X,
                                        y: linkVertices.SourceVertice.Y
                                    },
                                    {
                                        x: linkVertices.TargetVertice.X,
                                        y: linkVertices.TargetVertice.Y
                                    }
                                ]);
                            }
                        }
                        //Adjust ports if target it's a Block
                        let targetBlockType = targetBlock.attributes.type;
                        if (targetBlockType && targetBlockType == 'standard.Rectangle' && Paper.model.isSink(targetBlock)) {
                            //his source is a Conditional block
                            if (ncWorkflow.IsInvalidateBlock(sourceBlock)) {
                                //check if there is more than 1 output on Conditional sourceBlock
                                let outLinks = Paper.model.getConnectedLinks(sourceBlock, {
                                    outbound: true
                                });
                                if (outLinks) {
                                    let portOut = paperLink.attributes.source;
                                    switch (outLinks.length) {
                                        //Conditional block with 2 output ports
                                        case 2:
                                            if (portOut.port != 'PortModifica') {
                                                portOut.port = 'PortApprova';
                                            }
                                            break;
                                            //Conditional block with 3 output ports (including invalidating port)
                                        case 3:
                                            if (portOut.port != 'PortModifica') {
                                                if (outLinks) {
                                                    let previousTargetLink = null;
                                                    outLinks.forEach(function(outLink) {
                                                        if (outLink.attributes.source.port != 'PortModifica') {
                                                            //Temporary fix based on x position (block bounded on PortRifiuta is commonly righter)...
                                                            if (previousTargetLink) {
                                                                previousLinkView = Paper.findViewByModel(previousTargetLink);
                                                                currentLinkView = Paper.findViewByModel(outLink);
                                                                if (previousLinkView && currentLinkView) {
                                                                    previousX = previousLinkView.targetPoint.x;
                                                                    currentX = currentLinkView.targetPoint.x;
                                                                    if (currentX > previousX) {
                                                                        previousTargetLink.attributes.source.port = 'PortApprova';
                                                                        outLink.attributes.source.port = 'PortRifiuta';
                                                                    } else {
                                                                        previousTargetLink.attributes.source.port = 'PortRifiuta';
                                                                        outLink.attributes.source.port = 'PortApprova';
                                                                    }
                                                                }
                                                                //refresh all elements
                                                                Paper.model.resetCells(Paper.model.getCells());
                                                            }
                                                            previousTargetLink = outLink;
                                                        }
                                                    })
                                                }
                                            }
                                            break;
                                    }
                                }
                            }
                        }
                    })
                }
            }

            //Get Blocks from Model            
            let blocks = model.Model.Blocks;
            //Create cells from generated model and put on Paper
            if (blocks) {
                NormalizeBlocksVisio();
                GenerateJsonModel(blocks, model.Model.PageDimensions);
                //create Stencils from visio elements if they exists
                if (Paper.model.getCells() && Paper.model.getCells().length > 0) {
                    AddCreatedBlocksToStencil();
                }
            } else {
                OC.dialogs.alert('Modello non compatibile. Blocchi non trovati.', 'Warning');
            }
        } catch (error) {
            console.log(error);
        }
    },

    GetBlockPropertiesFromRootId: function(rootId) {
        try {
            if (rootId && Paper.model) {
                let result = {};
                let blocks = Paper.model.getElements();
                if (blocks && blocks.length > 0) {
                    blocks.forEach(function(block) {
                        let blockId = block.attr('root/id');
                        if (blockId && blockId == rootId) {
                            result.Id = blockId;
                            result.Label = block.attr('label/text');
                            result.Identificativo = (block.attr('root/identificativo') ? block.attr('root/identificativo') : null);
                        }
                    })
                }
                return result;
            }
            return null;
        } catch (error) {
            console.log(error);
        }
    },

    ShowWorkflowEngineTags: function(model) {
        try {
            function setNoTags(block) {
                block.attr('tagElement/class', 'hideElement');
            }

            function setRunningTag(block) {
                block.attr('tagElement/d', 'm6.94 0.5c-0.24 0-0.44 0.2-0.44 0.44v1.26c-0.5 0.14-1.05 0.35-1.53 0.65l-0.91-0.91c-0.16-0.18-0.46-0.19-0.62 0l-1.5 1.5c-0.18 0.17-0.18 0.46 0 0.62l0.91 0.91c-0.284 0.48-0.5 1-0.65 1.53h-1.26c-0.24 0-0.44 0.2-0.44 0.44v2.12c0 0.25 0.19 0.44 0.44 0.44h1.26c0.14 0.54 0.36 1.05 0.65 1.53l-0.91 0.91c-0.18 0.17-0.18 0.45 0 0.62l1.5 1.5c0.18 0.18 0.46 0.18 0.62 0l0.91-0.91c0.48 0.285 1 0.5 1.53 0.65v1.26c0 0.25 0.2 0.44 0.44 0.44h2.12c0.24 0 0.45-0.2 0.44-0.44v-1.26c0.54-0.14 1.05-0.36 1.53-0.65l0.91 0.91c0.17 0.18 0.45 0.18 0.62 0l1.5-1.5c0.18-0.17 0.18-0.45 0-0.62l-0.91-0.91c0.29-0.48 0.5-1 0.65-1.53h1.26c0.24 0 0.45-0.2 0.44-0.44v-2.12c0-0.24-0.2-0.44-0.44-0.44h-1.26c-0.14-0.54-0.36-1.05-0.65-1.53l0.91-0.91c0.18-0.17 0.18-0.45 0-0.62l-1.5-1.5c-0.17-0.18-0.45-0.18-0.62 0l-0.91 0.91c-0.48-0.29-1-0.5-1.53-0.65v-1.26c0-0.24-0.2-0.44-0.44-0.44h-2.12zm1.06 4a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1 -3.5 3.5 3.5 3.5 0 0 1 -3.5 -3.5 3.5 3.5 0 0 1 3.5 -3.5z');
                block.attr('tagElement/transform', 'scale(1.4) translate(93,-5)');
                block.attr('tagElement/transform-origin', '8px 8px');
                block.attr('tagElement/title', 'In Esecuzione...');
                block.attr('tagElement/fill', 'darkorange');
                block.attr('tagElement/id', 'running' + block.attr('root/id'));
                block.attr('tagElement/stroke', 'lightgrey');
                block.attr('tagElement/strokeWidth', '0.5');
                block.attr('tagElement/class', 'rotateElement');
            }

            function setApprovedTag(block) {
                block.attr('tagElement/d', 'M49.844,68.325c-1.416,0-2.748-0.554-3.75-1.557L27.523,48.191c-1.003-1.002-1.555-2.334-1.555-3.75 s0.552-2.749,1.555-3.75c1.001-1.001,2.333-1.552,3.75-1.552s2.75,0.551,3.753,1.553l14.019,14.017L82.14,5.504 c0.989-1.468,2.639-2.345,4.412-2.345c1.054,0,2.075,0.312,2.956,0.902c2.424,1.631,3.07,4.934,1.439,7.361L54.25,65.98 c-0.892,1.316-2.312,2.162-3.895,2.314C50.17,68.315,50.01,68.325,49.844,68.325z');
                block.attr('tagElement/transform', 'scale(.3) translate(390,-45)');
                block.attr('tagElement/title', '');
                block.attr('tagElement/fill', 'green');
                block.attr('tagElement/id', 'tagElement');
                block.attr('tagElement/stroke', '#333');
                block.attr('tagElement/strokeWidth', '1');
                block.attr('tagElement/class', '');
            }

            // function setDeniedTag(block) {
            //     block.attr('tagElement/d', 'M90.207,121.293C89.818,121.682,89.05,122,88.5,122h-47c-0.55,0-1.318-0.318-1.707-0.707   L6.707,88.207C6.318,87.818,6,87.05,6,86.5v-47c0-0.55,0.318-1.318,0.707-1.707L39.793,4.707C40.182,4.318,40.95,4,41.5,4h47   c0.55,0,1.318,0.318,1.707,0.707l33.086,33.086C123.682,38.182,124,38.95,124,39.5v47c0,0.55-0.318,1.318-0.707,1.707   L90.207,121.293z');
            //     block.attr('tagElement/class', '');
            //     block.attr('tagElement/transform', 'scale(.5) translate(240,-30)');
            //     block.attr('tagElement/title', 'Running...');
            //     block.attr('tagElement/fill', 'blue');
            //     block.attr('tagElement/id', 'Done');
            //     block.attr('tagElement/stroke', '#333');
            //     block.attr('tagElement/strokeWidth', '1');
            // }

            let blocks = model.getElements();
            if (blocks && blocks.length > 0) {
                blocks.forEach(function(block) {
                    let blockType = block.attributes.type;
                    if (block && blockType != 'standard.Polygon') {
                        let startDate = block.attr('root/startDate');
                        let endDate = block.attr('root/endDate');
                        //check state and apply tags
                        if (startDate || endDate) {
                            //it's started...
                            if (startDate && !endDate) {
                                setRunningTag(block);
                            }
                            //It's ended
                            else if (startDate && endDate) {
                                //Check current/clear status
                                // let status = block.attr('root/stato');
                                // if (status) {                                    
                                //     if (status == 'current') {
                                setApprovedTag(block);
                                // } else if (status == 'clear') {
                                //     setDeniedTag(block);
                                // }
                                // }
                            }
                            //only endDate
                            else if (!startDate || endDate) {
                                setNoTags(block);
                            }
                        } else {
                            setNoTags(block);
                        }
                    }
                })
            }
        } catch (error) {
            console.log(error);
        }
    },
    //Import CSV & XML
    ImportFromCsv: function(csvModel) {
        try {
            if (csvModel) {
                ncWorkflow.ClearPaper();
                //create array for each type
                let csvRecords = csvModel.split(/\r\n|\r|\n/);
                let csvLinks = [];
                let csvBlocks = [];
                let csvConditionals = [];
                for (var i = 0; i <= csvRecords.length - 1; i++) {
                    let columns = csvRecords[i].split(',');
                    let type = columns[0];
                    switch (type) {
                        case 'Link':
                            let link = {};
                            link.Id = columns[1].trim();
                            link.SourceId = columns[2].trim();
                            link.SourcePort = columns[3].trim();
                            link.TargetId = columns[4].trim();
                            link.TargetPort = columns[5].trim();
                            csvLinks.push(link);
                            break;
                        case 'Conditional':
                            let condition = {};
                            condition.Id = columns[1].trim();
                            condition.Label = columns[2].trim();
                            // condition.State = columns[3];
                            condition.Type = columns[3].trim();
                            condition.InputPort = columns[4].trim();
                            condition.TruePort = columns[5].trim();
                            condition.FalsePort = columns[6].trim();
                            condition.InvalidatePort = columns[7].trim();
                            //Check if there are position values
                            if (columns.length > 9) {
                                condition.PosX = parseInt(columns[9].trim());
                                condition.PosY = parseInt(columns[8].trim());
                            }
                            csvConditionals.push(condition);
                            break;
                        case 'Block':
                            let block = {};
                            block.Id = columns[1].trim();
                            block.Label = columns[2].trim();
                            // block.State = columns[3];
                            block.Type = columns[3].trim();
                            block.InputPort = columns[4].trim();
                            block.OutputPort = columns[5].trim();
                            //Check if there are position values
                            if (columns.length > 7) {
                                block.PosX = parseInt(columns[7].trim());
                                block.PosY = parseInt(columns[6].trim());
                            }
                            csvBlocks.push(block);
                            break;
                        default:
                            console.log('No valid data found : ' + csvRecords[i]);
                            break;
                    }
                }
                //creating WF objects
                if (csvBlocks || csvLinks || csvConditionals) {
                    //Creating blocks
                    if (csvBlocks && csvBlocks.length > 0) {
                        csvBlocks.forEach(function(block) {
                            if (!block.PosX) {
                                block.PosX = 20
                            };
                            if (!block.PosY) {
                                block.PosY = 20
                            };

                            let element = ncWorkflow.CreateGenericRectBlock(block, block.PosX, block.PosY);
                            if (element) {
                                element.addTo(Paper.model);
                            } else {
                                OC.dialogs.alert('Error creating element block', 'Error');
                            }
                        })
                    }
                    //Creating Conditionals
                    if (csvConditionals && csvConditionals.length > 0) {
                        csvConditionals.forEach(function(condition) {
                            if (!condition.PosX) {
                                condition.PosX = 20
                            };
                            if (!condition.PosY) {
                                condition.PosY = 20
                            };
                            var isTwoPort = false;
                            var index = 0;
                            for (var link of csvLinks) {
                                if (link.SourceId == condition.Id)
                                    index++;
                            }
                            if (index == 2)
                                isTwoPort = true;
                            let element = ncWorkflow.CreateGenericRhombusBlock(condition, condition.PosX, condition.PosY, isTwoPort);
                            if (element) {
                                element.addTo(Paper.model);
                            } else {
                                OC.dialogs.alert('Error creating element conditional', 'Error');
                            }
                        })
                    }
                    //Creating links
                    if (csvLinks && csvLinks.length > 0) {
                        csvLinks.forEach(function(link) {
                            ncWorkflow.CreateLinkById(link);
                        })
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    },

    ImportFromXML: function(xmlModel, blocks = null, conditionals = null, links = null) {
        try {
            if (xmlModel) {
                ncWorkflow.ClearPaper();
                if (window.DOMParser) {
                    parser = new DOMParser();
                    xmlDoc = parser.parseFromString(xmlModel, "text/xml");
                } else // Internet Explorer
                {
                    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async = false;
                    xmlDoc.loadXML(xmlModel);
                }
                if (xmlDoc) {
                    //get Links
                    if (!links)
                        links = xmlDoc.getElementsByTagName('link');
                    //get Conditional BLocks
                    if (!conditionals)
                        conditionals = xmlDoc.getElementsByTagName('conditional');
                    //Get Blocks
                    if (!blocks)
                        blocks = xmlDoc.getElementsByTagName('block');

                    if (blocks || links || conditionals) {
                        //create Blocks
                        if (blocks.length > 0) {
                            $.each(blocks, function(index, block) {
                                if (block) {
                                    //Retrieve extra-attrs if exists
                                    let position = {};
                                    position.X = 20;
                                    position.Y = 20;
                                    if (block.children && block.children.length > 0 && block.children[0].attributes[0].value && block.children[0].attributes[1].value) {
                                        position.X = parseInt(block.children[0].attributes["left"].value);
                                        position.Y = parseInt(block.children[0].attributes["top"].value);
                                    }
                                    let newBlock = {};
                                    newBlock.Id = block.attributes["Id"].value;
                                    newBlock.Label = block.attributes["Label"].value;
                                    newBlock.Type = block.attributes["Identifier"].value;

                                    let element = ncWorkflow.CreateGenericRectBlock(newBlock, position.X, position.Y);
                                    if (element) {
                                        element.addTo(Paper.model);
                                    } else {
                                        OC.dialogs.alert('Error creating element block', 'Error');
                                    }
                                }
                            });
                        }

                        //Create Conditionals
                        if (conditionals.length > 0) {
                            $.each(conditionals, function(index, condition) {
                                if (condition) {
                                    //Retrieve extra-attrs if exists
                                    let position = {};
                                    position.X = 20;
                                    position.Y = 20;
                                    if (condition.children && condition.children.length > 0 && condition.children[0].attributes[0].value && condition.children[0].attributes[1].value) {
                                        position.X = parseInt(condition.children[0].attributes["left"].value);
                                        position.Y = parseInt(condition.children[0].attributes["top"].value);
                                    }
                                    let newCond = {};
                                    newCond.Id = condition.attributes["Id"].value;
                                    newCond.Label = condition.attributes["Label"].value;
                                    newCond.Type = condition.attributes["Identifier"].value;
                                    var isTwoPort = false;
                                    var index = 0;
                                    for (var link of links) {
                                        if (link.attributes["SourceId"].value == condition.attributes["Id"].value)
                                            index++;
                                    }
                                    if (index == 2)
                                        isTwoPort = true;
                                    let element = ncWorkflow.CreateGenericRhombusBlock(newCond, position.X, position.Y, isTwoPort);
                                    if (element) {
                                        element.addTo(Paper.model);
                                    } else {
                                        OC.dialogs.alert('Error creating element block', 'Error');
                                    }
                                }
                            });
                        }

                        //Create Links
                        if (links.length > 0) {
                            $.each(links, function(index, link) {
                                if (link) {
                                    let newLink = {};
                                    newLink.Id = link.attributes["Id"].value;
                                    newLink.SourceId = link.attributes["SourceId"].value;
                                    newLink.TargetId = link.attributes["TargetId"].value;
                                    newLink.SourcePort = link.attributes["SourcePort"].value;
                                    newLink.TargetPort = link.attributes["TargetPort"].value;
                                    var vertices = [];
                                    var coordinates = link.children;
                                    if (coordinates.length > 0)
                                        for (var coordinate of coordinates)
                                            vertices.push({
                                                x: coordinate.attributes["left"].value,
                                                y: coordinate.attributes["top"].value
                                            });

                                    newLink.Vertices = vertices;
                                    ncWorkflow.CreateLinkById(newLink);
                                }
                            });
                        }

                    }


                }
            }
        } catch (error) {
            console.log(error);
        }
    },

    ImportFromXPDL: function(xml) {
        try {
            var self = this;
            ParserXPDL(xml, function(response) {
                if (response != null && response.Performed) {
                    if (response.Error != null && response.Error != "")
                        OC.dialogs.alert(response.Error, 'Warning');
                    else {
                        if (ncWorkflow.AppId == "wfam") {
                            let links = null;
                            let conditionals = null;
                            let blocks = null;
                            var result = self.ParserXmlXPDL(response.XML, blocks, links, conditionals);
                            response.XPDLlParser = result.XPDLParser;
                            self.ImportFromXML(response.XML, response.XPDLlParser.Blocks, response.XPDLlParser.Conditionals, response.XPDLlParser.Links);
                        } else {
                            self.ImportFromXML(response.XML);
                        }
                    }
                } else {
                    OC.dialogs.alert('Impossibile importare il file', 'Warning');
                }
            });
        } catch (error) {
            console.log(error);
        }
    },

    ParserXmlXPDL(xml) {
        var xmlDoc = null;
        if (window.DOMParser) {
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString(xml, "text/xml");
        } else // Internet Explorer
        {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(xml);
        }
        if (xmlDoc) {
            //get Links
            links = xmlDoc.getElementsByTagName('link');
            //get Conditional BLocks
            conditionals = xmlDoc.getElementsByTagName('conditional');
            //Get Blocks
            blocks = xmlDoc.getElementsByTagName('block');

            if (blocks || links || conditionals) {
                //create Blocks
                if (blocks.length > 0) {
                    $.each(blocks, function(index, block) {
                        if (block) {
                            if (block.attributes["Identifier"].value != "Approvazione" && block.attributes["Identifier"].value != "Rifiuto") {
                                var id = block.attributes["Id"].value;
                                block.attributes["Id"].value = block.attributes["Identifier"].value;

                                block.attributes["Identifier"].value = block.attributes["Id"].value.substring(0, 1);
                                $(links).filter(function(index, link) {
                                    if (link.attributes["SourceId"].value == id)
                                        link.attributes["SourceId"].value = block.attributes["Id"].value;
                                    if (link.attributes["TargetId"].value == id)
                                        link.attributes["TargetId"].value = block.attributes["Id"].value;

                                })
                            }
                        }
                    });
                    let response = {
                        "XPDLParser": {
                            "Blocks": blocks,
                            "Links": links,
                            "Conditionals": conditionals
                        }
                    };
                    return response;
                }
            }
        }
        return null;
    }

}

var dragStartPosition;
$("#paper")
    .mousemove(function(event) {
        if (dragStartPosition)
            Paper.translate(
                event.offsetX - dragStartPosition.x,
                event.offsetY - dragStartPosition.y);
    });