import { DECK } from "./DECK.js";

const app = document.querySelector(".app");
const gameOverOverlay = document.querySelector(".game-over");
const slot1 = document.querySelector(".slot1");
const slot2 = document.querySelector(".slot2");
const slot3 = document.querySelector(".slot3");
const slot4 = document.querySelector(".slot4");
const healthDisplay = document.querySelector(".health");
const defenceDisplay = document.querySelector(".defence");
const staminaDisplay = document.querySelector(".stamina");
const actionButton = document.querySelector(".action-button");

const CARDS_IN_WAVE = 4;
const MAX_HEALTH = 21;

const playableDeck = makeDeckPlayable(DECK);
const shuffledDeck = shuffle([...playableDeck]);

const initialwave = shuffledDeck.slice(0, 4);
const initialDrawPile = shuffledDeck.slice(4);

const initialState = {
  drawPile: [...initialDrawPile],
  wave: [...initialwave],
  health: MAX_HEALTH,
  strength: 0,
  durability: 0,
};

let state = { ...initialState };

function drawGame(state) {
  const canEvade = state.wave.filter((card) => card.played).length > 2;
  const canRestart = state.health === 0;

  if (state.wave[0]) {
    slot1.children[0].src = state.wave[0].img;
    slot1.dataset.buttonType = state.wave[0].suite;
    slot1.dataset.value = state.wave[0].value;
    slot1.dataset.suite = state.wave[0].suite;
    slot1.dataset.rank = state.wave[0].rank;
    slot1.disabled = state.wave[0].played;
  } else {
    slot1.children[0].src = "images/empty-slot.jpg";
  }

  if (state.wave[1]) {
    slot2.children[0].src = state.wave[1].img;
    slot2.dataset.buttonType = state.wave[1].suite;
    slot2.dataset.value = state.wave[1].value;
    slot2.dataset.suite = state.wave[1].suite;
    slot2.dataset.rank = state.wave[1].rank;
    slot2.disabled = state.wave[1].played;
  } else {
    slot2.children[0].src = "images/empty-slot.jpg";
  }

  if (state.wave[2]) {
    slot3.children[0].src = state.wave[2].img;
    slot3.dataset.buttonType = state.wave[2].suite;
    slot3.dataset.value = state.wave[2].value;
    slot3.dataset.suite = state.wave[2].suite;
    slot3.dataset.rank = state.wave[2].rank;
    slot3.disabled = state.wave[2].played;
  } else {
    slot3.children[0].src = "images/empty-slot.jpg";
  }

  if (state.wave[3]) {
    slot4.children[0].src = state.wave[3].img;
    slot4.dataset.buttonType = state.wave[3].suite;
    slot4.dataset.value = state.wave[3].value;
    slot4.dataset.suite = state.wave[3].suite;
    slot4.dataset.rank = state.wave[3].rank;
    slot4.disabled = state.wave[3].played;
  } else {
    slot4.children[0].src = "images/empty-slot.jpg";
  }

  if (canEvade || canRestart) {
    actionButton.classList.remove("disabled");
  } else {
    actionButton.classList.add("disabled");
  }
  actionButton.innerHTML = state.health > 0 ? "Move on" : "Restart";
  actionButton.dataset.buttonType = state.health > 0 ? "evade" : "restart";

  // Only update if needed
  if (state.previousState) {
    if (state.previousState.health !== state.health) {
      healthDisplay.innerHTML = state.health;
    }
    if (state.previousState.strength !== state.strength) {
      defenceDisplay.innerHTML = state.strength;
    }
    if (state.previousState.durability !== state.durability) {
      staminaDisplay.innerHTML = state.durability;
    }
  } else {
    healthDisplay.innerHTML = state.health;
    defenceDisplay.innerHTML = state.strength;
    staminaDisplay.innerHTML = state.durability;
  }

  state.health === 0
    ? (gameOverOverlay.style.display = "flex")
    : (gameOverOverlay.style.display = "none");
}

function makeDeckPlayable(array) {
  return array.map((item) => {
    return { ...item, played: false };
  });
}

