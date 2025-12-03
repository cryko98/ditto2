import React from 'react';
import { Bot, LayoutTemplate, Box, RefreshCw, FileCode, Shield } from 'lucide-react';
import { Feature } from '../types';

const features: Feature[] = [
  {
    title: "Natural Language to App",
    description: "Describe your app in plain English. The LLM plans and implements routes, templates, and static assets automatically.",
    icon: Bot
  },
  {
    title: "Live Builder Panel",
    description: "Access a built-in builder UI. Click the tool button to open a side panel with live logs and chat interface.",
    icon: LayoutTemplate
  },
  {
    title: "Sandboxed Operations",
    description: "Tools only allow reads/writes inside templates/, static/, routes/, and documentation files for safety.",
    icon: Shield
  },
  {
    title: "Hot Reload",
    description: "After a successful build task, the app reloads blueprints from routes/ without requiring a server restart.",
    icon: RefreshCw
  },
  {
    title: "Self-Documenting",
    description: "Maintains 'builder_context.md' for planning and 'agents.md' as a canonical architecture record.",
    icon: FileCode
  },
  {
    title: "Single Entrypoint",
    description: "Orchestrated through a single main.py Flask server. /app always renders templates/index.html.",
    icon: Box
  }
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-32 relative bg-[#020617]">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Powerful Capabilities</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Ditto 2.0 combines the power of LiteLLM with Flask to create a seamless rapid prototyping environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
                key={index} 
                className="group relative p-8 rounded-3xl bg-[#0B0F19] border border-white/5 hover:border-purple-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/10 overflow-hidden"
            >
              {/* Hover Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-inner border border-white/5 group-hover:rotate-3">
                    <feature.icon size={26} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-purple-200 transition-colors">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm group-hover:text-slate-300 transition-colors">
                    {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;