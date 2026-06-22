import React, { useState, useEffect } from 'react';
import { StudentSimulatorInput, PredictionResult } from '../types';
import { MOCK_STUDENTS, runPredictionModel } from '../data/slidesAndSimData';
import { 
  Sliders, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  ShieldAlert,
  GraduationCap,
  Percent,
  TrendingDown,
  Lock
} from 'lucide-react';

export default function SimulatorView() {
  const [selectedPresetId, setSelectedPresetId] = useState<number>(-1);
  
  // Initialize state with the first student in the preset list
  const [studentState, setStudentState] = useState<StudentSimulatorInput>({
    name: "Perfil Personalizado",
    notas: 6.5,
    frequencia: 82,
    engajamento: 45,
    atrasoMensalidade: false,
    perfilFinanceiroAdimplente: true
  });

  const [prediction, setPrediction] = useState<PredictionResult>({
    logisticRegResult: 0,
    randomForestResult: 0,
    xgBoostResult: 0,
    overallRisk: "Médio",
    color: "bg-amber-500 text-amber-500",
    recommendations: []
  });

  // Calculate prediction whenever state inputs change
  useEffect(() => {
    const res = runPredictionModel(studentState);
    setPrediction(res);
  }, [studentState]);

  const loadPreset = (idx: number) => {
    setSelectedPresetId(idx);
    if (idx >= 0 && idx < MOCK_STUDENTS.length) {
      setStudentState({ ...MOCK_STUDENTS[idx] });
    }
  };

  const handleSliderChange = (field: keyof StudentSimulatorInput, val: number) => {
    setSelectedPresetId(-1); // Switch to "Custom"
    setStudentState(prev => ({
      ...prev,
      name: "Perfil Personalizado",
      [field]: val
    }));
  };

  const handleToggleChange = (field: keyof StudentSimulatorInput) => {
    setSelectedPresetId(-1); // Switch to "Custom"
    setStudentState(prev => ({
      ...prev,
      name: "Perfil Personalizado",
      [field]: !prev[field] as any
    }));
  };

  // Helper colors for metrics card
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Alto": return "text-rose-400 bg-rose-500/10 border-rose-500/30";
      case "Médio": return "text-amber-400 bg-amber-500/10 border-amber-500/30";
      default: return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Parameters Panel */}
      <div className="lg:col-span-5 bg-[#070e1e]/60 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">
              Parâmetros do Aluno
            </h2>
          </div>

          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Selecione um perfil de exemplo pré-concebido ou modifique os controles deslizantes em tempo real para alimentar a entrada das redes preditivas.
          </p>

          {/* Presets Selection */}
          <div className="mb-6">
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-2">
              📂 Carregar Perfil Acadêmico Cadastrado:
            </label>
            <div className="grid grid-cols-1 gap-2">
              {MOCK_STUDENTS.map((stud, idx) => (
                <button
                  key={idx}
                  onClick={() => loadPreset(idx)}
                  className={`w-full text-left text-xs p-3 rounded-lg border transition-all cursor-pointer flex justify-between items-center ${
                    selectedPresetId === idx 
                      ? 'bg-emerald-500/10 text-white border-emerald-400 font-medium' 
                      : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className={`w-4 h-4 ${selectedPresetId === idx ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span>{stud.name}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    stud.frequencia < 75 || stud.notas < 5.0 ? 'bg-rose-950 text-rose-300' : 'bg-slate-950 text-slate-400'
                  }`}>
                    Nota: {stud.notas} · Freq: {stud.frequencia}%
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="space-y-4 border-t border-slate-900 pt-5">
            {/* Notas Sliders */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium flex items-center gap-1">
                  📝 Média Geral de Notas:
                </span>
                <span className={`font-mono font-bold ${studentState.notas < 5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {studentState.notas.toFixed(1)} / 10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={studentState.notas}
                onChange={(e) => handleSliderChange('notas', parseFloat(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer text-emerald-400 h-1.5 bg-slate-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-0.5">
                <span>0.0 (Crítico)</span>
                <span>5.5 (Repreensão)</span>
                <span>10.0 (Excelente)</span>
              </div>
            </div>

            {/* Attendance Sliders */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium flex items-center gap-1">
                  🗓️ Frequência Escolar:
                </span>
                <span className={`font-mono font-bold ${studentState.frequencia < 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {studentState.frequencia}%
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                step="1"
                value={studentState.frequencia}
                onChange={(e) => handleSliderChange('frequencia', parseInt(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-0.5">
                <span>30% (Reprov. Direta)</span>
                <span>75% (Mínimo por Lei)</span>
                <span>100% (Integral)</span>
              </div>
            </div>

            {/* Virtual Portal Engagement Index */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium flex items-center gap-1">
                  💻 Engajamento no AVA (Portal Virt.):
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  {studentState.engajamento} / 100
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={studentState.engajamento}
                onChange={(e) => handleSliderChange('engajamento', parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-0.5">
                <span>0 (Ausente)</span>
                <span>50 (Moderado)</span>
                <span>100 (Uso Intenso)</span>
              </div>
            </div>

            {/* Financial variables toggles */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Mensalidade atrasada */}
              <div 
                onClick={() => handleToggleChange('atrasoMensalidade')}
                className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                  studentState.atrasoMensalidade 
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                    : 'bg-slate-900/40 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold leading-tight">Mensalidade em Atraso</span>
                  <span className="text-[9px] font-mono opacity-80">Débito presente no financeiro</span>
                </div>
                <div className={`w-8 h-4 rounded-full relative transition-all ${studentState.atrasoMensalidade ? 'bg-rose-500' : 'bg-slate-800'}`}>
                  <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.25 transition-all ${studentState.atrasoMensalidade ? 'right-0.5' : 'left-0.5'}`} />
                </div>
              </div>

              {/* Perfil pagador historico (Adimplente) */}
              <div 
                onClick={() => handleToggleChange('perfilFinanceiroAdimplente')}
                className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                  !studentState.perfilFinanceiroAdimplente 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
                    : 'bg-slate-900/40 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold leading-tight">Histórico de Inadimplência</span>
                  <span className="text-[9px] font-mono opacity-80">Perfil com histórico instável</span>
                </div>
                <div className={`w-8 h-4 rounded-full relative transition-all ${!studentState.perfilFinanceiroAdimplente ? 'bg-amber-500' : 'bg-slate-800'}`}>
                  <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.25 transition-all ${!studentState.perfilFinanceiroAdimplente ? 'right-0.5' : 'left-0.5'}`} />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Small warning disclaimer matching Brazilian LGPD rules */}
        <div className="mt-6 border-t border-slate-900 pt-4 flex items-start gap-2 text-[10px] text-slate-500 leading-normal">
          <Lock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <span>
            <strong>Privacidade Ativa por Design:</strong> Nenhum dado cru do aluno é enviado a servidores externos de processamento comercial. A predição é processada localmente em sandboxes em compliance com as bases de Legítimo Interesse da LGPD.
          </span>
        </div>
      </div>

      {/* Analysis Results view */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Main Risk Output Dashboard */}
        <div className={`p-6 rounded-2xl border ${getRiskColor(prediction.overallRisk)} border transition-all flex flex-col md:flex-row items-center justify-between gap-6`}>
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-mono tracking-widest font-bold opacity-80 text-slate-300 uppercase">
              Resultado Consolidado da Predição de Abandono
            </span>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="text-xs">Diagnóstico Geral:</span>
              <span className="text-lg font-extrabold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-current">
                Risco {prediction.overallRisk}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              {prediction.overallRisk === "Alto" 
                ? "Este perfil exige ações imediatas da reitoria e coordenação. O risco supera 60% e indica indícios gravíssimos de evasão nos próximos 30 dias."
                : prediction.overallRisk === "Médio"
                ? "Este aluno apresenta primeiros desvios estatísticos de frequência e engajamento. Ideal para abordagem moderada de auxílio pedagógico."
                : "Parâmetros exemplares dentro dos padrões de retenção automática. O aluno apresenta forte vínculo com a instituição."}
            </p>
          </div>

          {/* Central Percentage Gauge circle simulated */}
          <div className="relative shrink-0 w-32 h-32 rounded-full border border-slate-800 bg-[#091126] flex flex-col items-center justify-center p-4">
            <svg className="absolute inset-0 w-full h-full -rotate-95">
              <circle 
                cx="64" cy="64" r="54" 
                stroke="#1e293b" strokeWidth="8" fill="none" 
              />
              <circle 
                cx="64" cy="64" r="54" 
                stroke={prediction.overallRisk === "Alto" ? "#f43f5e" : prediction.overallRisk === "Médio" ? "#f59e0b" : "#10b981"} 
                strokeWidth="8" fill="none" 
                strokeDasharray={339}
                strokeDashoffset={339 - (339 * ((prediction.logisticRegResult + prediction.randomForestResult + prediction.xgBoostResult) / 3)) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="text-center z-10">
              <span className="text-2xl font-black font-mono tracking-tighter text-white">
                {Math.round((prediction.logisticRegResult + prediction.randomForestResult + prediction.xgBoostResult) / 3)}%
              </span>
              <p className="text-[9px] font-mono text-slate-400 mt-0.5 leading-none uppercase">Risco Geral</p>
            </div>
          </div>
        </div>

        {/* 3 Model Pipelines Output */}
        <div className="bg-[#070e1e]/60 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between gap-4 border-b border-indigo-900/30 pb-3 mb-4">
            <h3 className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Modelagem Avançada (Algoritmos Comparativos)
            </h3>
            <span className="text-[10px] bg-slate-900 border border-slate-800 text-cyan-300 font-mono px-2 py-0.5 rounded">
              Acurácia de Teste: ~94.8%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Logistic Regression Card */}
            <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-medium">Regr. Logística</span>
                <span className="text-[9px] text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-1 py-0.2 rounded font-mono">Clássico</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono tracking-tight text-white">
                  {prediction.logisticRegResult}%
                </span>
                <span className="text-[10px] text-slate-500">Prob.</span>
              </div>
              {/* Mini progress bar */}
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-[#0ea5e9] h-full rounded-full transition-all duration-300" 
                  style={{ width: `${prediction.logisticRegResult}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                Ótimo para isolar pesos lineares das variáveis e gerar coeficientes de explicação.
              </p>
            </div>

            {/* Random Forest Card */}
            <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-medium">Random Forest</span>
                <span className="text-[9px] text-purple-400 border border-purple-500/20 bg-purple-500/5 px-1 py-0.2 rounded font-mono">Ensemble</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono tracking-tight text-white">
                  {prediction.randomForestResult}%
                </span>
                <span className="text-[10px] text-slate-500">Prob.</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-purple-500 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${prediction.randomForestResult}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                Combina centenas de árvores de decisão aleatórias para imunidade máxima contra desvios de ruído.
              </p>
            </div>

            {/* XGBoost Card */}
            <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-medium">XGBoost</span>
                <span className="text-[9px] text-cyan-400 border border-cyan-500/20 bg-cyan-500/5 px-1 py-0.2 rounded font-mono">Gradient Boost</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono tracking-tight text-white">
                  {prediction.xgBoostResult}%
                </span>
                <span className="text-[10px] text-slate-500">Prob.</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${prediction.xgBoostResult}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                Alta assertividade de não-linearidades em dados. Considera combinações complexas de ausência e inadimplência.
              </p>
            </div>
          </div>
        </div>

        {/* Actionable Recommendations aligned with Slide PDF objectives */}
        <div className="bg-[#070e1e]/60 border border-slate-800 p-6 rounded-2xl flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> Recomendações Automáticas de Intervenção
            </h3>

            <div className="space-y-3">
              {prediction.recommendations.map((rec, rIdx) => {
                let textClass = "text-slate-300";
                let bgBorder = "border-slate-800 bg-slate-900/30";
                
                if (rec.includes("🚨")) {
                  textClass = "text-rose-200 font-medium";
                  bgBorder = "border-rose-950 bg-rose-900/10";
                } else if (rec.includes("⚠️")) {
                  textClass = "text-amber-200";
                  bgBorder = "border-amber-950 bg-amber-900/10";
                } else if (rec.includes("✅")) {
                  textClass = "text-emerald-200";
                  bgBorder = "border-emerald-950 bg-emerald-900/10";
                } else if (rec.includes("🔒")) {
                  textClass = "text-slate-400 italic text-[11px]";
                  bgBorder = "border-indigo-950 bg-indigo-950/20";
                }

                return (
                  <div 
                    key={rIdx} 
                    className={`p-3.5 border rounded-xl flex gap-3 text-xs leading-relaxed transition-all ${bgBorder}`}
                  >
                    <span>{rec.startsWith("🔒") ? "🔒" : "👉"}</span>
                    <span className={textClass}>
                      {rec.replace(/^(🔒 \[LGPD Dica\]:|🚨 \[AÇÃO CRÍTICA\]:|⚠️ \[SINAL AMARELO\]:|✅ \[MANUTENÇÃO\]:|💳 \[PEDAGÓGICO-FINANCEIRO\]:|📚 \[RETENÇÃO PEDAGÓGICA\]:|💻 \[ENGAJAMENTO\]:|📝 \[APOIO ACADÊMICO\]:|🌟 \[FIDELIZAÇÃO\]:)/g, "").trim()}
                      <span className="block text-[10px] font-mono mt-1 text-slate-500 uppercase tracking-widest font-bold">
                        {rec.match(/^\[(.*?)\]/)?.[0] || "[PROCESSO INTEGRADO]"}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-[10px] text-slate-500 font-mono mt-6 leading-tight">
            * As ações acima integram o fluxo de retenção ativa, integrando as secretarias, coordenações pedagógicas, e o financeiro sem assédio e com amparo na segurança jurídica de conformidade da lei.
          </p>
        </div>

      </div>

    </div>
  );
}
