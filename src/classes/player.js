import Gameboard from "./gameboard";

export default class Player {
  constructor(name) {
    this.name = name;
    this.gameboard = new Gameboard();
  }
}
