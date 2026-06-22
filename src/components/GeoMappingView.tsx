import React, { useState } from 'react';
import { METRO_REGIONS, runRegionalAcquisitionModel } from '../data/slidesAndSimData';
import { MapRegion } from '../types';
import { REAL_RJ_GEOGRAPHIC_REGIONS } from '../data/rjRegionsGeo';
import { 
  Map, 
  MapPin, 
  Info, 
  TrendingUp, 
  Flame, 
  Eye, 
  Compass,
  DollarSign, 
  Users,
  Target
} from 'lucide-react';

export default function GeoMappingView() {
  const [selectedRegionId, setSelectedRegionId] = useState<string>("reg-metropolitana"); // default on Metropolitana (highest potential)
  const [isHeatMapActive, setIsHeatMapActive] = useState<boolean>(true);

  const selectedRegion = METRO_REGIONS.find(r => r.id === selectedRegionId) || METRO_REGIONS[0];
  const analysis = runRegionalAcquisitionModel(selectedRegion);

  const handleRegionClick = (id: string) => {
    setSelectedRegionId(id);
  };

  // Helper colors for score priorities
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Urgente": return "bg-[#d946ef]/10 text-[#f472b6] border-[#d946ef]/30 shadow-[#d946ef]/10 shadow-sm";
      case "Alto": return "bg-[#10b981]/10 text-emerald-300 border-[#10b981]/30 shadow-[#10b981]/10 shadow-sm";
      case "Moderado": return "bg-[#eab308]/10 text-amber-300 border-[#eab308]/30 shadow-[#eab308]/10 shadow-sm";
      default: return "bg-[#3b82f6]/10 text-blue-300 border-[#3b82f6]/30 shadow-[#3b82f6]/10 shadow-sm";
    }
  };

  // Region shape style generator with specific focus on custom border glow effects
  const getRegionStyle = (regionId: string) => {
    const r = METRO_REGIONS.find(reg => reg.id === regionId);
    if (!r) {
      return {
        className: "fill-slate-800/40 stroke-slate-700",
        style: {}
      };
    }

    const isSelected = regionId === selectedRegionId;
    if (isHeatMapActive) {
      const scoreData = runRegionalAcquisitionModel(r);
      if (scoreData.score > 80) {
        // Roxo/Rosa = risco crítico / prioridade urgente
        return {
          className: isSelected 
            ? "fill-[#d946ef]/20 stroke-[#f472b6] stroke-[3.5]" 
            : "fill-[#d946ef]/10 hover:fill-[#d946ef]/15 stroke-[#d946ef] stroke-[1.5]",
          style: {
            filter: "drop-shadow(0 0 6px rgba(244, 114, 182, 0.75))"
          }
        };
      } else if (scoreData.score > 60) {
        // Verde Neon = alto potencial
        return {
          className: isSelected 
            ? "fill-[#10b981]/20 stroke-[#34d399] stroke-[3.5]" 
            : "fill-[#10b981]/10 hover:fill-[#10b981]/15 stroke-[#10b981] stroke-[1.5]",
          style: {
            filter: "drop-shadow(0 0 6px rgba(52, 211, 153, 0.75))"
          }
        };
      } else if (scoreData.score > 40) {
        // Amarelo/Cobre = moderado
        return {
          className: isSelected 
            ? "fill-[#eab308]/20 stroke-[#fbbf24] stroke-[3.5]" 
            : "fill-[#eab308]/10 hover:fill-[#eab308]/15 stroke-[#eab308] stroke-[1.5]",
          style: {
            filter: "drop-shadow(0 0 6px rgba(251, 191, 36, 0.75))"
          }
        };
      } else {
        // Azul = baixa densidade
        return {
          className: isSelected 
            ? "fill-[#3b82f6]/20 stroke-[#60a5fa] stroke-[3.5]" 
            : "fill-[#3b82f6]/10 hover:fill-[#3b82f6]/15 stroke-[#3b82f6] stroke-[1.5]",
          style: {
            filter: "drop-shadow(0 0 6px rgba(96, 165, 250, 0.75))"
          }
        };
      }
    } else {
      // Normal flat selection theme
      return {
        className: isSelected 
          ? "fill-emerald-500/15 stroke-emerald-400 stroke-[3]" 
          : "fill-slate-900/40 hover:fill-slate-800/40 stroke-slate-700 stroke-[1.5]",
        style: isSelected ? { filter: "drop-shadow(0 0 8px rgba(52, 211, 153, 0.6))" } : {}
      };
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Interactive Metropole Map Column */}
      <div className="lg:col-span-6 bg-[#070e1e]/60 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white uppercase tracking-tight">
                Mapa de Calor & Demografia
              </h2>
            </div>

            {/* Heat map toggle */}
            <button
              onClick={() => setIsHeatMapActive(!isHeatMapActive)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 font-mono ${
                isHeatMapActive 
                  ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' 
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${isHeatMapActive ? 'text-rose-400 animate-pulse' : 'text-slate-500'}`} />
              <span>{isHeatMapActive ? "MAPA DE CALOR: ATIVO" : "MAPA DE CALOR: DESATIVADO"}</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Clique diretamente nas mesorregiões do estado do Rio de Janeiro no mapa abaixo para analisar o potencial demográfico de captação de novos estudantes.
          </p>

          {/* Map Area visualization */}
          <div className="bg-slate-950/80 rounded-xl border border-slate-900 p-4 relative flex items-center justify-center min-h-[340px]">
            {/* Map Legends for heat indices */}
            {isHeatMapActive && (
              <div className="absolute top-3 left-3 bg-slate-900/95 border border-slate-800 p-2.5 rounded-lg text-[9px] font-mono space-y-1 z-10 shadow-lg backdrop-blur-sm">
                <p className="font-bold text-slate-300 border-b border-slate-800 pb-1 mb-1">🔥 Legenda de Potencial:</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#d946ef]/30 border border-[#f472b6] shadow-[0_0_4px_rgba(217,70,239,0.5)]" />
                  <span>Roxo / Rosa (Foco Crítico)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#10b981]/30 border border-[#34d399] shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
                  <span>Verde Neon (Alto Potencial)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#eab308]/25 border border-[#fbbf24] shadow-[0_0_4px_rgba(234,179,8,0.5)]" />
                  <span>Amarelo / Cobre (Moderado)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#3b82f6]/20 border border-[#60a5fa] shadow-[0_0_4px_rgba(59,130,246,0.5)]" />
                  <span>Azul (Baixa Densidade)</span>
                </div>
              </div>
            )}

            {/* Metropole Metro SVG Outline shapes - REAL GEOGRAPHIC PLANNING REGIONS */}
            <svg viewBox="0 0 960 540" className="w-full max-w-full lg:max-w-[620px] h-auto drop-shadow-2xl" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <filter id="neon-glow-urgente" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="neon-glow-alto" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="neon-glow-moderado" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="neon-glow-baixo" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {REAL_RJ_GEOGRAPHIC_REGIONS.map((geoReg) => {
                const reg = METRO_REGIONS.find((r) => r.id === geoReg.id) || METRO_REGIONS[0];
                const isSelected = geoReg.id === selectedRegionId;
                const rStyle = getRegionStyle(geoReg.id);

                // Determine matching map neon glow filter to boost glowing neon borders effect
                let neonFilter = "";
                if (isSelected) {
                  if (isHeatMapActive) {
                    const scoreData = runRegionalAcquisitionModel(reg);
                    if (scoreData.score > 80) neonFilter = "url(#neon-glow-urgente)";
                    else if (scoreData.score > 60) neonFilter = "url(#neon-glow-alto)";
                    else if (scoreData.score > 40) neonFilter = "url(#neon-glow-moderado)";
                    else neonFilter = "url(#neon-glow-baixo)";
                  } else {
                    neonFilter = "url(#neon-glow-alto)";
                  }
                }

                return (
                  <g 
                    key={geoReg.id} 
                    className="cursor-pointer group/region" 
                    onClick={() => handleRegionClick(geoReg.id)}
                  >
                    {/* Render exact geographical paths of the region including multipolygons & islands */}
                    {geoReg.paths.map((pathStr, pIdx) => (
                      <path
                        key={pIdx}
                        d={pathStr}
                        className={`transition-all duration-300 ${rStyle.className}`}
                        style={{
                          ...rStyle.style,
                          filter: neonFilter || rStyle.style?.filter,
                        }}
                      />
                    ))}
                    
                    {/* Region name overlay with high-contrast drop-shadow, placed above center label coordinates */}
                    <text
                      x={geoReg.labelsX}
                      y={geoReg.labelsY - 14}
                      className="fill-slate-100 font-sans text-[10px] select-none pointer-events-none drop-shadow-[0_1.5px_2px_rgba(0,0,0,1)] transition-all group-hover/region:fill-[#00F5A0] font-extrabold"
                      textAnchor="middle"
                    >
                      {geoReg.name === "Centro Fluminense (Centro-Sul)" ? "Centro Fluminense" : geoReg.name}
                    </text>

                    {/* Accurate planning coordinates center pin */}
                    <circle 
                      cx={geoReg.labelsX} 
                      cy={geoReg.labelsY} 
                      r={isSelected ? 6 : 4} 
                      className={`transition-all duration-300 ${isSelected ? 'fill-white animate-ping' : 'fill-slate-400/80'}`}
                    />
                    <circle 
                      cx={geoReg.labelsX} 
                      cy={geoReg.labelsY} 
                      r={isSelected ? 3.5 : 2} 
                      className={`transition-all duration-300 ${isSelected ? 'fill-emerald-400' : 'fill-slate-950'}`}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Click assistance tag */}
            <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-500 flex items-center gap-1">
              <Compass className="w-3 h-3 text-slate-500" />
              <span>Mapa de Calor: Rio de Janeiro</span>
            </div>
          </div>
        </div>

        {/* Quick regions selector buttons list */}
        <div className="mt-4 pt-4 border-t border-slate-900">
          <label className="block text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase mb-2">
            📍 Selecionar Região via Menu:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {METRO_REGIONS.map((reg) => (
              <button
                key={reg.id}
                onClick={() => setSelectedRegionId(reg.id)}
                className={`text-[10px] px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  reg.id === selectedRegionId 
                    ? 'bg-emerald-500 text-black border-emerald-400 font-extrabold shadow-md shadow-emerald-500/10' 
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {reg.name.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Region Analysis Output */}
      <div className="lg:col-span-6 flex flex-col gap-6">

        {/* Big Dashboard Score */}
        <div className="bg-[#070e1e]/60 border border-slate-800 p-6 rounded-2xl">
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full block w-max uppercase tracking-widest font-bold mb-2">
                Zona de Prospecção
              </span>
              <h3 className="text-xl font-bold text-white leading-tight">
                {selectedRegion.name}
              </h3>
            </div>
            
            <div className="text-right">
              <p className="text-[10px] font-mono text-slate-500 uppercase">Score Regional</p>
              <span className="text-3xl font-black font-mono tracking-tight text-[#00F5A0] block">
                {analysis.score} <span className="text-xs text-slate-400">/100</span>
              </span>
            </div>
          </div>

          {/* Quick Demographics metrics cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            
            {/* Density */}
            <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl">
              <p className="text-[9px] font-mono text-slate-500 uppercase">Densidade</p>
              <span className="text-sm font-bold text-slate-200 block mt-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> {selectedRegion.populationDensity}
              </span>
            </div>

            {/* Income */}
            <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl">
              <p className="text-[9px] font-mono text-slate-500 uppercase">Renda Média</p>
              <span className="text-sm font-bold text-slate-200 block mt-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> R$ {selectedRegion.avgIncome.toLocaleString()}
              </span>
            </div>

            {/* Competitor Index */}
            <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl">
              <p className="text-[9px] font-mono text-slate-500 uppercase">Concorrentes</p>
              <span className="text-sm font-bold text-slate-200 block mt-1 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-purple-400 shrink-0" /> {selectedRegion.competitorIndex} / 10
              </span>
            </div>

            {/* Target Age pool */}
            <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl">
              <p className="text-[9px] font-mono text-slate-500 uppercase">Jovens (15-24 anos)</p>
              <span className="text-sm font-bold text-slate-200 block mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-rose-400 shrink-0" /> {selectedRegion.targetAgePercentage}%
              </span>
            </div>

          </div>
        </div>

        {/* Priority and Action Recommendation Card */}
        <div className="bg-[#070e1e]/60 border border-slate-800 p-6 rounded-2xl flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-950/40 pb-3">
              <h4 className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
                🎯 Diretriz Estratégica de Expansão
              </h4>
              <div className={`text-xs px-2.5 py-0.5 rounded border ${getPriorityBadge(analysis.priority)} font-bold`}>
                Prioridade: {analysis.priority}
              </div>
            </div>

            <div className="space-y-4">
              
              {/* Est. Enrolments helper */}
              <div className="p-4 bg-[#10b981]/5 border border-[#10b981]/15 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center shrink-0">
                  <span className="text-emerald-400 font-bold font-mono text-lg">+{analysis.estimatedEnrolments}</span>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-200">Projeção Estimada de Matrículas</h5>
                  <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                    Novos alunos convertidos no primeiro semestre preventivo executado com marketing cirúrgico direcionado.
                  </p>
                </div>
              </div>

              {/* Campaign focus text */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Campanha Recomendada para Captação:</span>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-slate-900 italic">
                  &ldquo;{analysis.recommendedCampaignStr}&rdquo;
                </p>
              </div>

            </div>
          </div>

          {/* Quick tips on methodology */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-900 rounded-xl text-[11px] text-slate-400 leading-normal mt-6">
            <p className="font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5 uppercase font-mono text-[9px] tracking-wider">
              <Info className="w-3.5 h-3.5 text-[#00F5A0]" /> Nota Metodológica de Captação:
            </p>
            Ao cruzar dados geográficos, evitamos o desperdício de panfletagem ou mídias patrocinadas em locais sem aderência financeira ou demográfica. Concentre a verba de marketing nas áreas de score alto!
          </div>
        </div>

      </div>

    </div>
  );
}
