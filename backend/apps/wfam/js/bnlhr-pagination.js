

function Pagination(model, tableName) {
    ShowHidePagination(model.Model, tableName);
    function ShowHidePagination(model, tableName) {
        if (model != null) {
            var totalPages = parseInt(Math.ceil(parseFloat(model.Count) / parseFloat(model.Take)));
            var currentPage = parseInt($("#" + tableName).attr("data-page"));
            if (totalPages > 1) {
                $("#" + tableName + " tfoot").show();
                if (currentPage <= 0) {
                    currentPage = 1;
                    $("#" + tableName).attr("data-page", currentPage);
                }    
                $("#" + tableName).attr("data-skip", model.Skip);
                if (model.Skip > 0)
                    $("#" + tableName + " #btnBack").prop("disabled", false);
                else
                    $("#" + tableName + " #btnBack").prop("disabled", true);
    
                if (currentPage >= totalPages)
                    $("#" + tableName + " #btnNext").prop("disabled", true);
                else
                    $("#" + tableName + " #btnNext").prop("disabled", false);
    
            } else
                $("#" + tableName + " tfoot").hide();
        }
    
    }
}


