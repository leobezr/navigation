import { Tiles } from "../config/tiles/tiles";
import { Movement } from "../movement/movement";
import { Direction } from "../movement/type";
import { AStar } from "../services/a-star";
import { Dictionary, Position } from "../services/type";
import { randomUUID } from "crypto";

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

  public goTo(goal: Position, log?: boolean) {
    const sessionId = randomUUID();
    const timestamp = Date.now();

    while (this.position.x !== goal.x || this.position.y !== goal.y) {
      if (Date.now() - timestamp >= 1000 * 3) {
        console.error("Couldn't define route");
        break;
      }

      const path = this.getPath(goal); // Recalculate the path at every step

      if (!path || path.length < 2) {
        console.error(
          `Path not found or too short at position:`,
          this.position
        );
        break; // Prevent infinite loops
      }

      const from = path[0]; // Current position
      const to = path[1]; // Next step
      const direction = this.__getDirection(from, to);

      if (direction) {
        const oldPos = { ...this.position };

        this.__storeLog(sessionId, direction);
        this.move(direction);

        if (log) {
          console.log(
            `Move (${direction}): (${oldPos.x},${oldPos.y}) -> (${this.position.x},${this.position.y})`
          );
        }

        if (!this.__setup.allowTraffic) {
          if (oldPos.x === this.position.x && oldPos.y === this.position.y) {
            if (this.__hasTraffic(sessionId)) {
              console.error(
                "Couldn't move to expected position",
                this.position
              );
              break;
            }
          } else {
            this.__clearTraffic(sessionId);
          }
        }
      } else {
        console.error(`Unable to determine direction from:`, from, `to:`, to);
        break;
      }
    }

    return sessionId;
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
    allowTraffic: true,
  };

  private __log: Dictionary<string> = {};
  private __trafficLog: Dictionary<number> = {};

  private __hasTraffic(sessionId: string) {
    const trafficThreshold = 3;

    if (sessionId in this.__trafficLog) {
      const traffic = this.__logTraffic(sessionId);
      return traffic >= trafficThreshold;
    } else {
      this.__logTraffic(sessionId);
    }
  }

  private __logTraffic(sessionId: string) {
    if (sessionId in this.__trafficLog) {
      this.__trafficLog[sessionId]++;
    } else {
      this.__trafficLog[sessionId] = 1;
    }

    return this.__trafficLog[sessionId];
  }

  private __clearTraffic(sessionId: string) {
    if (sessionId in this.__trafficLog) {
      this.__trafficLog[sessionId] = 0;
    }
  }

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

    if (dx === 0 && dy < 0) return Direction.NORTH;
    if (dx > 0 && dy === 0) return Direction.EAST;
    if (dx === 0 && dy > 0) return Direction.SOUTH;
    if (dx < 0 && dy === 0) return Direction.WEST;
    if (dx > 0 && dy < 0) return Direction.NORTH_EAST;
    if (dx > 0 && dy > 0) return Direction.SOUTH_EAST;
    if (dx < 0 && dy > 0) return Direction.SOUTH_WEST;
    if (dx < 0 && dy < 0) return Direction.NORTH_WEST;

    return null;
  }

  private __getCameraBounds(dir: Position, goal: Position) {
    const cameraSize = this.__setup.cameraSizeDimension;
    const cameraRadius = Math.floor(cameraSize / 2);
    const { x, y } = this.position;

    // Directional shifts
    const xShift = Math.round(dir.x * cameraRadius);
    const yShift = Math.round(dir.y * cameraRadius);

    // Preliminary camera bounds based on direction
    let xMin = Math.max(0, x + xShift - cameraRadius);
    let xMax = Math.min(this.map[0].length - 1, x + xShift + cameraRadius);

    let yMin = Math.max(0, y + yShift - cameraRadius);
    let yMax = Math.min(this.map.length - 1, y + yShift + cameraRadius);

    // Ensure the goal is included within bounds
    xMin = Math.min(xMin, goal.x);
    xMax = Math.max(xMax, goal.x);

    yMin = Math.min(yMin, goal.y);
    yMax = Math.max(yMax, goal.y);

    // Ensure current position is also included
    xMin = Math.min(xMin, x);
    xMax = Math.max(xMax, x);

    yMin = Math.min(yMin, y);
    yMax = Math.max(yMax, y);

    return {
      xMin,
      xMax: xMax + 1, // Adjust to make bounds inclusive
      yMin,
      yMax: yMax + 1, // Adjust to make bounds inclusive
    };
  }

  private __storeLog(sessionId: string, direction: string) {
    if (!this.__log[sessionId]) {
      this.__log[sessionId] = direction;
    } else {
      this.__log[sessionId] += `, ${direction}`;
    }
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
