import { TranscodedTile } from "../navigation/type";
import { AStar } from "./a-star";

describe("Testing A* functions", () => {
  describe("Testing gCost", () => {
    const pointA = { x: 3, y: 3 };

    it("gCost for straight coordinates should be 1", () => {
      expect(AStar.gCost(pointA, { x: 6, y: 3 })).toEqual(1);
      expect(AStar.gCost(pointA, { x: 3, y: 6 })).toEqual(1);
      expect(AStar.gCost(pointA, { x: 1, y: 3 })).toEqual(1);
      expect(AStar.gCost(pointA, { x: 3, y: 1 })).toEqual(1);
    });

    it("gCost for diagonal lines should be 1.4", () => {
      const diagonalCost = Math.sqrt(2);

      expect(AStar.gCost(pointA, { x: 2, y: 2 })).toEqual(diagonalCost);
      expect(AStar.gCost(pointA, { x: 2, y: 4 })).toEqual(diagonalCost);
      expect(AStar.gCost(pointA, { x: 4, y: 4 })).toEqual(diagonalCost);
      expect(AStar.gCost(pointA, { x: 2, y: 4 })).toEqual(diagonalCost);
    });
  });

  describe("Testing hCost", () => {
    const pointA = { x: 3, y: 3 };

    it("Testing expected results from hCost", () => {
      expect(AStar.hCost(pointA, { x: 2, y: 2 })).toEqual(1.4142135623730951);
      expect(AStar.hCost(pointA, { x: 50, y: 50 })).toEqual(66.46803743153546);
      expect(AStar.hCost(pointA, { x: 1, y: 1 })).toEqual(2.8284271247461903);
    });
  });

  describe("Testing fCost", () => {
    it("Should receive sum of params", () => {
      expect(AStar.fCost(1, 1)).toEqual(2);
      expect(AStar.fCost(5, 1.5)).toEqual(6.5);
      expect(AStar.fCost(3.33, 2.35)).toEqual(5.68);
    });
  });

  describe("Testing sort fCost", () => {
    it("Should sort items using fCost", () => {
      const tiles = [
        {
          fCost: 3,
        },
        {
          fCost: 15,
        },
        {
          fCost: 1,
        },
        {
          fCost: 7,
        },
      ] as TranscodedTile[];

      AStar.sortFCost(tiles);

      expect(tiles.map((t) => t.fCost)).toEqual(
        expect.arrayContaining([1, 3, 7, 15])
      );
    });

    it("Uses hCost when fCost is redundant", () => {
      const tiles = [
        {
          fCost: 2,
          hCost: 3,
        },
        {
          fCost: 5,
          hCost: 8,
        },
        {
          fCost: 2,
          hCost: 3.1,
        },
        {
          fCost: 2,
          hCost: 3.3,
        },
      ] as TranscodedTile[];

      AStar.sortFCost(tiles);

      expect(tiles.map((t) => t.hCost)).toEqual(
        expect.arrayContaining([3, 3.1, 3.3, 8])
      );
    });
  });
});
