// Game state
let board = [];
let emptyPos = { row: 3, col: 3 };
let moves = 0;
let seconds = 0;
let timerInterval = null;
let isGameActive = false;

// Initialize game
function initGame() {
    board = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 0]
    ];
    emptyPos = { row: 3, col: 3 };
    shuffleBoard();
    moves = 0;
    seconds = 0;
    isGameActive = true;
    updateDisplay();
    startTimer();
    hideMessage();
}

// Shuffle board (ensures solvable configuration)
function shuffleBoard() {
    const validMoves = [];
    
    // Make 100 random valid moves to shuffle
    for (let i = 0; i < 100; i++) {
        validMoves.length = 0;
        
        // Find valid moves
        if (emptyPos.row > 0) validMoves.push({ row: -1, col: 0 });
        if (emptyPos.row < 3) validMoves.push({ row: 1, col: 0 });
        if (emptyPos.col > 0) validMoves.push({ row: 0, col: -1 });
        if (emptyPos.col < 3) validMoves.push({ row: 0, col: 1 });
        
        // Pick random valid move
        const move = validMoves[Math.floor(Math.random() * validMoves.length)];
        const newRow = emptyPos.row + move.row;
        const newCol = emptyPos.col + move.col;
        
        // Swap
        board[emptyPos.row][emptyPos.col] = board[newRow][newCol];
        board[newRow][newCol] = 0;
        emptyPos = { row: newRow, col: newCol };
    }
}

// Check if move is valid
function isValidMove(row, col) {
    const rowDiff = Math.abs(row - emptyPos.row);
    const colDiff = Math.abs(col - emptyPos.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

// Make a move
function moveTile(row, col) {
    if (!isGameActive || !isValidMove(row, col)) return;

    // Swap tile with empty space
    board[emptyPos.row][emptyPos.col] = board[row][col];
    board[row][col] = 0;
    emptyPos = { row, col };
    
    moves++;
    updateDisplay();
    
    if (checkWin()) {
        winGame();
    }
}

// Check if puzzle is solved
function checkWin() {
    let expected = 1;
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (r === 3 && c === 3) {
                return board[r][c] === 0;
            }
            if (board[r][c] !== expected) return false;
            expected++;
        }
    }
    return true;
}

// Win game
function winGame() {
    isGameActive = false;
    stopTimer();
    showMessage(`🎉 Congratulations! You solved it in ${moves} moves and ${formatTime(seconds)}!`, 'success');
    document.querySelector('.container').classList.add('celebrate');
    setTimeout(() => {
        document.querySelector('.container').classList.remove('celebrate');
    }, 500);
}

// Update display
function updateDisplay() {
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';
    
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            
            if (board[r][c] === 0) {
                tile.classList.add('empty');
            } else {
                tile.textContent = board[r][c];
                tile.onclick = () => moveTile(r, c);
            }
            
            boardEl.appendChild(tile);
        }
    }
    
    document.getElementById('moves').textContent = moves;
}

// Timer functions
function startTimer() {
    stopTimer();
    timerInterval = setInterval(() => {
        seconds++;
        document.getElementById('time').textContent = formatTime(seconds);
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function formatTime(secs) {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
}

// Message functions
function showMessage(text, type) {
    const msg = document.getElementById('message');
    msg.textContent = text;
    msg.className = `message show ${type}`;
}

function hideMessage() {
    document.getElementById('message').className = 'message';
}

// Button handlers
function newGame() {
    initGame();
}

function solve() {
    board = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 0]
    ];
    emptyPos = { row: 3, col: 3 };
    isGameActive = false;
    stopTimer();
    updateDisplay();
    showMessage('Puzzle solved! Start a new game to play again.', 'success');
}

