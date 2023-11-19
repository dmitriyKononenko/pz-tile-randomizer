import { Tbx, TbxNode } from "./tbx";

export class TbxDataManager {
  private tbx: Tbx;

  constructor(tbx: Tbx) {
    this.tbx = tbx;
  }

  findNodeByTag(tag: string): TbxNode[] {
    return this.tbx.node.children[0].children.filter(
      (node) => node.data.tag === tag
    );
  }

  getBuildingNode(): TbxNode {
    return this.tbx.node.children[0];
  }

  getFloors(): TbxNode[] {
    return this.findNodeByTag("floor");
  }

  getRooms(): TbxNode[] {
    return this.findNodeByTag("room");
  }

  getTileEntries(): TbxNode[] {
    return this.findNodeByTag("tile_entry");
  }

  getFurniture(): TbxNode[] {
    return this.findNodeByTag("furniture");
  }

  getRoomsMap(floor: number): number[][] {
    const roomsMap = this.getFloors()
      [floor].children.find((node) => node.data.tag === "rooms")
      ?.children.map(
        (node) =>
          node.data.raw?.split(",").flatMap((roomIndex) => {
            if (!roomIndex) {
              return [];
            }

            return Number(roomIndex);
          }) ?? []
      );

    if (!roomsMap?.length) {
      return [];
    }

    return roomsMap;
  }

  getUniqueRooms(floor: number): number[] {
    return Array.from(new Set(this.getRoomsMap(floor).flat()));
  }

  getRoomNameByCoords(floor: number, x: number, y: number): string | undefined {
    const rooms = this.getRooms();
    const roomsMap = this.getRoomsMap(floor);

    const safeX = x >= roomsMap[0].length ? roomsMap[0].length - 1 : x;
    const safeY = y >= roomsMap.length ? roomsMap.length - 1 : y;

    const roomIndex = roomsMap[safeY][safeX];

    const room = rooms[roomIndex - 1];

    return room?.data?.params?.Name;
  }
}
