import { Link, Outlet } from "@tanstack/react-location";

import { Router } from "./Router";

function App() {
  return (
    <Router>
      <div className="App">
        <aside>
          <Link to="/">Graph Selector Syntax</Link>
          <h2>Examples</h2>
          <ul>
            <li>
              <Link to="/labels-only">Labels Only</Link>
            </li>
            <li>
              <Link to="/ids-classes">Ids &amp; Classes</Link>
            </li>
            <li>
              <Link to="/tabular-data">Tabular Data</Link>
            </li>
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
