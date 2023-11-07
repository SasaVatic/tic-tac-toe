import { useState } from 'react';

function Square({ value, onSquareClick, style }) {
  return (
    <button className="square" onClick={onSquareClick} style={style}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  let status;

  if (!winner && squares.every((square) => square !== null)) {
    status = 'Draw';
  } else if (winner) {
    status = 'Winner: ' + winner.sign;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  function handleClick(i) {
    if (squares[i] || winner) {
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares, i);
  }

  const squareElements = [];

  for (let i = 0; i < 3; i++) {
    const boardRow = [];

    for (let j = i * 3; j < i * 3 + 3; j++) {
      if (j === winner?.a || j === winner?.b || j === winner?.c) {
        boardRow.push(
          <Square
            value={squares[j]}
            onSquareClick={() => handleClick(j)}
            key={j}
            style={{ backgroundColor: '#000', color: '#fff' }}
          />
        );
      } else {
        boardRow.push(
          <Square
            value={squares[j]}
            onSquareClick={() => handleClick(j)}
            key={j}
          />
        );
      }
    }

    squareElements.push(
      <div className="board-row" key={i}>
        {boardRow}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {squareElements}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isListReversed, setIsListReversed] = useState(false);

  function handlePlay(nextSquares, index) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;

    if (move === currentMove && move) {
      description = 'You are at move #' + move;

      return (
        <li key={move}>
          <p>{description}</p>
        </li>
      );
    } else if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }

    return (
      <li className="move-item" key={move}>
        <button onClick={() => jumpTo(move)} className="btn-move">
          {description}
        </button>
      </li>
    );
  });

  if (isListReversed) {
    moves.reverse();
  }

  function sortMoves() {
    setIsListReversed(!isListReversed);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
        <button onClick={sortMoves} className="btn-sort">
          Sort moves <span>{isListReversed ? '↓' : '↑'}</span>
        </button>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { sign: squares[a], a: a, b: b, c: c };
    }
  }

  return null;
}
