import { TileType } from "../../config/tiles/type";

const { GRASS, WATER } = TileType;

export const numericMap = [
  [1, 2, 3, 4, 5, 6, 7, 8], // 0
  [9, 10, 11, 12, 13, 14, 15, 16], // 1
  [17, 18, 19, 20, 21, 22, 23, 24], // 2
  [25, 26, 27, 28, 29, 30, 31, 32], // 3
  [33, 34, 35, 36, 37, 38, 39, 40], // 4
  [41, 42, 43, 44, 45, 46, 47, 48], // 5
  [49, 50, 51, 52, 53, 54, 55, 56], // 6
  [57, 58, 59, 60, 61, 62, 63, 64], // 7
  [65, 66, 67, 68, 69, 70, 71, 72], // 8
  [73, 74, 75, 76, 77, 78, 79, 80], // 9
  [81, 82, 83, 84, 85, 86, 87, 88], // 10
  [89, 90, 91, 92, 93, 94, 95, 96], // 11
];
// 0   1   2   3   4   5   6   7

export const standardMap = [
  [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
  [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
  [WATER, WATER, WATER, GRASS, GRASS, WATER, GRASS, WATER],
  [WATER, WATER, GRASS, WATER, WATER, GRASS, WATER, GRASS],
  [WATER, GRASS, WATER, WATER, WATER, WATER, WATER, WATER],
  [WATER, GRASS, GRASS, GRASS, GRASS, GRASS, GRASS, WATER],
  [WATER, GRASS, WATER, WATER, WATER, WATER, WATER, WATER],
  [WATER, WATER, GRASS, WATER, WATER, WATER, WATER, WATER],
  [WATER, WATER, WATER, GRASS, WATER, WATER, WATER, WATER],
  [WATER, WATER, GRASS, WATER, WATER, WATER, WATER, WATER],
  [WATER, WATER, WATER, GRASS, WATER, WATER, WATER, WATER],
  [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
];

export const trafficMap = [
  [WATER, WATER, WATER],
  [WATER, GRASS, WATER],
  [WATER, WATER, WATER],
];
