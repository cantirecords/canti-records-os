import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_CLIENTS, MOCK_PROJECTS, MOCK_SPLITS, MOCK_INVOICES, MOCK_ASSETS } from '../constants';
import { ProjectStatus, Message, TimelineEvent } from '../types';
import { generateConversationSummary } from '../services/geminiService';
import { useToast } from './Layout';
import { useDashboardData } from '../hooks/useDb';
import { supabase } from '../services/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

export const ClientMemory: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'timeline' | 'comm' | 'assets' | 'legal' | 'invoices'>('timeline');
  const [showShareMenu, setShowShareMenu] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string>("Analyzing studio chatter...");
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [messageInput, setMessageInput] = useState("");

  const { clients, projects, assets: dbAssets, invoices: dbInvoices, loading } = useDashboardData();

  // Real data lookup
  const client = clients.find(c => c.id === id) || MOCK_CLIENTS.find(c => c.id === id);
  const project = projects.find(p => p.clientId === id) || MOCK_PROJECTS.find(p => p.clientId === id);

  // State for interactive parts
  const [localConversations, setLocalConversations] = useState<Message[]>([]);
  const [localTimeline, setLocalTimeline] = useState<TimelineEvent[]>([]);
  const [checklist, setChecklist] = useState(project?.checklist || []);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations and timeline from Supabase if available
  useEffect(() => {
    if (id) {
      const fetchClientHistory = async () => {
        const { data: messages } = await supabase.from('messages').select('*').eq('client_id', id).order('created_at', { ascending: true });
        if (messages) setLocalConversations(messages);

        // Timeline logic would go here, currently using client.timeline as fallback
        if (client?.timeline) setLocalTimeline(client.timeline);
      };
      fetchClientHistory();
    }
  }, [id, client]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localConversations]);

  useEffect(() => {
    if (client && localConversations.length > 0) {
      const getSummary = async () => {
        setIsLoadingSummary(true);
        const summary = await generateConversationSummary(localConversations);
        setAiSummary(summary);
        setIsLoadingSummary(false);
      };
      getSummary();
    } else {
      setAiSummary("Once you log some studio conversations, I'll provide a high-level creative breakdown here.");
    }
  }, [client, localConversations]);

  const toggleCheck = (cid: string) => {
    setChecklist(prev => prev.map(item =>
      item.id === cid ? { ...item, isCompleted: !item.isCompleted } : item
    ));
    showToast("Progress Updated");
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !id) return;

    // Optimistic update
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'operator',
      text: messageInput,
      timestamp: new Date().toLocaleTimeString(),
      platform: 'WhatsApp'
    };

    setLocalConversations(prev => [...prev, newMessage]);
    setMessageInput("");

    // Real write to DB
    const { error } = await supabase.from('messages').insert([{
      client_id: id,
      sender: 'operator',
      text: messageInput,
      platform: 'WhatsApp'
    }]);

    if (error) {
      showToast("Sync Error: Logging locally only", "warning");
    } else {
      showToast("Log Entry Synced to DB", "success");
    }
  };

  if (loading && clients.length === 0) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  if (!client) return (
    <div className="text-white p-20 flex flex-col items-center gap-6">
      <span className="material-symbols-outlined text-6xl text-text-secondary opacity-20">person_off</span>
      <h3 className="text-2xl font-bold opacity-50">Client record not found.</h3>
      <button onClick={() => navigate('/clients')} className="text-primary font-bold text-xs uppercase tracking-widest">Back to Directory</button>
    </div>
  );

  const splits = MOCK_SPLITS.filter(s => s.projectId === project?.id);
  const invoices = dbInvoices.filter(inv => inv.clientId === id).length > 0 ? dbInvoices.filter(inv => inv.clientId === id) : MOCK_INVOICES.filter(inv => inv.clientId === id);
  const assets = dbAssets.filter(a => a.projectId === project?.id).length > 0 ? dbAssets.filter(a => a.projectId === project?.id) : MOCK_ASSETS.filter(a => a.projectId === project?.id);

  const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      'Paid': 'bg-accent-green/20 text-accent-green border-accent-green/30',
      'Sent': 'bg-primary/20 text-primary border-primary/30',
      'Viewed': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Overdue': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Signed': 'bg-accent-green/20 text-accent-green border-accent-green/30',
      'Draft': 'bg-white/5 text-text-secondary border-white/10'
    };
    return (
      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${colors[status] || colors['Draft']}`}>
        {status}
      </span>
    );
  };

  const handleShare = (method: string) => {
    navigator.clipboard.writeText(`https://canti.media/share/${id}`);
    showToast(`${method} Link Copied`);
    setShowShareMenu(null);
  };

  const ShareMenu = ({ docId }: { docId: string, type: 'invoice' | 'split' }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="absolute right-0 top-12 z-50 bg-[#151329] border border-[#2e2b4f] rounded-2xl p-4 shadow-2xl flex flex-col gap-2 min-w-[180px]"
    >
      <button onClick={() => handleShare('WhatsApp')} className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-xl text-xs font-bold text-white transition-colors">
        <span className="material-symbols-outlined text-accent-green text-sm fill-1">chat</span> WhatsApp Share
      </button>
      <button onClick={() => handleShare('Email')} className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-xl text-xs font-bold text-white transition-colors">
        <span className="material-symbols-outlined text-primary text-sm">mail</span> Email Copy
      </button>
      <button onClick={() => { showToast("PDF Generating..."); setTimeout(() => showToast("PDF Downloaded"), 1000); }} className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-xl text-xs font-bold text-white transition-colors">
        <span className="material-symbols-outlined text-red-400 text-sm">picture_as_pdf</span> Download PDF
      </button>
    </motion.div>
  );

  return (
    <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 pb-20">
      {/* LEFT: Context Card */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-3 space-y-6"
      >
        <div className="bg-[#151329] border border-[#2e2b4f] rounded-[2.5rem] p-8 flex flex-col items-center relative overflow-hidden shadow-2xl transition-all hover:border-primary/30">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent"></div>
          <div className="relative z-10 size-28 rounded-[2rem] overflow-hidden border-4 border-background-dark shadow-2xl mb-6 group">
            <img src={client.avatarUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={client.name} />
          </div>
          <h3 className="text-2xl font-bold text-white relative z-10 tracking-tight">{client.name}</h3>
          <p className="text-text-secondary text-[10px] font-mono uppercase tracking-[0.2em] mt-1 relative z-10">{client.brand}</p>

          <div className="w-full mt-6 p-4 bg-background-dark rounded-2xl border border-border-dark/50 text-[11px] text-slate-400 leading-relaxed shadow-inner">
            <span className="text-[9px] font-bold text-text-secondary uppercase block mb-1 tracking-widest">Artist Insight</span>
            "{client.bio || 'No creative context provided.'}"
          </div>

          <div className="flex flex-col w-full gap-2 mt-6">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-primary/30 transition-all cursor-pointer">
              <span className="text-[9px] font-bold text-text-secondary uppercase">Status</span>
              <span className="text-[10px] text-accent-green font-bold uppercase">{client.status}</span>
            </div>
            <div onClick={() => showToast("Instagram Link Opened")} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-primary/30 transition-all cursor-pointer">
              <span className="text-[9px] font-bold text-text-secondary uppercase">IG</span>
              <span className="text-[10px] text-primary font-mono">{client.instagram}</span>
            </div>
          </div>

          <div className="flex gap-3 w-full mt-8">
            <a href={client.whatsappLink} target="_blank" className="flex-1 py-4 bg-[#25D366] text-white rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-[#25D366]/20 transition-transform active:scale-95">
              <span className="material-symbols-outlined text-lg fill-1">chat</span>
              WhatsApp
            </a>
            <button onClick={() => showToast("Email Client Opened")} className="p-4 bg-surface-dark border border-border-dark rounded-2xl text-white hover:bg-white/5 transition-colors">
              <span className="material-symbols-outlined">mail</span>
            </button>
          </div>
        </div>

        {/* AI SUMMARY CARD */}
        <div className="bg-gradient-to-br from-[#1c192e] to-[#0a0915] border border-[#2e2b4f] rounded-[2rem] p-7 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <span className="material-symbols-outlined text-6xl rotate-12">auto_fix_high</span>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
              <span className="material-symbols-outlined text-xl fill-1 animate-pulse">psychology</span>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm tracking-tight">AI Flow Resume</h4>
              <p className="text-[8px] text-accent-green font-mono uppercase font-bold">Processed_Realtime</p>
            </div>
          </div>
          <div className={`text-[11px] text-slate-300 leading-relaxed space-y-2 whitespace-pre-wrap transition-opacity ${isLoadingSummary ? 'opacity-40' : 'opacity-100'}`}>
            {aiSummary}
          </div>
          {isLoadingSummary && (
            <div className="absolute inset-0 bg-background-dark/20 backdrop-blur-[1px] flex items-center justify-center">
              <div className="w-10 h-1 bg-primary/20 rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* CENTER: Studio Hub */}
      <div className="lg:col-span-6 space-y-10">
        <div className="flex items-center gap-2 bg-[#0a0915] p-2 rounded-[1.75rem] border border-border-dark w-fit shadow-2xl overflow-x-auto no-scrollbar">
          {[
            { id: 'timeline', label: 'Timeline', icon: 'timeline' },
            { id: 'comm', label: 'Communication', icon: 'forum' },
            { id: 'assets', label: 'Vault', icon: 'folder_open' },
            { id: 'legal', label: 'Legal', icon: 'gavel' },
            { id: 'invoices', label: 'Billing', icon: 'receipt_long' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-[1.25rem] font-bold text-xs tracking-wide transition-all shrink-0 ${activeTab === tab.id ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-105' : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
            >
              <span className={`material-symbols-outlined text-xl ${activeTab === tab.id ? 'fill-1' : ''}`}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* TIMELINE VIEW */}
        <AnimatePresence mode="wait">
          {activeTab === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10 relative pl-10 border-l-2 border-primary/20 ml-6 pb-4"
            >
              {localTimeline.map((event) => (
                <div key={event.id} className="relative group">
                  <div className="absolute left-[-46px] top-1 size-11 rounded-[1.25rem] bg-card-dark border-2 border-primary/40 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-white text-xl">{event.icon}</span>
                  </div>
                  <div className="bg-[#151329] border border-[#2e2b4f] p-6 rounded-[2rem] hover:border-primary/50 transition-all shadow-xl">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-bold tracking-tight">{event.title}</h4>
                      <span className="text-[10px] font-mono text-text-secondary uppercase">{event.date}</span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">{event.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* COMMUNICATION HUB */}
          {activeTab === 'comm' && (
            <motion.div
              key="comm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 flex flex-col h-[700px]"
            >
              <div className="flex-1 bg-[#100e21] border border-[#2e2b4f] rounded-[2.5rem] p-8 overflow-y-auto space-y-6 shadow-inner custom-scrollbar">
                {localConversations.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'operator' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1.5 px-2">
                      <span className="text-[9px] font-bold text-text-secondary uppercase tracking-tighter">{msg.sender === 'operator' ? 'You' : client.name}</span>
                    </div>
                    <div className={`max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed shadow-lg ${msg.sender === 'operator'
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-[#1c192e] text-slate-200 border border-[#2e2b4f] rounded-tl-none'
                      }`}>
                      {msg.text}
                    </div>
                    <span className="text-[8px] text-slate-600 mt-1 px-2">{msg.timestamp}</span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="relative group">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Log session notes or client feedback..."
                  className="w-full bg-[#151329] border border-[#2e2b4f] rounded-[2rem] px-8 py-6 text-sm text-white outline-none focus:border-primary transition-all pr-32 shadow-2xl"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <button onClick={handleSendMessage} className="px-8 py-3 bg-primary text-white text-[10px] font-bold uppercase rounded-[1.25rem] shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">Sync Log</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ASSETS VAULT */}
          {activeTab === 'assets' && (
            <motion.div
              key="assets"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {assets.map(asset => (
                <div key={asset.id} className="bg-[#151329] border border-[#2e2b4f] p-6 rounded-[2rem] group hover:border-primary transition-all shadow-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="size-12 rounded-2xl bg-surface-darker flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                      <span className="material-symbols-outlined text-2xl font-bold">audio_file</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm truncate">{asset.name}</p>
                      <p className="text-[10px] text-text-secondary font-mono uppercase">{asset.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border-dark/50">
                    <span className="text-[10px] font-bold text-text-secondary uppercase">{asset.size}</span>
                    <button onClick={() => showToast("Asset Downloading...")} className="p-2 bg-primary/20 rounded-lg text-primary hover:bg-primary hover:text-white transition-all"><span className="material-symbols-outlined text-lg">download</span></button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* LEGAL & BILLING would follow similar motion patterns */}
        </AnimatePresence>
      </div>

      {/* RIGHT: Production Feed */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-3"
      >
        <div className="sticky top-6 space-y-8">
          <div className="bg-[#151329] border border-[#2e2b4f] rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.25em] mb-8 relative z-10">Production Flow</p>
            <div className="space-y-4 relative z-10">
              {checklist.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`flex items-center gap-4 p-4.5 rounded-[1.5rem] cursor-pointer transition-all border ${item.isCompleted
                      ? 'bg-surface-darker/30 border-transparent opacity-40 grayscale scale-95'
                      : 'bg-surface-dark border-white/5 hover:border-primary shadow-lg shadow-primary/5 hover:scale-[1.02]'
                    }`}
                >
                  <div className={`size-6 rounded-lg border-2 flex items-center justify-center transition-all ${item.isCompleted ? 'bg-accent-green border-accent-green' : 'border-border-dark bg-[#0a0915]'
                    }`}>
                    {item.isCompleted && <span className="material-symbols-outlined text-white text-[16px] font-bold">check</span>}
                  </div>
                  <span className={`text-xs font-bold tracking-tight ${item.isCompleted ? 'text-text-secondary line-through' : 'text-slate-200'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-10 pt-8 border-t border-border-dark/50">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-3">
                <span>Flow Success</span>
                <span className="text-white">{Math.round((checklist.filter(i => i.isCompleted).length / (checklist.length || 1)) * 100)}%</span>
              </div>
              <div className="h-2 w-full bg-[#0a0915] rounded-full overflow-hidden p-0.5 border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(checklist.filter(i => i.isCompleted).length / (checklist.length || 1)) * 100}%` }}
                  className="h-full bg-gradient-to-r from-primary to-accent-green shadow-[0_0_12px_rgba(55,19,236,0.6)] rounded-full transition-all duration-700"
                ></motion.div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#3713ec] to-[#1f0b9c] rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(55,19,236,0.4)] group cursor-pointer hover:translate-y-[-5px] transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-7xl rotate-12">bolt</span>
            </div>
            <h5 className="text-white font-bold text-sm mb-2">Creative Push</h5>
            <p className="text-white/60 text-[10px] leading-relaxed">Accepted suggestions automatically log to your studio timeline.</p>
            <button onClick={() => showToast("Milestone Recorded")} className="w-full mt-6 py-4 bg-white/10 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10 shadow-xl">Push Milestone</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
