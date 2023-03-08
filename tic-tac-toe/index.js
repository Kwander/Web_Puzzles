window.addEventListener('DOMContentLoaded', () => {
    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = true;

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const tiles = Array.from(document.querySelectorAll('.box'));
    const playerDisplay = document.querySelector('.window-turn');
    const resetButton = document.querySelector('#restart');
    const announcer = document.querySelector('.announcer');


    tiles.forEach((box, index) => {
        box.addEventListener('click', () => {
            if (isValidAction(box) && isGameActive) {
                box.innerText = currentPlayer;
                box.classList.add(`player${currentPlayer}`);
                updateBoard(index);
                handleResultValidation();
                changePlayer();
            }
        });
    });

    resetButton.addEventListener('click', resetBoard);

    function isValidAction(box) {
        if (box.innerText === 'X' || box.innerText === 'O') {
            return false;
        }
        return true;
    }

    function updateBoard(index) {
        board[index] = currentPlayer;
    }

    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
            isGameActive = false;
            return;
        }

        if (!board.includes('')) {
            announce(TIE);
        }
    }

    function announce(type) {
        switch (type) {
            case PLAYERO_WON:
                announcer.innerHTML = 'Player <span class="playerO">O</span> WINS!!!!!!';
                break;
            case PLAYERX_WON:
                announcer.innerHTML = 'Player <span class="turn1">X</span> WINS!!!!!!';
                break;
            case TIE:
                announcer.innerText = 'Tie';
        }
        announcer.classList.remove('hide');
    }

    function changePlayer() {
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    }

    function resetBoard() {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        announcer.classList.add('hide');

        if (currentPlayer === 'O') {
            changePlayer();
        }

        tiles.forEach(box => {
            box.innerText = '';
            box.classList.remove('turn1');
            box.classList.remove('playerO');
        });
    }
});