import { Navigation } from "./navigation";
import { standardMap, numericMap } from "./__mocks__/maps";
import { TileType } from "../config/tiles/type";

describe("Testing navigation system", () => {
  describe("Testing camera tile scan", () => {
    const navigation = new Navigation({
      initialPosition: {
        x: 1,
        y: 5,
      },
      map: numericMap,
      cameraSizeDimension: 5,
    });

    it("When goal is east, point to east", () => {
      expect(navigation.camera({ x: 4, y: 5 })).toEqual(
        expect.arrayContaining([
          [26, 27, 28, 29],
          [34, 35, 36, 37],
          [42, 43, 44, 45],
          [50, 51, 52, 53],
        ])
      );
    });

    it("When goal is west, point to west", () => {
      navigation.changePosition({ x: 6, y: 5 });

      expect(navigation.camera({ x: 4, y: 5 })).toEqual(
        expect.arrayContaining([
          [27, 28, 29, 30],
          [35, 36, 37, 38],
          [43, 44, 45, 46],
          [51, 52, 53, 54],
        ])
      );
    });

    it("When goal is south, point to south", () => {
      navigation.changePosition({ x: 3, y: 2 });

      expect(navigation.camera({ x: 3, y: 10 })).toEqual(
        expect.arrayContaining([
          [18, 19, 20, 21],
          [26, 27, 28, 29],
          [34, 35, 36, 37],
          [42, 43, 44, 45],
        ])
      );
    });

    it("When goal is north, point to north", () => {
      navigation.changePosition({ x: 3, y: 10 });

      expect(navigation.camera({ x: 3, y: 2 })).toEqual(
        expect.arrayContaining([
          [50, 51, 52, 53],
          [58, 59, 60, 61],
          [66, 67, 68, 69],
          [74, 75, 76, 77],
        ])
      );
    });

    it("When goal is north-east, point to north-east and extends camera till goal", () => {
      navigation.changePosition({ x: 2, y: 9 });

      expect(navigation.camera({ x: 6, y: 2 })).toEqual(
        expect.arrayContaining([
          [18, 19, 20, 21, 22],
          [26, 27, 28, 29, 30],
          [34, 35, 36, 37, 38],
          [42, 43, 44, 45, 46],
          [50, 51, 52, 53, 54],
          [58, 59, 60, 61, 62],
          [66, 67, 68, 69, 70],
        ])
      );
    });
  });

  describe("Testing camera identifying tiles", () => {
    const navigation = new Navigation({
      initialPosition: {
        x: 1,
        y: 5,
      },
      map: standardMap,
      cameraSizeDimension: 5,
    });

    it("Scans tiles and skips non walkable ones", () => {
      const tiles = navigation.scanTiles({ x: 6, y: 2 });
      const simpleTiles = tiles.map((y) => y.map((x) => x.name));

      expect(simpleTiles).toEqual(
        expect.arrayContaining([
          ["grass", "grass"],
          ["grass", "grass"],
          ["grass"],
          ["grass", "grass", "grass", "grass", "grass"],
        ])
      );
    });
  });

  describe("Testing path finder with getPath", () => {
    const navigation = new Navigation({
      initialPosition: {
        x: 10,
        y: 10,
      },
      map: {
        generate: [40, 40],
        defaultToGroundId: TileType.GRASS,
      },
      cameraSizeDimension: 8,
    });

    it("Testing straight line", () => {
      expect(navigation.getPath({ x: 15, y: 10 })).toEqual(
        expect.arrayContaining([
          { x: 10, y: 10 },
          { x: 11, y: 10 },
          { x: 12, y: 10 },
          { x: 13, y: 10 },
          { x: 14, y: 10 },
          { x: 15, y: 10 },
        ])
      );
    });

    it("Should get sorted path", () => {
      expect(navigation.getPath({ x: 15, y: 10 })).toEqual(
        expect.arrayContaining([
          { x: 10, y: 10 },
          { x: 11, y: 10 },
          { x: 12, y: 10 },
          { x: 13, y: 10 },
          { x: 14, y: 10 },
          { x: 15, y: 10 },
        ])
      );
    });
  });

  describe("Testing movement", () => {
    const navigation = new Navigation({
      initialPosition: {
        x: 0,
        y: 0,
      },
      map: {
        generate: [40, 40],
        defaultToGroundId: TileType.GRASS,
      },
      cameraSizeDimension: 40,
    });

    it("Testing simple movement", () => {
      const sessionId = navigation.goTo({ x: 15, y: 12 });

      expect(navigation.position).toStrictEqual(
        expect.objectContaining({
          x: 15,
          y: 12,
        })
      );

      expect(navigation.log[sessionId]).toStrictEqual(
        "se, se, se, e, e, e, se, se, se, se, se, se, se, se, se"
      );
    });

    it("Testing straight line", () => {
      navigation.changePosition({ x: 0, y: 20 });
      const sessionId = navigation.goTo({ x: 10, y: 22 });

      expect(navigation.position).toStrictEqual(
        expect.objectContaining({
          x: 10,
          y: 22,
        })
      );

      expect(navigation.log[sessionId]).toStrictEqual(
        "e, e, se, se, e, e, e, e, e, e"
      );
    });
  });
});
