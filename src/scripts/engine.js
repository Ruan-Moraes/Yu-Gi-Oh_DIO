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
    computer: document.querySelector('computer-field-card'),
  },
  actions: {
    button: document.querySelector('#next-duel'),
  },
};

const playerSides = {
  player1: 'player-cards',
  computer: 'computer-cards',
};

const pathImages = '.src/assets/icons';

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

  if (fieldSide === playerSides.player1) {
    cardImage.addEventListener('click', () => {
      setCardsField(cardImage.getAttribute('data-id'));
    });
  }

  cardImage.addEventListener('mouseover', () => {
    drawSelectCard(idCard);
  });

  return cardImage;
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.querySelector(`#${fieldSide}`).appendChild(cardImage);
  }
}

(function init() {
  drawCards(5, playerSides.player1);
  drawCards(5, playerSides.computer);
})();
