import * as fs from "fs";

export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

export class TileDefinitions {
  private buildingFileName = "BuildingTiles.txt";
  private furnitureFileName = "BuildingFurniture.txt";

  private _furnitureDefinitions: JSONValue[] = [];
  private _buildingefinitions: JSONValue[] = [];

  public loadTileDefinitions(rootFolder: string): void {
    this._furnitureDefinitions = this.readDefinitionFiles(
      rootFolder,
      this.furnitureFileName
    );

    this._buildingefinitions = this.readDefinitionFiles(
      rootFolder,
      this.buildingFileName
    );
  }

  get furnitureDefinitions(): JSONValue[] {
    return this._furnitureDefinitions;
  }

  get buildingDefinitions(): JSONValue[] {
    return this._buildingefinitions;
  }

  private readDefinitionFiles(
    rootFolder: string,
    fileName: string
  ): JSONValue[] {
    const folders = fs.readdirSync(rootFolder).filter((file) => {
      return fs.statSync(rootFolder + "/" + file).isDirectory();
    });

    const definitionFilePaths = folders.flatMap((folder) => {
      const furnitureFilePath = rootFolder + "/" + folder + "/" + fileName;

      if (fs.existsSync(furnitureFilePath)) {
        return [[furnitureFilePath, folder]];
      }

      return [];
    });

    return definitionFilePaths.flatMap(([filePath, folder]) => {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const jsonData = this.txtToJson(fileContent);
      // @ts-ignore
      jsonData.folder = folder;
      return jsonData;
    });
  }

  private getHeaderData = (data: string): string[] => {
    const metatags = ["version", "revision"];

    const headers = data
      .slice(0, data.indexOf("{"))
      .split("\n")
      .map((t) => t.trim())
      .filter((tag) => !metatags.some((t) => tag.includes(t)) && Boolean(tag));

    return headers;
  };

  private converter = (data: string, first = true): JSONValue => {
    const result: JSONValue = {};

    if (first) {
      data = data.replaceAll(" ", "");
    }
    const header = this.getHeaderData(data);

    header.forEach((head) => {
      if (head.includes("}")) {
        return;
      }

      if (head.includes("=")) {
        const [key, value] = head.split("=").map((t) => t.trim());

        result[key] = value;

        return;
      }

      const [_head, ...blocks] = data.split(head + "\n{");

      result[head] = blocks.map((chunk) => this.converter(chunk, false));
    });

    return result;
  };

  private txtToJson = (data: string): JSONValue => {
    return this.converter(data);
  };
}
