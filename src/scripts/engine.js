const gameStatus = {
  gameScore: {
    pointsTable: document.querySelector('#pointsTable'),
    playerPoints: 0,
    computerPoints: 0,
  },
  cardDetails: {
    cardImage: document.querySelector('#cardImage'),
    cardName: document.querySelector('#cardName'),
    cardType: document.querySelector('#cardType'),
  },
  duelingMat: {
    playerField: document.querySelector('#playerField'),
    computerField: document.querySelector('#computerField'),
  },
  playersDeck: {
    player: 'playerCards',
    computer: 'computerCards',
    playerCards: document.querySelector('#playerCards'),
    computerCards: document.querySelector('#computerCards'),
  },
  actions: {
    button: document.querySelector('#next-duel'),
  },
};

const cardDate = [
  {
    id: 0,
    name: 'Blue Eyes White Dragon',
    type: 'Paper',
    img: `./src/assets/icons/dragon.png`,
    winOf: [1],
    loseOf: [2],
  },
  {
    id: 1,
    name: 'Dark Magician',
    type: 'Rock',
    img: `./src/assets/icons/magician.png`,
    winOf: [2],
    loseOf: [0],
  },
  {
    id: 2,
    name: 'Exodia',
    type: 'Scissors',
    img: `./src/assets/icons/exodia.png`,
    winOf: [0],
    loseOf: [1],
  },
];

function createCardImage(idCard, fieldSide) {
  const cardImage = document.createElement('img');
  cardImage.setAttribute('height', '150px');
  cardImage.setAttribute('src', './src/assets/icons/card-back.png');
  cardImage.setAttribute('data-id', idCard);
  cardImage.classList.add('card');

  if (fieldSide === gameStatus.playersDeck.player) {
    cardImage.addEventListener('mouseover', () => {
      drawSelectCard(idCard);
    });

    cardImage.addEventListener('click', () => {
      setCardsField(cardImage.getAttribute('data-id'));
    });
  }

  return cardImage;
}

async function setCardsField(cardId) {
  await removeAllCardsImage();

  const computerCardId = await getRandomCardId();

  await showHiddenCardFieldsImages(true);

  await hiddenCardDetails();

  drawCardsInField(cardId, computerCardId);

  const duelResults = await checkDuelResults(cardId, computerCardId);

  await updateScore();
  await drawButton(duelResults);
}

function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardDate.length);

  return cardDate[randomIndex].id;
}

function drawCardsInField(cardId, computerCardId) {
  gameStatus.duelingMat.playerField.src = cardDate[cardId].img;
  gameStatus.duelingMat.computerField.src = cardDate[computerCardId].img;
}

function hiddenCardDetails() {
  gameStatus.cardDetails.cardImage.src = '';
  gameStatus.cardDetails.cardName.innerText = '';
  gameStatus.cardDetails.cardType.innerText = '';
}

function showHiddenCardFieldsImages(value) {
  if (value === true) {
    gameStatus.duelingMat.playerField.style.display = 'block';
    gameStatus.duelingMat.computerField.style.display = 'block';
  }

  if (value === false) {
    gameStatus.duelingMat.playerField.style.display = 'none';
    gameStatus.duelingMat.computerField.style.display = 'none';
  }
}

function updateScore() {
  gameStatus.gameScore.pointsTable.innerHTML = `Win: ${gameStatus.gameScore.playerPoints} | Lose: ${gameStatus.gameScore.computerPoints}`;
}

function drawButton(text) {
  gameStatus.actions.button.innerText = String(text).toUpperCase();
  gameStatus.actions.button.style.display = 'block';
}

async function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = 'DRAW';

  const playerCard = cardDate[playerCardId];

  if (playerCard.winOf.includes(computerCardId)) {
    duelResults = 'win';
    gameStatus.gameScore.playerPoints++;
  }

  if (playerCard.loseOf.includes(computerCardId)) {
    duelResults = 'lose';
    gameStatus.gameScore.computerPoints++;
  }

  await playAudio(duelResults);

  return duelResults;
}

function removeAllCardsImage() {
  let cards = gameStatus.playersDeck.computerCards;
  let imgElements = cards.querySelectorAll('img');
  imgElements.forEach((img) => {
    img.remove();
  });

  cards = gameStatus.playersDeck.playerCards;
  imgElements = cards.querySelectorAll('img');
  imgElements.forEach((img) => {
    img.remove();
  });
}

function drawSelectCard(index) {
  gameStatus.cardDetails.cardImage.src = cardDate[index].img;
  gameStatus.cardDetails.cardName.innerText = cardDate[index].name;
  gameStatus.cardDetails.cardType.innerText = `Attibute ${cardDate[index].type}`;
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.querySelector(`#${fieldSide}`).appendChild(cardImage);
  }
}

function resetDuel() {
  gameStatus.cardDetails.cardImage.src = '';
  gameStatus.actions.button.style.display = 'none';

  gameStatus.duelingMat.playerField.style.display = 'none';
  gameStatus.duelingMat.computerField.style.display = 'none';

  init();
}

function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  
  try {
    audio.play();
  } catch (err) {
    console.error(err);
  }
}

function init() {
  showHiddenCardFieldsImages(false);

  drawCards(5, gameStatus.playersDeck.player);
  drawCards(5, gameStatus.playersDeck.computer);

  const bgm = document.querySelector('#bgm');
  bgm.play();
}

init();
