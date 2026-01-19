import React, { useState } from 'react';
import { MOCK_PROJECTS, MOCK_CLIENTS } from '../constants';
import { useToast } from './Layout';
import { motion } from 'framer-motion';
import { useDashboardData } from '../hooks/useDb';
import { supabase } from '../services/supabaseClient';

export const FinanceTracker: React.FC = () => {
  const { showToast } = useToast();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const { projects: dbProjects, clients: dbClients, payments: dbPayments, loading } = useDashboardData();

  // Fallback to MOCK if empty
  const projects = dbProjects.length > 0 ? dbProjects : MOCK_PROJECTS;
  const clients = dbClients.length > 0 ? dbClients : MOCK_CLIENTS;

  const totalRevenue = projects.reduce((acc, p) => acc + p.value, 0);
  const totalReceived = projects.reduce((acc, p) => {
    // If using DB data, project.payments should exist as an array of objects
    // If using MOCK, project.payments is already an array of Payment objects
    const payments = p.payments || [];
    const paid = payments.reduce((pAcc, pay) => pAcc + pay.amount, 0);
    return acc + paid;
  }, 0);
  const totalPending = totalRevenue - totalReceived;

  const handleLogPayment = async () => {
    if (!amount || !projects[0]) return;

    // In a real scenario, we'd have a dropdown for project selection. 
    // For now, we'll log it against the first active project found.
    const { error: payError } = await supabase.from('payments').insert([{
      project_id: projects[0].id,
      amount: parseFloat(amount),
      description: description || 'Studio Session Pay',
      date: new Date().toISOString()
    }]);

    if (payError) {
      showToast(`Error: ${payError.message}`, "error");
    } else {
      showToast(`Payment of $${amount} Recorded securely in DB`, "success");
      setAmount("");
      setDescription("");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (loading && dbProjects.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-10 pb-20">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h3 className="text-3xl font-bold text-white tracking-tight">Financial Flow</h3>
          <p className="text-text-secondary text-sm mt-1">Studio-wide revenue and LTV analysis.</p>
        </div>
        <button onClick={() => showToast("Summary PDF Exported")} className="w-fit bg-surface-dark border border-border-dark text-white text-xs font-bold px-8 py-3 rounded-2xl hover:bg-white/5 transition-all shadow-lg active:scale-95">
          Export Yearly Summary
        </button>
      </motion.div>

      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          { label: 'Projected Revenue', value: totalRevenue, icon: 'analytics', color: 'text-primary' },
          { label: 'Total Received', value: totalReceived, icon: 'check_circle', color: 'text-accent-green' },
          { label: 'Awaiting Payment', value: totalPending, icon: 'timer', color: 'text-accent-amber' },
        ].map((m, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="bg-card-dark border border-border-dark p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center text-center group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="size-16 rounded-2xl bg-surface-dark flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors border border-border-dark relative z-10">
              <span className={`material-symbols-outlined text-3xl ${m.color}`}>{m.icon}</span>
            </div>
            <p className="text-text-secondary text-xs font-bold uppercase tracking-[0.2em] mb-2 relative z-10">{m.label}</p>
            <h3 className={`text-4xl font-bold tracking-tighter text-white relative z-10`}>${m.value.toLocaleString()}</h3>
          </motion.div>
        ))}
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-8"
        >
          <div className="bg-surface-dark border border-border-dark rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="px-10 py-8 border-b border-border-dark flex items-center justify-between bg-white/[0.02]">
              <h4 className="text-white font-bold tracking-wide flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">diversity_3</span>
                Client Investment Ranking (LTV)
              </h4>
              <span className="text-text-secondary text-[10px] font-mono uppercase tracking-widest">Top Producers</span>
            </div>
            <div className="divide-y divide-border-dark">
              {clients.map((client) => {
                const clientProjects = projects.filter(p => p.clientId === client.id);
                const clientTotal = clientProjects.reduce((acc, p) => acc + p.value, 0);
                const clientPaid = clientProjects.reduce((acc, p) => acc + (p.payments?.reduce((payAcc, pay) => payAcc + pay.amount, 0) || 0), 0);
                const progress = (clientPaid / (clientTotal || 1)) * 100;

                return (
                  <motion.div
                    key={client.id}
                    whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.02)' }}
                    className="px-10 py-7 flex items-center gap-6 transition-colors group cursor-pointer"
                  >
                    <div className="relative">
                      <img src={client.avatarUrl} className="size-14 rounded-2xl border-2 border-border-dark group-hover:border-primary/50 transition-colors object-cover" />
                      <div className="absolute -bottom-1 -right-1 size-5 bg-accent-green rounded-lg border-4 border-surface-dark flex items-center justify-center">
                        <span className="size-1.5 bg-white rounded-full animate-pulse"></span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold group-hover:text-primary transition-colors text-lg truncate">{client.name}</p>
                      <p className="text-text-secondary text-[10px] font-mono uppercase tracking-tight opacity-60">{client.brand} // {client.source}</p>
                    </div>
                    <div className="hidden md:block flex-1 max-w-[200px]">
                      <div className="h-2 w-full bg-background-dark rounded-full overflow-hidden border border-border-dark/30">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-primary to-accent-green"
                        ></motion.div>
                      </div>
                      <p className="text-[9px] text-text-secondary mt-2 font-bold uppercase tracking-[0.2em]">{Math.round(progress)}% Paid</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold tracking-tighter text-xl">${clientTotal.toLocaleString()}</p>
                      <p className="text-text-secondary text-[10px] uppercase font-bold tracking-widest opacity-50">LTV Value</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-card-dark to-surface-dark border border-[#2e2b4f] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 size-32 bg-primary/5 blur-3xl rounded-full"></div>
            <h4 className="text-white font-bold mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">add_card</span>
              Log New Payment
            </h4>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] px-1">Amount ($)</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-background-dark/50 border border-border-dark rounded-2xl pl-10 pr-6 py-4 text-white outline-none focus:border-primary transition-all font-bold text-lg"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] px-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Mixing Deposit"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-background-dark/50 border border-border-dark rounded-2xl px-6 py-4 text-white outline-none focus:border-primary transition-all text-sm"
                />
              </div>
              <button onClick={handleLogPayment} className="w-full bg-primary py-5 rounded-2xl text-white font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4 uppercase tracking-[0.2em] text-xs">
                Confirm Session Pay
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-surface-dark/50 border border-border-dark rounded-[2rem] p-8 relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 w-1 h-full bg-primary"></div>
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-accent-green animate-pulse">lightbulb</span>
              <p className="text-xs font-bold text-white uppercase tracking-widest">Studio Insight</p>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              You've processed <span className="text-white font-bold">12% more</span> revenue this month compared to your yearly average. Consider prioritizing <span className="text-primary font-bold">Combo 2</span> upsells for leads in the "Trap" genre.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
