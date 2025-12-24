

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
        entity.Descripcion = objeto.Descripcion;
        entity.PrecioRegular = objeto.PrecioRegular;
        entity.PrecioVenta = objeto.PrecioVenta;
        entity.Descuento = objeto.Descuento;
        entity.DiaLlegada = objeto.DiaLlegada;
        entity.UrlImagen = objeto.UrlImagen;
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
        Descripcion: $('#txtDescripcion').val(),
        PrecioRegular: $('#txtPrecioRegular').val(),
        PrecioVenta: $('#txtPrecioVenta').val(),
        Descuento: $('#txtDescuento').val(),
        DiaLlegada: $('#txtDiaLlegada').val(),
        UrlImagen: $('#txtUrlImagen').val()
    };
}

var setFormValuesEdit = function () {
    var e = ClaseRegistro.getEntity();
    $('#txtNombre').val(e.Nombre);
    $('#txtDescripcion').val(e.Descripcion);
    $('#txtPrecioRegular').val(e.PrecioRegular);
    $('#txtPrecioVenta').val(e.PrecioVenta);
    $('#txtDescuento').val(e.Descuento);
    $('#txtDiaLlegada').val(e.DiaLlegada);
    $('#txtUrlImagen').val(e.UrlImagen);
    if (e.UrlImagen) {
        $('#imgPreview').attr('src', e.UrlImagen).show();
    } else {
        $('#imgPreview').hide();
    }
    $('#txtImagen').val('');
}

var clearForm = function () {
    $('#txtNombre').val("");
    $('#txtDescripcion').val("");
    $('#txtPrecioRegular').val("");
    $('#txtPrecioVenta').val("");
    $('#txtDescuento').val("");
    $('#txtDiaLlegada').val("");
    $('#txtUrlImagen').val("");
    $('#txtImagen').val("");
    $('#imgPreview').hide().attr('src', '');
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
                    $("<td>", { class: "text-center" }).text(item.PrecioRegular),
                    $("<td>", { class: "text-center" }).text(item.PrecioVenta),
                    $("<td>", { class: "text-center" }).text(item.DiaLlegada),
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
    formData.append("Descripcion", data.Descripcion);
    formData.append("PrecioRegular", data.PrecioRegular);
    formData.append("PrecioVenta", data.PrecioVenta);
    formData.append("Descuento", data.Descuento);
    formData.append("DiaLlegada", data.DiaLlegada);

    var fileInput = $('#txtImagen')[0];
    if (fileInput.files.length > 0) {
        formData.append("Imagen", fileInput.files[0]);
    } else {
        formData.append("UrlImagen", $('#txtUrlImagen').val());
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
            initDataTable();
            $("#modalRegistro").modal("hide");
            Noty("success", "Éxito", "Actualizado correctamente");
        });
    }
};
$('#txtImagen').change(function () {
    var file = this.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imgPreview').attr('src', e.target.result).show();
        }
        reader.readAsDataURL(file);
    }
});

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
    var htmlPag = "";

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
