// app/static/js/game.js

// Configuración básica de Phaser
const config = {
    type: Phaser.AUTO, // Usa WebGL si está disponible, si no Canvas
    width: 800,        // Ancho del lienzo del juego
    height: 600,       // Alto del lienzo del juego
    parent: 'game-container', // ID del div HTML donde se inyectará el juego
    backgroundColor: '#1d212d',
    physics: {         // Opcional: Habilitar motor de físicas si lo necesitas
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // Ejemplo: sin gravedad global
            debug: false      // Poner a true para ver cajas de colisión, etc.
        }
    },
    scene: {
        preload: preload, // Función para cargar assets
        create: create,   // Función que se ejecuta una vez al crear la escena
        update: update    // Función que se ejecuta en cada frame
    }
};

// Crear la instancia del juego
const game = new Phaser.Game(config);

// Variable global simple (ejemplo)
let score = 0;
let scoreText;
let logo;

// --- Funciones de la Escena de Phaser ---

function preload() {
    // Cargar assets (imágenes, spritesheets, audio, etc.)
    // Usamos url_for para obtener la ruta correcta incluso si cambia
    // ¡Nota! url_for no funciona directamente en JS. Lo ideal es pasar
    // las rutas base desde el template HTML a JS, o tener una API que las devuelva.
    // Solución simple por ahora: Rutas relativas desde el HTML.
    this.load.image('logo', '/static/main/assets/phaser-logo.png'); // Ruta relativa a la raíz web
    this.load.image('sky', '/static/main/assets/sky.png'); // Ejemplo fondo
}

function create() {
    // Se ejecuta una vez después de preload
    // Añadir elementos a la escena (imágenes, texto, sprites)

    // Añadir imagen de fondo
    this.add.image(config.width / 2, config.height / 2, 'sky');

    // Añadir el logo (que podrá interactuar)
    logo = this.physics.add.image(config.width / 2, config.height / 2, 'logo');
    logo.setCollideWorldBounds(true); // No puede salir de la pantalla
    logo.setBounce(0.8); // Rebota un poco
    logo.setInteractive(); // Permite hacer clic en él

    // Añadir texto para la puntuación
    scoreText = this.add.text(16, 16, 'Puntuación: 0', {
        fontSize: '32px',
        fill: '#FFF',
        fontStyle: 'bold'
    });

    // Lógica simple de clic en el logo
    this.input.on('gameobjectdown', (pointer, gameObject) => {
        if (gameObject === logo) {
            score += 10;
            scoreText.setText('Puntuación: ' + score);

            // Mover logo a posición aleatoria y darle velocidad aleatoria
            logo.setPosition(
                Phaser.Math.Between(100, config.width - 100),
                Phaser.Math.Between(100, config.height - 100)
            );
            logo.setVelocity(
                Phaser.Math.Between(-200, 200),
                Phaser.Math.Between(-200, 200)
            );

            // (Opcional) Llamar a la API para guardar puntuación
            // saveScore(score);
        }
    });

     // Ejemplo: Añadir un texto indicativo
    this.add.text(config.width / 2, config.height - 30, 'Haz clic en el logo!', {
        fontSize: '24px',
        fill: '#FF0',
    }).setOrigin(0.5);
}

function update() {
    // Se ejecuta en cada frame (aprox. 60 veces por segundo)
    // Aquí va la lógica continua del juego (movimiento, colisiones complejas, etc.)
    // En este ejemplo simple, no necesitamos mucho aquí.
}

// --- (Opcional) Funciones para interactuar con el Backend ---

/*
// Ejemplo de cómo llamar a una API del backend desde Phaser/JS
async function saveScore(newScore) {
    try {
        // Asume que tienes una ruta /api/score en tu backend Flask
        const response = await fetch('/api/score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ score: newScore }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Puntuación guardada:', result);
        // Podrías mostrar un mensaje de éxito en el juego

    } catch (error) {
        console.error('Error al guardar puntuación:', error);
        // Podrías mostrar un mensaje de error en el juego
    }
}
*/

// --- Descarga Assets de Ejemplo ---
// Necesitas descargar las imágenes 'phaser-logo.png' y 'sky.png'
// Puedes obtenerlas de los ejemplos de Phaser o usar las tuyas.
// Guárdalas en la carpeta `app/static/assets/`
// Ejemplo: Logo -> https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/logos/phaser3-logo.png (renómbrala a phaser-logo.png)
// Ejemplo: Sky -> https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/skies/space3.png (renómbrala a sky.png)