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

let html = "";

const playableDeck = prepareDeck(PLAYING_CARDS);
const deck = shuffle([...playableDeck]);

const store = {
  drawPile: [...deck],
  round: [...drawCards(deck, 4)],
  discardPile: [],
  currentRound: [],
  life: 21,
  currentBrawlerStrength: 0,
  strengthOfLastBeatenOpponent: 0,
};

function drawGame(store) {
  html = "";
  app.innerHTML = "";

  for (const card of store.round) {
    html += `<button class="card ${card.played ? "played" : ""}" data-card="${
      card.suite + card.rank.toString()
    }" data-suite="${card.suite}" data-rank="${card.rank}">
          <div class="upperleft">${card.suite}</div>
          <div>${card.rank}</div>
          <div class="lowerright">${card.suite}</div>
      </button>`;
  }
  app.innerHTML = html;
}

function updateStore(action) {
  console.log(store);
  // Get the selected card
  const [selectedCard] = store.round.filter((card) => {
    return (
      card.suite === action.dataset.suite &&
      card.rank.toString() === action.dataset.rank
    );
  });
  // Get the index of the selected card
  const indexOfSelectedCard = store.round.findIndex(
    (card) =>
      card.suite === action.dataset.suite &&
      card.rank.toString() === action.dataset.rank
  );
  // Create a copy of the card in the current round
  const updatedRound = [...store.round];
  // Set played = true for the selected card in the current round
  updatedRound[indexOfSelectedCard] = { ...selectedCard, played: true };
  // Update the store
  const updatedStore = { ...store, round: updatedRound };
  console.log(updatedStore);
  switch (action) {
    case "card":
      // find card
      // set boolean played to true on found card
      // update state
      break;
    case "forward":
      // update state
      break;
    default:
    // console.log("Suite: ", action.dataset.suite);
    // console.log("Rank: ", action.dataset.rank);
  }
  return updatedStore;
}

app.addEventListener("click", (e) => {
  const card = e.target.closest("button");
  drawGame(updateStore(card));
});

drawGame(store);
