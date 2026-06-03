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
let matchedPairs = 0;
let isGameFinished = false;
let isGameLocked = true;

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

  if (isGameFinished) return;

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

  matchedPairs++;

  resetTurn();

  if (matchedPairs === 8) {
    endGame("finished");
  }

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
  updateLeaderboard();
  endGame("out");
  return;
}

player.score = clickCount;
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

// ----- Spieler-Rang ermitteln -----
function getPlayerRank() {
  const sortedLeaderboard = [...leaderboardData].sort(
    (entryA, entryB) => entryA.score - entryB.score
  );

  let currentRank = 1;

  for (let index = 0; index < sortedLeaderboard.length; index++) {
    const entry = sortedLeaderboard[index];

    if (index > 0 && entry.score !== sortedLeaderboard[index - 1].score) {
      currentRank = index + 1;
    }

    if (entry.isPlayer) {
      return currentRank;
    }
  }
}

// ----- Spiel beenden -----
function endGame(result) {
  if (isGameFinished) return;

  isGameFinished = true;
  isGameLocked = true;
  lockBoard = true;

  if (result === "out") {
    showRestartRace("You are Out");
    return;
  }

  const finalRank = getPlayerRank();

  showRestartRace(`Final Rank ${finalRank}`);
}

// ----- Spiel zurücksetzen und neu starten -----
async function restartGame() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  clickCount = 0;
  matchedPairs = 0;
  isGameFinished = false;

  const player = leaderboardData.find((entry) => entry.isPlayer);
  player.score = 0;

  updateLeaderboard();

  memory.innerHTML = "";

  await startGame();
}

// ----- Anleitung Öffnen und Schliessen -----
function toggleInstructions() {
  const isOpen = instructions.classList.toggle("is-open");

  instructionsToggle.setAttribute("aria-expanded", isOpen);
}


// ----- Lottie Race Overlay -----
const lottieRaceOverlay = document.querySelector("#lottieRaceOverlay");
const lottieRaceContainer = document.querySelector("#lottieRaceContainer");
const lottieRaceResult = document.querySelector("#lottieRaceResult");

let raceAnimation = null;
let isRaceAnimationRunning = false;
let raceMode = "start";

if (lottieRaceContainer) {
  showStartRace();

  lottieRaceContainer.addEventListener("click", () => {
    if (isRaceAnimationRunning) return;
    if (!raceAnimation) return;

    isRaceAnimationRunning = true;
    raceAnimation.goToAndPlay(0, true);
  });
}

// ----- Start-Race anzeigen -----
function showStartRace() {
  raceMode = "start";

  if (lottieRaceOverlay) {
    lottieRaceOverlay.classList.remove("is-hidden");
    lottieRaceOverlay.classList.remove("is-restart");
  }

  if (lottieRaceResult) {
    lottieRaceResult.textContent = "";
  }

  loadRaceAnimation("animations/start_race.json");
}

// ----- Restart-Race anzeigen -----
function showRestartRace(message) {
  raceMode = "restart";

  if (lottieRaceOverlay) {
    lottieRaceOverlay.classList.remove("is-hidden");
  }

  if (lottieRaceResult) {
    lottieRaceResult.textContent = message;
  }

  loadRaceAnimation("animations/restart_race.json");
}

// ----- Lottie-Animation laden -----
function loadRaceAnimation(path) {
  if (!lottieRaceContainer) return;

  if (raceAnimation) {
    raceAnimation.destroy();
  }

  raceAnimation = lottie.loadAnimation({
    container: lottieRaceContainer,
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: path,
  });

  raceAnimation.addEventListener("DOMLoaded", () => {
    raceAnimation.goToAndStop(0, true);
  });

  raceAnimation.addEventListener("complete", handleRaceAnimationComplete);
}

// ----- Nach Lottie-Animation -----
async function handleRaceAnimationComplete() {
  if (lottieRaceOverlay) {
    lottieRaceOverlay.classList.add("is-hidden");
  }

  isRaceAnimationRunning = false;

  if (raceMode === "restart") {
    await restartGame();

    if (lottieRaceOverlay) {
      lottieRaceOverlay.classList.remove("is-restart");
    }
  }

  isGameLocked = false;
}