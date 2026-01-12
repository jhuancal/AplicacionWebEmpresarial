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

    var entity = {};

    this.setEntity = function (objeto) {
        entity.Id = objeto.Id;
        entity.IdCliente = objeto.IdCliente;
        entity.IdProducto = objeto.IdProducto;
        entity.Cantidad = objeto.Cantidad;
        entity.RowVersion = objeto.RowVersion;
    };

    this.getEntity = function () { return entity; };

}).apply(ClaseRegistro);

$(function () {
    initDataTable();
    initEvent();
});

var initDataTable = function () {
    fload("show");




    callAjax(ClaseRegistro.pagedItem.filtros, urlCountAll, "POST").done(function (r1) { // urlCountAll needs to vary or be defined





        var total = 0; // Placeholder if r1 fails?
        var countPromise = callAjax(ClaseRegistro.pagedItem.filtros, urlCountAll, "POST"); // Risk here

        countPromise.done(function (r1) {
            var total = r1[0].total || r1[0]; // Handle [{total: 5}] or [5]

            callAjax(ClaseRegistro.pagedItem, urlGetPaged, "POST").done(function (data) {
                $("#tableRegistros tbody").empty();

                data.forEach(function (item, index) {
                    var btnDelete = $("<button>", {
                        class: "btn btn-default btn-sm",
                        title: "Eliminar",
                        click: function () { eventClickEliminar(item); }
                    }).append($("<i>", { class: "fa fa-times text-danger" }));

                    var row = $("<tr>").append(
                        $("<td>", { class: "text-center" }).text(getNro(ClaseRegistro.pagedItem.startIndex + index)),
                        $("<td>", { class: "text-center" }).text(item.IdCliente), // Or Name if available
                        $("<td>", { class: "text-center" }).text(item.IdProducto), // Or Product Name
                        $("<td>", { class: "text-center" }).text(item.Cantidad),
                        $("<td>", { class: "text-center" }).append([btnDelete])
                    );
                    $("#tableRegistros tbody").append(row);
                });

                getPaginator(total, ClaseRegistro.currentPage);
                getLabelRegistro(total);
                fload("hide");
            });
        });
    });
};

var eventClickEliminar = function (data) {
    bootbox.confirm("¿Está seguro de eliminar el registro?", function (result) {
        if (result) {
            callAjax({ Id: data.Id }, urlDelete, "DELETE").done(function () {
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
                Logical: "OR",
                PropertyName: "IdCliente", // Adjust based on requirement
                Value: val,
                Operator: "Contains"
            });
        }
        initDataTable();
    });
};
