import { describe, expect, test } from "vitest";
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

  test("can add/remove data attributes", () => {
    expect(
      operate("hello .world", {
        lineNumber: 1,
        operation: [
          "addDataAttributeToNode",
          {
            name: "foo",
            value: "bar",
          },
        ],
      }),
    ).toBe('hello .world[foo="bar"]');

    expect(
      operate('hello .world[foo="bar"]', {
        lineNumber: 1,
        operation: [
          "removeDataAttributeFromNode",
          {
            name: "foo",
          },
        ],
      }),
    ).toBe("hello .world");
  });

  /* This test is combatting a specific bug found in the wild. */
  test("can add/remove classes from edges with similar names", () => {
    const classes = ["triangle", "source-triangle-tee", "source-circle-triangle"];

    // removes all classes and then adds one
    function addClass(text: string, c: string) {
      let newText = operate(text, {
        lineNumber: 1,
        operation: ["removeClassesFromEdge", { classNames: classes }],
      });
      newText = operate(newText, {
        lineNumber: 1,
        operation: ["addClassesToEdge", { classNames: [c] }],
      });
      return newText;
    }

    let text = "  foo";
    text = addClass(text, "source-triangle-tee");
    text = addClass(text, "source-circle-triangle");
    expect(text).toBe("  .source-circle-triangle: foo");
  });
});
