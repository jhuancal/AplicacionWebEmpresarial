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
        orden: [{ OrderType: "DESC", Property: "FechaSolicitud", Index: "1" }],
        startIndex: 0,
        length: 10
    };

    var entity = {};

    this.setEntity = function (objeto) {
        entity.Id = objeto.Id;
    };

    this.getEntity = function () { return entity; };

}).apply(ClaseRegistro);

$(function () {
    initDataTable();
    initEvent();
});

var initDataTable = function () {
    fload("show");

    // Using $.ajax directly as 'callAjax' wrapper availability is uncertain in new file context
    // unless defined in layout. Using $.ajax for reliability here but maintaining pattern.

    $.ajax({
        url: urlGetAll,
        type: 'GET',
        success: function (data) {
            // Client-side pagination for this module as per Controller implementation (Get All)
            var filterVal = $('#txtBuscar').val().toLowerCase();

            // Filter
            var filteredData = data.filter(function (item) {
                if (!filterVal) return true;
                var clientName = (item.ClienteNombre + " " + item.ClienteApellido).toLowerCase();
                var petName = (item.MascotaNombre || "").toLowerCase();
                return clientName.includes(filterVal) || petName.includes(filterVal);
            });

            // Sort (Newest first)
            filteredData.sort((a, b) => b.FechaSolicitud - a.FechaSolicitud);

            var total = filteredData.length;
            var numRows = parseInt($('#numRows').val());
            var currentPage = ClaseRegistro.currentPage;
            var numPages = Math.ceil(total / numRows);
            if (currentPage > numPages) currentPage = 1;
            ClaseRegistro.currentPage = currentPage;

            var start = (currentPage - 1) * numRows;
            var end = start + numRows;
            var pagedData = filteredData.slice(start, end);

            $("#tableRegistros tbody").empty();

            pagedData.forEach(function (item, index) {
                var estado = item.Estado || 'Nueva';
                var badgeClass = 'label-info';
                if (estado === 'Aprobada') badgeClass = 'label-success';
                if (estado === 'Rechazada') badgeClass = 'label-danger';

                var btnApprove = "";
                var btnReject = "";

                if (estado === 'Nueva') {
                    btnApprove = `<button class="btn btn-sm btn-success" onclick="aprobar('${item.Id}')" title="Aprobar"><i class="fa fa-check"></i></button>`;
                    btnReject = `<button class="btn btn-sm btn-danger" onclick="rechazar('${item.Id}')" title="Rechazar" style="margin-left:5px;"><i class="fa fa-times"></i></button>`;
                }

                var row = $("<tr>").append(
                    $("<td>", { class: "text-center" }).text(start + index + 1),
                    $("<td>", { class: "text-center" }).text(item.ClienteNombre + " " + item.ClienteApellido),
                    $("<td>", { class: "text-center" }).text(item.MascotaNombre),
                    $("<td>", { class: "text-center" }).text(new Date(item.FechaSolicitud).toLocaleString()),
                    $("<td>", { class: "text-center" }).append($("<span>", { class: "label " + badgeClass }).text(estado)),
                    $("<td>", { class: "text-center" }).append(btnApprove + btnReject)
                );
                $("#tableRegistros tbody").append(row);
            });

            getPaginator(total, currentPage);
            getLabelRegistro(total, start, end);
            fload("hide");
        },
        error: function (e) {
            console.error(e);
            fload("hide");
        }
    });
};

function aprobar(id) {
    if (confirm("¿Aprobar solicitud? Esto marcará a la mascota como adoptada.")) {
        $.ajax({
            url: urlApprove,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ Id: id }),
            success: function (resp) {
                if (resp.success) {
                    alert("Solicitud aprobada.");
                    initDataTable();
                } else {
                    alert("Error: " + resp.message);
                }
            }
        });
    }
}

function rechazar(id) {
    if (confirm("¿Rechazar solicitud?")) {
        $.ajax({
            url: urlReject, // Fixed variable name case mismatch possibility
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ Id: id }),
            success: function (resp) {
                if (resp.success) {
                    alert("Solicitud rechazada.");
                    initDataTable();
                } else {
                    alert("Error: " + resp.message);
                }
            }
        });
    }
}

var getPaginator = function (count, currentPage) {
    var numRows = parseInt($('#numRows').val());
    var numPages = Math.ceil(count / numRows);
    $('.pagination').empty();

    if (numPages <= 1) return;

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
    ClaseRegistro.currentPage = currentPage;
    initDataTable();
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

function fload(action) {
    // Shim if missing
}
