let boxes;
let reset_button;
let span;
let highest_tile_span;
let hasWon = false;

function spawnTile() {
    const randomValue = () => Math.random() < 0.9 ? 2 : 4;
    let emptyPositions = [];

    for (let i = 0; i < boxes.length; i++) {
        if (!boxes[i].innerText) {
            emptyPositions.push(i);
        }
    }

    if (emptyPositions.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyPositions.length);
        const positionToSpawn = emptyPositions[randomIndex];
        const value = randomValue();
        const row = Math.floor(positionToSpawn / 4);
        const col = positionToSpawn % 4;
        console.log(`Spawning new tile ${value} at position (${row}, ${col})`);
        boxes[positionToSpawn].innerText = value;
        boxes[positionToSpawn].classList.add(`tile_${value}`);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    boxes = document.querySelectorAll('.box');
    reset_button = document.querySelector('#reset');
    span = document.querySelector(".actual_score");
    highest_tile_span = document.querySelector(".actual_highest");

    // Initialize position classes for all boxes
    boxes.forEach((box, index) => {
        const row = Math.floor(index / 4);
        const col = index % 4;
        box.classList.add(`tile-row${row}`, `tile-col${col}`);
    });

    reset_button.addEventListener('click', resetGame);

    spawnTile();
    spawnTile();
});

function collectTiles(start, end, step, getIndex) {
    let tiles = [];
    for (let i = start; i !== end; i += step) {
        const index = getIndex(i);
        if (boxes[index].innerText) {
            tiles.push(parseInt(boxes[index].innerText));
        }
    }
    return tiles;
}

function updateHighestTile() {
    let highest = 0;
    boxes.forEach(box => {
        const value = parseInt(box.innerText) || 0;
        highest = Math.max(highest, value);
    });
    highest_tile_span.innerText = highest;

    if (!hasWon && highest === 2048) {
        hasWon = true;
        showWinMessage();
        startConfetti();
    }
}

