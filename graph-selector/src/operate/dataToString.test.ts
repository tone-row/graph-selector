import { dataToString } from "./dataToString";

describe("dataToString", () => {
  test("should convert true attributes to []", () => {
    const result = dataToString({ something: true });
    expect(result).toEqual("[something]");
  });

  test("should wrap strings with double quotes in single quotes", () => {
    const result = dataToString({ something: '"foo"' });
    expect(result).toEqual("[something='\"foo\"']");
  });

  test("should not wrap numbers in quotes", () => {
    const result = dataToString({ something: 123 });
    expect(result).toEqual("[something=123]");
  });
});
