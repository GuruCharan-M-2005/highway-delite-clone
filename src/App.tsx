import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";

import Home from "@/pages/Home";
import ExperienceDetails from "@/pages/ExperienceDetails";
import SelectDate from "@/pages/SelectDate";
import SelectTime from "@/pages/SelectTime";
import Checkout from "@/pages/Checkout";
import Confirmation from "@/pages/Confirmation";
import NotFound from "@/pages/NotFound";

const RouteManager = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 👇 Redirect to "/" if user refreshed the page
  useEffect(() => {
    const navType = performance.getEntriesByType("navigation")[0]?.type;
    if (navType === "reload") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // 👇 Scroll to top when navigating to new routes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/experience/:id" element={<ExperienceDetails />} />
      <Route path="/experience/:id/select-date" element={<SelectDate />} />
      <Route path="/experience/:id/select-time" element={<SelectTime />} />
      <Route path="/experience/:id/checkout" element={<Checkout />} />
      <Route path="/confirmation/:bookingId" element={<Confirmation />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <RouteManager />
        <Toaster />
        <Sonner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