function showWinMessage() {
    const winOverlay = document.createElement('div');
    winOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 223, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    const winMessage = document.createElement('h1');
    winMessage.textContent = 'YOU WIN!';
    winMessage.style.cssText = `
        font-size: 5em;
        color: white;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        animation: bounce 1s infinite;
    `;

    const continueButton = document.createElement('button');
    continueButton.textContent = 'Continue Playing';
    continueButton.style.cssText = `
        position: absolute;
        top: 70%;
        padding: 15px 30px;
        font-size: 1.2em;
        background-color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    `;

    continueButton.addEventListener('click', () => {
        winOverlay.remove();
        stopConfetti();
    });

    winOverlay.appendChild(winMessage);
    winOverlay.appendChild(continueButton);
    document.body.appendChild(winOverlay);

    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
    `;
    document.head.appendChild(style);
}

function mergeTiles(tiles) {
    let moved = false;
    let mergedTiles = [];

    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i] === tiles[i + 1] && !mergedTiles.includes(tiles[i])) {
            console.log(`Merging tiles: ${tiles[i]} + ${tiles[i]} = ${tiles[i] * 2}`);
            tiles[i] *= 2;
            const currentScore = parseInt(span.innerText) || 0;
            span.innerText = currentScore + tiles[i];
            
            mergedTiles.push(tiles[i]);
            tiles.splice(i + 1, 1);
            moved = true;
        }
    }
    
    updateHighestTile();
    return moved;
}

function updateTiles(tiles, getIndex) {
    let moved = false;
    
    // Update boxes with new values
    for (let i = 0; i < tiles.length; i++) {
        const index = getIndex(i);
        const oldValue = boxes[index].innerText;
        const newValue = tiles[i].toString();
        
        if (oldValue !== newValue) {
            moved = true;
            const row = Math.floor(index / 4);
            const col = index % 4;
            console.log(`Tile at (${row}, ${col}) changed from ${oldValue || 'empty'} to ${newValue}`);
        }
        
        // Remove all previous tile classes
        boxes[index].classList.remove('tile_2', 'tile_4', 'tile_8', 'tile_16', 'tile_32', 'tile_64', 
            'tile_128', 'tile_256', 'tile_512', 'tile_1024', 'tile_2048', 'tile_4096', 'tile_8192');
        
        // Add position classes
        const row = Math.floor(index / 4);
        const col = index % 4;
        boxes[index].classList.remove(...Array.from(boxes[index].classList).filter(c => c.startsWith('tile-row') || c.startsWith('tile-col')));
        boxes[index].classList.add(`tile-row${row}`, `tile-col${col}`);
        
        // Add the new tile class
        boxes[index].innerText = tiles[i];
        boxes[index].classList.add(`tile_${tiles[i]}`);
    }

    // Clear remaining boxes
    for (let i = tiles.length; i < 4; i++) {
        const index = getIndex(i);
        if (boxes[index].innerText) {
            const row = Math.floor(index / 4);
            const col = index % 4;
            console.log(`Clearing tile at (${row}, ${col}) - was ${boxes[index].innerText}`);
        }
        boxes[index].innerText = '';
        // Remove all tile classes when clearing a box
        boxes[index].classList.remove('tile_2', 'tile_4', 'tile_8', 'tile_16', 'tile_32', 'tile_64', 
            'tile_128', 'tile_256', 'tile_512', 'tile_1024', 'tile_2048', 'tile_4096', 'tile_8192');
        boxes[index].classList.remove(...Array.from(boxes[index].classList).filter(c => c.startsWith('tile-row') || c.startsWith('tile-col')));
    }

    return moved;
}

function slide(direction) {
    let moved = false;

    const configs = {
        'left': {
            loopStart: 0,
            loopEnd: 4,
            loopStep: 1,
            getCollectIndex: (row, col) => row * 4 + col,
            getUpdateIndex: (row, i) => row * 4 + i
        },
        'right': {
            loopStart: 3,
            loopEnd: -1,
            loopStep: -1,
            getCollectIndex: (row, col) => row * 4 + col,
            getUpdateIndex: (row, i) => row * 4 + (3 - i)
        },
        'up': {
            loopStart: 0,
            loopEnd: 4,
            loopStep: 1,
            getCollectIndex: (col, row) => row * 4 + col,
            getUpdateIndex: (col, i) => i * 4 + col
        },
        'down': {
            loopStart: 3,
            loopEnd: -1,
            loopStep: -1,
            getCollectIndex: (col, row) => row * 4 + col,
            getUpdateIndex: (col, i) => (3 - i) * 4 + col
        }
    };

    const config = configs[direction];
    const isVertical = direction === 'up' || direction === 'down';
    
    for (let i = 0; i < 4; i++) {
        const tiles = collectTiles(
            config.loopStart,
            config.loopEnd,
            config.loopStep,
            (j) => config.getCollectIndex(i, j)
        );

        const mergedMoved = mergeTiles(tiles);
        const updateMoved = updateTiles(tiles, (j) => config.getUpdateIndex(i, j));
        
        moved = moved || mergedMoved || updateMoved;
    }

    if (moved) spawnTile();
}

function slideLeft() {
    slide('left');
}

function slideRight() {
    slide('right');
}

function slideUp() {
    slide('up');
}

function slideDown() {
    slide('down');
}

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
        case 'a':
            slideLeft();
            break;
        case 'ArrowRight':
        case 'd':
            slideRight();
            break;
        case 'ArrowUp':
        case 'w':
            slideUp();
            break;
        case 'ArrowDown':
        case 's':
            slideDown();
            break;
    }
});

function resetGame() {
    boxes.forEach(box => {
        box.innerText = '';
        box.classList.remove('tile_2', 'tile_4', 'tile_8', 'tile_16', 'tile_32', 'tile_64', 
            'tile_128', 'tile_256', 'tile_512', 'tile_1024', 'tile_2048', 'tile_4096', 'tile_8192');
    });
    
    span.innerText = '0';
    highest_tile_span.innerText = '0';
    hasWon = false;
    stopConfetti();
    
    spawnTile();
    spawnTile();
    updateHighestTile();
}

function startConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0 }  // This makes the confetti start from the top of the screen
    });
}