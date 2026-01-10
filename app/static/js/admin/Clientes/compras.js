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
        entity.NumeroBoleta = objeto.NumeroBoleta;
        entity.IdCliente = objeto.IdCliente;
        entity.MontoTotal = objeto.MontoTotal;
        entity.FechaCreacion = objeto.FECHA_CREACION;
        entity.Estado = objeto.Estado;
    };

    this.getEntity = function () { return entity; };

}).apply(ClaseRegistro);

$(function () {
    initDataTable();
    initEvent();
});

var initDataTable = function () {
    fload("show");

    callAjax(ClaseRegistro.pagedItem.filtros, urlCountAll, "POST").done(function (r1) {
        var total = r1[0].total || r1[0];

        callAjax(ClaseRegistro.pagedItem, urlGetPaged, "POST").done(function (data) {
            $("#tableRegistros tbody").empty();

            data.forEach(function (item, index) {
                var btnDetalle = $("<button>", {
                    class: "btn btn-default btn-sm",
                    title: "Ver Detalle",
                    click: function () { eventClickVerDetalle(item); }
                }).append($("<i>", { class: "fa fa-eye text-info" }));

                var estadoClass = 'label-warning';
                if (item.Estado === 'Pagado' || item.Estado === 'Entregado') estadoClass = 'label-success';
                if (item.Estado === 'Cancelado') estadoClass = 'label-danger';

                var row = $("<tr>").append(
                    $("<td>", { class: "text-center" }).text(getNro(ClaseRegistro.pagedItem.startIndex + index)),
                    $("<td>", { class: "text-center" }).text(item.NumeroBoleta),
                    $("<td>", { class: "text-center" }).text(item.IdCliente),
                    $("<td>", { class: "text-center" }).text("S/ " + parseFloat(item.MontoTotal).toFixed(2)),
                    $("<td>", { class: "text-center" }).text(item.FECHA_CREACION ? new Date(item.FECHA_CREACION).toLocaleString() : ''),
                    $("<td>", { class: "text-center" }).append($("<span>", { class: "label " + estadoClass }).text(item.Estado)),
                    $("<td>", { class: "text-center" }).append([btnDetalle])
                );
                $("#tableRegistros tbody").append(row);
            });

            getPaginator(total, ClaseRegistro.currentPage);
            getLabelRegistro(total);
            fload("hide");
        });
    });
};

var eventClickVerDetalle = function (data) {
    // Implement detail view logic using 'verDetalle' original intent
    // Perhaps open a modal or alert as placeholder for now
    alert("Ver Detalle ID: " + data.Id);
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
                PropertyName: "IdCliente",
                Value: val,
                Operator: "Contains"
            });
            ClaseRegistro.pagedItem.filtros.push({
                Logical: "OR",
                PropertyName: "NumeroBoleta",
                Value: val,
                Operator: "Contains"
            });
        }
        initDataTable();
    });
};
