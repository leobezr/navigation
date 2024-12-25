import { TileMap } from "../../config/tiles/type";

export interface PropAutomatedConfiguration {
  generate?: number[];
  defaultToGroundId?: number;
}

export type MapConfigurationAutomated = Required<PropAutomatedConfiguration>;

export type MapConfiguration = PropAutomatedConfiguration | TileMap;
