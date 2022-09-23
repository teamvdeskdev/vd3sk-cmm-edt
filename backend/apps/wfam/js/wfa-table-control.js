const WFACONTROLTYPE = {
    TEXT: 'Testo',
    DATE: 'Data',
    DATETIME: 'DateTime',
    NUMERIC: 'Numerico',
    // BOOLEAN: 'True/False',
}

class RowDto {
    constructor() {
        this.Index = 0;
        this.RowIndex = 0;
        this.Etichetta = null;
        this.Type = null;
        this.Required = false;
    }
}

class ControlDto extends RowDto {
    constructor(rowDto, rowIndex) {
        super();
        this.Id = null
        this.Value = null;
        this.BindView(rowDto, rowIndex);
    }

    BindView(rowDto, rowIndex) {
        this.Etichetta = rowDto.Etichetta;
        this.Index = rowDto.Index;
        this.RowIndex = rowIndex;
        this.Type = rowDto.Type;
        this.Required = rowDto.Required;
    }
}

class WFARowControl {
    constructor(dto) {
        this.Dto = dto;
    }

    GetGuiTemplate(readonly) {
        var controlTemplate = null;
        var type = WFACONTROLTYPE[this.Dto.Type];
        if (type == WFACONTROLTYPE.TEXT)
            controlTemplate = this.GetTemplateText(readonly);
        if (type == WFACONTROLTYPE.DATE)
            controlTemplate = this.GetTemplateDate(readonly);
        if (type == WFACONTROLTYPE.DATETIME)
            controlTemplate = this.GetTemplateDateTime(readonly);
        if (type == WFACONTROLTYPE.NUMERIC)
            controlTemplate = this.GetTemplateNumeric(readonly);
        // if (this.Type == WFACONTROLTYPE.BOOLEAN)
        //     controlTemplate = this.GetTemplateBoolean();

        return controlTemplate;
    }

    GetTemplateText(readonly) {
        var control = "";
        var index = this.Dto.Index;
        var rowIndex = this.Dto.RowIndex;
        this.Dto.Id = "control-" + rowIndex + "-" + index + "";
        if (!readonly) {
            var required = (this.Dto.Required ? "required" : "");
            control = "<td>\n" +
                "<textarea id='control-" + rowIndex + "-" + index + "' type = \"text\" " + required + " rows='1'></textarea></td>";
        } else {
            control = "<td>\n" +
                "<span id='control-" + rowIndex + "-" + index + "' style=\"white-space: break-spaces;padding: 0;\"></span>\n</td>";
        }
        return control;
    }

    GetTemplateDate(readonly) {
        var control = "";
        var index = this.Dto.Index;
        var rowIndex = this.Dto.RowIndex;
        this.Dto.Id = "control-" + rowIndex + "-" + index + "";
        if (!readonly) {
            var required = (this.Dto.Required ? "required" : "");
            control = "<td>\n" +
                "<input id='control-" + rowIndex + "-" + index + "' name='control-" + rowIndex + "-" + index + "' type=\"text\" autocomplete=\"off\" readonly " + required + " />\n</td>";
        } else {
            control = "<td style=\"text-align: center;\">\n" +
                "<span id='control-" + rowIndex + "-" + index + "'></span>\n</td>";
        }
        return control;
    }

    GetTemplateDateTime(readonly) {
        var control = "";
        var index = this.Dto.Index;
        var rowIndex = this.Dto.RowIndex;
        this.Dto.Id = "control-" + rowIndex + "-" + index + "";
        if (!readonly) {
            var required = (this.Dto.Required ? "required" : "");
            var control = "<td>\n" +
                "<input id='control-" + rowIndex + "-" + index + "' name='control-" + rowIndex + "-" + index + "' type=\"text\" autocomplete=\"off\" readonly " + required + " />\n</td>";
        } else {
            control = "<td style=\"text-align: center;\">\n" +
                "<span id='control-" + rowIndex + "-" + index + "'></span>\n</td>";
        }
        return control;

    }

    GetTemplateNumeric(readonly) {
        var control = "";
        var index = this.Dto.Index;
        var rowIndex = this.Dto.RowIndex;
        this.Dto.Id = "control-" + rowIndex + "-" + index + "";
        if (!readonly) {
            var required = (this.Dto.Required ? "required" : "");
            control = "<td>\n" +
                "<input id='control-" + rowIndex + "-" + index + "' type=\"number\" " + required + " />\n</td>";
        } else {
            control = "<td style=\"text-align: center;\">\n" +
                "<span id='control-" + rowIndex + "-" + index + "'></span>\n</td>";
        }
        return control;
    }

