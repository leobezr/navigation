import { Map } from "../services/map/map";
import { Position } from "../services/type";
import { Axis, Direction, MovementConfiguration } from "./type";

export class Movement extends Map {
  public get position() {
    return this.__position;
  }

  public move(direction: `${Direction}`) {
    const _dir = direction as Direction;
    const toPosX = this.__getNewPosition(Axis.X, _dir);
    const toPosY = this.__getNewPosition(Axis.Y, _dir);

    if (toPosX >= 0 && toPosY >= 0) {
      const newTilePosition = this.getTile({ x: toPosX, y: toPosY });

      if (newTilePosition && newTilePosition.isWalkable) {
        Object.assign(this.__position, {
          x: toPosX,
          y: toPosY,
        });
      }
    }

    return this;
  }

  public changePosition(position: Position) {
    Object.assign(this.__position, position);
  }

  constructor(configuration?: MovementConfiguration) {
    super(configuration?.map);

    if (configuration) {
      Object.assign(this.__configuration, {
        ...this.__configuration,
        ...configuration,
      });
    }

    this.__assignStartupPosition();
  }

  private __position = {
    x: 0,
    y: 0,
  };

  private __configuration: MovementConfiguration = {
    initialPosition: {
      x: 0,
      y: 0,
    },
  };

  private __assignStartupPosition() {
    Object.assign(this.__position, this.__configuration.initialPosition);
  }

  private __getNewPosition(axis: Axis, direction: Direction) {
    const { EAST, WEST, SOUTH, NORTH } = Direction;

    if (axis === Axis.X) {
      if (direction.includes(EAST) || direction.includes(WEST)) {
        const isIncrement = direction.includes(Direction.EAST);
        const rule = isIncrement ? 1 : -1;

        return this.__position.x + rule;
      }

      return this.position.x;
    } else {
      if (direction.includes(NORTH) || direction.includes(SOUTH)) {
        const isIncrement = direction.includes(Direction.SOUTH);
        const rule = isIncrement ? 1 : -1;
        return this.__position.y + rule;
      }

      return this.__position.y;
    }
  }
}
