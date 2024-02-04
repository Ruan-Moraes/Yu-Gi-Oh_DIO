const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.querySelector('#score_points'),
  },
  cardSprites: {
    avatar: document.querySelector('#card-image'),
    name: document.querySelector('#card-name'),
    type: document.querySelector('#card-type'),
  },
  fieldCards: {
    player: document.querySelector('#player-field-card'),
    computer: document.querySelector('#computer-field-card'),
  },
  playerSides: {
    player: 'player-cards',
    playerBox: document.querySelector('#player-cards'),
    computer: 'computer-cards',
    computerBox: document.querySelector('#computer-cards'),
  },
  actions: {
    button: document.querySelector('#next-duel'),
  },
};

const pathImages = './src/assets/icons';

const cardDate = [
  {
    id: 0,
    name: 'Blue Eyes White Dragon',
    type: 'Paper',
    img: `${pathImages}/dragon.png`,
    winOf: [1],
    loseOf: [2],
  },
  {
    id: 1,
    name: 'Dark Magician',
    type: 'Rock',
    img: `${pathImages}/magician.png`,
    winOf: [2],
    loseOf: [0],
  },
  {
    id: 2,
    name: 'Exodia',
    type: 'Scissors',
    img: `${pathImages}/exodia.png`,
    winOf: [0],
    loseOf: [1],
  },
];

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardDate.length);
  return cardDate[randomIndex].id;
}

async function createCardImage(idCard, fieldSide) {
  const cardImage = document.createElement('img');
  cardImage.setAttribute('height', '150px');
  cardImage.setAttribute('src', './src/assets/icons/card-back.png');
  cardImage.setAttribute('data-id', idCard);
  cardImage.classList.add('card');

  if (fieldSide === state.playerSides.player) {
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

async function drawCardsInField(cardId, computerCardId) {
  state.fieldCards.player.src = cardDate[cardId].img;
  state.fieldCards.computer.src = cardDate[computerCardId].img;
}

async function hiddenCardDetails() {
  state.cardSprites.avatar.src = '';
  state.cardSprites.name.innerText = '';
  state.cardSprites.type.innerText = '';
}

async function showHiddenCardFieldsImages(value) {
  if (value === true) {
    state.fieldCards.player.style.display = 'block';
    state.fieldCards.computer.style.display = 'block';
  }

  if (value === false) {
    state.fieldCards.player.style.display = 'none';
    state.fieldCards.computer.style.display = 'none';
  }
}

async function updateScore() {
  state.score.scoreBox.innerHTML = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function drawButton(text) {
  state.actions.button.innerText = String(text).toUpperCase();
  state.actions.button.style.display = 'block';
}

async function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = 'DRAW';

  const playerCard = cardDate[playerCardId];

  if (playerCard.winOf.includes(computerCardId)) {
    duelResults = 'win';
    state.score.playerScore++;
  }

  if (playerCard.loseOf.includes(computerCardId)) {
    duelResults = 'lose';
    state.score.computerScore++;
  }

  await playAudio(duelResults);

  return duelResults;
}

async function removeAllCardsImage() {
  let cards = state.playerSides.computerBox;
  let imgElements = cards.querySelectorAll('img');
  imgElements.forEach((img) => {
    img.remove();
  });

  cards = state.playerSides.playerBox;
  imgElements = cards.querySelectorAll('img');
  imgElements.forEach((img) => {
    img.remove();
  });
}

async function drawSelectCard(index) {
  state.cardSprites.avatar.src = cardDate[index].img;
  state.cardSprites.name.innerText = cardDate[index].name;
  state.cardSprites.type.innerText = `Attibute ${cardDate[index].type}`;
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.querySelector(`#${fieldSide}`).appendChild(cardImage);
  }
}

async function resetDuel() {
  state.cardSprites.avatar.src = '';
  state.actions.button.style.display = 'none';

  state.fieldCards.player.style.display = 'none';
  state.fieldCards.computer.style.display = 'none';

  init();
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  try {
    audio.play();
  } catch {}
}

function init() {
  showHiddenCardFieldsImages(false);

  drawCards(5, state.playerSides.player);
  drawCards(5, state.playerSides.computer);

  const bgm = document.querySelector('#bgm');
  bgm.play();
}

init();
