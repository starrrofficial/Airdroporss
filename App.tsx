import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "@/lib/protected-route";
import NavBar from "@/components/nav-bar";
import { CryptoMascot } from "@/components/crypto-mascot";
import Home from "@/pages/home";
import Comments from "@/pages/comments";
import Tutorials from "@/pages/tutorials";
import Games from "@/pages/games";
import Support from "@/pages/support";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import LoadingTest from "@/pages/loading-test";
import AuthPage from "@/pages/auth-page";
import PrivacyPolicy from "@/pages/privacy-policy";
import PrivacyPolicy2 from "@/pages/privacy-policy2"; // Added import for the new privacy policy page.
import { useLocation } from "wouter";

function Router() {
  const [location] = useLocation();
  const showNav = !['/', '/auth', '/privacy-policy', '/privacy-policy2'].includes(location); // Updated to include the new route

  return (
    <>
      {showNav && <NavBar />}
      <Switch>
        {/* Loading test (splash screen) is the primary route */}
        <Route path="/" component={LoadingTest} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/privacy-policy2" component={PrivacyPolicy2} /> {/* Added new route */}
        <ProtectedRoute path="/home" component={Home} />
        <ProtectedRoute path="/games" component={Games} />
        <ProtectedRoute path="/comments" component={Comments} />
        <ProtectedRoute path="/tutorials" component={Tutorials} />
        <ProtectedRoute path="/support" component={Support} />
        <ProtectedRoute path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  // Check if user is logged in to show/hide NavBar and Mascot
  const isLoggedIn = !!localStorage.getItem('userData');

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen page-gradient text-foreground">
        <Router />
        {/* Only show Mascot if user is logged in */}
        {isLoggedIn && <CryptoMascot />}
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;