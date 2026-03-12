const Area = document.getElementById("Area");
const DibujarJ = Area.getContext("2d");
const Marcador = document.getElementById("marcador");
const Marcador2 = document.getElementById("marcador2");
const Menus = document.getElementById("menu");
const MensajeTexto = document.getElementById("mensajes");

// Botones
const btnSolo = document.getElementById("btnSolo");
const btnDuo = document.getElementById("btnDuo");

Area.width = 985;
Area.height = 550;
let motor;
let puntos = 0;
let modoDosJugadores = false;
let manzanaDos = false

// CLASES SERPIENTES Y MANZANA
class Serpiente {
    constructor(posicion, radio, color, velocidad, dibujoS, controles) {
        this.posicionInicial = {
            x: posicion.x,
            y: posicion.y
        };
        this.posicion = posicion;
        this.radio = radio;
        this.color = color;
        this.velocidad = velocidad;
        // --------------------
        this.dibujoS = dibujoS;
        this.cuerpo = [];
        this.MaximoTamañocuerpo = 10;
          // --------------------
        this.direccionX = 1;
        this.direccionY = 0;
        this.estaMovimiento = false;
        this.controles = controles; // Guardamos sus teclas
        this.manejo();
    }

    resetear() {
        this.posicion = this.posicionInicial
        this.cuerpo = [];
        this.MaximoTamañocuerpo = 10;
        this.direccionX = 1;
        this.direccionY = 0;
        this.estaMovimiento = false;
        this.velocidad = 1.5; 
        ; 
    }

    dibujarCirculo(x, y, radio, color) {
        this.dibujoS.beginPath();
        this.dibujoS.arc(x, y, radio, 0, 2 * Math.PI);
        this.dibujoS.fillStyle = color;
        this.dibujoS.fill();
        this.dibujoS.closePath();
    }

    dibujarCuerpo() {
        for (let i = 0; i < this.cuerpo.length; i++) {
            let trozo = this.cuerpo[i];
            this.dibujarCirculo(trozo.x, trozo.y, this.radio - 3, this.color);
        }
    }

    dibujarCabeza() {
        this.dibujarCirculo(0, 0, this.radio, this.color);
        this.dibujarCirculo(5, -8, this.radio - 5, "white");
        this.dibujarCirculo(8, - 8, this.radio - 11, "black");
        this.dibujarCirculo(5, 8, this.radio - 5, "white");
        this.dibujarCirculo(8, 8, this.radio - 11, "black");
    }

    dibujarTodoS() {
        this.dibujoS.save();
        this.dibujoS.translate(this.posicion.x, this.posicion.y);
        let angulo = Math.atan2(this.direccionY, this.direccionX);
        this.dibujoS.rotate(angulo);
        this.dibujarCabeza();
        this.dibujoS.restore();
    }

    actualizar() {

        if (this.estaMovimiento) {
            this.cuerpo.push({ x: this.posicion.x, y: this.posicion.y });
        }

        if (this.cuerpo.length > this.MaximoTamañocuerpo) {
            this.cuerpo.shift();
        }

        this.dibujarCuerpo();
        this.dibujarTodoS();

        if (this.estaMovimiento) {
            this.posicion.x += this.direccionX * this.velocidad;
            this.posicion.y += this.direccionY * this.velocidad;
        }

        if (this.posicion.x > Area.width) this.posicion.x = 0;
        else if (this.posicion.x < 0) this.posicion.x = Area.width;

        if (this.posicion.y > Area.height) this.posicion.y = 0;
        else if (this.posicion.y < 0) this.posicion.y = Area.height;

        this.morir();
    }

