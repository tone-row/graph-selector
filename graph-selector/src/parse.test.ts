import { parse } from "./parse";

describe("parse", () => {
  test("it returns nodes and edges", () => {
    const result = parse(`a\n  b`);
    expect(result).toHaveProperty("nodes");
    expect(result).toHaveProperty("edges");
  });
  /* Nodes */
  test("nodes have label", () => {
    const result = parse(`a\nb`);
    expect(result.nodes[0].label).toEqual("a");
    expect(result.nodes[1].label).toEqual("b");
  });

  test("nodes have line number", () => {
    const result = parse(`a\nb`);
    expect(result.nodes[0].lineNumber).toEqual(1);
    expect(result.nodes[1].lineNumber).toEqual(2);
  });

  test("nodes have unique IDs", () => {
    const result = parse(`a\na`);
    expect(result.nodes[0].id).toEqual("a1");
    expect(result.nodes[1].id).toEqual("a2");
  });

  test("allow custom ID", () => {
    const result = parse(`#x a\n  #y b`);
    expect(result.nodes[0].id).toEqual("x");
    expect(result.nodes[1].id).toEqual("y");
  });

  test("custom id not included in label", () => {
    const result = parse(`#x a`);
    expect(result.nodes[0].id).toEqual("x");
    expect(result.nodes[0].label).toEqual("a");
  });

  test("can read classes without id", () => {
    const result = parse(`.class1.class2 a`);
    expect(result.nodes[0].classes).toEqual(".class1.class2");
    expect(result.nodes[0].label).toEqual("a");
  });

  test("can read classes with id", () => {
    const result = parse(`#x.class1.class2 a`);
    expect(result.nodes[0].id).toEqual("x");
    expect(result.nodes[0].classes).toEqual(".class1.class2");
    expect(result.nodes[0].label).toEqual("a");
  });

  test("creates edge with indentation", () => {
    const result = parse(`a\n  b`);
    expect(result.edges[0].source).toEqual("a1");
    expect(result.edges[0].target).toEqual("b1");
    expect(result.edges.length).toEqual(1);
  });

  test("create edge with label", () => {
    const result = parse(`a\n  b: c`);
    expect(result.edges[0].source).toEqual("a1");
    expect(result.edges[0].target).toEqual("c1");
    expect(result.edges[0].label).toEqual("b");
    expect(result.edges.length).toEqual(1);
  });

  test("can parse id, classes when edge label", () => {
    const result = parse(`a\n  b: #x.class1.class2 c`);
    const edge = result.edges[0];
    const node = result.nodes[1];
    expect(edge.source).toEqual("a1");
    expect(edge.target).toEqual("x");
    expect(edge.label).toEqual("b");
    expect(edge.id).toEqual("a1-x-1");
    expect(node.id).toEqual("x");
    expect(node.classes).toEqual(".class1.class2");
  });

  test("should preserve spaces in labels", () => {
    let result = parse(`#b a long label`);
    const node = result.nodes[0];
    expect(node.label).toEqual("a long label");

    result = parse(`another one`);
    const node2 = result.nodes[0];
    expect(node2.label).toEqual("another one");
  });

  test("should parse attributes w/o quotes", () => {
    const result = parse(`[d=e][f=a] c`);
    expect(result.nodes[0].d).toEqual("e");
    expect(result.nodes[0].f).toEqual("a");
  });

  test("can parse all node qualities", () => {
    expect(parse(`#long-id.class1.class2[d=e][f=a] c`).nodes[0]).toMatchInlineSnapshot(`
      Object {
        "classes": ".class1.class2",
        "d": "e",
        "f": "a",
        "id": "long-id",
        "label": "c",
        "lineNumber": 1,
      }
    `);
  });

  test("should create node with only data", () => {
    const result = parse(`[d=e]\n[f=a]`);
    expect(result.nodes.length).toEqual(2);
  });

  /* Pointers */
  test("can parse pointer to label", () => {
    const result = parse(`a\n  (a)`);
    expect(result.edges[0].source).toEqual("a1");
    expect(result.edges[0].target).toEqual("a1");
    expect(result.edges.length).toEqual(1);
  });

  test("can parse pointer to id", () => {
    const result = parse(`#b b\na\n  (#b)`);
    expect(result.edges[0].source).toEqual("a1");
    expect(result.edges[0].target).toEqual("b");
    expect(result.edges.length).toEqual(1);
  });

  test("can parse pointer to class", () => {
    const result = parse(`.c c\na\n  (.c)`);
    expect(result.edges[0].source).toEqual("a1");
    expect(result.edges[0].target).toEqual("c1");
    expect(result.edges.length).toEqual(1);
  });

  test("can parse pointer source to raw node", () => {
    const result = parse(`a\n(a)\n  c`);
    expect(result.edges[0].source).toEqual("a1");
    expect(result.edges[0].target).toEqual("c1");
    expect(result.edges.length).toEqual(1);
  });

  test("can parse pointer source to id", () => {
    const result = parse(`a\n(a)\n  #myid c`);
    expect(result.edges[0].source).toEqual("a1");
    expect(result.edges[0].target).toEqual("myid");
    expect(result.edges.length).toEqual(1);
  });

  test("can parse pointer source to class", () => {
    const result = parse(`a\n.red some color\n(a)\n  (.red)`);
    expect(result.edges[0].source).toEqual("a1");
    expect(result.edges[0].target).toEqual("some color1");
    expect(result.edges.length).toEqual(1);
  });

  test("gets the right number of nodes", () => {
    const result = parse(`a
e
    (a) (e)`);
    expect(result.nodes.length).toEqual(2);
  });

  test("should work with chinese colon and parentheses", () => {
    const result = parse(`中文\n to：（中文）`);
    expect(result.edges).toEqual([
      {
        classes: "",
        id: "中文1-中文1-1",
        label: "to",
        lineNumber: 2,
        source: "中文1",
        target: "中文1",
      },
    ]);
    expect(result.nodes).toEqual([{ classes: "", id: "中文1", label: "中文", lineNumber: 1 }]);
  });

  /* Edges */

  test("gets correct line number for edges", () => {
    const result = parse(`#a[size=4] label a
#b[size=3] label b
#c[size=5] label c
#d[size=2] label d

(#a)
  (#c)
  (#d)
(#b)
  (#d)
`);
    expect(result.edges[0].lineNumber).toEqual(7);
    expect(result.edges[1].lineNumber).toEqual(8);
    expect(result.edges[2].lineNumber).toEqual(10);
  });

  test("get correct edge label", () => {
    const result = parse(`a
b
    test: (a)`);
    expect(result.edges[0].label).toEqual("test");
  });

  test("allow dashes and numbers in classes and ids", () => {
    const result = parse(`#a-1.class-1.class-2[d=e][f=a] c`);
    expect(result.nodes[0].id).toEqual("a-1");
    expect(result.nodes[0].classes).toEqual(".class-1.class-2");
  });

  test("parse edge data", () => {
    let result = parse(`a\n  #x.fun.fun-2[att=15] still the label: b`);
    expect(result.edges[0].id).toEqual("x");
    expect(result.edges[0].source).toEqual("a1");
    expect(result.edges[0].target).toEqual("b1");
    expect(result.edges[0].att).toEqual("15");
    expect(result.edges[0].classes).toEqual(".fun.fun-2");
    expect(result.edges[0].label).toEqual("still the label");

    result = parse(`#b longer label text
    #xxx edge label: (#c)`);

    expect(result.edges[0].id).toEqual("xxx");
  });

  test("shouldn't create node for empty line", () => {
    const result = parse(`
    `);
    expect(result.nodes.length).toEqual(0);
  });

  test("should allow edge to edge if specified by id", () => {
    const result = parse(`a
  #c : cool

to edge
  (#c)`);
    expect(result.edges.length).toEqual(2);
    expect(result.edges[1].target).toEqual("c");
  });

  test("unresolved edges also have unique edge ids", () => {
    const input = `a\n b\n(#a1)\n (#b1)\n(#a1)\n (#b1)`;
    expect(() => parse(input)).not.toThrow();
    const result = parse(input);
    expect(result.edges[0].id).toEqual("a1-b1-1");
    expect(result.edges[1].id).toEqual("a1-b1-2");
  });

  test("should auto-increment edge ids", () => {
    const result = parse(`a\n  (b)\n  (b)\n  b`);
    expect(result.edges[0].id).toEqual("a1-b1-1");
    expect(result.edges[1].id).toEqual("a1-b1-2");
    expect(result.edges[2].id).toEqual("a1-b1-3");
  });

  test("should find edges created later by label", () => {
    const result = parse(`a\n\t(b) (c)\nb\nc`);
    expect(result.edges[0].source).toEqual("a1");
    expect(result.edges[0].target).toEqual("b1");
    expect(result.edges[1].source).toEqual("a1");
    expect(result.edges[1].target).toEqual("c1");
  });

  /* Errors */
  test("should error labeled edge width no indent", () => {
    const label = `A\ntest: B`;
    expect(() => parse(label)).toThrow("Line 2: Edge label without parent");
  });

  test("should error if node ID used more than once", () => {
    const getResult = () => parse(`#hello hi\n#hello hi`);
    expect(getResult).toThrow('Line 2: Duplicate node id "hello"');
  });

  test("should error if edge ID used more than once", () => {
    const getResult = () => parse(`#a hi\n #b: test\n #b: another one`);
    expect(getResult).toThrow('Line 3: Duplicate edge id "b"');
  });

  test("should error intentional duplicate edge Id", () => {
    const getResult = () => parse(`a\n b\n #a1-b1-1: (b)`);
    expect(getResult).toThrow('Line 3: Duplicate edge id "a1-b1-1"');
  });
});
