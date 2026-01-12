from flask import jsonify, request
from db import get_db_connection
from auth.decorators import login_required
from repositories.rol_repository import RolRepository
from repositories.acceso_repository import AccesoRepository
from repositories.rol_acceso_repository import RolAccesoRepository
from repositories.colaborador_repository import ColaboradorRepository
from repositories.persona_repository import PersonaRepository
import uuid
import time


@login_required
def get_all_roles():
    conn = get_db_connection()
    repo = RolRepository(conn)
    roles = repo.get_all()
    conn.close()
    return jsonify([r.to_dict() for r in roles])

@login_required
def insert_rol():
    data = request.json
    conn = get_db_connection()
    repo = RolRepository(conn)
    try:
        new_id = str(uuid.uuid4())
        repo.add(
            Id=new_id,
            Nombre=data.get('Nombre'),
            Descripcion=data.get('Descripcion'),
            ESTADO=1,
            DISPONIBILIDAD=1,
            FECHA_CREACION=int(time.time() * 1000),
            USER_CREACION='ADMIN'
        )
        return jsonify({'Id': new_id, 'Message': 'Success'}), 200
    except Exception as e:
        return jsonify({'Error': str(e)}), 500
    finally:
        conn.close()

@login_required
def update_rol():
    data = request.json
    rol_id = data.get('Id')
    conn = get_db_connection()
    repo = RolRepository(conn)
    try:
        cursor = conn.cursor()
        sql = "UPDATE Seg_Rol SET Nombre=%s, Descripcion=%s, FECHA_MODIFICACION=%s, USER_MODIFICACION=%s WHERE Id=%s"
        cursor.execute(sql, (data['Nombre'], data['Descripcion'], int(time.time() * 1000), 'ADMIN', rol_id))
        conn.commit()
        cursor.close()
        return jsonify({'Message': 'Success'}), 200
    except Exception as e:
        return jsonify({'Error': str(e)}), 500
    finally:
        conn.close()

@login_required
def delete_rol():
    data = request.json
    rol_id = data.get('Id')
    conn = get_db_connection()
    repo = RolRepository(conn)
    try:
        repo.delete(rol_id)
        return jsonify({'Message': 'Success'}), 200
    except Exception as e:
        return jsonify({'Error': str(e)}), 500
    finally:
        conn.close()

@login_required
def get_rol_acceso_by_rol():
    data = request.json
    rol_id = data.get('idRol')
    
    conn = get_db_connection()
    repo_acceso = AccesoRepository(conn)
    repo_rol_acceso = RolAccesoRepository(conn)
    
    accesos = repo_acceso.get_all()
    permisos = repo_rol_acceso.get_by_rol_id(rol_id)
    
    result = []
    for acc in accesos:
        assigned = next((p for p in permisos if p.IdAccesoUno == acc.Id), None)
        result.append({
            'Id': assigned.Id if assigned else str(uuid.uuid4()),
            'IdVistaUno': acc.Id, 
            'IdVistaDos': acc.Id,
            'Codigo': acc.Codigo,
            'CodigoPadre': acc.Padre,
            'NombreVista': acc.Nombre,
            'Permiso': True if assigned else False,
            'Nivel': acc.Nivel,
            'Orden': acc.Orden
        })
        
    conn.close()
    return jsonify(result)


@login_required
def get_all_vistas(): 
    conn = get_db_connection()
    repo = AccesoRepository(conn)
    vistas = repo.get_all()
    conn.close()
    return jsonify([v.to_dict() for v in vistas])

@login_required
def get_vista_by_id():
    
    data = request.json
    conn = get_db_connection()
    repo = AccesoRepository(conn)
    
    if isinstance(data, dict) and 'PropertyName' in data:
        cursor = conn.cursor(dictionary=True)
        sql = f"SELECT * FROM Seg_Acceso WHERE {data['PropertyName']} = %s"
        cursor.execute(sql, (data['value'],))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(rows)
    
    conn.close()
    return jsonify([])

@login_required
def insert_vista():
    data = request.json
    conn = get_db_connection()
    repo = AccesoRepository(conn)
    try:
        new_id = str(uuid.uuid4())
        repo.add(
            Id=new_id,
            Codigo=data.get('Codigo'),
            Nombre=data.get('NombreVista'),
            Descripcion=data.get('Descripcion'),
            Padre=data.get('CodigoPadre') if data.get('Padre') != 'TODO' else 'TODO', # JS Sends CodigoPadre
            Tipo='VISTA', # Default
            Nivel=data.get('Nivel'),
            Orden=data.get('Orden'),
            UrlAcceso=data.get('UrlVista'),
            ESTADO=1,
            DISPONIBILIDAD=1,
            FECHA_CREACION=int(time.time() * 1000),
            USER_CREACION='ADMIN'
        )
        return jsonify({'Id': new_id, 'Message': 'Success'}), 200
    except Exception as e:
        print(e)
        return jsonify({'Error': str(e)}), 500
    finally:
        conn.close()

