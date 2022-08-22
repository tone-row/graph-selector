import { Link, Outlet } from "@tanstack/react-location";
import { Router, routes } from "./Router";

function App() {
  return (
    <Router>
      <div className="App">
        <aside>
          <ul className="examples">
            <li>
              <Link to="/">Home</Link>
            </li>
            {routes.map(({ path, title }) => (
              <li key={path}>
                <Link to={path}>{title}</Link>
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
