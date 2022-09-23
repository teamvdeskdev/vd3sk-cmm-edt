var WFAModel = null;

function ModelWfa(editor) {
    this.Id = this.GetIdWfa();
    this.Model = null;
    this.BaseRequestUrl = this.GetBaseRequestUrl();
    this.Editor = editor;
}

ModelWfa.prototype.Read = function() {
    var url = this.BaseRequestUrl + "apps/wfam/wfa/read";
    let filter = {
        "Filter": {}
    };
    filter.Filter.Id = this.Id;
    this.AjaxCallPOST(url, filter, function(response) {
        if (response != null && response.Model != null && response.Model.Performed &&
            response.Model.Dto != null) {
            WFAModel.Model = response.Model;
            var dto = response.Model.Dto;
            if (dto.Templatepdf != null && dto.Templatepdf != "")
                WFAModel.Editor.setData(dto.Templatepdf);
        } else {
            this.HidePageLoader();
            WFAModel.Editor.showNotification("Errore durarte il caricamento", "warning");
        }
    })

}

ModelWfa.prototype.BindView = function() {
    $("#bnlhr-NomeWfa").append(WFAModel.Model.Dto.Nome);
    var getUrl = window.location;
    var baseUrl = getUrl.pathname.split('/')[1];
    var url = "/" + baseUrl + "/apps/wfam/ckeditor/editor/index.html?idw=" + WFAModel.Model.Dto.Id + "&baseurl=" + WFAModel.Model.BaseUrl;
    $("#bnlhr-editorWfa").attr('src', url);

}

ModelWfa.prototype.BindModel = function() {
    if (WFAModel.Model != null) {
        WFAModel.Model.Dto.Templatepdf = this.Editor.getData();
    }

}

ModelWfa.prototype.AjaxCallPOST = function(url, jsonModel, callback) {
    var model = {
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
        callback(response);
    });
}

ModelWfa.prototype.ShowPageLoader = function() {
    $("body").append("<div id='panelLoading' style='position: fixed;z-index: 1000;padding-top: 100px;left: 0;top: 0; width: 100%; height: 100%; overflow: auto;" +
        "background-color: grey;opacity: .5;'><span id='PageLoader' style='position:absolute;left:50%;top:50%;color:black' class='icon loading'></span></div>");
    var self = this;
    setTimeout(function() {
        if ($("#panelLoading").length) {
            self.HidePageLoader();
        }
    }, 10000);
}

ModelWfa.prototype.HidePageLoader = function() {
    $("#panelLoading").remove();
}

ModelWfa.prototype.GetBaseRequestUrl = function() {
    let url = new URL(window.location.href);
    var requestUrl = url.searchParams.get("baseurl");
    return requestUrl;
}
ModelWfa.prototype.GetIdWfa = function() {
    let url = new URL(window.location.href);
    var idWfa = url.searchParams.get("idw");
    return idWfa;
}

function FileManager() {
    this.SelectedImg = null;
}

FileManager.prototype.Load = function() {
    ShowPageLoader();
    model = { "Path": "apps/wfam/uploads", "Dtos": [] }
    let location = new URL(window.location.href);
    var requestUrl = location.searchParams.get("baseurl").substring(0, location.searchParams.get("baseurl").indexOf('?'));
    let url = requestUrl + "apps/wfam/filemanager/get";
    this.AjaxCallPOST(url, model, function(response) {
        if (response != null && response.Dtos != null && response.Dtos.length > 0) {
            $("#pnlFileList").empty();
            var getUrl = window.location;
            var baseUrl = getUrl.pathname.split('/')[1];
            if (!baseUrl.includes("apps")) baseUrl += "/apps";

            var index = 0;
            for (var dto of response.Dtos) {
                index += 1;
                var elem = '<li id="img-' + index + '" data-path="/' + baseUrl + "/wfam/uploads/" + dto + '"' +
                    'class="unselected"' +
                    'title="' + dto + '">' +
                    '<img  src="/' + baseUrl + "/wfam/uploads/" + dto + '" width="150">' +
                    '</li>';
                $(elem).appendTo("#pnlFileList");
                $("#img-" + index).click(function(e) {
                    filemanager.SelectImage(e.currentTarget);
                })
            }
            HidePageLoader();
        } else {
            $("#pnlEmptyDir").show();
            HidePageLoader();
        }
    })
}

