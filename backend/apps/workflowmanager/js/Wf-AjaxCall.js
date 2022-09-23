function WFAjaxCallPOST(url, jsonModel, callback) {
    try {
        let self = this;
        let model = {
            "Model": {}
        };
        model.Model = jsonModel;
        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(model),


        }).done(function(response) {
            if (callback)
                callback(response);
        }).fail(function(response, code) {
            if (callback)
                callback(null);
        });
    } catch (error) {
        if (callback)
            callback(null);
    }

}

function SetAuthorizzation(jsonModel, callback) {
    if (jsonModel != null) {
        let url = OC.generateUrl('apps/workflowmanager/api/setauthorization');
        WFAjaxCallPOST(url, jsonModel, function(response) {
            var model = (response != null ? response.Model : null)
            if (model == null) {
                model = { "Performed": false, "Message": "Si è verificato un errore durante la richiesta" };
            }
            if (callback)
                callback(model);
        })
    }
}

function SetEndWorkflow(jsonModel, callback) {
    if (jsonModel != null) {
        let url = OC.generateUrl('apps/workflowmanager/api/endworkflow');
        WFAjaxCallPOST(url, jsonModel, function(response) {
            var model = (response != null ? response.Model : null)
            if (model != null && model.Performed) {
                if (callback)
                    callback(model.Performed);
            } else {
                if (callback)
                    callback(false);
            }
        })
    }
}

function GetAuthorizzation(jsonModel, callback) {
    if (jsonModel != null) {
        let url = OC.generateUrl('apps/workflowmanager/api/getauthorization');
        WFAjaxCallPOST(url, jsonModel, function(response) {
            var model = (response != null ? response.Model : null)
            if (model != null && model.Performed) {
                if (callback)
                    callback(model.Authorized);
            } else {
                if (callback)
                    callback(false);
            }
        })
    }
}

function GetFileContent(file, callback) {

    let url = OC.generateUrl('apps/workflowmanager/api/file');

    WFAjaxCallPOST(url, file, function(response) {
        if (callback)
            callback(response);

    })
}

function GetFilestream(file, callback) {

    let url = OC.generateUrl('apps/workflowmanager/api/stream');

    WFAjaxCallPOST(url, file, function(response) {
        if (callback)
            callback(response);

    })
}

function GetCellFromId(jsonModel, callback) {

    let url = OC.generateUrl('apps/workflowmanager/api/getcell');

    WFAjaxCallPOST(url, jsonModel, function(response) {
        if (callback)
            callback(response);

    })
}

function DigitalSignage(jsonModel, callback) {

    let url = OC.generateUrl('apps/workflowmanager/api/digitalsignage');
    WFAjaxCallPOST(url, jsonModel, function(response) {
        if (callback)
            callback(response);

    })
}

function ParserXPDL(xml, callback) {
    var model={};
    model.XPDL=xml;
    let url = OC.generateUrl('apps/workflowmanager/api/xpdlparser');
    WFAjaxCallPOST(url, model, function(response) {
        if (callback)
            callback(response);

    })
}