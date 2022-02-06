import { PLAYING_CARDS } from "./PLAYING_CARDS.js";

const app = document.querySelector("#root");

const CARDS_IN_ROUND = 4;
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

const initialRound = deck.slice(0, 4);
const initialDrawPile = deck.slice(4);

let store = {
  drawPile: [...initialDrawPile],
  round: [...initialRound],
  health: MAX_HEALTH,
  strength: 0,
  durability: "No brawler selected",
};

function drawGame(store) {
  console.log(store);
  let cards = "";

  const scoreboardHTML = `
    <p>Team health, ♥ : ${store.health}</p>
    <p>Brawler strength, ♦ : ${store.strength}</p>
    <p>Brawler durability, ♠ or ♣ : ${store.durability}</p>
  `;

  const actionsHTML = `<button data-button-type="RUN" class="run">Run</button>`;

  for (const card of store.round) {
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

  const cardHTML = `<section class="round" section>${cards}</section>`;

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

function setCardToPlayed(round, indexOfSelectedCard) {
  return round.map((card, index) => {
    if (index === indexOfSelectedCard) {
      return { ...card, played: true };
    } else {
      return { ...card };
    }
  });
}

function updateRound(round, indexOfSelectedCard) {
  const updatedRound = setCardToPlayed(round, indexOfSelectedCard);
  const allCardsInRoundPlayed =
    updatedRound.filter((card) => {
      return card.played === true;
    }).length === CARDS_IN_ROUND;
  if (allCardsInRoundPlayed) {
    return [...drawCards(store.drawPile, 4)];
  } else {
    return updatedRound;
  }
}

function getCardIndex(round, action) {
  return round.findIndex(
    (card) => card.suite === action.type && card.rank === action.rank
  );
}

function isAllCardsInRoundPlayed(round) {
  return (
    round.filter((card) => {
      return card.played === true;
    }).length ===
    CARDS_IN_ROUND - 1
  );
}

function getDamage(brawlerStength, opponentStrength) {
  return opponentStrength > brawlerStength
    ? opponentStrength - brawlerStength
    : 0;
}

function putBackUnusedCards(round) {
  const cards = round.filter((card) => {
    return card.played !== true;
  });
  return [...store.drawPile, ...cards].slice(4);
}

function updateStore(action) {
  const cardValue = action.value;
  switch (action.type) {
    case "♣":
    case "♠":
      return {
        ...store,
        drawPile: isAllCardsInRoundPlayed(store.round)
          ? [...store.drawPile.slice(4)]
          : store.drawPile,
        health:
          store.health - getDamage(store.strength, cardValue) < 0
            ? 0
            : store.health - getDamage(store.strength, cardValue),
        strength: getStrenghtAfterEnemyStrike(
          cardValue,
          store.strength,
          store.durability
        ),
        durability: getDurabilityAfterEnemyStrike(cardValue, store.durability),
        round: updateRound(store.round, getCardIndex(store.round, action)),
      };
    case "♥":
      return {
        ...store,
        drawPile: isAllCardsInRoundPlayed(store.round)
          ? [...store.drawPile.slice(4)]
          : store.drawPile,
        health: store.health + cardValue > 21 ? 21 : store.health + cardValue,
        round: updateRound(store.round, getCardIndex(store.round, action)),
      };
    case "♦":
      return {
        ...store,
        drawPile: isAllCardsInRoundPlayed(store.round)
          ? [...store.drawPile.slice(4)]
          : store.drawPile,
        strength: cardValue,
        durability: "Bring it on",
        round: updateRound(store.round, getCardIndex(store.round, action)),
      };
    case "RUN":
      return {
        ...store,
        drawPile: isAllCardsInRoundPlayed(store.round)
          ? [...store.drawPile.slice(4)]
          : putBackUnusedCards(store.round),
        round: [...drawCards(store.drawPile, 4)],
      };
    default:
      return store;
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

  store = updateStore(action(buttonType));
  drawGame(store);
});

drawGame(store);
