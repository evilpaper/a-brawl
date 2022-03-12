import { DECK } from "./DECK.js";

const app = document.querySelector("#root");

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

  const scoreboardHTML = `
    <p>♥ Health: ${state.health} / ${MAX_HEALTH}</p>
    <p>♦ Defence: ${state.strength === 0 ? "-" : state.strength}</p>
    <p>♠ ♣ Stamina: ${state.durability === 0 ? "-" : state.durability}</p>
  `;
  for (const card of state.wave) {
    cards += `<button 
        class="card ${card.played ? "played" : ""}" 
        data-button-type="${card.suite}"
        data-value="${card.value}"
        data-suite="${card.suite}" data-rank="${card.rank}"
        ${card.played ? "disabled" : ""}>
        <img src="${card.img}">
      </button>`;
  }
  const cardHTML = `<section class="wave" section>${
    state.health > 0 ? cards : `<p>Knocked out</p>`
  }</section>`;
  const evadeButton = `<button data-button-type="evade" ${
    canEvade ? "" : "disabled"
  } class="evade ${canEvade ? "" : "disabled"}">Move on</button>`;
  const restartButton = `<button data-button-type="restart" class="evade">Play again</button>`;
  const actionsHTML = state.health > 0 ? evadeButton : restartButton;

  app.innerHTML = scoreboardHTML + cardHTML + actionsHTML;
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
        drawPile: getUpdatedDrawpile(state.wave, state.drawPile),
        strength: currentCardValue,
        durability: 21,
        wave: getUpdatedWave(state.wave, getCardIndex(state.wave, action)),
      };
    case "evade":
      return {
        ...state,
        drawPile: getUpdatedDrawpileWhenEvade(state.wave),
        wave: [...drawCards(state.drawPile, 4)],
      };
    default:
      return state;
  }
}

app.addEventListener("click", (e) => {
  if (!e.target.closest("button")) return;
  const button = e.target.closest("button");
  const { buttonType, rank, value } = button.dataset;

  const action = (type) => {
    switch (type) {
      case "♣":
      case "♠":
      case "♥":
      case "♦":
        return {
          type: type,
          rank: rank,
          value: value,
        };
      case "evade":
        return {
          type: type,
        };
      default:
        return {
          type: type,
        };
    }
  };

  if (buttonType === "restart") {
    state = initialState;
  } else {
    state = updatestate(action(buttonType));
  }

  drawGame(state);
});

drawGame(state);
