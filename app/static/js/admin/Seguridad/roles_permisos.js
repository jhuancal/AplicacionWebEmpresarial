var ClaseGlobalVar = {
    RolTemporal: null,
    ListaAcccesobyRol: [],
    getIdEmpty: function () { return "00000000-0000-0000-0000-000000000000"; }
};

var ClaseRegistro = {
    entity: {},
    insert: true,
    setEntity: function (data) {
        this.entity = Object.assign({}, data);
    },
    getEntity: function () {
        return this.entity;
    },
    setInsert: function () {
        this.insert = true;
        this.entity = { Id: ClaseGlobalVar.getIdEmpty(), Nombre: "", Descripcion: "" };
    },
    setEdit: function (data) {
        this.insert = false;
        this.setEntity(data);
    },
    isInsert: function () {
        return this.insert;
    }
};

$(function () {
    initDataTable();
    initDropdown();

    // Refresh dropdown on tab switch to Permissions
    $('a[href="#acceso-tab"]').on('shown.bs.tab', function (e) {
        initDropdown();
    });
});

var initDataTable = function () {
    $.getJSON(urlGetAllRoles, function (data) {
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
            }).append($("<i>", { class: "fa fa-trash text-danger" }));

            var row = $("<tr>").append(
                $("<td>", { class: "text-center" }).text(index + 1),
                $("<td>", { class: "text-center" }).text(item.Nombre),
                $("<td>", { class: "text-center" }).text(item.Descripcion || ""),
                $("<td>", { class: "text-center" }).append([btnEdit, " ", btnDelete])
            );
            $("#tableRegistros tbody").append(row);
        });
    });
};

var initDropdown = function () {
    $.getJSON(urlGetAllRoles, function (data) {
        var $select = $("#dropRol");
        $select.empty();
        $select.append('<option value="">-- Seleccione Rol --</option>');
        data.forEach(function (item) {
            $select.append($('<option>', {
                value: item.Id,
                text: item.Nombre
            }));
        });
    });
};

var eventClickOpenModalInsert = function () {
    ClaseRegistro.setInsert();
    $("#txtNombre").val("");
    $("#txtDescripcion").val("");
    $(".label-title").text("NUEVO").removeClass("edit").addClass("new");
    $("#dlgInsert").modal("show");
};

var eventClickEditar = function (item) {
    ClaseRegistro.setEdit(item);
    $("#txtNombre").val(item.Nombre);
    $("#txtDescripcion").val(item.Descripcion);
    $(".label-title").text("EDITAR").removeClass("new").addClass("edit");
    $("#dlgInsert").modal("show");
};

var eventClickSaverForm = function () {
    var entity = ClaseRegistro.getEntity();
    entity.Nombre = $("#txtNombre").val();
    entity.Descripcion = $("#txtDescripcion").val();

    if (!entity.Nombre) {
        alert("El nombre es obligatorio");
        return;
    }

    var url = ClaseRegistro.isInsert() ? urlInsertRol : urlUpdateRol;
    var method = ClaseRegistro.isInsert() ? "POST" : "PUT"; // Or POST for update if backend expects it
    if (!ClaseRegistro.isInsert()) method = "POST"; // My backend uses POST for Update as well normally, let's allow it.

    $.ajax({
        url: url,
        type: method,
        contentType: 'application/json',
        data: JSON.stringify(entity),
        success: function (resp) {
            $("#dlgInsert").modal("hide");
            initDataTable();
            initDropdown();
            alert("Guardado correctamente");
        },
        error: function (err) {
            console.error(err);
            alert("Error al guardar: " + err.responseJSON?.Error || err.statusText);
        }
    });
};

var eventClickEliminar = function (item) {
    if (!confirm("¿Está seguro de eliminar este rol?")) return;

    $.ajax({
        url: urlDeleteRol,
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify({ Id: item.Id }),
        success: function () {
            initDataTable();
            initDropdown();
            alert("Eliminado correctamente");
        },
        error: function (err) {
            alert("Error al eliminar");
        }
    });
};

// --- TREE LOGIC ---

var eventClickSeleccionar = function () {
    var rolId = $("#dropRol").val();
    if (!rolId) {
        alert("Seleccione un rol");
        return;
    }

    $.ajax({
        url: urlGetRolVistaByRol,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ idRol: rolId }),
        success: function (data) {
            ClaseGlobalVar.RolTemporal = { Id: rolId };
            ClaseGlobalVar.ListaAcccesobyRol = data.sort((a, b) => a.Orden - b.Orden);
            iniTreeTable();
        },
        error: function (err) {
            alert("Error al cargar permisos");
        }
    });
};

