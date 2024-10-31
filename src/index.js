import "./styles.css";
import gameController from "./modules/gameController";

document.addEventListener("DOMContentLoaded", () => {
  const resetButton = document.getElementById("reset-button");
  if (!resetButton) {
    console.error("Reset button not found!");
    return;
  }
  resetButton.addEventListener("click", () => {
    gameController.resetGame();
  });

  const container = document.querySelector(".gameboards-container");
  if (!container) {
    console.error("Game container not found!");
    return;
  }
  gameController.initializeGame();
});
