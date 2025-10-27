const gameBoard = (function() {
    const gameBoardArr = ["", "", "", "", "", "", "", "", ""];

    function resetBoardState() {
        gameBoardArr.fill("", 0, 9);
    }

    return {
        gameBoardArr,
        resetBoardState
    };
})();

function createPlayer(name, playerNumber) {
    let score = 0;

    const increaseScore = () => score++;
    return {name, playerNumber, score};
}


const gameController = (function() {
    let player1;
    let player2;
    let currentPlayer;
    let turns = 0;
    let gameIsOver = false;

    console.log(gameBoard);

    function setPlayerNames(n1, n2) {
        player1 = createPlayer(n1, 1);
        player2 = createPlayer(n2, 2);
    }

    function playNextTurn() {
        currentPlayer === undefined ?
         currentPlayer = player1 :
          currentPlayer === player1 ?
           currentPlayer = player2 :
            currentPlayer = player1;

        if (!gameIsOver) {
            domInteraction.highlightPlayer(currentPlayer === player1 ? 1 : 2);
            domInteraction.showPopover(`It's ${currentPlayer === player1 ? player1.name : player2.name}'s turn!`);
        }
        turns++;
    }

    function placePiece(pos) {
        if (gameIsOver) {
            return;
        }
        if (pos > gameBoard.gameBoardArr.length || pos <= -1) {
            console.log("This is not a valid position");
            return;
        }
        // gameBoard.gameBoardArr[pos] === "" ? currentPlayer === player1 ? "x" : "o" : return;
        if (gameBoard.gameBoardArr[pos] === "") {
            gameBoard.gameBoardArr[pos] = currentPlayer === player1 ? "x" : "o";
        } 
        else {
            domInteraction.showPopover("This square is filled, choose another!");
            return;
        }
        checkWinState();
        playNextTurn();
    }

    function checkWinState() {
        let winner;
        const winningCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (const [a, b, c] of winningCombos) {
            if (gameBoard.gameBoardArr[a] && gameBoard.gameBoardArr[a] === gameBoard.gameBoardArr[b]
                && gameBoard.gameBoardArr[a] === gameBoard.gameBoardArr[c]) {
                    winner = gameBoard.gameBoardArr[a];
                }
        }

        if (winner !== undefined) {
            if (winner === "x") {
                player1.score++;
                domInteraction.showPopover(player1.name + " won!");
                domInteraction.highlightPlayer(1);
            } else {
                player2.score++;
                domInteraction.showPopover(player2.name + " won!");
                domInteraction.highlightPlayer(2);
            }
            gameIsOver = true;
            domInteraction.setRestartButton(true);
            domInteraction.updatePlayerBoards();
        } else if (turns > 7) {
            console.log("Draw!")
            gameIsOver = true;
            domInteraction.setRestartButton(true);
            domInteraction.highlightPlayer(-1);
        }
    }

    function createNewGame() {
        turns = 0;
        gameBoard.resetBoardState();
        domInteraction.render();
        gameIsOver = false;
        domInteraction.updatePlayerBoards();
        domInteraction.showPopover(`It's ${currentPlayer === player1 ? player1.name : player2.name}'s turn!`)
        domInteraction.highlightPlayer(currentPlayer === player1 ? 1 : 2);
    }

    function getPlayerOne() {
        return player1;
    }

    function getPlayerTwo() {
        return player2;
    }

    return {
        setPlayerNames,
        placePiece,
        createNewGame,
        getPlayerOne,
        getPlayerTwo
    }
})();



const domInteraction = (function() {
    let gameBoardContainer;
    let form;
    let restartButton;
    let playerOneBoard;
    let playerTwoBoard;
    let popover;

    function cacheDom() {
        gameBoardContainer = document.querySelector("#gameBoardContainer");
        form = document.querySelector("form");
        restartButton = document.querySelector("#restartButton");
        playerOneBoard = document.querySelector("#playerOneBoard");
        playerTwoBoard = document.querySelector("#playerTwoBoard");
        popover = document.querySelector("#popover");
    }

    function render() {
        gameBoardContainer.innerHTML = "";
        for (let i = 0; i < gameBoard.gameBoardArr.length; i++) {
            gameBoardContainer.innerHTML += `<div data-id="${i}" class="cell">${gameBoard.gameBoardArr[i]}</div>`;
        }
    }

    function showPopover(text) {
        popover.classList.remove("popover-hidden")
        popover.textContent = text;
        setTimeout(() => {
            popover.classList.add("popover-hidden")
        }, 1000);
    }

    function highlightPlayer(player) {
        if (player === -1) {
            playerOneBoard.classList.remove("highlight");
            playerTwoBoard.classList.remove("highlight");
            return;
        }

        playerOneBoard.classList.remove("highlight");
        playerTwoBoard.classList.remove("highlight");

        if (player == 1) {
            playerOneBoard.classList.add("highlight");
        } else {
            playerTwoBoard.classList.add("highlight");
        }
    }

    function updatePlayerBoards() {
        playerOneBoard.classList.remove("hidden");
        playerTwoBoard.classList.remove("hidden");

        let playerOneObj = gameController.getPlayerOne();
        let playerTwoObj = gameController.getPlayerTwo();

        playerOneBoard.querySelector("h3").textContent = playerOneObj.name;
        playerOneBoard.querySelector("p:last-child").textContent = "Score: " + playerOneObj.score;

        playerTwoBoard.querySelector("h3").textContent = playerTwoObj.name;
        playerTwoBoard.querySelector("p:last-child").textContent = "Score: " + playerTwoObj.score;
    }

    function setRestartButton(active) {
        if (active === true) {
            restartButton.classList.remove("hidden");
        } else {
            restartButton.classList.add("hidden");
        }
    }

    function bindRestartButton () {
        restartButton.addEventListener('click', () => {
            gameController.createNewGame();
            setRestartButton(false);
            updatePlayerBoards();
        });
    }

    function bindPlayerDialog () {
        form.addEventListener('submit', (e) => {
            const data = Object.fromEntries(new FormData(form));
            if (data.playerOneName === "" || data.playerTwoName === "") {
                alert("Please enter a name for both players.");
                e.preventDefault();
                return;
            }
            gameController.setPlayerNames(data.playerOneName, data.playerTwoName);
            render();
            bindGameBoard();
            updatePlayerBoards();
        });
    }

    function bindGameBoard() {
        gameBoardContainer.addEventListener('click', (e) => {
            const cell = e.target.closest('.cell');
            if (!cell) return;
            gameController.placePiece(cell.dataset.id);
            render();
        });
    }

    cacheDom();
    bindPlayerDialog();
    bindRestartButton();

    return {
        render,
        bindGameBoard,
        setRestartButton,
        updatePlayerBoards,
        showPopover,
        highlightPlayer
    }
})();

