import Monaco, { EditorProps } from "@monaco-editor/react";

export function Editor({ h = 200, ...props }: EditorProps & { h?: number }) {
  return (
    <div style={{ height: h }}>
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
    </div>
  );
}
