import { PLAYING_CARDS } from "./PLAYING_CARDS.js";

const app = document.querySelector("#root");

const CARDS_IN_wave = 4;
const MAX_HEALTH = 21;

function resetDeck(array) {
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

const playableDeck = resetDeck(PLAYING_CARDS);
const deck = shuffle([...playableDeck]);

const initialwave = deck.slice(0, 4);
const initialDrawPile = deck.slice(4);

let state = {
  drawPile: [...initialDrawPile],
  wave: [...initialwave],
  health: MAX_HEALTH,
  strength: 0,
  durability: "No brawler selected",
};

function drawGame(state) {
  console.log(state);
  let cards = "";

  const scoreboardHTML = `
    <p>Team health, ♥ : ${state.health}</p>
    <p>Brawler strength, ♦ : ${state.strength}</p>
    <p>Brawler durability, ♠ or ♣ : ${state.durability}</p>
  `;

  const actionsHTML = `<button data-button-type="RUN" class="run">Run</button>`;

  for (const card of state.wave) {
    cards += `<button 
        class="card ${card.played ? "played" : ""}" 
        data-button-type="${card.suite}"
        data-card="${card.suite + card.rank}" 
        data-value="${card.value}"
        data-suite="${card.suite}" data-rank="${card.rank}"
        ${card.played ? "disabled" : ""}
        >
          <div class="upperleft">${card.suite}</div>
          <div>${
            card.value > 10 ? card.rank + " " + card.value : card.value
          }</div>
          <div class="lowerright">${card.suite}</div>
      </button>`;
  }

  const cardHTML = `<section class="wave" section>${cards}</section>`;

  app.innerHTML = scoreboardHTML + actionsHTML + cardHTML;
}

function getStrenghtAfterEnemyStrike(
  enemyStrength,
  currentStrength,
  currentDurability
) {
  if (enemyStrength >= currentDurability) return 0;
  return currentStrength;
}

function getDurabilityAfterEnemyStrike(enemyStrength, currentDurability) {
  if (currentDurability === "Bring it on") return enemyStrength - 1;
  if (enemyStrength >= currentDurability) return "K-O";
  if (enemyStrength < currentDurability) return enemyStrength - 1;
  return currentDurability;
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

function updatewave(wave, indexOfSelectedCard) {
  const updatedwave = setCardToPlayed(wave, indexOfSelectedCard);
  const allCardsInwavePlayed =
    updatedwave.filter((card) => {
      return card.played === true;
    }).length === CARDS_IN_wave;
  if (allCardsInwavePlayed) {
    return [...drawCards(state.drawPile, 4)];
  } else {
    return updatedwave;
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
    CARDS_IN_wave - 1
  );
}

function getDamage(brawlerStength, opponentStrength) {
  return opponentStrength > brawlerStength
    ? opponentStrength - brawlerStength
    : 0;
}

function putBackUnusedCards(wave) {
  const cards = wave.filter((card) => {
    return card.played !== true;
  });
  return [...state.drawPile, ...cards].slice(4);
}

function updatestate(action) {
  const cardValue = action.value;
  switch (action.type) {
    case "♣":
    case "♠":
      return {
        ...state,
        drawPile: isAllCardsInwavePlayed(state.wave)
          ? [...state.drawPile.slice(4)]
          : state.drawPile,
        health:
          state.health - getDamage(state.strength, cardValue) < 0
            ? 0
            : state.health - getDamage(state.strength, cardValue),
        strength: getStrenghtAfterEnemyStrike(
          cardValue,
          state.strength,
          state.durability
        ),
        durability: getDurabilityAfterEnemyStrike(cardValue, state.durability),
        wave: updatewave(state.wave, getCardIndex(state.wave, action)),
      };
    case "♥":
      return {
        ...state,
        drawPile: isAllCardsInwavePlayed(state.wave)
          ? [...state.drawPile.slice(4)]
          : state.drawPile,
        health: state.health + cardValue > 21 ? 21 : state.health + cardValue,
        wave: updatewave(state.wave, getCardIndex(state.wave, action)),
      };
    case "♦":
      return {
        ...state,
        drawPile: isAllCardsInwavePlayed(state.wave)
          ? [...state.drawPile.slice(4)]
          : state.drawPile,
        strength: cardValue,
        durability: "Bring it on",
        wave: updatewave(state.wave, getCardIndex(state.wave, action)),
      };
    case "RUN":
      return {
        ...state,
        drawPile: isAllCardsInwavePlayed(state.wave)
          ? [...state.drawPile.slice(4)]
          : putBackUnusedCards(state.wave),
        wave: [...drawCards(state.drawPile, 4)],
      };
    default:
      return state;
  }
}

app.addEventListener("click", (e) => {
  // Return without update if the click is not on a button
  if (!e.target.closest("button")) return;
  // If click is on a button, capture the button
  // Closest is needed to capture the button in case the click is on the content
  // in the button, like on a card symbol.
  const button = e.target.closest("button");
  // Get the valuable stuff from the button
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
      case "RUN":
        return {
          type: type,
        };
      default:
        return {
          type: type,
        };
    }
  };

  state = updatestate(action(buttonType));
  drawGame(state);
});

drawGame(state);
