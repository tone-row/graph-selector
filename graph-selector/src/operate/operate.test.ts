import { operate } from "./operate";

describe("operate", () => {
  test("should return a string", () => {
    expect(
      operate("hello .world", {
        lineNumber: 0,
        operation: [
          "removeClassFromNode",
          {
            className: "world",
          },
        ],
      }),
    ).toBe("hello");
  });

  test("leaves comments intact", () => {
    expect(
      operate("// some comment\nhello .world\n// some other comment", {
        lineNumber: 1,
        operation: [
          "removeClassFromNode",
          {
            className: "world",
          },
        ],
      }),
    ).toBe("// some comment\nhello\n// some other comment");
  });
});
