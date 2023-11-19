export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

const getHeaderData = (data: string): string[] => {
  const metatags = ["version", "revision"];

  const headers = data
    .slice(0, data.indexOf("{"))
    .split("\n")
    .map((t) => t.trim())
    .filter((tag) => !metatags.some((t) => tag.includes(t)) && Boolean(tag));

  return headers;
};

const converter = (data: string, first = true): JSONValue => {
  const result: JSONValue = {};

  if (first) {
    data = data.replaceAll(" ", "");
  }
  const header = getHeaderData(data);

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

    result[head] = blocks.map((chunk) => converter(chunk, false));
  });

  return result;
};

export const txtToJson = (data: string): JSONValue => {
  return converter(data);
};
