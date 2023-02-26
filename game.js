const Words = [
    "LINUX",
    "APPLE",
    "FRUIT",
    "SWIFT"
];

// State Variables
var isDarkMode = false;
var currentRow = 0;
var currentCol = 0;
var word = selectRandomWord();


// 
// GAME LOGIC
// 

function selectRandomWord() {
    return Words[Math.floor(Math.random() * Words.length)];
}

function checkAnswer() {
    let userInput = "";
    for (let i = 0; i < gameBoard[currentRow].length; i++) { 
        userInput += gameBoard[currentRow][i];
    }
    if (userInput.length < word.length) {
        return;
    }
    updateBoardColors(userInput)
    const maxDelay = 250 * userInput.length;
    setTimeout(() => {
        console.log("Moving to the next row");
        moveNextRow();
    }, maxDelay + 100); // Add a safety delay
}

function moveNextRow() {
    if (currentRow === 5) {
        alert("Game is over!")
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
    console.log(cellText);
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
    console.log(currentCol);
    gameBoard[currentRow][currentCol] = "";
    cellRef.firstChild.innerHTML = "";
    cellRef.classList.remove("animate-grow-shrink")
}

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    console.log(`Toggling mode: ${isDarkMode ? "dark" : "light"}`);
    var bodyRootRef = document.getElementById("root")
    bodyRootRef.className = isDarkMode ? "root-dark" : "root-light";
    // Select all cells
    var cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++) {
        cells[i].className = isDarkMode ? "cell cell-dark" : "cell cell-light";
    }
    // Update the keys
    var keys = document.getElementsByClassName("key");
    for (let i = 0; i < keys.length; i++) {
        keys[i].className = isDarkMode ? "key key-dark" : "key key-light";
    }
}

function updateBoardColors(userInput) {
    const letterMap = new Map();
    for (let i = 0; i < word.length; i++) {
        let letterCount = letterMap.get(word[i]);
        if (letterCount === undefined) {
            letterMap.set(word[i], 1);
            continue;
        }
        letterMap.set(word[i], letterCount++);
    }
    for (let i = 0; i < userInput.length; i++) {
        console.log(currentRow);
        setTimeout(() => {
            console.log(`Coordinates: r${currentRow}c${i}`);
            const currentCelRef = document.getElementById(`r${currentRow}c${i}`);
            currentCelRef.firstChild.classList.add("cell-text-back"); // Rotate the text
            currentCelRef.classList.add("cell-back");
            if (userInput[i] === word[i]) { // Correct letter in correct position
                let letterCount = letterMap.get(word[i]);
                // Correct letter in correct position
                currentCelRef.classList.add("cell-correct");
                letterCount--;
                letterMap.set(word[i], letterCount)
                return;
            }
            let letterCount = letterMap.get(userInput[i]) ?? 0;
            if (letterCount > 0) {
                // Correct letter in wrong position
                currentCelRef.classList.add("cell-partial");
                letterCount--;
                letterMap.set(userInput[i], letterCount)
            } else {
                currentCelRef.classList.add("cell-incorrect")
            }
        }, 250 * i);
    }
    
}



// 
// IIFE FUNCTIONS
// 

(initialSetup = () => {
    toggleDarkMode();
    var boardRef = document.getElementById("board");
    for (let i = 0; i < gameBoard.length; i++) {
        const rowDiv = document.createElement("div");
        rowDiv.className = "row";
        rowDiv.id = `r${i}`;
        for (let j = 0; j < gameBoard[i].length; j++) {
            const cellDiv = document.createElement("div");
            cellDiv.className = "cell";
            if (isDarkMode) {
                cellDiv.className += " cell-dark";
            } else {
                cellDiv.className += " cell-light";
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
        setCell(letter)
    }
    if (keyName === "Enter") {
        checkAnswer();
    } else if (keyName === "Backspace") {
        deleteCellInput();
    }
});

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
