
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-background-dark text-white relative overflow-hidden font-display">
      {/* Background Decor */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute top-[-10%] right-[-10%] size-[500px] bg-primary/20 blur-[120px] rounded-full"
      ></motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute bottom-[-10%] left-[-10%] size-[400px] bg-accent-green/10 blur-[100px] rounded-full"
      ></motion.div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="container mx-auto px-8 py-10 flex justify-between items-center relative z-10"
      >
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
            <span className="material-symbols-outlined text-white font-bold">graphic_eq</span>
          </div>
          <span className="text-xl font-bold tracking-tighter uppercase">Canti OS</span>
        </div>
        <div className="flex items-center gap-8">
          <a href="#features" className="hidden md:block text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hidden md:block text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-white transition-colors">Pricing</a>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            Sign In
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="container mx-auto px-8 pt-20 pb-32 text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.div
            variants={itemVariants}
            className="inline-block px-4 py-1.5 bg-primary/20 border border-primary/30 rounded-full text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-8"
          >
            Next Gen Creative Ops
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-8xl font-bold tracking-tighter leading-none mb-8"
          >
            Run your studio like a <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-green">Record Label.</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-text-secondary text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            The conversation-aware operating system for solo music and media entrepreneurs.
            Stop chasing admin. Start building your legacy.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
            >
              Launch System Access
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
              Watch Demo Flow
            </button>
          </motion.div>
        </motion.div>

        {/* Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
          className="mt-32 relative mx-auto max-w-5xl rounded-[3rem] border border-border-dark bg-[#0a0915] p-4 shadow-[0_50px_100px_rgba(0,0,0,0.5)] transform rotate-1 hover:rotate-0 transition-transform duration-1000"
        >
          <div className="rounded-[2.5rem] overflow-hidden border border-border-dark bg-background-dark aspect-video flex items-center justify-center opacity-80 bg-matrix-bg">
            <div className="flex flex-col items-center gap-4 text-text-secondary">
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="material-symbols-outlined text-6xl opacity-20"
              >grid_view</motion.span>
              <p className="text-xs font-mono uppercase tracking-widest">Interactive Dashboard Preview</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Trust Section */}
      <section id="features" className="container mx-auto px-8 py-32 border-t border-border-dark/50">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {[
            { icon: 'chat', title: 'Conversation Aware', desc: 'Auto-summarize client talk into project milestones.' },
            { icon: 'gavel', title: 'Legal First', iconColor: 'text-accent-amber', desc: 'Standard split sheets and contracts ready to ship.' },
            { icon: 'monitoring', title: 'Financial Pulse', iconColor: 'text-accent-green', desc: 'Real-time LTV tracking and billing automation.' },
          ].map((f, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="space-y-4 text-left p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group"
            >
              <div className={`size-12 rounded-2xl bg-background-dark flex items-center justify-center border border-border-dark ${f.iconColor || 'text-primary'}`}>
                <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">{f.icon}</span>
              </div>
              <h3 className="text-xl font-bold">{f.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};
