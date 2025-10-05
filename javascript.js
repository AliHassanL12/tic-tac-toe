/*
GAME CONTROLLER INITIALISES VALUES
CREATE PLAYER X AND PLAYER O
CURRENT INITIAL PLAYER IS X 
GAMECONTROLLER STARTS GAME
TAKE INPUT FROM USER FOR POSITION
PLACE CURRENT PLAYER MARKER IN POSITION
SWITCH PLAYERS
START ANOTHER ROUND
IF EITHER PLAYER WINS OR PLACES IN GAMEBOARD RUN OUT
END GAME AND ANNOUNCE WINNER
RESET BOARD

*/
const gameboard = (function() {
    let gameboard = ['x', 'o', 'x','', '', '','', '', ''];

    function writeToBoard(pos, marker) {
        pos = pos - 1; // account for how indexes are counted in arrays
        gameboard.splice(pos, 1, marker);
        displayBoard();
        domDisplay.redrawDisplay()
        gameController.checkWin(gameboard);
    }

    function displayBoard() {
        console.log(gameboard);
    }

    function resetBoard() {
        gameboard = ['', '', '','', '', '','', '', ''];
    }

    function getBoard() {
        return gameboard;
    }

    return {
        writeToBoard, 
        displayBoard,
        resetBoard,
        getBoard
    }
})();

function createPlayer(marker) {

    function placeMarker(pos) {
        gameboard.writeToBoard(pos, marker)
    }

    return {
        placeMarker
    }
}

const gameController = (function() {

    function checkWin(board) {
        const row = checkRow(board);
        const column = checkColumn(board);
        const diagonal = checkDiagonal(board);
        const draw = checkDraw(board);
        if (row || column || diagonal) {
            console.log("My, my, we've got ourselves a straggler")
        } else if (draw) {
            console.log('draw');
        }
    }

    function checkRow(board) {
        for (let i = 0; i < board.length; i += 3) {
            // check if row is all equal to one another and if so, return true;
            if (board[i] === board[i+1] && board[i+1] === board[i+2] && board[i]) {
                return true;
            }
        }
    }

    function checkColumn(board) {
        for (let i = 0; i <= 2; i++) {
            if (board[i] === board[i+3] && board[i+3] === board[i+6] && board[i]) {
                return true;
            }
        }
    }

    function checkDiagonal(board) {
        for (let i = 0; i <= 2; i += 2) {
            if (board[i] === board[i+4] && board[i+4] === board[i+8] && board[i]) {
                return true;
            } else if (board[i+2] === board[i+4] && board[i+4] === board[i+6] && board[i+2]) {
                return true;
            }
        }
    }

    function checkDraw(board) {
        if (!board.includes("")) {
            return true;
        }
    }

    return {
        checkWin
    }
})();

const domDisplay = (function() {
    function populateDisplay() {
        const container = document.querySelector('.container');
        board = gameboard.getBoard();
        for (let i = 0; i <= board.length; i++) {
            const div = document.createElement('div');
            div.textContent = board[i];
            div.classList.add('cell');
            container.appendChild(div);
        }

        attachListener();
    }

    function attachListener() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell) => {
            cell.addEventListener('click', findIndex)
        })
    }

    function findIndex() {
        const index = Array.from(this.parentNode.children).indexOf(this)
        x.placeMarker(index+1);
    }

    function redrawDisplay() {
        const container = document.querySelector('.container');
        while (container.firstChild) {
            container.removeChild(container.lastChild);
        }
        populateDisplay();
    }

    return {
        populateDisplay, 
        redrawDisplay
    }
})();

const x = createPlayer('x');
const o = createPlayer('o');

domDisplay.populateDisplay()
/*
Winning conditions:
3 in a row (1,2,3 - 4,5,6 - 7,8,9)
3 in a column (1,4,7 - 2,5,8 - 3, 6, 9)
3 in a diagonal (1,5,9 - 3,5,7)
*/

