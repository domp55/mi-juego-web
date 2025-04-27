# app/main/routes.py
from flask import Blueprint, render_template

# Define el Blueprint
main_bp = Blueprint('main', __name__,
                    template_folder='../templates', # Busca plantillas en app/templates
                    static_folder='../static',      # Sirve archivos estáticos desde app/static
                    static_url_path='/static/main') # URL para acceder a estáticos de este BP

@main_bp.route('/')
def index():
    """Sirve la página principal que cargará el juego."""
    # Aquí podrías pasar datos iniciales al juego si fuera necesario
    game_title = "Mi Juego Fantástico"
    return render_template('index.html', title=game_title)

# Puedes añadir otras rutas no-API aquí si las necesitas