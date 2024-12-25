import { TileType } from "../config/tiles/type";
import { Sketch } from "./sketch-map";

const { GRASS, WATER } = TileType;

describe("Testing Sketch", () => {
  const sketch = new Sketch({
    map: [
      [GRASS, GRASS, GRASS],
      [WATER, WATER, WATER],
      [GRASS, GRASS, GRASS],
    ],
  });

  it("Drawing matches map", () => {
    expect(sketch.map).toStrictEqual([
      [".", ".", "."],
      ["~", "~", "~"],
      [".", ".", "."],
    ]);
  });

  it("Sets starting position", () => {
    sketch.pinStart({ x: 0, y: 0 });

    expect(sketch.map).toStrictEqual([
      ["S", ".", "."],
      ["~", "~", "~"],
      [".", ".", "."],
    ]);
  });

  it("Sets goal position", () => {
    sketch.pinGoal({ x: 2, y: 0 });

    expect(sketch.map).toStrictEqual([
      ["S", ".", "G"],
      ["~", "~", "~"],
      [".", ".", "."],
    ]);
  });

  it("Sets path", () => {
    sketch.path({ x: 1, y: 0 });

    expect(sketch.map).toStrictEqual([
      ["S", "x", "G"],
      ["~", "~", "~"],
      [".", ".", "."],
    ]);
  });

  it("Beautiful map", () => {
    expect(sketch.beautifulMap).toStrictEqual([
      "   0 1 2",
      "   ------",
      "0 |S x G",
      "1 |~ ~ ~",
      "2 |. . .",
      "",
      "Start: (0,0)",
      "Goal: (2,0)",
    ]);
  });
});
