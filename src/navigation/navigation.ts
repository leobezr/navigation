import { Tiles } from "../config/tiles/tiles";
import { Movement } from "../movement/movement";
import { AStar } from "../services/a-star";
import { Position } from "../services/type";
import {
  NavigationProps,
  type NavigationConfiguration,
  type TranscodedTile,
} from "./type";

export class Navigation extends Movement {
  public goTo(position: Position) {
    // const commands = this.__getPath();
  }

  public camera(goal: Position) {
    const direction = this.__calculateDirection(goal);
    const cameraDimension = this.__getCameraBounds(direction);

    return this.map
      .slice(cameraDimension.yMin, cameraDimension.yMax)
      .map((x) => x.slice(cameraDimension.xMin, cameraDimension.xMax));
  }

  public scanTiles(goal: Position) {
    const direction = this.__calculateDirection(goal);
    const camera = this.__getCameraBounds(direction);
    const tiles = this.camera(goal);

    const transcodedTiles: TranscodedTile[][] = tiles.map((column, y) => {
      return column.map((tileId, x) => {
        const tilePosition = { x: camera.xMin + x, y: camera.yMin + y };

        return {
          ...Tiles[tileId],
          position: tilePosition,
          gCost: AStar.gCost(this.position, tilePosition),
          hCost: AStar.hCost(tilePosition, goal),
          fCost: 0,
        };
      });
    });

    transcodedTiles.forEach((column) =>
      column.forEach((tile) => {
        tile.fCost = AStar.fCost(tile.gCost, tile.hCost);
      })
    );

    return transcodedTiles;
  }

  public getPath(goal: Position) {
    const transcodedTiles = this.scanTiles(goal);

    const flatTileCollection = transcodedTiles.reduce((flatTiles, column) => {
      column.forEach((tile) => {
        flatTiles.push(tile);
      });

      return flatTiles;
    }, [] as TranscodedTile[]);

    flatTileCollection.sort((a, b) => {
      if (a.fCost === b.fCost) {
        return a.hCost - b.hCost;
      }
      return a.fCost - b.fCost;
    });

    return flatTileCollection.map((tile) => tile.position);
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

  private __log: string[][] = [];

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

  private __getCameraBounds(dir: Position) {
    const cameraSize = this.__setup.cameraSizeDimension;
    const camera = Math.floor(cameraSize / 2);
    const { x, y } = this.position;

    const xShift = Math.round(dir.x * camera);
    const yShift = Math.round(dir.y * camera);

    const xMin = Math.max(0, x + xShift - camera);
    const xMax = Math.min(this.map[0].length, x + xShift + camera);

    const yMin = Math.max(0, y + yShift - camera);
    const yMax = Math.min(this.map.length, y + yShift + camera);

    return { xMin, xMax, yMin, yMax };
  }
}
