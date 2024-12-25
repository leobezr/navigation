import { Tile } from "../config/tiles/type";
import { MovementConfiguration } from "../movement/type";
import { Position } from "../services/type";

export type NavigationProps = NavigationConfiguration & MovementConfiguration;

export interface NavigationConfiguration {
  maxStepsPerSession?: number;
  diagonalMultiplier?: number;
  cameraSizeDimension?: number;
}

export interface TranscodedTile extends Tile {
  gCost: number;
  hCost: number;
  fCost: number;
  position: Position;
}
