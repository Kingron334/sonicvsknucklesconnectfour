// Check if a column can take a new piece
function isValidMove(column, squares) {
    const squareIndex = column; // Top row (row 0) of the column
    return !squares[squareIndex].classList.contains("sonic") && 
           !squares[squareIndex].classList.contains("knuckles");
}

// Test dropping a piece without changing the real board
function simulateDropPiece(column, player, squares) {
    for (let row = board_height - 1; row >= 0; row--) {
        const squareIndex = row * board_width + column;
        if (!squares[squareIndex].classList.contains("sonic") && 
            !squares[squareIndex].classList.contains("knuckles")) {
            squares[squareIndex].classList.add(player === sonic ? "sonic" : "knuckles");
            return squareIndex;
        }
    }
    return -1; // Column is full
}

// Undo a test move
function undoMove(squareIndex, squares) {
    if (squareIndex !== -1) {
        squares[squareIndex].classList.remove("sonic", "knuckles");
    }
}

// Check if a player has four in a row
function checkForWinCondition(squares, player) {
    const piece = player === sonic ? "sonic" : "knuckles";

    // Check horizontal
    for (let row = 0; row < board_height; row++) {
        for (let col = 0; col < board_width - 3; col++) {
            const squareIndex = row * board_width + col;
            if (squares[squareIndex].classList.contains(piece) &&
                squares[squareIndex + 1].classList.contains(piece) &&
                squares[squareIndex + 2].classList.contains(piece) &&
                squares[squareIndex + 3].classList.contains(piece)) {
                return true;
            }
        }
    }

    // Check vertical
    for (let row = 0; row < board_height - 3; row++) {
        for (let col = 0; col < board_width; col++) {
            const squareIndex = row * board_width + col;
            if (squares[squareIndex].classList.contains(piece) &&
                squares[squareIndex + board_width].classList.contains(piece) &&
                squares[squareIndex + 2 * board_width].classList.contains(piece) &&
                squares[squareIndex + 3 * board_width].classList.contains(piece)) {
                return true;
            }
        }
    }

    // Check diagonal (positive slope)
    for (let row = 0; row < board_height - 3; row++) {
        for (let col = 0; col < board_width - 3; col++) {
            const squareIndex = row * board_width + col;
            if (squares[squareIndex].classList.contains(piece) &&
                squares[squareIndex + (board_width + 1)].classList.contains(piece) &&
                squares[squareIndex + 2 * (board_width + 1)].classList.contains(piece) &&
                squares[squareIndex + 3 * (board_width + 1)].classList.contains(piece)) {
                return true;
            }
        }
    }

    // Check diagonal (negative slope)
    for (let row = 0; row < board_height - 3; row++) {
        for (let col = 3; col < board_width; col++) {
            const squareIndex = row * board_width + col;
            if (squares[squareIndex].classList.contains(piece) &&
                squares[squareIndex + (board_width - 1)].classList.contains(piece) &&
                squares[squareIndex + 2 * (board_width - 1)].classList.contains(piece) &&
                squares[squareIndex + 3 * (board_width - 1)].classList.contains(piece)) {
                return true;
            }
        }
    }

    return false;
}

// Main AI function to pick a column
function getAIMove(squares) {
    // Rule 1: If Knuckles can win, do it
    for (let col = 0; col < board_width; col++) {
        if (isValidMove(col, squares)) {
            const squareIndex = simulateDropPiece(col, knuckles, squares);
            if (checkForWinCondition(squares, knuckles)) {
                undoMove(squareIndex, squares);
                return col;
            }
            undoMove(squareIndex, squares);
        }
    }

    // Rule 2: If Sonic can win, block it
    for (let col = 0; col < board_width; col++) {
        if (isValidMove(col, squares)) {
            const squareIndex = simulateDropPiece(col, sonic, squares);
            if (checkForWinCondition(squares, sonic)) {
                undoMove(squareIndex, squares);
                return col;
            }
            undoMove(squareIndex, squares);
        }
    }

    // Rule 3: Pick a random valid column
    const validColumns = [];
    for (let col = 0; col < board_width; col++) {
        if (isValidMove(col, squares)) {
            validColumns.push(col);
        }
    }
    return validColumns.length > 0 
        ? validColumns[Math.floor(Math.random() * validColumns.length)] 
        : -1;
}