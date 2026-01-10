from flask import Blueprint, request, jsonify, session, current_app
from db import get_db_connection
from repositories.publicacion_repository import PublicacionRepository
import uuid
import os
import time
from werkzeug.utils import secure_filename

publicaciones_bp = Blueprint('publicaciones', __name__)

ALLOWED_EXTENSIONS_IMG = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
ALLOWED_EXTENSIONS_VID = {'mp4', 'webm', 'ogg'}

def allowed_file(filename, allowed_set):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_set

@publicaciones_bp.route("/api/publicaciones/feed")
def get_feed():
    try:
        conn = get_db_connection()
        repo = PublicacionRepository(conn)
        limit = int(request.args.get('limit', 20))
        offset = int(request.args.get('offset', 0))
        posts = repo.get_feed(limit, offset)
        conn.close()
        return jsonify(posts)
    except Exception as e:
        print(f"Error fetching feed: {e}")
        return jsonify([]), 500

@publicaciones_bp.route("/api/publicaciones/upload", methods=['POST'])
def upload_post():
    user = session.get('user_data')
    if not user:
        return jsonify({"success": False, "message": "Login required"}), 401
    
    contenido = request.form.get('contenido', '')
    files = request.files.getlist('media')
    
    if not contenido and not files:
        return jsonify({"success": False, "message": "Content or media required"}), 400
        
    media_list = []
    
    # Process files
    for file in files:
        if file.filename == '':
            continue
            
        is_img = allowed_file(file.filename, ALLOWED_EXTENSIONS_IMG)
        is_vid = allowed_file(file.filename, ALLOWED_EXTENSIONS_VID)
        
        if not (is_img or is_vid):
            continue
            
        filename = secure_filename(file.filename)
        # Unique filename
        unique_name = f"{int(time.time())}_{uuid.uuid4().hex[:8]}_{filename}"
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_name)
        file.save(file_path)
        
        # Public URL
        public_url = f"/static/uploads/{unique_name}"
        tipo_media = 'Imagen' if is_img else 'Video'
        
        media_list.append({
            'Id': str(uuid.uuid4()),
            'Url': public_url,
            'TipoMedia': tipo_media,
            'ESTADO': 1,
            'DISPONIBILIDAD': 1,
            'FECHA_CREACION': 0,
            'FECHA_MODIFICACION': 0,
            'USER_CREACION': "admin",
            'USER_MODIFICACION': "admin"
        })
    
    # Create Post Data
    post_id = str(uuid.uuid4())
    post_data = {
        'Id': post_id,
        'IdCliente': user['Id'],
        'Contenido': contenido,
        'Likes': 0,
        'ESTADO': 1,
        'DISPONIBILIDAD': 1,
        'FECHA_CREACION': 0, # Should be timestamp
        'FECHA_MODIFICACION': 0,
        'USER_CREACION': "admin",
        'USER_MODIFICACION': "admin"
    }
    
    # Update Media list with Post ID
    for m in media_list:
        m['IdPublicacion'] = post_id
        
    conn = get_db_connection()
    repo = PublicacionRepository(conn)
    success = repo.create_post(post_data, media_list)
    conn.close()
    
    if success:
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "message": "Database error"}), 500
