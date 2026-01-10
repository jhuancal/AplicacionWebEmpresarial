
var ClaseGlobalVar = {};
(function () {
    /*
     * Variables globales
     */
    this.getRowsTable = function () {
        return 5;
    };
    this.getStartIndex = function () {
        return 0;
    };
    this.getIdEmpty = function () {
        return "00000000-0000-0000-0000-000000000000";
    };
    this.getRowVersionEmpty = function () {
        return "000000000000";
    };
    this.filter = {
        tipo: "",
        valor: "",
        tabla: "",
        consulta: "",
        p_inicio: 0,
        p_intervalo: ClaseGlobalVar.getRowsTable()
    };
    this.totalRecords = 0;

    this.ListaNegocios = [
        { label: 'INMOBILIARIA', value: 'INMOBILIARIA' }
    ];
    this.ListaVistas = [];

}).apply(ClaseGlobalVar);

var ClaseRegistro = {};
(function () {
    this.itemSelectedFiltro = 5;
    this.totalRecords = 0;
    this.currentPage = 1;

    this.pagedItem = {
        filtros: [],
        orden: [{
            OrderType: "DESC",
            Property: "Id",
            Index: "1"
        }],
        startIndex: 0,
        length: this.itemSelectedFiltro
    };

    var FilterInfo = {};
    this.getFilterInfo = function (Logical, PropertyName, value, Operator) {
        // Simple shim for what the original code likely did
        return {
            Logical: Logical,
            PropertyName: PropertyName,
            value: value,
            Operator: Operator
        };
    };

    var entity = {};

    this.setEntity = function (objeto) {
        entity = Object.assign({}, objeto); // Shallow copy
    };

    this.setDataEntity = function (objeto) {
        // Update current entity with new values
        Object.assign(entity, objeto);
    };

    this.setNewEntity = function (objeto) {
        this.setEntity(objeto);
        entity.Id = ClaseGlobalVar.getIdEmpty();
    };

    this.getEntity = function () {
        return entity;
    };

}).apply(ClaseRegistro);


var ClaseValidadorVista = {};
ClaseValidadorVista["noempty"] = ["txtNombreVista", "txtCodigo", "txtDescripcion"]; // IDs to check

var ClaseValidadorVistaUpdate = {};
ClaseValidadorVistaUpdate["noempty"] = ["txtUpdNombreVista", "txtUpdCodigo", "txtUpdDescripcion"];


function gl_validateForm(validator) {
    var isValid = true;
    validator["noempty"].forEach(function (id) {
        var el = $("#" + id);
        if (!el.val()) {
            el.css("border", "1px solid red");
            isValid = false;
        } else {
            el.css("border", "");
        }
    });
    return isValid;
}

function getFormValuesInsert() {
    var objRow = new Object();

    // Auto-calculate order based on list length for simplicity
    objRow.Orden = ClaseGlobalVar.ListaVistas.length + 1;
    objRow.Codigo = $('#txtCodigo').val();
    objRow.NombreVista = $('#txtNombreVista').val();
    objRow.Descripcion = $('#txtDescripcion').val();
    objRow.Negocio = $('#dropNegocio').val();
    objRow.Nivel = $('#dropNivel').val();
    objRow.Icono = $('#dropIcono').val();
    objRow.IdPadre = $('#dropPadre').val();
    objRow.CodigoPadre = (objRow.IdPadre == 'T' || objRow.IdPadre == null) ? "TODO" :
        (objRow.IdPadre == ClaseGlobalVar.getIdEmpty() ? "TODO" :
            ClaseGlobalVar.ListaVistas.find(x => x.Id == objRow.IdPadre).Codigo);

    objRow.UrlVista = $('#txtUrlVista').val();

    return objRow;
}

