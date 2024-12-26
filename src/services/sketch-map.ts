import { Tiles } from "../config/tiles/tiles";
import { Dictionary, Position } from "./type";

export class Sketch {
  public get map() {
    return this.__map;
  }

  public beautifulMap() {
    const header = this.__generateHeader();
    const divider = this.__headerDivider(header);
    const columns = this.__generateColumns();
    const space = "";
    const start = this.__getStartPosition();
    const goal = this.__getGoalPosition();

    const map = [header, divider, ...columns, space, start, goal];

    console.log(map.join("\n"));
    return map;
  }

  public pinStart(pos: Position) {
    if (!this.__log.start) {
      this.__replaceSymbol(pos, this.__setup.symbols.start);
      this.__log.start = pos;
    }
  }

  public pinGoal(pos: Position) {
    this.__replaceSymbol(pos, this.__setup.symbols.goal);
    this.__log.goal = pos;
  }

  public path(pos: Position) {
    const { x, y } = pos;
    const symbol = this.__map[y][x];

    if (symbol !== this.__setup.symbols.goal) {
      this.__replaceSymbol(pos, this.__setup.symbols.explored);
    }
  }

  constructor(setup: SketchConfiguration) {
    if (setup) {
      Object.assign(this.__setup, {
        ...this.__setup,
        ...setup,
      });
    }
    this.__draw();
  }

  private __map: string[][] = [];
  private __log: Dictionary<Position> = {};

  private __setup: Required<SketchConfiguration> = {
    map: [],
    symbols: {
      walkable: ".",
      explored: "x",
      start: "S",
      goal: "G",
      invalid: "~",
    },
  };

  private __draw() {
    this.__map = this.__setup.map.map((column) => {
      return column.map((node) => {
        const { walkable, invalid } = this.__setup.symbols;
        const tile = Tiles[node];

        if (tile) {
          const symbol = tile.isWalkable ? walkable : invalid;
          return symbol;
        }

        return "?";
      });
    });
  }

  private __replaceSymbol(position: Position, symbol: string) {
    const { x, y } = position;
    this.__map[y].splice(x, 1, symbol);
  }

  private __generateHeader() {
    let header = "  ";

    const largestIndex = this.__map.reduce((count, column) => {
      if (count < column.length) {
        count = column.length;
      }

      return count;
    }, 0);

    for (let x = 0; x < largestIndex; x++) {
      header += ` ${x}`;
    }

    return header;
  }

  private __headerDivider(header: string) {
    let divider = "   ";
    const dividerLength = header.trim().split(" ").length;

    for (let x = 0; x < dividerLength; x++) {
      if (x === dividerLength - 1) {
        divider += "-";
      } else {
        divider += "--";
      }
    }

    return divider;
  }

  private __generateColumns() {
    const columns: string[] = [];

    this.map.forEach((column, y) => {
      let columnLabel = y >= 10 ? `${y}|` : `${y} |`;

      column.forEach((node) => {
        if (columnLabel.length === 3) {
          columnLabel += node;
        } else {
          columnLabel += ` ${node}`;
        }
      });

      columns.push(columnLabel);
    });

    return columns;
  }

  private __getStartPosition() {
    const { x, y } = this.__log.start;
    return `Start: (${x},${y})`;
  }

  private __getGoalPosition() {
    const { x, y } = this.__log.goal;
    return `Goal: (${x},${y})`;
  }
}

interface SketchConfiguration {
  map: number[][];
  symbols?: {
    walkable: string;
    explored: string;
    start: string;
    goal: string;
    invalid: string;
  };
}
