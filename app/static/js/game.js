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
            debug: false       // Poner a true para ver cajas de colisión, etc.
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

// Variables globales
let score = 0;
let scoreText;
let logo;

// Variable para controlar la velocidad máxima del logo
let maxLogoVelocity = 200; // Velocidad inicial máxima

// --- NUEVAS Variables para el temporizador y el mensaje ---
let inactivityTimer; // Variable para guardar la referencia al temporizador
let inactivityMessageText = null; // Variable para guardar la referencia al texto del mensaje

// --- Funciones de la Escena de Phaser ---

function preload() {
    // Cargar assets (imágenes, spritesheets, audio, etc.)
    this.load.image('logo', '/static/main/assets/phaser-logo.png'); // Ruta relativa a la raíz web
    this.load.image('sky', '/static/main/assets/sky.png'); // Ejemplo fondo
}

function create() {
    // Se ejecuta una vez después de preload

    // Añadir imagen de fondo
    this.add.image(config.width / 2, config.height / 2, 'sky');

    this.input.setDefaultCursor('url(/static/main/assets/martillo.png), pointer');

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

    // --- Iniciar el temporizador de inactividad la primera vez ---
    startInactivityTimer.call(this); // Llamamos a la función y le pasamos el contexto de la escena ('this')


    // Lógica simple de clic en el logo
    this.input.on('gameobjectdown', (pointer, gameObject) => {
        if (gameObject === logo) {
            // --- Reiniciar el temporizador de inactividad en cada click ---
            startInactivityTimer.call(this); // Llamamos a la función para resetear el timer

            // Si el mensaje de inactividad estaba visible, lo ocultamos
            if (inactivityMessageText) {
                inactivityMessageText.setVisible(false);
                // Opcional: Si quieres que desaparezca permanentemente hasta el próximo timeout, podrías destruirlo:
                // inactivityMessageText.destroy();
                // inactivityMessageText = null;
            }

            // --- Lógica existente para score, shrink, speed ---
            score += 10;
            scoreText.setText('Puntuación: ' + score);

            // Reducir el tamaño del logo permanentemente con cada click
            logo.setScale(logo.scale * 0.9); // Multiplica la escala actual por 0.9 (reduce en 10%)

            // Aumentar la velocidad máxima permitida permanentemente
            maxLogoVelocity += 20; // Aumenta la velocidad máxima en 20 unidades/segundo cada click

            // Mover logo a posición aleatoria y darle *nueva* velocidad aleatoria usando el max actualizado
            logo.setPosition(
                Phaser.Math.Between(100, config.width - 100),
                Phaser.Math.Between(100, config.height - 100)
            );
            // Usamos la nueva maxLogoVelocity para establecer el rango de velocidad
            logo.setVelocity(
                Phaser.Math.Between(-maxLogoVelocity, maxLogoVelocity),
                Phaser.Math.Between(-maxLogoVelocity, maxLogoVelocity)
            );

            // --- FIN Lógica existente ---

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
    // Se ejecuta en cada frame
    // En este ejemplo simple, no necesitamos mucho aquí.
}

// --- NUEVA Función para iniciar/reiniciar el temporizador ---
function startInactivityTimer() {
    // Si ya existe un temporizador, lo removemos antes de crear uno nuevo
    if (inactivityTimer) {
        inactivityTimer.remove();
    }

    // Creamos un nuevo temporizador
    inactivityTimer = this.time.addEvent({
        delay: 10000, // 60000 milisegundos = 1 minuto
        callback: showInactivityMessage, // La función que se llamará cuando el tiempo expire
        callbackScope: this, // Asegura que 'this' dentro de showInactivityMessage sea la escena
        repeat: 0 // 0 significa que se ejecutará una sola vez
    });
}

// --- NUEVA Función para mostrar el mensaje de inactividad ---
function showInactivityMessage() {
    // Solo creamos el texto si no existe ya
    if (inactivityMessageText === null) {
         inactivityMessageText = this.add.text(config.width / 2, config.height / 2, 'ya no puedes seguir?\njejejejeje', { // Añadimos \n para salto de línea
            fontSize: '48px',
            fill: '#FF0000', // Rojo para que se vea bien
            fontStyle: 'bold',
            align: 'center', // Centra el texto si tiene múltiples líneas
            wordWrap: { width: config.width * 0.8, useAdvancedWrap: true } // Ajuste de línea si es necesario
        }).setOrigin(0.5); // Centra el origen del texto en el centro del lienzo
    } else {
        // Si el texto ya existía (y quizás estaba oculto), lo hacemos visible
        inactivityMessageText.setVisible(true);
    }

    // Opcional: Podrías detener el movimiento del logo o pausar el juego aquí
    // logo.body.setVelocity(0);
    // this.physics.pause(); // Pausa todo el motor de físicas
}


// --- (Opcional) Funciones para interactuar con el Backend ---
/* ... (el resto del código saveScore si lo tienes) ... */

// --- Descarga Assets de Ejemplo ---
/* ... (los comentarios sobre los assets) ... */