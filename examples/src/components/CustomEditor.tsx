import Editor, { EditorProps } from "@monaco-editor/react";

import { highlight } from "graph-selector";

function E(props: EditorProps) {
  return <Editor {...props} />;
}

export function CustomEditor({
  h = 200,
  options = {},
  ...props
}: EditorProps & { h?: number }) {
  return (
    <div style={{ height: h }}>
      <E
        className="editor"
        theme={highlight.defaultTheme}
        beforeMount={highlight.registerHighlighter}
        defaultLanguage={highlight.languageId}
        onMount={(_editor, monaco) => {
          monaco.editor.setTheme(highlight.defaultTheme);
        }}
        options={{
          theme: highlight.defaultTheme,
          fontSize: 18,
          lineNumbersMinChars: 0,
          tabSize: 2,
          lineNumbers: "off",
          glyphMargin: false,
          scrollBeyondLastLine: false,
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
