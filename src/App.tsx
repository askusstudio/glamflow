import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { Auth } from "./pages/Auth";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ProfilePage from "./pages/Profile";
import TasksPage from "./pages/Tasks";
import CalendarPage from "./pages/Calendar";
import AnalyticsPage from "./pages/Analytics.tsx";
import PublicProfile from "./pages/PublicProfile";
import BookingsTablePage from "./pages/BookingsTablePage"; // @BookingsTablePage.tsx
import PrivacyPolicy from "./pages/PrivacyPolicy"; // @BookingsTablePage.tsx
import TermsPage from "./pages/TermsPage"; // @BookingsTablePage.tsx

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/termspage" element={<TermsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/public-profile/:userId" element={<PublicProfile />} />
            <Route path="/bookings" element={<BookingsTablePage />} /> {/* @BookingsTablePage.tsx */}
            <Route path="/app" element={<ProtectedRoute />}>
              <Route path="/app" element={<Dashboard />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
