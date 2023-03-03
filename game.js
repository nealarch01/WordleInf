const REPO = "https://github.com/nealarch01/WordleInf"

var WORDS = [
    "LINUX",
];

var WORDMAP = new Map();

fetch("./words.json")
    .then(response => response.json())
    .then(data => {
        WORDS = data;
        newGame();
    });

const FLIP_DURATION = 450;

// State Variables
var isDarkMode = false;
var currentRow = 0;
var currentCol = 0;
var word = "";


// 
// GAME LOGIC
// 

function selectRandomWord() {
    let randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    return randomWord.toUpperCase();
}

function checkAnswer() {
    let userInput = "";
    for (let i = 0; i < gameBoard[currentRow].length; i++) {
        userInput += gameBoard[currentRow][i];
    }
    if (userInput.length < word.length) { // Do not check if there are empty cells
        shakeRow(currentRow);
        return; 
    }
    updateBoard(userInput);
    const maxDelay = FLIP_DURATION * userInput.length;
    setTimeout(() => {
        console.log("Moving to the next row");
        if (userInput === word) {
            alert("Correct!");
            newGame();
            return;
        }
        moveNextRow();
    }, maxDelay + 100); // Add a safety delay (+100) for the animation to finish
}

function moveNextRow() {
    if (currentRow === 5) {
        alert("Game Over! The word was: " + word);
        newGame();
        return;
    }
    currentRow++;
    currentCol = 0;
}

// 
// GAME BOARD OPERATIONS
//
const gameBoard = [
    ["", "", "", "", ""], //
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""]
];

function newGame() {
    currentCol = 0;
    currentRow = 0;
    word = selectRandomWord();
    resetBoard();
}

function resetBoard() {
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[i].length; j++) {
            gameBoard[i][j] = "";
            var cellRef = document.getElementById(`r${i}c${j}`);
            cellRef.firstChild.innerHTML = "";
            cellRef.classList.remove("cell-back");
            cellRef.classList.remove("cell-correct");
            cellRef.classList.remove("cell-incorrect");
            cellRef.classList.remove("cell-partial");
            cellRef.classList.remove("animate-grow-shrink");
            cellRef.firstChild.classList.remove("cell-text-back");
        }
    }
}

function isBoardEmpty() {
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[i].length; j++) {
            if (gameBoard[i][j] !== "") {
                return false;
            }
        }
    }
    return true;
}

function isRowEmpty(rowNumber) {
    for (let i = 0; i < gameBoard[rowNumber].length; i++) {
        if (gameBoard[rowNumber][i] !== "") {
            return false;
        }
    }
    return true;
}

function setCell(character) {
    if (currentCol === 4 && gameBoard[currentRow][currentCol] !== "") {
        return;
    } else if (currentCol >= 5) {
        currentCol = 5;
        return;
    }
    var cellRef = document.getElementById(`r${currentRow}c${currentCol}`);
    const cellText = cellRef.firstChild;
    gameBoard[currentRow][currentCol] = character;
    cellText.innerHTML = character;
    cellRef.classList.add("animate-grow-shrink");
    currentCol++;
}

function deleteCellInput() {
    currentCol--;
    if (currentCol < 0) {
        currentCol = 0;
        return;
    }
    var cellRef = document.getElementById(`r${currentRow}c${currentCol}`);
    gameBoard[currentRow][currentCol] = "";
    cellRef.firstChild.innerHTML = "";
    cellRef.classList.remove("animate-grow-shrink")
}

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    console.log(`Toggling mode: ${isDarkMode ? "dark" : "light"}`);
    var bodyRootRef = document.getElementById("root")
    document.querySelector("div.top-bar").classList.toggle("dark");
    bodyRootRef.className = isDarkMode ? "root-dark" : "root-light";
    // Select all cells
    var cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++) {
        if (isDarkMode) {
            cells[i].classList.remove("light");
            cells[i].classList.add("dark");
        } else {
            cells[i].classList.remove("dark");
            cells[i].classList.add("light");
        }
    }
    // Update the keys
    var keys = document.getElementsByClassName("key");
    for (let i = 0; i < keys.length; i++) {
        keys[i].className = isDarkMode ? "key key-dark" : "key key-light";
    }
}

