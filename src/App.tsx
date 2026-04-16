import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import OverviewPage from "./pages/OverviewPage";
import IntegrationsPage from "./pages/IntegrationsPage";
import WorkflowsPage from "./pages/WorkflowsPage";
import DataSyncPage from "./pages/DataSyncPage";
import AutomationsPage from "./pages/AutomationsPage";
import ApiGatewayPage from "./pages/ApiGatewayPage";
import SystemHealthPage from "./pages/SystemHealthPage";
import ActivityLogPage from "./pages/ActivityLogPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import TeamPage from "./pages/TeamPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import ChatPage from "./pages/ChatPage";
import ReportsPage from "./pages/ReportsPage";
import IncidentsPage from "./pages/IncidentsPage";
import AuditTrailPage from "./pages/AuditTrailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import SsoCallbackPage from "./pages/SsoCallbackPage";
import NotFound from "./pages/NotFound";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Auth pages — no dashboard layout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/sso-callback" element={<SsoCallbackPage />} />

          {/* Dashboard pages — protected */}
          <Route path="/*" element={
            <>
              <SignedIn>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<OverviewPage />} />
                    <Route path="/integrations" element={<IntegrationsPage />} />
                    <Route path="/workflows" element={<WorkflowsPage />} />
                    <Route path="/data-sync" element={<DataSyncPage />} />
                    <Route path="/automations" element={<AutomationsPage />} />
                    <Route path="/api-gateway" element={<ApiGatewayPage />} />
                    <Route path="/system-health" element={<SystemHealthPage />} />
                    <Route path="/activity-log" element={<ActivityLogPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/incidents" element={<IncidentsPage />} />
                    <Route path="/audit-trail" element={<AuditTrailPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/team" element={<TeamPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </DashboardLayout>
              </SignedIn>
              <SignedOut>
                <Navigate to="/login" replace />
              </SignedOut>
            </>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
