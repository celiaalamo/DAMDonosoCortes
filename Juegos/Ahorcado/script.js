const wordContainer = document.getElementById('wordContainer');
const startButton = document.getElementById('startButton');
const usedLettersElement = document.getElementById('usedLetters');
const usedLettersContainer = document.querySelector('.used-letters-container');
const gameMessage = document.getElementById('gameMessage');
const exitAction = document.getElementById('exitAction');
const helpButton = document.getElementById('helpButton');
const vaquero = document.querySelector('.vaquero');

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

// Cuerpecito del muñeco
const bodyParts = [
  [4, 2, 1, 1], // Cabeza
  [4, 3, 1, 2],
  [3, 5, 1, 1],
  [5, 5, 1, 1],
  [3, 3, 1, 1],
  [5, 3, 1, 1]
];

let selectedWord;
let usedLetters;
let mistakes;
let hits;
let score = 0; // Para la puntuación, inicial
let helpCooldown = false; // Para que el jugador solo pueda pedir una letra cada x tiempo
let helpUses = 3;
let currentHint = "";

const scoreDisplay = document.getElementById('scoreDisplay');

const updateScore = () => {
  scoreDisplay.innerHTML = `Puntuación: ${score}`;
};

const addLetter = letter => {
  const letterElement = document.createElement('span');
  letterElement.innerHTML = letter.toUpperCase();
  usedLettersElement.appendChild(letterElement);
}

// Dibuja una parte del ahorcado
const addBodyPart = bodyPart => {
  ctx.fillStyle = '#fff';
  ctx.fillRect(...bodyPart);
}

// Dibuja siguiente parte del ahorcado cuando fallas
const wrongLetter = () => {
  addBodyPart(bodyParts[mistakes]);
  mistakes++;

  if (mistakes === bodyParts.length) {
    ctx.clearRect(4, 2, 1, 1); // Borrando cabecita

    drawSkull(); // Dibujando nueva cabecita

    endGame(false);
  }
};

const drawSkull = () => {
  ctx.save(); // Guarda el estado actual

  ctx.font = "1.5px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText("💀", 4.5, 2.5); // Para centrar la cabecita
  ctx.restore();
};

// Termina el juego
const endGame = (won) => {
  document.removeEventListener('keydown', letterEvent);
  startButton.style.display = 'block';
  usedLettersContainer.style.display = 'none';
  helpButton.style.display = 'none'; // Para que se oculte el botón de ayuda cuando el juego termina

  scoreDisplay.style.display = 'none';

  if (won === true) {
    score += 10; // Para la puntuación
    updateScore(); // Recoge puntuación **************
    gameMessage.innerHTML = "🎉 ¡Felicidades! Has impedido que Isaac diga <strong>GAME OVER</strong> a la vida 🎮";

  } else if (won === false) {
    gameMessage.innerHTML = `💀 ¡Oh no!... Isaac ha visto la pantalla de GAME OVER. Press F para respetos.<br>Puntuación final: ${score}`;
    updateScore();

  } else {
    gameMessage.innerHTML = "😞 Has salido del juego... Isaac seguirá esperando en el menú principal.";
    score = 0;
    updateScore();
  }
};

const correctLetter = letter => {
  const { children } = wordContainer;

  for (let i = 0; i < children.length; i++) {
    if (children[i].innerHTML === letter) {
      children[i].classList.toggle('hidden');
      hits++;
    }
  }

  if (hits === selectedWord.length) {
    endGame(true);
  }
}


const giveHelpLetter = () => {
  if (helpCooldown) return;
  if (helpUses <= 0) return; /* Para ayuda limitada*/

  const hiddenLetters = selectedWord.filter(l => !usedLetters.includes(l));

  if (hiddenLetters.length === 0) return;

  helpUses--;
  const hearts = "❤️".repeat(helpUses);
  helpButton.innerText = hearts; /* Reduciendo contador*/

  /* Si ya no quedan Ayudas, desactivar botón*/
  if (helpUses === 0) {
    helpButton.disabled = true; /* Desactivar cuando contador llegue a 0*/
  }

  helpCooldown = true;
  helpButton.disabled = true;

  setTimeout(() => {
    helpCooldown = false;

    if (helpUses > 0) helpButton.disabled = false;
  }, 5000);

  // Elegir letra de manera aleatoria
  const randomLetter = hiddenLetters[Math.floor(Math.random() * hiddenLetters.length)];

  // Evitar que pedir ayuda cause un endGame accidental
  if (!selectedWord.includes(randomLetter)) {
    /* Si la letra aleatoria no está, no llamamos a wrongLetter()*/
    /* Solo la añadimos como usada para evitar repetirla*/
    addLetter(randomLetter);
  } else {
    letterInput(randomLetter);
  }

  /* Puntos perdidos por ayuda*/
  score -= 2;

  updateScore();
};

helpButton.addEventListener('click', giveHelpLetter); // Evento del botón de ayuda



const letterInput = letter => {
  if (usedLetters.includes(letter)) return; // Para no repetir letras, añadida

  // Registrar letras utilizadas
  usedLetters.push(letter);
  addLetter(letter);

  // Comparar sí es la letra correcta o no

  if (selectedWord.includes(letter)) {
    correctLetter(letter);
  } else {
    wrongLetter(); // añadida para probar
  }


} // C: ;

