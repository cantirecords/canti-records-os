import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_CLIENTS, MOCK_PROJECTS } from '../constants';
import { ProjectStatus } from '../types';
import { motion } from 'framer-motion';
import { useDashboardData } from '../hooks/useDb';

export const ClientsList: React.FC = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterBrand, setFilterBrand] = useState<string>('All');
  const { clients: dbClients, projects: dbProjects, loading } = useDashboardData();

  const clients = dbClients.length > 0 ? dbClients : MOCK_CLIENTS;
  const projects = dbProjects.length > 0 ? dbProjects : MOCK_PROJECTS;

  const getClientLTV = (clientId: string) => {
    return projects
      .filter(p => p.clientId === clientId)
      .reduce((acc, p) => acc + (p.value || 0), 0);
  };

  const filteredClients = clients.filter(c => {
    if (filterStatus !== 'All' && c.status !== filterStatus) return false;
    if (filterBrand !== 'All' && c.brand !== filterBrand) return false;
    return true;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0 }
  };

  if (loading && dbClients.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-8 pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <h3 className="text-3xl font-bold text-white tracking-tight">Client Directory</h3>
          <p className="text-text-secondary text-sm mt-1">Manage all records and media relationships.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className="bg-surface-dark border border-border-dark text-white text-xs font-bold rounded-2xl px-6 py-3 outline-none focus:border-primary transition-all cursor-pointer shadow-lg"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            className="bg-surface-dark border border-border-dark text-white text-xs font-bold rounded-2xl px-6 py-3 outline-none focus:border-primary transition-all cursor-pointer shadow-lg"
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
          >
            <option value="All">All Brands</option>
            <option value="Canti Records">Canti Records</option>
            <option value="Canti Media">Canti Media</option>
          </select>
          <button className="bg-primary text-white text-xs font-bold px-8 py-3 rounded-2xl flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95">
            <span className="material-symbols-outlined text-lg font-bold">person_add</span>
            Add Lead
          </button>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredClients.map((client) => {
          const ltv = getClientLTV(client.id);
          return (
            <motion.div
              key={client.id}
              variants={itemVariants}
              whileHover={{ y: -5, borderColor: 'rgba(55,19,236,0.5)' }}
              onClick={() => navigate(`/client/${client.id}`)}
              className="bg-[#151329] border border-[#2e2b4f] rounded-[2.5rem] p-7 transition-all group cursor-pointer relative overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                <a
                  href={client.whatsappLink}
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  className="size-11 bg-accent-green/10 text-accent-green rounded-2xl flex items-center justify-center hover:bg-accent-green hover:text-white transition-all shadow-lg shadow-accent-green/10"
                >
                  <span className="material-symbols-outlined text-xl font-bold">chat</span>
                </a>
              </div>

              <div className="flex items-center gap-5 mb-8">
                <div className="size-16 rounded-[1.5rem] overflow-hidden border-2 border-surface-dark shadow-2xl group-hover:scale-105 transition-transform">
                  <img src={client.avatarUrl} alt={client.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg group-hover:text-primary transition-colors truncate max-w-[150px]">{client.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`size-1.5 rounded-full ${client.status === 'Active' ? 'bg-accent-green' : 'bg-text-secondary'}`}></span>
                    <p className="text-text-secondary text-[10px] font-mono uppercase tracking-widest">{client.status}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8 min-h-[48px]">
                {client.genreTags?.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-surface-darker text-text-secondary text-[9px] font-bold uppercase tracking-[0.15em] rounded-xl border border-border-dark shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-7 border-t border-border-dark/50 flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-[10px] uppercase font-bold tracking-[0.2em] mb-1 opacity-50">LTV</p>
                  <p className="text-white font-bold text-xl tracking-tighter">${ltv.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-text-secondary text-[10px] uppercase font-bold tracking-[0.2em] mb-1 opacity-50">Brand</p>
                  <p className="text-white text-[11px] font-mono font-bold">{client.brand === 'Canti Records' ? 'RECORDS' : 'MEDIA'}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
