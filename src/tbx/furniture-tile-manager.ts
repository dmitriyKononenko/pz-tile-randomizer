import {
  EmptyFurniture,
  Furniture,
  FurnitureEntry,
  FurnitureTile,
} from "../model";
import { TbxNode } from "./tbx";
import { Metadata } from "./types";
import { TbxDataManager } from "./tbx-data-manager";

export class FurnitureTileMetadata {
  public tile: Furniture;
  public metadata: Metadata;

  constructor(tile: Furniture, metadata: Metadata = {}) {
    this.tile = tile;
    this.metadata = metadata;
  }

  setTile(tile: Furniture): void {
    this.tile = tile;

    this.metadata.node?.children.forEach((tileEntry, i) => {
      tileEntry.children.forEach((tileNode, ti) => {
        tileNode.data.params!.name = tile.entries[i]?.tiles[ti]?.tile;
      });
    });
  }

  getOptions(furnitureEntries: Furniture[]): Furniture[] {
    const { layer, entries } = this.tile;

    // @ts-ignore
    const label = this.tile.constructor.label;
    const tileSize = entries[0].tiles.length;

    return furnitureEntries.filter((tile) => {
      const { layer: tileLayer, entries: tileEntries } = tile;
      // @ts-ignore
      const tileLabel = tile.constructor.label;

      if (tileLabel !== label || tileLayer !== layer) {
        return false;
      }

      return tileEntries[0].tiles.length === tileSize;
    });
  }

  getRandomOption(buildingEntries: Furniture[]): Furniture {
    const options = buildingEntries.filter((entry) => {
      // @ts-ignore
      return entry.constructor.label === this.tile.constructor.label;
    });

    return options[Math.floor(Math.random() * options.length)];
  }
}

export class FurnitureTileManager {
  private tbxManager: TbxDataManager;
  private furnitureEntries: Furniture[];

  constructor(tbxManager: TbxDataManager, furnitureEntries: Furniture[]) {
    this.tbxManager = tbxManager;
    this.furnitureEntries = furnitureEntries;
  }

  private getTileEntryFromNode(node: TbxNode): Furniture {
    const option = node.children[0].children[0].data?.params?.name;

    const tileEntry = this.furnitureEntries.find((e) => {
      return e.entries[0].tiles[0].tile === option;
    });

    if (!tileEntry) {
      return new EmptyFurniture([
        new FurnitureEntry([new FurnitureTile(option ?? "", 0, 0, "")]),
      ]);
    }

    return tileEntry;
  }

  private formatLabel(label?: string): string {
    if (!label) {
      return "Unknown";
    }

    return label
      .split("_")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");
  }

  getFurnitureEntries(floor: number): FurnitureTileMetadata[] {
    const floorNode = this.tbxManager.getFloors()[floor];
    const furnitureList = this.tbxManager.getFurniture();

    const furnitureObjects = floorNode.children.filter((node) => {
      return node.data.params?.type === "furniture";
    });

    const furnitureTileIndexes = furnitureObjects.reduce((acc, node) => {
      const { FurnitureTiles, x, y } = node.data.params ?? {};
      const tileIndexes = [FurnitureTiles].map(Number).filter(Boolean);

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

    return Object.entries(furnitureTileIndexes).map(([nodeIndex, rooms]) => {
      const node = furnitureList[Number(nodeIndex)];

      return new FurnitureTileMetadata(this.getTileEntryFromNode(node), {
        node,
        room:
          Array.from(new Set(rooms)).join(", ") ||
          this.formatLabel(node.data.params?.label),
      });
    });
  }
}
