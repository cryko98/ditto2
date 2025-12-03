import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Sparkles, Download, Copy, Upload, Loader2, Trash2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface MemeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Custom X Logo Component
const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
  </svg>
);

const MemeGeneratorModal: React.FC<MemeGeneratorModalProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [referenceMimeType, setReferenceMimeType] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [tweetText, setTweetText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<'idle' | 'image' | 'tweet'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Extract base64 data and mime type
        const base64Data = result.split(',')[1];
        setReferenceImage(base64Data);
        setReferenceMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReferenceImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReferenceImage(null);
    setReferenceMimeType('');
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const generateMeme = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setLoadingStep('image');
    setGeneratedImage(null);
    setTweetText('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // 1. Generate Image
      const parts: any[] = [];
      
      // Add reference image if exists
      if (referenceImage) {
        parts.push({
          inlineData: {
            data: referenceImage,
            mimeType: referenceMimeType
          }
        });
      }

      // STRICT DITTO DESCRIPTION - CARTOON STYLE
      const dittoFeatures = "the official Pokémon Ditto in a 2D cartoon style. Appearance: A completely amorphous, jelly-like, gelatinous blob character. Its substance is semi-liquid and soft. IMPORTANT: Its outline and silhouette must be wavy, undulating, and irregular, reflecting its jelly state, looking squishy and fluid. Color: Light purple (magenta-pink). Body shape: An irregular blob with a wavy contour, two stubby nub-like arms extending from the sides, and two soft bumps on top of the head. Face: EXTREMELY simple iconic face with two small round black dot eyes and a simple line mouth. No nose, no ears.";
      
      const styleInstruction = "Art style: Pokémon cartoon/anime style. 2D cel-shaded illustration, clean outlines, vibrant colors. The drawing should look like a frame from the official Pokémon animated series. NOT a 3D render, NOT realistic.";

      // Construct Prompt ensuring Ditto is the main character
      const finalPrompt = referenceImage 
        ? `Generate an image of ${dittoFeatures} interacting with the character or object in the attached reference image. Scene description: ${prompt}. ${styleInstruction} CRITICAL: Ensure Ditto looks exactly like the description: a shiny light-purple jelly blob with a wavy outline and dot eyes.`
        : `Generate an image of ${dittoFeatures} doing the following activity: ${prompt}. ${styleInstruction} CRITICAL: Ensure Ditto looks exactly like the description: a shiny light-purple jelly blob with a wavy outline and dot eyes.`;

      parts.push({ text: finalPrompt });

      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: parts },
      });

      // Extract image from response
      let imageUrl = null;
      if (imageResponse.candidates && imageResponse.candidates[0].content.parts) {
        for (const part of imageResponse.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (!imageUrl) throw new Error("No image generated");
      setGeneratedImage(imageUrl);

      // 2. Generate Tweet (Solana/Crypto Style)
      setLoadingStep('tweet');
      const tweetResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write a hype tweet for a Solana memecoin represented by the character Ditto. 
        Context: The image shows Ditto doing: "${prompt}". 
        Style: Crypto Twitter (CT), "degen" culture, high energy, informal, funny.
        Mandatory Slang: Use terms like "LFG", "WAGMI", "Moon", "Ape in", "Based", "Jeet", "Diamond Hands" or "$SOL" where appropriate.
        Max 280 chars. 
        Hashtags: $DITTO #Solana #Memecoin`,
      });

      setTweetText(tweetResponse.text || "LFG! $DITTO is going to the moon! 🚀 #Solana");

    } catch (error) {
      console.error("Error generating meme:", error);
      alert("Failed to generate meme. Please try again.");
    } finally {
      setIsLoading(false);
      setLoadingStep('idle');
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = 'ditto-meme.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyImageToClipboard = async () => {
    if (!generatedImage) return;
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      alert("Image copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const postToTwitter = () => {
    const text = encodeURIComponent(tweetText);
    // x.com intent URL
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0F1420] border border-purple-500/20 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
        >
            <X size={20} />
        </button>

        {/* Left Side: Controls */}
        <div className="w-full md:w-1/3 p-6 border-b md:border-b-0 md:border-r border-white/5 bg-[#0B0F19] overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 p-2 flex items-center justify-center">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png" alt="logo" className="w-full h-full object-contain" />
                </div>
                <h2 className="text-xl font-bold text-white">Meme Gen</h2>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Prompt</label>
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="E.g., Ditto holding a bag of money on the moon..."
                        className="w-full bg-[#050912] border border-white/10 rounded-xl p-4 text-sm text-white focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 outline-none resize-none h-28"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Reference Image (Optional)</label>
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#050912] group relative ${referenceImage ? 'border-purple-500/50' : 'border-white/10 hover:border-purple-500/40'}`}
                    >
                        {referenceImage ? (
                            <div className="relative w-full h-32 group/image">
                                <img src={`data:${referenceMimeType};base64,${referenceImage}`} className="w-full h-full object-contain rounded-lg" alt="Reference" />
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity rounded-lg">
                                    <span className="text-xs text-white">Click to change</span>
                                </div>
                                <button 
                                    onClick={removeReferenceImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors z-10"
                                    title="Remove image"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <Upload size={24} className="text-slate-500 mb-2 group-hover:text-purple-400 transition-colors" />
                                <span className="text-xs text-slate-500 text-center">Click to upload<br/>character/scene</span>
                            </>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            className="hidden" 
                            accept="image/*"
                        />
                    </div>
                </div>

                <button 
                    onClick={generateMeme}
                    disabled={isLoading || !prompt.trim()}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-purple-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>{loadingStep === 'image' ? 'Painting Ditto...' : 'Cooking Tweet...'}</span>
                        </>
                    ) : (
                        <>
                            <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                            <span>Generate Meme</span>
                        </>
                    )}
                </button>
            </div>
        </div>

        {/* Right Side: Preview */}
        <div className="w-full md:w-2/3 bg-[#020617] relative flex flex-col">
            <div className="flex-1 flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617]">
                {generatedImage ? (
                    <div className="relative group max-w-full max-h-full">
                        <img 
                            src={generatedImage} 
                            alt="Generated Meme" 
                            className="max-w-full max-h-[50vh] md:max-h-[60vh] rounded-xl shadow-2xl shadow-purple-900/20 border border-white/10" 
                        />
                        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={copyImageToClipboard} className="p-2 bg-black/60 backdrop-blur hover:bg-white text-white hover:text-black rounded-lg transition-colors border border-white/10" title="Copy to clipboard">
                                <Copy size={18} />
                            </button>
                            <button onClick={downloadImage} className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors shadow-lg" title="Download Image">
                                <Download size={18} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center opacity-30 select-none">
                        <div className="w-32 h-32 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <ImageIcon size={48} />
                        </div>
                        <p className="text-lg font-medium">Your masterpiece awaits</p>
                    </div>
                )}
            </div>

            {/* Tweet Section */}
            {generatedImage && (
                <div className="p-6 bg-[#0B0F19] border-t border-white/5">
                    <div className="flex items-start gap-4 max-w-2xl mx-auto">
                        <div className="flex-1">
                            <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">X Post Draft</label>
                            <textarea 
                                value={tweetText}
                                onChange={(e) => setTweetText(e.target.value)}
                                className="w-full bg-[#050912] text-slate-200 text-sm border border-white/10 rounded-lg p-3 focus:border-blue-500/50 outline-none resize-none h-20"
                            />
                             <p className="text-[10px] text-orange-400 mt-2 flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-orange-400"></span>
                                Note: You must manually attach the saved image on X.
                            </p>
                        </div>
                        <button 
                            onClick={postToTwitter}
                            className="bg-black hover:bg-slate-900 text-white p-4 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-2 min-w-[80px] border border-white/10"
                        >
                            <XLogo className="w-5 h-5" />
                            <span className="text-[10px] font-bold">Post</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MemeGeneratorModal;