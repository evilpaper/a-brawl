import { DECK } from "./DECK.js";
import { rules } from "./rules.js";

/* 
  Set app height to windows inner height on load and rezise to make sure the app 
  does not continue outside the viewport on iOS Safari due the calculation method which Safari and Chrome.
*/
const appHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty("--app-height", `${window.innerHeight}px`);
};
window.addEventListener("resize", appHeight);
appHeight();

/* 
   
*/
console.log(rules);

const app = document.querySelector(".app");
const gameOverOverlay = document.querySelector(".game-over");
const gameWinOverlay = document.querySelector(".game-win");
const slot1 = document.querySelector(".card-1");
const slot2 = document.querySelector(".card-2");
const slot3 = document.querySelector(".card-3");
const slot4 = document.querySelector(".card-4");
const healthDisplay = document.querySelector(".health");
const defenceDisplay = document.querySelector(".defence");
const staminaDisplay = document.querySelector(".stamina");
const actionButton = document.querySelector(".action-button");
const titleScreen = document.querySelector(".game-title");

const cardholder = document.querySelectorAll(".card-holder");

const cardholder1 = document.querySelector(".cardholder-1");
const cardholder2 = document.querySelector(".cardholder-2");
const cardholder3 = document.querySelector(".cardholder-3");
const cardholder4 = document.querySelector(".cardholder-4");

const CARDS_IN_WAVE = 4;
const MAX_HEALTH = 21;
const OPPONENT_HEROS = 28;

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
  wins: 0,
};

let state = { ...initialState };

const equals = (a, b) => {
  if (a === b) return true;

  if (a instanceof Date && b instanceof Date)
    return a.getTime() === b.getTime();

  if (!a || !b || (typeof a !== "object" && typeof b !== "object"))
    return a === b;

  if (a.prototype !== b.prototype) return false;

  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;

  return keys.every((k) => equals(a[k], b[k]));
};

