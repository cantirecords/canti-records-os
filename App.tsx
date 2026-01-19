
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return (
      <div className="min-h-screen bg-[#131022] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-[#1f1b34] border border-red-500/30 rounded-[2.5rem] p-8 text-center shadow-2xl shadow-red-500/10">
          <div className="size-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-red-500 text-3xl">terminal</span>
          </div>
          <h1 className="text-white text-2xl font-bold mb-4">Configuración Incompleta</h1>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Las llaves de Supabase no se detectaron en Vercel. Necesitas agregar las variables de entorno para que el sistema pueda arrancar.
          </p>
          <div className="space-y-3 text-left bg-black/20 p-4 rounded-2xl font-mono text-[11px]">
            <div className="flex justify-between text-yellow-500">
              <span className="opacity-50">VARIABLE</span>
              <span>ESTADO</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">VITE_SUPABASE_URL</span>
              <span className={import.meta.env.VITE_SUPABASE_URL ? "text-green-500" : "text-red-500"}>
                {import.meta.env.VITE_SUPABASE_URL ? "OK" : "FALTANTE"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">VITE_SUPABASE_ANON_KEY</span>
              <span className={import.meta.env.VITE_SUPABASE_ANON_KEY ? "text-green-500" : "text-red-500"}>
                {import.meta.env.VITE_SUPABASE_ANON_KEY ? "OK" : "FALTANTE"}
              </span>
            </div>
          </div>
          <p className="text-slate-500 text-[10px] mt-6 uppercase tracking-widest font-bold">Instrucciones enviadas al chat</p>
        </div>
      </div>
    );
  }

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