    BindEvent(readonly) {
        if (!readonly) {
            var type = WFACONTROLTYPE[this.Dto.Type];
            var controlId = 'input[name="control-' + this.Dto.RowIndex + '-' + this.Dto.Index + '"]';
            if (type == WFACONTROLTYPE.DATE) {
                $(controlId).datepicker({
                    dateFormat: "dd/mm/yy",
                    autocomplete: "off"
                });
            }

            if (type == WFACONTROLTYPE.DATETIME) {
                this.SetDataRange(controlId);
                $(controlId).on('apply.daterangepicker', function(ev, picker) {
                    $(this).val(picker.startDate.format('DD/MM/YYYY H:mm') + ' - ' + picker.endDate.format('DD/MM/YYYY H:mm'));
                    dal = picker.startDate.format('YYYY-MM-DD H:mm:00');
                    al = picker.endDate.format('YYYY-MM-DD H:mm:00');

                    var id = $(this).attr("id");
                    var rowGui = $(this).closest("tr");
                    var index = parseInt($(rowGui).attr("data-index"));
                    var row = wfaTable.Rows.find(x => x.Dto.RowIndex == index);
                    if (row) {
                        var control = row.ControlDtos.find(x => x.Dto.Id == id);
                        if (control)
                            control.Dto.Value = wfaTable.GetValue($(this).val());
                    }
                });

                $(controlId).on('cancel.daterangepicker', function(ev, picker) {
                    $(this).val('');
                    dal = null;
                    al = null;
                    var id = $(this).attr("id");
                    var rowGui = $(this).closest("tr");
                    var index = parseInt($(rowGui).attr("data-index"));
                    var row = wfaTable.Rows.find(x => x.Dto.RowIndex == index);
                    if (row) {
                        var control = row.ControlDtos.find(x => x.Dto.Id == id);
                        if (control)
                            control.Dto.Value = wfaTable.GetValue($(this).val());
                    }
                });
            }
        }
    }

    SetDataRange(controlId) {
        $(controlId).daterangepicker({
            singleDatePicker: false,
            autoUpdateInput: false,
            timePicker: true,
            timePicker24Hour: true,
            timePickerSeconds: false,
            locale: {
                format: "DD/MM/YYYY H:mm",
                separator: " al ",
                applyLabel: "Ok",
                cancelLabel: "Annulla",
                fromLabel: "Da",
                toLabel: "A",
                daysOfWeek: [
                    "Dom",
                    "Lun",
                    "Mar",
                    "Mer",
                    "Gio",
                    "Ven",
                    "Sab"

                ],
                monthNames: [
                    "Gennaio",
                    "Febbraio",
                    "Marzo",
                    "Aprile",
                    "Maggio",
                    "Giugno",
                    "Luglio",
                    "Agosto",
                    "Settembre",
                    "Ottobre",
                    "Novembre",
                    "Dicembre"
                ],
            }
        });
    }
}

class WFATableRow {
    constructor() {
        this.Dto = null; // new RowDto();
        this.ControlDtos = [];
    }

    /*designer*/
    BindModel(rowGui) {
        if (rowGui) {
            this.Dto.Etichetta = this.GetValue($(rowGui).find("#tbEtichetta").val());
            this.Dto.Type = $(rowGui).find("#ddlType").val();
            this.Dto.Required = $(rowGui).find("#cbRequired").prop("checked");
        }
    }

    BindView(dto) {
        if (dto) {
            var row = this.GetDesignerTemplate(dto);
            if (row) {
                this.Dto = dto;
                $(row).find("#tbEtichetta").val(dto.Etichetta);
                $(row).find("#ddlType").val(dto.Type);
                $(row).find("#cbRequired").prop("checked", dto.Required);
            }
            return row;
        }
    }

    GetDesignerTemplate(dto) {
        var etichetta = (dto.Etichetta ? dto.Etichetta : "");
        var type = (dto.Type ? dto.Type : "");
        var required = (dto.Required ? "checked" : "");
        var selected = (type ? "" : "selected");
        var row = "<tr data-index='" + dto.Index + "'>\n" +
            "<td>\n" +
            "<div>" +
            " <p>Etichetta</p><input id='tbEtichetta' type=\"text\" value='" + etichetta + "' required >\n" +
            "</div>\n" +
            "<div>" +
            "  <p>Tipo</p><select id='ddlType' id='control-type' required>\n";
        var option = "<option value='-1' " + selected + " disabled hidden>Seleziona tipo</option>";
        row += option;
        Object.keys(WFACONTROLTYPE).map(function(controlType) {
            selected = "";
            if (type == controlType)
                selected = "selected";
            option = "<option value='" + controlType + "' " + selected + ">" + WFACONTROLTYPE[controlType] + "</option>";
            row += option;
        });
        row += "</select>\n" +
            "</div>\n" +
            "<div>" +
            "<span> Required </span>\n" +
            "<label class=\"container\" style=\"margin-left: 20px;\">\n" +
            "<input id='cbRequired' type=\"checkbox\" " + required + ">\n" +
            "<span class=\"checkmark\"></span>\n" +
            "</label>\n" +
            "</div>\n" +
            "<div>" +
            "<input type=\"button\" value='Elimina' action='delete' class=\"bnlhr-button-white \">\n" +
            "</div>\n" +
            "</td>\n" +
            "</tr>";
        return row;
    }

