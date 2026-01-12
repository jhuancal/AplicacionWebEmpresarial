from flask_mail import Mail

correo = Mail()

def iniciar_correo(app):
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 465
    app.config['MAIL_USE_SSL'] = True
    app.config['MAIL_USERNAME'] = 'jhuancal@unsa.edu.pe'
    app.config['MAIL_PASSWORD'] = 'pghhwptfugmwcscn'
    
    correo.init_app(app)
