const boxes = document.querySelectorAll('.box');
const player_turn = document.querySelector('.player-turn');
const reset_button = document.querySelector('#reset');

let X = 0; // bitboard for X
let O = 0; // bitboard for O
let currentPlayer = 'X';

const wins = [7, 56, 448, 73, 146, 292, 273, 84];

function move(pos) {
    if (currentPlayer === 'X') {
        X |= 1 << pos;
        if (wins.some(win => (X & win) === win)) {
            announceWin('X');
            return;
        }
    } else {
        O |= 1 << pos;
        if (wins.some(win => (O & win) === win)) {
            announceWin('O');
            return;
        }
    }
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    player_turn.innerText = currentPlayer + "s turn";

    // Check for a tie
    if ((X | O) === 511) {
        announceTie();
        return;
    }
}

function announceWin(winner) {
    player_turn.innerText = winner + ' wins!';
    startConfetti();
    setTimeout(stopConfetti, 1500);
}

function announceTie() {
    player_turn.innerText = 'It\'s a tie!';
}

function boxClicked(e) {
    const index = Array.from(boxes).indexOf(e.target);
    if ((X & (1 << index)) === 0 && (O & (1 << index)) === 0) {
        e.target.innerText = currentPlayer;
        move(index);
    }
}

function resetGame() {
    X = 0;
    O = 0;
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    player_turn.innerText = currentPlayer + "s turn";
    boxes.forEach(box => box.innerText = '');
    stopConfetti();
}

boxes.forEach(box => box.addEventListener("click", boxClicked));
reset_button.addEventListener("click", resetGame);