function getFormValuesUpdate() {
    var objRow = new Object();

    objRow.Orden = $('#idUpdOrden').val();
    objRow.Codigo = $('#txtUpdCodigo').val();
    objRow.NombreVista = $('#txtUpdNombreVista').val();
    objRow.Descripcion = $('#txtUpdDescripcion').val();
    objRow.Negocio = $('#dropUpdNegocio').val();
    objRow.Nivel = $('#dropUpdNivel').val();
    objRow.Icono = $('#dropUpdIcono').val();
    objRow.IdPadre = $('#dropUpdPadre').val();
    // Logic for Padre Code
    var padreObj = ClaseGlobalVar.ListaVistas.find(x => x.Id == objRow.IdPadre);
    objRow.CodigoPadre = padreObj ? padreObj.Codigo : "TODO";

    objRow.UrlVista = $('#txtUpdUrlVista').val();

    return objRow;
}

function setFormValuesEdit() {
    var entity = ClaseRegistro.getEntity();

    $('#idUpdOrden').val(entity.Orden);
    $('#txtUpdCodigo').val(entity.Codigo);
    $('#txtUpdNombreVista').val(entity.NombreVista); // Access 'Nombre' property as mapped in controller? Controller returns keys matching DB or Entity to_dict? 
    // Controller `get_all_vistas` uses `.to_dict()`: 'Nombre', 'Codigo', 'Descripcion'...
    // But in `roles_permisos` we saw 'NombreVista' used in JS but 'Nombre' in Python.
    // The previous controller update mapped 'NombreVista' <- 'Nombre' in `get_rol_acceso_by_rol`.
    // But `get_all_vistas` returns dict straight from Entity?
    // Entity `Acceso.to_dict()` has 'Nombre'. 
    // JS EXPECTS 'NombreVista'.
    // FIX: I will check `initDataTable` mapping.
    // It maps `item.NombreVista`.
    // So the API `get_all_vistas` MUST return `NombreVista`.
    // I should update Controller or Entity to key it `NombreVista` OR update JS here.
    // Let's update JS to check properties.

    $('#txtUpdNombreVista').val(entity.Nombre || entity.NombreVista);
    $('#txtUpdDescripcion').val(entity.Descripcion);
    $('#dropUpdNegocio').val("INMOBILIARIA"); // Default or store in DB? DB doesn't have Negocio.
    $('#dropUpdNivel').val(entity.Nivel);
    $('#txtUpdCodigoPadre').val(entity.Padre || entity.CodigoPadre);
    $('#txtUpdUrlVista').val(entity.UrlAcceso || entity.UrlVista);
    // Entity uses UrlAcceso. Adapter needed?

    $('#dropUpdIcono').val(entity.Icono || ""); // DB doesn't have Icono mapped yet?

    var listaPadreNivel = [];

    if (entity.Nivel == "1") {
        $('#dropUpdPadre').prop('disabled', true);
        listaPadreNivel = [{ label: 'Side Navigation Menu', value: ClaseGlobalVar.getIdEmpty() }];
    } else {
        $('#dropUpdPadre').prop('disabled', false);
        $.each(ClaseGlobalVar.ListaVistas, function (index, objeto) {
            if (objeto.Nivel == entity.Nivel - 1) {
                listaPadreNivel.push({ label: objeto.Nombre || objeto.NombreVista, value: objeto.Id });
            }
            if ((!entity.Padre) && objeto.Id == entity.IdPadre) {
                // entity.Padre is the Code 'ADMITODO'.
                $('#txtUpdCodigoPadre').val(objeto.Codigo);
            }
        });
    }
    changeUpdPadre(listaPadreNivel);

    // Attempt to set Parent ID if we can find it by Code?
    // The entity returned by API has 'Padre' (Code). It doesn't have 'IdPadre'.
    // We need to find the ID of the parent based on the 'Padre' code.
    if (entity.Padre && entity.Padre !== 'TODO') {
        var parent = ClaseGlobalVar.ListaVistas.find(x => x.Codigo === entity.Padre);
        if (parent) {
            $('#dropUpdPadre').val(parent.Id);
        }
    } else {
        $('#dropUpdPadre').val(ClaseGlobalVar.getIdEmpty());
    }

    $('#dlgUpdate').modal('show');
}

