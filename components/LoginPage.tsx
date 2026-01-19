
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('operator@canti.os');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0915] flex items-center justify-center p-8 font-display">
      <div className="w-full max-w-md space-y-12">
        <div className="flex flex-col items-center gap-6">
          <div className="size-20 rounded-[2rem] bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 relative">
            <div className="absolute inset-0 rounded-[2rem] border border-white/20 animate-ping opacity-20"></div>
            <span className="material-symbols-outlined text-white text-5xl font-bold">graphic_eq</span>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tighter uppercase text-white">System Access</h1>
            <p className="text-text-secondary text-xs font-mono uppercase tracking-[0.3em] mt-2">Canti_OS // Studio_Terminal_01</p>
          </div>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-4">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-mono uppercase tracking-tight">
                {error}
              </div>
            )}
            <div className="relative group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary group-focus-within:text-primary transition-colors">person</span>
              <input
                type="email"
                required
                placeholder="Operator Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background-dark border border-border-dark rounded-2xl pl-14 pr-8 py-5 text-white outline-none focus:border-primary transition-all text-sm font-mono shadow-inner"
              />
            </div>
            <div className="relative group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary group-focus-within:text-primary transition-colors">lock</span>
              <input
                type="password"
                required
                placeholder="Security Key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background-dark border border-border-dark rounded-2xl pl-14 pr-8 py-5 text-white outline-none focus:border-primary transition-all text-sm font-mono shadow-inner"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-primary text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                Authenticating...
              </>
            ) : (
              'Initiate Session'
            )}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => navigate('/landing')}
            className="text-[10px] font-bold text-text-secondary uppercase tracking-widest hover:text-white transition-colors"
          >
            New Operator? View Plans
          </button>
        </div>
      </div>
    </div>
  );
};
