import { PlaygroundState } from "@/components/PlaygroundState";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: SearchParams;
}

export default async function Page({ searchParams }: PageProps) {
  const search = await searchParams;
  const initialValue = search.code
    ? decodeURIComponent(search.code as string)
    : undefined;

  return (
    <div className="min-h-screen p-12 grid gap-3 content-start">
      <h1 className="text-3xl font-bold">Playground</h1>
      <PlaygroundState initialValue={initialValue} />
    </div>
  );
}
