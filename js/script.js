let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

let human = 'O';
let ai = 'X';

let currentPlayer = human;

function setup() {
    // currentPlayer = Math.floor(Math.random() * players.length);
    // currentPlayer = 0; //x starts (Human)

    //make board clickable
    for (let i = 0; i < document.querySelectorAll('.col').length; i++) {
        document.querySelectorAll('.col')[i].addEventListener('click', playerClick)
    }
}
setup();

function playerClick(e) {
    if (currentPlayer == human) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (e.currentTarget == document.querySelectorAll('.row')[i].children[j] && board[i][j] == '') {

                    // update board and screen 
                    document.querySelectorAll('.row')[i].children[j].innerHTML = human;
                    board[i][j] = human;

                    let x = checkWinner()
                    if (x == 'X' || x == 'O' || x == 'tie') {
                        if (x == 'tie') {
                            document.querySelector('.winner').innerHTML = 'tie';
                        } else {
                            document.querySelector('.winner').innerHTML = 'Winner: ' + x;
                        }
                        return
                    }

                    currentPlayer = ai;
                    bestMove();

                    /*
                    //update available array
                    let index = [i, j];

                    for (let c = 0; c < available.length; c++) {
                        if (JSON.stringify(available[c]) == JSON.stringify(index)) {
                            available.splice(c, 1);
                        }
                    }
                    */
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

    //horizontal && vertical
    for (let i = 0; i < 3; i++) {
        if (equals3(board[i][0], board[i][1], board[i][2])) {
            winner = board[i][0];
            return winner;
        }

        //vertical
        if (equals3(board[0][i], board[1][i], board[2][i])) {
            winner = board[0][i];
            return winner;
        }
    }

    //diagonal
    if (equals3(board[0][0], board[1][1], board[2][2])) {
        winner = board[0][0];
        return winner;
    }

    if (equals3(board[0][2], board[1][1], board[2][0])) {
        winner = board[0][2];
        return winner;
    }

    let openSpots = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == '') {
                openSpots++;
            }
        }
    }

    if (winner == null && openSpots == 0) {
        winner = 'tie';
        return winner;
    }

    return winner;
}


function bestMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == '') {
                board[i][j] = ai;
                let score = miniMax(board, 0, false);
                board[i][j] = '';

                if (score > bestScore) {
                    bestScore = score;
                    move = {
                        i,
                        j
                    };
                }
            }
        }
    }

    board[move.i][move.j] = ai;
    document.querySelectorAll('.row')[move.i].children[move.j].innerHTML = ai;

    currentPlayer = human;

    let x = checkWinner()
    if (x == 'X' || x == 'O' || x == 'tie') {
        if (x == 'tie') {
            document.querySelector('.winner').innerHTML = 'tie';
        } else {
            document.querySelector('.winner').innerHTML = 'Winner: ' + x;
        }
        return
    }
}

let scores = {
    X: 1,
    O: -1,
    tie: 0
}

function miniMax(board, depth, isMaximizing) {
    let result = checkWinner();
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == '') {
                    board[i][j] = ai;
                    let score = miniMax(board, depth + 1, false);
                    board[i][j] = '';

                    console.log('check');

                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = +Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == '') {
                    board[i][j] = human;
                    let score = miniMax(board, depth + 1, true);

                    console.log('check');

                    board[i][j] = '';

                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}



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


// minmax(board, depth, -Infinity, +Infinity, isMaximizing) 



function minmax(board, depth, alpha, beta, isMaximizing) {
    let result = checkWinner();
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        maxEval = -Infinity;
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == '') {

                    board[i][j] = ai;
                    eval = minmax(board, depth + 1, alpha, beta, false);
                    board[i][j] = '';

                    alpha = Math.max(aplha, eval);
                    if (beta <= alpha) {
                        break;
                    }                
                }
            }
        }
        return maxEval
    } else {
        maxEval = +Infinity;
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == '') {

                    eval = minmax(board, depth + 1, alpha, beta, true);
                    
                    beta = Math.min(beta, eval);
                    if (beta <= alpha) {
                        break;
                    }                
                }
            }
        }
        return minEval
    }
}

/*
let bestScore = -Infinity;
for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (board[i][j] == '') {
            board[i][j] = ai;
            let score = miniMax(board, depth + 1, false);
            board[i][j] = '';

            bestScore = Math.max(score, bestScore);
        }
    }
}
return bestScore;
*/