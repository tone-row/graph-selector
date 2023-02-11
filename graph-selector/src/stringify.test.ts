import { stringify } from "./stringify";

describe("stringify", () => {
  it("should return a string", () => {
    expect(
      stringify({
        nodes: [],
        edges: [],
      }),
    ).toBe("");
  });

  it("should stringify a node", () => {
    expect(
      stringify({
        nodes: [
          {
            data: {
              id: "a",
              label: "a",
              classes: "",
            },
          },
        ],
        edges: [],
      }),
    ).toBe("a");
  });

  it("should stringify a node with an id", () => {
    expect(
      stringify({
        nodes: [
          {
            data: {
              id: "custom-id",
              label: "a",
              classes: "",
            },
          },
        ],
        edges: [],
      }),
    ).toBe("a #custom-id");
  });

  it("should stringify a node with classes", () => {
    expect(
      stringify({
        nodes: [
          {
            data: {
              id: "a",
              label: "a",
              classes: "foo bar",
            },
          },
        ],
        edges: [],
      }),
    ).toBe("a .foo.bar");
  });

  it("should stringify a node with data", () => {
    expect(
      stringify({
        nodes: [
          {
            data: {
              id: "a",
              label: "a",
              classes: "",
              foo: "bar",
              baz: 1,
              fizz: true,
            },
          },
        ],
        edges: [],
      }),
    ).toBe('a [foo="bar"][baz=1][fizz]');
  });

  it("should stringify a node with an id and classes", () => {
    expect(
      stringify({
        nodes: [
          {
            data: {
              id: "custom-id",
              label: "a",
              classes: "foo bar",
            },
          },
        ],
        edges: [],
      }),
    ).toBe("a #custom-id.foo.bar");
  });

  it("should stringify a node with an id and data", () => {
    expect(
      stringify({
        nodes: [
          {
            data: {
              id: "custom-id",
              label: "a",
              classes: "",
              foo: "bar",
              baz: 1,
              fizz: true,
            },
          },
        ],
        edges: [],
      }),
    ).toBe('a #custom-id[foo="bar"][baz=1][fizz]');
  });

  it("should stringify a node with an id, classes, and data", () => {
    expect(
      stringify({
        nodes: [
          {
            data: {
              id: "custom-id",
              label: "a",
              classes: "foo bar",
              foo: "bar",
              baz: 1,
              fizz: true,
            },
          },
        ],
        edges: [],
      }),
    ).toBe('a #custom-id.foo.bar[foo="bar"][baz=1][fizz]');
  });

  it("should escape characters in the label", () => {
    expect(
      stringify({
        nodes: [
          {
            data: {
              id: "a",
              label: "a\nb:c[d]e(f)g",
              classes: "",
            },
          },
        ],
        edges: [],
      }),
    ).toBe("a\\nb\\:c\\[d\\]e\\(f\\)g #a");
  });

  it("should stringify an edge", () => {
    expect(
      stringify({
        nodes: [
          {
            data: {
              id: "a",
              label: "a",
              classes: "",
            },
          },
          {
            data: {
              id: "b",
              label: "b",
              classes: "",
            },
          },
        ],
        edges: [
          {
            source: "a",
            target: "b",
            data: {
              id: "",
              label: "",
              classes: "",
            },
          },
        ],
      }),
    ).toBe("a\n  (b)\nb");
  });

  it("should stringify an edge with an id", () => {
    expect(
      stringify({
        nodes: [
          {
            data: {
              id: "a",
              label: "a",
              classes: "",
            },
          },
          {
            data: {
              id: "b",
              label: "b",
              classes: "",
            },
          },
        ],
        edges: [
          {
            source: "a",
            target: "b",
            data: {
              id: "custom-id",
              label: "",
              classes: "",
            },
          },
        ],
      }),
    ).toBe("a\n  #custom-id: (b)\nb");
  });

  it("should not add id to edge if label only", () => {
    expect(
      stringify({
        nodes: [
          {
            data: {
              id: "a",
              label: "a",
              classes: "",
            },
          },
          {
            data: {
              id: "b",
              label: "b",
              classes: "",
            },
          },
        ],
        edges: [
          {
            source: "a",
            target: "b",
            data: {
              id: "",
              label: "custom label",
              classes: "",
            },
          },
        ],
      }),
    ).toBe("a\n  custom label: (b)\nb");
  });

  it("should use id for edge if custom id", () => {
    expect(
      stringify({
        nodes: [
          {
            data: {
              id: "a",
              label: "a",
              classes: "",
            },
          },
          {
            data: {
              id: "x",
              label: "b",
              classes: "",
            },
          },
        ],
        edges: [
          {
            source: "a",
            target: "x",
            data: {
              id: "",
              label: "custom label",
              classes: "",
            },
          },
        ],
      }),
    ).toBe("a\n  custom label: (#x)\nb #x");
  });
});
