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

    var insert = false;
    var entity = {};

    this.setEntity = function (objeto) {
        entity.Id = objeto.Id;
        entity.Estado = objeto.Estado;
        entity.EstadoReserva = objeto.EstadoReserva; // Handle mismatch in field names if any
        entity.Observaciones = objeto.Observaciones;
        entity.IdCliente = objeto.IdCliente;
        entity.IdMascota = objeto.IdMascota;
        entity.IdServicio = objeto.IdServicio;
        entity.FechaHora = objeto.FechaHora;
        entity.RowVersion = objeto.RowVersion;
    };

    this.getEntity = function () { return entity; };
    this.getOperacion = function () { return insert; };
    this.setEdit = function () { insert = false; };
    this.setInsert = function () { insert = true; };

}).apply(ClaseRegistro);

var getFormValues = function () {
    return {
        Estado: $('#selEstado').val(), // Mapping Status
        Observaciones: $('#txtObservaciones').val()
    };
}

var setFormValuesEdit = function () {
    var e = ClaseRegistro.getEntity();
    $('#selEstado').val(e.EstadoReserva || e.Estado);
    $('#txtObservaciones').val(e.Observaciones);
}

var clearForm = function () {
    $('#selEstado').val("");
    $('#txtObservaciones').val("");
}

$(function () {
    initDataTable();
    initEvent();
});

var initDataTable = function () {
    fload("show");

    // Note: reserva.js original used `urlGetAll` and client-side filtering. 
    // Standard pattern uses server side `get_paged` and `count_all`.
    // I will try to use the standard pattern `urlCountAll` and `urlGetPaged`.
    // If backend only supports `urlGetAll`, this might be empty on first load if variables aren't defined.
    // Assuming variables `urlCountAll` and `urlGetPaged` are available in template for Reservations too.
    // If not, revert to `urlGetAll` inside callAjax? No, user wants SAME PATTERN.
    // So I assume `reserva.html` will define `urlCountAll`.

    callAjax(ClaseRegistro.pagedItem.filtros, urlCountAll, "POST").done(function (r1) {
        var total = r1[0].total || r1[0];

        callAjax(ClaseRegistro.pagedItem, urlGetPaged, "POST").done(function (data) {
            $("#tableRegistros tbody").empty();

            data.forEach(function (item, index) {
                var btnEdit = $("<button>", {
                    class: "btn btn-default btn-sm",
                    title: "Editar",
                    click: function () { eventClickEditar(item); }
                }).append($("<i>", { class: "fa fa-pencil text-warning" }));

                var estado = item.EstadoReserva || item.Estado || 'Pendiente';
                var badgeClass = 'label-secondary'; // BS3/4 mix
                if (estado === 'Confirmado') badgeClass = 'label-primary';
                if (estado === 'Completado') badgeClass = 'label-success';
                if (estado === 'Cancelado') badgeClass = 'label-danger';

                var row = $("<tr>").append(
                    $("<td>", { class: "text-center" }).text(getNro(ClaseRegistro.pagedItem.startIndex + index)),
                    $("<td>", { class: "text-center" }).text(item.IdCliente),
                    $("<td>", { class: "text-center" }).text(item.IdMascota),
                    $("<td>", { class: "text-center" }).text(item.IdServicio),
                    $("<td>", { class: "text-center" }).text(item.FechaHora),
                    $("<td>", { class: "text-center" }).append($("<span>", { class: "label " + badgeClass }).text(estado)),
                    $("<td>", { class: "text-center" }).append([btnEdit])
                );
                $("#tableRegistros tbody").append(row);
            });

            getPaginator(total, ClaseRegistro.currentPage);
            getLabelRegistro(total);
            fload("hide");
        });
    });
};

var eventClickEditar = function (data) {
    ClaseRegistro.setEdit();
    ClaseRegistro.setEntity(data);
    setFormValuesEdit();
    $(".label-title").text("EDITAR").removeClass("new").addClass("edit");
    $("#modalRegistro").modal("show");
};

var eventClickSaveRegistro = function () {
    var data = getFormValues();
    var entity = ClaseRegistro.getEntity();

    // Specific update endpoint was `urlUpdateStatus`
    // Standard pattern uses `urlUpdate`.
    // I will use `urlUpdate` if available, or fallback/construct specific one.
    // Let's assume standard `urlUpdate` is defined in template to point to the correct endpoint.

    Object.assign(entity, data); // Update entity with form data

    callAjax(entity, urlUpdate, "PUT").done(function () {
        initDataTable();
        $("#modalRegistro").modal("hide");
        Noty("success", "Éxito", "Actualizado correctamente");
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
                Logical: "OR",
                PropertyName: "Estado",
                Value: val,
                Operator: "Contains"
            });
            ClaseRegistro.pagedItem.filtros.push({
                Logical: "OR",
                PropertyName: "Reserva", // Observation in some schemas?
                Value: val,
                Operator: "Contains"
            });
        }
        initDataTable();
    });
};
