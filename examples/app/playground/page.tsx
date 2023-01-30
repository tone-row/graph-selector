import { Editor } from "@/components/Editor";

export default function Page() {
  return (
    <div className="min-h-screen p-12 grid gap-3 content-start">
      <h1 className="text-3xl font-bold">Playground</h1>
      <Editor h={500} className="shadow w-12" />
    </div>
  );
}