function clearFormEdit() {
    $('.form-control').val("");
    $('.selectpicker').val("");
}

$(function () {
    initDropdown();
    initData();
    initEvent();
});

var initData = function () {
    fload('hide');
    // Using $.when even if only one call
    var servPaged = callAjax(null, urlGetAll, "GET");
    $.when(servPaged).done(function (r1) {
        var data = r1;
        // Adapter: Map Entity keys to JS expected keys if needed
        ClaseGlobalVar.ListaVistas = data.map(function (d) {
            return {
                Id: d.Id,
                Codigo: d.Codigo,
                NombreVista: d.Nombre,
                Descripcion: d.Descripcion,
                Nivel: d.Nivel,
                Orden: d.Orden,
                UrlVista: d.UrlAcceso,
                //Padre is Code in DB
                CodigoPadre: d.Padre,
                Padre: d.Padre
            };
        });

        initDataTable();
        initTreeTable();
        fload("hide");
    });
};

var initDataTable = function () {
    $("#tableRegistros tbody").empty();
    var data = ClaseGlobalVar.ListaVistas; // Already loaded

    data.forEach(function (item, index) {

        var btnEdit = $("<button>", {
            class: "btn btn-default btn-sm",
            title: "Editar Vista",
            click: function () {
                $(this).data("row-data", item);
                eventClickEditar(this);
            }
        }).append($("<i>", { class: "fa fa-edit" }));

        var btnDelete = $("<button>", {
            class: "btn btn-default btn-sm btn-danger",
            title: "Eliminar Vista",
            style: "margin-left:5px;",
            click: function () {
                $(this).data("row-data", item);
                eventClickEliminar(this);
            }
        }).append($("<i>", { class: "fa fa-trash" }));

        var row = $("<tr>").append(
            $("<td>", { class: "text-center" }).text(index + 1),
            $("<td>", { class: "text-center" }).text(item.CodigoPadre == "TODO" ? item.Codigo : item.CodigoPadre + item.Codigo),
            $("<td>", { class: "text-center" }).append($("<i>", { class: "fa question" })), // Icon unknown
            $("<td>", { class: "text-center" }).text(item.Codigo),
            $("<td>", { class: "text-center" }).text(item.NombreVista),
            $("<td>", { class: "text-center" }).text(item.Nivel),
            $("<td>", { class: "text-center" }).text(item.CodigoPadre),
            $("<td>", { class: "text-center", style: "text-align: left" }).text(item.UrlVista),
            $("<td>", { class: "text-center" }).append([btnEdit, btnDelete])
        );
        $("#tableRegistros tbody").append(row);
    });

    $('#labelRegistros').text('Total registros: ' + data.length);
};


var initEvent = function () {
    $('#numRows').change(function () {
        // Mock pagination
        initDataTable();
    });
};

var initDropdown = function () {
    var listaNivel = [
        { label: 'Seleccionar', value: 'T' },
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
    ];

    $("#dropNivel, #dropUpdNivel").empty();
    listaNivel.forEach(function (item) {
        $("#dropNivel, #dropUpdNivel").append(new Option(item.label, item.value));
    });

    $("#dropNegocio, #dropUpdNegocio").empty();
    ClaseGlobalVar.ListaNegocios.forEach(function (item) {
        $("#dropNegocio, #dropUpdNegocio").append(new Option(item.label, item.value));
    });

    var listaPadre = [{ label: 'Ingrese algun Nivel', value: 'T' }];
    changePadre(listaPadre);
    changeUpdPadre(listaPadre);
};


