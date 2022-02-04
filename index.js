import { PLAYING_CARDS } from "./PLAYING_CARDS.js";

const app = document.querySelector("#root");
const CARD_IN_ROUND = 4;

const RUN = { type: "RUN" };
const PICK_CLUB = { type: "PICK_CLUB" };
const PICK_SPADE = { type: "PICK_SPADE" };
const PICK_DIAMOND = { type: "PICK_DIAMOND" };
const PICK_HEART = { type: "PICK_HEART" };
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
  let cards = "";

  const scoreboardHTML = `
    <p>Team health, ♥ : ${store.health}</p>
    <p>Brawler strength, ♦ : ${store.strength}</p>
    <p>Brawler durability, ♠ or ♣ : ${store.durability}</p>
  `;

  const actionsHTML = `<button data-button-type="run" class="run">Run</button>`;

  for (const card of store.round) {
    cards += `<button 
        class="card ${card.played ? "played" : ""}" 
        data-button-type="${card.suite}"
        data-card="${card.suite + card.rank}" 
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
  // First hit
  if (currentDurability === "Bring it on") return enemyStrength - 1;
  // Enemy strength more than last enemy
  if (enemyStrength >= currentDurability) return "K-O";
  // Enemy strength less than last enemy
  if (enemyStrength < currentDurability) return enemyStrength - 1;
  return currentDurability;
}

function updateStore(action) {
  // Properties used on card
  // card.suite : string
  // card.rank : string
  // card.value : number

  // Get the selected card
  const [selectedCard] = store.round.filter((card) => {
    return (
      card.suite === action.dataset.suite && card.rank === action.dataset.rank
    );
  });
  // Get the index of the selected card
  const indexOfSelectedCard = store.round.findIndex(
    (card) =>
      card.suite === action.dataset.suite && card.rank === action.dataset.rank
  );
  // Create a copy of the current round
  let updatedRound = [...store.round];
  let updatedDrawpile = [...store.drawPile];

  // Set played = true for the selected card in the current round
  updatedRound = store.round.map((card, index) => {
    if (index === indexOfSelectedCard) {
      return { ...card, played: true };
    } else {
      return { ...card };
    }
  });

  // Not supernice
  const damage =
    selectedCard.value > store.strength
      ? selectedCard.value - store.strength
      : 0;

  const allCardsInRoundPlayed =
    updatedRound.filter((card) => {
      return card.played === true;
    }).length === CARD_IN_ROUND;

  if (allCardsInRoundPlayed) {
    // Pick first 4 cards from draw pile
    updatedRound = [...drawCards(store.drawPile, 4)];
    updatedDrawpile = [...store.drawPile.slice(4)];
  }

  switch (action.dataset.suite) {
    case "♣":
      return {
        ...store,
        drawPile: updatedDrawpile,
        health: store.health - damage < 0 ? 0 : store.health - damage,
        strength: getStrenghtAfterEnemyStrike(
          selectedCard.value,
          store.strength,
          store.durability
        ),
        durability: getDurabilityAfterEnemyStrike(
          selectedCard.value,
          store.durability
        ),
        round: updatedRound,
      };
    case "♠":
      return {
        ...store,
        drawPile: updatedDrawpile,
        health: store.health - damage < 0 ? 0 : store.health - damage,
        strength: getStrenghtAfterEnemyStrike(
          selectedCard.value,
          store.strength,
          store.durability
        ),
        durability: getDurabilityAfterEnemyStrike(
          selectedCard.value,
          store.durability
        ),
        round: updatedRound,
      };
    case "♥":
      return {
        ...store,
        drawPile: updatedDrawpile,
        health:
          store.health + selectedCard.value > 21
            ? 21
            : store.health + selectedCard.value,
        round: updatedRound,
      };
    case "♦":
      return {
        ...store,
        drawPile: updatedDrawpile,
        strength: selectedCard.value,
        durability: "Bring it on",
        round: updatedRound,
      };
    default:
      return store;
  }
}

app.addEventListener("click", (e) => {
  if (!e.target.closest("button")) return;
  const button = e.target.closest("button");
  const { buttonType } = button.dataset;

  const card = e.target.closest(".card");
  const run = e.target.closest(".run");
  if (card) {
    store = updateStore(card);
    drawGame(store);
  }
  if (run) {
    console.log("Run away");
  }
});

drawGame(store);
