class AppsWfa {

    PageLoad() {
        var self = this;
        var filter = {
            "Stato": statoWfa.PUBBLICATO
        };
        var codiceRuolo = WFARUOLO.R;
        GetWFAAuthorized(currentUser.Model.Dto.Groups, filter, codiceRuolo, function(response) {
            if (response !== null && response.Model.Performed) {
                if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
                    self.BindView(response.Model.Dtos);
                    HidePageLoader();
                } else {
                    HidePageLoader();
                    OC.dialogs.alert('Nessuna app disponibile.', 'Avviso');
                }
            } else {
                HidePageLoader();
                OC.dialogs.alert('Non è stato possibile recuperare i dati.', 'Avviso');
            }
        })
    }

    BindView(dtos) {
        var self = this;
        if (dtos.length > 0) {
            dtos.forEach(function(dto) {
                var icon = "defaultIcon.png";
                if (dto.Icon != null) {
                    icon = dto.Icon;
                }
                if (icon == "defaultIcon.png")
                    icon = OC.imagePath("wfam", icon);
                else {
                    icon = OC.imagePath("wfam", 'uploads/wfaIcon/' + icon);
                    icon = icon.replace("img/", "");
                }

                var appBox = '<div class="vcanvas-app-box">\n' +
                    '  <div class="vcanvas-app-box-icon"><img class="playAppIcon" data-id="' + dto.Id + '" src="' + icon + '" data-name="' + dto.Nome + '" data-richiesta-personale="' + dto.RichiestaPersonale + '" data-categoria="' + dto.NomeCategoria + '" /></div>\n' +
                    '  <div class="vcanvas-app-box-title"><p style="padding: 5px;">' + dto.Nome.toUpperCase() + '</p>' +
                    '</div>\n' +
                    '</div>\n';
                $(".vcanvas-apps-container").append(appBox);
            });
        }
        $(".playAppIcon").unbind("click");
        $(".playAppIcon").bind("click", function(e) {
            self.AppIcon_Click(e);
        });
    }

    AppIcon_Click(e) {
        var target = e.target;
        if (target) {
            var wfaId = $(target).attr("data-id");
            var nome = $(target).attr("data-name");
            var richiestaPersonale = $(target).attr("data-richiesta-personale");
            var categoriaWfa = $(target).attr("data-categoria");
            if (wfaId && wfaId > 0) {
                let model = {
                    "Model": {
                        "NomeCategoria": categoriaWfa,
                        "Filter": {
                            "WfaId": parseInt(wfaId),
                            "Nome": nome,
                            "RichiestaPersonale": richiestaPersonale
                        }
                    }
                };
                let url = OC.generateUrl("/apps/wfam/avvia_wfa");
                navigation.GoTo("Avvia WFA", url, model, function(model) {
                    LoadAvviaWFA(model);
                });
            }
        }
    }
}