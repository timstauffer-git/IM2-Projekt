// ----- Memory-Spielfeld -----
const memory = document.querySelector(".memory");

// ----- Spielanleitung -----
const instructions = document.querySelector(".instructions");
const instructionsToggle = document.querySelector(".instructions-toggle");

// ----- Kartendaten mit jeweiliger ID -----
const cardData = [
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

  {
    pairId: 9,
    type: "year",
    content: "2023",
  },
  {
    pairId: 9,
    type: "quote",
    content: "It was okay.",
  },

  {
    pairId: 10,
    type: "year",
    content: "2024",
  },
  {
    pairId: 10,
    type: "quote",
    content: "Let's see.",
  },
];

// ----- Spielzustand (Karte1, Karte2, Speere wenn zwei Karten aufgedeckt)  -----
let firstCard = null;
let secondCard = null;
let lockBoard = false;


// ----- Spielstart -----
createCards();

memory.addEventListener("click", handleCardClick);

if (instructionsToggle) {
  instructionsToggle.addEventListener("click", toggleInstructions);
}

// ----- Karten-Erzeugung -----
function createCards() {
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

// ----- Msichen der Karten -----
function shuffleCards(cards) {
  return [...cards].sort(() => Math.random() - 0.5);
}

// ----- Anleitung Öffnen und Schliessen -----
function toggleInstructions() {
  const isOpen = instructions.classList.toggle("is-open");

  instructionsToggle.setAttribute("aria-expanded", isOpen);
}