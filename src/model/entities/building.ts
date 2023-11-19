import { JSONPath } from "jsonpath-plus";
import config from "../BuildingTiles.json";

export enum BuildingTileCategory {
  ExteriorWalls = "exterior_walls",
  InteriorWalls = "interior_walls",
  ExteriorWallTrim = "exterior_wall_trim",
  InteriorWallTrim = "interior_wall_trim",
  Floors = "floors",
  Doors = "doors",
  DoorFrames = "door_frames",
  Windows = "windows",
  Curtains = "curtains",
  Shutters = "shutters",
  Stairs = "stairs",
  GrimeFloor = "grime_floor",
  GrimeWall = "grime_wall",
  RoofCaps = "roof_caps",
  RoofSlopes = "roof_slopes",
  RoofTops = "roof_tops",
}

export class BuildingTile {
  constructor(public readonly key: string, public readonly tile: string) {}
}

export class BuildingEntry {
  static label: string;
  static category: BuildingTileCategory;

  constructor(
    public readonly tiles: BuildingTile[],
    public readonly folder = "default"
  ) {}

  getSubstitutionCategories(): string[] | null {
    return null;
  }
}

export class ExteriorWallsBuildingEntry extends BuildingEntry {
  static label = "ExteriorWalls";
  public static category = BuildingTileCategory.ExteriorWalls;

  getSubstitutionCategories(): string[] {
    return [
      ExteriorWallsBuildingEntry.category,
      InteriorWallsBuildingEntry.category,
    ];
  }
}

export class InteriorWallsBuildingEntry extends BuildingEntry {
  static label = "InteriorWalls";
  public static category = BuildingTileCategory.InteriorWalls;

  getSubstitutionCategories(): string[] {
    return [
      InteriorWallsBuildingEntry.category,
      ExteriorWallsBuildingEntry.category,
    ];
  }
}

export class ExteriorWallTrimBuildingEntry extends BuildingEntry {
  static label = "Trim-ExteriorWalls";
  public static category = BuildingTileCategory.ExteriorWallTrim;
}

export class InteriorWallTrimBuildingEntry extends BuildingEntry {
  static label = "Trim-InteriorWalls";
  public static category = BuildingTileCategory.InteriorWallTrim;
}

export class FloorsBuildingEntry extends BuildingEntry {
  static label = "Floors";
  public static category = BuildingTileCategory.Floors;
}

export class DoorsBuildingEntry extends BuildingEntry {
  static label = "Doors";
  public static category = BuildingTileCategory.Doors;
}

export class WindowsBuildingEntry extends BuildingEntry {
  static label = "Windows";
  public static category = BuildingTileCategory.Windows;
}

export class DoorFramesBuildingEntry extends BuildingEntry {
  static label = "DoorFrames";
  public static category = BuildingTileCategory.DoorFrames;
}

export class CurtainsFramesBuildingEntry extends BuildingEntry {
  static label = "Curtains";
  public static category = BuildingTileCategory.Curtains;
}

export class ShuttersFramesBuildingEntry extends BuildingEntry {
  static label = "Shutters";
  public static category = BuildingTileCategory.Shutters;
}

export class StairsFramesBuildingEntry extends BuildingEntry {
  static label = "Stairs";
  public static category = BuildingTileCategory.Stairs;
}

export class GrimeFloorFramesBuildingEntry extends BuildingEntry {
  static label = "GrimeFloor";
  public static category = BuildingTileCategory.GrimeFloor;
}

export class GrimeWallFramesBuildingEntry extends BuildingEntry {
  static label = "GrimeWall";
  public static category = BuildingTileCategory.GrimeWall;
}

export class RoofCapsFramesBuildingEntry extends BuildingEntry {
  static label = "RoofCaps";
  public static category = BuildingTileCategory.RoofCaps;
}

export class RoofSlopesFramesBuildingEntry extends BuildingEntry {
  static label = "RoofSlopes";
  public static category = BuildingTileCategory.RoofSlopes;
}

export class RoofTopsFramesBuildingEntry extends BuildingEntry {
  static label = "RoofTops";
  public static category = BuildingTileCategory.RoofTops;
}

export class EmptyBuildingEntry extends BuildingEntry {
  static label = "Empty";
  public static category = BuildingTileCategory.ExteriorWalls;
}

export const hydrateBuildingTilesFromConfig =
  (config: any) =>
  <T extends BuildingEntry>(entry: new (...args: any[]) => T): T[] => {
    const [result] = JSONPath({
      // @ts-ignore
      path: `$.category[?(@.name === '${entry.category}')].entry`,
      json: config,
      wrap: false,
    });

    if (!result?.length) {
      // @ts-ignore
      throw new Error(`Unable to find "${entry.label}" tiles`);
    }

    return result.flatMap((tileEntry: unknown): T[] | T => {
      if (!tileEntry) {
        return [];
      }

      return new entry(
        Object.entries(tileEntry).map(
          ([key, tile]) => new BuildingTile(key, String(tile)),
          config.folder
        )
      );
    });
  };

export const buildingList = [
  InteriorWallsBuildingEntry,
  ExteriorWallsBuildingEntry,
  ExteriorWallTrimBuildingEntry,
  InteriorWallTrimBuildingEntry,
  FloorsBuildingEntry,
  DoorsBuildingEntry,
  WindowsBuildingEntry,
  DoorFramesBuildingEntry,
  CurtainsFramesBuildingEntry,
  ShuttersFramesBuildingEntry,
  StairsFramesBuildingEntry,
  GrimeFloorFramesBuildingEntry,
  GrimeWallFramesBuildingEntry,
  RoofCapsFramesBuildingEntry,
  RoofSlopesFramesBuildingEntry,
  RoofTopsFramesBuildingEntry,
];
