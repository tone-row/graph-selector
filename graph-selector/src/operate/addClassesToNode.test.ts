import { addClassesToNode } from "./addClassesToNode";

describe("addClassesToNode", () => {
  it("should add class to node", () => {
    const result = addClassesToNode({
      line: "  to: my node",
      classNames: ["foo"],
    });
    expect(result).toEqual("  to: my node .foo");
  });

  it("should work if line starts container", () => {
    const result = addClassesToNode({
      line: "my node {",
      classNames: ["foo"],
    });
    expect(result).toEqual("my node .foo {");
  });

  it("should work when an ID is present", () => {
    const result = addClassesToNode({
      line: "my node #my-id",
      classNames: ["foo"],
    });
    expect(result).toEqual("my node #my-id.foo");
  });

  it("should work when an ID is present and line starts container", () => {
    const result = addClassesToNode({
      line: "my node #my-id {",
      classNames: ["foo"],
    });
    expect(result).toEqual("my node #my-id.foo {");
  });

  it("should work when the line contains attributes only", () => {
    const result = addClassesToNode({
      line: "my node [foo=bar]",
      classNames: ["foo"],
    });
    expect(result).toEqual('my node .foo[foo="bar"]');
  });

  it("should work when the line contains attributes only and line starts container", () => {
    const result = addClassesToNode({
      line: "my node [foo=bar] {",
      classNames: ["foo"],
    });
    expect(result).toEqual('my node .foo[foo="bar"] {');
  });

  it("should work when the line contains attributes and an ID", () => {
    const result = addClassesToNode({
      line: "my node #my-id[foo=bar]",
      classNames: ["foo"],
    });
    expect(result).toEqual('my node #my-id.foo[foo="bar"]');
  });

  it("should work when the line contains attributes and an ID and line starts container", () => {
    const result = addClassesToNode({
      line: "my node #my-id[foo=bar] {",
      classNames: ["foo"],
    });
    expect(result).toEqual('my node #my-id.foo[foo="bar"] {');
  });

  it("should work when the line contains classes only", () => {
    const result = addClassesToNode({
      line: "my node .my-class",
      classNames: ["foo"],
    });
    expect(result).toEqual("my node .my-class.foo");
  });

  it("should work when the line contains classes only and line starts container", () => {
    const result = addClassesToNode({
      line: "my node .my-class {",
      classNames: ["foo"],
    });
    expect(result).toEqual("my node .my-class.foo {");
  });

  it("should work when the line contains classes and an ID", () => {
    const result = addClassesToNode({
      line: "my node #my-id.my-class",
      classNames: ["foo"],
    });
    expect(result).toEqual("my node #my-id.my-class.foo");
  });

  it("should work when the line contains classes and an ID and line starts container", () => {
    const result = addClassesToNode({
      line: "my node #my-id.my-class {",
      classNames: ["foo"],
    });
    expect(result).toEqual("my node #my-id.my-class.foo {");
  });

  it("should work when the line contains classes and attributes", () => {
    const result = addClassesToNode({
      line: "my node .my-class[foo=bar]",
      classNames: ["foo"],
    });
    expect(result).toEqual('my node .my-class.foo[foo="bar"]');
  });

  it("should work when the line contains classes and attributes and line starts container", () => {
    const result = addClassesToNode({
      line: "my node .my-class[foo=bar] {",
      classNames: ["foo"],
    });
    expect(result).toEqual('my node .my-class.foo[foo="bar"] {');
  });

  it("should work with multiple classes", () => {
    const result = addClassesToNode({
      line: "my node",
      classNames: ["foo", "bar"],
    });
    expect(result).toEqual("my node .foo.bar");
  });

  it("should not add class if class already present", () => {
    const result = addClassesToNode({
      line: "my node .foo",
      classNames: ["foo"],
    });
    expect(result).toEqual("my node .foo");
  });
});
