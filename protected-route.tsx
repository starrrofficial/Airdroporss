import { Route, Redirect } from "wouter";
import { LoadingScreen } from "@/components/loading-screen";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  // Check for user data in localStorage
  const userData = localStorage.getItem('userData');
  const user = userData ? JSON.parse(userData) : null;

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/" />
      </Route>
    );
  }

  return (
    <Route path={path}>
      <Component />
    </Route>
  );
}