import { addClassToNode } from "./addClassToNode";

describe("addClassToNode", () => {
  it("should add class to node", () => {
    const result = addClassToNode({
      line: "  to: my node",
      className: "foo",
    });
    expect(result).toEqual("  to: my node .foo");
  });

  it("should work if line starts container", () => {
    const result = addClassToNode({
      line: "my node {",
      className: "foo",
    });
    expect(result).toEqual("my node .foo {");
  });

  it("should work when an ID is present", () => {
    const result = addClassToNode({
      line: "my node #my-id",
      className: "foo",
    });
    expect(result).toEqual("my node #my-id.foo");
  });

  it("should work when an ID is present and line starts container", () => {
    const result = addClassToNode({
      line: "my node #my-id {",
      className: "foo",
    });
    expect(result).toEqual("my node #my-id.foo {");
  });

  it("should work when the line contains attributes only", () => {
    const result = addClassToNode({
      line: "my node [foo=bar]",
      className: "foo",
    });
    expect(result).toEqual('my node .foo[foo="bar"]');
  });

  it("should work when the line contains attributes only and line starts container", () => {
    const result = addClassToNode({
      line: "my node [foo=bar] {",
      className: "foo",
    });
    expect(result).toEqual('my node .foo[foo="bar"] {');
  });

  it("should work when the line contains attributes and an ID", () => {
    const result = addClassToNode({
      line: "my node #my-id[foo=bar]",
      className: "foo",
    });
    expect(result).toEqual('my node #my-id.foo[foo="bar"]');
  });

  it("should work when the line contains attributes and an ID and line starts container", () => {
    const result = addClassToNode({
      line: "my node #my-id[foo=bar] {",
      className: "foo",
    });
    expect(result).toEqual('my node #my-id.foo[foo="bar"] {');
  });

  it("should work when the line contains classes only", () => {
    const result = addClassToNode({
      line: "my node .my-class",
      className: "foo",
    });
    expect(result).toEqual("my node .my-class.foo");
  });

  it("should work when the line contains classes only and line starts container", () => {
    const result = addClassToNode({
      line: "my node .my-class {",
      className: "foo",
    });
    expect(result).toEqual("my node .my-class.foo {");
  });

  it("should work when the line contains classes and an ID", () => {
    const result = addClassToNode({
      line: "my node #my-id.my-class",
      className: "foo",
    });
    expect(result).toEqual("my node #my-id.my-class.foo");
  });

  it("should work when the line contains classes and an ID and line starts container", () => {
    const result = addClassToNode({
      line: "my node #my-id.my-class {",
      className: "foo",
    });
    expect(result).toEqual("my node #my-id.my-class.foo {");
  });

  it("should work when the line contains classes and attributes", () => {
    const result = addClassToNode({
      line: "my node .my-class[foo=bar]",
      className: "foo",
    });
    expect(result).toEqual('my node .my-class.foo[foo="bar"]');
  });

  it("should work when the line contains classes and attributes and line starts container", () => {
    const result = addClassToNode({
      line: "my node .my-class[foo=bar] {",
      className: "foo",
    });
    expect(result).toEqual('my node .my-class.foo[foo="bar"] {');
  });
});
