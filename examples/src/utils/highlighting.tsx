import { Monaco } from "@monaco-editor/react";

export const id = "graphselector";
export const theme = "graphselector-theme";

const tokens = {
  edgeFeatures: "edgeFeatures",
  nodeOrPointer: "nodeOrPointer",
  pointer: "pointer",
};

export function registerHighlighter(monaco: Monaco) {
  monaco.languages.register({ id });

  monaco.languages.setMonarchTokensProvider(id, {
    defaultToken: "invalid",
    tokenizer: {
      root: [
        [/^\s+[^\n]*$/, "@rematch", "edge"],
        [/^[^\n]*$/, "@rematch", "noEdge"],
      ],
      edge: [
        [/^.*[^\\]:.*\S+.*/, "@rematch", "edgeFeatures"],
        [/.*/, "@rematch", "nodeOrPointer"], // should be invalid
      ],
      noEdge: [[/.*/, "@rematch", "nodeOrPointer"]],
      edgeFeatures: [
        [/^.*[^\\]:/, tokens.edgeFeatures],
        [/.*\S+.*$/, "@rematch", "nodeOrPointer"],
      ],
      nodeOrPointer: [
        // whitespace
        [/\s+/, tokens.nodeOrPointer],
        [/\(/, tokens.pointer, "@pointer"],
        [/.*$/, tokens.nodeOrPointer, "@popall"],
      ],
      pointer: [
        [/\)$/, tokens.pointer, "@popall"],
        [/\)/, tokens.pointer, "@pop"],
        [/[^\(\)]+/, tokens.pointer],
      ],
    },
  });

  monaco.editor.defineTheme(theme, {
    base: "vs",
    inherit: false,
    rules: [
      { token: "a", foreground: "#000000" },
      {
        token: tokens.edgeFeatures,
        foreground: "#0000FF",
      },
      {
        token: tokens.pointer,
        foreground: "#00CCCC",
      },
    ],
    colors: {
      "editor.background": "#ffffff",
    },
  });
}
