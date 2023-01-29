"use client";

import S from "react-syntax-highlighter";
import { github } from "react-syntax-highlighter/dist/esm/styles/hljs";

export function SyntaxHighlighter(props: any) {
  return (
    <S
      language="bash"
      style={github}
      customStyle={{
        padding: "1rem",
        borderRadius: "0.5rem",
        fontSize: ".75rem",
      }}
      showLineNumbers={false}
      wrapLines={false}
      {...props}
    />
  );
}
