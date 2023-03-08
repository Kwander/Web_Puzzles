// Wait for the page to load before initializing the puzzles
document.addEventListener("DOMContentLoaded", function () {
    // Define your puzzle components here
    var puzzle1 = document.getElementById("puzzle1");
    var puzzle2 = document.getElementById("puzzle2");
    var puzzle3 = document.getElementById("puzzle3");

    // Define any functions you need to create or manipulate the puzzles
    function createPuzzle(puzzleId, puzzleType) {
        // Add puzzle creation logic here
    }

    // Call your functions to create and populate the puzzles
    createPuzzle(puzzle1, "sudoku");
    createPuzzle(puzzle2, "jigsaw");
    createPuzzle(puzzle3, "wordsearch");
});