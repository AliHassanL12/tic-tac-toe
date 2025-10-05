
const gameboard = (function() {
    let gameboard = ['', '', '','', '', '','', '', ''];

    function writeToBoard(pos, marker) {
        pos = pos - 1; // account for how indexes are counted in arrays
        gameboard.splice(pos, 0, marker);
        displayBoard();
    }

    function displayBoard() {
        console.log(gameboard);
    }

    function resetBoard() {
        gameboard = ['', '', '','', '', '','', '', ''];
    }
    return {
        writeToBoard, 
        displayBoard,
        resetBoard
    }
})();