// Comprobación por teclado
const letterEvent = event => {
  let newLetter = event.key.toUpperCase();
  if (newLetter.match(/^[a-zñ]$/i) && !usedLetters.includes(newLetter)) {
    letterInput(newLetter);
  };
};

// Dibujar palabra
const drawWord = () => {
  selectedWord.forEach(letter => {
    const letterElement = document.createElement('span');
    letterElement.innerHTML = letter.toUpperCase();
    letterElement.classList.add('letter');
    letterElement.classList.add('hidden');
    wordContainer.appendChild(letterElement);
  });
};


// Seleccionar palabra de forma aleatoria
const selectRandomWord = () => {
  const random = words[Math.floor(Math.random() * words.length)];
  selectedWord = random.word.toUpperCase().split('');
  currentHint = random.hint; /* Para las pistas*/
};

// Dibujando el poste para ahorcar
const drawHangMan = () => {
  ctx.setTransform(1, 0, 0, 1, 0, 0); /* Para resetear el tamaño de la palabra a adivinar*/

  canvas.width = 300;
  canvas.height = 300;

  ctx = canvas.getContext('2d');

  ctx.scale(20, 20); /* Para aplicar escala solo una vez por cada partida*/

  /* Dibujando el poste
  ctx.fillStyle = '#d95d39';
  ctx.fillRect(0, 7, 4, 1);
  ctx.fillRect(1, 0, 1, 8);
  ctx.fillRect(2, 0, 3, 1);
  ctx.fillRect(4, 1, 1, 1);  */ // 4 OCULTAR ESTO

  drawMenuImage(); // 1
};

// 2 TODA LA CONSTANTE
const drawMenuImage = () => {
  const img = new Image();
  img.src = "vaquero.png";

  img.onload = () => {
    // Recuerda: tu canvas está escalado x20, así que usa unidades pequeñas
    ctx.drawImage(img, 0, 3, 15, 9.3);
  };
}; // FIN CONSTANTE

// 6 metodo nuevo
const drawHangManGame = () => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  canvas.width = 120;
  canvas.height = 160;

  ctx = canvas.getContext('2d');
  ctx.scale(20, 20);

  // Poste
  ctx.fillStyle = '#d95d39';
  ctx.fillRect(0, 7, 4, 1);
  ctx.fillRect(1, 0, 1, 8);
  ctx.fillRect(2, 0, 3, 1);
  ctx.fillRect(4, 1, 1, 1);
}; // Termina metodo

// Iniciar juego
const startGame = () => {
  usedLetters = [];
  mistakes = 0;
  hits = 0;

  /* Limpiar la palabra anterior */
  while (wordContainer.firstChild) {
    wordContainer.removeChild(wordContainer.firstChild);
  }

  usedLettersElement.innerHTML = '';

  scoreDisplay.style.display = 'block';

  // Asegurar que el contenedor está visible y limpio siempre (Por tema de pedir ayuda)
  wordContainer.style.display = 'flex';
  usedLettersContainer.style.display = 'block';
  helpButton.style.display = 'block';
  canvas.style.display = 'block';
  vaquero.style.display = 'none';

  if (gameMessage.innerHTML.includes("Puntuación final")) {
    score = 0;
    updateScore();
  }

  /* Limpiar mensaje */
  gameMessage.innerHTML = '';

  /* Ocultando botón start*/
  startButton.style.display = 'none';
  usedLettersContainer.style.display = 'block';
  helpButton.style.display = 'block';

  /* Reiniciar las Ayudas*/
  helpUses = 3;
  helpButton.disabled = false;
  helpButton.innerText = '❤️❤️❤️';

  drawHangManGame(); // Dibujar Poste // 5 agregar Game
  selectRandomWord(); // Seleccionar palabra y pista
  gameMessage.innerHTML = `Pista: ${currentHint}`; // Mostrar Pista pero después de seleccionar la palabra
  drawWord(); //Dibujar las barritas _
  updateScore(); //Actualizar la puntuación

  // Teclado
  document.addEventListener('keydown', letterEvent);
};

startButton.addEventListener('click', startGame);

/* Botón salir */
exitAction.addEventListener('click', () => {
  document.removeEventListener('keydown', letterEvent);

  /* Limpiar palabra y letras utilizadas */
  while (wordContainer.firstChild) {
    wordContainer.removeChild(wordContainer.firstChild);
  }

  usedLettersElement.innerHTML = '';

  /* Limpiar canvas */
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Mensaje de salida
  gameMessage.innerHTML = `😞 Has salido del juego... Isaac seguirá esperando en el menú principal.<br>Puntuación final: ${score}`;

  /* Ocultar el marcador permanente de la puntuación */
  scoreDisplay.style.display = 'none';

  /* Resetear puntuación */
  score = 0;

  // Mostrar START y ocultar ayuda y letras usadas
  startButton.style.display = 'block';
  usedLettersContainer.style.display = 'none';
  helpButton.style.display = 'none';
  canvas.style.display = 'none';
  vaquero.style.display = 'block';
});

// 3 LLAMAR
window.onload = () => {
  drawHangMan();
};