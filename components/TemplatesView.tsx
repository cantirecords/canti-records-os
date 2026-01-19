
import React from 'react';
import { LEGAL_TEMPLATES } from '../constants';
import { useToast } from './Layout';

export const TemplatesView: React.FC = () => {
  const { showToast } = useToast();

  const handleGenerate = (title: string) => {
    showToast(`Processing ${title}...`, 'info');
    setTimeout(() => {
      showToast(`${title} Generated`, 'success');
    }, 1500);
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-white tracking-tighter">Legal Templates Vault</h2>
        <p className="text-text-secondary max-w-xl mx-auto">Standardized creative contracts for studio operations. Professionalize your flow with zero friction.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {LEGAL_TEMPLATES.map((t) => (
          <div key={t.id} className="bg-card-dark border border-border-dark rounded-[2rem] p-8 hover:border-primary transition-all group shadow-xl relative overflow-hidden">
             <div className="absolute -right-4 -top-4 size-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
             <div className="flex items-start justify-between mb-8">
                <div className="size-14 rounded-2xl bg-surface-darker flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-lg">
                   <span className="material-symbols-outlined text-3xl">{t.icon}</span>
                </div>
                <button onClick={() => showToast("Template Editor Opened", "info")} className="px-4 py-2 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-text-secondary rounded-lg border border-border-dark hover:text-white transition-colors">
                  Open Editor
                </button>
             </div>
             <h3 className="text-xl font-bold text-white mb-2">{t.title}</h3>
             <p className="text-text-secondary text-sm leading-relaxed">{t.description}</p>
             <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => handleGenerate(t.title)}
                  className="flex-1 py-3 bg-primary text-white text-[10px] font-bold uppercase rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                  Generate for Project
                </button>
                <button onClick={() => showToast("PDF Template Preview Opened")} className="p-3 bg-white/5 rounded-xl border border-border-dark hover:bg-white/10 transition-all"><span className="material-symbols-outlined text-sm">picture_as_pdf</span></button>
             </div>
          </div>
        ))}
      </div>

      <div onClick={() => showToast("File Selector Opened", "info")} className="bg-surface-dark border border-dashed border-border-dark rounded-[2rem] p-16 text-center group cursor-pointer hover:bg-primary/5 transition-all">
         <span className="material-symbols-outlined text-4xl text-text-secondary mb-4 group-hover:text-primary group-hover:scale-110 transition-all">post_add</span>
         <h4 className="text-white font-bold">Import Custom Template</h4>
         <p className="text-text-secondary text-xs mt-1">Upload your own .docx or .pdf structure to the vault.</p>
      </div>
    </div>
  );
};
