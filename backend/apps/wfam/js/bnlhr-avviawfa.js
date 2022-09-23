function LoadAvviaWFA(model) {
    $('#WfaId').val(model.Model.Filter.WfaId);
    $('#NomeWfa').text(model.Model.Filter.Nome.toUpperCase());
    $('#CategoriaWfa').text(model.Model.NomeCategoria);
    autocomplete(document.getElementById("Dipendente"));
    var richiestaPersonale = model.Model.Filter.RichiestaPersonale;

    if (richiestaPersonale && richiestaPersonale == '1') {
        // $("#bnlhr-btnAggiungiDipendente").remove();
        // $("#Dipendente").prop("readonly", true);

        $("#DipendenteSelect").hide();
        var input = document.getElementById("Dipendente");
        input.value = currentUser.Model.Dto.Nome;
        input.setAttribute("data-id", currentUser.Model.Dto.Id);
        input.setAttribute("data-uid", currentUser.Model.Dto.Id);
        var utente = modelUtenti.Model.DtosDipendenti.find(x => x.Uid == currentUser.Model.Dto.Id);
        if (!utente)
            modelUtenti.Model.DtosDipendenti.push(currentUser.Model.Dto);
        let dto = {};
        dto.Id = $("#Dipendente").attr("data-id");
        dto.Uid = $("#Dipendente").attr("data-uid")
        if (dto.Uid !== "-1") {
            modelUtenti.Model.DtosDipendenti.filter(function(dtoindex) {
                if (dtoindex.Uid == dto.Uid) {
                    dto.NomeDipendente = dtoindex.Nome;
                    dto.Inquadramento = '-';
                    dto.UO = '-';
                    dto.Sede = '-';
                    dto.Mansione = '-';
                    dto.Contratto = '-';
                    let row = GetTemplateRowDipendente(dto);
                    $(row).appendTo("#bnlhr-listDipendenti");
                    $("#bnlhr-btnRowRimuoviDipendente").remove();
                }
            })
        }
    }
    HidePageLoader();
}

function GetTemplateRowDipendente(dto) {

    let row = "<tr id=\"row-" + (dto.Id ? dto.Id : 0) + "\" data-id=\"" + (dto.Id ? dto.Id : 0) + "\" data-uid='" + dto.Uid + "'>\n" +
        "                <td><span class=\"bnlhr-text-pre-wrap bnlhr-font-weight-bold\">" + dto.NomeDipendente + "</span></td>\n" +
        "                <td><span class=\"bnlhr-text-pre-wrap\" >" + dto.Sede + "</span></td>\n" +
        "                <td><span class=\"bnlhr-text-pre-wrap\" >" + dto.Mansione + "</span></td>\n" +
        "                <td><span class=\"bnlhr-text-pre-wrap\" >" + dto.Inquadramento + "</span></td>\n" +
        "</tr>";
    return row;
}
$("#app-pages").on('click', '#bnlhr-btnAggiungiDipendente', function() {

    let dto = {};
    dto.Id = $("#Dipendente").attr("data-id");
    dto.Uid = $("#Dipendente").attr("data-uid")
    if (dto.Uid !== "-1") {
        modelUtenti.Model.DtosDipendenti.filter(function(dtoindex) {
            if (dtoindex.Uid == dto.Uid) {
                dto.NomeDipendente = dtoindex.Nome;
                dto.Inquadramento = '-';
                dto.UO = '-';
                dto.Sede = '-';
                dto.Mansione = '-';
                dto.Contratto = '-';
                let row = GetTemplateRowDipendente(dto);
                $(row).appendTo("#bnlhr-listDipendenti");
                $("#bnlhr-btnAggiungiDipendente").prop("disabled", true);
                $("#Dipendente").prop("disabled", true);
            }
        });

    }
})

$("#app-pages").on('click', '#bnlhr-btnAvantiAvviaWFA', function() {

    let date = moment(); //Get the current date
    date = date.format("YYYY-MM-DD"); //2014-07-10;
    let valid = ValidateAvviaWfa();
    if (valid) {
        $("#bnlhr-listDipendenti tbody>tr").each(function(index, row) {
            let model = {
                "Model": {
                    "Dto": {}
                }
            };
            model.Model.Dto.Id = 0;
            model.Model.Dto.DataRichiesta = date;
            model.Model.DipendenteUid = $(row).attr("data-uid");
            model.Model.Dto.WfaId = $("#WfaId").val();
            model.Model.Dto.Stato = null;
            model.Model.NomeWfa = $("#NomeWfa").text();
            model.Model.NomeCategoria = $('#CategoriaWfa').text();
            let url = OC.generateUrl("/apps/wfam/pratica_wfa_form");
            navigation.GoTo(model.Model.NomeWfa, url, model, function(response) {
                viewType = VIEWTYPE.RICHIESTE;
                LoadPraticaWFAForm(response);
            });
        })
    } else {
        OC.dialogs.alert('Selezionare un dipendente per proseguire', 'AVVISO')
    }
})

