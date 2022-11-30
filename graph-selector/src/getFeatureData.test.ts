import { getFeatureData } from "./getFeatureData";

describe("getFeatureData", () => {
  test("it parses IDs", () => {
    const { id, line } = getFeatureData("#hello");
    expect(id).toBe("hello");
    expect(line).toBe("");
  });

  test("it parses labels", () => {
    const { line } = getFeatureData("hello");
    expect(line).toBe("hello");
  });

  test("it parses classes", () => {
    const { classes } = getFeatureData(".hello");
    expect(classes).toBe(".hello");
  });

  test("it parses data", () => {
    const { data } = getFeatureData("[hello=world]");
    expect(data).toEqual({ hello: "world" });
  });

  test("it parses tout le kit", () => {
    const { id, line, classes, data } = getFeatureData("#hello.world[hello=world]hello");
    expect(id).toBe("hello");
    expect(line).toBe("hello");
    expect(classes).toBe(".world");
    expect(data).toEqual({ hello: "world" });
  });

  test("it parses strings from data", () => {
    expect(getFeatureData("[hello=world]").data).toEqual({ hello: "world" });
    expect(getFeatureData("[hello='world']").data).toEqual({ hello: "world" });
    expect(getFeatureData('[hello="world"]').data).toEqual({ hello: "world" });
  });

  test("it parses strings with spaces", () => {
    expect(getFeatureData("[hello='world hello']").data).toEqual({ hello: "world hello" });
    expect(getFeatureData('[hello="world hello"]').data).toEqual({ hello: "world hello" });
    expect(getFeatureData("[hello=world hello]").data).toEqual({ hello: "world hello" });
  });

  test("can parse data number", () => {
    expect(getFeatureData("[hello=1]").data).toEqual({ hello: 1 });
  });

  test("if user declares string, saves as string", () => {
    expect(getFeatureData("[hello='1']").data).toEqual({ hello: "1" });
    expect(getFeatureData('[hello="1"]').data).toEqual({ hello: "1" });
  });

  test("it parses floats", () => {
    expect(getFeatureData("[hello=1.1]").data).toEqual({ hello: 1.1 });
    expect(getFeatureData("[hello=.1]").data).toEqual({ hello: 0.1 });
  });

  test("it parses implicitly true args", () => {
    expect(getFeatureData("[hello]").data).toEqual({ hello: true });
  });
});
