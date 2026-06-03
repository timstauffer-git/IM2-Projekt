// ----- Memory-Spielfeld -----
const memory = document.querySelector(".memory");

// ----- Spielanleitung -----
const instructions = document.querySelector(".instructions");
const instructionsToggle = document.querySelector(".instructions-toggle");

// ----- API_URL-----
const API_URL = "./js/api_cors_bridge.php";

// ----- Kartendaten mit jeweiliger ID, falls API nicht lädt -----
const fallbackData = [
  {
    pairId: 1,
    type: "year",
    content: "2007",
  },
  {
    pairId: 1,
    type: "quote",
    content: "Leave me alone, I know what I'm doing.",
  },

  {
    pairId: 2,
    type: "year",
    content: "2012",
  },
  {
    pairId: 2,
    type: "quote",
    content: "Just leave me alone.",
  },

  {
    pairId: 3,
    type: "year",
    content: "2013",
  },
  {
    pairId: 3,
    type: "quote",
    content: "The gloves and steering wheel.",
  },

  {
    pairId: 4,
    type: "year",
    content: "2018",
  },
  {
    pairId: 4,
    type: "quote",
    content: "Bwoah.",
  },

  {
    pairId: 5,
    type: "year",
    content: "2019",
  },
  {
    pairId: 5,
    type: "quote",
    content: "I was having a shit.",
  },

  {
    pairId: 6,
    type: "year",
    content: "2020",
  },
  {
    pairId: 6,
    type: "quote",
    content: "It is more like a hobby for me.",
  },

  {
    pairId: 7,
    type: "year",
    content: "2021",
  },
  {
    pairId: 7,
    type: "quote",
    content: "I don't know what happened.",
  },

  {
    pairId: 8,
    type: "year",
    content: "2022",
  },
  {
    pairId: 8,
    type: "quote",
    content: "We try again next time.",
  },
];

// ----- Spielzustand (Karte1, Karte2, Speere wenn zwei Karten aufgedeckt)  -----
let firstCard = null;
let secondCard = null;
let lockBoard = false;

// ----- Spielstart -----
startGame();

memory.addEventListener("click", handleCardClick);

if (instructionsToggle) {
  instructionsToggle.addEventListener("click", toggleInstructions);
}

// ----- API-Daten laden und Spiel starten -----
async function startGame() {
  try {
    const quotes = await fetchQuotes();

    console.log("API Daten:", quotes);

    const cardData = createCardDataFromQuotes(quotes);

    createCards(cardData);
  } catch (error) {
    console.error("API konnte nicht geladen werden:", error);

    createCards(fallbackData);
  }
}

// ----- Daten von API holen -----
async function fetchQuotes() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Fehler beim Laden der API");
  }

  const data = await response.json();

  return data;
}

// ----- API-Daten in Memory-Karten umwandeln -----
function createCardDataFromQuotes(quotes) {

  // Entfernt Quotes ohne Jahr und zu lange Quotes für das Memory-Spiel
  const quotesWithYear = quotes.filter(
    (quote) => quote.year && quote.quote.length <= 70
  );

  const shuffledQuotes = shuffleCards(quotesWithYear);

  // Speichert ausgewählte Quotes für aktuelle Runde
  const selectedQuotes = [];
  const usedYears = [];

  shuffledQuotes.forEach((quote) => {
    if (selectedQuotes.length >= 8) return;

    // lässt jedes Jahr (z.B. 2008) nur 1 Mal zu 
    if (usedYears.includes(quote.year)) return;

    selectedQuotes.push(quote);
    usedYears.push(quote.year);
  });

  const cards = [];

  selectedQuotes.forEach((quote, index) => {
    const pairId = index + 1;

    cards.push({
      pairId: pairId,
      type: "year",
      content: String(quote.year),
    });

    cards.push({
      pairId: pairId,
      type: "quote",
      content: quote.quote,
    });
  });

  return cards;
}

// ----- Karten-Erzeugung -----
function createCards(cardData) {
  memory.innerHTML = "";

  const shuffledCards = shuffleCards(cardData);

  shuffledCards.forEach((card, index) => {
    const button = document.createElement("button");

    // Rennflaggenmuster
    const row = Math.floor(index / 4);
    const column = index % 4;
    const isBlack = (row + column) % 2 === 0;
    const cardColor = isBlack ? "black" : "white";

    // Button bekommt CSS-Klassen
    button.classList.add("memory-card");
    button.classList.add(`memory-card--${cardColor}`);
    button.classList.add(`memory-card--${card.type}`);

    button.type = "button";
    button.dataset.pairId = card.pairId;
    button.dataset.type = card.type;

    // Karten Inhalt
    button.innerHTML = `
      <span class="memory-card-inner">
        <span class="memory-card-front"></span>
        <span class="memory-card-back">
          ${card.content}
        </span>
      </span>
    `;

    memory.appendChild(button);
  });
}

// ----- Bei Klick auf Karte -----
function handleCardClick(event) {
  const clickedCard = event.target.closest(".memory-card");

  if (!clickedCard) return;
  if (lockBoard) return;
  if (clickedCard === firstCard) return;
  if (clickedCard.classList.contains("is-matched")) return;

  clickedCard.classList.add("is-flipped");

  if (!firstCard) {
    firstCard = clickedCard;
    return;
  }

  secondCard = clickedCard;
  checkForMatch();
}

// ----- Überprüfung der Kartenpaare -----
function checkForMatch() {
  const isMatch = firstCard.dataset.pairId === secondCard.dataset.pairId;

  if (isMatch) {
    firstCard.classList.add("is-matched");
    secondCard.classList.add("is-matched");
    resetTurn();
  } else {
    lockBoard = true;

    setTimeout(() => {
      firstCard.classList.remove("is-flipped");
      secondCard.classList.remove("is-flipped");
      resetTurn();
    }, 900);
  }
}

// ----- Zurücksetzen -----
function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// ----- Mischen der Karten -----
function shuffleCards(cards) {
  return [...cards].sort(() => Math.random() - 0.5);
}

// ----- Anleitung Öffnen und Schliessen -----
function toggleInstructions() {
  const isOpen = instructions.classList.toggle("is-open");

  instructionsToggle.setAttribute("aria-expanded", isOpen);
}