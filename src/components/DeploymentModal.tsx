import React from 'react';
import { X, Globe, Smartphone, Download, Save, ExternalLink, ChevronRight } from 'lucide-react';

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
}

const DeploymentModal: React.FC<DeploymentModalProps> = ({ isOpen, onClose, code }) => {
  if (!isOpen) return null;

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0B0F19] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-[#0B0F19]/90 sticky top-0 backdrop-blur z-10">
          <div>
             <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <Save size={20} className="text-purple-400" />
                </div>
                Export & Deploy
             </h2>
             <p className="text-slate-400 text-sm mt-2">Choose how you want to use your generated application.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white border border-transparent hover:border-white/5">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          
          {/* Option 1: Download */}
          <div className="group p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all hover:bg-white/[0.04]">
             <div className="flex gap-5">
                 <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold border border-blue-500/20 group-hover:scale-110 transition-transform">
                    <Download size={22} />
                 </div>
                 <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">Download Source</h3>
                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                       Get the complete source code as a single HTML file. Contains all structure, styles, and logic in one portable document.
                    </p>
                    <button 
                      onClick={downloadCode}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all font-medium text-sm shadow-lg shadow-blue-900/20"
                    >
                       Download index.html
                    </button>
                 </div>
             </div>
          </div>

          {/* Option 2: Web Hosting */}
          <div className="group p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all hover:bg-white/[0.04]">
             <div className="flex gap-5">
                 <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold border border-purple-500/20 group-hover:scale-110 transition-transform">
                    <Globe size={22} />
                 </div>
                 <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">Publish to Web</h3>
                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                       Host your single-file app for free using static hosting providers.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <a href="https://app.netlify.com/drop" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all group/link">
                            <span className="text-sm font-medium text-slate-300">Netlify Drop</span>
                            <ExternalLink size={14} className="text-slate-500 group-hover/link:text-white" />
                        </a>
                        <a href="https://pages.github.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all group/link">
                            <span className="text-sm font-medium text-slate-300">GitHub Pages</span>
                            <ExternalLink size={14} className="text-slate-500 group-hover/link:text-white" />
                        </a>
                    </div>
                 </div>
             </div>
          </div>

          {/* Option 3: Mobile App */}
          <div className="group p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all hover:bg-white/[0.04]">
             <div className="flex gap-5">
                 <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center font-bold border border-green-500/20 group-hover:scale-110 transition-transform">
                    <Smartphone size={22} />
                 </div>
                 <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">Convert to Mobile App</h3>
                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                       Wrap your HTML file into a native iOS or Android application using CapacitorJS.
                    </p>
                    <div className="bg-[#050505] p-4 rounded-lg border border-white/10 font-mono text-[11px] text-slate-400 overflow-x-auto shadow-inner">
                        <div className="flex flex-col gap-1">
                            <span className="text-slate-600"># In your terminal</span>
                            <span className="text-green-400">npm init @capacitor/app</span>
                            <span className="text-purple-300">cp index.html www/index.html</span>
                            <span className="text-blue-300">npx cap add android</span>
                        </div>
                    </div>
                 </div>
             </div>
          </div>

        </div>
        
        {/* Footer */}
        <div className="p-6 bg-[#0B0F19]/90 border-t border-white/5 flex justify-end sticky bottom-0 backdrop-blur">
            <button 
                onClick={onClose}
                className="px-8 py-3 bg-white text-slate-900 hover:bg-slate-200 rounded-lg font-bold transition-colors shadow-lg shadow-white/5"
            >
                Done
            </button>
        </div>
      </div>
    </div>
  );
};

export default DeploymentModal;