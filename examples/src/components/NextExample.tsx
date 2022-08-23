import { Link, useMatch } from "@tanstack/react-location";

import { routes } from "../Router";

export function NextExample() {
  const path = useMatch().pathname;
  const routeIndex = routes.findIndex(
    ({ path: routePath }) => routePath === path
  );
  if (routeIndex === -1) return null;
  const nextRoute = routes[routeIndex + 1];
  if (!nextRoute) return null;
  return (
    <Link to={nextRoute.path} className="link-to-example">
      Open the next example
    </Link>
  );
}
