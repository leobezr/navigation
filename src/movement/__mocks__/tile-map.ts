import { TileType, type TileMap } from "../../config/tiles/type";

const G = TileType.GOLD;
const _ = TileType.GRASS;
const W = TileType.WALL;
const C = TileType.COBBLESTONE;

export const map: TileMap = [
  [G, _, _, _, _, _, _, _, _, G],
  [_, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, W, W, W, W, _, _],
  [_, _, _, _, W, _, _, W, _, _],
  [_, _, _, _, W, C, _, W, _, _],
  [_, _, _, _, _, _, _, W, W, _],
  [_, _, _, W, W, _, _, _, _, _],
  [_, _, _, _, W, W, W, W, W, _],
  [G, _, _, _, _, _, _, _, _, G],
];