function shuffle(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

function drawCards(deck, numberOfCards) {
  return [...deck.slice(0, numberOfCards)];
}

function getStrenghtAfterEnemyStrike(
  enemyStrength,
  currentStrength,
  brawlerDurability
) {
  if (enemyStrength >= brawlerDurability) return 0;
  return currentStrength;
}

function getDurabilityAfterEnemyStrike(
  enemyStrength,
  brawlerStrenght,
  brawlerDurability
) {
  if (brawlerStrenght === 0) return 0;
  if (brawlerDurability === 0) return enemyStrength - 1;
  if (enemyStrength >= brawlerDurability) return 0;
  if (enemyStrength < brawlerDurability) return enemyStrength - 1;
  return brawlerDurability;
}

function setCardToPlayed(wave, indexOfSelectedCard) {
  return wave.map((card, index) => {
    if (index === indexOfSelectedCard) {
      return { ...card, played: true };
    } else {
      return { ...card };
    }
  });
}

function getUpdatedWave(wave, indexOfSelectedCard) {
  const updatedWave = setCardToPlayed(wave, indexOfSelectedCard);
  const allCardsInwavePlayed =
    updatedWave.filter((card) => {
      return card.played === true;
    }).length === CARDS_IN_WAVE;
  if (allCardsInwavePlayed) {
    return [...drawCards(state.drawPile, 4)];
  } else {
    return updatedWave;
  }
}

function getCardIndex(wave, action) {
  return wave.findIndex(
    (card) => card.suite === action.type && card.rank === action.rank
  );
}

function isAllCardsInwavePlayed(wave) {
  return (
    wave.filter((card) => {
      return card.played === true;
    }).length ===
    CARDS_IN_WAVE - 1
  );
}

function getDamage(brawlerStrength, opponentStrength) {
  if (opponentStrength > brawlerStrength)
    return opponentStrength - brawlerStrength;
  return 0;
}

function getUpdatedDrawpile(wave, drawPile) {
  return isAllCardsInwavePlayed(wave) ? [...drawPile.slice(4)] : drawPile;
}

function getUpdatedDrawpileWhenEvade(wave) {
  return isAllCardsInwavePlayed(wave)
    ? [...state.drawPile.slice(4)]
    : putBackUnusedCards(wave);
}

function getHealthAfterEnemyStrike(health, brawlerStrength, opponentStrength) {
  if (health - getDamage(brawlerStrength, opponentStrength) < 0) return 0;
  return health - getDamage(brawlerStrength, opponentStrength);
}

function putBackUnusedCards(wave) {
  const cards = wave.filter((card) => {
    return card.played !== true;
  });
  return [...state.drawPile, ...cards].slice(4);
}

function getUpdatedHealthAfterPickingAHealth(incoming, current) {
  // TODO: add logic for not being able to pick to hearts in a row
  if (current + incoming > 21) return 21;
  return current + incoming;
}

function updatestate(action) {
  const currentCardValue = Number(action.value);
  switch (action.type) {
    case "♣":
    case "♠":
    case "★":
      return {
        ...state,
        previousState: state,
        drawPile: getUpdatedDrawpile(state.wave, state.drawPile),
        health: getHealthAfterEnemyStrike(
          state.health,
          state.strength,
          currentCardValue
        ),
        strength: getStrenghtAfterEnemyStrike(
          currentCardValue,
          state.strength,
          state.durability
        ),
        durability: getDurabilityAfterEnemyStrike(
          currentCardValue,
          state.strength,
          state.durability
        ),
        wave: getUpdatedWave(state.wave, getCardIndex(state.wave, action)),
      };
    case "♥":
      return {
        ...state,
        previousState: state,
        drawPile: getUpdatedDrawpile(state.wave, state.drawPile),
        health: getUpdatedHealthAfterPickingAHealth(
          currentCardValue,
          state.health
        ),
        wave: getUpdatedWave(state.wave, getCardIndex(state.wave, action)),
      };
    case "♦":
      return {
        ...state,
        previousState: state,
        drawPile: getUpdatedDrawpile(state.wave, state.drawPile),
        strength: currentCardValue,
        durability: 21,
        wave: getUpdatedWave(state.wave, getCardIndex(state.wave, action)),
      };
    case "evade":
      return {
        ...state,
        previousState: state,
        drawPile: getUpdatedDrawpileWhenEvade(state.wave),
        wave: [...drawCards(state.drawPile, 4)],
      };
    case "restart":
      const shuffledDeck = shuffle([...playableDeck]);
      const initialwave = shuffledDeck.slice(0, 4);
      const initialDrawPile = shuffledDeck.slice(4);
      return {
        drawPile: [...initialDrawPile],
        wave: [...initialwave],
        health: MAX_HEALTH,
        strength: 0,
        durability: 0,
      };
    default:
      return {
        ...state,
      };
  }
}

const action = (type, cardRank, cardValue) => {
  switch (type) {
    case "♣":
    case "♠":
    case "♥":
    case "♦":
    case "★":
      return {
        type: type,
        rank: cardRank,
        value: cardValue,
      };
    case "evade":
      return {
        type: type,
      };
    case "restart":
      return {
        type: type,
      };
    default:
      return {
        type: type,
      };
  }
};

app.addEventListener("click", (e) => {
  if (!e.target.closest("button")) return;
  const button = e.target.closest("button");
  const { buttonType, rank, value, slot } = button.dataset;
  state = updatestate(action(buttonType, rank, value));
  drawGame(state);
});

setTimeout(() => {
  drawGame(state);
}, 2000);
