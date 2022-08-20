import * as Collapsible from "@radix-ui/react-collapsible";

export function ShowParsed({ parsed }: { parsed: any }) {
  return (
    <Collapsible.Root>
      <Collapsible.Trigger>Show Parsed Value</Collapsible.Trigger>
      <Collapsible.Content>
        <pre>
          <code>{JSON.stringify(parsed, null, 2)}</code>
        </pre>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
