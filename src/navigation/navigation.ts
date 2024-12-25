import { Tiles } from "../config/tiles/tiles";
import { Movement } from "../movement/movement";
import { Direction } from "../movement/type";
import { AStar } from "../services/a-star";
import { Position } from "../services/type";

import {
  NavigationProps,
  type NavigationConfiguration,
  type TranscodedTile,
} from "./type";

export class Navigation extends Movement {
  public get log() {
    return this.__log;
  }

  public camera(goal: Position) {
    const direction = this.__calculateDirection(goal);
    const cameraDimension = this.__getCameraBounds(direction, goal);

    return this.map
      .slice(cameraDimension.yMin, cameraDimension.yMax)
      .map((x) => x.slice(cameraDimension.xMin, cameraDimension.xMax));
  }

  public scanTiles(goal: Position) {
    const direction = this.__calculateDirection(goal);
    const camera = this.__getCameraBounds(direction, goal);
    const tiles = this.camera(goal);

    return this.__transcodeTiles(tiles, goal, camera.xMin, camera.yMin);
  }

  public goTo(goal: Position): Direction[] {
    const path = this.getPath(goal);
    const directions: Direction[] = [];

    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i];
      const to = path[i + 1];
      const direction = this.__getDirection(from, to);

      if (direction) {
        directions.push(direction);
        this.__log.push(direction);
        this.move(direction);
      }
    }

    return directions;
  }

  public getPath(goal: Position) {
    const transcodedTiles = this.scanTiles(goal);
    const flatTiles = transcodedTiles.flat();

    const startingTile = flatTiles.find((tile) => {
      return (
        tile.position.x === this.position.x &&
        tile.position.y === this.position.y
      );
    });

    if (!startingTile) {
      throw Error("Couldn't find starting tile");
    }

    const goalTile = flatTiles.find((tile) => {
      return tile.position.x === goal.x && tile.position.y === goal.y;
    });

    if (!goalTile) {
      throw Error("Couldn't find tile goal");
    }

    const openList = [startingTile];
    const closedList: TranscodedTile[] = [];

    while (openList.length > 0) {
      AStar.sortFCost(openList);

      const currentTile = openList.shift() as TranscodedTile;
      closedList.push(currentTile as TranscodedTile);

      if (
        currentTile?.position.x === goal.x &&
        currentTile.position.y === goal.y
      ) {
        const path: Position[] = [];
        let tile: TranscodedTile | null = currentTile;

        while (tile) {
          path.push(tile.position);
          tile = tile.parent;
        }

        return path.reverse();
      }

      const neighbors = this.__getNeighbors(currentTile, flatTiles);

      for (const neighbor of neighbors) {
        if (closedList.includes(neighbor)) {
          continue;
        }

        const tentativeGCost =
          currentTile.gCost +
          AStar.gCost(currentTile.position, neighbor.position);

        if (!openList.includes(neighbor) || tentativeGCost < neighbor.gCost) {
          neighbor.gCost = tentativeGCost;
          neighbor.hCost = AStar.hCost(neighbor.position, goal);
          neighbor.fCost = AStar.fCost(neighbor.gCost, neighbor.hCost);
          neighbor.parent = currentTile;

          if (!openList.includes(neighbor)) {
            openList.push(neighbor);
          }
        }
      }
    }

    throw new Error("No path found");
  }

  constructor(configuration: NavigationProps) {
    super(configuration);

    if (configuration) {
      Object.assign(this.__setup, {
        ...this.__setup,
        ...configuration,
      });
    }
  }

  private __setup: Required<NavigationConfiguration> = {
    diagonalMultiplier: 1.4,
    maxStepsPerSession: 100,
    cameraSizeDimension: 10,
  };

  private __log: Direction[] = [];

  private __getNeighbors(tile: TranscodedTile, allTiles: TranscodedTile[]) {
    const directions = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: -1, y: -1 },
      { x: 1, y: -1 },
      { x: -1, y: 1 },
      { x: 1, y: 1 },
    ];

    return directions
      .map((dir) => {
        const neighborPos = {
          x: tile.position.x + dir.x,
          y: tile.position.y + dir.y,
        };

        return allTiles.find((neighbor) => {
          return (
            neighbor.position.x === neighborPos.x &&
            neighbor.position.y === neighborPos.y
          );
        });
      })
      .filter((neighbor): neighbor is TranscodedTile => Boolean(neighbor));
  }

  private __calculateDirection(goal: Position) {
    const position = this.position;
    const dx = goal.x - position.x;
    const dy = goal.y - position.y;
    const magnitude = Math.sqrt(dx * dx + dy * dy) || 1;

    return {
      x: dx / magnitude,
      y: dy / magnitude,
    };
  }

  private __getDirection(from: Position, to: Position): Direction | null {
    const dx = to.x - from.x;
    const dy = to.y - from.y;

    if (dx === 0 && dy === -1) return Direction.NORTH;
    if (dx === 0 && dy === 1) return Direction.SOUTH;
    if (dx === -1 && dy === 0) return Direction.WEST;
    if (dx === 1 && dy === 0) return Direction.EAST;
    if (dx === 1 && dy === -1) return Direction.NORTH_EAST;
    if (dx === -1 && dy === -1) return Direction.NORTH_WEST;
    if (dx === 1 && dy === 1) return Direction.SOUTH_EAST;
    if (dx === -1 && dy === 1) return Direction.SOUTH_EAST;

    return null;
  }

  private __getCameraBounds(dir: Position, goal: Position) {
    const cameraSize = this.__setup.cameraSizeDimension;
    const camera = Math.floor(cameraSize / 2);
    const { x, y } = this.position;

    const xShift = Math.round(dir.x * camera);
    const yShift = Math.round(dir.y * camera);

    const xMin = Math.min(Math.max(0, x + xShift - camera), goal.x);
    const xMax = Math.max(
      Math.min(this.map[0].length, x + xShift + camera),
      goal.x
    );

    const yMin = Math.min(Math.max(0, y + yShift - camera), goal.y);
    const yMax = Math.max(
      Math.min(this.map.length, y + yShift + camera),
      goal.y
    );

    return { xMin, xMax, yMin, yMax };
  }

  private __transcodeTiles(
    tiles: number[][],
    goal: Position,
    xMin: number,
    yMin: number
  ) {
    const transcodedTiles: TranscodedTile[][] = tiles.reduce(
      (tiles, column, y) => {
        column.forEach((tileId, x) => {
          const tilePosition = { x: xMin + x, y: yMin + y };

          if (!tiles[y]) {
            tiles[y] = [];
          }

          if (Tiles[tileId].isWalkable) {
            tiles[y].push({
              ...Tiles[tileId],
              position: tilePosition,
              gCost: AStar.gCost(this.position, tilePosition),
              hCost: AStar.hCost(tilePosition, goal),
              fCost: 0,
              parent: null,
            });
          }
        });

        return tiles;
      },
      [[]] as TranscodedTile[][]
    );

    transcodedTiles.forEach((column) =>
      column.forEach((tile) => {
        tile.fCost = AStar.fCost(tile.gCost, tile.hCost);
      })
    );

    return transcodedTiles;
  }
}
