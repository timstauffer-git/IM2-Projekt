const memory = document.querySelector(".memory");
const instructions = document.querySelector(".instructions");
const instructionsToggle = document.querySelector(".instructions-toggle");

const cardData = [
  {
    pairId: 1,
    type: "year",
    content: "2007",
    color: "white",
  },
  {
    pairId: 1,
    type: "quote",
    content: "Leave me alone, I know what I'm doing.",
    color: "black",
  },

  {
    pairId: 2,
    type: "year",
    content: "2012",
    color: "black",
  },
  {
    pairId: 2,
    type: "quote",
    content: "Just leave me alone.",
    color: "white",
  },

  {
    pairId: 3,
    type: "year",
    content: "2013",
    color: "white",
  },
  {
    pairId: 3,
    type: "quote",
    content: "The gloves and steering wheel.",
    color: "black",
  },

  {
    pairId: 4,
    type: "year",
    content: "2018",
    color: "black",
  },
  {
    pairId: 4,
    type: "quote",
    content: "Bwoah.",
    color: "white",
  },

  {
    pairId: 5,
    type: "year",
    content: "2019",
    color: "white",
  },
  {
    pairId: 5,
    type: "quote",
    content: "I was having a shit.",
    color: "black",
  },

  {
    pairId: 6,
    type: "year",
    content: "2020",
    color: "black",
  },
  {
    pairId: 6,
    type: "quote",
    content: "It is more like a hobby for me.",
    color: "white",
  },

  {
    pairId: 7,
    type: "year",
    content: "2021",
    color: "white",
  },
  {
    pairId: 7,
    type: "quote",
    content: "I don't know what happened.",
    color: "black",
  },

  {
    pairId: 8,
    type: "year",
    content: "2022",
    color: "black",
  },
  {
    pairId: 8,
    type: "quote",
    content: "We try again next time.",
    color: "white",
  },

  {
    pairId: 9,
    type: "year",
    content: "2023",
    color: "white",
  },
  {
    pairId: 9,
    type: "quote",
    content: "It was okay.",
    color: "black",
  },

  {
    pairId: 10,
    type: "year",
    content: "2024",
    color: "black",
  },
  {
    pairId: 10,
    type: "quote",
    content: "Let's see.",
    color: "white",
  },
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;

createCards();

memory.addEventListener("click", handleCardClick);

if (instructionsToggle) {
  instructionsToggle.addEventListener("click", toggleInstructions);
}

function createCards() {
  const shuffledCards = shuffleCards(cardData);

  shuffledCards.forEach((card) => {
    const button = document.createElement("button");

    button.classList.add("memory-card");
    button.classList.add(`memory-card--${card.color}`);

    button.type = "button";
    button.dataset.pairId = card.pairId;
    button.dataset.type = card.type;

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

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function shuffleCards(cards) {
  return [...cards].sort(() => Math.random() - 0.5);
}

function toggleInstructions() {
  const isOpen = instructions.classList.toggle("is-open");

  instructionsToggle.setAttribute("aria-expanded", isOpen);
}