import * as Monaco from "monaco-editor/esm/vs/editor/editor.api";
import { parse } from "./parse";
export const languageId = "graphselector";
export const defaultTheme = "graphselector-theme";
export const defaultThemeDark = "graphselector-theme-dark";

export const colors: Record<string, { light: string; dark: string }> = {
  string: { light: "#251d1d", dark: "#fffcff" },
  attribute: { light: "#8252eb", dark: "#9e81ef" },
  variable: { light: "#00c722", dark: "#00c722" },
  comment: { light: "#808080", dark: "#808080" },
  type: { light: "#4750f3", dark: "#7f96ff" },
  "delimiter.curly": { light: "#251d1d", dark: "#fffcff" },
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
    defaultToken: "string",
    tokenizer: {
      root: [
        // URLs (must come before comment and edge label rules)
        [/^\s*https?:\/\/[^\s]+/, "string"],
        // \/\/ single-line comment... (but not URLs)
        [/^\/\/.*|[^:]\/\/.*/, "comment"],
        [/\/\*/, "comment", "@comment"],
        // Edge label at start of line (after optional indentation)
        [/^\s+[^:\s/][^:]*:/, "type"], // Match edge label but exclude URLs by preventing / after :
        // (.*)
        [/ \(/, "variable", "@variable"],
        // #id and .class combinations (must come before word rule)
        [/(#[\w-]+(\.[a-zA-Z][\w-]*)*|\.[a-zA-Z][\w-]*(\.[\w-]+)*)/, "attribute"],
        // Attributes with quoted values
        [/\[\w+=(['"][^'"]*['"]|\w+)\]|\[\w+\]/, "attribute"],
        // Escaped characters (must come before other rules)
        [/\\[[\](){}<>:#.\/]/, "string"],
        // Spaces
        [/\s+/, "string"],
      ],
      comment: [
        [/[^\/*]+/, "comment"],
        [/\/\*/, "comment", "@push"], // nested comment
        ["\\*/", "comment", "@pop"],
        [/[\/*]/, "comment"],
      ],
      variable: [
        [/[^)]+/, "variable"],
        [/\)/, "variable", "@pop"],
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
            // insert the label, replacing the closing parenthesis
            insertText: node.data.label + ")",
            range: {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: position.column,
              // replace the closing parenthesis
              endColumn: position.column + 1,
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
    // colors: {},
    rules: Object.entries(colors).map(([token, value]) => ({
      token,
      foreground: value.light,
    })),
    // Define bracket colors
    colors: {},
  });

  monaco.editor.defineTheme(defaultThemeDark, {
    base: "vs-dark",
    inherit: false,
    // colors: {},
    rules: Object.entries(colors).map(([token, value]) => ({
      token,
      foreground: value.dark,
    })),
    // Define bracket colors
    colors: {},
  });
}
