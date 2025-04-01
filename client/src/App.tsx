import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute, AdminRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import AdminPage from "@/pages/admin-page";
import LandingPage from "@/pages/landing-page";
import ProfilePage from "@/pages/profile-page";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

function AuthRedirect() {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();
  
  useEffect(() => {
    if (!isLoading) {
      if (user && location === "/landing") {
        // If user is logged in and trying to access landing page, redirect to home
        setLocation("/");
      }
    }
  }, [user, isLoading, location, setLocation]);
  
  return null;
}

function Router() {
  return (
    <>
      <AuthRedirect />
      <Switch>
        <Route path="/landing" component={LandingPage} />
        <ProtectedRoute path="/" component={HomePage} />
        <ProtectedRoute path="/profile" component={ProfilePage} />
        <Route path="/auth" component={AuthPage} />
        <AdminRoute path="/admin" component={AdminPage} />
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
