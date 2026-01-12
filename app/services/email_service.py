from flask_mail import Message
from extensiones import correo
from flask import current_app

class ServicioCorreo:
    @staticmethod
    def enviar_correo_bienvenida(para_correo, nombre_usuario):
        mensaje = Message(
            subject='Bienvenido a AlmasSalvajes',
            recipients=[para_correo],
            sender=current_app.config['MAIL_USERNAME']
        )
        mensaje.html = f"""
        <div style="font-family: Arial, sans-serif; color: #333;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #f8b500;">¡Bienvenido a Almas Salvajes! 🐾</h1>
            </div>
            <p>Hola <strong>{nombre_usuario}</strong>,</p>
            <p>Gracias por registrarte en nuestra plataforma. Estamos felices de tenerte con nosotros.</p>
            <p>¡Esperamos que disfrutes de nuestros servicios!</p>
            <br>
            <p>Saludos,</p>
            <p><strong>El Equipo AlmasSalvajes</strong></p>
        </div>
        """
        
        try:
            correo.send(mensaje)
            print(f"Email sent successfully to {para_correo}")
            return True
        except Exception as e:
            print(f"Failed to send email: {e}")
            return False

    @staticmethod
    def enviar_correo_verificacion(para_correo, token):
        mensaje = Message(
            subject='Verifica tu correo - Almas Salvajes',
            recipients=[para_correo],
            sender=current_app.config['MAIL_USERNAME']
        )
        mensaje.html = f"""
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #f8b500;">Verificación de Cuenta</h2>
            </div>
            <p>Hola,</p>
            <p>Estás intentando registrarte en <strong>AlmasSalvajes</strong>. Para continuar, por favor ingresa el siguiente código de verificación:</p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; background: #f4f4f4; padding: 10px 20px; border-radius: 4px;">{token}</span>
            </div>
            <p>Este código expira en 10 minutos.</p>
            <p>Si no solicitaste este registro, por favor ignora este correo.</p>
            <br>
            <p>Saludos,</p>
            <p><strong>El Equipo AlmasSalvajes</strong></p>
        </div>
        """
        
        try:
            correo.send(mensaje)
            print(f"Verification email sent to {para_correo}")
            return True
        except Exception as e:
            print(f"Failed to send email: {e}")
            return False