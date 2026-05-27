(() => {
    "use strict";

    const state = {
        allCards: {},
        cards: [],
        queue: [],
        completed: [],
        currentCard: null,
        flipped: false,
        isProcessing: false,
        selectedCategory: null,

        stats: {
            correct: 0,
            incorrect: 0
        }
    };

    const elements = {
        flashcard: document.getElementById("flashcard"),
        loadingState: document.getElementById("loadingState"),
        errorState: document.getElementById("errorState"),
        emptyState: document.getElementById("emptyState"),

        categoryPicker: document.getElementById("categoryPicker"),
        categoryButtons: document.getElementById("categoryButtons"),
        selectedCategoryLabel: document.getElementById("selectedCategoryLabel"),

        frontCategory: document.getElementById("frontCategory"),
        frontWord: document.getElementById("frontWord"),

        backCategory: document.getElementById("backCategory"),
        backWord: document.getElementById("backWord"),
        cardSummary: document.getElementById("cardSummary"),

        totalStat: document.getElementById("totalStat"),
        correctStat: document.getElementById("correctStat"),
        incorrectStat: document.getElementById("incorrectStat"),
        queueStat: document.getElementById("queueStat"),

        progressFill: document.getElementById("progressFill"),
        progressText: document.getElementById("progressText"),

        flipBtn: document.getElementById("flipBtn"),
        correctBtn: document.getElementById("correctBtn"),
        incorrectBtn: document.getElementById("incorrectBtn"),

        restartBtn: document.getElementById("restartBtn"),
        restartSessionBtn: document.getElementById("restartSessionBtn"),

        endScreen: document.getElementById("endScreen"),

        endTotal: document.getElementById("endTotal"),
        endCorrect: document.getElementById("endCorrect"),
        endIncorrect: document.getElementById("endIncorrect"),
        endAccuracy: document.getElementById("endAccuracy"),

        accuracyCorrectText: document.getElementById("accuracyCorrectText"),
        accuracyTotalText: document.getElementById("accuracyTotalText"),
        accuracyStars: document.getElementById("accuracyStars"),
    };

    let startX = 0;
    let isDragging = false;

    function shuffle(array) {
        const cloned = [...array];

        for (let i = cloned.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
        }

        return cloned;
    }

    function validateCards(cards) {
        if (!cards || typeof cards !== "object" || Array.isArray(cards)) {
            return false;
        }

        return Object.entries(cards).every(([category, entries]) =>
            typeof category === "string" &&
            Array.isArray(entries) &&
            entries.every(card =>
                typeof card.entry === "string" &&
                typeof card.definition === "string"
            )
        );
    }

    function normalizeCards(cardsByCategory) {
        const normalized = {};

        Object.entries(cardsByCategory).forEach(([category, entries]) => {
            normalized[category] = entries.map(card => ({
                category,
                entry: card.entry,
                definition: card.definition
            }));
        });

        return normalized;
    }

    async function loadCards() {
        try {
            const response = await fetch("./cards.json");

            if (!response.ok) {
                throw new Error("Failed to load cards");
            }

            const cards = await response.json();

            if (!validateCards(cards)) {
                throw new Error("Invalid cards format");
            }

            state.allCards = normalizeCards(cards);

            elements.loadingState.classList.add("hidden");

            renderCategoryPicker();
        } catch (error) {
            console.error(error);
            elements.loadingState.classList.add("hidden");
            elements.errorState.classList.remove("hidden");
        }
    }

function renderCategoryPicker() {
    const categories = Object.keys(state.allCards);

    elements.categoryButtons.innerHTML = "";

    elements.flashcard.classList.add("hidden");
    elements.endScreen.classList.add("hidden");
    elements.emptyState.classList.add("hidden");

    document.querySelector(".controls").classList.add("hidden");

    elements.categoryPicker.classList.remove("hidden");

    categories.forEach(category => {
        const button = document.createElement("button");

        button.className = "btn btn-secondary category-btn";
        button.textContent =
            `${category} (${state.allCards[category].length})`;

        button.addEventListener("click", () => {
            initializeSession(category);
        });

        elements.categoryButtons.appendChild(button);
    });
}

    function initializeSession(category) {
        state.selectedCategory = category;
        state.cards = [...state.allCards[category]];
        state.queue = shuffle(state.cards);
        state.completed = [];
        state.currentCard = null;
        state.flipped = false;
        state.isProcessing = false;

        state.stats.correct = 0;
        state.stats.incorrect = 0;

        elements.selectedCategoryLabel.textContent = category;

        elements.categoryPicker.classList.add("hidden");
        document.querySelector(".controls").classList.remove("hidden");
        elements.errorState.classList.add("hidden");
        elements.emptyState.classList.add("hidden");
        elements.endScreen.classList.add("hidden");

        if (!state.queue.length) {
            elements.emptyState.classList.remove("hidden");
            return;
        }

        renderNextCard();
        updateStats();
    }

    function renderCard(card) {
        if (!card) return;

        elements.frontCategory.textContent = card.category;
        elements.frontWord.textContent = card.entry;

        elements.backCategory.textContent = card.category;
        elements.backWord.textContent = card.entry;
        elements.cardSummary.textContent = card.definition;

        elements.flashcard.classList.remove("hidden");

        resetCard();
    }

    function renderNextCard() {
        if (!state.queue.length) {
            finishSession();
            return;
        }

        state.currentCard = state.queue[0];

        renderCard(state.currentCard);
    }

    function flipCard() {
        if (!state.currentCard || state.isProcessing) return;

        state.flipped = !state.flipped;

        elements.flashcard.classList.toggle("flipped", state.flipped);
    }

    function swipeRight() {
        if (state.isProcessing || !state.currentCard) return;

        state.isProcessing = true;

        elements.flashcard.style.transition = "0.25s ease-out";
        elements.flashcard.style.transform = "translate3d(140%, 40px, 0) rotate(15deg)";
        elements.flashcard.style.opacity = "0";

        setTimeout(() => {
            handleAnswer("correct");
        }, 250);
    }

    function swipeLeft() {
        if (state.isProcessing || !state.currentCard) return;

        state.isProcessing = true;

        elements.flashcard.style.transition = "0.25s ease-out";
        elements.flashcard.style.transform = "translate3d(-140%, 40px, 0) rotate(-15deg)";
        elements.flashcard.style.opacity = "0";

        setTimeout(() => {
            handleAnswer("incorrect");
        }, 250);
    }

    function resetCard() {
        state.flipped = false;

        elements.flashcard.classList.remove("flipped");

        elements.flashcard.style.transition = "none";
        elements.flashcard.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
        elements.flashcard.style.opacity = "1";

        setTimeout(() => {
            elements.flashcard.style.transition = "";
        }, 10);
    }

    function handleAnswer(type) {
        const current = state.queue.shift();

        state.completed.push({
            ...current,
            result: type
        });

        if (type === "correct") state.stats.correct++;
        if (type === "incorrect") state.stats.incorrect++;

        updateStats();

        state.isProcessing = false;

        renderNextCard();
    }

    function updateStats() {
        const total = state.cards.length;
        const completed = state.stats.correct + state.stats.incorrect;
        const percentage = total
            ? Math.round((completed / total) * 100)
            : 0;

        elements.totalStat.textContent = total;
        elements.correctStat.textContent = state.stats.correct;
        elements.incorrectStat.textContent = state.stats.incorrect;
        elements.queueStat.textContent = state.queue.length;

        elements.progressFill.style.width = `${percentage}%`;
        elements.progressText.textContent = `${percentage}%`;

        document
            .querySelector(".progress-bar")
            .setAttribute("aria-valuenow", percentage);
    }

    function finishSession() {
        const total = state.cards.length;

        const accuracy = total
            ? Math.round((state.stats.correct / total) * 100)
            : 0;

        elements.endTotal.textContent = total;
        elements.endCorrect.textContent = state.stats.correct;
        elements.endIncorrect.textContent = state.stats.incorrect;

        elements.endAccuracy.textContent = `${accuracy}%`;

        elements.accuracyCorrectText.textContent =
            state.stats.correct;

        elements.accuracyTotalText.textContent =
            total;

        let stars = 1;

        if (accuracy >= 95) stars = 5;
        else if (accuracy >= 80) stars = 4;
        else if (accuracy >= 60) stars = 3;
        else if (accuracy >= 40) stars = 2;

        elements.accuracyStars.textContent =
            "★".repeat(stars) +
            "☆".repeat(5 - stars);

        elements.endScreen.classList.remove("hidden");
        elements.flashcard.classList.add("hidden");
    }

    function restartSession() {

    state.stats.correct = 0;
    state.stats.incorrect = 0;

    state.cards = [];
    state.queue = [];
    state.completed = [];

    updateStats();

    elements.selectedCategoryLabel.textContent = "-";

    renderCategoryPicker();
}
function setupSwipeGestures() {
        elements.flashcard.addEventListener("touchstart", e => {
            if (state.isProcessing) return;

            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        elements.flashcard.addEventListener("touchmove", e => {
            if (!isDragging || state.isProcessing) return;

            const diff = e.touches[0].clientX - startX;

            elements.flashcard.style.transform =
                `translate3d(${diff}px, 0, 0) rotate(${diff / 20}deg)`;

            elements.flashcard.style.opacity =
                Math.max(0.3, 1 - Math.abs(diff) / 400);
        }, { passive: true });

        elements.flashcard.addEventListener("touchend", e => {
            if (!isDragging || state.isProcessing) return;

            isDragging = false;

            const diff = e.changedTouches[0].clientX - startX;

            if (diff > 100) {
                swipeRight();
            } else if (diff < -100) {
                swipeLeft();
            } else {
                resetCard();
            }
        }, { passive: true });
    }

    function bindEvents() {
        elements.flashcard.addEventListener("click", () => {
            if (window.getSelection().toString()) return;

            flipCard();
        });

        elements.flipBtn.addEventListener("click", flipCard);
        elements.correctBtn.addEventListener("click", swipeRight);
        elements.incorrectBtn.addEventListener("click", swipeLeft);

        elements.restartBtn.addEventListener("click", restartSession);
        elements.restartSessionBtn.addEventListener("click", restartSession);

        document.addEventListener("keydown", e => {
            if (
                !elements.endScreen.classList.contains("hidden") ||
                !elements.categoryPicker.classList.contains("hidden")
            ) {
                return;
            }

            const key = e.key.toLowerCase();

            if (key === " ") {
                e.preventDefault();
            }

            switch (key) {
                case " ":
                    flipCard();
                    break;
                case "y":
                    swipeRight();
                    break;
                case "n":
                    swipeLeft();
                    break;
            }
        });

        setupSwipeGestures();
    }

    bindEvents();
    loadCards();
})();
