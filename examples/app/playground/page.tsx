import { Editor } from "@/components/Editor";
import { PlaygroundState } from "@/components/PlaygroundState";

export default function Page() {
  return (
    <div className="min-h-screen p-12 grid gap-3 content-start">
      <h1 className="text-3xl font-bold">Playground</h1>
      <PlaygroundState />
    </div>
  );
}
