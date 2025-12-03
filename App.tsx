import React, { useState } from 'react';
import { PenTool, Box, ArrowLeft, Code, Eye, MonitorPlay, BookOpen } from 'lucide-react';
import LandingPage from './components/LandingPage';
import BuilderPanel from './components/BuilderPanel';
import DeploymentModal from './components/DeploymentModal';
import MemeGeneratorModal from './components/MemeGeneratorModal';

const App: React.FC = () => {
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isMemeModalOpen, setIsMemeModalOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [showDeploymentModal, setShowDeploymentModal] = useState(false);

  const handleCodeGenerated = (code: string) => {
    setGeneratedCode(code);
    setViewMode('preview'); // Automatically switch to preview when new code arrives
  };

  const clearApp = () => {
    setGeneratedCode(null);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#020617] flex flex-col font-sans">
      
      {/* Modal Layer */}
      <DeploymentModal 
        isOpen={showDeploymentModal} 
        onClose={() => setShowDeploymentModal(false)}
        code={generatedCode || ''}
      />
      
      <MemeGeneratorModal 
        isOpen={isMemeModalOpen}
        onClose={() => setIsMemeModalOpen(false)}
      />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
          
          {/* Main Content Area */}
          <div className={`flex-1 transition-all duration-300 flex flex-col relative ${isBuilderOpen ? 'mr-0 md:mr-[450px]' : ''}`}>
            
            {generatedCode ? (
               <div className="h-full w-full flex flex-col bg-[#0F172A]">
                  {/* App Toolbar */}
                  <div className="h-16 bg-[#0B0F19] border-b border-white/5 flex items-center px-6 justify-between flex-shrink-0 z-10 shadow-sm">
                     
                     {/* Left: Navigation */}
                     <div className="flex items-center gap-5">
                        <button onClick={clearApp} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors group">
                            <div className="p-1.5 rounded-md bg-white/5 group-hover:bg-white/10 transition-colors">
                                <ArrowLeft size={16} />
                            </div>
                            <span className="hidden sm:inline">Back to Home</span>
                        </button>
                        <div className="h-6 w-px bg-white/5"></div>
                        
                        {/* View Mode Toggles */}
                        <div className="flex bg-slate-900 rounded-lg p-1 border border-white/5">
                            <button 
                                onClick={() => setViewMode('preview')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'preview' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <Eye size={14} />
                                Preview
                            </button>
                            <button 
                                onClick={() => setViewMode('code')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'code' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <Code size={14} />
                                Code
                            </button>
                        </div>
                     </div>

                     {/* Right: Actions */}
                     <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setShowDeploymentModal(true)}
                            className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white px-4 py-2 rounded-lg border border-white/5 hover:bg-white/5 transition-all hover:border-purple-500/30"
                        >
                            <BookOpen size={14} className="text-purple-400" />
                            <span className="hidden sm:inline">Deployment</span>
                        </button>
                     </div>
                  </div>
                  
                  {/* Content Area */}
                  <div className="flex-1 overflow-hidden relative bg-[#020617]">
                    {viewMode === 'preview' ? (
                        <iframe 
                            srcDoc={generatedCode}
                            className="w-full h-full bg-white border-none"
                            title="Generated App"
                            sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
                        />
                    ) : (
                        <div className="w-full h-full overflow-hidden flex flex-col">
                            <div className="flex-1 relative">
                                <textarea 
                                    readOnly 
                                    value={generatedCode}
                                    className="w-full h-full bg-[#0B0F19] text-slate-300 font-mono text-sm p-8 resize-none focus:outline-none leading-relaxed"
                                    spellCheck={false}
                                />
                                <div className="absolute top-4 right-6 pointer-events-none opacity-40 text-[10px] text-slate-500 uppercase font-mono tracking-widest border border-slate-700 px-2 py-1 rounded">
                                    ReadOnly
                                </div>
                            </div>
                        </div>
                    )}
                  </div>
               </div>
            ) : (
               <div className="h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                  <LandingPage 
                    onOpenBuilder={() => setIsBuilderOpen(true)} 
                    onOpenMemeGenerator={() => setIsMemeModalOpen(true)}
                  />
               </div>
            )}
            
            {/* FAB: Only visible if builder is closed AND we are NOT in preview mode (preview has its own handle via BuilderPanel now if open, or FAB if closed) */}
            {!isBuilderOpen && !generatedCode && (
                <button
                onClick={() => setIsBuilderOpen(true)}
                className="fixed bottom-8 right-8 p-4 bg-purple-600 hover:bg-purple-500 text-white rounded-full shadow-2xl shadow-purple-600/40 transition-all duration-300 hover:scale-110 z-40 group border-4 border-[#020617]"
                aria-label="Open Builder"
                >
                <PenTool size={24} />
                <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none border border-white/10 shadow-xl translate-x-2 group-hover:translate-x-0">
                    Open Builder
                </span>
                </button>
            )}
          </div>

          {/* Builder Panel */}
          <BuilderPanel 
            isOpen={isBuilderOpen} 
            onToggle={() => setIsBuilderOpen(!isBuilderOpen)} 
            onCodeGenerated={handleCodeGenerated}
          />

      </div>
    </div>
  );
};

export default App;