    manejo() {
        document.addEventListener("keydown", (evt) => {
            const key = evt.key.toLowerCase();
            const keyOriginal = evt.key; // Para las flechas

            if (key === this.controles.w || keyOriginal === this.controles.w) {
                this.estaMovimiento = true; this.direccionX = 0; this.direccionY = -1;
            } else if (key === this.controles.s || keyOriginal === this.controles.s) {
                this.estaMovimiento = true; this.direccionX = 0; this.direccionY = 1;
            } else if (key === this.controles.a || keyOriginal === this.controles.a) {
                this.estaMovimiento = true; this.direccionX = -1; this.direccionY = 0;
            } else if (key === this.controles.d || keyOriginal === this.controles.d) {
                this.estaMovimiento = true; this.direccionX = 1; this.direccionY = 0;
            }
        });
    }

    morir() {
        let seguridad = 20;
        for (let i = 0; i < this.cuerpo.length - seguridad; i++) {
            let distancia = Math.hypot(this.posicion.x - this.cuerpo[i].x, this.posicion.y - this.cuerpo[i].y);
            if (distancia < this.radio) {
                mensajemuerte();
            }
        }
    }
}

class Manzana {
    constructor(posicion, radio, color, dibujoS) {
        this.posicion = posicion;
        this.radio = radio;
        this.color = color;
        this.dibujoS = dibujoS;
    }


    aparece() {
        this.posicion.x = Math.random() * (Area.width - 60) + 30;
        this.posicion.y = Math.random() * (Area.height - 60) + 30;

    }

    dibujarTodoM() {
        this.dibujoS.save();

        // Cuerpo de la Manzana
        this.dibujoS.beginPath();
        this.dibujoS.arc(this.posicion.x, this.posicion.y, this.radio, 0, 2 * Math.PI);
        this.dibujoS.fillStyle = this.color;
        this.dibujoS.fill();
        this.dibujoS.closePath();

        // Tallo (café)
        this.dibujoS.fillStyle = "#5D4037";
        this.dibujoS.fillRect(this.posicion.x - 2, this.posicion.y - this.radio - 4, 4, 8);

        // Brillo blanco para efecto 3D
        this.dibujoS.beginPath();
        this.dibujoS.arc(this.posicion.x - 5, this.posicion.y - 5, this.radio / 3, 0, 2 * Math.PI);
        this.dibujoS.fillStyle = "rgba(255,255,255,0.4)";
        this.dibujoS.fill();
        this.dibujoS.closePath();

        this.dibujoS.restore();
    }


}
// Instancias
const Serpientes1 = new Serpiente({ x: 200, y: 200 }, 15, "#FEBA39", 1.5, DibujarJ, { w: 'w', s: 's', a: 'a', d: 'd' });
const Serpientes2 = new Serpiente({ x: 700, y: 350 }, 15, "#819e0b", 1.5, DibujarJ, {
     w: 'ArrowUp', s: 'ArrowDown', a: 'ArrowLeft', d: 'ArrowRight' });
const Manzanas = new Manzana({ x: 450, y: 290 }, 12, "#F7350C", DibujarJ);
const Manzana2 = new Manzana({ x: 450, y: 290 }, 12, "#0cf72f", DibujarJ);

function marcaDeAgua() {
    DibujarJ.save();
    DibujarJ.font = "bold 80pt Time";
    DibujarJ.fillStyle = "rgba(255, 255, 255, 0.05)";
    DibujarJ.textAlign = "center";
    DibujarJ.translate(Area.width / 2, Area.height / 2);
    DibujarJ.rotate(-Math.PI / 180);
    DibujarJ.fillText("Fifo DAM", 0, 0);
    DibujarJ.restore();
}

function fondo() {
    DibujarJ.fillStyle = "#1B1C30";
    DibujarJ.fillRect(0, 0, Area.width, Area.height);
    for (let i = 0; i < Area.height; i += 80) {
        for (let j = 0; j < Area.width; j += 80) {
            DibujarJ.fillStyle = "#23253C";
            DibujarJ.fillRect(j + 5, i + 5, 70, 70);
        }
    }
}

