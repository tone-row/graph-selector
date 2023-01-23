import { matchAndRemovePointers } from "./matchAndRemovePointers";

describe("matchAndRemovePointers", () => {
  test("extracts id", () => {
    const [pointers, line] = matchAndRemovePointers("(#id)");
    expect(pointers).toEqual([["id", "id"]]);
    expect(line).toEqual("");
  });

  test("extracts class", () => {
    const [pointers, line] = matchAndRemovePointers("(.test)");
    expect(pointers).toEqual([["class", "test"]]);
    expect(line).toEqual("");
  });

  test("extracts label", () => {
    const [pointers, line] = matchAndRemovePointers("(label)");
    expect(pointers).toEqual([["label", "label"]]);
    expect(line).toEqual("");
  });

  test("extracts two letter label", () => {
    const [pointers, line] = matchAndRemovePointers("(aa)");
    expect(pointers).toEqual([["label", "aa"]]);
    expect(line).toEqual("");
  });

  test("doesn't extract escaped parentheses", () => {
    const [pointers, line] = matchAndRemovePointers("\\(test\\)");
    expect(pointers).toEqual([]);
    expect(line).toEqual("\\(test\\)");
  });
});
