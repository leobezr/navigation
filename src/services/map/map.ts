import type { MapConfiguration, MapConfigurationAutomated } from "./type";
import { TileType, TileMap } from "../../config/tiles/type";
import { Tiles } from "../../config/tiles/tiles";
import { Position } from "../type";

export { MapConfiguration };

export class Map {
  public get tileMap() {
    return this._tileMap;
  }

  public get map() {
    return this._tileMap;
  }

  public getTile(position: Position) {
    const { x, y } = position;

    if (this.tileMap[y] && this.tileMap[y][x]) {
      const tileId = this.tileMap[y][x];

      if (tileId in Tiles) {
        return Tiles[tileId];
      }
    }

    return null;
  }

  constructor(configuration?: MapConfiguration) {
    if (Array.isArray(configuration)) {
      Object.assign(this._tileMap, configuration);
    } else {
      if (configuration) {
        Object.assign(this._configuration, {
          ...this._configuration,
          ...configuration,
        });
      }

      this._generateTiles();
    }
  }

  private _tileMap: TileMap = [];

  private _configuration: MapConfigurationAutomated = {
    generate: [10, 10],
    defaultToGroundId: TileType.GRASS,
  };

  private _generateTiles() {
    const [x, y] = this._configuration.generate;

    this._tileMap = [...new Array(y)].map((_) => {
      return [...new Array(x)].map((_) => {
        return this._configuration.defaultToGroundId;
      });
    });
  }
}
