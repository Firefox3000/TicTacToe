let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
];

const human = 'X';
const ai = 'O';

let currentPlayer = human;

//make board clickable
for (const i of document.querySelectorAll('.col')) {
  i.addEventListener('click', playerClick);
}

//restart function
document.querySelector('.restart').addEventListener('click', () => {
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
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
        if (
          e.currentTarget == document.querySelectorAll('.row')[i].children[j] &&
          board[i][j] == ''
        ) {
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
              computerPick();
            } else {
              //random move
              // choose empty spot
              let spot =
                available[Math.floor(Math.random() * available.length)];

              // board and visual
              board[spot[0]][spot[1]] = ai;
              document.querySelectorAll('.row')[spot[0]].children[
                spot[1]
              ].innerHTML = ai;
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
  document.querySelector('.sliderVal').innerHTML = Math.round(
    document.querySelector('#slider').value * 100
  );
});

function equals3(a, b, c) {
  return a == b && b == c && a != '';
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
      return;
    }
  }
  return winner;
}

let scores = {
  O: 1,
  X: -1,
  tie: 0,
};

function computerPick() {
  let bestScore = -Infinity;

  let moves = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        moves.push([i, j]);
      }
    }
  }

  // randomize array for more diverse outcomes
  moves.sort(() => 0.5 - Math.random());

  for (const i of moves) {
    board[i[0]][i[1]] = ai;
    let score = alphaBetaMiniMax(board, 0, -Infinity, +Infinity, false);
    board[i[0]][i[1]] = '';

    if (score > bestScore) {
      bestScore = score;
      move = {
        i: i[0],
        j: i[1],
      };
    }
  }

  // draw best move
  board[move.i][move.j] = ai;
  document.querySelectorAll('.row')[move.i].children[move.j].innerHTML = ai;

  currentPlayer = human;

  checkWinner(true);
}

function alphaBetaMiniMax(board, depth, alpha, beta, isMaximizing) {
  // alpha beta pruning seems to be 10x faster PogChamp
  let result = checkWinner(false);
  if (result !== null) {
    return scores[result];
  }

  let bestScore = isMaximizing ? -Infinity : +Infinity;

  let moves = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        moves.push([i, j]);
      }
    }
  }

  for (const i of moves) {
    board[i[0]][i[1]] = isMaximizing ? ai : human;
    let score = alphaBetaMiniMax(board, depth + 1, alpha, beta, !isMaximizing);
    board[i[0]][i[1]] = '';

    if (isMaximizing) {
      bestScore = Math.max(score, bestScore);
      alpha = Math.max(alpha, score);
    } else {
      bestScore = Math.min(score, bestScore);
      beta = Math.min(beta, score);
    }

    if (alpha >= beta) {
      break;
    }
  }

  return bestScore;
}
