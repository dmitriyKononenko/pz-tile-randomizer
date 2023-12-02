import { JSONPath } from "jsonpath-plus";
import { TbxNode } from "../../tbx/tbx";

export class FurnitureTile {
  constructor(
    public readonly tile: string,
    public readonly x: number,
    public readonly y: number,
    public readonly orient: string
  ) {}
}

export class FurnitureEntry {
  constructor(public readonly tiles: FurnitureTile[]) {}
}

export class Furniture {
  public static label: string;
  constructor(
    public readonly entries: FurnitureEntry[],
    public readonly corners?: string,
    public readonly layer?: string,
    public readonly folder = "default"
  ) {}
}

export class ApliancesCookingFurniture extends Furniture {
  public static label = "Appliances-Cooking";
}

export class ApliancesLaundryFurniture extends Furniture {
  public static label = "Appliances-Laundry";
}

export class ApliancesRefrigerationFurniture extends Furniture {
  public static label = "Appliances-Refrigeration";
}

export class ApliancesTelevisionFurniture extends Furniture {
  public static label = "Applicances-Television";
}

export class CampingFurniture extends Furniture {
  public static label = "Camping";
}

export class CarpentryFurniture extends Furniture {
  public static label = "Carpentry";
}

export class ConstructionFurniture extends Furniture {
  public static label = "Construction";
}

export class BathroomFurniture extends Furniture {
  public static label = "Fixtures-Bathroom";
}

export class CountersFurniture extends Furniture {
  public static label = "Fixtures-Counters";
}

export class RailingsFurniture extends Furniture {
  public static label = "Fixtures-Railings";
}

export class WindowsFurniture extends Furniture {
  public static label = "Fixtures-Windows";
}

export class WindowsDetailingFurniture extends Furniture {
  public static label = "Fixtures-Windows-Detailing";
}

export class FloorsRugsFurniture extends Furniture {
  public static label = "Floors-Rugs";
}

export class FloorsBeddingFurniture extends Furniture {
  public static label = "Furniture-Bedding";
}

export class SeatingIndoorFurniture extends Furniture {
  public static label = "Furniture-Seating-Indoor";
}

export class ShelvingFurniture extends Furniture {
  public static label = "Furniture-Shelving";
}

export class StorageFurniture extends Furniture {
  public static label = "Furniture-Storage";
}

export class TablesHighFurniture extends Furniture {
  public static label = "Furniture-Tables-High";
}

export class TablesLowFurniture extends Furniture {
  public static label = "Furniture-Tables-Low";
}

export class LightingIndoorFurniture extends Furniture {
  public static label = "Lighting-Indoor";
}

export class LightingOutdoorFurniture extends Furniture {
  public static label = "Lighting-Outdoor";
}

export class TrashFurniture extends Furniture {
  public static label = "Trash";
}

export class WallsDecorationFurniture extends Furniture {
  public static label = "Walls-Decoration";
}

export class WallsDetailingFurniture extends Furniture {
  public static label = "Walls-Detailing";
}

export class WallsGraffitiFurniture extends Furniture {
  public static label = "Walls-Graffiti";
}

export class VegetationIndoorFurniture extends Furniture {
  public static label = "Vegetation-Indoor";
}

export class EmptyFurniture extends Furniture {
  public static label = "Empty";
}

export const hydrateFurnitureTilesFromConfig =
  (config: any) =>
  <T extends Furniture>(entry: new (...args: any[]) => T): T[] => {
    const [result] =
      JSONPath({
        // @ts-ignore
        path: `$.group[?(@.label === '${entry.label}')].furniture`,
        json: config,
        wrap: false,
      }) || [];

    if (!result?.length) {
      // @ts-ignore
      throw new Error(`Unable to find "${entry.label}" tiles`);
    }

    return result.flatMap(
      (tileEntry: {
        corners?: string;
        layer?: string;
        entry: Record<string, string>[];
      }): T[] | T => {
        if (!tileEntry) {
          return [];
        }

        return new entry(
          tileEntry.entry.map((entry) => {
            const { orient, ...tiles } = entry;

            return new FurnitureEntry(
              Object.entries(tiles).flatMap(([key, value]) => {
                if (key.includes(",")) {
                  const [x, y] = key.split(",").map(Number);

                  return new FurnitureTile(String(value), x, y, orient);
                }

                return [];
              })
            );
          }),
          tileEntry.corners && String(tileEntry.corners),
          tileEntry.layer && String(tileEntry.layer),
          config.folder
        );
      }
    );
  };

export type FurnitureTileConstructor<T extends Furniture> = (new (
  ...args: any[]
) => T) &
  Record<keyof typeof Furniture, any>;

export function getFurnitureEntryList<T extends Furniture>(
  tileEntries: T[],
  rootNode?: TbxNode
): [T, number][] {
  const entriesList = rootNode?.children[0].children;

  if (!entriesList) {
    return [];
  }

  return entriesList.flatMap((node, index) => {
    if (node.data.tag === "furniture") {
      const option = node.children[0].children[0].data?.params?.name;

      const tileEntry = tileEntries.find((e) => {
        return e.entries[0].tiles[0].tile === option;
      });

      if (!tileEntry) {
        console.log(`Can't find tile entry for ${option}`);

        return [];
      }

      return [[tileEntry, index]];
    }

    return [];
  });
}

export const findTileSuggestions = <T extends Furniture>(
  furnitureTile: T,
  allFurnitureTiles: Furniture[]
): Furniture[] => {
  if (!furnitureTile?.entries?.length) {
    return [];
  }

  const { layer, entries } = furnitureTile;
  // @ts-ignore
  const label = furnitureTile.constructor.label;
  const tileSize = entries[0].tiles.length;

  return allFurnitureTiles.filter((tile) => {
    const { layer: tileLayer, entries: tileEntries } = tile;
    // @ts-ignore
    const tileLabel = tile.constructor.label;

    if (tileLabel !== label || tileLayer !== layer) {
      return false;
    }

    return tileEntries[0].tiles.length === tileSize;
  });
};

export const furnitureList = [
  ApliancesCookingFurniture,
  LightingIndoorFurniture,
  SeatingIndoorFurniture,
  ApliancesLaundryFurniture,
  ApliancesRefrigerationFurniture,
  ApliancesTelevisionFurniture,
  CampingFurniture,
  CarpentryFurniture,
  ConstructionFurniture,
  BathroomFurniture,
  CountersFurniture,
  RailingsFurniture,
  WindowsFurniture,
  WindowsDetailingFurniture,
  FloorsRugsFurniture,
  FloorsBeddingFurniture,
  ShelvingFurniture,
  StorageFurniture,
  TablesHighFurniture,
  TablesLowFurniture,
  LightingOutdoorFurniture,
  TrashFurniture,
  WallsDecorationFurniture,
  WallsDetailingFurniture,
  WallsGraffitiFurniture,
  VegetationIndoorFurniture,
] as const;
