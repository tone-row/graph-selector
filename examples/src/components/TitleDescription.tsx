import { ReactNode } from "react";

export function TitleDescription({
  pageTitle,
  pageDescription,
}: {
  pageTitle: string;
  pageDescription: ReactNode;
}) {
  return (
    <header>
      <h1>{pageTitle}</h1>
      <div className="description">{pageDescription}</div>
    </header>
  );
}
