function Navigation() {
    this.paths = [];
    this.index = 0;
    this.id = 0;
};

Navigation.prototype.GoTo = function(breadcrumbName, url, params, callBack) {
    //Show page Loader
    ShowPageLoader();
    ClearDialogPreview();
    let self = this;
    let index = self.index + 1;

    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(params),
    }).done(function(html) {
        if (html != null) {
            //Eventually stops timerId if exists.
            if (timerId) {
                clearInterval(timerId);
            };
            if (self.paths[index] === null || self.paths[index] === undefined) {
                self.BreadcrumbAdd(breadcrumbName, url, params, index, callBack);
            }
            let page = $($.parseHTML(html)).find(".bnlhr-view").html();

            $("#app-pages").html("<div class=\"bnlhr-view\">\n" + page + "</div>");
            if (callBack) {
                callBack(params);
            }
        }
    }).fail(function(response, code) {
        HidePageLoader();
    });
};

Navigation.prototype.BreadcrumbGoTO = function(path) {
    ShowPageLoader();
    ClearDialogPreview();
    let self = this;
    $.ajax({
        url: path.url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(path.params),
    }).done(function(html) {
        if (html != null) {
            //Eventually stops timerId if exists.
            if (timerId) {
                clearInterval(timerId);
            };
            if (path) {
                self.BreadcrumbRemove(path);
            }
            let page = $($.parseHTML(html)).find(".bnlhr-view").html();

            $("#app-pages").html("<div class=\"bnlhr-view\">\n" + page + "</div>");
            if (path.callback) {
                path.callback(path.params);
            }
        }
    }).fail(function(response, code) {
        HidePageLoader();
    });
};

Navigation.prototype.Back = function(params, callBack) {
    ShowPageLoader();
    ClearDialogPreview();
    let destinationPage = this.paths[this.index - 1];
    let url = destinationPage.url;
    let self = this;
    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(params),
    }).done(function(html) {
        if (html != null) {
            //Eventually stops timerId if exists.
            if (timerId) {
                clearInterval(timerId);
            };

            ($('.bnlhr-breadcrumb .breadcrumb div')[self.index]).remove();
            self.paths.pop();
            $('.bnlhr-breadcrumb .breadcrumb div:last-child a').addClass("active");
            self.index = self.index - 1;

            let page = $($.parseHTML(html)).find(".bnlhr-view").html();
            $("#app-pages").html("<div class=\"bnlhr-view\">\n" + page + "</div>");
            if (callBack)
                callBack(params);
        }
    }).fail(function(response, code) {
        HidePageLoader();
    });
};

Navigation.prototype.BreadcrumbAdd = function(breadcrumbName, url, params, index, callBack) {
    let elemExists = $(".bnlhr-breadcrumb .breadcrumb").find("#" + index + "");
    if (elemExists.length <= 0) {
        $('.bnlhr-breadcrumb .breadcrumb div:last-child a').removeClass("active");
        if (index == 0) {
            $("<div class=\"crumb svg\"><a style=\"opacity: 1;color:var(--color-primary);\" href='#' id='" + index + "'>" + breadcrumbName + "</a></div>").appendTo(".bnlhr-breadcrumb .breadcrumb");
        } else {
            $("<div class=\"crumb svg\"><a href='#' id='" + index + "'>" + breadcrumbName + "</a></div>").appendTo(".bnlhr-breadcrumb .breadcrumb");
        }
        this.paths.push({
            breadcrumbName: breadcrumbName,
            url: url,
            params: params,
            id: index,
            callback: callBack
        });
        this.index = index;
        $('.bnlhr-breadcrumb .breadcrumb div:last-child a').addClass("active");
    }
};

Navigation.prototype.Clear = function() {
    $('.bnlhr-breadcrumb .breadcrumb').empty();
    navigation = new Navigation();
    navigation.BreadcrumbAdd("WFA", "/apps/wfam/", null, 0, null);
};

Navigation.prototype.BreadcrumbRemove = function(path) {
    let self = this;
    let id = path.id;
    let lenght = self.paths.length - 1;
    for (let i = lenght; i >= 0; i--) {
        if (self.paths[i].id !== id) {
            ($('.bnlhr-breadcrumb .breadcrumb div')[self.paths.length - 1]).remove();
            self.paths.pop();
            self.index = self.index - 1;
        } else {
            break;
        }
    }
    $('.bnlhr-breadcrumb .breadcrumb div:last-child a').addClass("active");
};

let navigation = new Navigation();
$(".bnlhr-breadcrumb").on("click", "a", function(e) {
    let id = parseInt(e.currentTarget.id);
    let path = navigation.paths.find(q => q.id === id);
    if (path && path.callback) {
        navigation.BreadcrumbGoTO(path);
        // navigation.BreadcrumbGoTO(path.breadcrumbName, path.url, path.params, path.callback);
    }
});

var timerLoading = null;

function ShowPageLoader() {
    $("body").append("<div id='panelLoading' style='position: fixed;z-index: 10000;padding-top: 100px;left: 0;top: 0; width: 100%; height: 100%; overflow: auto;" +
        "background-color: grey;opacity: .5;'><span id='PageLoader' style='position:absolute;left:50%;top:50%;color:black' class='icon loading'></span></div>");

    timerLoading = setTimeout(function() {
        if ($("#panelLoading").length) {
            HidePageLoader();
        }
    }, 20000);
}

function HidePageLoader() {
    $("#panelLoading").remove();
    if (timerLoading != null) {
        clearTimeout(timerLoading);
        timerLoading = null;
    }
}

function ClearDialogPreview() {
    $(".oc-dialog").remove();
    $(".oc-dialog-dim").remove();
    $("#dlgAnteprimaPratica").remove();
}