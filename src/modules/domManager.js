// domManager.js
const domManager = (() => {
  const createBoard = () => {
    const playerBoard = document.getElementById("player-gameboard");
    const opponentBoard = document.getElementById("opponent-gameboard");

    if (!playerBoard || !opponentBoard) {
      console.error("Game boards not found in DOM");
      return;
    }

    // Clear existing boards
    playerBoard.innerHTML = "";
    opponentBoard.innerHTML = "";

    // Create cells for both boards
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const playerCell = createCell(i, j);
        const opponentCell = createCell(i, j);

        playerBoard.appendChild(playerCell);
        opponentBoard.appendChild(opponentCell);
      }
    }
  };

  const createCell = (x, y) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-x", x);
    cell.setAttribute("data-y", y);
    return cell;
  };

  const updateBoards = (playerBoardState, opponentBoardState) => {
    // First ensure the boards exist, create them if they don't
    const playerBoard = document.getElementById("player-gameboard");
    const opponentBoard = document.getElementById("opponent-gameboard");

    if (!playerBoard.hasChildNodes() || !opponentBoard.hasChildNodes()) {
      createBoard();
    }

    // Update both boards
    updateBoard("player-gameboard", playerBoardState, true);
    updateBoard("opponent-gameboard", opponentBoardState, false);
  };

  const updateBoard = (boardId, boardState, isPlayer) => {
    const board = document.getElementById(boardId);
    if (!board) return;

    // Get all cells
    const cells = Array.from(board.getElementsByClassName("cell"));

    // Update each cell
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const cell = cells[i * 10 + j];
        if (!cell) continue;

        // Remove existing state classes
        cell.classList.remove("ship", "hit", "miss");

        // Add appropriate class based on state
        const state = boardState[i][j];
        if (state === -1) {
          cell.classList.add("miss");
        } else if (state === 1 && isPlayer) {
          cell.classList.add("ship");
        } else if (state === 2) {
          cell.classList.add("hit");
        }
      }
    }
  };

  const displayMessage = (message) => {
    const messageElement = document.querySelector(".message-display");
    if (messageElement) {
      messageElement.textContent = message;
    }
  };

  const addAttackHandler = (handler) => {
    const opponentBoard = document.getElementById("opponent-gameboard");
    if (!opponentBoard) return;

    // Remove existing event listeners
    const newBoard = opponentBoard.cloneNode(true);
    opponentBoard.parentNode.replaceChild(newBoard, opponentBoard);

    newBoard.addEventListener("click", (e) => {
      const cell = e.target;
      if (!cell.classList.contains("cell")) return;
      if (cell.classList.contains("hit") || cell.classList.contains("miss"))
        return;

      const x = parseInt(cell.getAttribute("data-x"));
      const y = parseInt(cell.getAttribute("data-y"));
      handler(x, y);
    });
  };

  const showGameOver = (winner) => {
    let overlay = document.querySelector(".game-over-overlay");

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.classList.add("game-over-overlay");

      // Add styles to the overlay
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      overlay.style.display = "flex";
      overlay.style.justifyContent = "center";
      overlay.style.alignItems = "center";
      overlay.style.zIndex = "1000";
    }

    const message = document.createElement("div");
    message.classList.add("game-over-message");
    message.style.backgroundColor = "white";
    message.style.padding = "2rem";
    message.style.borderRadius = "8px";
    message.style.textAlign = "center";

    message.textContent = `Game Over! ${winner === "player" ? "You win!" : "Computer wins!"}`;

    const restartButton = document.createElement("button");
    restartButton.textContent = "Play Again";
    restartButton.style.marginTop = "1rem";
    restartButton.style.padding = "0.5rem 1rem";
    restartButton.style.cursor = "pointer";

    restartButton.addEventListener("click", () => {
      overlay.remove();
      location.reload();
    });

    message.appendChild(restartButton);
    overlay.innerHTML = "";
    overlay.appendChild(message);
    document.body.appendChild(overlay);
  };

  return {
    createBoard,
    updateBoards,
    displayMessage,
    addAttackHandler,
    showGameOver,
  };
})();

export default domManager;
