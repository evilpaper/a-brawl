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
const round = drawCards(deck, 4);

const store = {
  drawPile: [...deck],
  round: [...drawCards(deck, 4)],
  discardPile: [],
  currentRound: [],
  life: 21,
  currentBrawlerStrength: 0,
  strengthOfLastBeatenOpponent: 0,
};

for (const card of round) {
  html += `<button class="card" data-card="${card.suite}${card.rank}">
			  <div class="upperleft">${card.suite}</div>
			  <div>${card.rank}</div>
			  <div class="lowerright">${card.suite}</div>
		</button>`;
}

app.innerHTML = html;

app.addEventListener("click", (e) => {
  console.log(e.target.closest("button"));
  const card = e.target.closest("button");
});
