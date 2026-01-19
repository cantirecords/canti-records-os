
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ClientMemory } from './components/ClientMemory';
import { ClientsList } from './components/ClientsList';
import { FinanceTracker } from './components/FinanceTracker';
import { ServicesView } from './components/ServicesView';
import { MarketingView } from './components/MarketingView';
import { TemplatesView } from './components/TemplatesView';
import { SettingsView } from './components/SettingsView';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { supabase } from './services/supabaseClient';
import { Session } from '@supabase/supabase-js';

// Global context might be better, but for now we'll pass session down or use a wrapper
const ProtectedRoute: React.FC<{ session: Session | null; children: React.ReactNode }> = ({ session, children }) => {
  if (!session) return <Navigate to="/landing" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } catch (error) {
        console.error("Auth error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131022] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-[#3713ec]/20 border-t-[#3713ec] rounded-full animate-spin"></div>
          <p className="text-[#3713ec] text-[10px] font-mono uppercase tracking-[0.3em] animate-pulse">Iniciando Sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Layout session={session}>
        <Routes>
          {/* Public Routes */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute session={session}><Dashboard /></ProtectedRoute>} />
          <Route path="/clients" element={<ProtectedRoute session={session}><ClientsList /></ProtectedRoute>} />
          <Route path="/finance" element={<ProtectedRoute session={session}><FinanceTracker /></ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute session={session}><ServicesView /></ProtectedRoute>} />
          <Route path="/marketing" element={<ProtectedRoute session={session}><MarketingView /></ProtectedRoute>} />
          <Route path="/templates" element={<ProtectedRoute session={session}><TemplatesView /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute session={session}><SettingsView /></ProtectedRoute>} />
          <Route path="/client/:id" element={<ProtectedRoute session={session}><ClientMemory /></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
