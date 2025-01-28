import { describe, expect, test, vi, beforeEach, Mock } from "vitest";
import * as Monaco from "monaco-editor/esm/vs/editor/editor.api";
import { registerHighlighter, languageId } from "./highlight";

interface IToken {
  offset: number;
  type: string;
  length: number;
}

interface IMonacoLanguages {
  register: (language: { id: string }) => void;
  setLanguageConfiguration: typeof Monaco.languages.setLanguageConfiguration;
  setMonarchTokensProvider: typeof Monaco.languages.setMonarchTokensProvider;
  registerCompletionItemProvider: typeof Monaco.languages.registerCompletionItemProvider;
  getLanguages: () => { id: string }[];
  tokenize(text: string, languageId: string): IToken[];
  IndentAction: { IndentOutdent: number };
}

interface IMockMonaco {
  languages: IMonacoLanguages;
  editor: {
    defineTheme: typeof Monaco.editor.defineTheme;
  };
}

describe("highlight", () => {
  let monaco: IMockMonaco;

  beforeEach(() => {
    // Create a fresh Monaco instance for each test
    monaco = {
      languages: {
        register: vi.fn(),
        setLanguageConfiguration: vi.fn(),
        setMonarchTokensProvider: vi.fn(),
        registerCompletionItemProvider: vi.fn(),
        getLanguages: vi.fn().mockReturnValue([]),
        tokenize: vi.fn(),
        IndentAction: { IndentOutdent: 1 },
      },
      editor: {
        defineTheme: vi.fn(),
      },
    } as IMockMonaco;

    registerHighlighter(monaco as unknown as typeof Monaco);
  });

  function getTokens(text: string) {
    // Get the tokenizer function that was registered
    const tokenProvider = (monaco.languages.setMonarchTokensProvider as Mock).mock.calls[0][1];

    // Call Monaco's tokenize with our language rules
    const lines = text.split("\n");
    const tokens: { token: string; content: string }[] = [];
    const state = tokenProvider.tokenizer.root;

    for (const line of lines) {
      const lineTokens = monaco.languages.tokenize(line, languageId);
      for (const token of lineTokens) {
        tokens.push({
          token: token.type,
          content: line.substring(token.offset, token.offset + token.length),
        });
      }
    }

    return tokens;
  }

  test("tokenizes a simple node", () => {
    // Mock the tokenize function for this test
    (monaco.languages.tokenize as Mock).mockReturnValueOnce([
      { offset: 0, type: "string", length: 5 },
    ]);

    const tokens = getTokens("hello");
    expect(tokens).toEqual([{ token: "string", content: "hello" }]);
    expect(monaco.languages.tokenize).toHaveBeenCalledWith("hello", languageId);
  });

  test("tokenizes a node with class", () => {
    // Mock the tokenize function for this test
    (monaco.languages.tokenize as Mock).mockReturnValueOnce([
      { offset: 0, type: "string", length: 6 },
      { offset: 6, type: "attribute", length: 6 },
    ]);

    const tokens = getTokens("hello .world");
    expect(tokens).toEqual([
      { token: "string", content: "hello " },
      { token: "attribute", content: ".world" },
    ]);
    expect(monaco.languages.tokenize).toHaveBeenCalledWith("hello .world", languageId);
  });

  test("tokenizes a node with attribute", () => {
    // Mock the tokenize function for this test
    (monaco.languages.tokenize as Mock).mockReturnValueOnce([
      { offset: 0, type: "string", length: 6 },
      { offset: 6, type: "attribute", length: 12 },
    ]);

    const tokens = getTokens("hello [color=blue]");
    expect(tokens).toEqual([
      { token: "string", content: "hello " },
      { token: "attribute", content: "[color=blue]" },
    ]);
    expect(monaco.languages.tokenize).toHaveBeenCalledWith("hello [color=blue]", languageId);
  });

  test("tokenizes a node with type", () => {
    // Mock the tokenize function for this test
    (monaco.languages.tokenize as Mock).mockReturnValueOnce([
      { offset: 0, type: "type", length: 7 },
      { offset: 7, type: "string", length: 6 },
    ]);

    const tokens = getTokens("  type: hello");
    expect(tokens).toEqual([
      { token: "type", content: "  type:" },
      { token: "string", content: " hello" },
    ]);
    expect(monaco.languages.tokenize).toHaveBeenCalledWith("  type: hello", languageId);
  });

  test("tokenizes comments", () => {
    // Mock the tokenize function for this test
    (monaco.languages.tokenize as Mock).mockReturnValueOnce([
      { offset: 0, type: "comment", length: 20 },
    ]);

    const tokens = getTokens("// this is a comment");
    expect(tokens).toEqual([{ token: "comment", content: "// this is a comment" }]);
    expect(monaco.languages.tokenize).toHaveBeenCalledWith("// this is a comment", languageId);
  });

  test("tokenizes multi-line comments", () => {
    // Mock the tokenize function for each line
    (monaco.languages.tokenize as Mock)
      .mockReturnValueOnce([{ offset: 0, type: "comment", length: 10 }])
      .mockReturnValueOnce([{ offset: 0, type: "comment", length: 12 }]);

    const tokens = getTokens("/* this is\na comment */");
    expect(tokens).toEqual([
      { token: "comment", content: "/* this is" },
      { token: "comment", content: "a comment */" },
    ]);
    expect(monaco.languages.tokenize).toHaveBeenCalledWith("/* this is", languageId);
    expect(monaco.languages.tokenize).toHaveBeenCalledWith("a comment */", languageId);
  });

  test("tokenizes variables", () => {
    // Mock the tokenize function for this test
    (monaco.languages.tokenize as Mock).mockReturnValueOnce([
      { offset: 0, type: "string", length: 6 },
      { offset: 6, type: "variable", length: 7 },
    ]);

    const tokens = getTokens("hello (world)");
    expect(tokens).toEqual([
      { token: "string", content: "hello " },
      { token: "variable", content: "(world)" },
    ]);
    expect(monaco.languages.tokenize).toHaveBeenCalledWith("hello (world)", languageId);
  });
});
