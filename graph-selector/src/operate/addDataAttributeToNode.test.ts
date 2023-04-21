import { addDataAttributeToNode } from "./addDataAttributeToNode";

describe("addDataAttributeToNode", () => {
  test("it adds a data attribute to a node", () => {
    expect(
      addDataAttributeToNode({
        line: "node",
        name: "test",
        value: "test",
      }),
    ).toEqual('node [test="test"]');
  });

  test("it adds a data attribute to a node that starts a collection", () => {
    expect(
      addDataAttributeToNode({
        line: "node {",
        name: "data-test",
        value: "test",
      }),
    ).toEqual('node [data-test="test"] {');
  });

  test("it can add a boolean attribute", () => {
    expect(
      addDataAttributeToNode({
        line: "node",
        name: "test",
        value: true,
      }),
    ).toEqual("node [test]");
  });

  test("it can add a number attribute", () => {
    expect(
      addDataAttributeToNode({
        line: "node",
        name: "test",
        value: 1,
      }),
    ).toEqual("node [test=1]");
  });

  test("it can add an attribute when the element has an edge label", () => {
    expect(
      addDataAttributeToNode({
        line: "  edge: node",
        name: "test",
        value: "test",
      }),
    ).toEqual('  edge: node [test="test"]');
  });

  test("can add attribute when node has ID", () => {
    expect(
      addDataAttributeToNode({
        line: "node #foo",
        name: "test",
        value: "test",
      }),
    ).toEqual('node #foo[test="test"]');
  });
});
