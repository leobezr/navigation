import { Movement } from "./movement";
import { TileType } from "../config/tiles/type";

describe("Testing movement", () => {
  describe("Testing basic straight movement", () => {
    it("Moves south 1px", () => {
      const movement = new Movement();
      movement.move("e");
      movement.move("s");

      expect(movement.position).toEqual(
        expect.objectContaining({
          x: 1,
          y: 1,
        })
      );
    });

    it("Should remain initial position", () => {
      const movement = new Movement();
      movement.move("n");
      movement.move("w");

      expect(movement.position).toEqual(
        expect.objectContaining({
          x: 0,
          y: 0,
        })
      );
    });

    it("Testing WASD", () => {
      const movement = new Movement();
      movement.move("n");
      movement.move("w");
      movement.move("s");
      movement.move("e");

      expect(movement.position).toEqual(
        expect.objectContaining({
          x: 1,
          y: 1,
        })
      );
    });

    it("Moving backwards horizontal axis", () => {
      const movement = new Movement();

      movement.move("s");
      movement.move("s");
      movement.move("e");
      movement.move("e");
      movement.move("w");

      expect(movement.position).toEqual(
        expect.objectContaining({
          x: 1,
          y: 2,
        })
      );
    });

    it("Moving backwards vertical axis", () => {
      const movement = new Movement();

      movement.move("s");
      movement.move("s");
      movement.move("e");
      movement.move("e");
      movement.move("n");

      expect(movement.position).toEqual(
        expect.objectContaining({
          x: 2,
          y: 1,
        })
      );
    });

    it("Testing going off of the map", () => {
      const movement = new Movement();

      for (let x = 0; x < 20; x++) {
        movement.move("e");
        movement.move("s");
      }

      expect(movement.position).toEqual(
        expect.objectContaining({
          x: 9,
          y: 9,
        })
      );
    });
  });

  describe("Testing diagonal movement", () => {
    it("Moves south 1px", () => {
      const movement = new Movement();
      movement.move("se");

      expect(movement.position).toEqual(
        expect.objectContaining({
          x: 1,
          y: 1,
        })
      );
    });
  });

  describe("Testing tiles forbidden to walk over", () => {
    it("Shouldn't move over invalid tiles", () => {
      const movement = new Movement({
        initialPosition: {
          x: 5,
          y: 5,
        },
        map: {
          defaultToGroundId: TileType.WATER,
          generate: [10, 10],
        },
      });

      movement.move("s");

      expect(movement.position).toEqual(
        expect.objectContaining({
          x: 5,
          y: 5,
        })
      );
    });
  });

  describe("Testing map navigation", () => {
    const { WATER, GRASS } = TileType;

    const movement = new Movement({
      initialPosition: {
        x: 0,
        y: 1,
      },
      map: [
        [WATER, WATER, WATER],
        [GRASS, GRASS, GRASS],
        [WATER, WATER, GRASS],
      ],
    });

    it("Shouldn't move over invalid tiles", () => {
      movement.move("e");
      movement.move("s");

      expect(movement.position).toEqual(
        expect.objectContaining({
          x: 1,
          y: 1,
        })
      );
    });

    it("Shouldn't move over invalid tiles", () => {
      movement.move("n").move("e").move("s");

      expect(movement.position).toEqual(
        expect.objectContaining({
          x: 2,
          y: 2,
        })
      );
    });
  });
});
