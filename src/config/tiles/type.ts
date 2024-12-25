export interface Tile {
  id: number;
  isWalkable: boolean;
  name: string;
  cost: number;
}

export enum TileType {
  GRASS = 1001,
  COBBLESTONE = 1002,
  WATER = 1003,
  GOLD = 1004,
  WALL = 5000,
}

export type TileMap = Array<number[]>;
