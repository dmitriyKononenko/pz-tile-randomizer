interface NodeData {
  tag: string;
  params?: Record<string, string>;
  raw?: string;
  closed?: boolean;
}

export class TbxNode {
  public parent: TbxNode | null = null;
  public children: TbxNode[] = [];

  constructor(readonly data: NodeData) {}

  set addChildren(node: TbxNode) {
    this.children.push(node);
  }
}

const getParams = (params: string): NodeData["params"] | undefined => {
  const parsedParams = params
    .trim()
    .match(/([a-zA-Z]+?=".*?")/g)
    ?.map((param) => {
      const [key, value] = param.split("=");

      return [key, value?.replaceAll('"', "") || ""];
    });

  if (!parsedParams) {
    return;
  }

  return Object.fromEntries(parsedParams);
};

export class Tbx {
  private header = '<?xml version="1.0" encoding="UTF-8"?>';
  private spacing = " ";

  constructor(private readonly _node: TbxNode) {}

  static fromString(data: string): Tbx {
    const dataRows = data.trim().split("\n");

    const result = new TbxNode({
      tag: "root",
    });
    let pointer: TbxNode = result;

    for (const row of dataRows) {
      const preparedRow = row.trim();

      if (!preparedRow) {
        continue;
      }

      if (preparedRow.startsWith("<?")) {
        continue;
      }

      if (preparedRow.startsWith("</") && pointer.parent) {
        pointer = pointer.parent;

        continue;
      }

      const matchResult = preparedRow.match(
        /^\<(?<tag>[a-zA-Z_]+)(?<params>\s(.+=".*"))*(?<closed>\/?)>$/i
      );

      if (!matchResult) {
        const node = new TbxNode({
          tag: "raw",
          raw: row,
        });
        node.parent = pointer;

        pointer?.children.push(node);

        continue;
      }

      const { closed, params, tag } = matchResult.groups ?? {};
      const isCLosed = Boolean(closed);

      const node = new TbxNode({
        tag,
        closed: isCLosed,
        params: params ? getParams(params) : undefined,
      });

      if (isCLosed) {
        pointer.children.push(node);
        node.parent = pointer;
      } else {
        pointer.children.push(node);
        node.parent = pointer;
        pointer = node;
      }
    }

    if (!result) {
      throw new Error("Unable to parce tbx data.");
    }

    return new Tbx(result);
  }

  get node(): TbxNode {
    return this._node;
  }

  private getSpacing(spacing = 0) {
    return (
      "\n" +
      Array.from({ length: spacing })
        .map(() => this.spacing)
        .join("")
    );
  }

  private isTag(data: string) {
    return data.startsWith("<");
  }

  private stringifyNode(node: TbxNode, spacing = 0) {
    if (node.data.raw) {
      const raw = node.data.raw.trim();

      return this.isTag(raw) ? this.getSpacing(spacing) + raw : "\n" + raw;
    }

    let result = this.getSpacing(spacing);

    result += `<${node.data.tag}${
      node.data.params
        ? ` ${Object.entries(node.data.params)
            .map(([key, value]) => `${key}="${value}"`)
            .join(" ")}`
        : ""
    }${node.data.closed ? "/" : ""}>`;

    if (node.children.length) {
      result += node.children
        .map((child) => this.stringifyNode(child, spacing + 1))
        .join("");

      if (node.data.tag) {
        result += `${this.getSpacing(spacing)}</${node.data.tag}>`;
      }
    }

    return result;
  }

  toString(): string {
    let result = this.header;

    if (this._node.children.length) {
      result += this._node.children
        .map((node) => this.stringifyNode(node))
        .join("");
    }

    return result;
  }
}
