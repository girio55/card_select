const cardGrid = document.getElementById('card-grid');
const startButton = document.getElementById('start-button');
const goalNumberSpan = document.getElementById('goal-number');
const scoreSpan = document.getElementById('score');
const timerSpan = document.getElementById('timer');
const currentSumSpan = document.getElementById('current-sum');
const gameOverPanel = document.getElementById('game-over-panel');
const finalScoreSpan = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

let cards = [];
let selectedCards = [];
let goal = 0;
let score = 0;
let timeLeft = 60;
let timerId = null;
let isGameActive = false;

// カードの生成
function createCards() {
    cardGrid.innerHTML = '';
    cards = [];
    for (let i = 0; i < 10; i++) {
        const cardValue = Math.floor(Math.random() * 4) + 1;
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.textContent = cardValue;
        cardElement.dataset.value = cardValue;
        cardElement.addEventListener('click', () => toggleCardSelection(cardElement));
        cardGrid.appendChild(cardElement);
        cards.push(cardElement);
    }
}

// カードの選択/解除
function toggleCardSelection(cardElement) {
    if (!isGameActive) return;

    if (cardElement.classList.contains('selected')) {
        cardElement.classList.remove('selected');
        selectedCards = selectedCards.filter(card => card !== cardElement);
    } else {
        cardElement.classList.add('selected');
        selectedCards.push(cardElement);
    }
    updateCurrentSum();
    checkGoal();
}

// 合計値の更新
function updateCurrentSum() {
    const currentSum = selectedCards.reduce((sum, card) => sum + parseInt(card.dataset.value), 0);
    currentSumSpan.textContent = currentSum;
}

// ゴール数字の生成
function generateGoal() {
    const minGoal = 3;
    const maxGoal = 25; // カードの最大合計値は40ですが、現実的な範囲で設定
    goal = Math.floor(Math.random() * (maxGoal - minGoal + 1)) + minGoal;
    goalNumberSpan.textContent = goal;
}

// ゴール到達チェック
function checkGoal() {
    const currentSum = selectedCards.reduce((sum, card) => sum + parseInt(card.dataset.value), 0);
    if (currentSum === goal) {
        score++;
        scoreSpan.textContent = score;
        resetRound();
        generateGoal();
    }
}

// ラウンドのリセット
function resetRound() {
    selectedCards.forEach(card => card.classList.remove('selected'));
    selectedCards = [];
    updateCurrentSum();
    createCards();
}

// タイマーの開始
function startTimer() {
    timerId = setInterval(() => {
        timeLeft--;
        timerSpan.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerId);
            endGame();
        }
    }, 1000);
}

// ゲーム開始
function startGame() {
    isGameActive = true;
    score = 0;
    timeLeft = 60;
    scoreSpan.textContent = score;
    timerSpan.textContent = timeLeft;
    startButton.style.display = 'none';
    gameOverPanel.classList.add('hidden');
    createCards();
    generateGoal();
    startTimer();
}

// ゲーム終了
function endGame() {
    isGameActive = false;
    finalScoreSpan.textContent = score;
    gameOverPanel.classList.remove('hidden');
    startButton.style.display = 'none';
}

// イベントリスナー
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);