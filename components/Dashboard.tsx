import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PROJECTS, MOCK_CLIENTS, MOCK_LEADS, MOCK_ASSETS, MOCK_INVOICES } from '../constants';
import { ProjectStatus } from '../types';
import { useToast } from './Layout';
import { motion } from 'framer-motion';
import { useDashboardData } from '../hooks/useDb';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { projects: dbProjects, clients: dbClients, leads: dbLeads, assets: dbAssets, invoices: dbInvoices, loading } = useDashboardData();

  // Use DB data if available, otherwise fallback to MOCK
  const projects = dbProjects.length > 0 ? dbProjects : MOCK_PROJECTS;
  const clients = dbClients.length > 0 ? dbClients : MOCK_CLIENTS;
  const leads = dbLeads.length > 0 ? dbLeads : MOCK_LEADS;
  const assets = dbAssets.length > 0 ? dbAssets : MOCK_ASSETS;
  const invoices = dbInvoices.length > 0 ? dbInvoices : MOCK_INVOICES;

  const activeProjects = projects.filter(p => p.status === ProjectStatus.ACTIVE);
  const overdueInvoices = invoices.filter(inv => inv.status === 'Overdue' || (inv.status === 'Viewed' && new Date(inv.dueDate) < new Date()));

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
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-text-secondary font-mono text-xs uppercase tracking-widest">Initialising Core Systems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 pb-20">
      {/* HUD METRICS */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { label: 'Revenue Pulse', value: `$${(projects.reduce((acc, p) => acc + p.value, 0) / 1000).toFixed(1)}K`, icon: 'monitoring', color: 'text-primary' },
          { label: 'Live Sessions', value: activeProjects.length, icon: 'album', color: 'text-white' },
          { label: 'Marketing Leads', value: leads.length, icon: 'campaign', color: 'text-accent-green' },
          { label: 'Pending Docs', value: overdueInvoices.length + 2, icon: 'gavel', color: 'text-accent-amber' },
        ].map((m, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="group bg-[#151329] border border-[#2e2b4f] p-7 rounded-[2.5rem] shadow-2xl transition-all duration-300 hover:border-primary/60 relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 size-24 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors"></div>
            <div className="flex justify-between items-start mb-6">
              <div className={`size-12 rounded-2xl bg-surface-darker flex items-center justify-center border border-border-dark ${m.color}`}>
                <span className="material-symbols-outlined text-2xl fill-1">{m.icon}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-mono text-text-secondary opacity-50">NODE_0{i + 1}</span>
                <div className="flex gap-1 mt-1">
                  <span className="w-1 h-1 bg-accent-green rounded-full animate-pulse"></span>
                  <span className="w-1 h-1 bg-accent-green rounded-full animate-pulse delay-75"></span>
                </div>
              </div>
            </div>
            <p className="text-text-secondary text-[11px] font-bold uppercase tracking-[0.2em] mb-1">{m.label}</p>
            <h3 className="text-3xl font-bold text-white tracking-tighter">{m.value}</h3>
          </motion.div>
        ))}
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* CENTER COLUMN: ACTIVE PROJECTS & MARKETING */}
        <div className="lg:col-span-8 space-y-10">
          {/* PRODUCTION FLOW */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                <span className="material-symbols-outlined text-primary scale-110">sensors</span>
                Production Timeline
              </h3>
              <button onClick={() => navigate('/clients')} className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-white transition-colors">Client Map</button>
            </div>

            <motion.div
              variants={containerVariants}
              className="space-y-4"
            >
              {activeProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate(`/client/${project.clientId}`)}
                  className="bg-[#151329] border border-[#2e2b4f] p-6 rounded-[2.5rem] flex flex-col md:flex-row md:items-center gap-8 group cursor-pointer hover:border-primary/50 transition-all shadow-xl hover:shadow-primary/5 relative"
                >
                  <div className="size-16 rounded-[1.5rem] bg-surface-darker border border-border-dark flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined text-3xl text-primary font-bold group-hover:scale-110 transition-transform">graphic_eq</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-lg group-hover:text-primary transition-colors truncate">{project.title}</h4>
                    <div className="flex items-center gap-3 mt-1 text-[11px] font-mono text-text-secondary uppercase">
                      <span className="truncate">Client: {clients.find(c => c.id === project.clientId)?.name}</span>
                      <span className="size-1 bg-border-dark rounded-full shrink-0"></span>
                      <span className="text-white font-bold">DUE: {project.targetDate}</span>
                    </div>
                  </div>

                  <div className="w-full md:w-56 space-y-2 shrink-0">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                      <span>Progress</span>
                      <span className="text-white">{project.progress}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-[#0a0915] rounded-full p-0.5 border border-border-dark/30 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary to-accent-green rounded-full shadow-[0_0_15px_rgba(55,19,236,0.6)]"
                      ></motion.div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <span className="material-symbols-outlined text-text-secondary group-hover:text-white group-hover:translate-x-1 transition-all">arrow_forward_ios</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* MARKETING PULSE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-accent-green scale-110">campaign</span>
              Marketing Pulse
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {leads.slice(0, 4).map(lead => (
                <motion.div
                  key={lead.id}
                  whileHover={{ x: 5 }}
                  onClick={() => navigate('/marketing')}
                  className="bg-surface-dark/50 border border-border-dark p-5 rounded-[1.5rem] flex items-center justify-between hover:border-accent-green/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`size-10 rounded-xl flex items-center justify-center ${lead.status === 'Warm' ? 'bg-accent-amber/20 text-accent-amber' : 'bg-white/5 text-text-secondary'}`}>
                      <span className="material-symbols-outlined text-xl">{lead.platform === 'WhatsApp' ? 'chat' : 'mail'}</span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{lead.name}</p>
                      <p className="text-[10px] text-text-secondary uppercase font-mono">{lead.source}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${lead.status === 'Warm' ? 'bg-accent-amber text-black' : 'bg-white/10 text-white'}`}>{lead.status}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: ALERTS & CONSOLE */}
        <div className="lg:col-span-4 space-y-8">
          {/* ALERTS SYSTEM */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#151329] border border-[#2e2b4f] rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-accent-amber to-red-500"></div>
            <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-accent-amber text-lg animate-pulse">emergency_home</span>
              Critical Engine Alerts
            </h4>
            <div className="space-y-4">
              {overdueInvoices.length > 0 && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 group">
                  <span className="material-symbols-outlined text-red-400">receipt_long</span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white">Payment Overdue</p>
                    <p className="text-[9px] text-red-400/80 uppercase font-mono">Invoice #{overdueInvoices[0].id}</p>
                  </div>
                  <button onClick={() => showToast("Reminder Dispatched via WA", "success")} className="text-[9px] font-bold text-white bg-red-500 px-3 py-1 rounded-lg hover:scale-105 active:scale-95 transition-all">Notify</button>
                </div>
              )}
              <div onClick={() => navigate('/templates')} className="p-4 bg-accent-amber/10 border border-accent-amber/20 rounded-2xl flex items-center gap-4 group cursor-pointer hover:border-accent-amber transition-all">
                <span className="material-symbols-outlined text-accent-amber">history_edu</span>
                <div className="flex-1">
                  <p className="text-xs font-bold text-white">Unsigned Split Sheet</p>
                  <p className="text-[9px] text-accent-amber/80 uppercase font-mono">Project: Neon Nights</p>
                </div>
                <span className="material-symbols-outlined text-sm text-text-secondary group-hover:translate-x-1 transition-all">chevron_right</span>
              </div>
            </div>
          </motion.div>

          {/* QUICK ACTIONS CONSOLE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0a0915]/50 border border-border-dark rounded-[2.5rem] p-8"
          >
            <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-8">Studio Launchpad</h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'New Record', icon: 'add_circle', path: '/clients', color: 'bg-primary' },
                { label: 'Log Pay', icon: 'payments', path: '/finance', color: 'bg-surface-darker' },
                { label: 'Split Sheet', icon: 'gavel', path: '/templates', color: 'bg-surface-darker' },
                { label: 'Marketing', icon: 'campaign', path: '/marketing', color: 'bg-surface-darker' },
              ].map((btn, i) => (
                <motion.button
                  key={i}
                  whileHover={{ y: -5, backgroundColor: 'rgba(55,19,236,0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(btn.path)}
                  className={`${btn.color} border border-border-dark p-6 rounded-[1.5rem] flex flex-col items-center gap-3 transition-all group shadow-lg`}
                >
                  <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">{btn.icon}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest">{btn.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* RECENT DELIVERABLES */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-card-dark border border-border-dark rounded-[2rem] p-6 shadow-xl"
          >
            <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-6">Last Assets</h4>
            <div className="space-y-4">
              {assets.slice(0, 2).map(asset => (
                <motion.div
                  key={asset.id}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                  className="flex items-center gap-4 p-3 bg-white/5 rounded-xl group cursor-pointer transition-all"
                >
                  <div className="size-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-xl">audio_file</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-white truncate">{asset.name}</p>
                    <p className="text-[9px] font-mono text-text-secondary uppercase mt-0.5">{asset.type}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); showToast("Download Started"); }} className="material-symbols-outlined text-sm text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity hover:text-white">download</button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
