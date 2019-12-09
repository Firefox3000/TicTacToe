let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

let available = [];

let players = ['X', 'O'];

let human = 'O';
let ai = 'X';

let currentPlayer;

/*Minmax vars*/
var boardString = [''];
var score = 0;

function setup() {
    // currentPlayer = Math.floor(Math.random() * players.length);
    currentPlayer = 0; //x starts (Human)

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            available.push([i, j]);
        }
    }

    for (let i = 0; i < 9; i++) {
        boardString[i] = '';
    }

    console.log(boardString);

    //make board clickable
    let spots = document.querySelectorAll('.col');
    for (let i = 0; i < spots.length; i++) {
        spots[i].addEventListener('click', playerClick);
    }
}
setup();

function playerClick(e) {
    if (currentPlayer == 0) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (e.currentTarget == document.querySelectorAll('.row')[j].children[i] && board[i][j] == '') {
                    document.querySelectorAll('.row')[j].children[i].innerHTML = players[currentPlayer];

                    board[i][j] = players[currentPlayer];

                    let index = [i, j];

                    for (let c = 0; c < available.length; c++) {
                        if (JSON.stringify(available[c]) == JSON.stringify(index)) {
                            available.splice(c, 1);
                        }
                    }
                    console.log(available);
                    console.log(board);

                    checkWinner();
                    currentPlayer = (currentPlayer + 1) % players.length;

                    // computerTurn();
                    bestMove();
                }
            }
        }
    }
}

/*

function computerTurn() {
    if (currentPlayer == 1) {
        minmax();
        /*
        let index = Math.floor(Math.random() * available.length); //pick random spot on board

        let spot = available.splice(index, 1)[0];
        board[spot[0]][spot[1]] = players[currentPlayer];
        // console.log(board);
        */


        /*
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let spot = board[i][j];

                if (spot == players[0]) {
                    document.querySelectorAll('.row')[j].children[i].innerHTML = 'X';
                } else if (spot == players[1]) {
                    document.querySelectorAll('.row')[j].children[i].innerHTML = 'O';
                }
            }
        }
        checkWinner();
        currentPlayer = (currentPlayer + 1) % players.length //update current player
    }
}

*/

function equals3(a, b, c) {
    return (a == b && b == c && a != '');
}

function checkWinner() {
    let winner = null;

    //horizontal
    for (let i = 0; i < 3; i++) {
        if (equals3(board[i][0], board[i][1], board[i][2])) {
            winner = board[i][0];
            console.log('horizon');
        }
    }

    //vertical
    for (let i = 0; i < 3; i++) {
        if (equals3(board[0][i], board[1][i], board[2][i])) {
            winner = board[0][i];
            console.log('vertical');
        }
    }

    //diagonal
    if (equals3(board[0][0], board[1][1], board[2][2])) {
        winner = board[0][0];
        console.log('diagonal');
    }

    if (equals3(board[0][2], board[1][1], board[2][0])) {
        winner = board[0][2];
        console.log('diagonal');
    }

    if (winner == null && available.length == 0) {
        console.log('tie');
    } else if (winner != null) {
        console.log(winner);
        available = [];
    }



    if (winner == 'O') {
        return 1;
    }

    if (winner == 'X') {
        return -1;
    }

    if (winner == null) {
        return 0;
    }
}


/*
function stringBoard() {
    boardString = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            boardString.push(board[i][j])
        }
    }

    console.log('board stringie');
    console.log(boardString);
    return(boardString);
}

*/

// boardString = stringBoard();

/*
function minmax(boardString, player) {

    if (checkWinner != null) {
        score = checkWinner;
    }

    let winner = checkWinner;
    // let player = players[(currentPlayer + 1) % players.length];
    if (winner == null) {

        for (let i = 0; i < 9; i++) {
            if (boardString[i] == '') {
                console.log('boardString');
                var newBoard = boardString;
                newBoard[i] = player;

                console.log(newBoard);
                let scoreMove = [];
                scoreMove[i] = minmax(newBoard, player);

                console.log(scoreMove);

                // let scoreMove[i] = -self.minmax restart minmax function

                if (scoreMove > score) {
                    score = scoreMove;
                    nextMove = i;
                }
            }
        }
    }
    return score;
    console.log(score);
}
*/


function bestMove() {
    let bestScore = -Infinity;
    let move = [];

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            // let spot = board[i][j];

            if (board[i][j] == '') {
                board[i][j] = ai;
                let score = miniMax(board, 0, true);
                board[i][j] = '';
                if (score > bestScore) {
                    bestScore = score;
                        move = [i, j];
                }
            }
        }
    }
    board[move[0]][move[1]] = ai;
    currentPlayer = human;
}

let scores = {  
    X: +1,
    O: -1,
    tie: 0
}

function miniMax(board, depth, isMaximizing) {
    let result = checkWinner();

    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == '') {
                    board[i][j] = ai;
                    let score = miniMax(board, depth++, false);
                    board[i][j] = '';

                    bestScore = max(score, bestScore);
                }
            }
        } 
        return bestScore;

    } else {
        let bestScore = +Infinity

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == '') {
                    board[i][j] = human;
                    let score = miniMax(board, depth++, true);
                    board[i][j] = '';

                    bestScore = min(score, bestScore)
                }
            }
        }
        return bestScore;
    }
}



/*
function minmax(board, player) {
    for (let i = 0; i < 9; i++) {
        if (board[i] == player.blanc) {
            var newBoard = board;
            newBoard[i] = player;
            let scoreMove = -self.minmax(newBoard, opponent)

            if (scoreMove > score) {
                score = scoreMove;
                move = 1;
            }
        }
    }
    return score;
}
*/

/*
human = -1
tie = 0
computer = 1
*/

/*
// checkwinner
function name(){
for (let i = 0; i < 9; i++) { //check for empty spots onboard
    if (board[i] == '') {  //if empty spot
        var newBoard = board; //copy the board
        newBoard[i] = currentPlayer;
        // let scoreForTheMove[i]; // = -self.minmax restart minmax function
        if (scoreForTheMove > score) { // check if move is better
            score = scoreForTheMove; //update move
            move = i; //save move spot
        } 
    }
}
if (move == -1) {
    return 0 //draw
}
return score;
}
*/

// function minmax(board, player)


/*
function minmax(position, depth, alpha, beta, maxPlayer) {
    let winner = checkWinner;
    if (winner != null) {

        if (maxPlayer) {
            maxEval = -Infinity;
            	// for each

            eval = minmax(child, depth-1, alpha, beta, false);
            alpha = max(alpha, eval);
            if (beta <= alpha) {
                break;
            }
            return maxEval;


        } else {
            minEval = +Infinity;
            // for each child of position
            eval = minmax(child, depth-1, alpha, beta, true);
            minEval = min(minEval, eval);
            if (beta <= alpha) {
                break;
            }
            return minEval;
        }
    }
}
*/
