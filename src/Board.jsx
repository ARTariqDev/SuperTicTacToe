import React, { useState } from 'react';
import './App.css';

const INITIAL_BOARD = Array(9).fill().map(() => Array(9).fill(null));

const Board = () => {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [activeBoard, setActiveBoard] = useState(null);
  const [winner, setWinner] = useState(null);
  const [showRules, setShowRules] = useState(false); // State for showing rules

  const checkWinner = (miniBoard) => {
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

    for (let line of lines) {
      const [a, b, c] = line;
      if (
        miniBoard[a] &&
        miniBoard[a] === miniBoard[b] &&
        miniBoard[a] === miniBoard[c]
      ) {
        return miniBoard[a];
      }
    }
    return null;
  };

  const handleClick = (bigIndex, smallIndex) => {
    if (winner) return;

    // If the mini-board is already won, let the player play anywhere
    const miniWinner = checkWinner(board[bigIndex]);
    if (miniWinner !== null) {
      setActiveBoard(null);  // Allow playing anywhere once a board is won
    }

    // Ensure the cell is not already occupied
    if (board[bigIndex][smallIndex]) return;

    const newBoard = board.map((miniBoard, i) => (
      i === bigIndex
        ? miniBoard.map((cell, j) => (j === smallIndex ? currentPlayer : cell))
        : miniBoard
    ));

    const newMiniWinner = checkWinner(newBoard[bigIndex]);
    if (newMiniWinner) {
      newBoard[bigIndex] = Array(9).fill(newMiniWinner); // Mark the mini-board as won
    }

    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');

    // After a valid move, set the active board to the smallIndex or null if the mini-board is won
    setActiveBoard(newMiniWinner ? null : smallIndex);

    const bigBoardWinner = checkWinner(
      newBoard.map((miniBoard) =>
        miniBoard.every((cell) => cell === miniBoard[0] && cell !== null)
          ? miniBoard[0]
          : null
      )
    );

    if (bigBoardWinner) setWinner(bigBoardWinner);
  };

  const resetGame = () => {
    setBoard(INITIAL_BOARD);
    setCurrentPlayer('X');
    setActiveBoard(null);
    setWinner(null);
  };

  const toggleRules = () => {
    setShowRules(!showRules); // Toggle visibility of rules
  };

  return (
    <div className="game-container">
      <h1>Super Tic Tac Toe</h1>
      {/* Show Rules Button */}
      <button className="show-rules-button" onClick={toggleRules}>
        {showRules ? 'Hide Rules' : 'Show Rules'}
      </button>
      
      {/* Game Rules Section */}
      {showRules && (
        <div className="rules">
          <h2>Game Rules</h2>
          <ul>
            <li>Players take turns placing their mark (X or O) on a mini-board.</li>
            <li>A player wins a mini-board by placing three of their marks in a row (horizontally, vertically, or diagonally).</li>
            <li>Once a mini-board is won, it is locked and cannot be played on again.</li>
            <li>The overall winner is the player who first wins three mini-boards in a row.</li>
            <li>If a player cannot play on the mini-board they are directed to, they can play anywhere but to do so, they must click on the already won mini-board to exit out of it.</li>
          </ul>
        </div>
      )}

      {winner && <div className="game-over">Winner: {winner}! <button onClick={resetGame}>Restart</button></div>}
      
      <div className="board">
        {board.map((miniBoard, bigIndex) => (
          <div
            key={bigIndex}
            className={`mini-board ${activeBoard === null || activeBoard === bigIndex ? 'active' : 'inactive'}`}
          >
            {miniBoard.map((cell, smallIndex) => (
              <div
                key={smallIndex}
                className={`cell ${cell}`}
                onClick={() => handleClick(bigIndex, smallIndex)}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
