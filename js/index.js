import { DECK } from "./DECK.js";

const app = document.querySelector(".app");
const board = document.querySelector("#board");
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
  let cards = "";
  const canEvade = state.wave.filter((card) => card.played).length > 2;
  for (const card of state.wave) {
    cards += `<button 
        class="card ${card.played ? "played" : ""}" 
        data-button-type="${card.suite}"
        data-value="${card.value}"
        data-suite="${card.suite}" data-rank="${card.rank}"
        ${card.played ? "disabled" : ""}>
        <img src="${card.img}" width="242px" height="320px">
      </button>`;
  }
  const cardHTML = `<section class="wave" section>${
    state.health > 0 ? cards : `<p class="game-over">Knocked out</p>`
  }</section>`;

  if (canEvade) {
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
    if (state.previousState.stamina !== state.stamina) {
      staminaDisplay.innerHTML = state.stamina;
    }
  } else {
    // First paint, when we don't have a previous state
    healthDisplay.innerHTML = state.health;
    defenceDisplay.innerHTML = state.strength;
    staminaDisplay.innerHTML = state.durability;
  }

  board.innerHTML = cardHTML;
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

function updatestate(action) {
  const currentCardValue = Number(action.value);
  switch (action.type) {
    case "♣":
    case "♠":
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
        health:
          state.health + currentCardValue > 21
            ? 21
            : state.health + currentCardValue,
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
  const { buttonType, rank, value } = button.dataset;
  state = updatestate(action(buttonType, rank, value));
  drawGame(state);
});

drawGame(state);
