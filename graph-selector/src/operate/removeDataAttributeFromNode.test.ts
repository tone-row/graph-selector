import { removeDataAttributeFromNode } from "./removeDataAttributeFromNode";

describe("removeDataAttributeFromNode", () => {
  test("it removes a data attribute from a node", () => {
    expect(
      removeDataAttributeFromNode({
        line: 'node [test="test"]',
        name: "test",
      }),
    ).toEqual("node");
  });

  test("it removes a data attribute from a node that starts a collection", () => {
    expect(
      removeDataAttributeFromNode({
        line: 'node [data-test="test"] {',
        name: "data-test",
      }),
    ).toEqual("node {");
  });

  test("it can remove a boolean attribute", () => {
    expect(
      removeDataAttributeFromNode({
        line: "node [test]",
        name: "test",
      }),
    ).toEqual("node");
  });

  test("it can remove a number attribute", () => {
    expect(
      removeDataAttributeFromNode({
        line: "node [test=1]",
        name: "test",
      }),
    ).toEqual("node");
  });

  test("can remove an attribute when line has edge label", () => {
    expect(
      removeDataAttributeFromNode({
        line: '  edge: node [test="test"]',
        name: "test",
      }),
    ).toEqual("  edge: node");
  });

  test("can remove an attribute when line has edge label and starts container", () => {
    expect(
      removeDataAttributeFromNode({
        line: '  edge: node [test="test"] {',
        name: "test",
      }),
    ).toEqual("  edge: node {");
  });

  test("can remove attribute when node has ID", () => {
    expect(
      removeDataAttributeFromNode({
        line: 'node #foo[test="test"]',
        name: "test",
      }),
    ).toEqual("node #foo");
  });

  test("does nothing if attribute not present", () => {
    expect(
      removeDataAttributeFromNode({
        line: "node",
        name: "test",
      }),
    ).toEqual("node");
  });
});
