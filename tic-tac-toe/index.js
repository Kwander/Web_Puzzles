const boxes = document.querySelectorAll('.box');
const player_turn = document.querySelector('.player-turn');
const reset_button = document.querySelector('#reset');

let X = 0; // bitboard for X
let O = 0; // bitboard for O
let currentPlayer = 'X';
let xMoves = []; // Array to store X's moves in order
let oMoves = []; // Array to store O's moves in order
let gameActive = true; // New flag to track if game is still active

const wins = [7, 56, 448, 73, 146, 292, 273, 84];

function move(pos) {
    if (!gameActive) return;

    if (currentPlayer === 'X') {
        if (xMoves.length === 3 && pos === xMoves[0]) {
            xMoves.shift();
            xMoves.push(pos);
        } else {
            if (xMoves.length === 3) {
                const oldPos = xMoves.shift();
                X &= ~(1 << oldPos);
                boxes[oldPos].innerText = '';
            }
            xMoves.push(pos);
            X |= 1 << pos;
        }
        
        if (wins.some(win => (X & win) === win)) {
            announceWin('X');
            return;
        }
    } else {
        if (oMoves.length === 3 && pos === oMoves[0]) {
            oMoves.shift();
            oMoves.push(pos);
        } else {
            if (oMoves.length === 3) {
                const oldPos = oMoves.shift();
                O &= ~(1 << oldPos);
                boxes[oldPos].innerText = '';
            }
            oMoves.push(pos);
            O |= 1 << pos;
        }
        
        if (wins.some(win => (O & win) === win)) {
            announceWin('O');
            return;
        }
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    player_turn.innerText = currentPlayer + "'s turn";
    updateTransparency();
}

function updateTransparency() {
    boxes.forEach(box => {
        if (box.innerText) {
            box.style.opacity = '1';
        }
    });
    
    if (gameActive) {  // Only show transparency if game is still active
        if (currentPlayer === 'X' && xMoves.length === 3) {
            boxes[xMoves[0]].style.opacity = '0.5';
        } else if (currentPlayer === 'O' && oMoves.length === 3) {
            boxes[oMoves[0]].style.opacity = '0.5';
        }
    }
}

function announceWin(winner) {
    gameActive = false;  // Disable the game
    player_turn.innerText = winner + ' wins!';
    // Remove any transparency on win
    boxes.forEach(box => {
        if (box.innerText) {
            box.style.opacity = '1';
        }
    });
    startConfetti();
    setTimeout(stopConfetti, 1500);
}

function boxClicked(e) {
    if (!gameActive) return;  // Ignore clicks if game is over
    
    const index = Array.from(boxes).indexOf(e.target);
    if ((currentPlayer === 'X' && (xMoves[0] === index || ((X & (1 << index)) === 0 && (O & (1 << index)) === 0))) ||
        (currentPlayer === 'O' && (oMoves[0] === index || ((X & (1 << index)) === 0 && (O & (1 << index)) === 0)))) {
        e.target.innerText = currentPlayer;
        e.target.style.opacity = '1';
        move(index);
    }
}

function resetGame() {
    X = 0;
    O = 0;
    xMoves = [];
    oMoves = [];
    currentPlayer = 'X';
    gameActive = true;  // Re-enable the game
    player_turn.innerText = currentPlayer + "'s turn";
    boxes.forEach(box => {
        box.innerText = '';
        box.style.opacity = '1';
    });
    stopConfetti();
}

boxes.forEach(box => box.addEventListener("click", boxClicked));
reset_button.addEventListener("click", resetGame);
