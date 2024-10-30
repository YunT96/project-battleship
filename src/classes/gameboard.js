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
    if (!start || !end || !ship) {
      throw new Error("Missing required parameters.");
    }

    if (
      start[0] < 0 ||
      start[0] >= 10 ||
      start[1] < 0 ||
      start[1] >= 10 ||
      end[0] < 0 ||
      end[0] >= 10 ||
      end[1] < 0 ||
      end[1] >= 10
    ) {
      throw new Error("Start or end coordinates are out of bounds.");
    }

    const coordinates = [];
    const [x, y] = start;
    const [endX, endY] = end;
    const shipLength = ship.length;

    if (x === endX) {
      // horizontal ship
      const length = Math.abs(endY - y) + 1;
      if (length !== shipLength) {
        throw new Error(`Invalid ship size. Expected length of ${shipLength}.`);
      }
      for (let i = 0; i < shipLength; i++) {
        coordinates.push([x, y + i]);
      }
    } else if (y === endY) {
      // vertical ship
      const length = Math.abs(endX - x) + 1;
      if (length !== shipLength) {
        throw new Error(`Invalid ship size. Expected length of ${shipLength}.`);
      }
      for (let i = 0; i < shipLength; i++) {
        coordinates.push([x + i, y]);
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
