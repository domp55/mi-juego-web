# app/__init__.py
from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv() # Carga variables de .env si existe (para desarrollo local)

def create_app():
    app = Flask(__name__, instance_relative_config=True)

    # Configuración básica (puedes añadir más si necesitas)
    # Intenta cargar una clave secreta desde variables de entorno
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')

    # Habilitar CORS para permitir peticiones desde el frontend
    # Puedes ser más específico con los orígenes en producción
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    with app.app_context():
        # Importar y registrar Blueprints
        from .main import routes as main_routes
        app.register_blueprint(main_routes.main_bp)

        # Si decides crear una API, registra su blueprint aquí
        # from .api import routes as api_routes
        # app.register_blueprint(api_routes.api_bp, url_prefix='/api')

        # Inicializar extensiones (si tuvieras base de datos, etc.)

    @app.route('/health')
    def health_check():
        """Ruta simple para verificar que la app está viva."""
        return "OK", 200

    return app