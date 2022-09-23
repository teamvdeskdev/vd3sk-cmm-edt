class SettingsModel {
    constructor() {
        this.Dto = null;
        this.Performed = false;
        this.Message = null;
    }
}

class SettingsDto {
    constructor() {
        this.username = null;
        this.password = null;
        this.server_port = null;
        this.designer_group = null;
        this.enable_page_action = null;
        this.enable_sap = null;
        this.sap_service_url = null;
        this.sap_authentication = null;
        this.sap_username = null;
        this.sap_password = null;
        this.progressive_service_url = null;
        this.progressive_service_username = null;
        this.progressive_service_password = null;
        this.progressive_service_authentication = null;
        this.super_admin_group = null;
    }
}

class Settings {
    constructor() {
        this.Model = null;
        this.Inizialize();
    }

    Inizialize() {
        this.Model = new SettingsModel();
        this.Model.Dto = new SettingsDto();
    }

    PageLoad() {
        this.WfmSettingsShowPageLoader();
        var self = this;
        $(document).ready(function() {
            self.BindEvent();
            self.BindView();
        });
    }

    BindView() {
        this.ClearFields()
        var self = this;
        let model = { "Model": {} };
        model.Model = this.Model;
        var url = OC.generateUrl('apps/workflowmanager/settings/load');
        this.WfmAjaxCallPOST(url, model, function(response) {
            self.Model = response;
            if (response != null && response.Performed) {
                var input = $(".wfm-table-settings input").toArray();
                var select = $(".wfm-table-settings select").toArray();
                self.BindViewFileds(response.Dto, input);
                self.BindViewFileds(response.Dto, select);
                self.WfmSettingsHidePageLoader();
            } else {
                self.WfmSettingsHidePageLoader();
                OC.dialogs.info('Tentativo di leggere il file di configurazione fallito.', 'Info');
            }
        })
    }

    BindModel() {
        var input = $(".wfm-table-settings input").toArray();
        var select = $(".wfm-table-settings select").toArray();
        this.BindModelFileds(input, this.Model.Dto);
        this.BindModelFileds(select, this.Model.Dto);

    }

    BindEvent() {
        wfmSettings.AutocompleteGroups(document.getElementById("designer_group"));
        wfmSettings.AutocompleteGroups(document.getElementById("super_admin_group"));
        $("#app-content").on('click', '#wfm-btnSaveSettings', function(e) {
            e.preventDefault();
            e.stopPropagation();
            wfmSettings.Save();
        })
    }

    Save() {
        this.WfmSettingsShowPageLoader();
        this.BindModel();
        let model = { "Model": {} };
        model.Model = this.Model;
        var url = OC.generateUrl('apps/workflowmanager/settings/save');
        this.WfmAjaxCallPOST(url, model, function(response) {
            if (response != null && response.Performed) {
                wfmSettings.WfmSettingsHidePageLoader();
                OC.dialogs.info('Salvataggio effettuato.', 'Info');
            } else {
                wfmSettings.WfmSettingsHidePageLoader();
                OC.dialogs.info('Salvataggio fallito.', 'Info');
            }
        })
    }

    BindViewFileds(dto, fields) {
        if (fields != null && dto != null) {
            fields.forEach(function(field) {
                var propertyName = field.id;
                if (field.type == "text" || field.type == "password")
                    $(field).val(dto[propertyName]);
                else if (field.type == "checkbox")
                    $(field).prop('checked', dto[propertyName]);
                else if (field.type == "select")
                    $(field + " option[value='" + dto[propertyName] + "']").prop('selected', true);
            });
        }
    }

    BindModelFileds(fields, dto) {
        if (fields != null && dto != null) {
            fields.forEach(function(field) {
                var propertyName = field.id;
                if (field.type == "text" || field.type == "password")
                    dto[propertyName] = $(field).val();
                else if (field.type == "checkbox")
                    dto[propertyName] = $(field).is(':checked');
                else if (field.type == "select-one")
                    dto[propertyName] = $("#" + field.id + " option:selected").val();
            });
        }
    }

    ClearFields() {
        var fields = $(".wfm-table-settings input").toArray();
        if (fields != null) {
            fields.forEach(function(field) {
                if (field.type == "text" || field.type == "password")
                    $(field).val("");
                else if (field.type == "checkbox")
                    $(field).prop('checked', false);
            });
        }
    }

