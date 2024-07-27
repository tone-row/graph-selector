"use client";

import { default as Ed, EditorProps } from "@monaco-editor/react";

import { highlight } from "graph-selector";
import { memo } from "react";

function E(props: EditorProps) {
  return <Ed {...props} />;
}

export const Editor = memo(function Editor({
  h = 200,
  options = {},
  ...props
}: EditorProps & { h?: number }) {
  return (
    <div className="h-64">
      <E
        className="editor"
        theme={highlight.defaultThemeDark}
        beforeMount={highlight.registerHighlighter}
        defaultLanguage={highlight.languageId}
        options={{
          theme: highlight.defaultThemeDark,
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
          // @ts-ignore
          "bracketPairColorization.enabled": false,
          matchBrackets: "always",
          minimap: {
            enabled: false,
          },
          ...options,
        }}
        {...props}
      />
    </div>
  );
});
