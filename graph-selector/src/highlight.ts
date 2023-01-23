import * as Monaco from "monaco-editor/esm/vs/editor/editor.api";

export const languageId = "graphselector";
export const defaultTheme = "graphselector-theme";
export const defaultThemeDark = "graphselector-theme-dark";
enum Tokens {
  edgeFeatures = "edgeFeatures",
  nodeOrPointer = "nodeOrPointer",
  pointer = "pointer",
}
export const colors: { [key in Tokens]: { light: string; dark: string } } = {
  nodeOrPointer: { light: "#202020", dark: "#d4d4d4" },
  edgeFeatures: { light: "#5c6fff", dark: "#5c6fff" },
  pointer: { light: "#00c722", dark: "#00c722" },
};

export const languageTokens = {
  edgeFeatures: "edgeFeatures",
  nodeOrPointer: "nodeOrPointer",
  pointer: "pointer",
};

export function registerHighlighter(monaco: typeof Monaco) {
  monaco.languages.register({ id: languageId });

  monaco.languages.setLanguageConfiguration(languageId, {
    /* make sure curly braces are automatically closed */
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
    ],
    /* indent after opening curly brace */
    onEnterRules: [
      {
        beforeText: new RegExp(`^((?!.*?\\/\\*).*\\{[^}"']*(\\/\\*(.*?)\\*\\/)?)[^}"']*$`, "s"),
        afterText: /^.*\}.*$/,
        action: { indentAction: monaco.languages.IndentAction.IndentOutdent },
      },
    ],
  });

  monaco.languages.setMonarchTokensProvider(languageId, {
    defaultToken: "invalid",
    tokenizer: {
      root: [
        [/^\s+[^\n]*$/, "@rematch", "edge"],
        [/^[^\n]*$/, "@rematch", "noEdge"],
      ],
      edge: [
        [/^.*[^\\]: .*\S+.*/, "@rematch", "edgeFeatures"],
        [/.*/, "@rematch", Tokens.nodeOrPointer], // should be invalid
      ],
      noEdge: [[/.*/, "@rematch", Tokens.nodeOrPointer]],
      edgeFeatures: [
        [/^.*[^\\]: /, Tokens.edgeFeatures],
        [/.*\S+.*$/, "@rematch", Tokens.nodeOrPointer],
      ],
      nodeOrPointer: [
        // whitespace
        [/\s+/, Tokens.nodeOrPointer],
        [/\(/, Tokens.pointer, "@pointer"],
        [/.*$/, Tokens.nodeOrPointer, "@popall"],
      ],
      pointer: [
        [/\)$/, Tokens.pointer, "@popall"],
        [/\)/, Tokens.pointer, "@pop"],
        [/[^\(\)]+/, Tokens.pointer],
      ],
    },
  });

  monaco.editor.defineTheme(defaultTheme, {
    base: "vs",
    inherit: false,
    colors: {},
    rules: Object.entries(languageTokens).map(([token, value]) => ({
      token: value,
      foreground: colors[token as Tokens].light,
    })),
  });

  monaco.editor.defineTheme(defaultThemeDark, {
    base: "vs-dark",
    inherit: false,
    colors: {},
    rules: Object.entries(languageTokens).map(([token, value]) => ({
      token: value,
      foreground: colors[token as Tokens].dark,
    })),
  });
}
