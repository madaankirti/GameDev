
var board;
var score = 0;
var maxScore = parseInt(localStorage.getItem("maxScore")) || 0; // Load maxScore from localStorage or initialize to 0
var rows = 4;
var columns = 4;
var gameOver = false; // Flag to manage game-over state

window.onload = function() {
    document.getElementById("maxScore").innerText = maxScore; // Display the maximum score on load
    setGame();
}

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    // Reset game status, score, and flag
    document.getElementById("gameStatus").innerText = "";
    score = 0;
    gameOver = false;
    document.getElementById("score").innerText = score;

    // Clear the board display
    document.getElementById("board").innerHTML = "";

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    setTwo();
    setTwo();
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; // Clear the classList
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }                
    }
}

document.addEventListener('keyup', (e) => {
    if (gameOver) return; // If the game is over, prevent further moves

    let moved = false;
    if (e.code == "ArrowLeft") {
        slideLeft();
        moved = true;
    } else if (e.code == "ArrowRight") {
        slideRight();
        moved = true;
    } else if (e.code == "ArrowUp") {
        slideUp();
        moved = true;
    } else if (e.code == "ArrowDown") {
        slideDown();
        moved = true;
    }

    if (moved) {
        setTwo(); // Add a new "2" tile after a move
        document.getElementById("score").innerText = score;

        // Update max score if current score exceeds it
        if (score > maxScore) {
            maxScore = score;
            localStorage.setItem("maxScore", maxScore); // Store the new max score in localStorage
            document.getElementById("maxScore").innerText = maxScore; // Update display
        }

        if (checkGameOver()) {
            document.getElementById("gameStatus").innerText = "Game Lost!";
            gameStatus.style.fontWeight = "bold"; // Make it bold
            gameStatus.style.color = "red";
            gameOver = true; // Set game-over flag
            createNewGameButton(); // Create "New Game" button
        }
    }
});

function checkGameOver() {
    if (hasEmptyTile()) return false;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (c < columns - 1 && board[r][c] === board[r][c + 1]) return false;
            if (r < rows - 1 && board[r][c] === board[r + 1][c]) return false;
        }
    }
    return true; // Game is over
}

function setTwo() {
    if (!hasEmptyTile()) return;
    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

// Slide functions

function filterZero(row) {
    return row.filter(num => num != 0); // create new array of all nums != 0
}

function slide(row) {
    row = filterZero(row); // Filter out zeroes
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    row = filterZero(row); // Filter again after merging
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        board[r] = slide(row);
        updateRow(r);
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r].slice().reverse();
        row = slide(row);
        board[r] = row.reverse();
        updateRow(r);
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            updateTile(document.getElementById(r + "-" + c), board[r][c]);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]].reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            updateTile(document.getElementById(r + "-" + c), board[r][c]);
        }
    }
}

function updateRow(r) {
    for (let c = 0; c < columns; c++) {
        let tile = document.getElementById(r + "-" + c);
        updateTile(tile, board[r][c]);
    }
}

function createNewGameButton() {
    const buttonContainer = document.createElement("div");
    buttonContainer.style.marginTop = "10px";

    const button = document.createElement("button");
    button.id = "newGameButton";
    button.innerText = "New Game";
    button.onclick = function() {
        setGame(); // Start a new game
    };

    // Style the button
    button.style.backgroundColor = "green";
    button.style.color = "white";
    button.style.border = "none";
    button.style.padding = "12px 24px";
    button.style.fontSize = "18px";
    button.style.fontWeight = "bold";
    button.style.borderRadius = "6px";
    button.style.cursor = "pointer";
    button.style.transition = "background-color 0.3s ease";

    button.onmouseover = function() {
        button.style.backgroundColor = "#0e7d0e";
    };
    button.onmouseleave = function() {
        button.style.backgroundColor = "green";
    };

    buttonContainer.appendChild(button);
    document.getElementById("gameStatus").appendChild(buttonContainer); // Add button in new line
}


