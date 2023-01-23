import * as Monaco from "monaco-editor/esm/vs/editor/editor.api";

export const languageId = "graphselector";
export const defaultTheme = "graphselector-theme";
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
        [/.*/, "@rematch", "nodeOrPointer"], // should be invalid
      ],
      noEdge: [[/.*/, "@rematch", "nodeOrPointer"]],
      edgeFeatures: [
        [/^.*[^\\]: /, languageTokens.edgeFeatures],
        [/.*\S+.*$/, "@rematch", "nodeOrPointer"],
      ],
      nodeOrPointer: [
        // whitespace
        [/\s+/, languageTokens.nodeOrPointer],
        [/\(/, languageTokens.pointer, "@pointer"],
        [/.*$/, languageTokens.nodeOrPointer, "@popall"],
      ],
      pointer: [
        [/\)$/, languageTokens.pointer, "@popall"],
        [/\)/, languageTokens.pointer, "@pop"],
        [/[^\(\)]+/, languageTokens.pointer],
      ],
    },
  });

  monaco.editor.defineTheme(defaultTheme, {
    base: "vs",
    inherit: false,
    rules: [
      {
        token: languageTokens.edgeFeatures,
        foreground: "#0000FF",
      },
      {
        token: languageTokens.pointer,
        foreground: "#00CCCC",
      },
    ],
    colors: {
      "editor.background": "#ffffff",
    },
  });
}
