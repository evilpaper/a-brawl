import { deck } from "./deck.js";

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function drawCards(deck, numberOfCards) {
  return [...deck.slice(0, numberOfCards)];
}

const app = document.querySelector("#root");
let html = "";

const playingDeck = [...deck];
shuffle(playingDeck);
const round = drawCards(playingDeck, 4);

for (const card of round) {
  html += `<div class="card">
			  <div class="upperleft">${card.suite}</div>
			  <div>${card.rank}</div>
			  <div class="lowerright">${card.suite}</div>
		</div>`;
}

app.innerHTML = html;
