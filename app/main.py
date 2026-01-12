import os
from flask import Flask, session
from routes.public import public_bp
from routes.admin import admin_bp
from extensions import mail

app = Flask(__name__)

# Configuración SMTP
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = 'jhuancal@unsa.edu.pe'
app.config['MAIL_PASSWORD'] = 'pghhwptfugmwcscn'

mail.init_app(app)
app.secret_key = 'super_secret_key'
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'static', 'uploads')
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
app.register_blueprint(public_bp)
app.register_blueprint(admin_bp)

from routes.carrito import carrito_bp
from routes.compra import compra_bp
from routes.publicaciones import publicaciones_bp

app.register_blueprint(carrito_bp)
app.register_blueprint(compra_bp)
app.register_blueprint(publicaciones_bp)
@app.context_processor
def inject_user():
    return dict(user=session.get('user_data'))

if __name__ == "__main__":
    try:
        from init_db import init_db
        init_db()
    except Exception as e:
        print(f"DB Init failed: {e}")
    port = int(os.environ.get("PORT", 5000))
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
