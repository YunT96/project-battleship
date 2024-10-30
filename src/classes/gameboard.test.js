import Gameboard from "./gameboard";

describe("Gameboard", () => {
  let board;

  beforeEach(() => {
    board = new Gameboard();
    board.createBoard();
  });

  // Test createBoard()
  test("should create a 10x10 board with all cells set to 0", () => {
    expect(board.board.length).toBe(10);
    board.board.forEach((row) => {
      expect(row.length).toBe(10);
      row.forEach((cell) => expect(cell).toBe(0));
    });
  });

  // Test getShipCoordinates()
  test("should return correct coordinates for horizontal ship", () => {
    // mocking ship length: { length: 3 }
    const coordinates = board.getShipCoordinates([0, 0], [0, 2], { length: 3 });
    expect(coordinates).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });

  test("should return correct coordinates for vertical ship", () => {
    const coordinates = board.getShipCoordinates([0, 0], [2, 0], { length: 3 });
    expect(coordinates).toEqual([
      [0, 0],
      [1, 0],
      [2, 0],
    ]);
  });

  test("should throw error for out-of-bounds coordinates", () => {
    expect(() =>
      board.getShipCoordinates([10, 0], [10, 2], { length: 3 }),
    ).toThrow("Start or end coordinates are out of bounds.");
  });

  test("should throw error if coordinates are not in a straight line", () => {
    expect(() =>
      board.getShipCoordinates([0, 0], [1, 1], { length: 2 }),
    ).toThrow("Invalid placement. Ships must be placed in a straight line.");
  });

  test("should throw error if ship size is invalid", () => {
    expect(() =>
      board.getShipCoordinates([0, 0], [0, 3], { length: 3 }),
    ).toThrow("Invalid ship size. Expected length of 3.");
  });

  // Test placeShip()
  test("should place ship on the board", () => {
    const coordinates = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    board.placeShip({ length: 3 }, coordinates);

    expect(board.board[0][0]).toBe(1);
    expect(board.board[0][1]).toBe(1);
    expect(board.board[0][2]).toBe(1);
  });

  // Test receiveAttack()
  test("should receive attack and change cell to -1 if missed and 2 if hit", () => {
    board.placeShip({ length: 3 }, [
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    // Test hits
    expect(board.receiveAttack([0, 0])).toBe(true);
    expect(board.receiveAttack([0, 1])).toBe(true);
    expect(board.receiveAttack([0, 2])).toBe(true);

    // Test miss
    expect(board.receiveAttack([0, 3])).toBe(false);

    // Check cell values for hits and misses
    expect(board.board[0][0]).toBe(2);
    expect(board.board[0][1]).toBe(2);
    expect(board.board[0][2]).toBe(2);
    expect(board.board[0][3]).toBe(-1);

    // Optional: Ensure other cells remain unaffected
    expect(board.board[1][0]).toBe(0); // Checking an arbitrary cell
  });

  // Test gameOver()
  test("should check if the game is over", () => {
    board.placeShip({ length: 3 }, [
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    expect(board.gameOver()).toBe(false);

    board.receiveAttack([0, 0]);
    expect(board.gameOver()).toBe(false);

    board.receiveAttack([0, 1]);
    expect(board.gameOver()).toBe(false);

    board.receiveAttack([0, 2]);
    expect(board.gameOver()).toBe(true);
  });

  // Test getBoardState()
  test("should return the board state", () => {
    board.placeShip({ length: 3 }, [
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    board.receiveAttack([0, 0]);
    board.receiveAttack([1, 1]);

    // 1 = ship, 0 = empty, -1 = missed, 2 = hit
    expect(board.getBoardState()).toEqual([
      [2, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, -1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);
  });
});