    GetValue(value) {
        if (value.trim().length > 0)
            return value;
        return null;
    }

    Validation() {
            if (this.Dto) {
                return (this.Dto.Etichetta != null && this.Dto.Type != null);
            }
        }
        /*end designer*/

    GetGuiRow(dtos, indexRow, readonly) {
        var hide = (readonly ? 'style="display: none;"' : '');
        var rowGui = "<tr data-index='" + indexRow + "' " + hide + " >";
        for (var control of dtos) {
            var controlDto = new WFARowControl(new ControlDto(control.Dto, indexRow));
            var col = controlDto.GetGuiTemplate(readonly);
            rowGui += col;
            this.ControlDtos.push(controlDto);
        }
        //rowGui += this.GetGuiTemplateButtonRow();
        rowGui += "</tr>";
        return rowGui;
    }

    BindEvents(readonly) {
        for (var control of this.ControlDtos) {
            control.BindEvent(readonly);
        }
    }

    // GetGuiTemplateButtonRow() {
    //     var col = "<td style=\"display: inline-block;\">" +
    //         "<a href=\"#\" class=\"button new button-row\">" +
    //         "<span class=\"icon icon-add\"></span>" +
    //         "</a>" +
    //         "</td>";
    //     return col;
    // }
}

var wfaTable = null;
var wfaTablePreview = null
class WFATable {
    constructor(table) {
            this.Table = table;
            this.MaxRows = null;
            this.Rows = [];
        }
        /* designer*/

    BindModel() {
        var self = this;
        this.MaxRows = (this.GetValue($("#row-number").val()) != null ? parseInt($("#row-number").val()) : 1);
        var tableId = this.GetTableId();
        var rows = $(tableId + " tbody>tr");
        $(rows).each(function(index, rowGui) {
            var index = parseInt($(rowGui).attr("data-index"));
            var row = self.Rows.find(x => x.Dto.Index == index);
            if (row)
                row.BindModel(rowGui);
        });
        return this.Validation() && this.MaxRows != null;
    }

    BindView(model) {
        var self = this;
        $("#row-number").val(model.MaxRows);
        var dtos = model.Dtos;
        for (var dto of dtos) {
            var row = new WFATableRow();
            var template = row.BindView(dto.Dto);
            var tableId = this.GetTableId();
            $(tableId + " tbody").append(template);
            self.Rows.push(row);
            self.BindEvents();
        }
    }

    GetTableId() {
        return "#" + $(this.Table).attr("id");
    }

    SetIndexs() {
        var tableId = this.GetTableId();
        var rows = $(tableId + " tbody>tr");
        $(rows).each(function(index, rowGui) {
            var indexRow = parseInt($(rowGui).attr("data-index"));
            var row = wfaTable.Rows.find(x => x.Dto.Index == indexRow);
            if (row) {
                var i = index + 1;
                $(rowGui).attr("data-index", i);
                row.Dto.Index = i;
            }
        });
    }

    AddRowDesigner() {
        var tableId = this.GetTableId();
        var index = $(tableId + " tbody>tr").length + 1;
        var row = new WFATableRow();
        row.Dto = new RowDto();
        row.Dto.Index = index;
        var template = row.GetDesignerTemplate(row.Dto);
        $(tableId + " tbody").append(template);
        this.Rows.push(row);
        this.BindEvents();
    }

    BindEvents() {
        var tableId = this.GetTableId();
        var rows = $(tableId + " tbody>tr");
        $(rows).each(function(index, row) {
            var button = $(row).find("input[type='button']");
            $(button).unbind("click");
            $(button).click("click", function(e) {
                var target = e.target;
                var action = $(target).attr("action");
                if (action) {
                    if (action == "delete") {
                        var index = parseInt($(this).closest("tr").attr("data-index"));
                        var row = wfaTable.Rows.find(x => x.Dto.Index == index);
                        if (row) {
                            wfaTable.Rows.splice(index - 1, 1);
                            $(this).closest("tr").remove();
                            wfaTable.SetIndexs();
                        }
                    }
                }
            });
        })
    }

    Validation(type = "") {
        var validation = true;
        this.Rows.forEach(function(row) {
            validation = row.Validation();
            if (!validation)
                return;
        })
        if (type == "next" && this.Rows.length <= 0)
            validation = false;
        return validation;
    }

