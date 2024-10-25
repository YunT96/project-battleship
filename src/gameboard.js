export default class Gameboard {
  constructor() {
    this.board = [];
    this.board.length = 10;
  }

  createBoard() {
    this.board = [];
    for (let i = 0; i < 10; i++) {
      this.board[i] = new Array(10).fill(0); // Creates an array of 10 elements, all set to 0
    }
  }

  getShipCoordinates(start, end, ship) {
    const coordinates = [];
    const shipLength = ship.length;
    const [x1, y1] = start;
    const [x2, y2] = end;

    // Check if start and end are within the bounds of a 10x10 grid
    if (
      x1 < 0 ||
      x1 > 9 ||
      y1 < 0 ||
      y1 > 9 ||
      x2 < 0 ||
      x2 > 9 ||
      y2 < 0 ||
      y2 > 9
    ) {
      throw new Error("Start or end coordinates are out of bounds.");
    }

    // Determine if placement is horizontal or vertical, and calculate coordinates
    if (x1 === x2) {
      // Horizontal placement
      const distance = Math.abs(y2 - y1) + 1;

      // Check if the distance matches the required ship length
      if (distance !== shipLength) {
        throw new Error(`Invalid ship size. Expected length of ${shipLength}.`);
      }

      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);

      // Ensure entire ship fits within the bounds
      if (maxY >= 10) throw new Error("Ship placement goes out of bounds.");

      for (let y = minY; y <= maxY; y++) {
        coordinates.push([x1, y]);
      }
    } else if (y1 === y2) {
      // Vertical placement
      const distance = Math.abs(x2 - x1) + 1;

      // Check if the distance matches the required ship length
      if (distance !== shipLength) {
        throw new Error(`Invalid ship size. Expected length of ${shipLength}.`);
      }

      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);

      // Ensure entire ship fits within the bounds
      if (maxX >= 10) throw new Error("Ship placement goes out of bounds.");

      for (let x = minX; x <= maxX; x++) {
        coordinates.push([x, y1]);
      }
    } else {
      throw new Error(
        "Invalid placement. Ships must be placed in a straight line.",
      );
    }

    return coordinates;
  }

  placeShip(ship, coordinates) {
    coordinates.forEach((coordinate) => {
      const [x, y] = coordinate;
      this.board[x][y] = 1;
    });
  }

  receiveAttack(coordinate) {
    const [x, y] = coordinate;
    if (this.board[x][y] === 1) {
      this.board[x][y] = 2;
      return true;
    }

    this.board[x][y] = -1;
    return false;
  }

  getBoardState() {
    return this.board;
  }

  gameOver() {
    return this.board.every((row) => row.every((cell) => cell !== 1));
  }
}