$("#app-pages").on('click', '#bnlhr-btnRowRimuoviDipendente', function(event) {

    let row = $(this).closest("tr");
    row.remove();
    $("#bnlhr-btnAggiungiDipendente").prop("disabled", false);
    $("#Dipendente").prop("disabled", false);
    event.preventDefault();

})


function ValidateAvviaWfa() {
    let dipendente = $("#bnlhr-listDipendenti tbody>tr").length == 1;
    return (dipendente);
}

// function LoadAvviaWFA() {
//     autocomplete(document.getElementById("Dipendente"));

// let urlCategoria = OC.generateUrl('apps/wfam/categoriawfa/get');

// bnlhrAjaxCallPOST(urlCategoria, null, function(response) {
//     if (response !== null && response.Model.Performed) {
//         if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
//             $("#AvviaWFACategoriaId").empty();
//             this.BindViewFilterCategoriaWFA(response.Model.Dtos);
//             HidePageLoader();
//         } else {
//             HidePageLoader();
//         }
//     } else {
//         HidePageLoader();
//     }
// });
// }


// function BindViewFilterCategoriaWFA(dtos) {
//     $("<option value=\"-1\">Seleziona una categoria</option>\n").appendTo("#AvviaWFACategoriaId");

//     dtos.forEach(function(dto) {
//         let option = "<option value=\"" + dto.Id + "\">" + dto.Nome + "</option>";
//         $(option).appendTo("#AvviaWFACategoriaId");
//     });
// }

// function BindViewFilterWFA(dtos) {
//     $("<option value=\"-1\">Seleziona una richiesta</option>").appendTo("#Richiesta");

//     dtos.forEach(function(dto) {
//         let option = "<option value=\"" + dto.Id + "\" data-richiesta-personale=\"" + dto.RichiestaPersonale + "\">" + dto.Nome + "</option>";
//         $(option).appendTo("#Richiesta");
//     });
// }

// function ValidateAvviaWfa() {
//     let richiesta = ($("#Richiesta option:selected").val() && $("#Richiesta option:selected").val() > 0);
//     let dipendente = $("#bnlhr-listDipendenti tbody>tr").length == 1;
//     return (richiesta && dipendente);
// }



// $("#app-pages").on('change', '#AvviaWFACategoriaId', function() {
//     $("#Richiesta").empty();
//     let categoriaId = parseInt($("#AvviaWFACategoriaId option:selected").val());
//     if (categoriaId >= 1) {
//         GetWFAAuthorized(categoriaId, currentUser.Model.Dto.Groups, function(response) {
//             if (response !== null && response.Model.Performed) {
//                 if (response.Model.Dtos !== null && response.Model.Dtos.length > 0) {
//                     this.BindViewFilterWFA(response.Model.Dtos);
//                 }
//             }
//         })
//     }
//     event.preventDefault();
// })

// $("#app-pages").on('change', '#Richiesta', function() {
//     event.preventDefault();
//     $("#bnlhr-btnAggiungiDipendente").show();
//     $("#bnlhr-btnRowRimuoviDipendente").show();
//     $("#Dipendente").prop("disabled", false);
//     $("#bnlhr-btnAggiungiDipendente").prop("disabled", false);
//     $("#bnlhr-listDipendenti tbody").empty();
//     var input = document.getElementById("Dipendente");
//     input.value = "";
//     input.setAttribute("data-id", "-1");
//     input.setAttribute("data-uid", "-1");

//     var richiestaPersonale = $("#Richiesta option:selected").attr("data-richiesta-personale");
//     if (richiestaPersonale && richiestaPersonale == '1') {
//         var input = document.getElementById("Dipendente");
//         input.value = currentUser.Model.Dto.Nome;
//         input.setAttribute("data-id", currentUser.Model.Dto.Id);
//         input.setAttribute("data-uid", currentUser.Model.Dto.Id);
//         var utente = modelUtenti.Model.DtosDipendenti.find(x => x.Uid == currentUser.Model.Dto.Id);
//         if (!utente)
//             modelUtenti.Model.DtosDipendenti.push(currentUser.Model.Dto);

//         let dto = {};
//         dto.Id = $("#Dipendente").attr("data-id");
//         dto.Uid = $("#Dipendente").attr("data-uid")
//         if (dto.Uid !== "-1") {
//             modelUtenti.Model.DtosDipendenti.filter(function(dtoindex) {
//                 if (dtoindex.Uid == dto.Uid) {
//                     dto.NomeDipendente = dtoindex.Nome;
//                     dto.Inquadramento = '-';
//                     dto.UO = '-';
//                     dto.Sede = '-';
//                     dto.Mansione = '-';
//                     dto.Contratto = '-';
//                     let row = GetTemplateRowDipendente(dto);
//                     $(row).appendTo("#bnlhr-listDipendenti");
//                     $("#bnlhr-btnAggiungiDipendente").hide();
//                     $("#bnlhr-btnRowRimuoviDipendente").hide();
//                     $("#Dipendente").prop("disabled", true);
//                 }
//             });
//         }
//     }
// })