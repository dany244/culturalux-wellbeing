import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { MoodProvider } from "@/context/MoodContext";
import { RequireAuth } from "@/components/RequireAuth";
import Layout from "@/components/Layout";
import Index from "./pages/Index.tsx";
import Sanctuary from "./pages/Sanctuary.tsx";
import Explore from "./pages/Explore.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Auth from "./pages/Auth.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <MoodProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/explore" element={<Explore />} />
                <Route
                  path="/sanctuary"
                  element={
                    <RequireAuth>
                      <Sanctuary />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <RequireAuth>
                      <Dashboard />
                    </RequireAuth>
                  }
                />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MoodProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
