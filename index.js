import { deck } from "./deck.js";

const app = document.querySelector("#root");

let html = "";

for (const card of deck) {
  html += `<div>
			<strong>${card.suite} ${card.rank}</strong>
		</div>`;
}

app.innerHTML = html;