function drawGame(state) {
  const canEvade = state.wave.filter((card) => card.played).length > 2;
  const canRestart = state.health === 0;

  console.log("Previous card :", state?.previousState?.wave[0]);
  console.log("Current card :", state.wave[0]);
  console.log("Equals :", equals(state?.previousState?.wave[0], state.wave[0]));

  if (!equals(state?.previousState?.wave[0], state.wave[0])) {
    slot1.dataset.buttonType = state.wave[0].suite;
    slot1.dataset.value = state.wave[0].value;
    slot1.dataset.suite = state.wave[0].suite;
    slot1.dataset.rank = state.wave[0].rank;
    slot1.disabled =
      state.wave[0].played || canRestart || state.wins === OPPONENT_HEROS;
    // cardholder1.src = state.wave[0].img;
    cardholder1.innerHTML = `
      <img
        class="card"
        src=${state.wave[0].img}
        width="242px"
        height="320px"
      />`;
    slot1.blur();
  }

  if (!equals(state?.previousState?.wave[1], state.wave[1])) {
    slot2.dataset.buttonType = state.wave[1].suite;
    slot2.dataset.value = state.wave[1].value;
    slot2.dataset.suite = state.wave[1].suite;
    slot2.dataset.rank = state.wave[1].rank;
    slot2.disabled =
      state.wave[1].played || canRestart || state.wins === OPPONENT_HEROS;
    // cardholder2.src = state.wave[1].img;
    cardholder2.innerHTML = `
      <img
        class="card"
        src=${state.wave[1].img}
        width="242px"
        height="320px"
      />`;
    slot2.blur();
  }

  if (!equals(state?.previousState?.wave[2], state.wave[2])) {
    slot3.dataset.buttonType = state.wave[2].suite;
    slot3.dataset.value = state.wave[2].value;
    slot3.dataset.suite = state.wave[2].suite;
    slot3.dataset.rank = state.wave[2].rank;
    slot3.disabled =
      state.wave[2].played || canRestart || state.wins === OPPONENT_HEROS;
    slot3.blur();
    // slot1.children[0].src = state.wave[0].img;
    cardholder3.innerHTML = `
      <img
        class="card"
        src=${state.wave[2].img}
        width="242px"
        height="320px"
      />`;
    slot3.blur();
  }

  if (!equals(state?.previousState?.wave[3], state.wave[3])) {
    slot4.dataset.buttonType = state.wave[3].suite;
    slot4.dataset.value = state.wave[3].value;
    slot4.dataset.suite = state.wave[3].suite;
    slot4.dataset.rank = state.wave[3].rank;
    slot4.disabled =
      state.wave[3].played || canRestart || state.wins === OPPONENT_HEROS;
    slot4.blur();
    // slot1.children[0].src = state.wave[0].img;
    cardholder4.innerHTML = `
      <img
        class="card"
        src=${state.wave[3].img}
        width="242px"
        height="320px"
      />`;
    slot4.blur();
  }

  // if (!equals(state?.previousState?.wave[1], state.wave[1])) {
  //   cardholder2.innerHTML = `
  //     <button class="card"
  //        ${state.wave[1].played && "disabled"}
  //        data-button-type=${state.wave[1].suite}
  //        data-value=${state.wave[1].value}
  //        data-suite=${state.wave[1].suite}
  //        data-rank=${state.wave[1].rank}
  //     >
  //       <img
  //         src=${state.wave[1].img}
  //         width="242px"
  //         height="320px"
  //       />
  //     </button>`;
  // }

  // if (!equals(state?.previousState?.wave[2], state.wave[2])) {
  //   cardholder3.innerHTML = `
  //     <button class="card"
  //        ${state.wave[2].played && "disabled"}
  //        data-button-type=${state.wave[2].suite}
  //        data-value=${state.wave[2].value}
  //        data-suite=${state.wave[2].suite}
  //        data-rank=${state.wave[2].rank}
  //     >
  //       <img
  //         src=${state.wave[2].img}
  //         width="242px"
  //         height="320px"
  //       />
  //     </button>`;
  // }

  // if (!equals(state?.previousState?.wave[3], state.wave[3])) {
  //   cardholder4.innerHTML = `
  //     <button class="card"
  //        ${state.wave[3].played && "disabled"}
  //        data-button-type=${state.wave[3].suite}
  //        data-value=${state.wave[3].value}
  //        data-suite=${state.wave[3].suite}
  //        data-rank=${state.wave[3].rank}
  //     >
  //       <img
  //         src=${state.wave[3].img}
  //         width="242px"
  //         height="320px"
  //       />
  //     </button>`;
  // }

  if (canEvade || canRestart) {
    actionButton.classList.remove("disabled");
  } else {
    actionButton.classList.add("disabled");
  }
  actionButton.innerHTML = state.health > 0 ? "Move on" : "Restart";
  actionButton.dataset.buttonType = state.health > 0 ? "evade" : "restart";

  if (state.win === OPPONENT_HEROS) {
    actionButton.innerHTML = "Restart";
    actionButton.dataset.buttonType = "restart";
  }

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

  state.wins === OPPONENT_HEROS
    ? (gameWinOverlay.style.display = "flex")
    : (gameWinOverlay.style.display = "none");
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
        wins: state.wins + 1,
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

titleScreen.addEventListener("click", function () {
  titleScreen.style.display = "none";
  drawGame(state);
});

document.addEventListener("keydown", function () {
  titleScreen.style.display = "none";
  drawGame(state);
});

app.addEventListener("click", (e) => {
  if (!e.target.closest("button")) return;
  const button = e.target.closest("button");
  console.log("Yeah, you clicked!");
  const { buttonType, rank, value } = button.dataset;
  state = updatestate(action(buttonType, rank, value));
  drawGame(state);
});

// Add a little delay first time ro we can see the nice card background
// setTimeout(() => {
//   drawGame(state);
// }, 1000);