function comer(serpiente) {
    let distManzana = Math.hypot(serpiente.posicion.x - Manzanas.posicion.x, serpiente.posicion.y - Manzanas.posicion.y);
    if (distManzana < serpiente.radio + Manzanas.radio) {
        Manzanas.aparece();
        serpiente.MaximoTamañocuerpo += 10;
        serpiente.velocidad += 0.1;
        puntos += 10;
        Marcador2.innerText = "Puntos: " + puntos;
    }
}

function comerManzana2(serpiente) {
    let distManzana2 = Math.hypot(serpiente.posicion.x - Manzana2.posicion.x, serpiente.posicion.y - Manzana2.posicion.y);
    if (distManzana2 < serpiente.radio + Manzana2.radio) {
        Manzana2.aparece();
        serpiente.MaximoTamañocuerpo += 10;
        serpiente.velocidad += 0.1;
        puntos += 10;
        Marcador.innerText = "Puntos: " + puntos;
    }
}

function restarManzana2(serpiente) {
    let distManzana2 = Math.hypot(serpiente.posicion.x - Manzana2.posicion.x, serpiente.posicion.y - Manzana2.posicion.y);
    if (distManzana2 < serpiente.radio + Manzana2.radio) {
        Manzana2.aparece();
        serpiente.MaximoTamañocuerpo += 10;
        serpiente.velocidad += 0.1;
        puntos -= 10;
        Marcador2.innerText = "Puntos: " + puntos;
    }
}


function comenzar(multiplayer) {
    modoDosJugadores = multiplayer;
    Menus.style.display = "none";
    puntos = 0;
    Marcador2.style.display = "block";
    Marcador.innerText = "Puntos: 0";
    Serpientes1.resetear();
    Serpientes2.resetear();
    Manzanas.aparece();
    Manzana2.aparece();
    if (!motor) actualizar();
}

// colision entre los dos jugadores
function colisiones(serpienteA, serpienteB) {
   
    for (let i = 0; i < serpienteB.cuerpo.length; i++) {
        let distancia = Math.hypot(
            serpienteA.posicion.x - serpienteB.cuerpo[i].x, 
            serpienteA.posicion.y - serpienteB.cuerpo[i].y
        );
        
        if (distancia < serpienteA.radio) {
            mensajemuerte();
        }
    }
}

function actualizar() {
    fondo();
    marcaDeAgua();
    Marcador.style.display ="none";
    
    Manzanas.dibujarTodoM();
    
   
    Serpientes1.actualizar();
    comer(Serpientes1);

    // LÓGICA PARA EL MODO 2 JUGADORES
    if (modoDosJugadores) {
        // 1. Solo dibujamos la manzana verde si hay dos jugadores
        Manzana2.dibujarTodoM(); 
        Marcador.style.display ="block";
        // 2. Solo comprobamos si la comen si hay dos jugadores
        comerManzana2(Serpientes2); // El J1 también puede comer la verde en este modo
        
        // 3. Actuamos sobre la segunda serpiente
        Serpientes2.actualizar();
               
        comerManzana2(Serpientes2); // J2 come verde
        
        
        restarManzana2(Serpientes1); // J1 come verde resta punto 

        //Cuando colisiona el Jugador 1 con jugador 2
        colisiones(Serpientes1, Serpientes2);
        // Cuando choca el jugador 2 con el jugador 1 
        colisiones(Serpientes2, Serpientes1);
    }

    motor = requestAnimationFrame(actualizar);
}

function mensajemuerte() {
    cancelAnimationFrame(motor);
    motor = null;
    Menus.style.display = "flex";

if (modoDosJugadores === true) {
        document.getElementById("mensajes").innerText = "Fifo y su amigo murieron";
    } else {
        document.getElementById("mensajes").innerText = "Fifo murió :(";
    }
   
}

// Eventos
btnSolo.onclick = () => comenzar(false);
btnDuo.onclick = () => comenzar(true);