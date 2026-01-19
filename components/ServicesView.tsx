
import React from 'react';
import { SERVICES } from '../constants';

export const ServicesView: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-white tracking-tighter">Production Menu</h2>
        <p className="text-text-secondary max-w-xl mx-auto">Standardized combos designed for creative flow. Select a package to see detailed inclusion tracking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SERVICES.map((service, idx) => (
          <div 
            key={service.id} 
            className={`relative group bg-card-dark border rounded-3xl p-10 overflow-hidden transition-all duration-500 hover:translate-y-[-8px] shadow-2xl ${
              idx === 1 ? 'border-primary shadow-primary/10' : 'border-border-dark'
            }`}
          >
            {idx === 1 && (
              <div className="absolute top-6 right-6 px-4 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-widest animate-pulse">
                Most Popular
              </div>
            )}
            
            <div className="flex flex-col h-full">
              <span className="material-symbols-outlined text-4xl text-primary mb-6 group-hover:scale-110 transition-transform">
                {idx === 1 ? 'diamond' : 'bolt'}
              </span>
              <h3 className="text-2xl font-bold text-white mb-2">{service.name}</h3>
              <p className="text-text-secondary text-sm mb-8 leading-relaxed">{service.description}</p>
              
              <div className="space-y-3 mb-10 flex-1">
                {service.includes.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                    <span className="material-symbols-outlined text-accent-green text-lg">check_circle</span>
                    {item}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-border-dark">
                <div className="text-3xl font-bold text-white tracking-tighter">${service.price}</div>
                <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-sm transition-all border border-white/10">
                  Update Structure
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface-dark border border-dashed border-border-dark rounded-3xl p-12 text-center group cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all">
         <span className="material-symbols-outlined text-4xl text-text-secondary mb-4 group-hover:text-primary transition-colors">add_circle</span>
         <h4 className="text-white font-bold">Add Custom Offering</h4>
         <p className="text-text-secondary text-xs mt-1">Create a unique package or a-la-carte service.</p>
      </div>
    </div>
  );
};
