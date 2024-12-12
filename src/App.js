import { useState } from 'react';

const BoardSize = 15;
const WinningLineLength = 5;

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      {[...Array(BoardSize)].map((_, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {[...Array(BoardSize)].map((_, colIndex) => {
            const i = rowIndex * BoardSize + colIndex;
            return (
              <Square
                key={i}
                value={squares[i]}
                onSquareClick={() => handleClick(i)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(BoardSize * BoardSize).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  // 检查所有可能的获胜条件
  for (let row = 0; row < BoardSize; row++) {
    for (let col = 0; col < BoardSize; col++) {
      const winner = checkWinningLine(row, col, squares);
      if (winner) return winner;
    }
  }
  return null;
}

function checkWinningLine(startRow, startCol, squares) {
  const directions = [
    [0, 1], // 水平
    [1, 0], // 垂直
    [1, 1], // 正对角线
    [1, -1] // 反对角线
  ];

  for (let [dRow, dCol] of directions) {
    let count = 0;
    for (let step = 0; step < WinningLineLength; step++) {
      const row = startRow + dRow * step;
      const col = startCol + dCol * step;
      if (row >= 0 && row < BoardSize && col >= 0 && col < BoardSize && squares[row * BoardSize + col]) {
        if (count === 0) {
          count = squares[row * BoardSize + col]; // 初始化为第一个非空值
        } else if (count !== squares[row * BoardSize + col]) {
          break; // 如果遇到不同的值，跳出循环
        }
      } else {
        break; // 如果超出边界或者遇到空格，跳出循环
      }
    }
    if (typeof count === 'string') return count;
  }
  return null;
}