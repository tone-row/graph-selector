import * as Monaco from "monaco-editor/esm/vs/editor/editor.api";
import { parse } from "./parse";
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
  // Check if language is already registered
  if (monaco.languages.getLanguages().some((l) => l.id === languageId)) {
    return;
  }

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

  // Register a completions provider that suggests words inside of parantheses
  monaco.languages.registerCompletionItemProvider(languageId, {
    triggerCharacters: ["("],
    provideCompletionItems: (model, position) => {
      // If there is a ( before the cursor
      const textUntilPosition = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });
      if (textUntilPosition.indexOf("(") >= 0) {
        // parse complete text for node labels
        const parsed = parse(model.getValue());
        const suggestions = parsed.nodes
          .filter((node) => !!node.data.label && node.data.label !== "()")
          .map((node) => ({
            label: node.data.label,
            kind: monaco.languages.CompletionItemKind.Value,
            insertText: node.data.label,
            range: {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: position.column,
              endColumn: position.column,
            },
          }));
        return {
          suggestions,
        };
      }
      return { suggestions: [] };
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
