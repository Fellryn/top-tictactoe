(function() {
    let gameBoard = {
        gameBoard: [],

        init: function() {
            this.createGameBoard();
            this.cacheDom();
            this.bindEvents();
            this.render();
        },
        createGameBoard: function() {
            for (let i = 0; i < 9; i++) {
                this.gameBoard.push("-");
            }
        },
        cacheDom: function() {
            this.gameBoardEl = document.querySelector("#gameBoardContainer");
            // Other dom elements here
        },
        bindEvents: function() {
            
        },
        render: function() {
            console.log(this.gameBoard);
        }
    };
    gameBoard.init();
})()

(function() {

})();