var timerAutocompleteSearch = null;

function autocomplete(inp, gruppo) {
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
            if (!val) {
                return false;
            }
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", self.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            self.parentNode.appendChild(a);
            $("#autocompleteLoading").show();

            let user = new UserModel();
            user.Search = self.value;
            user.LoadSearchUsers(user, function(response) {
                if (response != null && response.Performed && response.Dtos != null) {
                    var dtos = response.Dtos;
                    /*for each item in the array...*/
                    for (i = 0; i < dtos.length; i++) {
                        var nome = dtos[i].Nome;
                        var email = dtos[i].Email;
                        var account = dtos[i].Account;
                        var groups = dtos[i].Groups
                        var dto = {
                            "Id": account,
                            "Uid": account,
                            "Nome": nome,
                            "Email": email,
                            "Group": "BNLHRDipendenti"
                        };
                        var utente = modelUtenti.Model.DtosDipendenti.find(x => x.Uid == account);
                        if (!utente)
                            modelUtenti.Model.DtosDipendenti.push(dto);

                        var organoEccezione = modelUtenti.Model.DtosGA.find(x => x.Uid == account);
                        if (!organoEccezione)
                            modelUtenti.Model.DtosGA.push(dto);
                        //if (isInGroup(dto, gruppo, groups)) {
                        /*check if the item starts with the same letters as the text field value:*/
                        if (nome.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                            /*create a DIV element for each matching element:*/
                            b = document.createElement("DIV");
                            /*make the matching letters bold:*/
                            b.innerHTML = "<strong>" + nome.substr(0, val.length) + "</strong>";
                            b.innerHTML += nome.substr(val.length);
                            /*insert a input field that will hold the current array item's value:*/
                            b.innerHTML += "<input type='hidden' data-id='" + account + "' data-uid='" + account + "' value='" + nome + "'>";
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
                        //}

                    }
                    $("#autocompleteLoading").hide();
                } else {
                    $("#autocompleteLoading").hide();
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
}

function autocompleteGroups(inp, gruppo) {
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
            if (!val) {
                return false;
            }
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
    inp.addEventListener("click", function(e) {
        var self = this;
        var groups = GetGroupsRuoloWfa(inp);
        if (document.getElementsByClassName("autocomplete-items").length <= 0) {
            if (timerAutocompleteSearch !== null)
                clearTimeout(timerAutocompleteSearch);
            timerAutocompleteSearch = setTimeout(function() {
                var a, b, i, val = self.value;
                /*close any already open lists of autocompleted values*/
                closeAllLists();
                if (!val) {
                    currentFocus = -1;
                    /*create a DIV element that will contain the items (values):*/
                    a = document.createElement("DIV");
                    a.setAttribute("id", self.id + "autocomplete-list");
                    a.setAttribute("class", "autocomplete-items");
                    /*append the DIV element as a child of the autocomplete container:*/
                    self.parentNode.appendChild(a);
                    $(self).parent().find("#autocompleteLoading").show();

                    let group = new GroupModel();
                    group.Search = null;
                    group.LoadSearchGroups(group, function(response) {
                        if (response != null && response.Performed && response.Dtos != null) {
                            var dtos = response.Dtos;
                            /*for each item in the array...*/
                            for (i = 0; i < dtos.length; i++) {
                                var nome = dtos[i].Nome;
                                if (!groups.includes(nome)) {
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
                            }
                            $(self).parent().find("#autocompleteLoading").hide();
                        } else {
                            $(self).parent().find("#autocompleteLoading").hide();
                            return false;
                        }
                    })
                }
            }, 500);
        }
        // else {
        //     closeAllLists();
        // }
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
}

function customSelect(inp, dtos, container, callback) {
    var currentFocus;
    var multiselect = $(inp).attr("data-multiselect");
    inp.removeEventListener("click", function(e) {});
    inp.addEventListener("click", function(e) {
        e.preventDefault();
        var self = this;
        var a, b;
        closeAllLists();
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", self.id + "autocomplete-list");
        a.setAttribute("class", "option-items");
        self.parentNode.appendChild(a);
        if (dtos) {
            var index = 1
            for (var dto of dtos) {
                var nome = dto.Nome;
                var option = GetOptionTemplate(index, nome);
                $(option).appendTo($(a));
                if (container) {
                    var exist = ($(container).find("#tblRuolo" + nome).length > 0);
                    var op = $(a).find("div[data-codifica='" + nome + "']");
                    $(op).find("input[type='checkbox']").prop("checked", exist);
                }
                index += 1;
            }

            $(".combo-option").unbind();
            $(".combo-option").bind("click", function(e) {
                e.preventDefault();
                e.target;
                var option = $(this).closest("div");
                if (option) {
                    var checked = !$(option).find("input[type='checkbox']").prop("checked");
                    $(option).find("input[type='checkbox']").prop("checked", checked);
                    if (callback)
                        callback(checked, $(inp).attr("data-ruolo"), $(option).attr("data-codifica"), container);
                }

                // let row = $(this).closest("tr");
                // $(row).find("input[type='checkbox']").prop('checked', this.checked);
            })
        } else {
            return false;
        }
    });

    function GetOptionTemplate(index, nome) {
        var option = "<div id=\"option-" + index + "\" class=\"combo-option\" data-codifica=\"" + nome + "\">" +
            // "<input type=\"hidden\" data-codifica=\"" + nome + "\"  value=\"" + nome + "\" >" +
            "<label class=\"container\">" +
            "<input type=\"checkbox\" >" +
            "<span class=\"checkmark\"></span>" +
            "</label>" +
            "<span>" + nome + " </span>" +
            "</div>";
        return option;
    }

    // function addActive(x) {
    //     /*a function to classify an item as "active":*/
    //     if (!x) return false;
    //     /*start by removing the "active" class on all items:*/
    //     removeActive(x);
    //     if (currentFocus >= x.length) currentFocus = 0;
    //     if (currentFocus < 0) currentFocus = (x.length - 1);
    //     /*add class "autocomplete-active":*/
    //     x[currentFocus].classList.add("autocomplete-active");
    // }

    // function removeActive(x) {
    //     /*a function to remove the "active" class from all autocomplete items:*/
    //     for (var i = 0; i < x.length; i++) {
    //         x[i].classList.remove("autocomplete-active");
    //     }
    // }

    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("option-items");
        if (multiselect && multiselect == "false") {
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        } else {
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp && !IsParent(inp, elmnt)) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
    }

    document.addEventListener("click", function(e) {
        closeAllLists(e.target);
    });

    function IsParent(inp, element, index = 0) {
        if (element && element.parentNode && element.parentNode.className == inp.parentNode.className)
            return true;

        index += 1;
        if (index <= 5 && (element && element.parentNode))
            return IsParent(inp, element.parentNode, index);
        else
            return false;

    }
}