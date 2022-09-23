var WfaExport = null;

function ExportWfa(modelWfa) {
    this.Model = modelWfa;
}

ExportWfa.prototype.PageLoad = function() {
    this.BindView();
}

ExportWfa.prototype.BindView = function() {
    $("#bnlhr-ExportNomeWfa").append(this.Model.Dto.Nome);
    var imgSrc = OC.generateUrl("/apps/wfam/img/loading-small.gif").replace("/index.php", "");
    $("#loader-export").attr("src", imgSrc);
    let url = OC.generateUrl("/apps/wfam/praticawfa/count");
    var filter = { "WfaId": this.Model.Dto.Id };
    var model = this.GetCallPostModel(filter);
    bnlhrAjaxCallPOST(url, model, function(response) {
        if (response == null || (response != null && !response.Performed))
            OC.dialogs.info('Qualcosa è andato storto.', 'Info');
        else {
            var count = (response.Count != null ? response.Count : 0);
            $("#numeroPratiche").text(count);
            WfaExport.BindEvent();
        }
        HidePageLoader();
    })
}

ExportWfa.prototype.BindEvent = function() {
    $("#bnlhr-btnExport").click(function() {
        $("#spLoading").show();
        WfaExport.ExportXML();
    })
}

ExportWfa.prototype.ExportXML = function() {
    var filter = { "WfaId": this.Model.Dto.Id };
    var model = this.GetCallPostModel(filter);
    let url = OC.generateUrl("/apps/wfam/wfa/export");
    bnlhrAjaxCallPOST(url, model, function(response) {
        if (response == null || (response != null && !response.Performed && response.XML != null))
            OC.dialogs.info('Qualcosa è andato storto.', 'Info');
        else {
            // Start file download.
            var download = WfaExport.Download("ExportWFA_" + WfaExport.Model.Dto.Nome + ".xml", response.XML);
            if (download)
                OC.dialogs.info('Il file è stato generato e scaricato automaticamente.', 'Info');
        }
        $("#spLoading").hide();
    })
}
ExportWfa.prototype.Download = function(filename, text) {
    try {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        return true;
    } catch (error) {
        OC.dialogs.info('Qualcosa è andato storto.', 'Info');
    }
    return false;
}

ExportWfa.prototype.GetCallPostModel = function(filter) {
    let model = { "Model": { "Performed": false } };
    if (filter != null)
        model.Model.Filter = filter;
    return model;
}