var iniTreeTable = function () {
    var $treeContainer = $('#treeTable');
    $treeContainer.empty();

    var rootNodes = ClaseGlobalVar.ListaAcccesobyRol.filter(item => item.Nivel === 1);
    var $ul = $('<ul class="tree-root" style="list-style:none; padding-left:0;"></ul>');

    rootNodes.forEach(item => {
        var $li = createTreeNode(item, 1);
        $ul.append($li);
    });

    $treeContainer.append($ul);
    initTreeEvents();
};

function createTreeNode(item, nivel) {
    var checked = item.Permiso ? "checked" : "";
    var idInput = "chk_" + item.IdVistaUno; // Access ID

    var $li = $('<li style="margin-bottom: 5px;"></li>');
    var $div = $('<div class="checkbox" style="margin: 0;"></div>');
    var $label = $('<label></label>');
    var $input = $('<input>', {
        type: 'checkbox',
        id: idInput,
        name: item.IdVistaUno,
        checked: item.Permiso
    });

    $label.append($input).append(" " + item.NombreVista);
    $div.append($label);
    $li.append($div);

    var hijos = ClaseGlobalVar.ListaAcccesobyRol.filter(x => x.Nivel === nivel + 1 && x.CodigoPadre === item.Codigo);
    if (hijos.length > 0) {
        var $ulHijos = $('<ul style="list-style:none; padding-left: 20px;"></ul>');
        hijos.forEach(hijo => {
            $ulHijos.append(createTreeNode(hijo, nivel + 1));
        });
        $li.append($ulHijos);
    }

    return $li;
}

var initTreeEvents = function () {
    $('#treeTable input[type="checkbox"]').on('click', function () {
        var checked = $(this).prop("checked");
        var id = $(this).attr("name");

        // Check Children
        var item = ClaseGlobalVar.ListaAcccesobyRol.find(x => x.IdVistaUno === id);
        if (item) {
            checkChildrenRecursively(item.Codigo, checked);
        }

        // Check Father
        if (checked) {
            checkFatherRecursively(item.CodigoPadre);
        }
    });
};

function checkChildrenRecursively(codigoPadre, checked) {
    var hijos = ClaseGlobalVar.ListaAcccesobyRol.filter(x => x.CodigoPadre === codigoPadre);
    hijos.forEach(hijo => {
        $('input[name="' + hijo.IdVistaUno + '"]').prop('checked', checked);
        checkChildrenRecursively(hijo.Codigo, checked);
    });
}

function checkFatherRecursively(codigoPadre) {
    if (codigoPadre === "TODO") return; // Root
    var padre = ClaseGlobalVar.ListaAcccesobyRol.find(x => x.Codigo === codigoPadre);
    if (padre) {
        $('input[name="' + padre.IdVistaUno + '"]').prop('checked', true);
        checkFatherRecursively(padre.CodigoPadre);
    }
}

var eventClickSaveVista = function () {
    if (!ClaseGlobalVar.RolTemporal) return;

    var listaToSave = [];

    ClaseGlobalVar.ListaAcccesobyRol.forEach(function (item) {
        var isChecked = $('input[name="' + item.IdVistaUno + '"]').prop('checked');
        // We only send checked changes? Or full list? 
        // Backend expects full list or logic to wipe and insert.
        // My backend wipes and inserts ONLY checked ones if Permiso=True.

        listaToSave.push({
            IdRol: ClaseGlobalVar.RolTemporal.Id,
            IdVistaUno: item.IdVistaUno,
            CodigoVista: item.Codigo,
            Permiso: isChecked ? true : false
        });
    });

    $.ajax({
        url: urlUpdateRolVista,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(listaToSave),
        success: function () {
            alert("Permisos actualizados correctamente");
            // Clear or reset
            $("#treeTable").empty();
            $("#dropRol").val("");
            ClaseGlobalVar.RolTemporal = null;
        },
        error: function (err) {
            alert("Error al actualizar permisos");
        }
    });
};

var eventClickCancelVista = function () {
    $("#treeTable").empty();
    $("#dropRol").val("");
    ClaseGlobalVar.RolTemporal = null;
};
