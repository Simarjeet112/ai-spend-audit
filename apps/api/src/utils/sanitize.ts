import xss from "xss";

export function sanitizeString(input: string): string {
  return xss(input.trim(), {
    whiteList: {},
    stripIgnoreTag: true,
    stripIgnoreTagBody: ["script"],
  });
}