    WfmAjaxCallPOST(url, jsonModel, callback) {
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

    WfmSettingsShowPageLoader() {
        $("body").append("<div id='wfasettingsLoading' style='position: fixed;z-index: 10000;padding-top: 100px;left: 0;top: 0; width: 100%; height: 100%; overflow: auto;" +
            "background-color: grey;opacity: .5;'><span id='PageLoader' style='position:absolute;left:50%;top:50%;color:black' class='icon loading'></span></div>");

        setTimeout(function() {
            if ($("#wfasettingsLoading").length) {
                wfmSettings.WfmSettingsHidePageLoader();
            }
        }, 10000);
    }

    WfmSettingsHidePageLoader() {
        $("#wfasettingsLoading").remove();
    }

    AutocompleteGroups(inp, gruppo) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function(e) {
            var self = this;
            if (timerAutocompleteSearch !== null)
                clearTimeout(timerAutocompleteSearch);
            timerAutocompleteSearch = setTimeout(function() {
                var a, b, i, val = self.value;
                /*close any already open lists of autocompleted values*/
                closeAllLists();
                if (!val) { return false; }
                currentFocus = -1;
                /*create a DIV element that will contain the items (values):*/
                a = document.createElement("DIV");
                a.setAttribute("id", self.id + "autocomplete-list");
                a.setAttribute("class", "autocomplete-items");
                /*append the DIV element as a child of the autocomplete container:*/
                self.parentNode.appendChild(a);
                $(self).parent().find("#autocompleteLoading").show();

                let group = new GroupModel();
                group.Search = self.value;
                group.LoadSearchGroups(group, function(response) {
                    if (response != null && response.Performed && response.Dtos != null) {
                        var dtos = response.Dtos;
                        /*for each item in the array...*/
                        for (i = 0; i < dtos.length; i++) {
                            var nome = dtos[i].Nome;
                            /*check if the item starts with the same letters as the text field value:*/
                            if (nome.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                                /*create a DIV element for each matching element:*/
                                b = document.createElement("DIV");
                                /*make the matching letters bold:*/
                                b.innerHTML = "<strong>" + nome.substr(0, val.length) + "</strong>";
                                b.innerHTML += nome.substr(val.length);
                                /*insert a input field that will hold the current array item's value:*/
                                b.innerHTML += "<input type='hidden' data-id='" + nome + "' data-uid='" + nome + "' value='" + nome + "'>";
                                /*execute a function when someone clicks on the item value (DIV element):*/
                                b.addEventListener("click", function(e) {
                                    /*insert the value for the autocomplete text field:*/
                                    inp.value = this.getElementsByTagName("input")[0].value;
                                    inp.setAttribute("data-id", this.getElementsByTagName("input")[0].getAttribute('data-id'));
                                    inp.setAttribute("data-uid", this.getElementsByTagName("input")[0].getAttribute('data-id'));
                                    /*close the list of autocompleted values,
                                    (or any other open lists of autocompleted values:*/
                                    closeAllLists();
                                });
                                a.appendChild(b);
                            }
                        }
                        $(self).parent().find("#autocompleteLoading").hide();
                    } else {
                        $(self).parent().find("#autocompleteLoading").hide();
                        return false;
                    }
                })
            }, 2000);
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function(e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[currentFocus].click();
                }
            }
        });

        function addActive(x) {
            /*a function to classify an item as "active":*/
            if (!x) return false;
            /*start by removing the "active" class on all items:*/
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            /*add class "autocomplete-active":*/
            x[currentFocus].classList.add("autocomplete-active");
        }

        function removeActive(x) {
            /*a function to remove the "active" class from all autocomplete items:*/
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }

        function closeAllLists(elmnt) {
            /*close all autocomplete lists in the document,
            except the one passed as an argument:*/
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function(e) {
            closeAllLists(e.target);
        });

        function isInGroup(dtoUser, gruppo, groups) {
            if (!gruppo) return true;
            else {
                for (let i = 0; i < groups.length; i++) {
                    if (groups[i] === BNLHRGROUPS.BNLHRGR || groups[i] === BNLHRGROUPS.BNLHRGC || groups[i] === BNLHRGROUPS.BNLHRGA) {
                        let dto = { "Id": dtoUser.Id, "Nome": dtoUser.Nome, "Email": dtoUser.Email, "Group": groups[i] };
                        if (groups[i] === gruppo && gruppo === BNLHRGROUPS.BNLHRGR) {
                            modelUtenti.Model.DtosGR.push(dto);
                            return true;
                        }
                        if (groups[i] === gruppo && gruppo === BNLHRGROUPS.BNLHRGC) {
                            modelUtenti.Model.DtosGC.push(dto);
                            return true;
                        }
                        if (groups[i] === gruppo && gruppo === BNLHRGROUPS.BNLHRGA) {
                            modelUtenti.Model.DtosGA.push(dto);
                            return true;
                        }
                    }
                }
                return false;
            }
        }
    }
}

var wfmSettings = new Settings();
wfmSettings.PageLoad();