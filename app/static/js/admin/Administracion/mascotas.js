
var ClaseGlobalVar = {};
(function () {
    this.totalRecords = 0;
    this.getRowsTable = function () { return 10; };
    this.getIdEmpty = function () { return "00000000-0000-0000-0000-000000000000"; };
}).apply(ClaseGlobalVar);

var ClaseRegistro = {};
(function () {
    this.itemSelectedFiltro = 10;
    this.totalRecords = 0;
    this.currentPage = 1;
    this.estadoOrden = true;
    this.pagedItem = {
        filtros: [],
        orden: [{ OrderType: "DESC", Property: "Id", Index: "1" }],
        startIndex: 0,
        length: 10
    };

    var insert = true;
    var entity = {};

    this.setEntity = function (objeto) {
        entity.Id = objeto.Id;
        entity.Nombre = objeto.Nombre;
        entity.Tipo = objeto.Tipo;
        entity.Raza = objeto.Raza;
        entity.FechaNacimiento = objeto.FechaNacimiento;
        entity.Origen = objeto.Origen;
        entity.Historia = objeto.Historia;
        entity.Cuidados = objeto.Cuidados;
        entity.Fotos = objeto.Fotos || [];
        entity.RowVersion = objeto.RowVersion;
    };

    this.setNewEntity = function (objeto) {
        this.setEntity(objeto);
        entity.Id = ClaseGlobalVar.getIdEmpty();
    };

    this.getEntity = function () { return entity; };
    this.getOperacion = function () { return insert; };
    this.setEdit = function () { insert = false; };
    this.setInsert = function () { insert = true; };

}).apply(ClaseRegistro);

var getFormValues = function () {
    return {
        Nombre: $('#txtNombre').val(),
        Tipo: $('#txtTipo').val(),
        Raza: $('#txtRaza').val(),
        FechaNacimiento: $('#txtFechaNacimiento').val(),
        Origen: $('#txtOrigen').val(),
        Historia: $('#txtHistoria').val(),
        Cuidados: $('#txtCuidados').val()
    };
}

var setFormValuesEdit = function () {
    var e = ClaseRegistro.getEntity();
    $('#txtNombre').val(e.Nombre);
    $('#txtTipo').val(e.Tipo);
    $('#txtRaza').val(e.Raza);
    $('#txtFechaNacimiento').val(e.FechaNacimiento);
    $('#txtOrigen').val(e.Origen);
    $('#txtHistoria').val(e.Historia);
    $('#txtCuidados').val(e.Cuidados);

    $('#divFotosPreview').empty();
    if (e.Fotos && e.Fotos.length > 0) {
        e.Fotos.forEach(function (url) {
            var img = $('<img>', { src: url, height: '60px', class: 'mr-2 mb-2' });
            $('#divFotosPreview').append(img);
        });
    }
    $('#txtFotos').val('');
}

var clearForm = function () {
    $('#txtNombre').val("");
    $('#txtTipo').val("Perro");
    $('#txtRaza').val("");
    $('#txtFechaNacimiento').val("");
    $('#txtOrigen').val("");
    $('#txtHistoria').val("");
    $('#txtCuidados').val("");
    $('#txtFotos').val("");
    $('#divFotosPreview').empty();
}

$(function () {
    initDataTable();
    initEvent();
});

var initDataTable = function () {
    fload("show");
    callAjax(ClaseRegistro.pagedItem.filtros, urlCountAll, "POST").done(function (r1) {
        var total = r1[0];
        callAjax(ClaseRegistro.pagedItem, urlGetPaged, "POST").done(function (data) {
            $("#tableRegistros tbody").empty();

            data.forEach(function (item, index) {
                var btnEdit = $("<button>", {
                    class: "btn btn-default btn-sm",
                    title: "Editar",
                    click: function () { eventClickEditar(item); }
                }).append($("<i>", { class: "fa fa-pencil text-warning" }));

                var btnDelete = $("<button>", {
                    class: "btn btn-default btn-sm",
                    title: "Eliminar",
                    click: function () { eventClickEliminar(item); }
                }).append($("<i>", { class: "fa fa-times text-danger" }));

                var row = $("<tr>").append(
                    $("<td>", { class: "text-center" }).text(getNro(ClaseRegistro.pagedItem.startIndex + index)),
                    $("<td>", { class: "text-center" }).text(item.Nombre),
                    $("<td>", { class: "text-center" }).text(item.Tipo),
                    $("<td>", { class: "text-center" }).text(item.Raza),
                    $("<td>", { class: "text-center" }).text(item.FechaNacimiento),
                    $("<td>", { class: "text-center" }).text(item.ESTADO == 1 ? "Activo" : "Inactivo"),
                    $("<td>", { class: "text-center" }).append([btnEdit, " ", btnDelete])
                );
                $("#tableRegistros tbody").append(row);
            });

            getPaginator(total, ClaseRegistro.currentPage);
            getLabelRegistro(total);
            fload("hide");
        });
    });
};

