import { Direction } from "../movement/type";
import { manhattanGeometry } from "./manhattan-geometry";

describe("Testing manhattan distance return directions", () => {
  it("Returns {North}", () => {
    expect(manhattanGeometry(0, -1)).toBe(Direction.NORTH);
  });
  it("Returns {East}", () => {
    expect(manhattanGeometry(1, 0)).toBe(Direction.EAST);
  });
  it("Returns {South}", () => {
    expect(manhattanGeometry(0, 1)).toBe(Direction.SOUTH);
  });
  it("Returns {West}", () => {
    expect(manhattanGeometry(-1, 0)).toBe(Direction.WEST);
  });
  it("Returns {NorthEast}", () => {
    expect(manhattanGeometry(1, -1)).toBe(Direction.NORTH_EAST);
  });
  it("Returns {SouthEast}", () => {
    expect(manhattanGeometry(1, 1)).toBe(Direction.SOUTH_EAST);
  });
  it("Returns {SouthWest}", () => {
    expect(manhattanGeometry(-1, 1)).toBe(Direction.SOUTH_WEST);
  });
  it("Returns {NorthWest}", () => {
    expect(manhattanGeometry(-1, -1)).toBe(Direction.NORTH_WEST);
  });
  it("Returns null due to it being in the center", () => {
    expect(manhattanGeometry(0, 0)).toBe(null);
  });
});
