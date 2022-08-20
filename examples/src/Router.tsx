import {
  ReactLocation,
  SyncOrAsyncElement,
  Router as TanstackRouter,
} from "@tanstack/react-location";

import { ChordDiagram } from "./pages/ChordDiagram";
import { ClassConnections } from "./pages/ClassConnections";
import { D3BarGraph } from "./pages/D3BarGraph";
import { IdsClasses } from "./pages/IDsClasses";
import { Index } from "./pages/Index";
import { LabelsOnly } from "./pages/LabelsOnly";
import { TabularData } from "./pages/TabularData";

const location = new ReactLocation();

export const routes: {
  title: string;
  path: string;
  element: SyncOrAsyncElement;
}[] = [
  {
    title: "Labels & Edges",
    path: "/labels-and-edges",
    element: <LabelsOnly />,
  },
  {
    title: "ID's & Classes",
    path: "/ids-classes",
    element: <IdsClasses />,
  },
  {
    title: "Class Connections",
    path: "/class-connections",
    element: <ClassConnections />,
  },
  {
    title: "Tabular Data",
    path: "/tabular-data",
    element: <TabularData />,
  },
  {
    title: "D3 Bar Graph",
    path: "/d3-bar-graph",
    element: <D3BarGraph />,
  },
  {
    title: "Chord Diagram",
    path: "/chord-diagram",
    element: <ChordDiagram />,
  },
];

export function Router({ children }: { children: React.ReactNode }) {
  return (
    <TanstackRouter
      location={location}
      routes={[
        ...routes.map(({ path, element }) => ({
          path,
          element,
        })),
        {
          path: "/",
          element: <Index />,
        },
      ]}
    >
      {children}
    </TanstackRouter>
  );
}
