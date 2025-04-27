# run.py
from app import create_app
import os

app = create_app()

if __name__ == '__main__':
    # Usar el puerto definido en la variable de entorno PORT (útil para Azure)
    # o 5000 por defecto para desarrollo local.
    port = int(os.environ.get('PORT', 5000))
    # Ejecutar en 0.0.0.0 para ser accesible en la red local/docker/Azure
    # debug=True es útil en desarrollo, ¡asegúrate de que sea False en producción!
    app.run(host='0.0.0.0', port=port, debug=True)