    GetJson() {
            if (this.Rows.length > 0) {
                var rows = {
                    "MaxRows": this.MaxRows,
                    "Dtos": this.Rows
                };
                return JSON.stringify(rows);
            }
            return null;
        }
        /*end designer*/

    GetValue(value) {
        if (value.trim().length > 0)
            return value;
        return null;
    }

    SetTable(model, readonly = false) {
        var tableId = this.GetTableId();
        this.MaxRows = parseInt(model.MaxRows);
        var header = this.GetGuiHeaderTemplate(model.Dtos);
        $(tableId + " thead").append(header);
        for (var i = 0; i < this.MaxRows; i++) {
            var row = this.AddRowGui(i + 1, model.Dtos, readonly);
            this.Rows.push(row);
        }
        if (!readonly)
            this.BindOnChangeEvent();
    }

    GetGuiHeaderTemplate(rows) {
        var rowHeader = "<tr>\n";
        for (var row of rows) {
            var style = (WFACONTROLTYPE[row.Dto.Type] != WFACONTROLTYPE.TEXT ? 'style=\"text-align: center;\"' : "");
            rowHeader += "<td " + style + " >\n" +
                "<span>" + row.Dto.Etichetta + "</span>" +
                "</td>\n";
        }
        rowHeader += "</tr>\n";
        return rowHeader;
    }

    BindOnChangeEvent() {
        var tableId = this.GetTableId();
        $(tableId + " input").unbind("change");
        $(tableId + " input").bind("change", function(e) {
            var id = $(this).attr("id");
            var rowGui = $(this).closest("tr");
            var index = parseInt($(rowGui).attr("data-index"));
            var row = wfaTable.Rows.find(x => x.Dto.RowIndex == index);
            if (row) {
                var control = row.ControlDtos.find(x => x.Dto.Id == id);
                if (control)
                    control.Dto.Value = wfaTable.GetValue($(this).val());
            }
        });

        $(tableId + " textarea").unbind("change");
        $(tableId + " textarea").bind("change", function(e) {
            var id = $(this).attr("id");
            var rowGui = $(this).closest("tr");
            var index = parseInt($(rowGui).attr("data-index"));
            var row = wfaTable.Rows.find(x => x.Dto.RowIndex == index);
            if (row) {
                var control = row.ControlDtos.find(x => x.Dto.Id == id);
                if (control)
                    control.Dto.Value = wfaTable.GetValue($(this).val());
            }
        })
    }

    AddRowGui(indexRow, rowDto, readonly) {
        var tableId = this.GetTableId();
        let row = new WFATableRow();
        row.Dto = new RowDto();
        row.Dto.RowIndex = indexRow;
        let template = row.GetGuiRow(rowDto, indexRow, readonly);
        $(tableId + " tbody").append(template);
        row.BindEvents(readonly);
        return row;
    }

    ValidationGUI() {
        var isValid = true;
        for (var row of this.Rows) {
            var count = row.ControlDtos.length;
            var isFilled = this.IsFilled(row);
            if (isFilled) {
                var control = row.ControlDtos.find(x => x.Dto.Required == true && x.Dto.Value == null);
                if (control) {
                    isValid = false;
                    return;
                }
            }
        }
        return isValid;
    }

    IsFilled(row) {
        var filled = row.ControlDtos.find(x => x.Dto.Value != null);
        return filled;
    }

    GetJsonGUI() {
        return JSON.stringify(this.Rows);
    }

    SetValue(value) {
        if (!value)
            return "";
        return value;
    }

    BindViewGUI(dto, readonly) {
        if (dto) {
            var tableId = this.GetTableId();
            var rowsDB = JSON.parse(dto);
            for (var row of this.Rows) {
                var rowDB = rowsDB.find(x => x.Dto.RowIndex == row.Dto.RowIndex);
                for (var control of row.ControlDtos) {
                    var controlGui = $(tableId + " #" + control.Dto.Id);
                    if (rowDB) {
                        var controlDB = rowDB.ControlDtos.find(x => x.Dto.Id == control.Dto.Id)
                        if (controlDB) {
                            var value = controlDB.Dto.Value;
                            control.Dto.Value = value;
                            if (!readonly)
                                $(controlGui).val(this.SetValue(value));
                            else
                                $(controlGui).text(this.SetValue(value));
                        }
                    }
                }
                if (readonly) {
                    if (this.IsFilled(row))
                        $(tableId + " tbody tr[data-index='" + row.Dto.RowIndex + "']").show();
                } else
                    $(tableId + " tbody tr[data-index='" + row.Dto.RowIndex + "']").show();
            }
        }
    }
}