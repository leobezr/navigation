import { Direction } from "../movement/type";

export const manhattanGeometry = (dx: number, dy: number) => {
  if (dx === 0 && dy < 0) return Direction.NORTH;
  if (dx > 0 && dy === 0) return Direction.EAST;
  if (dx === 0 && dy > 0) return Direction.SOUTH;
  if (dx < 0 && dy === 0) return Direction.WEST;
  if (dx > 0 && dy < 0) return Direction.NORTH_EAST;
  if (dx > 0 && dy > 0) return Direction.SOUTH_EAST;
  if (dx < 0 && dy > 0) return Direction.SOUTH_WEST;
  if (dx < 0 && dy < 0) return Direction.NORTH_WEST;

  return null;
};
