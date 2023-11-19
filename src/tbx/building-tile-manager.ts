import { TbxNode } from "./tbx";
import { Metadata } from "./types";
import { TbxDataManager } from "./tbx-data-manager";
import { BuildingEntry, BuildingTile, EmptyBuildingEntry } from "../model";

export class BuildingTileMetadata {
  public tile: BuildingEntry;
  public metadata: Metadata;

  constructor(tile: BuildingEntry, metadata: Metadata = {}) {
    this.tile = tile;
    this.metadata = metadata;
  }

  setTile(tile: BuildingEntry): void {
    this.tile = tile;

    this.metadata.node?.children.forEach((tileNode, index) => {
      tileNode.data.params!.tile = tile.tiles[index]?.tile;
    });
  }

  getOptions(buildingEntries: BuildingEntry[]): BuildingEntry[] {
    return buildingEntries.filter((entry) => {
      const substitutionLabels = this.tile.getSubstitutionCategories() ?? [
        // @ts-ignore
        this.tile.constructor.category,
      ];

      // @ts-ignore
      return substitutionLabels.includes(entry.constructor.category);
    });
  }

  getRandomOption(buildingEntries: BuildingEntry[]): BuildingEntry {
    const options = buildingEntries.filter((entry) => {
      // @ts-ignore
      return entry.constructor.category === this.tile.constructor.category;
    });

    return options[Math.floor(Math.random() * options.length)];
  }
}

export class BuildingTileManager {
  private tbxManager: TbxDataManager;
  private buildingEntries: BuildingEntry[];

  constructor(tbxManager: TbxDataManager, buildingEntries: BuildingEntry[]) {
    this.tbxManager = tbxManager;
    this.buildingEntries = buildingEntries;
  }

  private getTileEntryFromNode(node: TbxNode): BuildingEntry {
    const option = node.children[0].data?.params?.tile;

    const buildingTileEntry = this.buildingEntries.find((entry) => {
      return entry.tiles[0].tile === option;
    });

    if (!buildingTileEntry) {
      return new EmptyBuildingEntry([new BuildingTile("", option ?? "")]);
    }

    return buildingTileEntry;
  }

  private formatCategory(category?: string): string {
    if (!category) {
      return "Unknown";
    }

    return category
      .split("_")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");
  }

  getBuildingEntries(floor: number): BuildingTileMetadata[] {
    const floorNode = this.tbxManager.getFloors()[floor];
    const tiles = this.tbxManager.getTileEntries();

    const skipTypes = ["furniture", "rooms"];

    const buildingNodes = floorNode.children.filter((node) => {
      return !skipTypes.includes(node.data.params?.type ?? "");
    });

    const buildingTileIndexes = buildingNodes.reduce((acc, node) => {
      const {
        Tile,
        CapTiles,
        SlopeTiles,
        TopTiles,
        FrameTile,
        CurtainsTile,
        ShuttersTile,
        x,
        y,
      } = node.data.params ?? {};
      const tileIndexes = [
        Tile,
        CapTiles,
        SlopeTiles,
        TopTiles,
        FrameTile,
        CurtainsTile,
        ShuttersTile,
      ]
        .map(Number)
        .filter(Boolean);

      tileIndexes.forEach((tileIndex) => {
        if (!acc[tileIndex]) {
          acc[tileIndex] = [];
        }
        const roomName = this.tbxManager.getRoomNameByCoords(
          floor,
          Number(x),
          Number(y)
        );
        if (roomName) {
          acc[tileIndex].push(roomName);
        }
      });

      return acc;
    }, {} as Record<number, string[]>);

    return Object.entries(buildingTileIndexes).map(([nodeIndex, rooms]) => {
      const node = tiles[Number(nodeIndex) - 1];

      return new BuildingTileMetadata(this.getTileEntryFromNode(node), {
        node,
        room:
          Array.from(new Set(rooms)).join(", ") ||
          this.formatCategory(node.data.params?.category),
      });
    });
  }

  getInteriorWalls(floor: number): BuildingTileMetadata[] {
    const usedRooms = this.tbxManager.getUniqueRooms(floor);
    const rooms = this.tbxManager.getRooms().filter((_, index) => {
      return usedRooms.includes(index + 1);
    });

    if (!rooms.length) {
      return [];
    }

    const tileEntries = this.tbxManager.getTileEntries();
    const interiorWallIndexes = rooms.reduce((acc, room) => {
      const { InteriorWall: tileIndexStr = "", Name } = room.data.params ?? {};

      if (!tileIndexStr) {
        return acc;
      }

      const tileIndex = Number(tileIndexStr) - 1;

      if (!acc[tileIndex]) {
        acc[tileIndex] = [];
      }

      acc[tileIndex].push(Name);

      return acc;
    }, {} as Record<number, string[]>);

    return Object.entries(interiorWallIndexes).map(([index, rooms]) => {
      const node = tileEntries[Number(index)];

      return new BuildingTileMetadata(this.getTileEntryFromNode(node), {
        node,
        room: Array.from(new Set(rooms)).join(", "),
      });
    });
  }

  getExteriorWalls(_floor?: number): BuildingTileMetadata[] {
    const buildingNode = this.tbxManager.getBuildingNode();
    const { ExteriorWall, ExteriorWallTrim } = buildingNode.data.params ?? {};
    const tileEntries = this.tbxManager.getTileEntries();
    const nodes = [ExteriorWall, ExteriorWallTrim].flatMap((indexStr) => {
      const index = Number(indexStr);

      if (!index) {
        return [];
      }

      return tileEntries[index - 1] ?? [];
    });

    return nodes.map((node) => {
      return new BuildingTileMetadata(this.getTileEntryFromNode(node), {
        node,
        room: "Exterior Wall",
      });
    });
  }
}
