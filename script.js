let boardSize = 6;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let totalClicks = 0; 

const gameBoard = document.getElementById('game-board');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');

// Read images from the hidden pool in HTML
function getImagesFromHTML() {
  const images = [];
  document.querySelectorAll('#image-pool img').forEach(img => {
    images.push(img.src);
  });
  return images;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createBoard() {
  gameBoard.innerHTML = '';
  message.textContent = '';
  matchedPairs = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  totalClicks = 0; 

  let images = getImagesFromHTML();
  if (images.length !== 18) {
    message.textContent = "Error: Please provide exactly 18 images in the HTML!";
    return;
  }
  let cardImages = images.concat(images);
  cardImages = shuffle(cardImages);

  for (let i = 0; i < boardSize * boardSize; i++) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.image = cardImages[i];
    card.dataset.index = i;

    const img = document.createElement('img');
    img.src = cardImages[i];
    img.alt = "memory";
    card.appendChild(img);

    card.addEventListener('click', onCardClick);
    gameBoard.appendChild(card);
  }
}

function onCardClick(e) {
  const card = e.currentTarget;
  if (lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) {
    return;
  }

  totalClicks++; 

  card.classList.add('flipped');

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;

  if (firstCard.dataset.image === secondCard.dataset.image) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedPairs++;
    if (matchedPairs === 18) {
      message.textContent = `🎉 You Won in ${totalClicks} clicks! 🎉`; // Show click count
    }
    resetFlipped();
  } else {
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetFlipped();
    }, 900);
  }
}

function resetFlipped() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

restartBtn.addEventListener('click', createBoard);

createBoard();