@login_required
def update_vista():
    data = request.json
    vista_id = data.get('Id')
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        sql = """UPDATE Seg_Acceso SET 
                 Codigo=%s, Nombre=%s, Descripcion=%s, Padre=%s, Nivel=%s, Orden=%s, UrlAcceso=%s,
                 FECHA_MODIFICACION=%s, USER_MODIFICACION='ADMIN'
                 WHERE Id=%s"""
        cursor.execute(sql, (
            data.get('Codigo'), 
            data.get('NombreVista'), 
            data.get('Descripcion'),
            data.get('CodigoPadre'), 
            data.get('Nivel'),
            data.get('Orden'),
            data.get('UrlVista'),
            int(time.time() * 1000),
            vista_id
        ))
        conn.commit()
        cursor.close()
        return jsonify({'Message': 'Success'}), 200
    except Exception as e:
        return jsonify({'Error': str(e)}), 500
    finally:
        conn.close()

@login_required
def delete_vista():
    data = request.json
    id_vista = data.get('Id')
    conn = get_db_connection()
    repo = AccesoRepository(conn)
    try:
        repo.delete(id_vista)
        return jsonify({'Message': 'Success'}), 200
    except Exception as e:
        return jsonify({'Error': str(e)}), 500
    finally:
        conn.close()

@login_required
def update_lista_acceso(): # For Drag and Drop Position Update
    data = request.json # List of accesses with new Orden/Nivel/Padre
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        for item in data:
            sql = """UPDATE Seg_Acceso SET 
                     Orden=%s, Nivel=%s, Padre=%s
                     WHERE Id=%s"""
            cursor.execute(sql, (
                item.get('Orden'),
                item.get('Nivel'),
                item.get('CodigoPadre'),
                item.get('Id')
            ))
        conn.commit()
        cursor.close()
        return jsonify({'Message': 'Success'}), 200
    except Exception as e:
        return jsonify({'Error': str(e)}), 500
    finally:
        conn.close()


@login_required
def update_lista_rol_acceso():
    lista = request.json
    if not lista:
         return jsonify({'Message': 'No changes'}), 200
    rol_id = lista[0].get('IdRol')
    
    conn = get_db_connection()
    repo = RolAccesoRepository(conn)
    try:
        repo.delete_by_rol_id(rol_id)
        for item in lista:
            if item.get('Permiso'):
                repo.add(
                    Id=str(uuid.uuid4()),
                    IdRol=rol_id,
                    Codigo=item.get('CodigoVista'), 
                    Valor='S',
                    Tipo='ADMIN', 
                    IdAccesoUno=item.get('IdVistaUno'),
                    IdAccesoDos='00000000-0000-0000-0000-000000000000', 
                    ESTADO=1,
                    DISPONIBILIDAD=1,
                    FECHA_CREACION=int(time.time() * 1000),
                    USER_CREACION='ADMIN'
                )
        return jsonify({'Message': 'Success'}), 200
    except Exception as e:
        return jsonify({'Error': str(e)}), 500
    finally:
        conn.close()


@login_required
def get_paged_usuarios():
    data = request.json
    start = data.get('p_inicio', 0)
    length = data.get('p_intervalo', 10)
    search = data.get('consulta', '')
    
    conn = get_db_connection()
    repo = ColaboradorRepository(conn)
    filters = []
    if search:
        filters.append({'PropertyName': 'NombreUsuario', 'Operator': 'Contains', 'Value': search})
    rows = repo.get_paged(start, length, filters)
    
    role_repo = RolRepository(conn)
    roles = {r.Id: r.Nombre for r in role_repo.get_all()}
    
    result = []
    for r in rows:
        result.append({
            'Id': r['Id'],
            'IdPersona': r['IdPersona'],
            'NombrePersona': r.get('NombreCompleto'),
            'Username': r['NombreUsuario'],
            'NombreRol': roles.get(r['IdRol'], 'Sin Rol'),
            'IdRol': r['IdRol'],
            'rowversion_str': '0'
        })
    conn.close()
    return jsonify(result)

@login_required
def count_usuarios(): 
    return jsonify([{'total': 0}]) 

@login_required
def delete_usuario():
    data = request.json
    user_id = data.get('Id')
    conn = get_db_connection()
    repo = ColaboradorRepository(conn)
    try:
        repo.delete(user_id)
        return jsonify({'Message': 'Success'}), 200
    except Exception as e:
         return jsonify({'Error': str(e)}), 500
    finally:
         conn.close()


