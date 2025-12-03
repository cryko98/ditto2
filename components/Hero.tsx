import React from 'react';
import { Sparkles, ArrowRight, Smile } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
  onViewArchitecture: () => void;
  onOpenMemeGenerator: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart, onViewArchitecture, onOpenMemeGenerator }) => {
  return (
    <div className="relative pt-32 pb-24 lg:pt-52 lg:pb-40 overflow-hidden">
      
      {/* Enhanced Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-purple-900/20 rounded-[100%] blur-[130px] mix-blend-screen opacity-40 animate-pulse"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-20">
          
          <div className="lg:w-1/2 text-center lg:text-left z-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-purple-300 text-xs font-bold tracking-widest uppercase mb-10 backdrop-blur-md shadow-lg hover:bg-white/[0.06] transition-colors cursor-default">
              <Sparkles size={12} className="text-purple-400 animate-pulse" />
              <span>Version 2.0 Live</span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-bold tracking-tighter text-white mb-8 leading-[1.05]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-indigo-300 drop-shadow-lg">
                Ditto 2.0
              </span>
              <br />
              <span className="text-4xl lg:text-6xl text-slate-500 font-medium tracking-tight block mt-2">
                Idea to App.
              </span>
            </h1>

            <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-xl mx-auto lg:mx-0 font-light border-l-2 border-purple-500/20 pl-6">
              The self-building app generator powered by LLMs. Describe your dream app, and Ditto will plan, code, and deploy it instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <button 
                onClick={onStart}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-2 tracking-wide">
                    Start Building <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button 
                onClick={onOpenMemeGenerator}
                className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-pink-300 bg-pink-500/[0.1] hover:bg-pink-500/[0.2] border border-pink-500/20 hover:border-pink-500/40 rounded-full transition-all duration-300 backdrop-blur-sm tracking-wide"
              >
                <span className="relative flex items-center gap-2">
                    <Smile className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Ditto Meme Gen
                </span>
              </button>
            </div>
          </div>

          <div className="lg:w-1/2 flex justify-center perspective-1000 relative">
            {/* Background Glow for Image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[80px]"></div>

            <div className="relative w-80 h-80 lg:w-[500px] lg:h-[500px] group cursor-pointer">
                {/* Orbital Rings - Enhanced */}
                <div className="absolute inset-0 border border-white/5 rounded-full scale-110 animate-[spin_20s_linear_infinite] opacity-40 group-hover:border-purple-500/30 transition-colors"></div>
                <div className="absolute inset-0 border border-purple-500/10 rounded-full scale-125 animate-[spin_30s_linear_infinite_reverse] opacity-30 border-dashed group-hover:border-purple-500/40 transition-colors"></div>
                <div className="absolute inset-0 border border-indigo-500/10 rounded-full scale-90 animate-[spin_15s_linear_infinite] opacity-30 group-hover:border-indigo-500/30 transition-colors"></div>

                <div className="relative w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3">
                     <img 
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png" 
                        alt="Ditto" 
                        className="w-[85%] h-[85%] object-contain animate-float drop-shadow-[0_20px_50px_rgba(168,85,247,0.4)] filter brightness-110 contrast-125"
                    />
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;