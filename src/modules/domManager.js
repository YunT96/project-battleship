// domManager.js
const domManager = (() => {
  const maxMessages = 4; // Keep track of last 4 messages
  const messageHistory = [];

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
    // Add new message to the end of the array
    messageHistory.push(message);

    // Keep only the most recent messages, removing the oldest if limit is exceeded
    if (messageHistory.length > maxMessages) {
      messageHistory.shift();
    }

    // Get or create the message container
    let container = document.querySelector(".message-display");
    if (!container) {
      container = createMessageContainer();
      if (!container) return; // Exit if we couldn't find or create the container
    }

    // Clear current messages
    container.innerHTML = "";

    // Add all messages, styling based on age
    messageHistory.forEach((msg, index) => {
      const messageElement = document.createElement("div");
      messageElement.textContent = msg;
      messageElement.classList.add("game-message");

      // Style based on message age
      if (index === messageHistory.length - 1) {
        // Newest message (at the end)
        messageElement.style.cssText = `
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a1a1a;
          transition: all 0.3s ease;
        `;
      } else if (index === messageHistory.length - 2) {
        // Second newest message
        messageElement.style.cssText = `
          font-size: 1rem;
          color: #ababab;
          transition: all 0.3s ease;
        `;
      } else {
        // Older messages
        messageElement.style.cssText = `
          font-size: 0.875rem;
          color: #ababab;
          transition: all 0.3s ease;
        `;
      }

      // Append each message element to the container
      container.appendChild(messageElement);
    });
  };

  const updateScore = (playerShips, opponentShips) => {
    const playerScoreElement = document.getElementById("player-score");
    const opponentScoreElement = document.getElementById("opponent-score");

    console.log("playerScore", playerShips);
    console.log("opponentScore", opponentShips);

    if (playerScoreElement && opponentScoreElement) {
      playerScoreElement.textContent = `Ships remaining: ${playerShips}`;
      opponentScoreElement.textContent = `Ships remaining: ${opponentShips}`;
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
    updateScore,
  };
})();

export default domManager;