@login_required
def search_persona_paged():
    data = request.json
    nombre = data.get('nombrePersona')
    dni = data.get('dniPersona')
    apellido = data.get('apellidoPersona')
    start = data.get('p_inicio', 0)
    length = data.get('p_intervalo', 10)
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    conditions = ["1=1"]
    params = []
    if nombre:
        conditions.append("Nombres LIKE %s")
        params.append(f"%{nombre}%")
    if apellido:
        conditions.append("Apellidos LIKE %s")
        params.append(f"%{apellido}%")
    if dni:
        conditions.append("DNI LIKE %s")
        params.append(f"%{dni}%")
        
    where_sql = " AND ".join(conditions)
    sql = f"SELECT * FROM Adm_Persona WHERE {where_sql} LIMIT {length} OFFSET {start}"
    cursor.execute(sql, tuple(params))
    personas = cursor.fetchall()
    
    result = []
    for p in personas:
        cursor.execute("SELECT * FROM Seg_Colaborador WHERE IdPersona = %s", (p['Id'],))
        colaborador = cursor.fetchone()
        user_obj = {
            'IdPersona': p['Id'],
            'DniPersona': p['DNI'],
            'NombrePersona': f"{p['Nombres']} {p['Apellidos']}",
            'IdUsuario': colaborador['Id'] if colaborador else "00000000-0000-0000-0000-000000000000",
            'Username': colaborador['NombreUsuario'] if colaborador else "",
        }
        result.append({
            'Usuario': user_obj,
            'RolesEmpresa': [{'IdRol': colaborador['IdRol']}] if colaborador else []
        })
    cursor.close()
    conn.close()
    return jsonify(result)

@login_required
def insert_compuesto():
    data = request.json
    usuario = data.get('usuario', {})
    roles_empresa = data.get('RolesEmpresa', [])
    role_id = roles_empresa[0].get('IdRol') if roles_empresa else None
    
    if not role_id:
         return jsonify({'Error': 'No role selected'}), 400
         
    conn = get_db_connection()
    repo = ColaboradorRepository(conn)
    cursor = conn.cursor()
    try:
        colab_id = usuario.get('IdUsuario')
        is_new = not colab_id or colab_id == "00000000-0000-0000-0000-000000000000"
        
        if is_new:
            existing = repo.get_by_username(usuario.get('Username'))
            if existing:
                 return jsonify({'Error': 'Username already exists'}), 400
            new_id = str(uuid.uuid4())
            repo.add(
                Id=new_id,
                IdPersona=usuario.get('IdPersona'),
                NombreUsuario=usuario.get('Username'),
                Contrasena=usuario.get('Password'),
                IdRol=role_id,
                EsActivo=1,
                FechaContratacion=int(time.time()),
                ESTADO=1,
                DISPONIBILIDAD=1,
                FECHA_CREACION=int(time.time() * 1000),
                USER_CREACION='ADMIN'
            )
        else:
            update_data = {
                'IdRol': role_id,
                'FECHA_MODIFICACION': int(time.time() * 1000),
                'USER_MODIFICACION': 'ADMIN'
            }
            if usuario.get('Username'):
                update_data['NombreUsuario'] = usuario.get('Username')
            if usuario.get('Password'):
                update_data['Contrasena'] = usuario.get('Password')
            repo.update(colab_id, **update_data)
        
        return jsonify({'Message': 'Success'}), 200
    except Exception as e:
        return jsonify({'Error': str(e)}), 500
    finally:
        conn.close()


def register_routes(bp):
    bp.add_url_rule('/api/inm_seg_Rol/GetAll', view_func=get_all_roles, methods=['GET'])
    bp.add_url_rule('/api/inm_seg_Rol/Insert', view_func=insert_rol, methods=['POST'])
    bp.add_url_rule('/api/inm_seg_Rol/Update', view_func=update_rol, methods=['PUT', 'POST'])
    bp.add_url_rule('/api/inm_seg_Rol/Delete', view_func=delete_rol, methods=['DELETE'])
    bp.add_url_rule('/api/inm_seg_Rol/GetRolAccesoByRol', view_func=get_rol_acceso_by_rol, methods=['POST'])
    
    bp.add_url_rule('/api/inm_seg_RolVistas/UpdateListaRol_Acceso', view_func=update_lista_rol_acceso, methods=['POST'])
    
    bp.add_url_rule('/api/inm_seg_Vista/GetAll', view_func=get_all_vistas, methods=['GET'])
    bp.add_url_rule('/api/inm_seg_Vista/Getinm_seg_VistaById', view_func=get_vista_by_id, methods=['POST'])
    bp.add_url_rule('/api/inm_seg_Vista/Insert', view_func=insert_vista, methods=['POST'])
    bp.add_url_rule('/api/inm_seg_Vista/Update', view_func=update_vista, methods=['PUT', 'POST'])
    bp.add_url_rule('/api/inm_seg_Vista/Delete', view_func=delete_vista, methods=['DELETE'])
    bp.add_url_rule('/api/inm_seg_Vista/UpdateListaAcceso', view_func=update_lista_acceso, methods=['POST'])
    
    bp.add_url_rule('/api/inm_adm_Usuario/GetPagedListaUsuarioRol', view_func=get_paged_usuarios, methods=['POST'])
    bp.add_url_rule('/api/inm_adm_Usuario/GetTotalListaUsusarioRol', view_func=count_usuarios, methods=['POST'])
    bp.add_url_rule('/api/inm_adm_Usuario/Delete', view_func=delete_usuario, methods=['DELETE'])
    bp.add_url_rule('/api/inm_adm_Usuario/GetPagedListaPersonaEmpresa', view_func=search_persona_paged, methods=['POST'])
    bp.add_url_rule('/api/inm_adm_Usuario/InsertCompuesto', view_func=insert_compuesto, methods=['POST'])

