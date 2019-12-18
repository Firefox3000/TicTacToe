let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

let human = 'X';
let ai = 'O';

let currentPlayer = human;

//make board clickable
for (let i = 0; i < document.querySelectorAll('.col').length; i++) {
    document.querySelectorAll('.col')[i].addEventListener('click', playerClick)
}

//restart function
document.querySelector('.restart').addEventListener('click', () => {
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    currentPlayer = human;
    document.querySelector('.winner').innerHTML = '.';

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            document.querySelectorAll('.row')[i].children[j].innerHTML = '';
        }
    }
});

function playerClick(e) {
    if (currentPlayer == human) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (e.currentTarget == document.querySelectorAll('.row')[i].children[j] && board[i][j] == '') {
                    // update board and screen 
                    document.querySelectorAll('.row')[i].children[j].innerHTML = human;
                    board[i][j] = human;

                    checkWinner(true);
                    currentPlayer = ai;

                    let available = [];
                    for (let i = 0; i < 3; i++) {
                        for (let j = 0; j < 3; j++) {
                            if (board[i][j] == '') {
                                available.push([i, j]);
                            }
                        }
                    }

                    if (available.length > 0) {
                        if (document.querySelector('#slider').value >= Math.random()) {
                            // ai move
                            bestMove();
                        } else {
                            //random move
                            console.log('random');
                            //choose empty spot
                            let spot = available[Math.floor(Math.random() * available.length)];

                            // board and visual
                            board[spot[0]][spot[1]] = ai;
                            document.querySelectorAll('.row')[spot[0]].children[spot[1]].innerHTML = ai;
                        }
                    }
                    checkWinner(true);
                    currentPlayer = human;
                }
            }
        }
    }
}

document.querySelector('#slider').addEventListener('input', () => {
    document.querySelector('.sliderVal').innerHTML = Math.round(document.querySelector('#slider').value * 100);
});

function equals3(a, b, c) {
    return (a == b && b == c && a != '');
}

function checkWinner(draw) {
    let winner = null;
    //horizontal && vertical
    for (let i = 0; i < 3; i++) {
        if (equals3(board[i][0], board[i][1], board[i][2])) {
            winner = board[i][0];
        }

        //vertical
        if (equals3(board[0][i], board[1][i], board[2][i])) {
            winner = board[0][i];
        }
    }

    //diagonal
    if (equals3(board[0][0], board[1][1], board[2][2])) {
        winner = board[0][0];
    }

    if (equals3(board[0][2], board[1][1], board[2][0])) {
        winner = board[0][2];
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
    }

    if (draw) {
        if (winner == 'X' || winner == 'O' || winner == 'tie') {
            if (winner == 'tie') {
                document.querySelector('.winner').innerHTML = 'tie';
            } else {
                document.querySelector('.winner').innerHTML = 'Winner: ' + winner;
            }
            return
        }
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
                // let score = minmax(board, 0, -Infinity, +Infinity, false); 

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

    checkWinner(true);
}

let scores = {
    O: 1,
    X: -1,
    tie: 0
}

// var miniMaxChecks = 0;
//60k

function miniMax(board, depth, isMaximizing) {
    let result = checkWinner(false);
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
                    board[i][j] = '';

                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}


/*
//Mini max with alpha beta pruning

// minmax(board, depth, -Infinity, +Infinity, isMaximizing) 

function minmax(board, depth, alpha, beta, isMaximizing) {
    let result = checkWinner(false);
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let maxEval = -Infinity;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == '') {

                    board[i][j] = ai;
                    let eval = minmax(board, depth + 1, alpha, beta, false);
                    board[i][j] = '';

                    miniMaxChecks++;

                    alpha = Math.max(alpha, eval);
                    if (beta <= alpha) {
                        break;
                    }                
                }
            }
        }
        return maxEval
    } else {
        let minEval = +Infinity;
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == '') {
                    board[i][j] = human;
                    let eval = minmax(board, depth + 1, alpha, beta, true);
                    board[i][j] = '';
                    
                    miniMaxChecks++;

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
*/