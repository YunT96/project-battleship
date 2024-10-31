// gameController.js
import domManager from "./domManager";
import Gameboard from "../classes/gameboard";
import Player from "../classes/player";
import Ship from "../classes/ship";

const gameController = (() => {
  let player;
  let computer;
  let isGameOver = false;
  let currentTurn = "player";
  let playerShips = 5;
  let computerShips = 5;

  const initializeGame = () => {
    // Create players
    player = new Player("player");
    computer = new Player("computer");

    // Initialize boards
    player.gameboard.createBoard();
    computer.gameboard.createBoard();

    // Place ships for both players
    placeShips(player.gameboard);
    placeShips(computer.gameboard);

    // Initialize the DOM with empty boards
    domManager.updateBoards(
      player.gameboard.getBoardState(),
      computer.gameboard.getBoardState(),
    );

    // Update the score
    domManager.updateScore(playerShips, computerShips);

    // Add click handler for attacks
    domManager.addAttackHandler(handlePlayerAttack);

    domManager.displayMessage("Game started! Your turn to attack.");
  };

  const placeShips = (gameboard) => {
    const shipSizes = [
      { size: 5, name: "Carrier" },
      { size: 4, name: "Battleship" },
      { size: 3, name: "Cruiser" },
      { size: 3, name: "Submarine" },
      { size: 2, name: "Destroyer" },
    ];

    shipSizes.forEach(({ size }) => {
      let placed = false;
      while (!placed) {
        try {
          const ship = new Ship();
          ship.length = size;

          const isHorizontal = Math.random() < 0.5;
          const x = Math.floor(Math.random() * 10);
          const y = Math.floor(Math.random() * 10);

          let endX = x;
          let endY = y;
          if (isHorizontal) {
            endY = y + size - 1;
          } else {
            endX = x + size - 1;
          }

          const coordinates = gameboard.getShipCoordinates(
            [x, y],
            [endX, endY],
            ship,
          );

          const isOccupied = coordinates.some(
            ([x, y]) => gameboard.getBoardState()[x][y] !== 0,
          );

          if (!isOccupied) {
            gameboard.placeShip(ship, coordinates);
            placed = true;
          }
        } catch (error) {
          continue;
        }
      }
    });
  };

  const handlePlayerAttack = (x, y) => {
    if (isGameOver || currentTurn !== "player") return;

    const boardState = computer.gameboard.getBoardState();
    if (boardState[x][y] === 2 || boardState[x][y] === -1) {
      domManager.displayMessage("You've already attacked this position!");
      return;
    }

    const attackedCell = computer.gameboard.board[x][y]; // Get cell before attack
    const isHit = computer.gameboard.receiveAttack([x, y]);

    // Update the boards
    domManager.updateBoards(
      player.gameboard.getBoardState(),
      computer.gameboard.getBoardState(),
    );

    if (isHit) {
      // Get the ship from the attacked cell
      const ship = attackedCell?.ship;

      if (ship && ship.isShipSunk) {
        domManager.displayMessage("You sunk a ship! Computer's turn.");
        computerShips--;
        domManager.updateScore(playerShips, computerShips);
      } else {
        domManager.displayMessage("Hit! Computer's turn.");
      }

      if (computer.gameboard.gameOver()) {
        endGame("player");
        return;
      }
    } else {
      domManager.displayMessage("You missed! Computer's turn.");
    }

    currentTurn = "computer";
    setTimeout(handleComputerTurn, 2000);
  };

  const handleComputerTurn = () => {
    if (isGameOver) return;

    let x;
    let y;
    let validMove = false;

    while (!validMove) {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
      const boardState = player.gameboard.getBoardState();
      if (boardState[x][y] !== 2 && boardState[x][y] !== -1) {
        validMove = true;
      }
    }

    const attackedCell = player.gameboard.board[x][y]; // Get cell before attack
    const isHit = player.gameboard.receiveAttack([x, y]);

    // Update the boards
    domManager.updateBoards(
      player.gameboard.getBoardState(),
      computer.gameboard.getBoardState(),
    );

    if (isHit) {
      const ship = attackedCell?.ship;

      if (ship && ship.isShipSunk) {
        domManager.displayMessage("Computer sunk your ship! Your turn.");
        playerShips--;
        domManager.updateScore(playerShips, computerShips);
      } else {
        domManager.displayMessage("Computer hit your ship! Your turn.");
      }

      if (player.gameboard.gameOver()) {
        endGame("computer");
        return;
      }
    } else {
      domManager.displayMessage("Computer missed! Your turn.");
    }

    currentTurn = "player";
  };

  const endGame = (winner) => {
    isGameOver = true;
    domManager.showGameOver(winner);
  };

  const resetGame = () => {
    isGameOver = false;
    currentTurn = "player";
    playerShips = 5;
    computerShips = 5;
    domManager.updateScore(playerShips, computerShips);
    initializeGame();
  };

  return {
    initializeGame,
    resetGame,
  };
})();

export default gameController;