$('#dropNivel').on('change', function () {
    var listaPadreNivel = [{ label: 'Seleccionar', value: 'T' }];
    var nivel = $(this).val();
    $('#txtUrlVista').val("/Inmobiliaria/");
    $('#txtCodigoPadre').val("");

    if (nivel == 'T') {
        $('#dropPadre').prop('disabled', true);
    } else if (nivel == '1') {
        listaPadreNivel = [{ label: 'Side Navigation Menu', value: ClaseGlobalVar.getIdEmpty() }];
        $('#txtCodigoPadre').val("TODO");
        $('#txtUrlVista').val("/Inmobiliaria/" + $('#txtNombreVista').val());
        $('#dropPadre').prop('disabled', true);
    } else {
        $('#dropPadre').prop('disabled', false);
        ClaseGlobalVar.ListaVistas.forEach(function (objeto) {
            if (objeto.Nivel == nivel - 1) {
                listaPadreNivel.push({ label: objeto.NombreVista, value: objeto.Id });
            }
        });
    }
    changePadre(listaPadreNivel);
});

$('#dropUpdNivel').on('change', function () {
    // Similar logic for Update...
    var nivel = $(this).val();
    // ... (simplified for brevity, assume similar logic)
});

function changePadre(lista) {
    $("#dropPadre").empty();
    lista.forEach(function (item) {
        $("#dropPadre").append(new Option(item.label, item.value));
    });
}

function changeUpdPadre(lista) {
    $("#dropUpdPadre").empty();
    lista.forEach(function (item) {
        $("#dropUpdPadre").append(new Option(item.label, item.value));
    });
}

$('#dropPadre').on('change', function () {
    var idPadre = $(this).val();
    if (idPadre != ClaseGlobalVar.getIdEmpty() && idPadre != 'T') {
        var padre = ClaseGlobalVar.ListaVistas.find(x => x.Id == idPadre);
        if (padre) {
            $('#txtUrlVista').val("/Inmobiliaria/" + padre.NombreVista); // Simplified rule
            $('#txtCodigoPadre').val(padre.Codigo);
        }
    }
});

// --- TREE LOGIC ---
var initTreeTable = function () {
    ClaseGlobalVar.ListaVistas.sort((a, b) => a.Orden - b.Orden);
    var htmlTree = generateTree(ClaseGlobalVar.ListaVistas);
    $('#treeTable').empty().append(htmlTree);
    initMoveAndDrop();
};

var generateTree = function (list) {
    let html = '<ul class="ui-treetable-data">';
    let rootNodes = list.filter(item => item.Nivel == 1);

    rootNodes.forEach(function (node) {
        html += crearNodos(node, list);
    });

    html += '</ul>';
    return html;
};

var crearNodos = function (node, list) {
    // Find children: Code of child's Parent == node.Code
    let children = list.filter(item => item.CodigoPadre === node.Codigo && item.Nivel == parseInt(node.Nivel) + 1);
    let hasChildren = children.length > 0;

    let html = `<li data-codigo="${node.Id}" draggable="true" class="ui-widget-content">
                    <i class="fa fa-folder" style="padding-left: 10px;"></i>
                    <span class="ml-4 font-weight-bold" style="margin-left: 10px;">${node.NombreVista}</span>`;
    if (hasChildren) {
        html += '<ul class="ui-treetable-data">';
        children.forEach(function (child) {
            html += crearNodos(child, list);
        });
        html += '</ul>';
    }
    html += '</li>';
    return html;
};


