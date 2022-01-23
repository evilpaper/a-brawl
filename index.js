import { PLAYING_CARDS } from "./PLAYING_CARDS.js";

const app = document.querySelector("#root");

function prepareDeck(array) {
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

const playableDeck = prepareDeck(PLAYING_CARDS);
const deck = shuffle([...playableDeck]);

let store = {
  drawPile: [...deck],
  round: [...drawCards(deck, 4)],
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
    <p>Defence: ${store.defence}</p>
    <p>Attack: ${store.attack}</p>
  `;

  for (const card of store.round) {
    cards += `<button 
        class="card ${card.played ? "played" : ""}" 
        data-card="${card.suite + card.rank}" 
        data-suite="${card.suite}" data-rank="${card.rank}"
        ${card.played ? "disabled" : ""}
        >
          <div class="upperleft">${card.suite}</div>
          <div>${card.rank}</div>
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
  const updatedRound = [...store.round];
  // Set played = true for the selected card in the current round
  updatedRound[indexOfSelectedCard] = { ...selectedCard, played: true };
  const damage =
    selectedCard.value > store.defence ? selectedCard.value - store.defence : 0;
  switch (action.dataset.suite) {
    case "♣":
      return {
        ...store,
        health: store.health - damage,
        attack: selectedCard.value - 1,
        round: updatedRound,
      };
    case "♠":
      return {
        ...store,
        health: store.health - damage,
        attack: selectedCard.value - 1,
        round: updatedRound,
      };
    case "♥":
      return {
        ...store,
        health: store.health + selectedCard.value,
      };
    case "♦":
      return {
        ...store,
        defence: selectedCard.value,
        attack: selectedCard.value,
        round: updatedRound,
      };
    default:
      return store;
  }
  return updatedStore;
}

app.addEventListener("click", (e) => {
  const card = e.target.closest("button");
  if (card) {
    store = updateStore(card);
    drawGame(store);
  }
});

drawGame(store);
