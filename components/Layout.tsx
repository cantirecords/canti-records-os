
import React, { useState, createContext, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { Session } from '@supabase/supabase-js';

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

interface LayoutProps {
  children: React.ReactNode;
  session: Session | null;
}

export const Layout: React.FC<LayoutProps> = ({ children, session }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [toast, setToast] = useState<{ message: string, type: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const isPublicPage = location.pathname === '/login' || location.pathname === '/landing';

  const isAuth = !!session;

  // Fix: Move redirect logic to a dedicated useEffect to avoid hook rules violation
  useEffect(() => {
    if (!isAuth && !isPublicPage) {
      navigate('/landing');
    }
  }, [isAuth, isPublicPage, navigate]);

  const navItems = [
    { id: 'dashboard', icon: 'grid_view', label: 'Dashboard', path: '/' },
    { id: 'marketing', icon: 'campaign', label: 'Marketing', path: '/marketing' },
    { id: 'clients', icon: 'person_search', label: 'Records', path: '/clients' },
    { id: 'finance', icon: 'account_balance_wallet', label: 'Financials', path: '/finance' },
    { id: 'services', icon: 'inventory_2', label: 'Studio Menu', path: '/services' },
    { id: 'templates', icon: 'gavel', label: 'Templates', path: '/templates' },
    { id: 'settings', icon: 'settings', label: 'Configuration', path: '/settings' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    showToast("Session Terminated", "info");
    setTimeout(() => navigate('/landing'), 500);
  };

  // Prevent rendering protected content while redirecting
  if (!isAuth && !isPublicPage) {
    return null;
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div className="flex h-screen w-full bg-background-dark overflow-hidden font-body relative">
        {/* TOAST NOTIFICATION */}
        {toast && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] animate-bounce">
            <div className={`px-6 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 backdrop-blur-xl ${toast.type === 'success' ? 'bg-accent-green/20 border-accent-green/30 text-accent-green' : 'bg-primary/20 border-primary/30 text-primary'
              }`}>
              <span className="material-symbols-outlined">{toast.type === 'success' ? 'check_circle' : 'info'}</span>
              <span className="text-xs font-bold uppercase tracking-widest">{toast.message}</span>
            </div>
          </div>
        )}

        {/* SIDEBAR - Only show if not on public page */}
        {!isPublicPage && (
          <aside className="hidden md:flex w-20 lg:w-64 flex-col justify-between border-r border-border-dark bg-[#0a0915] p-6 shrink-0 z-50">
            <div className="space-y-12">
              <div className="flex items-center gap-4 px-2 cursor-pointer group" onClick={() => navigate('/')}>
                <div className="size-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(55,19,236,0.4)] group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-white text-2xl font-bold">graphic_eq</span>
                </div>
                <div className="hidden lg:flex flex-col">
                  <h1 className="text-white text-lg font-bold leading-none tracking-tighter">CANTI OS</h1>
                  <p className="text-primary text-[9px] uppercase font-mono mt-1 font-bold tracking-[0.2em]">Creative_Arch</p>
                </div>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl transition-all duration-300 group ${location.pathname === item.path
                      ? 'bg-primary text-white shadow-xl shadow-primary/20'
                      : 'text-text-secondary hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <span className={`material-symbols-outlined text-2xl ${location.pathname === item.path ? 'fill-1' : ''}`}>
                      {item.icon}
                    </span>
                    <span className="hidden lg:block text-sm font-bold tracking-tight">
                      {item.label}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            <div
              onClick={handleLogout}
              className="bg-surface-dark border border-border-dark rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-red-500/10 transition-colors group"
            >
              <div className="size-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0 group-hover:border-red-500/40">
                <span className="material-symbols-outlined text-primary text-xl group-hover:text-red-500">logout</span>
              </div>
              <div className="hidden lg:flex flex-col overflow-hidden">
                <p className="text-white text-[10px] font-bold truncate">{session?.user?.email || 'Operator'}</p>
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 bg-accent-green rounded-full shadow-[0_0_6px_#0bda6c]"></span>
                  <p className="text-text-secondary text-[8px] font-mono uppercase tracking-tighter">Exit System</p>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* MAIN CONTENT WRAPPER */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {!isPublicPage && (
            <header className="flex items-center justify-between border-b border-border-dark bg-[#0a0915]/80 backdrop-blur-3xl px-8 py-5 shrink-0 z-40">
              <div className="flex items-center gap-4">
                <div className="md:hidden size-10 rounded-xl bg-primary flex items-center justify-center" onClick={() => navigate('/')}>
                  <span className="material-symbols-outlined text-white">graphic_eq</span>
                </div>
                <div>
                  <h2 className="text-white text-xl font-bold tracking-tight">
                    {navItems.find(i => i.path === location.pathname)?.label || 'System'}
                  </h2>
                  <p className="text-[10px] text-text-secondary font-mono tracking-widest uppercase">ID: STUDIO_NODE_01</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-3 bg-surface-darker px-4 py-2 rounded-2xl border border-border-dark border-opacity-50">
                  <span className="text-[9px] font-mono text-slate-500 uppercase">Process: Active</span>
                  <div className="flex gap-1">
                    <div className="w-0.5 h-3 bg-primary animate-pulse"></div>
                    <div className="w-0.5 h-3 bg-accent-green animate-pulse delay-75"></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2.5 text-text-secondary hover:text-white hover:bg-white/5 rounded-xl transition-all relative" onClick={() => showToast("Notifications Cleared", "info")}>
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-[#0a0915]"></span>
                  </button>
                </div>
              </div>
            </header>
          )}

          <main className={`flex-1 overflow-y-auto scroll-smooth ${isPublicPage ? '' : 'p-8 lg:p-12 bg-background-dark'}`}>
            {children}
          </main>
        </div>
      </div>
    </ToastContext.Provider>
  );
};
