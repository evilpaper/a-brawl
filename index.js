import { PLAYING_CARDS } from "./PLAYING_CARDS.js";

const app = document.querySelector("#root");

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

const deck = shuffle([...PLAYING_CARDS]);

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
    html += `<button class="card" data-suite="${card.suite}" data-rank="${card.rank}">
          <div class="upperleft">${card.suite}</div>
          <div>${card.rank}</div>
          <div class="lowerright">${card.suite}</div>
      </button>`;
  }
  app.innerHTML = html;
}

function updateStore(action) {
  const updatedStore = { ...store, round: [...store.round] };
  switch (action) {
    case "card":
      // update state
      break;
    case "forward":
      // update state
      break;
    default:
      console.log("Suite: ", action.dataset.suite);
      console.log("Rank: ", action.dataset.rank);
  }
  return updatedStore;
}

app.addEventListener("click", (e) => {
  const card = e.target.closest("button");
  drawGame(updateStore(card));
});

drawGame(store);