function updateBoard(userInput) {
    const letterMap = new Map();
    for (let i = 0; i < word.length; i++) {
        let letterCount = letterMap.get(word[i]);
        if (letterMap.get(word[i]) === undefined) {
            letterMap.set(word[i], [i]);
            continue;
        }
        letterIndices = letterMap.get(word[i]);
        letterIndices.push(i);
        letterMap.set(word[i], letterIndices);
    }

    // Algorithm to check
    // Iterate through the userInput characters

    for (let i = 0; i < userInput.length; i++) {
        setTimeout(() => {
            const currentCelRef = document.getElementById(`r${currentRow}c${i}`);
            currentCelRef.firstChild.classList.add("cell-text-back");
            currentCelRef.classList.add("cell-back");
            let characterIndices = letterMap.get(userInput[i]);
            if (characterIndices === undefined) {
                currentCelRef.classList.add("cell-incorrect");
            } else {
                // Check if i is in the characterIndices array
                let updatedCharacterIndices = [];
                if (characterIndices.includes(i)) {
                    // Mark the cell as correct
                    currentCelRef.classList.add("cell-correct");
                    // Remove i from the characterIndices array
                    characterIndices.splice(characterIndices.indexOf(i), 1);
                    updatedCharacterIndices = characterIndices;
                } else {
                    currentCelRef.classList.add("cell-partial");
                    characterIndices.splice(characterIndices.pop());
                    updatedCharacterIndices = characterIndices;
                }
                if (updatedCharacterIndices.length === 0) {
                    letterMap.delete(userInput[i]);
                } else {
                    letterMap.set(userInput[i], updatedCharacterIndices);
                }
            }
        }, FLIP_DURATION * i);
    }
}

// If the input is too short, then the board will make a shake animation
function shakeBoard() {
    const boardRef = document.getElementById("board");
    boardRef.classList.add("shake");
    setTimeout(() => {
        boardRef.classList.remove("shake"); // Remove after 0.4s
    }, 400);
}

function shakeRow(rowNumber) {
    const rowRef = document.getElementById(`r${rowNumber}`);
    rowRef.classList.add("shake");
    setTimeout(() => {
        rowRef.classList.remove("shake"); // Remove after 0.4s
    }, 400);
}



// 
// IIFE FUNCTIONS
// 

(initialSetup = () => {
    // Check system preferences for dark mode
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        toggleDarkMode();
    }
    var boardRef = document.getElementById("board");
    for (let i = 0; i < gameBoard.length; i++) {
        const rowDiv = document.createElement("div");
        rowDiv.className = "row";
        rowDiv.id = `r${i}`;
        for (let j = 0; j < gameBoard[i].length; j++) {
            const cellDiv = document.createElement("div");
            cellDiv.className = "cell";
            if (isDarkMode) {
                cellDiv.classList.add("dark");
            } else {
                cellDiv.classList.add("light");
            }
            cellDiv.id = `r${i}c${j}`;
            var cellText = document.createElement("span");
            cellText.classList.add("cell-text");
            cellText.innerHTML = gameBoard[i][j];
            cellDiv.appendChild(cellText);
            rowDiv.appendChild(cellDiv);
        }
        boardRef.appendChild(rowDiv);
    }
    console.log("Finished rendering board");
})();

// Event listener for when a key is pressed
document.addEventListener('keydown', (event) => {
    // Get the key name
    const keyName = event.key;
    // If the key is a letter
    var letter = "";
    if (keyName.length === 1) {
        letter = keyName.toUpperCase();
        // Regex test for letters
        if (!/[A-Z]/.test(letter)) {
            return;
        }
        setCell(letter);
    }
    if (keyName === "Enter") {
        checkAnswer();
    } else if (keyName === "Backspace") {
        deleteCellInput();
    }
});


// 
// KEYBOARD operations
// 

// When a key has already been used, it will be grayed out
function grayoutKey() {
    const keyRef = document.getElementById(`key-${currentKey}`);
    keyRef.classList.add("key-disabled");
}

const keyboardContainerRef = document.getElementById("keyboard-container");
(initializeGameKeyboardEvents = () => {
    for (let i = 0; i < 26; i++) {
        let char = String.fromCharCode(65 + i);
        let idPrefix = "key-";
        let keyRef = document.getElementById(idPrefix + char);
        keyRef.addEventListener("click", () => {
            setCell(char);
        });
    }
})();

const deleteGameKey = document.getElementById("delete-btn");
deleteGameKey.addEventListener("click", () => {
    deleteCellInput();
});

const enterKey = document.getElementById("enter-btn");
enterKey.addEventListener("click", () => {
    checkAnswer();
});

const darkModeToggler = document.querySelector(".dark-mode-toggler");
darkModeToggler.addEventListener("click", (event) => {
    event.preventDefault(); // Prevents the page from reloading
    toggleDarkMode();
    if (isDarkMode) {
        darkModeToggler.classList.remove("light");
        darkModeToggler.classList.add("dark");
    } else {
        darkModeToggler.classList.remove("dark");
        darkModeToggler.classList.add("light");
    }
});
