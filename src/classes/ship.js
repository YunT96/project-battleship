export default class Ship {
  constructor() {
    this.length = 3;
    this.hits = 0;
    this.isShipSunk = false;
  }

  isHit() {
    this.hits++;

    // check if sunk
    this.isSunk();
  }

  isSunk() {
    if (this.hits === this.length) {
      this.isShipSunk = true;
    }
  }
}
