export default class Ship {
  constructor() {
    this.length = 3;
    this.hits = 0;
    this.isShipSunk = false;
  }

  isHit() {
    this.hits++;
    // check if sunk and return the current sunk status
    this.isSunk();
    return this.isShipSunk;
  }

  isSunk() {
    if (this.hits >= this.length) {
      // Changed from === to >= for safety
      this.isShipSunk = true;
    }
    return this.isShipSunk;
  }
}