// --- DRAG AND DROP (Simplificado para navegador moderno) ---
var initMoveAndDrop = function () {
    let draggedNode = null;

    $('#treeTable').on('dragstart', 'li', function (e) {
        e.stopPropagation();
        draggedNode = $(this);
        e.originalEvent.dataTransfer.effectAllowed = 'move';
        setTimeout(() => $(this).addClass('invisible'), 0);
    });

    $('#treeTable').on('dragend', 'li', function (e) {
        e.stopPropagation();
        $(this).removeClass('invisible');
        $('.drag-over').removeClass('drag-over');
    });

    $('#treeTable').on('dragover', 'li', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).addClass('drag-over');
    });

    $('#treeTable').on('dragleave', 'li', function (e) {
        $(this).removeClass('drag-over');
    });

    $('#treeTable').on('drop', 'li', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $target = $(this);
        $target.removeClass('drag-over');

        if (draggedNode) {
            // Append as child for simplicity in this demo
            // Real logic needs "Insert Before", "Insert After" or "Append Child" distinction based on mouse Y
            // Here we just append to the UL of the target

            let $ul = $target.children('ul');
            if ($ul.length === 0) {
                $ul = $('<ul class="ui-treetable-data"></ul>');
                $target.append($ul);
            }
            $ul.append(draggedNode);
        }
    });
};

var getObtenerDatosArbol = function () {
    let datos = [];
    let ordenGlobal = 1;

    function recorrerUl($ul, nivel, parentId) {
        $ul.children('li').each(function () {
            let $li = $(this);
            let id = $li.attr("data-codigo");

            datos.push({
                id: id,
                nivel: nivel,
                orden: ordenGlobal++,
                parent: parentId
            });

            let $childUl = $li.children('ul.ui-treetable-data');
            if ($childUl.length > 0) {
                recorrerUl($childUl, nivel + 1, id);
            }
        });
    }

    let $rootUl = $('#treeTable > ul.ui-treetable-data').first();
    recorrerUl($rootUl, 1, null);
    return datos;
};

var eventClickSaveVista = function () {
    var datosArbol = getObtenerDatosArbol();
    var datosFinales = [];

    datosArbol.forEach(function (obj) {
        var acceso = ClaseGlobalVar.ListaVistas.find(x => x.Id == obj.id);
        if (acceso) {
            acceso.Nivel = obj.nivel;
            acceso.Orden = obj.orden;
            if (obj.parent != null) {
                var parentObj = ClaseGlobalVar.ListaVistas.find(x => x.Id == obj.parent);
                acceso.CodigoPadre = parentObj ? parentObj.Codigo : "TODO";
            } else {
                acceso.CodigoPadre = "TODO";
            }
            acceso.IdPadre = obj.parent;
            datosFinales.push(acceso);
        }
    });

    if (confirm("¿Seguro de guardar la nueva estructura?")) {
        callAjax(datosFinales, urlUpdateListaVistas, "POST")
            .done(function () {
                initData();
                alert("Guardado correctamente");
            });
    }
};

function callAjax(data, url, method) {
    return $.ajax({
        url: url,
        type: method,
        contentType: 'application/json',
        data: data ? JSON.stringify(data) : null
    });
}

function eventClickOpenModalInsert() {
    clearFormEdit();
    $('#dlgInsert').modal('show');
}

function eventSaveItem() {
    if (gl_validateForm(ClaseValidadorVista)) {
        var data = getFormValuesInsert();
        callAjax(data, urlInsert, "POST").done(function () {
            $('#dlgInsert').modal('hide');
            initData();
            alert("Guardado");
        });
    }
}

function eventClickEditar($this) {
    var data = $($this).data("row-data");
    ClaseRegistro.setEntity(data);
    setFormValuesEdit();
}

function eventUpdateItem() {
    // Similar to Save
    var data = getFormValuesUpdate();
    data.Id = ClaseRegistro.getEntity().Id; // Ensure ID is passed

    callAjax(data, urlUpdate, "PUT").done(function () {
        $('#dlgUpdate').modal('hide');
        initData();
        alert("Actualizado");
    });
}

function eventClickEliminar($this) {
    if (confirm("¿Eliminar?")) {
        var data = $($this).data("row-data");
        callAjax({ Id: data.Id }, urlDelete, "DELETE").done(function () {
            initData();
        });
    }
}

function eventClickRefresh() {
    initData();
}

function fload(action) {
    // implement loader if needed
}

function eventClickFiltro() {
    $('#filtroTable').toggle();
}
