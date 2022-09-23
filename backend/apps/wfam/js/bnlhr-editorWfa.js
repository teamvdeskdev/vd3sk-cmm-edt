function EditorWfa(model) {
    this.Model = model;
}

EditorWfa.prototype.PageLoad = function() {

    this.BindView();
    HidePageLoader();
}

EditorWfa.prototype.BindView = function() {
    $("#bnlhr-NomeWfa").append(this.Model.Dto.Nome);
    var self = this;
    GetServerRoot(function(root) {
        var url = "/apps/wfam/ckeditor/editor/index.html?idw=" + self.Model.Dto.Id + "&baseurl=" + self.Model.BaseUrl;
        $("#bnlhr-editorWfa").attr('src', url);
    })

}