FileManager.prototype.SelectImage = function(target) {

    var images = $("#pnlFileList").find('li');
    for (var i = 0; i < images.length; i++) {
        if ($(images[i]).hasClass("selected")) {
            $(images[i]).removeClass("selected");
            $(images[i]).addClass("unselected");
        }
    }

    if ($(target).hasClass("unselected")) {
        $(target).removeClass("unselected");
        $(target).addClass("selected");
    } else {
        $(target).removeClass("selected");
        $(target).addClass("unselected");
    }
    this.SetImage(target);
}
FileManager.prototype.SetImage = function(target) {
    this.SelectedImg = $(target).find('img');
}
FileManager.prototype.AjaxCallPOST = function(url, jsonModel, callback) {
    var model = {
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
        callback(response);
    });
}

// function SelectFile(e) {
//     if (filemanager.SelectedImg != null) {
//         let location = new URL(window.location.href);
//         var param = location.searchParams.get("CKEditorFuncNum");
//         var insertPath = $(filemanager.SelectedImg).attr("src");
//         window.opener.CKEDITOR.tools.callFunction(param, insertPath);
//         self.close();
//     } else {
//         alert("Seleziona un file");
//     }
// }
function SelectFile(path, funcNum) {
    if (path && path.length > 0) {
        window.CKEDITOR.tools.callFunction(funcNum, path);
    }
}

function UploadFile(file, data, filemanager, location) {
    let model = {
        "Dto": {}
    };
    var path = "apps/wfam/uploads";

    model.Dto.Path = path;
    model.Dto.FileName = file.name;
    model.Dto.Stream = data;
    model.Dto.Location = "local";

    var requestUrl = location.href.substring(0, location.href.indexOf("apps"));
    requestUrl += location.searchParams.get("baseurl");
    let url = requestUrl + "apps/wfam/filemanager/upload";
    console.log("Url request" + url);
    filemanager.AjaxCallPOST(url, model, function(response) {
        if (response.Performed) {
            var path = "/" + response.Dto.Path + "/" + response.Dto.FileName;
            SelectFile(path, "0");
        } else {
            WFAModel.Editor.showNotification("Caricamento non riuscito", "warning");
        }
    });


    // let files = $("#fileUploads");
    // if (files != null && files.length >= 1 && files[0].files.length > 0) {
    //     let fReader = new FileReader();
    //     fReader.readAsDataURL(files[0].files[0]);
    //     fReader.onloadend = function(event) {
    //         let model = {
    //             "Dto": {}
    //         };
    //         var path = "apps/wfam/uploads";

    //         model.Dto.Path = path;
    //         model.Dto.FileName = files[0].files[0].name;
    //         model.Dto.Stream = event.target.result;
    //         model.Dto.Location = "local";

    //         let location = new URL(window.location.href);
    //         var requestUrl = location.searchParams.get("baseurl").substring(0, location.searchParams.get("baseurl").indexOf('?'));;
    //         let url = requestUrl + "apps/wfam/filemanager/upload";
    //         filemanager.AjaxCallPOST(url, model, function(response) {
    //             if (response.Performed) {
    //                 filemanager.Load();
    //             }
    //         });
    //     };

    // }
}

function DeleteFile() {
    if (filemanager.SelectedImg != null) {
        let model = {
            "Dto": {}
        };
        var path = $(filemanager.SelectedImg).attr("src");
        model.Dto.Path = path.substring(path.indexOf('apps'), path.length);

        let location = new URL(window.location.href);
        var requestUrl = location.searchParams.get("baseurl").substring(0, location.searchParams.get("baseurl").indexOf('?'));
        let url = requestUrl + "apps/wfam/filemanager/delete";
        filemanager.AjaxCallPOST(url, model, function(response) {
            if (response.Performed) {
                $("#pnlFileList").empty();
                filemanager.Load();
            }
        });
    } else {
        alert("Seleziona il file da eliminare");
    }
}

function ShowPageLoader() {
    $("#loading").show();

    setTimeout(function() {
        if ($("#loading").length) {
            HidePageLoader();
        }
    }, 10000);
}

function HidePageLoader() {
    $("#loading").hide();
}