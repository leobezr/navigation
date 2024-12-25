import { TileType } from "../../config/tiles/type";
import { Tiles } from "../../config/tiles/tiles";
import { Map } from "./map";

const { WATER, GRASS, COBBLESTONE } = TileType;

describe("Testing map generator", () => {
  describe("Testing automated map generation", () => {
    it("Map is an array", () => {
      const map = new Map();
      expect(Array.isArray(map.map)).toBe(true);
    });

    it("Map contains elements", () => {
      const map = new Map();
      expect(map.map.length).toBe(10);
    });

    it("Y axis should have 10 elements", () => {
      const map = new Map();
      expect(map.map[0].length).toBe(10);
    });
  });

  describe("Testing get tile using position", () => {
    const map = new Map([
      [WATER, WATER, WATER],
      [WATER, GRASS, WATER, COBBLESTONE],
      [WATER, WATER, WATER],
    ]);

    expect(map.getTile({ x: 1, y: 1 })).toBe(Tiles[GRASS]);
    expect(map.getTile({ x: 2, y: 1 })).toBe(Tiles[WATER]);
    expect(map.getTile({ x: 2, y: 2 })).toBe(Tiles[WATER]);
    expect(map.getTile({ x: 3, y: 1 })).toBe(Tiles[COBBLESTONE]);
  });
});
