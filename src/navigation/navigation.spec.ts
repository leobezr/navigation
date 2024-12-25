import { Navigation } from "./navigation";
import { standardMap, numericMap, trafficMap } from "./__mocks__/maps";
import { TileType } from "../config/tiles/type";
import { Dictionary, Position } from "../services/type";
import { Tiles } from "../config/tiles/tiles";

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

    it("Testing camera to {East}", () => {
      const startingPosition = { x: 1, y: 5 };
      const goalPosition = { x: 4, y: 5 };

      navigation.changePosition(startingPosition);
      const cameraTiles = navigation.camera(goalPosition);

      const validate = validateNumericMapValue(
        cameraTiles,
        numericMap,
        startingPosition,
        goalPosition
      );

      expect(validate).toStrictEqual({
        startingPosition: true,
        goalPosition: true,
        start: 42,
        end: 45,
      });
    });

    it("Testing camera to {West}", () => {
      const startingPosition = { x: 6, y: 5 };
      const goalPosition = { x: 4, y: 5 };

      navigation.changePosition(startingPosition);
      const cameraTiles = navigation.camera(goalPosition);

      const validate = validateNumericMapValue(
        cameraTiles,
        numericMap,
        startingPosition,
        goalPosition
      );

      expect(validate).toStrictEqual({
        startingPosition: true,
        goalPosition: true,
        start: 47,
        end: 45,
      });
    });

    it("Testing camera to {South}", () => {
      const startingPosition = { x: 3, y: 2 };
      const goalPosition = { x: 3, y: 10 };

      navigation.changePosition(startingPosition);
      const cameraTiles = navigation.camera(goalPosition);

      const validate = validateNumericMapValue(
        cameraTiles,
        numericMap,
        startingPosition,
        goalPosition
      );

      expect(validate).toStrictEqual({
        startingPosition: true,
        goalPosition: true,
        start: 20,
        end: 84,
      });
    });

    it("Testing camera to {North}", () => {
      const startingPosition = { x: 3, y: 10 };
      const goalPosition = { x: 3, y: 2 };

      navigation.changePosition(startingPosition);
      const cameraTiles = navigation.camera(goalPosition);

      const validate = validateNumericMapValue(
        cameraTiles,
        numericMap,
        startingPosition,
        goalPosition
      );

      expect(validate).toStrictEqual({
        startingPosition: true,
        goalPosition: true,
        start: 84,
        end: 20,
      });
    });

    it("Testing camera to {NorthEast}", () => {
      const startingPosition = { x: 2, y: 9 };
      const goalPosition = { x: 6, y: 2 };

      navigation.changePosition(startingPosition);
      const cameraTiles = navigation.camera(goalPosition);

      expect(
        validateNumericMapValue(
          cameraTiles,
          numericMap,
          startingPosition,
          goalPosition
        )
      ).toStrictEqual({
        startingPosition: true,
        goalPosition: true,
        end: 23,
        start: 75,
      });
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
      const flatTiles = simpleTiles.flat();

      expect(
        flatTiles.every((tile) => tile === Tiles[TileType.GRASS].name)
      ).toBe(true);
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

      expect(getMovementCount(navigation.log[sessionId])).toStrictEqual({
        se: 12,
        e: 3,
      });
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

      expect(getMovementCount(navigation.log[sessionId])).toStrictEqual({
        e: 8,
        se: 2,
      });
    });

    it("Testing straight line to west", () => {
      navigation.changePosition({ x: 10, y: 22 });
      const sessionId = navigation.goTo({ x: 0, y: 20 });

      expect(navigation.position).toStrictEqual(
        expect.objectContaining({
          x: 0,
          y: 20,
        })
      );

      expect(getMovementCount(navigation.log[sessionId])).toStrictEqual({
        w: 8,
        nw: 2,
      });
    });
  });

  describe("Testing hard map", () => {
    const navigation = new Navigation({
      initialPosition: {
        x: 1,
        y: 5,
      },
      map: standardMap,
      cameraSizeDimension: 30,
      allowTraffic: false,
    });

    it("Should go to hard point of the map", () => {
      const sessionId = navigation.goTo({ x: 3, y: 10 });

      expect(getMovementCount(navigation.log[sessionId])).toStrictEqual({
        s: 1,
        se: 3,
        sw: 1,
      });

      expect(navigation.position).toStrictEqual({ x: 3, y: 10 });
    });

    it("Should go to hard point of the map", () => {
      navigation.changePosition({ x: 3, y: 10 });
      const sessionId = navigation.goTo({ x: 1, y: 4 });

      expect(getMovementCount(navigation.log[sessionId])).toStrictEqual({
        n: 2,
        ne: 1,
        nw: 3,
      });

      expect(navigation.position).toStrictEqual({ x: 1, y: 4 });
    });
  });

  describe("Break is unreachable tile", () => {
    const navigation = new Navigation({
      initialPosition: {
        x: 1,
        y: 1,
      },
      map: trafficMap,
      cameraSizeDimension: 5,
      allowTraffic: false,
    });

    it("Should break when finds traffic", () => {
      expect(() => navigation.goTo({ x: 2, y: 1 })).toThrow();
    });
  });

  describe("Testing big map", () => {
    const navigation = new Navigation({
      initialPosition: {
        x: 0,
        y: 15,
      },
      map: {
        generate: [300, 20],
        defaultToGroundId: TileType.GRASS,
      },
      cameraSizeDimension: 10,
    });

    it("Testing camera growth {EAST}", () => {
      navigation.goTo({ x: 299, y: 15 });
      expect(navigation.position).toStrictEqual({ x: 299, y: 15 });
    });

    it("Testing camera growth {WEST}", () => {
      navigation.changePosition({ x: 299, y: 15 });
      navigation.goTo({ x: 0, y: 15 });

      expect(navigation.position).toStrictEqual({ x: 0, y: 15 });
    });

    it("Testing camera growth {WEST}", () => {
      navigation.changePosition({ x: 0, y: 0 });
      navigation.goTo({ x: 70, y: 19 });

      expect(navigation.position).toStrictEqual({ x: 70, y: 19 });
    });
  });
});

const getMovementCount = (log: string) => {
  const movements = log.split(",");

  return movements.reduce((structure, direction) => {
    const dir = direction.trim();

    if (dir in structure) {
      structure[dir]++;
    } else {
      structure[dir] = 1;
    }
    return structure;
  }, {} as Dictionary<number>);
};

const validateNumericMapValue = (
  tiles: number[][],
  map: number[][],
  startingPosition: Position,
  goalPosition: Position
) => {
  const startingPointValue = map[startingPosition.y][startingPosition.x];
  const goalPointValue = map[goalPosition.y][goalPosition.x];
  const flatTiles = tiles.flat();

  return {
    startingPosition: flatTiles.includes(startingPointValue),
    goalPosition: flatTiles.includes(goalPointValue),
    start: startingPointValue,
    end: goalPointValue,
  };
};
