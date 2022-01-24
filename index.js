import { PLAYING_CARDS } from "./PLAYING_CARDS.js";

const app = document.querySelector("#root");
const CARD_IN_ROUND = 4;

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

const initialDrawPile = [...deck];
const initialRound = [...drawCards(initialDrawPile, 4)];

let store = {
  drawPile: [...initialDrawPile],
  discardPile: [],
  round: [...initialRound],
  discardPile: [],
  health: 21,
  defence: 0,
  attack: 0,
};

function drawGame(store) {
  let scoreboard = "";
  let cards = "";
  app.innerHTML = "";

  scoreboard = `
    <p>Health: ${store.health}</p>
    <p>Attack: ${store.defence}</p>
    <p>Durability: ${store.attack}</p>
  `;

  for (const card of store.round) {
    cards += `<button 
        class="card ${card.played ? "played" : ""}" 
        data-card="${card.suite + card.rank}" 
        data-suite="${card.suite}" data-rank="${card.rank}"
        ${card.played ? "disabled" : ""}
        >
          <div class="upperleft">${card.suite}</div>
          <div>${card.rank} ${card.value > 10 ? card.value : ""}</div>
          <div class="lowerright">${card.suite}</div>
      </button>`;
  }

  const cardHTML = `<section class="round" section>${cards}</section>`;

  app.innerHTML = scoreboard + cardHTML;
}

function updateStore(action) {
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
  updatedRound[indexOfSelectedCard] = { ...selectedCard, played: true };
  // Not supernice
  const damage =
    selectedCard.value > store.defence ? selectedCard.value - store.defence : 0;

  const allCardsInRoundPlayed =
    updatedRound.filter((card) => {
      return card.played === true;
    }).length === CARD_IN_ROUND;

  if (allCardsInRoundPlayed) {
    // Pick first 4 cards from draw pile
    updatedRound = [...drawCards(store.drawPile, 4)];
    updatedDrawpile = [...store.drawPile.slice(4)];
    console.log("Cards in drawPile ", updatedDrawpile.length);
  }

  switch (action.dataset.suite) {
    case "♣":
      return {
        ...store,
        drawPile: updatedDrawpile,
        health: store.health - damage < 0 ? 0 : store.health - damage,
        attack: selectedCard.value - 1,
        round: updatedRound,
      };
    case "♠":
      return {
        ...store,
        drawPile: updatedDrawpile,
        health: store.health - damage < 0 ? 0 : store.health - damage,
        attack: selectedCard.value - 1,
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
        defence: selectedCard.value,
        attack: "Shining new",
        round: updatedRound,
      };
    default:
      return store;
  }
}

app.addEventListener("click", (e) => {
  const card = e.target.closest("button");
  if (card) {
    store = updateStore(card);
    drawGame(store);
  }
});

drawGame(store);
