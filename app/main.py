import os
from flask import Flask, session
from routes.public import public_bp
from routes.admin import admin_bp

app = Flask(__name__)
app.secret_key = 'super_secret_key' # Change this in production
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'static', 'uploads')
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True) 

# Register Blueprints
app.register_blueprint(public_bp)
app.register_blueprint(admin_bp)

# Context Processor to inject user into all templates (if needed global)
@app.context_processor
def inject_user():
    return dict(user=session.get('user_data'))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
