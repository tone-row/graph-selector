import {
  ReactLocation,
  SyncOrAsyncElement,
  Router as TanstackRouter,
} from "@tanstack/react-location";

import { AssociativeModel } from "./pages/AssociativeModel";
import { ClassConnections } from "./pages/ClassConnections";
import { CreatingEdgesLabels } from "./pages/CreatingEdgesLabels";
import { D3BarGraph } from "./pages/D3BarGraph";
import { FreeStyle } from "./pages/FreeStyle";
import { IdsClasses } from "./pages/IDsClasses";
import { Index } from "./pages/Index";
import { NodeSize } from "./pages/NodeSize";
import { SankeyDiagram } from "./pages/SankeyDiagram";
import { TabularData } from "./pages/TabularData";

const location = new ReactLocation();

export type Route = {
  title: string;
  path: string;
  element: SyncOrAsyncElement;
  type: "cyto" | "d3" | "recharts";
};

export const routes: Route[] = [
  {
    title: "Edges, Labels, Containers",
    path: "/edges-labels-containers",
    element: <CreatingEdgesLabels />,
    type: "cyto",
  },
  {
    title: "ID's & Classes",
    path: "/ids-classes",
    element: <IdsClasses />,
    type: "cyto",
  },
  {
    title: "Class Connections",
    path: "/class-connections",
    element: <ClassConnections />,
    type: "cyto",
  },
  {
    title: "Node Size",
    path: "/node-size",
    element: <NodeSize />,
    type: "cyto",
  },
  {
    title: "Associative Model",
    path: "/associative-model",
    element: <AssociativeModel />,
    type: "cyto",
  },
  {
    title: "Freestyle",
    path: "/freestyle",
    element: <FreeStyle />,
    type: "cyto",
  },
  {
    title: "Bar Graph",
    path: "/bar-graph",
    element: <D3BarGraph />,
    type: "d3",
  },
  {
    title: "Sankey Diagram",
    path: "/sankey",
    element: <SankeyDiagram />,
    type: "d3",
  },
  {
    title: "Tabular Data",
    path: "/tabular-data",
    element: <TabularData />,
    type: "recharts",
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
