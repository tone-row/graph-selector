import Editor, { EditorProps } from "@monaco-editor/react";
import { id, registerHighlighter, theme } from "../utils/highlighting";

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
        theme={theme}
        beforeMount={registerHighlighter}
        defaultLanguage={id}
        onMount={(_editor, monaco) => {
          monaco.editor.setTheme(theme);
        }}
        options={{
          theme,
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
