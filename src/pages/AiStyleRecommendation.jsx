import React, { useState, useRef } from 'react';
import { Camera, Sparkles, RefreshCw, Info, ScanFace, ChevronRight, X, Image as ImageIcon, Scissors, Droplets, Clock } from 'lucide-react';
import axios from 'axios';

const AiStyleRecommendation = () => {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setResult(null); 
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImage(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };



  const analyzeFace = async () => {
    if (!image) return;
    
    setAnalyzing(true);
    setResult(null);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_FRONTEND_URL}/api/ai/analyze-face`, {
        image: image
      });
      
      setResult({
        shape: response.data.shape,
        recommendations: response.data.recommendations
      });
    } catch (error) {
      console.error("Analysis failed", error);
      const errorMsg = error.response?.data?.message || error.message;
      alert("Analysis API Error: " + errorMsg);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-stone-50 dark:bg-neutral-950 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900 dark:bg-yellow-500/10 text-white dark:text-yellow-500 mb-6 border border-stone-800 dark:border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.15)] relative z-10">
            <Sparkles size={14} className="text-yellow-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Premium AI Stylist</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-stone-900 dark:text-white tracking-[0.1em] uppercase mb-4 relative z-10">
            Discover Your <span className="font-serif italic text-yellow-500 lowercase">Perfect</span> Look
          </h1>
          <p className="text-stone-500 dark:text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed relative z-10">
            Our advanced AI analyzes your facial geometry and features to curate bespoke, professional styling recommendations tailored exclusively to you.
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Prominent Image Upload / Display */}
          <div className="flex flex-col h-full min-h-[480px]">
            <div 
              className={`bg-white dark:bg-neutral-900/50 backdrop-blur-xl border-2 rounded-[1.5rem] overflow-hidden shadow-xl relative flex-grow flex flex-col transition-all duration-500 ${
                dragActive ? "border-yellow-500 scale-[1.02] shadow-[0_0_40px_rgba(234,179,8,0.2)] bg-yellow-500/5" : "border-stone-200 dark:border-white/10"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none"></div>

              {image ? (
                <div className="relative w-full h-full group">
                  <img src={image} alt="Uploaded face" className="w-full h-full object-cover absolute inset-0 z-0" />
                  
                  {/* Cancel / Remove Button */}
                  <button 
                    onClick={clearImage}
                    className="absolute top-6 right-6 z-30 bg-black/50 hover:bg-red-500 backdrop-blur-md text-white p-3 rounded-full transition-all shadow-lg border border-white/20 hover:border-red-500 hover:rotate-90 duration-300"
                    title="Remove Photo"
                  >
                    <X size={20} />
                  </button>

                  {/* Overlay Gradient & Controls */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-8">
                    <div className="flex justify-between items-center w-full">
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 px-6 py-2.5 rounded-full font-bold uppercase tracking-widest text-xs transition-all shadow-lg"
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>

                  {/* Scanning Animation while analyzing */}
                  {analyzing && (
                    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-[2rem]">
                      <div className="w-full h-full bg-black/40 backdrop-blur-sm mix-blend-overlay"></div>
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-yellow-500 shadow-[0_0_30px_4px_rgba(234,179,8,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-xl px-8 py-4 rounded-full border border-yellow-500/40 flex items-center gap-4 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                        <RefreshCw size={24} className="text-yellow-500 animate-spin" />
                        <span className="text-white font-bold uppercase tracking-[0.2em] text-xs">Analyzing Geometry...</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative z-10 flex flex-col items-center justify-center p-8 w-full h-full group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-24 h-24 bg-stone-50 dark:bg-white/5 border border-dashed border-stone-300 dark:border-white/20 rounded-full flex flex-col items-center justify-center mb-6 group-hover:bg-yellow-500/5 group-hover:border-yellow-500/50 group-hover:scale-110 transition-all duration-500 shadow-inner group-hover:shadow-[0_0_20px_rgba(234,179,8,0.1)]">
                    <Camera size={28} strokeWidth={1.5} className="text-stone-400 dark:text-gray-500 mb-1.5 group-hover:text-yellow-500 transition-colors duration-500" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-stone-500 dark:text-gray-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors duration-500">Browse</span>
                  </div>
                  
                  <h3 className="text-xl font-light tracking-wide text-stone-900 dark:text-white mb-3">Upload your photo</h3>
                  <p className="text-stone-500 dark:text-gray-400 text-xs max-w-xs text-center leading-relaxed">
                    Drag and drop an image here, or click to browse.
                  </p>
                </div>
              )}

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            
            {/* Primary Action Button */}
            {image && !result && !analyzing && (
              <div className="mt-6 flex justify-center animate-[fadeIn_0.5s_ease-out]">
                 <button 
                    onClick={analyzeFace}
                    className="w-full sm:w-auto bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 bg-[length:200%_auto] animate-[shimmerBg_2s_linear_infinite] text-black px-8 py-3 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] transition-all duration-300 shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:shadow-[0_0_25px_rgba(234,179,8,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-2 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Sparkles size={16} className="relative z-10" /> <span className="relative z-10">Generate Report</span>
                  </button>
              </div>
            )}
          </div>

          {/* Right Column: Detailed Recommendations Side Panel */}
          <div className="flex flex-col gap-6">
            
            <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-white/10 rounded-[1.5rem] p-6 shadow-xl flex flex-col h-full min-h-[480px] max-h-[600px] relative overflow-hidden">
               {/* Decorative Gradient */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 blur-[80px] -mr-10 -mt-10 rounded-full pointer-events-none"></div>

               <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-900 dark:text-white flex items-center gap-3 mb-6 border-b border-stone-100 dark:border-white/10 pb-4 relative z-10">
                 <div className="p-2 bg-stone-900 dark:bg-white/5 rounded-lg shadow-inner"><Sparkles size={16} className="text-yellow-500" /></div>
                 Consultation Report
               </h2>

               {!result && !analyzing ? (
                 <div className="flex-grow flex flex-col items-center justify-center py-8 text-center opacity-60">
                   <div className="w-20 h-20 bg-stone-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 border border-stone-200 dark:border-white/10 shadow-inner">
                     <ImageIcon size={24} strokeWidth={1} className="text-stone-400 dark:text-stone-600" />
                   </div>
                   <p className="text-[10px] text-stone-900 dark:text-white uppercase tracking-[0.2em] font-bold mb-2">Awaiting Subject</p>
                   <p className="text-[10px] text-stone-500 dark:text-gray-400 max-w-[180px] leading-relaxed">Upload a photo to generate your tailored style report.</p>
                 </div>
               ) : analyzing ? (
                 <div className="flex-grow flex flex-col items-center justify-center py-10 text-center">
                   <div className="w-20 h-20 relative flex items-center justify-center mb-8">
                     <div className="absolute inset-0 border-4 border-stone-100 dark:border-white/5 rounded-full"></div>
                     <div className="absolute inset-0 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(234,179,8,0.5)]"></div>
                     <Sparkles size={24} className="text-yellow-500 animate-pulse" />
                   </div>
                   <p className="text-[11px] text-stone-900 dark:text-white uppercase tracking-[0.2em] font-bold mb-3">Consulting AI Stylist</p>
                   <p className="text-xs text-stone-500 dark:text-gray-400 leading-relaxed max-w-[220px]">Mapping facial geometry and cross-referencing premium styling profiles...</p>
                 </div>
               ) : (
                 <div className="flex flex-col animate-[fadeIn_0.5s_ease-out] custom-scrollbar overflow-y-auto pr-3 -mr-3 relative z-10">
                   
                   {/* Face Shape Badge */}
                   <div className="bg-stone-900 dark:bg-black border border-stone-800 dark:border-white/10 rounded-xl p-5 mb-6 relative overflow-hidden shadow-xl group">
                     <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-50 pointer-events-none"></div>
                     <div className="relative z-10 flex items-center justify-between">
                       <div>
                         <p className="text-[8px] text-stone-400 uppercase tracking-[0.2em] font-bold mb-1">Detected Structure</p>
                         <h3 className="text-2xl font-light text-white tracking-widest uppercase flex items-center gap-2">
                           {result.shape} <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]"></span>
                         </h3>
                       </div>
                       <ScanFace size={32} strokeWidth={1} className="text-stone-700 dark:text-white/10 group-hover:text-yellow-500/30 transition-colors duration-500" />
                     </div>
                   </div>

                   <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-500 dark:text-gray-400 mb-4 flex items-center gap-1.5">
                     Curated Matches <ChevronRight size={12} className="text-yellow-500" />
                   </h3>

                   {/* Detailed Box-Style UI Recommendations */}
                   <div className="flex flex-col gap-6">
                     {result.recommendations && result.recommendations.length > 0 ? (
                       result.recommendations.map((style, idx) => (
                         <div key={style.id || idx} style={{ animationDelay: `${idx * 150}ms` }} className="animate-[fadeInUp_0.5s_ease-out_both] bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-2xl hover:border-yellow-500/50 transition-all duration-500 flex flex-col gap-4 relative overflow-hidden group">
                           
                           {/* Hover Gradient Overlay */}
                           <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                           <div className="flex gap-4 relative z-10">
                             <div className="flex flex-col justify-center flex-grow">
                               <div className="flex justify-between items-start mb-1.5">
                                 <h4 className="font-bold text-stone-900 dark:text-white text-sm tracking-wide">{style.name}</h4>
                                 
                                 {/* Simulated AI Confidence Score */}
                                 <div className="flex flex-col items-end gap-0.5">
                                   <span className="text-[7px] font-bold uppercase tracking-widest text-yellow-600 dark:text-yellow-500">AI Match</span>
                                   <div className="flex gap-[1px]">
                                     {[...Array(5)].map((_, i) => (
                                       <div key={i} className={`w-1 h-1 rounded-full ${i < 4 ? 'bg-yellow-500' : 'bg-stone-200 dark:bg-white/10'}`}></div>
                                     ))}
                                   </div>
                                 </div>
                               </div>
                               
                               {/* Badges for Hair Type and Maintenance */}
                               <div className="flex flex-wrap gap-2 mt-1">
                                 {style.bestHairType && (
                                   <span className="inline-flex items-center gap-1.5 bg-stone-50 dark:bg-black/50 text-stone-600 dark:text-gray-300 px-2.5 py-1.5 rounded-md text-[9px] uppercase tracking-widest font-bold border border-stone-200 dark:border-white/5">
                                     <Scissors size={12} className="text-yellow-500" /> {style.bestHairType}
                                   </span>
                                 )}
                                 {style.maintenance && (
                                   <span className="inline-flex items-center gap-1.5 bg-stone-50 dark:bg-black/50 text-stone-600 dark:text-gray-300 px-2.5 py-1.5 rounded-md text-[9px] uppercase tracking-widest font-bold border border-stone-200 dark:border-white/5">
                                     <Clock size={12} className="text-yellow-500" /> {style.maintenance} Maint.
                                   </span>
                                 )}
                               </div>
                             </div>
                           </div>
                           
                           {/* Detailed Description */}
                           <div className="pt-4 border-t border-stone-100 dark:border-white/5 relative z-10">
                             <p className="text-xs text-stone-600 dark:text-gray-400 leading-relaxed mb-4">
                               {style.desc}
                             </p>
                             
                             {/* Styling Tip Box */}
                             {style.stylingTips && (
                               <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3 items-start relative overflow-hidden">
                                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500 rounded-l-xl"></div>
                                 <Droplets size={16} className="text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
                                 <div className="flex flex-col">
                                   <span className="text-[10px] font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-widest mb-1">Stylist Tip</span>
                                   <span className="text-xs text-stone-700 dark:text-gray-300 leading-relaxed">{style.stylingTips}</span>
                                 </div>
                               </div>
                             )}
                           </div>
                         </div>
                       ))
                     ) : (
                       <div className="p-8 bg-stone-50 dark:bg-white/5 rounded-2xl border border-dashed border-stone-300 dark:border-white/10 text-center">
                         <Info size={28} className="mx-auto text-stone-400 mb-3" />
                         <p className="text-xs text-stone-600 dark:text-gray-400 font-bold uppercase tracking-widest">No precise matches found.</p>
                       </div>
                     )}
                   </div>

                 </div>
               )}
            </div>

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmerBg {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(234, 179, 8, 0.3);
          border-radius: 20px;
        }
      `}} />
    </div>
  );
};

export default AiStyleRecommendation;
