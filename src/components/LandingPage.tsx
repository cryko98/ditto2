import React, { useEffect, useState } from 'react';
import { Github, Menu, X, Info, ArrowUpRight, Copy, Check } from 'lucide-react';
import Hero from './Hero';
import Features from './Features';

interface LandingPageProps {
  onOpenBuilder: () => void;
  onOpenMemeGenerator: () => void;
}

const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
  </svg>
);

const LandingPage: React.FC<LandingPageProps> = ({ onOpenBuilder, onOpenMemeGenerator }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [copiedCa, setCopiedCa] = useState(false);

  const ca = "6VKDRsckuBSk3rFnsvoHV9hrPKnzNHRSCfrS91Cupump";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const copyCa = () => {
    navigator.clipboard.writeText(ca);
    setCopiedCa(true);
    setTimeout(() => setCopiedCa(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-purple-500/30 selection:text-purple-100">
      
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
         {/* Deep space gradient */}
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617]"></div>
         
         {/* Ambient Glows */}
         <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-purple-800/10 rounded-full blur-[120px] mix-blend-screen opacity-60"></div>
         <div className="absolute top-[10%] right-[0%] w-[50%] h-[50%] bg-indigo-800/10 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
         <div className="absolute bottom-[0%] left-[20%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[100px] mix-blend-screen opacity-30"></div>
      </div>

      {/* Navigation */}
      <nav 
        className={`fixed w-full z-50 transition-all duration-500 ${
            scrolled ? 'bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/50' : 'bg-transparent border-b border-transparent py-2'
        }`}
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 p-1.5 flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-105 group-hover:border-purple-500/40">
               <div className="absolute inset-0 bg-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png" alt="logo" className="relative z-10 w-full h-full object-contain drop-shadow-md" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-purple-100 transition-colors hidden sm:inline">
              Ditto <span className="text-purple-400">2.0</span>
            </span>
          </div>

          {/* Desktop Nav - Changed from lg:flex to md:flex */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            {/* CA Badge */}
            <button 
                onClick={copyCa}
                className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/40 rounded-full px-4 py-1.5 transition-all group"
            >
                <span className="text-purple-400 font-bold text-xs">CA:</span>
                <span className="font-mono text-xs text-slate-300">6VKD...pump</span>
                {copiedCa ? <Check size={12} className="text-green-400" /> : <Copy size={12} className="opacity-50 group-hover:opacity-100" />}
            </button>

            {/* Socials */}
            <a href="https://x.com/dittocodes" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
                <XLogo className="w-5 h-5" />
            </a>

            <div className="h-4 w-px bg-white/10"></div>

            <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors duration-200">Features</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors duration-200">How it works</button>
            <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors duration-200">About</button>
            <button 
              onClick={onOpenBuilder}
              className="relative overflow-hidden group text-white bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-black/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative font-semibold tracking-wide">Launch Builder</span>
            </button>
          </div>

          {/* Mobile Toggle - Changed from lg:hidden to md:hidden */}
          <div className="flex md:hidden items-center gap-4">
             {/* Mobile CA (Icon only if space is tight, or small badge) */}
             <button 
                onClick={copyCa}
                className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1.5"
            >
                <span className="text-purple-400 font-bold text-xs">CA</span>
                {copiedCa ? <Check size={12} className="text-green-400" /> : <Copy size={12} className="text-slate-400" />}
            </button>

            <button 
                className="p-2 text-slate-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#020617]/95 backdrop-blur-2xl border-b border-white/10 absolute w-full shadow-2xl">
            <div className="flex flex-col p-6 space-y-4 text-slate-300">
               {/* Mobile Full CA Display */}
               <div className="p-4 bg-white/5 rounded-xl border border-white/10 mb-2">
                  <div className="text-xs text-purple-400 font-bold mb-1 uppercase tracking-wider">Contract Address</div>
                  <div className="flex items-center gap-3 justify-between">
                     <code className="text-xs font-mono text-slate-300 break-all">{ca}</code>
                     <button onClick={copyCa} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 text-white">
                        {copiedCa ? <Check size={16} /> : <Copy size={16} />}
                     </button>
                  </div>
               </div>

               <a href="https://x.com/dittocodes" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-lg hover:text-white py-3 border-b border-white/5">
                  <XLogo className="w-5 h-5" />
                  <span>Follow on X</span>
               </a>

              <button onClick={() => scrollToSection('features')} className="text-left text-lg hover:text-purple-400 py-3 border-b border-white/5">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-left text-lg hover:text-purple-400 py-3 border-b border-white/5">How it works</button>
              <button onClick={() => scrollToSection('about')} className="text-left text-lg hover:text-purple-400 py-3 border-b border-white/5">About</button>
              <button onClick={() => { onOpenBuilder(); setIsMenuOpen(false); }} className="text-left text-lg text-white font-semibold py-4 bg-purple-900/20 rounded-xl px-4 mt-2">Launch Builder</button>
            </div>
          </div>
        )}
      </nav>

      <main className="relative z-10">
        <Hero 
          onStart={onOpenBuilder} 
          onOpenMemeGenerator={onOpenMemeGenerator}
          onViewArchitecture={() => scrollToSection('features')} 
        />
        <Features />

        {/* How It Works Section */}
        <section id="how-it-works" className="py-32 relative">
           <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-slate-900/20 to-[#020617] pointer-events-none"></div>
           <div className="container mx-auto px-6 relative z-10">
             <div className="max-w-4xl mx-auto text-center mb-20">
                <span className="text-purple-400 font-semibold tracking-wider text-sm uppercase mb-4 block">Workflow</span>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">From Idea to Reality</h2>
                <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
                    Ditto 2.0 streamlines the development process into three simple steps, eliminating the boilerplate and configuration fatigue.
                </p>
             </div>
             
             <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { step: "01", title: "Prompt", desc: "Describe your app idea in plain English using natural language." },
                    { step: "02", title: "Generate", desc: "Ditto's intelligent agent writes the HTML, CSS, and JS instantly." },
                    { step: "03", title: "Preview", desc: "Interact with your live application immediately in the browser." }
                ].map((item, i) => (
                    <div key={i} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative p-10 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:border-purple-500/20 group-hover:bg-white/[0.04]">
                            <div className="text-8xl font-bold text-white/[0.03] absolute top-4 right-6 pointer-events-none select-none group-hover:text-purple-500/10 transition-colors">{item.step}</div>
                            <div className="w-12 h-1 bg-purple-500 rounded-full mb-8"></div>
                            <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{item.title}</h3>
                            <p className="text-slate-400 leading-relaxed relative z-10">{item.desc}</p>
                        </div>
                    </div>
                ))}
             </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-32 relative border-t border-white/5 bg-[#020617]">
            <div className="container mx-auto px-6 text-center">
                <div className="max-w-3xl mx-auto bg-[#0B0F19] rounded-[2.5rem] p-12 border border-white/5 shadow-2xl relative overflow-hidden">
                    
                    {/* Decorative glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-purple-500/10 blur-[100px] pointer-events-none"></div>

                    <div className="inline-flex items-center justify-center p-4 bg-slate-900 rounded-2xl mb-8 ring-1 ring-white/10 shadow-lg relative z-10">
                        <Info size={28} className="text-purple-400" />
                    </div>
                    
                    <h2 className="text-4xl font-bold text-white mb-8 tracking-tight relative z-10">About the Project</h2>
                    <p className="text-slate-400 text-lg leading-relaxed mb-10 relative z-10">
                        This website is a simplified adaptation based on <span className="text-purple-400 font-semibold">Yohei Nakajima's Ditto 2</span> project. It serves as a functional demonstration of the original GitHub repository, designed to be accessible to everyone without the need for Python coding or backend setup.
                    </p>
                    
                    <div className="relative z-10 flex justify-center">
                        <a 
                            href="https://github.com/yoheinakajima/ditto-2" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-950 rounded-full font-bold hover:bg-purple-50 transition-all duration-300 shadow-xl shadow-white/5 hover:shadow-purple-500/20 hover:scale-105 group"
                        >
                            <Github size={20} />
                            <span>View Original Repository</span>
                            <ArrowUpRight size={18} className="text-slate-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                    </div>
                </div>
            </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#020617] border-t border-white/5 py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3 opacity-90">
                 <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <div className="w-2.5 h-2.5 bg-purple-400 rounded-full shadow-[0_0_10px_rgba(192,132,252,0.5)]"></div>
                 </div>
                 <span className="text-slate-300 font-semibold tracking-wide">Ditto 2.0 <span className="text-slate-600 font-normal ml-1">Demo</span></span>
            </div>
            
            <div className="flex gap-8 text-sm text-slate-500 font-medium">
              <button onClick={() => scrollToSection('about')} className="hover:text-purple-400 transition-colors">About</button>
              <a href="https://github.com/yoheinakajima/ditto-2" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">Original Repo</a>
              <span className="opacity-40 cursor-default">MIT License</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;