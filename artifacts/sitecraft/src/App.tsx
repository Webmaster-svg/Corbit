import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/lib/i18n";
import { AuthProvider, useAuth } from "@/lib/auth";
import { useEffect } from "react";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Pricing from "@/pages/pricing";
import Checkout from "@/pages/checkout";
import ChargilySimulate from "@/pages/chargily-simulate";
import Templates from "@/pages/templates";
import Preview from "@/pages/preview";
import Dashboard from "@/pages/dashboard";
import Projects from "@/pages/projects";
import ProjectDetail from "@/pages/project-detail";
import Docs from "@/pages/docs";
import Community from "@/pages/community";
import Legal from "@/pages/legal";
import About from "@/pages/about";
import HelpCenter from "@/pages/help";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // Scroll to top on route change, unless there is a hash (to allow anchor links to work)
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return null;
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/templates" component={Templates} />
      <Route path="/preview/:id" component={Preview} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/chargily-simulate" component={ChargilySimulate} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/docs" component={Docs} />
      <Route path="/community" component={Community} />
      <Route path="/legal" component={Legal} />
      <Route path="/about" component={About} />
      <Route path="/help" component={HelpCenter} />
      <Route path="/dashboard">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/dashboard/:id">
        {() => <ProtectedRoute component={ProjectDetail} />}
      </Route>
      <Route path="/dashboard/:id/:tab">
        {() => <ProtectedRoute component={ProjectDetail} />}
      </Route>
      <Route path="/projects">
        {() => <ProtectedRoute component={Projects} />}
      </Route>
      <Route path="/projects/:id">
        {() => <ProtectedRoute component={ProjectDetail} />}
      </Route>
      <Route path="/projects/:id/:tab">
        {() => <ProtectedRoute component={ProjectDetail} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <ScrollToTop />
                <Router />
              </WouterRouter>
              <Toaster />
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
