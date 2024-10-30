import Ship from "./ship";

describe("Ship", () => {
  let ship;

  beforeEach(() => {
    ship = new Ship();
  });

  // Test constructor
  it("should create a new ship", () => {
    expect(ship.length).toBeTruthy();
    expect(ship.hits).toBe(0);
    expect(ship.isShipSunk).toBeFalsy();
  });

  // Test isHit()
  it("should increment the ship's hit count", () => {
    ship.isHit();
    expect(ship.hits).toBe(1);
  });

  // Test isSunk()
  it("should set the isShipSunk property to true if the ship is sunk", () => {
    ship.isHit();
    ship.isHit();
    expect(ship.isShipSunk).toBeFalsy();
    ship.isHit();
    expect(ship.isShipSunk).toBeTruthy();
  });
});
