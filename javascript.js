const gameboard = (function() {
    let gameboard = ['', '', '','', '', '','', '', ''];

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

    function checkCellAvailability(i) {
        if (gameboard[i-1]) return false; 
        return true;
    }
    return {
        writeToBoard, 
        displayBoard,
        resetBoard,
        getBoard,
        checkCellAvailability
    }
})();

function createPlayer(marker) {

    function placeMarker(pos) {
        gameboard.writeToBoard(pos, marker)
    }

    function getMarker() {
        return marker;
    }

    return {
        placeMarker,
        getMarker
    }
}

const gameController = (function() {

    const x = createPlayer('x');
    const o = createPlayer('o');

    let currentPlayer = x;

    function checkWin(board) {
        const row = checkRow(board);
        const column = checkColumn(board);
        const diagonal = checkDiagonal(board);
        const draw = checkDraw(board);
        if (row || column || diagonal) {
            domDisplay.announceWinner(currentPlayer.getMarker());
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
        if (board[0] === board[4] && board[4] === board[8] && board[0]) {
            return true;
        } else if (board[2] === board[4] && board[4] === board[6] && board[2]) {
            return true;
        }
    }

    function checkDraw(board) {
        if (!board.includes("")) {
            return true;
        }
    }

    function playRound(pos) {
        if (!gameboard.checkCellAvailability(pos)) {
            domDisplay.writeMessage('That cell is already taken! Choose another');
            return;
        }
        domDisplay.writeMessage('');
        currentPlayer.placeMarker(pos);
        alternatePlayers();
    }

    function alternatePlayers() {
        currentPlayer = (currentPlayer === x) ? o : x;
    }
    return {
        checkWin,
        playRound
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
        const index = Array.from(this.parentNode.children).indexOf(this) + 1;
        gameController.playRound(index);
    }

    function redrawDisplay() {
        const container = document.querySelector('.container');
        while (container.firstChild) {
            container.removeChild(container.lastChild);
        }
        populateDisplay();
    }

    function writeMessage(msg) {
        const messageText = document.querySelector('.msg');
        messageText.textContent = msg;
    }

    function announceWinner(winner) {
        const winText = document.querySelector('.msg');
        winText.textContent = `The winner is player ${winner}`
    }

    return {
        populateDisplay, 
        redrawDisplay,
        announceWinner,
        writeMessage
    }
})();

domDisplay.populateDisplay()


