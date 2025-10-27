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

    console.log(gameBoard);

    function getPlayerNames() {
        player1 = createPlayer(prompt("player 1 name"), 1);
        player2 = createPlayer(prompt("player 2 name"), 2);
    }

    function playNextTurn() {
        currentPlayer === undefined ?
         currentPlayer = player1 :
          currentPlayer === player1 ?
           currentPlayer = player2 :
            currentPlayer = player1;
        turns++;
    }

    function placePiece(pos) {
        if (pos > gameBoard.gameBoardArr.length || pos <= -1) {
            console.log("This is not a valid position");
            return;
        }
        // gameBoard.gameBoardArr[pos] === "" ? currentPlayer === player1 ? "x" : "o" : return;
        if (gameBoard.gameBoardArr[pos] === "") {
            gameBoard.gameBoardArr[pos] = currentPlayer === player1 ? "x" : "o";
        } 
        else {
            console.log("This spot is taken, choose another!");
            return;
        }
        checkWinState();
        playNextTurn();
        console.log(gameBoard.gameBoardArr);
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
            console.log(`The winner is: ${winner === "x" ? "Player one!" : "Player two!"}`);
            createNewGame();
        } else if (turns > 7) {
            console.log("Draw!")
            createNewGame();
        }
    }

    function createNewGame() {
        turns = 0;
        gameBoard.resetBoardState();
    }

    return {
        getPlayerNames,
        placePiece
    }
})();

const domInteraction = (function() {
    let gameBoardContainer;
    // let cells;

    function cacheDom() {
        gameBoardContainer = document.querySelector("#gameBoardContainer");
    }

    function render() {
        gameBoardContainer.innerHTML = "";
        for (let i = 0; i < gameBoard.gameBoardArr.length; i++) {
            gameBoardContainer.innerHTML += `<div data-id="${i}" class="cell">${gameBoard.gameBoardArr[i]}</div>`;
        }

        // for (let cell of gameBoard.gameBoardArr) {
        //     gameBoardContainer.innerHTML += `<div data-id="${gameBoard.gameBoardArr.indexOf(cell)}">${cell}</div>`
        // }
    }

    // function cacheCells() {
    //     cells = gameBoardContainer.querySelectorAll(".cell");
    // }

    function bindEvents() {
        gameBoardContainer.addEventListener('click', (e) => {
            const cell = e.target.closest('.cell');
            if (!cell) return;
            gameController.placePiece(cell.dataset.id);
            render();
        });
    }

    cacheDom();
    render();
    // cacheCells();
    bindEvents();

    return {
        render,
        cells
    }
})();

