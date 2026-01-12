var ClaseGlobalVar = {
    filter: {
        consulta: "",
        p_inicio: 0,
        p_intervalo: 10
    },
    filterPersona: {
        nombrePersona: "",
        dniPersona: "",
        apellidoPersona: "",
        p_inicio: 0,
        p_intervalo: 10
    }
};

$(function () {
    loadRoles();
    initDataTableUser();

    $("#txtBuscarUser").keypress(function (e) {
        if (e.which == 13) initDataTableUser();
    });
});

var loadRoles = function () {
    $.getJSON(urlGetAllRoles, function (data) {
        var $select = $("#dropRolUser");
        $select.empty();
        data.forEach(function (item) {
            $select.append($('<option>', {
                value: item.Id,
                text: item.Nombre
            }));
        });
    });
};



var initDataTableUser = function () {
    ClaseGlobalVar.filter.consulta = $("#txtBuscarUser").val();

    $.ajax({
        url: urlGetPagedUsuarioRol,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(ClaseGlobalVar.filter),
        success: function (data) {
            $("#tableRegistros tbody").empty();
            if (data.length == 0) {
                $("#tableRegistros tbody").append('<tr><td colspan="5" class="text-center">No se encontraron registros</td></tr>');
                return;
            }

            data.forEach(function (item, index) {
                var btnEdit = $("<button>", {
                    class: "btn btn-default btn-sm",
                    title: "Editar",
                    click: function () { eventClickEditarUser(item); }
                }).append($("<i>", { class: "fa fa-pencil text-warning" }));

                var btnDelete = $("<button>", {
                    class: "btn btn-default btn-sm",
                    title: "Eliminar",
                    click: function () { eventClickEliminarUser(item); }
                }).append($("<i>", { class: "fa fa-trash text-danger" }));

                var row = $("<tr>").append(
                    $("<td>", { class: "text-center" }).text(ClaseGlobalVar.filter.p_inicio + index + 1),
                    $("<td>", { class: "text-center" }).text(item.NombrePersona),
                    $("<td>", { class: "text-center" }).text(item.Username),
                    $("<td>", { class: "text-center" }).text(item.NombreRol),
                    $("<td>", { class: "text-center" }).append([btnEdit, " ", btnDelete])
                );
                $("#tableRegistros tbody").append(row);
            });

            $("#pageInfoUser").text("Página " + (ClaseGlobalVar.filter.p_inicio / ClaseGlobalVar.filter.p_intervalo + 1));
        },
        error: function (err) {
            console.error(err);
        }
    });
};

var prevPageUser = function () {
    if (ClaseGlobalVar.filter.p_inicio > 0) {
        ClaseGlobalVar.filter.p_inicio -= ClaseGlobalVar.filter.p_intervalo;
        initDataTableUser();
    }
};

var nextPageUser = function () {
    ClaseGlobalVar.filter.p_inicio += ClaseGlobalVar.filter.p_intervalo;
    initDataTableUser();
};

var eventClickEditarUser = function (item) {
    $('a[href="#nuevo-tab"]').tab('show');

    $("#hdnIdUsuario").val(item.Id);
    $("#hdnIdPersona").val(item.IdPersona);
    $("#txtPersonaName").val(item.NombrePersona);
    $("#txtUsername").val(item.Username);
    $("#dropRolUser").val(item.IdRol);
    $("#txtPassword").val(""); // Password not sent back for security
};

var eventClickEliminarUser = function (item) {
    if (!confirm("¿Eliminar usuario " + item.Username + "?")) return;

    $.ajax({
        url: urlDeleteUsuario,
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify({ Id: item.Id }),
        success: function () {
            initDataTableUser();
            alert("Usuario eliminado");
        },
        error: function () { alert("Error al eliminar"); }
    });
};



var eventClickCancelUser = function () {
    $("#hdnIdUsuario").val("00000000-0000-0000-0000-000000000000");
    $("#hdnIdPersona").val("");
    $("#txtPersonaName").val("");
    $("#txtUsername").val("");
    $("#txtPassword").val("");
    $("#dropRolUser").val($("#dropRolUser option:first").val());

    $('a[href="#lista-tab"]').tab('show');
};

var eventClickSaveUser = function () {
    var idPersona = $("#hdnIdPersona").val();
    if (!idPersona) {
        alert("Debe seleccionar una persona");
        return;
    }

    var username = $("#txtUsername").val();
    if (!username) {
        alert("Ingrese nombre de usuario");
        return;
    }

    var roleId = $("#dropRolUser").val();
    if (!roleId) {
        alert("Seleccione un rol");
        return;
    }

    var payload = {
        usuario: {
            IdUsuario: $("#hdnIdUsuario").val() || "00000000-0000-0000-0000-000000000000",
            IdPersona: idPersona,
            Username: username,
            Password: $("#txtPassword").val()
        },
        RolesEmpresa: [
            { IdRol: roleId }
        ]
    };

    $.ajax({
        url: urlInsertCompuesto, // Handles both insert and update
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function () {
            alert("Guardado correctamente");
            eventClickCancelUser();
            initDataTableUser();
        },
        error: function (err) {
            alert(err.responseJSON?.Error || "Error al guardar");
        }
    });
};



var eventClickOpenModalPersona = function () {
    $("#searchDni").val("");
    $("#searchNombre").val("");
    $("#tablePersonas tbody").empty();
    $("#dlgSearchPersona").modal("show");
};

var searchPersona = function () {
    ClaseGlobalVar.filterPersona.dniPersona = $("#searchDni").val();
    ClaseGlobalVar.filterPersona.nombrePersona = $("#searchNombre").val();
    ClaseGlobalVar.filterPersona.p_inicio = 0;

    $.ajax({
        url: urlGetPagedPersonaEmpresa,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(ClaseGlobalVar.filterPersona),
        success: function (data) {
            $("#tablePersonas tbody").empty();
            if (!data || data.length === 0) {
                $("#tablePersonas tbody").append('<tr><td colspan="3">No encontrado</td></tr>');
                return;
            }

            data.forEach(function (item) {
                var btn = $("<button>", {
                    class: "btn btn-info btn-xs",
                    text: "Seleccionar",
                    click: function () { selectPersona(item); }
                });

                var row = $("<tr>").append(
                    $("<td>").text(item.Usuario.DniPersona),
                    $("<td>").text(item.Usuario.NombrePersona),
                    $("<td>").append(btn)
                );
                $("#tablePersonas tbody").append(row);
            });
        }
    });
};

var selectPersona = function (item) {
    $("#hdnIdPersona").val(item.Usuario.IdPersona);
    $("#txtPersonaName").val(item.Usuario.NombrePersona);

    if (item.Usuario.IdUsuario && item.Usuario.IdUsuario !== "00000000-0000-0000-0000-000000000000") {
        if (confirm("Esta persona ya tiene usuario (" + item.Usuario.Username + "). ¿Desea editarlo?")) {
            $("#hdnIdUsuario").val(item.Usuario.IdUsuario);
            $("#txtUsername").val(item.Usuario.Username);
            if (item.RolesEmpresa && item.RolesEmpresa.length > 0) {
                $("#dropRolUser").val(item.RolesEmpresa[0].IdRol);
            }
        }
    } else {
        $("#hdnIdUsuario").val("00000000-0000-0000-0000-000000000000");
        $("#txtUsername").val("");
    }

    $("#dlgSearchPersona").modal("hide");
};