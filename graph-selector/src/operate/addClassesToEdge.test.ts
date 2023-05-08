import { addClassesToEdge } from "./addClassesToEdge";

describe("addClassesToEdge", () => {
  it("should add class to edge", () => {
    expect(addClassesToEdge({ line: "  edge: foo", classNames: ["bar"] })).toBe("  .bar edge: foo");
  });

  it("should work if line starts container", () => {
    expect(addClassesToEdge({ line: "  edge: foo {", classNames: ["bar"] })).toBe(
      "  .bar edge: foo {",
    );
  });

  it("should work when an ID is present", () => {
    expect(addClassesToEdge({ line: "  #baz edge: foo", classNames: ["bar"] })).toBe(
      "  #baz.bar edge: foo",
    );
  });

  it("should work when edge has no label", () => {
    expect(addClassesToEdge({ line: "  #baz: node", classNames: ["bar"] })).toBe(
      "  #baz.bar: node",
    );
  });

  it("should work when an ID is present and line starts container", () => {
    expect(addClassesToEdge({ line: "  #baz edge: foo {", classNames: ["bar"] })).toBe(
      "  #baz.bar edge: foo {",
    );
  });

  it("should work when the line contains attributes only", () => {
    expect(addClassesToEdge({ line: "  [foo=bar] edge: foo", classNames: ["bar"] })).toBe(
      '  .bar[foo="bar"] edge: foo',
    );
  });

  it("should work when the line contains attributes only and line starts container", () => {
    expect(addClassesToEdge({ line: "  [foo=bar]: foo {", classNames: ["bar"] })).toBe(
      '  .bar[foo="bar"]: foo {',
    );
  });

  it("should work when the line contains attributes and an ID", () => {
    expect(addClassesToEdge({ line: "  #baz[foo=bar] edge: foo", classNames: ["bar"] })).toBe(
      '  #baz.bar[foo="bar"] edge: foo',
    );
  });

  it("should work when the line contains attributes and an ID and line starts container", () => {
    expect(addClassesToEdge({ line: "  #baz[foo=bar]: foo {", classNames: ["bar"] })).toBe(
      '  #baz.bar[foo="bar"]: foo {',
    );
  });

  it("should work when the line contains classes only", () => {
    expect(addClassesToEdge({ line: "  .baz edge: foo", classNames: ["bar"] })).toBe(
      "  .baz.bar edge: foo",
    );
  });

  it("should work when the line contains classes only and line starts container", () => {
    expect(addClassesToEdge({ line: "  .baz: foo {", classNames: ["bar"] })).toBe(
      "  .baz.bar: foo {",
    );
  });

  it("should work when the line contains classes and an ID", () => {
    expect(addClassesToEdge({ line: "  #baz.baz edge: foo", classNames: ["bar"] })).toBe(
      "  #baz.baz.bar edge: foo",
    );
  });

  it("should work when the line contains classes and an ID and line starts container", () => {
    expect(addClassesToEdge({ line: "  #baz.baz: foo {", classNames: ["bar"] })).toBe(
      "  #baz.baz.bar: foo {",
    );
  });

  it("should work when the line contains classes and attributes", () => {
    expect(addClassesToEdge({ line: "  .baz[foo=bar] edge: foo", classNames: ["bar"] })).toBe(
      '  .baz.bar[foo="bar"] edge: foo',
    );
  });

  it("should work when the line contains classes and attributes and line starts container", () => {
    expect(addClassesToEdge({ line: "  .baz[foo=bar]: foo {", classNames: ["bar"] })).toBe(
      '  .baz.bar[foo="bar"]: foo {',
    );
  });

  it("should work with multiple classes", () => {
    expect(addClassesToEdge({ line: "  .baz.baz edge: foo", classNames: ["bar", "foo"] })).toBe(
      "  .baz.baz.bar.foo edge: foo",
    );
  });

  it("should not add class if class already present", () => {
    expect(addClassesToEdge({ line: "  .bar edge: foo", classNames: ["bar"] })).toBe(
      "  .bar edge: foo",
    );
  });
});
