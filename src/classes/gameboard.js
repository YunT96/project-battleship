export default class Gameboard {
  constructor() {
    this.board = [];
    this.board.length = 10;
  }

  createBoard() {
    this.board = [];
    for (let i = 0; i < 10; i++) {
      this.board[i] = new Array(10).fill(null); // Use null instead of 0 for empty cells
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
      // Store an object containing the ship reference and hit status
      this.board[x][y] = {
        ship,
        isHit: false,
      };
    });
  }

  receiveAttack(coordinate) {
    const [x, y] = coordinate;
    const cell = this.board[x][y];

    if (cell && cell.ship) {
      cell.isHit = true;
      cell.ship.isHit(); // Increment hits on the ship
      return true;
    }

    // Mark as missed (-1)
    this.board[x][y] = -1;
    return false;
  }

  getBoardState() {
    // Convert the board state to numbers for display
    return this.board.map((row) =>
      row.map((cell) => {
        if (cell === null) return 0; // Empty cell
        if (cell === -1) return -1; // Missed shot
        if (cell && cell.ship) {
          return cell.isHit ? 2 : 1; // 2 for hit ship, 1 for unhit ship
        }
        return 0; // Default case
      }),
    );
  }

  gameOver() {
    // Check if all ship cells are hit
    for (const row of this.board) {
      for (const cell of row) {
        if (cell && cell.ship && !cell.isHit) {
          return false;
        }
      }
    }
    return true;
  }

  getShipAt(coordinates) {
    const [x, y] = coordinates;
    const cell = this.board[x][y];
    if (cell && cell.ship) {
      return cell.ship;
    }
    return null;
  }
}
