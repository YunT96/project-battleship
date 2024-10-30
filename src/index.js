import "./styles.css";
import gameController from "./modules/gameController";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".gameboards-container");
  if (!container) {
    console.error("Game container not found!");
    return;
  }
  gameController.initializeGame();
});
