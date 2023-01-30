import { operate } from "./operate";

describe("operate", () => {
  test("should return a string", () => {
    expect(
      operate("hello .world", {
        lineNumber: 1,
        operation: [
          "removeClassesFromNode",
          {
            classNames: ["world"],
          },
        ],
      }),
    ).toBe("hello");
  });

  test("leaves comments intact", () => {
    expect(
      operate("// some comment\nhello .world\n// some other comment", {
        lineNumber: 2,
        operation: [
          "removeClassesFromNode",
          {
            classNames: ["world"],
          },
        ],
      }),
    ).toBe("// some comment\nhello\n// some other comment");
  });

  test("line number should be 1-indexed", () => {
    const run = () =>
      operate("hello .world", {
        lineNumber: 0,
        operation: ["addClassesToNode", { classNames: ["c"] }],
      });
    expect(run).toThrow("lineNumber must be 1-indexed");
  });

  test("should throw if line number is out of bounds", () => {
    const run = () =>
      operate("hello .world", {
        lineNumber: 2,
        operation: ["addClassesToNode", { classNames: ["c"] }],
      });
    expect(run).toThrow("lineNumber must be less than the number of lines");
  });
});
