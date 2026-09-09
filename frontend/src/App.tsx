import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { CommandPalette } from './components/CommandPalette';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { LiveExecutionPage } from './pages/LiveExecutionPage';
import { ReportViewerPage } from './pages/ReportViewerPage';
import { HistoryPage } from './pages/HistoryPage';
import { SourcesPage } from './pages/SourcesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';

const queryClient = new QueryClient();

const AppLayout: React.FC<{ children: React.ReactNode; onOpenCmd: () => void }> = ({ children, onOpenCmd }) => {
  const location = useLocation();
  const isPublicView = location.pathname === '/' || location.pathname.startsWith('/share/');

  if (isPublicView) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col">
        <Navbar onOpenCommandPalette={onOpenCmd} />
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <Navbar onOpenCommandPalette={onOpenCmd} />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-dark-950 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  const [cmdOpen, setCmdOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AppLayout onOpenCmd={() => setCmdOpen(true)}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/workspace" element={<WorkspacePage />} />
                <Route path="/execution/:id" element={<LiveExecutionPage />} />
                <Route path="/report/:id" element={<ReportViewerPage />} />
                <Route path="/share/:id" element={<ReportViewerPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/sources" element={<SourcesPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </AppLayout>
            <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
