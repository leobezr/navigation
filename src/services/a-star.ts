import { Position } from "./type";

export class AStar {
  public static gCost(tile: Position, neighbor: Position) {
    const dx = Math.abs(neighbor.x - tile.x);
    const dy = Math.abs(neighbor.y - tile.y);

    if (dx === 1 && dy === 1) {
      return Math.sqrt(2);
    }

    return 1;
  }

  public static hCost(position: Position, goal: Position) {
    const dx = Math.abs(position.x - goal.x);
    const dy = Math.abs(position.y - goal.y);
    const diagonalCost = Math.sqrt(2) - 2;

    return dx + dy + diagonalCost * Math.min(dx, dy);
  }

  public static fCost(gCost: number, hCost: number) {
    return gCost + hCost;
  }
}
