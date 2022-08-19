import Monaco, { EditorProps } from "@monaco-editor/react";

export function Editor(props: EditorProps) {
  return (
    <Monaco
      className="editor"
      theme="vs"
      options={{
        fontSize: 16,
        lineNumbersMinChars: 2,
        scrollBeyondLastLine: false,
        minimap: {
          enabled: false,
        },
      }}
      {...props}
    />
  );
}
