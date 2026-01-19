
import React, { useState } from 'react';
import { MOCK_LEADS } from '../constants';
import { useToast } from './Layout';

export const MarketingView: React.FC = () => {
  const { showToast } = useToast();
  const [adText, setAdText] = useState("Hi Canti! I saw your Combo 1 ad and...");
  const [localLeads, setLocalLeads] = useState(MOCK_LEADS);

  const handleConvert = (id: string, name: string) => {
    setLocalLeads(prev => prev.filter(l => l.id !== id));
    showToast(`Lead ${name} Converted to Record`);
  };

  const copyWhatsAppLink = () => {
    const encoded = encodeURIComponent(adText);
    const link = `https://wa.me/1234567890?text=${encoded}`;
    navigator.clipboard.writeText(link);
    showToast("WA.ME Link Copied to Clipboard");
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tighter">Marketing Engine</h2>
          <p className="text-text-secondary mt-2">Tracking Meta Ads conversion and WhatsApp intake flow.</p>
        </div>
        <div className="flex gap-3">
           <div className="px-6 py-4 bg-surface-dark border border-border-dark rounded-2xl flex flex-col">
              <span className="text-[10px] font-bold text-text-secondary uppercase">CPL (Avg)</span>
              <span className="text-xl font-bold text-accent-green">$4.20</span>
           </div>
           <div className="px-6 py-4 bg-surface-dark border border-border-dark rounded-2xl flex flex-col">
              <span className="text-[10px] font-bold text-text-secondary uppercase">Conversion</span>
              <span className="text-xl font-bold text-primary">18%</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
          <h4 className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.2em]">Recent Intake Queue</h4>
          <div className="bg-card-dark border border-border-dark rounded-[2.5rem] overflow-hidden shadow-2xl">
             <div className="divide-y divide-border-dark">
                {localLeads.map(lead => (
                  <div key={lead.id} className="p-8 flex items-center justify-between hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-6">
                       <div className="size-12 rounded-2xl bg-surface-dark flex items-center justify-center border border-border-dark">
                          <span className="material-symbols-outlined text-primary">{lead.platform === 'WhatsApp' ? 'chat' : 'campaign'}</span>
                       </div>
                       <div>
                          <p className="text-white font-bold text-lg">{lead.name}</p>
                          <p className="text-text-secondary text-xs font-mono uppercase tracking-widest">{lead.source} • {lead.date}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="text-right">
                          <p className="text-white font-bold text-sm">{lead.initialBudget ? `$${lead.initialBudget}` : 'N/A'}</p>
                          <p className="text-[9px] text-text-secondary uppercase font-bold tracking-widest">Est. Budget</p>
                       </div>
                       <button onClick={() => handleConvert(lead.id, lead.name)} className="px-5 py-2.5 bg-primary text-white text-[10px] font-bold uppercase rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20">Convert</button>
                    </div>
                  </div>
                ))}
                {localLeads.length === 0 && (
                  <div className="p-20 text-center opacity-40">
                    <p className="text-sm">Queue Clear. No active intakes.</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-gradient-to-br from-[#181533] to-[#0a0915] border border-[#2e2b4f] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
              <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-6">Quick Link Builder</h4>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">Generate deep links for your Meta Ads with preset marketing messages.</p>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase text-text-secondary px-1">Initial Text</label>
                    <input 
                      type="text" 
                      value={adText}
                      onChange={(e) => setAdText(e.target.value)}
                      className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary transition-all" 
                    />
                 </div>
                 <button onClick={copyWhatsAppLink} className="w-full py-4 bg-accent-green text-black font-bold text-[11px] uppercase rounded-xl shadow-lg shadow-accent-green/10 hover:scale-[1.02] transition-all">Copy wa.me link</button>
              </div>
           </div>

           <div className="bg-card-dark border border-border-dark rounded-[2rem] p-6">
              <div className="flex items-center gap-3 mb-4">
                 <span className="material-symbols-outlined text-primary">auto_fix_high</span>
                 <p className="text-[10px] font-bold text-white uppercase tracking-widest">Ad AI Analysis</p>
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Leads from <span className="text-white font-bold">Instagram Stories</span> are converting 15% faster than Feed posts. Consider increasing budget for "Melodic Hook" creatives.
              </p>
              <button onClick={() => showToast("Analysis Refreshed", "info")} className="w-full mt-4 py-2 border border-white/5 rounded-lg text-[9px] uppercase font-bold text-text-secondary hover:text-white transition-all">Update Stats</button>
           </div>
        </div>
      </div>
    </div>
  );
};
