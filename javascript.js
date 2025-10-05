const gameboard = (function() {
    let gameboard = ['', '', '','', '', '','', '', ''];

    function writeToBoard(pos, marker) {
        pos = pos - 1; // account for how indexes are counted in arrays
        gameboard.splice(pos, 1, marker);
        domDisplay.redrawDisplay()
        gameController.checkWin(gameboard);
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
        resetBoard,
        getBoard,
        checkCellAvailability
    }
})();

function createPlayer(marker) {

    let playerName = null; 

    function placeMarker(pos) {
        gameboard.writeToBoard(pos, marker)
    }

    function getMarker() {
        return marker;
    }

    function setName(name) {
        playerName = name;
    }

    function getName() {
        return playerName;
    }
    return {
        placeMarker,
        getMarker,
        setName,
        getName
    }
}

const gameController = (function() {

    let gameOver = true;

    const x = createPlayer('x');
    const o = createPlayer('o');

    let currentPlayer = x;

    function setPlayerNames(fName, sName) {
        x.setName(fName);
        o.setName(sName);
    }

    function checkWin(board) {
        const row = checkRow(board);
        const column = checkColumn(board);
        const diagonal = checkDiagonal(board);
        const draw = checkDraw(board);
        if (row || column || diagonal) {
            domDisplay.announceWinner(currentPlayer.getName());
            endGame();
        } else if (draw) {
            domDisplay.writeMessage('Game Over. Draw.');
            endGame();
        }
    }

    function endGame() {
        gameOver = true;
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

    function startGame() {
        gameOver = false;
        domDisplay.removeStartButton();
        domDisplay.populateDisplay();
        domDisplay.showForm();
    }

    function restartGame() {
        if (gameNotStarted()) return;
        gameboard.resetBoard();
        currentPlayer = x;
        gameOver = false;
        domDisplay.redrawDisplay();
        domDisplay.writeMessage(`Start by clicking on a cell - ${currentPlayer.getName()}'s turn`);
    }
    
    function gameNotStarted() {
        if (gameOver === true && !currentPlayer.getName()) {
            domDisplay.writeMessage('What you restarting a game that you haven\'t even started for? Click START.');
            return true;
        }
    }

    function getGameOver() {
        return gameOver;
    }
    return {
        checkWin,
        playRound,
        startGame,
        setPlayerNames,
        restartGame, 
        getGameOver
    }
})();

const domDisplay = (function() {
    function populateDisplay() {
        const container = document.querySelector('.container');
        const board = gameboard.getBoard();
        for (let i = 0; i < board.length; i++) {
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
            cell.addEventListener('click', checkPlacement)
        })

        const enterBtn = document.querySelector('.enter');
        enterBtn.addEventListener('click', extractNames);

        const restartBtn = document.querySelector('.restart');
        restartBtn.addEventListener('click', gameController.restartGame);
    }

    function extractNames(event) {
        const form = document.querySelector('.form');
        if (!form.checkValidity()) return;
        event.preventDefault();
        const playerOne = document.querySelector('#playerOne');
        const playerTwo = document.querySelector('#playerTwo');

        const playerOneName = playerOne.value;
        const playerTwoName = playerTwo.value;

        gameController.setPlayerNames(playerOneName, playerTwoName);
        closeDialog();
        writeMessage('');
    }

    function closeDialog() {
        const dialog = document.querySelector('.dialog');
        dialog.close();
    }

    function checkPlacement() {
        if (gameController.getGameOver()) return; 

        const index = Array.from(this.parentNode.children).indexOf(this) + 1;

        if (gameboard.checkCellAvailability(index)) gameController.playRound(index);
        else domDisplay.writeMessage('That cell is already taken! Choose another');
        
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

    function showForm() {
        const dialog = document.querySelector('.dialog');
        dialog.showModal();
    }

    function removeStartButton() {
        if(!startBtn) return;
        startBtn.remove();
    }

    const startBtn = document.querySelector('.start');
    startBtn.addEventListener('click', gameController.startGame);


    const restartBtn = document.querySelector('.restart');
    restartBtn.addEventListener('click', gameController.restartGame);
    return {
        populateDisplay, 
        redrawDisplay,
        announceWinner,
        writeMessage,
        showForm,
        removeStartButton
    }
})();

