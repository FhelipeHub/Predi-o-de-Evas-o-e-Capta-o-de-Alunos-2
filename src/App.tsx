import React, { useState } from 'react';
import SimulatorView from './components/SimulatorView';
import GeoMappingView from './components/GeoMappingView';
import FinanceView from './components/FinanceView';
import { 
  Cpu, 
  MapPin, 
  CircleDollarSign, 
  Sparkles,
  Info,
  TrendingDown,
  Building
} from 'lucide-react';

type TabType = "simulator" | "geo" | "finance";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("simulator");

  // Global Quick facts for educational context
  const quickFacts = [
    { label: "Taxa média de evasão no Br", value: "26%", icon: TrendingDown, color: "text-rose-450" },
    { label: "Custo relativo de atração", value: "3x mais", icon: Building, color: "text-amber-450" },
    { label: "Acurácia Média dos Modelos", value: "+94%", icon: Sparkles, color: "text-emerald-450" }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-between selection:bg-[#00F5A0]/30 selection:text-white">
      
      {/* Dynamic Background Glow Vectors */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-10 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto p-4 md:p-8 z-10 flex-grow space-y-8">
        
        {/* Elite Brand Header */}
        <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-slate-900 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-bold">
                PLATAFORMA INTEGRADA DE INTELIGÊNCIA EDUCACIONAL
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter flex items-center gap-3">
              Evasão & Captação Inteligente
            </h1>
            <p className="text-sm text-slate-400 font-light max-w-xl leading-relaxed">
              Solução modular estratégica unindo Big Data e Inteligência Artificial para prevenção preditiva de abandono escolar e calibragem cirúrgica de prospecção.
            </p>
          </div>

          {/* Quick Context Stats panel */}
          <div className="flex flex-wrap gap-4">
            {quickFacts.map((fact, fIdx) => {
              const Icon = fact.icon;
              return (
                <div 
                  key={fIdx} 
                  className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3 px-4 flex items-center gap-3"
                >
                  <div className="p-2 bg-[#091126] rounded-lg">
                    <Icon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block uppercase tracking-wider">{fact.label}</span>
                    <span className="text-sm font-extrabold font-mono text-white">{fact.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </header>

        {/* Modular Navigation Bar */}
        <nav className="bg-[#091126] p-1.5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-1">
          {/* Simulator Tab */}
          <button
            onClick={() => setActiveTab("simulator")}
            className={`flex-1 py-3 px-4 rounded-xl font-medium text-xs transition-all cursor-pointer flex items-center justify-center gap-2 tracking-wide uppercase ${
              activeTab === "simulator"
                ? "bg-slate-900 text-white border border-slate-800 font-bold shadow-lg text-[#00F5A0]"
                : "text-slate-400 hover:text-white hover:bg-slate-900/40"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>1. Simulador de Evasão</span>
          </button>

          {/* Geo mapping Tab */}
          <button
            onClick={() => setActiveTab("geo")}
            className={`flex-1 py-3 px-4 rounded-xl font-medium text-xs transition-all cursor-pointer flex items-center justify-center gap-2 tracking-wide uppercase ${
              activeTab === "geo"
                ? "bg-slate-900 text-white border border-slate-800 font-bold shadow-lg text-[#00F5A0]"
                : "text-slate-400 hover:text-white hover:bg-slate-900/40"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>2. Mapa de Calor (Geo)</span>
          </button>

          {/* Budget & ROI Tab */}
          <button
            onClick={() => setActiveTab("finance")}
            className={`flex-1 py-3 px-4 rounded-xl font-medium text-xs transition-all cursor-pointer flex items-center justify-center gap-2 tracking-wide uppercase ${
              activeTab === "finance"
                ? "bg-slate-900 text-white border border-slate-800 font-bold shadow-lg text-[#00F5A0]"
                : "text-slate-400 hover:text-white hover:bg-slate-900/40"
            }`}
          >
            <CircleDollarSign className="w-4 h-4" />
            <span>3. Planejador Financeiro (ROI)</span>
          </button>
        </nav>

        {/* Tab content switch container */}
        <main className="relative mt-2">
          {activeTab === "simulator" ? (
            <SimulatorView />
          ) : activeTab === "geo" ? (
            <GeoMappingView />
          ) : (
            <FinanceView />
          )}
        </main>

        {/* Dynamic footer with citations of Brazilian education sector insights */}
        <footer className="mt-12 p-6 bg-slate-950/40 border border-slate-900/80 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-slate-500">
            <Info className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Baseado no Planejamento Estratégico de BI e Machine Learning para Instituições Privadas do Brasil, 2026.
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-600">
            <span>🛡️ Totalmente em conformidade com as regras da LGPD</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
