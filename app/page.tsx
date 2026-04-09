"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { 
  Upload, 
  AlertTriangle, 
  Flame, 
  Mountain, 
  Activity, 
  Building2,
  RefreshCw,
  ChevronRight,
  ShieldAlert,
  Cpu,
  Database,
  Settings2
} from "lucide-react";

type DisasterType = 'Earthquake' | 'Wildfire' | 'Landslide' | 'Urbanfire' | 'Unknown';

interface AnalysisResult {
  type: DisasterType;
  confidence: string;
  description: string;
  severity: 'Low' | 'Moderate' | 'High' | 'Extreme';
  modelUsed: string;
  engine: string;
}

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Inference failed');
      }

      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Model inference failed. Ensure your .pth files are in /models/");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  const getIcon = (type: DisasterType) => {
    switch (type) {
      case 'Earthquake': return <Activity className="w-12 h-12 text-blue-400" />;
      case 'Wildfire': return <Flame className="w-12 h-12 text-orange-500" />;
      case 'Landslide': return <Mountain className="w-12 h-12 text-amber-600" />;
      case 'Urbanfire': return <Building2 className="w-12 h-12 text-red-500" />;
      default: return <AlertTriangle className="w-12 h-12 text-zinc-400" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-950 selection:bg-red-500/30">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-red-500/10 blur-[120px] -z-10 rounded-full" />

      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium mb-4">
          <ShieldAlert className="w-3.5 h-3.5" />
          LOCAL DISASTER RESPONSE SYSTEM
        </div>
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Disaster<span className="gradient-text">Detect</span>
        </h1>
        <div className="flex items-center justify-center gap-6 text-zinc-500 text-sm font-mono">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-green-500" />
            <span>MODELS: 4 PTH LOADED</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-500" />
            <span>MULTI-MODEL CONSENSUS ACTIVE</span>
          </div>
        </div>
      </motion.header>

      <main className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar: System Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-6 text-zinc-300 font-bold uppercase tracking-wider text-xs">
              <Settings2 className="w-4 h-4" />
              Inference Pipeline
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-medium text-zinc-300">earthquake.pth</span>
                </div>
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-blue-500/50" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-medium text-zinc-300">wildfire.pth</span>
                </div>
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-orange-500/50" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <Mountain className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-medium text-zinc-300">landslide.pth</span>
                </div>
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-amber-600/50" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-medium text-zinc-300">urbanfire.pth</span>
                </div>
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-red-500/50" />
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-zinc-900 border border-white/5 text-[10px] text-zinc-500 leading-relaxed">
              <p className="font-bold text-zinc-400 mb-1 uppercase tracking-widest">Pipeline Logic</p>
              The system executes all three models in parallel and selects the classification with the highest statistical confidence.
            </div>
          </div>
        </div>

        {/* Main Content: Upload & Results */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {!image ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                onClick={() => fileInputRef.current?.click()}
                className="glass rounded-3xl p-12 border-dashed border-2 border-zinc-800 hover:border-red-500/50 transition-all cursor-pointer group relative overflow-hidden h-full flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex flex-col items-center gap-6 relative z-10">
                  <div className="w-24 h-24 rounded-3xl bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                    <Upload className="w-12 h-12 text-zinc-500 group-hover:text-red-400 transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold mb-2">Input Disaster Image</p>
                    <p className="text-zinc-500">The system will run consensus analysis across all local models</p>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-3xl overflow-hidden"
              >
                <div className="relative aspect-video bg-zinc-900">
                  <img 
                    src={image} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {!result && !isAnalyzing && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                      <button 
                        onClick={analyzeImage}
                        className="px-10 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl flex items-center gap-3 shadow-2xl shadow-red-900/40 transition-all active:scale-95"
                      >
                        <Cpu className="w-5 h-5" />
                        Run Consensus Analysis
                      </button>
                    </div>
                  )}
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-md">
                      <div className="relative">
                        <RefreshCw className="w-16 h-16 text-red-500 animate-spin mb-6" />
                      </div>
                      <p className="text-xl font-bold tracking-widest uppercase text-white">Executing Multi-Model Pipeline...</p>
                      <p className="text-zinc-500 text-sm mt-2 font-mono">Running Earthquake, Wildfire, Landslide, and Urbanfire models...</p>
                    </div>
                  )}
                </div>

                {result && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 border-t border-white/10"
                  >
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center gap-5">
                        <div className="p-5 rounded-3xl bg-zinc-900 border border-white/5 shadow-inner">
                          {getIcon(result.type)}
                        </div>
                        <div>
                          <h2 className="text-4xl font-black tracking-tighter">{result.type}</h2>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-zinc-400 text-sm font-mono uppercase tracking-wider">Engine: {result.engine}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-1">Highest Confidence Model</div>
                        <div className="font-mono text-sm text-red-400">{result.modelUsed}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5">
                        <div className="text-[10px] font-bold text-zinc-600 uppercase mb-1">Peak Confidence</div>
                        <div className="text-2xl font-mono font-bold text-green-500">{result.confidence}</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5">
                        <div className="text-[10px] font-bold text-zinc-600 uppercase mb-1">Severity Rating</div>
                        <div className={`text-2xl font-bold ${
                          result.severity === 'Extreme' ? 'text-red-500' :
                          result.severity === 'High' ? 'text-orange-500' :
                          'text-zinc-400'
                        }`}>{result.severity}</div>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-zinc-900 border border-white/5 mb-8">
                      <p className="text-zinc-300 leading-relaxed">
                        {result.description}
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        onClick={reset}
                        className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Clear Cache
                      </button>
                      <button className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/20">
                        Export Data
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <div className="p-6 bg-red-500/10 border-t border-red-500/20 text-red-400 text-center flex items-center justify-center gap-3">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">{error}</span>
                    <button onClick={reset} className="ml-4 underline font-bold">Retry</button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="mt-12 py-8 text-zinc-600 text-[10px] font-mono uppercase tracking-[0.4em] flex items-center gap-4">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Consensus Engine Active // Cross-referencing wildfire, earthquake, landslide, urbanfire
      </footer>
    </div>
  );
}