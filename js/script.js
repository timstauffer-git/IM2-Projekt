// ----- Memory-Spielfeld -----
const memory = document.querySelector(".memory");

// ----- Leaderboard -----
const leaderboardList = document.querySelector(".leaderboard-list");

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

// ----- Leaderboard-Daten -----
const OUT_LIMIT = 94;

const leaderboardData = [
  {
    name: "YOU",
    score: 0,
    isPlayer: true,
  },
  {
    name: "HAM",
    score: 30,
  },
  {
    name: "LEC",
    score: 38,
  },
  {
    name: "ROS",
    score: 46,
  },
  {
    name: "VET",
    score: 54,
  },
  {
    name: "HUL",
    score: 62,
  },
  {
    name: "MAS",
    score: 70,
  },
  {
    name: "VER",
    score: 78,
  },
  {
    name: "ALO",
    score: 86,
  },
  {
    name: "GRO",
    score: Infinity,
  },
];

// ----- Spielzustand (Karte1, Karte2, Speere wenn zwei Karten aufgedeckt)  -----
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let clickCount = 0;

// ----- Spielstart -----
startGame();
updateLeaderboard();

memory.addEventListener("click", handleCardClick);

if (instructionsToggle) {
  instructionsToggle.addEventListener("click", toggleInstructions);
}

// ----- API-Daten laden und Spiel starten -----
async function startGame() {
  try {
    const quotes = await fetchQuotes();

    //Für API testen:
    //console.log("API Daten:", quotes);

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
  if (isGameLocked) return;
  if (lockBoard) return;
  if (clickedCard === firstCard) return;
  if (clickedCard.classList.contains("is-matched")) return;

  countClick();

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

// ----- Klicks zählen -----
function countClick() {
  clickCount++;

  const player = leaderboardData.find((entry) => entry.isPlayer);

  if (clickCount >= OUT_LIMIT) {
    player.score = Infinity;
    lockBoard = true;
  } else {
    player.score = clickCount;
  }

  updateLeaderboard();
}

// ----- Leaderboard aktualisieren -----
function updateLeaderboard() {
  const sortedLeaderboard = [...leaderboardData].sort(
    (entryA, entryB) => entryA.score - entryB.score
  );

  leaderboardList.innerHTML = "";

  let currentRank = 1;

  sortedLeaderboard.forEach((entry, index) => {
    if (index > 0 && entry.score !== sortedLeaderboard[index - 1].score) {
      currentRank = index + 1;
    }

    const listItem = document.createElement("li");

    listItem.classList.add("leaderboard-item");

    if (entry.isPlayer) {
      listItem.classList.add("leaderboard-item--active");
    }

    let displayedScore;

    if (entry.score === Infinity) {
    displayedScore = "OUT";
    } else if (entry.isPlayer && entry.score === 0) {
    displayedScore = "0";
    } else {
    displayedScore = `+${entry.score}`;
    }

    listItem.innerHTML = `
      <span class="leaderboard-rank">${currentRank}</span>
      <span class="leaderboard-name">${entry.name}</span>
      <span class="leaderboard-score">${displayedScore}</span>
    `;

    leaderboardList.appendChild(listItem);
  });
}

// ----- Anleitung Öffnen und Schliessen -----
function toggleInstructions() {
  const isOpen = instructions.classList.toggle("is-open");

  instructionsToggle.setAttribute("aria-expanded", isOpen);
}

// ----- Lottie Race Overlay -----

const lottieRaceOverlay = document.querySelector("#lottieRaceOverlay");
const lottieRaceContainer = document.querySelector("#lottieRaceContainer");

let raceAnimation = null;
let isGameLocked = true;
let isRaceAnimationRunning = false;

if (lottieRaceContainer) {
  raceAnimation = lottie.loadAnimation({
    container: lottieRaceContainer,
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "animations/start_race.json",
  });

  raceAnimation.addEventListener("DOMLoaded", () => {
    raceAnimation.goToAndStop(0, true);
  });

raceAnimation.addEventListener("complete", () => {
  lottieRaceOverlay.classList.add("is-hidden");
  isGameLocked = false;
  isRaceAnimationRunning = false;
});

  lottieRaceContainer.addEventListener("click", () => {
  if (isRaceAnimationRunning) return;

  isRaceAnimationRunning = true;
  raceAnimation.goToAndPlay(0, true);
});
}