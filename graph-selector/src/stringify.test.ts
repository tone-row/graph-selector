import { describe, expect, it } from "vitest";

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

  it("should stringify an edge with classes", () => {
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
              classes: "foo bar",
            },
          },
        ],
      }),
    ).toBe("a\n  .foo.bar: (b)\nb");
  });

  it("should stringify an edge with data", () => {
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
              foo: "bar",
              baz: 1,
              fizz: true,
            },
          },
        ],
      }),
    ).toBe('a\n  [foo="bar"][baz=1][fizz]: (b)\nb');
  });

  it("should ignore an edge with an invalid target", () => {
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
    ).toBe("a");
  });

  it("should throw an error if node data passed that isn't a valid type", () => {
    expect(() => {
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
              // @ts-expect-error - invalid data type
              buzz: undefined,
            },
          },
        ],
        edges: [],
      });
    }).toThrowError('Invalid data type for property "buzz": undefined');
  });

  it("should return the corrent string when using ids in our scheme", () => {
    const result = stringify({
      edges: [
        {
          data: {
            classes: "",
            id: "",
            label: "",
          },
          source: "n1",
          target: "n2",
        },
        {
          data: {
            classes: "",
            id: "",
            label: "",
          },
          source: "n2",
          target: "n3",
        },
        {
          data: {
            classes: "",
            id: "",
            label: "label",
          },
          source: "n3",
          target: "n4",
        },
        {
          data: {
            classes: "",
            id: "",
            label: "",
          },
          source: "n3",
          target: "n6",
        },
        {
          data: {
            classes: "",
            id: "",
            label: "",
          },
          source: "n3",
          target: "n9",
        },
        {
          data: {
            classes: "",
            id: "",
            label: "",
          },
          source: "n4",
          target: "n10",
        },
        {
          data: {
            classes: "",
            id: "",
            label: "",
          },
          source: "n6",
          target: "n7",
        },
        {
          data: {
            classes: "",
            id: "",
            label: "",
          },
          source: "n7",
          target: "n8",
        },
        {
          data: {
            classes: "",
            id: "",
            label: "",
          },
          source: "n9",
          target: "n10",
        },
        {
          data: {
            classes: "",
            id: "",
            label: "",
          },
          source: "n10",
          target: "n8",
        },
      ],
      nodes: [
        {
          data: {
            classes: "",
            id: "n1",
            label: "Start",
          },
        },
        {
          data: {
            classes: "",
            id: "n2",
            label: "Step 1",
          },
        },
        {
          data: {
            classes: "",
            id: "n3",
            label: "Step 2",
          },
        },
        {
          data: {
            classes: "",
            id: "n4",
            label: "Step 3",
          },
        },
        {
          data: {
            classes: "",
            id: "n6",
            label: "Step 4",
          },
        },
        {
          data: {
            classes: "",
            id: "n7",
            label: "Step 6",
          },
        },
        {
          data: {
            classes: "",
            id: "n8",
            label: "Finish",
          },
        },
        {
          data: {
            classes: "",
            id: "n9",
            label: "Step 5",
          },
        },
        {
          data: {
            classes: "",
            id: "n10",
            label: "Step 7",
          },
        },
      ],
    });

    expect(result).toBe(`Start #n1
  (#n2)
Step 1 #n2
  (#n3)
Step 2 #n3
  label: (#n4)
  (#n6)
  (#n9)
Step 3 #n4
  (#n10)
Step 4 #n6
  (#n7)
Step 6 #n7
  (#n8)
Finish #n8
Step 5 #n9
  (#n10)
Step 7 #n10
  (#n8)`);
  });

  it("can also return a compact version", () => {
    const result = stringify(
      {
        edges: [
          {
            data: {
              classes: "",
              id: "",
              label: "",
            },
            source: "n1",
            target: "n2",
          },
          {
            data: {
              classes: "",
              id: "",
              label: "",
            },
            source: "n2",
            target: "n3",
          },
          {
            data: {
              classes: "",
              id: "",
              label: "label",
            },
            source: "n3",
            target: "n4",
          },
          {
            data: {
              classes: "",
              id: "",
              label: "",
            },
            source: "n3",
            target: "n6",
          },
          {
            data: {
              classes: "",
              id: "",
              label: "",
            },
            source: "n3",
            target: "n9",
          },
          {
            data: {
              classes: "",
              id: "",
              label: "",
            },
            source: "n4",
            target: "n10",
          },
          {
            data: {
              classes: "",
              id: "",
              label: "",
            },
            source: "n6",
            target: "n7",
          },
          {
            data: {
              classes: "",
              id: "",
              label: "",
            },
            source: "n7",
            target: "n8",
          },
          {
            data: {
              classes: "",
              id: "",
              label: "",
            },
            source: "n9",
            target: "n10",
          },
          {
            data: {
              classes: "",
              id: "",
              label: "",
            },
            source: "n10",
            target: "n8",
          },
        ],
        nodes: [
          {
            data: {
              classes: "",
              id: "n1",
              label: "Start",
            },
          },
          {
            data: {
              classes: "",
              id: "n2",
              label: "Step 1",
            },
          },
          {
            data: {
              classes: "",
              id: "n3",
              label: "Step 2",
            },
          },
          {
            data: {
              classes: "",
              id: "n4",
              label: "Step 3",
            },
          },
          {
            data: {
              classes: "",
              id: "n6",
              label: "Step 4",
            },
          },
          {
            data: {
              classes: "",
              id: "n7",
              label: "Step 6",
            },
          },
          {
            data: {
              classes: "",
              id: "n8",
              label: "Finish",
            },
          },
          {
            data: {
              classes: "",
              id: "n9",
              label: "Step 5",
            },
          },
          {
            data: {
              classes: "",
              id: "n10",
              label: "Step 7",
            },
          },
        ],
      },
      {
        compact: true,
      },
    );

    expect(result).toBe(`Start #n1
  Step 1 #n2
    Step 2 #n3
      label: Step 3 #n4
        Step 7 #n10
          (#n8)
      Step 4 #n6
        Step 6 #n7
          Finish #n8
      Step 5 #n9
        (#n10)`);
  });
});
