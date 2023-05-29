"use client";

import { default as Ed, EditorProps } from "@monaco-editor/react";

import { highlight } from "graph-selector";

function E(props: EditorProps) {
  return <Ed {...props} />;
}

export function Editor({
  h = 200,
  options = {},
  ...props
}: EditorProps & { h?: number }) {
  return (
    <div className="h-64">
      <E
        className="editor"
        theme={highlight.defaultTheme}
        beforeMount={highlight.registerHighlighter}
        defaultLanguage={highlight.languageId}
        options={{
          theme: highlight.defaultTheme,
          fontSize: 16,
          lineNumbersMinChars: 0,
          lineDecorationsWidth: 0,
          folding: false,
          tabSize: 2,
          lineNumbers: "off",
          glyphMargin: false,
          scrollBeyondLastLine: false,
          renderLineHighlight: "none",
          overviewRulerLanes: 0,
          guides: {
            bracketPairs: false,
            indentation: false,
            highlightActiveIndentation: false,
            highlightActiveBracketPair: false,
          },
          minimap: {
            enabled: false,
          },
          ...options,
        }}
        {...props}
      />
    </div>
  );
}
