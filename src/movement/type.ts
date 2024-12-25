import { MapConfiguration } from "../services/map/type";
import { Position } from "../services/type";

export enum Axis {
  X = "x",
  Y = "y",
}

export enum Direction {
  NORTH = "n",
  EAST = "e",
  SOUTH = "s",
  WEST = "w",
  NORTH_EAST = "ne",
  NORTH_WEST = "nw",
  SOUTH_EAST = "se",
  SOUTH_WEST = "sw",
}

export interface MovementConfiguration {
  initialPosition: Position;
  map?: MapConfiguration;
}
