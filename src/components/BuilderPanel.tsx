import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2, Terminal, ChevronLeft, ChevronRight, Zap, Activity } from 'lucide-react';
import { GoogleGenAI, GenerateContentResponse, ChatSession, FunctionDeclaration, Type } from "@google/genai";

interface BuilderPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  onCodeGenerated: (code: string) => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
  suggestions?: string[];
  isToolUse?: boolean;
}

const BuilderPanel: React.FC<BuilderPanelProps> = ({ isOpen, onToggle, onCodeGenerated }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hi! I\'m Ditto 2.0. I\'m ready to build your dream app. Just describe what you want to create!' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<ChatSession | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Define DexScreener Tool
  const dexScreenerTool: FunctionDeclaration = {
    name: 'getTokenInfo',
    description: 'Get real-time token data (price, liquidity, mcap, volume) from DexScreener using a Solana or EVM contract address (CA). Use this when the user provides a contract address.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        tokenAddress: {
          type: Type.STRING,
          description: 'The contract address (CA) of the token.',
        },
      },
      required: ['tokenAddress'],
    },
  };

  const initChat = () => {
    if (!chatSessionRef.current) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chatSessionRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                tools: [{ functionDeclarations: [dexScreenerTool] }],
                systemInstruction: `You are Ditto, an **Elite Senior Frontend Architect**.
                
                CAPABILITIES:
                1. **App Building:** Build premium, single-file HTML/JS/Tailwind apps.
                2. **Analysis:** If a user asks for token info in chat, use the 'getTokenInfo' tool.

                ### APP BUILDING RULES (When user asks for code):
                - **Stack:** HTML5, Tailwind CSS (CDN), FontAwesome (CDN), Google Fonts (Inter).
                - **Visual Design & Accessibility (CRITICAL):**
                  - **Contrast:** ENSURE HIGH CONTRAST. Text MUST be legible against the background. Use \`text-slate-100\` or \`text-white\` on dark backgrounds. Avoid gray-on-gray that is hard to read.
                  - **Default Theme:** If no specific design is requested, use the "Ditto" brand identity:
                    - **Backgrounds:** Deep Space Dark (\`bg-slate-950\` or \`#020617\`).
                    - **Accents:** Vibrant Purple (\`purple-500\`, \`purple-600\`) and Electric Indigo.
                    - **Surface:** Glassmorphism (\`bg-white/5\`, \`backdrop-blur\`, \`border-white/10\`).
                - **Code Quality:**
                  - Write production-grade, clean, and robust JavaScript.
                  - Minimize errors and handle edge cases.
                  - Ensure responsive design (mobile-first).
                - **Output:** SINGLE HTML FILE wrapped in \`\`\`html ... \`\`\`.
                - **Data Integration:** If the user asks for a crypto app, price tracker, or mentions a CA, **YOU MUST GENERATE CODE THAT FETCHES REAL DATA** using the DexScreener API:
                  Endpoint: \`https://api.dexscreener.com/latest/dex/tokens/{tokenAddress}\`
                  The generated app should display Price, Liquidity, and Market Cap dynamically.

                ### POST-GENERATION SUGGESTIONS
                - Provide 3 smart next steps.
                - **Format:** JSON Array of strings.
                - **Example:** <<<SUGGESTIONS>>>["Add a price chart", "Make it mobile responsive", "Add wallet connection"]<<<SUGGESTIONS>>>
                `,
            },
        });
    }
  };

  const handleSend = async (textOverride?: string) => {
    const messageToSend = textOverride || input;
    if (!messageToSend.trim()) return;

    // Initialize chat if needed
    initChat();

    // UI Updates
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: messageToSend }]);
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) return;

      // Start the conversation loop (supports multiple turns for tool calling)
      let currentResult = await chatSessionRef.current.sendMessageStream({ message: messageToSend });
      let keepProcessing = true;
      
      // We create a temporary message placeholder for the model's response
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      while (keepProcessing) {
        keepProcessing = false; // Default to stopping unless we hit a tool call
        let fullText = '';
        let functionCallData = null;

        for await (const chunk of currentResult) {
            // 1. Handle Text Content
            const text = (chunk as GenerateContentResponse).text || '';
            fullText += text;
            
            const displayContent = fullText.split('<<<SUGGESTIONS>>>')[0];
            
            setMessages(prev => {
                const newMsgs = [...prev];
                // Update the last message (which is the model's placeholder)
                newMsgs[newMsgs.length - 1] = { 
                    role: 'model', 
                    text: displayContent,
                    isToolUse: !!functionCallData // Mark if we are in tool mode
                };
                return newMsgs;
            });

            // 2. Handle Function Calls
            if (chunk.functionCalls && chunk.functionCalls.length > 0) {
                functionCallData = chunk.functionCalls[0];
            }
        }

        // Check if we need to execute a tool
        if (functionCallData) {
            keepProcessing = true; // We need to go around the loop again after sending tool results
            
            // Notify UI
            setMessages(prev => {
                 const newMsgs = [...prev];
                 newMsgs[newMsgs.length - 1].text += `\n\n*Scanning DexScreener for ${functionCallData.args['tokenAddress']}...*`;
                 return newMsgs;
            });

            try {
                // Execute Fetch
                const ca = functionCallData.args['tokenAddress'];
                const apiRes = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${ca}`);
                const data = await apiRes.json();
                
                // Send Result back to Model
                const toolResponse = {
                    functionResponses: [{
                        id: functionCallData.id,
                        name: functionCallData.name,
                        response: { result: data }
                    }]
                };
                
                // Get the next stream based on the tool output
                currentResult = await chatSessionRef.current.sendMessageStream(toolResponse);
                
            } catch (err) {
                console.error("Tool execution failed", err);
                keepProcessing = false;
                setMessages(prev => [...prev, { role: 'model', text: "\n⚠️ Failed to fetch data from DexScreener." }]);
            }
        } else {
            // Final processing (Code & Suggestions) only when we are done with tools
            const codeMatch = fullText.match(/```html\s*([\s\S]*?)\s*```/);
            if (codeMatch && codeMatch[1]) {
                onCodeGenerated(codeMatch[1]);
            }

            // Extract and parse suggestions
            const suggestionsMatch = fullText.match(/<<<SUGGESTIONS>>>([\s\S]*?)<<<SUGGESTIONS>>>/);
            if (suggestionsMatch && suggestionsMatch[1]) {
                try {
                    // Regex strategy for robust JSON parsing
                    const itemRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'/g;
                    const items: string[] = [];
                    let match;
                    while ((match = itemRegex.exec(suggestionsMatch[1])) !== null) {
                        if (match[1]) items.push(match[1]);
                        if (match[2]) items.push(match[2]);
                    }
                    if (items.length > 0) {
                        setMessages(prev => {
                            const newMsgs = [...prev];
                            const lastMsg = newMsgs[newMsgs.length - 1];
                            lastMsg.suggestions = items.slice(0, 3);
                            return newMsgs;
                        });
                    }
                } catch (e) {
                    console.error("Failed to parse suggestions", e);
                }
            }
        }
      }

    } catch (error) {
      console.error("Error generating code:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. The API might be overloaded." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div 
      className={`fixed z-[55] flex flex-col bg-[#050912]/95 backdrop-blur-xl shadow-2xl transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1)
        /* Mobile Styles (Bottom Sheet) */
        bottom-0 left-0 w-full h-[50dvh] border-t border-white/10 rounded-t-2xl
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        
        /* Desktop Styles (Side Panel) */
        md:top-0 md:right-0 md:left-auto md:bottom-auto md:h-full md:w-[450px] md:border-l md:border-t-0 md:rounded-none md:translate-y-0
        ${isOpen ? 'md:translate-x-0' : 'md:translate-x-full'}
      `}
    >
      {/* Side Toggle Handle - Desktop Only */}
      <button 
        onClick={onToggle}
        className="hidden md:flex absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 bg-[#050912] border-y border-l border-white/10 text-slate-400 hover:text-white p-2 rounded-l-xl shadow-[-10px_0_20px_rgba(0,0,0,0.2)] items-center justify-center w-8 h-16 group z-50 focus:outline-none"
        aria-label={isOpen ? "Close Builder" : "Open Builder"}
      >
        <div className="absolute inset-y-0 right-[-1px] w-[1px] bg-[#050912] z-10"></div>
        {isOpen ? (
            <ChevronRight size={20} className="group-hover:scale-110 transition-transform" />
        ) : (
            <ChevronLeft size={20} className="group-hover:scale-110 transition-transform" />
        )}
      </button>

      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-white/[0.02] flex-shrink-0 relative">
        {/* Mobile Drag Handle Visual */}
        <div className="md:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/10 rounded-full"></div>

        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 p-1.5 flex items-center justify-center">
               <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png" alt="logo" className="w-full h-full object-contain" />
            </div>
            <div>
                <span className="font-bold text-white tracking-wide block leading-none">Ditto Builder</span>
                <span className="text-[10px] text-purple-400 font-mono uppercase tracking-widest flex items-center gap-1">
                    AI Powered
                </span>
            </div>
        </div>
        
        {/* Mobile Close Button */}
        <button 
            onClick={onToggle}
            className="md:hidden p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
            aria-label="Close Panel"
        >
            <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                className={`max-w-[90%] rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm relative ${
                    msg.role === 'user' 
                    ? 'bg-purple-600 text-white rounded-br-none shadow-purple-900/20' 
                    : 'bg-[#0F1420] border border-white/5 text-slate-300 rounded-bl-none shadow-black/20 ml-10'
                }`}
                >
                    {/* Avatar for Model */}
                    {msg.role === 'model' && (
                        <div className="absolute -left-9 bottom-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                            <Sparkles size={10} className="text-purple-400" />
                        </div>
                    )}

                    {/* Content Rendering */}
                    {msg.text.split('```').map((part, i) => {
                        if (i % 2 === 1) return (
                            <div key={i} className="my-3 rounded-lg overflow-hidden border border-white/10 bg-[#050505]">
                                <div className="px-3 py-1.5 bg-white/5 border-b border-white/5 flex items-center gap-2">
                                    <Terminal size={12} className="text-slate-500" />
                                    <span className="text-[10px] text-slate-500 font-mono uppercase">Code Output</span>
                                </div>
                                <div className="p-3 text-xs font-mono text-purple-300 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                                    Generated Application Code...
                                </div>
                            </div>
                        );
                        // Render line breaks and markdown-style formatting
                        return <span key={i} className="whitespace-pre-wrap block" dangerouslySetInnerHTML={{ __html: part.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }}></span>;
                    })}
                </div>
            </div>
            
            {/* Suggested Actions (Only for model messages) */}
            {msg.role === 'model' && msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-3 pl-12 max-w-[90%] animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap size={10} className="text-purple-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quick Upgrades</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {msg.suggestions.map((suggestion, sIdx) => (
                            <button
                                key={sIdx}
                                onClick={() => handleSend(suggestion)}
                                disabled={isLoading}
                                className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs hover:bg-purple-500/20 hover:border-purple-500/40 hover:text-white transition-all text-left active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}
          </div>
        ))}
        
        {isLoading && (
            <div className="flex justify-start pl-9">
                <div className="bg-[#0F1420] border border-white/5 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5 ml-10">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-[#050912]/50 border-t border-white/5 backdrop-blur-md flex-shrink-0">
        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Build an app or paste a token CA..."
            className="w-full bg-[#0F1420] text-slate-200 border border-white/10 rounded-xl pl-5 pr-14 py-4 focus:outline-none focus:border-purple-500/40 focus:bg-[#131825] focus:ring-1 focus:ring-purple-500/20 resize-none h-[72px] scrollbar-hide transition-all text-sm placeholder:text-slate-600 shadow-inner"
          />
          <button 
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-3 p-3 text-purple-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-lg hover:bg-purple-600 shadow-lg shadow-purple-900/0 hover:shadow-purple-600/20"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-[10px] text-slate-600 font-medium">
                <span className="px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800">Return</span> to send
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-purple-500/50 uppercase tracking-widest font-bold">
                <Sparkles size={10} />
                Ditto 2.0
            </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPanel;