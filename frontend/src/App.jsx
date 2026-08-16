import React from "react";
import ComplaintForm from "./features/complaints/components/ComplaintForm";
import { Activity, ShieldCheck } from "lucide-react";

export default function App() {
  return (
    <div className="relative min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-zinc-100 overflow-x-hidden">
      {/* Background Subtle Dot Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none z-0" />

      {/* Top System App Bar */}
      <header className="relative z-20 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-sm px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200">
            <Activity className="h-4 w-4 text-accent-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-zinc-100">SignalCX</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">
                v2.4 Core
              </span>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 px-2.5 py-1 rounded-md bg-zinc-900/60 border border-zinc-800/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>RAG Engine Online</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-3 sm:p-6">
        <ComplaintForm />
      </main>

      {/* Footer System Telemetry */}
      <footer className="relative z-10 w-full border-t border-zinc-900 bg-zinc-950/60 px-4 sm:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-500 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" />
          <span>Multi-Agent Diagnostic & Automated Resolution Assistant</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Vector Retriever: ChromaDB</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">Inference: Groq LPU</span>
        </div>
      </footer>
    </div>
  );
}