var eventClickNuevo = function () {
    ClaseRegistro.setInsert();
    clearForm();
    $(".label-title").text("NUEVO").removeClass("edit").addClass("new");
    $("#modalRegistro").modal("show");
}

var eventClickEditar = function (data) {
    if (!data.Fotos) {
        // Fetch specific details (photos) if not in list (though get_all_with_photos should have them)
        // Since we are using get_all_with_photos, they should be there.
    }

    ClaseRegistro.setEdit();
    ClaseRegistro.setEntity(data);
    setFormValuesEdit();
    $(".label-title").text("EDITAR").removeClass("new").addClass("edit");
    $("#modalRegistro").modal("show");
};

function callAjaxFormData(formData, url, method) {
    return $.ajax({
        url: url,
        type: method,
        data: formData,
        processData: false,
        contentType: false
    });
}

var eventClickSaveRegistro = function () {
    var data = getFormValues();
    var formData = new FormData();
    formData.append("Nombre", data.Nombre);
    formData.append("Tipo", data.Tipo);
    formData.append("Raza", data.Raza);
    formData.append("FechaNacimiento", data.FechaNacimiento);
    formData.append("Origen", data.Origen);
    formData.append("Historia", data.Historia);
    formData.append("Cuidados", data.Cuidados);

    var fileInput = $('#txtFotos')[0];
    for (var i = 0; i < fileInput.files.length; i++) {
        formData.append("fotos", fileInput.files[i]);
    }

    if (ClaseRegistro.getOperacion()) {
        callAjaxFormData(formData, urlInsert, "POST").done(function () {
            initDataTable();
            $("#modalRegistro").modal("hide");
            Noty("success", "Éxito", "Guardado correctamente");
        });
    } else {
        var entity = ClaseRegistro.getEntity();
        formData.append("Id", entity.Id);

        callAjaxFormData(formData, urlUpdate, "PUT").done(function () {
            // Re-draw or just init?
            initDataTable();
            $("#modalRegistro").modal("hide");
            Noty("success", "Éxito", "Actualizado correctamente");
        });
    }
};

var eventClickEliminar = function (data) {
    bootbox.confirm("¿Está seguro de eliminar el registro?", function (result) {
        if (result) {
            callAjax(data, urlDelete, "DELETE").done(function () {
                initDataTable();
                Noty("success", "Éxito", "Eliminado correctamente");
            });
        }
    });
};

var getPaginator = function (count, currentPage) {
    var numRows = $('#numRows').val();
    var numPages = count >= parseInt(numRows) ? Math.ceil(count / parseInt(numRows)) : 1;
    $('.pagination').empty();
    for (var i = 1; i <= numPages; i++) {
        var active = i === currentPage ? 'active' : '';
        (function (page) {
            var li = $('<li>', { class: 'paginate_button ' + active });
            var a = $('<a>', { text: page, href: '#' }).click(function (e) { e.preventDefault(); getPage(page, count); });
            li.append(a);
            $('.pagination').append(li);
        })(i);
    }
};

var getPage = function (currentPage, total) {
    var currentRango = parseInt($('#numRows').val());
    var inicio = (currentPage - 1) * currentRango;
    ClaseRegistro.pagedItem.startIndex = inicio;
    ClaseRegistro.pagedItem.length = currentRango;
    ClaseRegistro.currentPage = currentPage;
    initDataTable();
};

var getLabelRegistro = function (total) {
    var from = ClaseRegistro.pagedItem.startIndex + 1;
    var to = (ClaseRegistro.pagedItem.startIndex + ClaseRegistro.pagedItem.length) < total
        ? (ClaseRegistro.pagedItem.startIndex + ClaseRegistro.pagedItem.length) : total;
    if (total == 0) from = 0;
    $('#labelRegistros').text('Mostrando ' + from + ' - ' + to + ' de ' + total);
};

var initEvent = function () {
    $('#numRows').change(function () {
        ClaseRegistro.pagedItem.length = parseInt($(this).val());
        ClaseRegistro.pagedItem.startIndex = 0;
        ClaseRegistro.currentPage = 1;
        initDataTable();
    });

    $('#txtBuscar').keyup(function () {
        var val = $(this).val().trim();
        ClaseRegistro.pagedItem.filtros = [];
        if (val) {
            ClaseRegistro.pagedItem.filtros.push({
                Logical: "AND",
                PropertyName: "Nombre",
                Value: val,
                Operator: "Contains"
            });
        }
        initDataTable();
    });
};
