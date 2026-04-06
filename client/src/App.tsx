import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/components/not-found";
import Arcade from "@/pages/home";
import { FloatingThemeToggle } from "@/components/theme-toggle";

function Router() {
  return (
    <Switch>
      <FloatingThemeToggle />
      <Route path="/" component={Arcade} />
      <Route path="/arcade" component={Arcade} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
