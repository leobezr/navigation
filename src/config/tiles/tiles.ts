import type { Dictionary } from "../../services/type";
import { type Tile, TileType } from "./type";

export const Tiles: Dictionary<Tile> = {
  [TileType.GRASS]: {
    id: TileType.GRASS,
    name: "grass",
    cost: 1.5,
    isWalkable: true,
  },
  [TileType.COBBLESTONE]: {
    id: TileType.COBBLESTONE,
    name: "cobblestone",
    cost: 1.2,
    isWalkable: true,
  },
  [TileType.WATER]: {
    id: TileType.WATER,
    name: "water",
    cost: Infinity,
    isWalkable: false,
  },
  [TileType.GOLD]: {
    id: TileType.GOLD,
    name: "goldBlock",
    cost: 1,
    isWalkable: true,
  },
  [TileType.WALL]: {
    id: TileType.WALL,
    name: "woodenWall",
    cost: Infinity,
    isWalkable: true,
  },
};
