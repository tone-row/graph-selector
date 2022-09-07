import { Link, Outlet } from "@tanstack/react-location";
import { Route, Router, routes } from "./Router";

import { useState } from "react";

function App() {
  const routesByType = routes.reduce<{ [key: string]: Route[] }>(
    (acc, route) => {
      acc[route.type] = acc[route.type] || [];
      acc[route.type].push(route);
      return acc;
    },
    {}
  );
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Router>
      <div className="App">
        <div className="mobile-header">
          <span>Graph Selector Syntax</span>
          <button
            className={"toggle-mobile-menu" + (isOpen ? " open" : "")}
            onClick={() => setIsOpen((x) => !x)}
          >
            Menu
          </button>
        </div>
        <aside className={isOpen ? "open" : ""}>
          <Link onClick={() => setIsOpen(false)} to="/">
            Home
          </Link>
          <h2>Examples</h2>
          <h3>Cytoscape.js</h3>
          <ul className="examples">
            {routesByType["cyto"].map(({ path, title }) => (
              <li key={path}>
                <Link onClick={() => setIsOpen(false)} to={path}>
                  {title}
                </Link>
              </li>
            ))}
          </ul>
          <h3>D3</h3>
          <ul className="examples">
            {routesByType["d3"].map(({ path, title }) => (
              <li key={path}>
                <Link onClick={() => setIsOpen(false)} to={path}>
                  {title}
                </Link>
              </li>
            ))}
          </ul>
          <h3>Recharts</h3>
          <ul className="examples">
            {routesByType["recharts"].map(({ path, title }) => (
              <li key={path}>
                <Link onClick={() => setIsOpen(false)} to={path}>
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
        <main>
          <div className="container">
            <Outlet />
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
