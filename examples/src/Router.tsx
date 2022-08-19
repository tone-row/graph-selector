import {
  ReactLocation,
  Router as TanstackRouter,
} from "@tanstack/react-location";

import { IdsClasses } from "./pages/IDsClasses";
import { Index } from "./pages/Index";
import { LabelsOnly } from "./pages/LabelsOnly";
import { TabularData } from "./pages/TabularData";

const location = new ReactLocation();

export function Router({ children }: { children: React.ReactNode }) {
  return (
    <TanstackRouter
      location={location}
      routes={[
        {
          path: "/labels-only",
          element: <LabelsOnly />,
        },
        {
          path: "/ids-classes",
          element: <IdsClasses />,
        },
        {
          path: "/tabular-data",
          element: <TabularData />,
        },
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
