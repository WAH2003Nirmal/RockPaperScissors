document.addEventListener('DOMContentLoaded', () => {
    const openGameButton = document.getElementById('open-game');
    const nameModal = document.getElementById('name-modal');
    const gameModal = document.getElementById('game-modal');
    const closeButton = document.querySelector('.close-button');
    const rockButton = document.getElementById('rock');
    const paperButton = document.getElementById('paper');
    const scissorsButton = document.getElementById('scissors');
    const playerDisplay = document.getElementById('player-display');
    const computerDisplay = document.getElementById('computer-display');
    const resultDisplay = document.getElementById('result');
    const playerScoreDisplay = document.getElementById('player-score');
    const computerScoreDisplay = document.getElementById('computer-score');
    const resetButton = document.getElementById('reset-game');
    const currentStreakDisplay = document.getElementById('current-streak');
    const bestStreakDisplay = document.getElementById('best-streak');
    const toggleSoundButton = document.getElementById('toggle-sound');
    const playerNameInput = document.getElementById('player-name-input');
    const startGameButton = document.getElementById('start-game');
    const playerNameDisplay = document.getElementById('player-name-display');
    const soundStatus = document.getElementById('sound-status');

    // Sound Effects
    const clickSound = document.getElementById('click-sound');
    const winSound = document.getElementById('win-sound');
    const loseSound = document.getElementById('lose-sound');
    const tieSound = document.getElementById('tie-sound');

    let soundEnabled = true;
    let playerName = "";

    function toggleSound() {
        soundEnabled = !soundEnabled;
        soundStatus.textContent = soundEnabled ? 'On' : 'Off';
    }

    toggleSoundButton.addEventListener('click', toggleSound);


    function playSound(sound) {
        if (soundEnabled) {
            sound.currentTime = 0;
            sound.play();
        }
    }

    let playerScore = 0;
    let computerScore = 0;
    let currentStreak = 0;
    let bestStreak = 0;
    let lastWinner = null;

    // --- Modal Functions ---

    function openNameModal() {
        nameModal.style.display = 'block';
        playerNameInput.focus();
        playerNameInput.value = '';
    }

    function openGameModal() {
        playerName = playerNameInput.value.trim();

        if (playerName) {
            playerNameDisplay.textContent = playerName;
            nameModal.style.display = "none";
            gameModal.style.display = 'block';
            resetGame();
        } else {

           displayErrorMessage("Please enter your name.");
        }
    }

    function closeModal() {
        gameModal.style.display = 'none';
    }

    //--- Display Error Message ---
     function displayErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('error-message');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';


      const nameModalContent = document.querySelector("#name-modal .modal-content");
      const inputField = document.getElementById("player-name-input");

      const existingError = nameModalContent.querySelector('.error-message');
      if (existingError) {
          existingError.remove();
      }
        nameModalContent.insertBefore(errorDiv, inputField.nextSibling);

        setTimeout(() => {
          if(errorDiv){
             errorDiv.remove();
          }

        }, 3000);
    }

    // --- Event Listeners ---

    openGameButton.addEventListener('click', openNameModal);
    closeButton.addEventListener('click', closeModal);
    startGameButton.addEventListener('click', openGameModal);


    // Close modal if clicked outside
    window.addEventListener('click', (event) => {
        if (event.target === nameModal) {
            if (playerNameInput.value.trim() === "") {
                displayErrorMessage("Please enter your name.");
              }

        } else if (event.target === gameModal){
            closeModal();
        }
    });

    // Enter key support for name input
     playerNameInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            openGameModal();
        }
    });

    // --- Game Logic Functions ---

    function getNirmalChoice() {
        const choices = ['rock', 'paper', 'scissors'];
        return choices[Math.floor(Math.random() * choices.length)];
    }

    function determineWinner(playerChoice, nirmalChoice) {
        if (playerChoice === nirmalChoice) {
            return 'tie';
        }
        if ((playerChoice === 'rock' && nirmalChoice === 'scissors') ||
            (playerChoice === 'paper' && nirmalChoice === 'rock') ||
            (playerChoice === 'scissors' && nirmalChoice === 'paper')) {
            return 'win';
        }
        return 'lose';
    }

    function updateStreaks(result) {
      if (result === 'win') {
        if (lastWinner === 'player') {
            currentStreak++;
        } else {
            currentStreak = 1;
        }
        lastWinner = 'player';
    } else if (result === 'lose') {
        currentStreak = 0;
        lastWinner = 'computer';
    } else {
        currentStreak = 0;
        lastWinner = null;
    }
        bestStreak = Math.max(bestStreak, currentStreak);
        currentStreakDisplay.textContent = currentStreak;
        bestStreakDisplay.textContent = bestStreak;
}

    function updateScoreDisplay() {
        playerScoreDisplay.textContent = playerScore;
        computerScoreDisplay.textContent = computerScore;
    }

    function resetGame() {
        playerScore = 0;
        computerScore = 0;
        currentStreak = 0;
        lastWinner = null;
        updateScoreDisplay();
        updateStreaks(null);

        // Reset images with timestamp
        playerDisplay.src = "placeholder.png?t=" + Date.now();
        computerDisplay.src = "placeholder.png?t=" + Date.now();
        resetAnimations();
        resultDisplay.textContent = 'Choose your weapon!';
        resultDisplay.classList.remove('win', 'lose', 'tie');
    }

    function resetAnimations() {
        document.querySelectorAll('.image-container').forEach(container => {
            container.classList.remove('win-bounce', 'lose-shake', 'tie-spin');
        });
    }
    resetButton.addEventListener('click', resetGame);


    function playGame(playerChoice) {
        playSound(clickSound);
        const nirmalChoice = getNirmalChoice();

        playerDisplay.src = `${playerChoice}.png?t=${Date.now()}`;
        computerDisplay.src = `${nirmalChoice}.png?t=${Date.now()}`;
        resetAnimations();

        const playerContainer = playerDisplay.parentElement;
        const computerContainer = computerDisplay.parentElement;
        const result = determineWinner(playerChoice, nirmalChoice);

        if (result === 'win') {
            playerScore++;
            playSound(winSound);
            playerContainer.classList.add('win-bounce');
        } else if (result === 'lose') {
            computerScore++;
            playSound(loseSound);
            playerContainer.classList.add('lose-shake');
        } else {
            playSound(tieSound);
            playerContainer.classList.add('tie-spin');
        }

        resultDisplay.textContent = {
          'win': 'You win!',
          'lose': 'Nirmal wins!',
          'tie': 'It\'s a tie!'
      }[result];

      resultDisplay.classList.remove('win', 'lose', 'tie');
      resultDisplay.classList.add(result);

        updateStreaks(result);
        updateScoreDisplay();

        setTimeout(() => {
            playerContainer.classList.remove('win-bounce', 'lose-shake', 'tie-spin');
            computerContainer.classList.remove('win-bounce', 'lose-shake', 'tie-spin');
        }, 600);
    }

    rockButton.addEventListener('click', () => playGame('rock'));
    paperButton.addEventListener('click', () => playGame('paper'));
    scissorsButton.addEventListener('click', () => playGame('scissors'));
});