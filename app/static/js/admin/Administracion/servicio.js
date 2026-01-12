
var ClaseGlobalVar = {};
(function () {
    this.totalRecords = 0;
    this.getRowsTable = function () { return 10; };
    this.getIdEmpty = function () { return "00000000-0000-0000-0000-000000000000"; };
}).apply(ClaseGlobalVar);

var ClaseRegistro = {};
(function () {
    this.filtros = [];
    this.currentPage = 1;
    this.pagedItem = { length: 10, startIndex: 0 };

    var insert = true;
    var entity = {};

    this.setEntity = function (objeto) {
        entity.Id = objeto.Id;
        entity.Nombre = objeto.Nombre;
        entity.TipoMascota = objeto.TipoMascota;
        entity.Categoria = objeto.Categoria;
        entity.DuracionMinutos = objeto.DuracionMinutos;
        entity.Costo = objeto.Costo;
        entity.Descripcion = objeto.Descripcion;
        entity.Requisitos = objeto.Requisitos;
        entity.Disponibilidad = objeto.Disponibilidad;
        entity.PersonalAsignado = objeto.PersonalAsignado;
    };

    this.setNewEntity = function (objeto) {
        this.setEntity({});
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
        TipoMascota: $('#selTipoMascota').val(),
        Categoria: $('#selCategoria').val(),
        DuracionMinutos: parseInt($('#txtDuracion').val()) || 0,
        Costo: parseFloat($('#txtCosto').val()) || 0.0,
        Descripcion: $('#txtDescripcion').val(),
        Requisitos: $('#txtRequisitos').val(),
        Horario: $('#txtHorario').val(),
        PersonalAsignado: $('#txtPersonal').val()
    };
}

var setFormValuesEdit = function () {
    var e = ClaseRegistro.getEntity();
    $('#txtNombre').val(e.Nombre);
    $('#selTipoMascota').val(e.TipoMascota);
    $('#selCategoria').val(e.Categoria);
    $('#txtDuracion').val(e.DuracionMinutos);
    $('#txtCosto').val(e.Costo);
    $('#txtDescripcion').val(e.Descripcion);
    $('#txtRequisitos').val(e.Requisitos);
    $('#txtHorario').val(e.Horario);
    $('#txtPersonal').val(e.PersonalAsignado);
}

var clearForm = function () {
    $('#txtNombre').val("");
    $('#selTipoMascota').val("Perro");
    $('#selCategoria').val("Aseo");
    $('#txtDuracion').val("");
    $('#txtCosto').val("");
    $('#txtDescripcion').val("");
    $('#txtRequisitos').val("");
    $('#txtDisponibilidad').val("");
    $('#txtPersonal').val("");
}

$(function () {
    initDataTable();
    initEvent();
});

var initDataTable = function () {
    $.ajax({
        url: urlGetAll,
        type: 'GET',
        success: function (data) {
            $("#tableRegistros tbody").empty();
            var filterVal = $('#txtBuscar').val().toLowerCase();

            var filteredData = data.filter(function (item) {
                if (item.ESTADO === 0 || item.ESTADO === false) return false;
                if (!filterVal) return true;
                return (item.Nombre && item.Nombre.toLowerCase().includes(filterVal));
            });

            var total = filteredData.length;
            var numRows = parseInt($('#numRows').val());
            var currentPage = ClaseRegistro.currentPage;
            var numPages = Math.ceil(total / numRows);
            if (currentPage > numPages) currentPage = 1;
            ClaseRegistro.currentPage = currentPage;

            var start = (currentPage - 1) * numRows;
            var end = start + numRows;
            var pagedData = filteredData.slice(start, end);

            pagedData.forEach(function (item, index) {
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
                    $("<td>", { class: "text-center" }).text(start + index + 1),
                    $("<td>", { class: "text-center" }).text(item.Nombre),
                    $("<td>", { class: "text-center" }).text(item.TipoMascota),
                    $("<td>", { class: "text-center" }).text(item.Categoria),
                    $("<td>", { class: "text-center" }).text(item.DuracionMinutos + ' min'),
                    $("<td>", { class: "text-center" }).text('$' + item.Costo),
                    $("<td>", { class: "text-center" }).append([btnEdit, " ", btnDelete])
                );
                $("#tableRegistros tbody").append(row);
            });

            getPaginator(total, currentPage);
            getLabelRegistro(total, start, end);
        },
        error: function (e) {
            console.error(e);
        }
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

function callAjaxJson(data, url, method) {
    return $.ajax({
        url: url,
        type: method,
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: 'json'
    });
}

var eventClickSaveRegistro = function () {
    var data = getFormValues();

    if (ClaseRegistro.getOperacion()) {
        callAjaxJson(data, urlInsert, "POST").done(function () {
            initDataTable();
            $("#modalRegistro").modal("hide");
            if (window.Noty) Noty("success", "Éxito", "Guardado correctamente");
            else alert("Guardado correctamente");
        });
    } else {
        var entity = ClaseRegistro.getEntity();
        var urlWithType = urlUpdate + "/" + entity.Id;
        callAjaxJson(data, urlWithType, "PUT").done(function () {
            initDataTable();
            $("#modalRegistro").modal("hide");
            if (window.Noty) Noty("success", "Éxito", "Actualizado correctamente");
            else alert("Actualizado correctamente");
        });
    }
};

var eventClickEliminar = function (data) {
    if (window.bootbox) {
        bootbox.confirm("¿Está seguro de eliminar el registro?", function (result) {
            if (result) {
                var urlWithType = urlDelete + "/" + data.Id;
                callAjaxJson({}, urlWithType, "DELETE").done(function () {
                    initDataTable();
                    Noty("success", "Éxito", "Eliminado correctamente");
                });
            }
        });
    } else {
        if (confirm("¿Está seguro de eliminar el registro?")) {
            var urlWithType = urlDelete + "/" + data.Id;
            callAjaxJson({}, urlWithType, "DELETE").done(function () {
                initDataTable();
                alert("Eliminado correctamente");
            });
        }
    }
};

var getPaginator = function (count, currentPage) {
    var numRows = parseInt($('#numRows').val());
    var numPages = Math.ceil(count / numRows);
    $('.pagination').empty();

    if (numPages <= 1) return;

    for (var i = 1; i <= numPages; i++) {
        var active = i === currentPage ? 'active' : '';
        (function (page) {
            var li = $('<li>', { class: 'paginate_button ' + active });
            var a = $('<a>', { text: page, href: '#' }).click(function (e) {
                e.preventDefault();
                ClaseRegistro.currentPage = page;
                initDataTable();
            });
            li.append(a);
            $('.pagination').append(li);
        })(i);
    }
};

var getLabelRegistro = function (total, start, end) {
    var from = start + 1;
    var to = (end < total) ? end : total;
    if (total == 0) from = 0;
    $('#labelRegistros').text('Mostrando ' + from + ' - ' + to + ' de ' + total);
};

var initEvent = function () {
    $('#numRows').change(function () {
        ClaseRegistro.currentPage = 1;
        initDataTable();
    });

    $('#txtBuscar').keyup(function () {
        ClaseRegistro.currentPage = 1;
        initDataTable();
    });
};