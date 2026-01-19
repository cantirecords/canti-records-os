
import React, { useState } from 'react';
import { MOCK_PLANS } from '../constants';
import { OSConfig } from '../types';
import { useToast } from './Layout';

export const SettingsView: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'system' | 'plans' | 'api'>('system');
  const [config, setConfig] = useState<OSConfig>({
    aiEnabled: true,
    autoSync: true,
    notifications: true,
    cloudBackup: false,
    marketingIntegration: true
  });

  const toggleConfig = (key: keyof OSConfig) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
    showToast(`${key.replace(/([A-Z])/g, ' $1')} Updated`);
  };

  const handleProAuth = async () => {
    try {
      // Per instructions for High Quality Media (Veo/Gemini Pro Image)
      if (typeof (window as any).aistudio?.openSelectKey === 'function') {
        await (window as any).aistudio.openSelectKey();
        showToast("High-Quality API Key Linked");
      } else {
        showToast("External API Auth Not Available", "error");
      }
    } catch (e) {
      showToast("Auth Failed", "error");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tighter">OS Configuration</h2>
          <p className="text-text-secondary mt-2">Adjust your studio operating environment parameters.</p>
        </div>
        <div className="flex bg-[#0a0915] p-1.5 rounded-2xl border border-border-dark shadow-xl">
           {[
             { id: 'system', label: 'System', icon: 'settings' },
             { id: 'api', label: 'Connections', icon: 'hub' },
             { id: 'plans', label: 'Subscription', icon: 'verified' },
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all ${
                 activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-secondary hover:text-white'
               }`}
             >
               <span className="material-symbols-outlined text-lg">{tab.icon}</span>
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {activeTab === 'system' && (
          <div className="lg:col-span-8 space-y-6">
             <div className="bg-card-dark border border-border-dark rounded-[2.5rem] p-10 shadow-2xl divide-y divide-border-dark/50">
                {[
                  { id: 'aiEnabled', label: 'AI Studio Copilot', desc: 'Enable Gemini-driven conversation summaries and milestone suggestions.', icon: 'psychology' },
                  { id: 'autoSync', label: 'Meta Ads Auto-Sync', desc: 'Automatically import and route Meta leads from WhatsApp intake.', icon: 'sync' },
                  { id: 'notifications', label: 'Critical HUD Alerts', desc: 'Receive real-time HUD notifications for overdue payments or milestones.', icon: 'bolt' },
                  { id: 'marketingIntegration', label: 'Ads Performance Tracking', desc: 'Bridge CRM data back to Meta for conversion tracking.', icon: 'campaign' },
                  { id: 'cloudBackup', label: 'Global Cloud Backup', desc: 'Synchronize project assets to secure cloud storage automatically.', icon: 'cloud_done' },
                ].map((item) => (
                  <div key={item.id} className="py-8 flex items-center justify-between group">
                    <div className="flex items-start gap-6">
                       <div className="size-12 rounded-2xl bg-surface-dark flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-lg">
                          <span className="material-symbols-outlined">{item.icon}</span>
                       </div>
                       <div className="max-w-md">
                          <h4 className="text-white font-bold">{item.label}</h4>
                          <p className="text-text-secondary text-xs mt-1 leading-relaxed">{item.desc}</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => toggleConfig(item.id as keyof OSConfig)}
                      className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${config[item.id as keyof OSConfig] ? 'bg-accent-green' : 'bg-border-dark'}`}
                    >
                       <div className={`absolute top-1 size-6 bg-white rounded-full transition-all duration-300 ${config[item.id as keyof OSConfig] ? 'left-7' : 'left-1 shadow-md'}`}></div>
                    </button>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="lg:col-span-8 space-y-6">
             <div className="bg-card-dark border border-border-dark rounded-[2.5rem] p-10 shadow-2xl">
                <h4 className="text-white font-bold mb-8">Service Connections</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {[
                     { name: 'Gemini Core', status: 'Active', icon: 'psychology', color: 'text-primary' },
                     { name: 'Meta Marketing API', status: 'Connected', icon: 'campaign', color: 'text-blue-500' },
                     { name: 'WhatsApp Web Engine', status: 'Synced', icon: 'chat', color: 'text-accent-green' },
                     { name: 'Google Workspace', status: 'Paused', icon: 'folder', color: 'text-red-400' },
                   ].map((s, i) => (
                     <div key={i} className="p-6 bg-surface-dark border border-border-dark rounded-2xl flex items-center justify-between group hover:border-white/20 transition-all">
                        <div className="flex items-center gap-4">
                           <span className={`material-symbols-outlined text-2xl ${s.color}`}>{s.icon}</span>
                           <div>
                              <p className="text-white font-bold text-sm">{s.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                 <span className={`size-1.5 rounded-full ${s.status === 'Paused' ? 'bg-red-400' : 'bg-accent-green animate-pulse'}`}></span>
                                 <p className="text-[9px] font-mono text-text-secondary uppercase">{s.status}</p>
                              </div>
                           </div>
                        </div>
                        <button className="material-symbols-outlined text-text-secondary hover:text-white opacity-0 group-hover:opacity-100 transition-all">settings</button>
                     </div>
                   ))}
                </div>

                <div className="mt-12 p-8 bg-primary/10 border border-primary/30 rounded-3xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-6 opacity-5">
                      <span className="material-symbols-outlined text-8xl">bolt</span>
                   </div>
                   <h4 className="text-white font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary fill-1">verified</span>
                      High-Quality Media Engine
                   </h4>
                   <p className="text-text-secondary text-xs mt-2 leading-relaxed max-w-md">
                      Required for 4K video generation (Veo) and high-fidelity project artwork. Link a paid project key to enable.
                   </p>
                   <button 
                    onClick={handleProAuth}
                    className="mt-6 px-8 py-3 bg-primary text-white text-[10px] font-bold uppercase rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                   >
                      Authorize Studio Pro Media
                   </button>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="lg:col-span-12">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {MOCK_PLANS.map(plan => (
                  <div key={plan.id} className={`bg-card-dark border rounded-[2.5rem] p-10 flex flex-col relative overflow-hidden transition-all hover:translate-y-[-8px] shadow-2xl ${plan.isPopular ? 'border-primary shadow-primary/10 ring-1 ring-primary/20' : 'border-border-dark'}`}>
                     {plan.isPopular && (
                        <div className="absolute top-6 right-6 px-3 py-1 bg-primary text-white text-[8px] font-bold uppercase rounded-full tracking-widest">Selected Plan</div>
                     )}
                     <div className="mb-8">
                        <h4 className="text-2xl font-bold text-white">{plan.name}</h4>
                        <div className="flex items-end gap-1 mt-4">
                           <span className="text-4xl font-bold text-white tracking-tighter">{plan.price}</span>
                           <span className="text-text-secondary text-xs font-bold uppercase mb-1 tracking-widest">/mo</span>
                        </div>
                     </div>
                     <div className="space-y-4 mb-10 flex-1">
                        {plan.features.map((f, i) => (
                           <div key={i} className="flex items-center gap-3 text-xs text-slate-300">
                              <span className="material-symbols-outlined text-accent-green text-lg">check_circle</span>
                              {f}
                           </div>
                        ))}
                     </div>
                     <button className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${plan.isPopular ? 'bg-white/5 text-white border border-white/10' : 'bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02]'}`}>
                        {plan.isPopular ? 'Active Session' : 'Upgrade Link'}
                     </button>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab !== 'plans' && (
          <div className="lg:col-span-4">
             <div className="bg-gradient-to-br from-primary to-[#1f0b9c] rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <span className="material-symbols-outlined text-7xl rotate-12">support_agent</span>
                </div>
                <h5 className="text-white font-bold mb-4">Operator Support</h5>
                <p className="text-white/80 text-xs leading-relaxed mb-8">Need help configuring your studio flow? Our agency specialists are available 24/7 via WhatsApp.</p>
                <button className="w-full py-3 bg-white text-primary font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-white/90 transition-all">Direct Support</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
