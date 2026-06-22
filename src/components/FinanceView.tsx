import React, { useState } from 'react';
import { 
  PiggyBank, 
  CircleDollarSign, 
  TrendingUp, 
  ChevronRight, 
  HelpCircle,
  Database,
  BarChart,
  Hammer,
  GraduationCap
} from 'lucide-react';

export default function FinanceView() {
  // Simulator inputs for School Manager
  const [activeStudentsCount, setActiveStudentsCount] = useState<number>(1200);
  const [averageTuitionFee, setAverageTuitionFee] = useState<number>(950);
  const [annualDropoutRate, setAnnualDropoutRate] = useState<number>(26); // Média geral de evasão calculada no Brasil
  const [customProjectCost, setCustomProjectCost] = useState<number>(75000); // Proportional initial budget

  // Calculate lost students and revenue
  const lostStudents = Math.round(activeStudentsCount * (annualDropoutRate / 100));
  // Total lost tuition annual revenue (assuming students leave on average at the beginning, calculated across 12 months)
  const annualLossTuition = lostStudents * averageTuitionFee * 12;

  // CAC loss calculation (assuming capturing costs 3x more than keeping one, e.g. keeping is ~R$ 300, capturing is R$ 900)
  const averageRetentionWeight = 300;
  const cacLossSum = lostStudents * (averageRetentionWeight * 3);

  const totalFinancialLoss = annualLossTuition + cacLossSum;

  // Let's assume the project recovers 30% of the lost students (conservatively)
  const recoveredStudentsRate = 30; // 30% recovery rate
  const recoveredStudentsCount = Math.round(lostStudents * (recoveredStudentsRate / 100));
  const recoveredAnnualRevenue = recoveredStudentsCount * averageTuitionFee * 12;
  const recoveredCacSavings = recoveredStudentsCount * (averageRetentionWeight * 3);
  const totalRecoveredGain = recoveredAnnualRevenue + recoveredCacSavings;

  // ROI math calculation
  const netGain = totalRecoveredGain - customProjectCost;
  const calculatedROI = (netGain / customProjectCost) * 100;

  // Budget divisions
  const budgetCRM = customProjectCost * 0.35;
  const budgetCloud = customProjectCost * 0.30;
  const budgetBI = customProjectCost * 0.20;
  const budgetCapacitacao = customProjectCost * 0.15;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Financial Inputs Panel */}
      <div className="lg:col-span-5 bg-[#070e1e]/60 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
            <PiggyBank className="w-5 h-5 text-[#00F5A0]" />
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">
              Ajuste Seus Números
            </h2>
          </div>

          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Configure o porte da sua instituição para simular as perdas financeiras anuais e projetar o valor do projeto estratégico de ciência de dados.
          </p>

          <div className="space-y-5">
            {/* Active student base slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">🏫 Total de Alunos Ativos:</span>
                <span className="font-mono font-bold text-white">
                  {activeStudentsCount.toLocaleString()} alunos
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="50"
                value={activeStudentsCount}
                onChange={(e) => setActiveStudentsCount(parseInt(e.target.value))}
                className="w-full accent-[#00F5A0] cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-0.5">
                <span>100 (Pequena)</span>
                <span>5k (Intermediário)</span>
                <span>10k (Grande faculdade)</span>
              </div>
            </div>

            {/* Average Tuition slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">💰 Mensalidade Média Geral (R$):</span>
                <span className="font-mono font-bold text-white">
                  R$ {averageTuitionFee.toLocaleString('pt-BR')} / mês
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="5000"
                step="50"
                value={averageTuitionFee}
                onChange={(e) => setAverageTuitionFee(parseInt(e.target.value))}
                className="w-full accent-[#00F5A0] cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-0.5">
                <span>R$ 200 (Básico)</span>
                <span>R$ 1.500 (Médio)</span>
                <span>R$ 5.000 (Premium/Medicina)</span>
              </div>
            </div>

            {/* Dropout percentage slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">📉 Percentual Anual de Evasão (%):</span>
                <span className={`font-mono font-bold ${annualDropoutRate > 25 ? 'text-rose-400' : 'text-amber-400'}`}>
                  {annualDropoutRate}% de perda ao ano
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={annualDropoutRate}
                onChange={(e) => setAnnualDropoutRate(parseInt(e.target.value))}
                className="w-full accent-[#00F5A0] cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-0.5">
                <span>5% (Excepcional)</span>
                <span className="text-rose-450">26% (Média Brasil)</span>
                <span>50% (Crítico absoluto)</span>
              </div>
            </div>

            {/* Set Custom Cost estimate */}
            <div className="pt-4 border-t border-slate-900">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">🛠️ Investimento Estimado do Projeto (R$):</span>
                <span className="font-mono font-bold text-[#00F5A0]">
                  R$ {customProjectCost.toLocaleString('pt-BR')}
                </span>
              </div>
              <input
                type="range"
                min="20000"
                max="300000"
                step="5000"
                value={customProjectCost}
                onChange={(e) => setCustomProjectCost(parseInt(e.target.value))}
                className="w-full accent-[#00F5A0] cursor-pointer transition-all h-1.5 bg-slate-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-0.5">
                <span>R$ 20k (Piloto Lite)</span>
                <span>R$ 150k (Médio Porte)</span>
                <span>R$ 300k (Grande Escopo)</span>
              </div>
            </div>

          </div>
        </div>

        {/* Small math guidance */}
        <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-xl leading-relaxed text-xs text-slate-400">
          <strong>Regra Base de Negócio:</strong> Captar novos estudantes carrega forte CAC de publicidade, mídias e vestibular (estimado aqui em R$ 900 por perda). Um modelo preditivo de dados impede vazamentos pelo fundo, gerando receita imediata.
        </div>
      </div>

      {/* Financial Diagnostics Column */}
      <div className="lg:col-span-7 flex flex-col gap-6">

        {/* Losses vs Savings Dashboard bar block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Loss Card */}
          <div className="bg-[#0c0512] border border-rose-950 p-5 rounded-2xl relative">
            <span className="text-[9px] font-mono tracking-widest text-rose-400 font-bold bg-rose-950/40 px-2 py-0.5 rounded uppercase">
              Impacto Negativo Atual
            </span>
            <p className="text-xs text-slate-400 mt-3 font-medium">Vazamento Anual de Receita:</p>
            <span className="text-2xl font-black font-mono tracking-tight text-rose-500 block mt-1">
              - R$ {totalFinancialLoss.toLocaleString('pt-BR')}
            </span>
            <div className="text-[10px] text-slate-500 leading-normal border-t border-rose-950/40 pt-2.5 mt-2 space-y-1">
              <div className="flex justify-between">
                <span>🚫 {lostStudents} alunos evadidos ao ano</span>
                <span className="font-bold">26% de Média</span>
              </div>
              <div className="flex justify-between">
                <span>📉 Mensalidades perdidas: R$ {annualLossTuition.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span>⚠️ Desperdiçado em CAC: R$ {cacLossSum.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>

          {/* Savings Gain Card */}
          <div className="bg-[#051111] border border-emerald-950 p-5 rounded-2xl relative">
            <span className="text-[9px] font-mono tracking-widest text-[#00F5A0] font-bold bg-[#00F5A0]/10 px-2 py-0.5 rounded uppercase">
              Retorno com Solução Preditiva
            </span>
            <p className="text-xs text-slate-400 mt-3 font-medium">Economia Recuperada (Meta de apenas {recoveredStudentsRate}%):</p>
            <span className="text-2xl font-black font-mono tracking-tight text-emerald-400 block mt-1">
              + R$ {totalRecoveredGain.toLocaleString('pt-BR')}
            </span>
            <div className="text-[10px] text-slate-500 leading-normal border-t border-emerald-950/40 pt-2.5 mt-2 space-y-1">
              <div className="flex justify-between">
                <span>💖 {recoveredStudentsCount} alunos mantidos na base</span>
                <span className="font-bold text-emerald-400">30% Melhoria</span>
              </div>
              <div className="flex justify-between">
                <span>📈 Mensalidades retidas: R$ {recoveredAnnualRevenue.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span>⚡ Reaquisição poupada (CAC): R$ {recoveredCacSavings.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ROI and Proportional Distribution */}
        <div className="bg-[#070e1e]/60 border border-slate-800 p-6 rounded-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-indigo-950/30 pb-5 mb-5">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
                Taxa de Retorno de Investimento (ROI)
              </h3>
              <p className="text-xs text-slate-400">
                Comparativo financeiro entre o custo do projeto e o valor de receita salvo.
              </p>
            </div>

            <div className="flex items-baseline gap-2 bg-emerald-500/10 border border-emerald-500/20 px-5 py-2.5 rounded-2xl text-center">
              <span className="text-3xl font-black font-mono text-emerald-400 tracking-tighter">
                {calculatedROI.toFixed(0)}%
              </span>
              <span className="text-xs font-bold text-emerald-300">de ROI Líquido</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Table detail representation of composition metrics */}
            <div className="space-y-3">
              <p className="text-xs font-mono font-bold text-slate-300 uppercase mb-3">
                Distribuição Proporcional do Orçamento:
              </p>

              <div className="space-y-2">
                {/* CRM */}
                <div className="flex items-center justify-between text-xs p-2.5 bg-slate-950/50 rounded-xl border border-slate-900/80">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-400" />
                    <span className="text-slate-400 font-medium">CRM Educacional & Licenças (35%)</span>
                  </span>
                  <span className="font-mono font-bold text-white">
                    R$ {budgetCRM.toLocaleString('pt-BR')}
                  </span>
                </div>

                {/* Cloud */}
                <div className="flex items-center justify-between text-xs p-2.5 bg-slate-950/50 rounded-xl border border-slate-900/80">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-cyan-400" />
                    <span className="text-slate-400 font-medium">Infraestrutura em Nuvem (30%)</span>
                  </span>
                  <span className="font-mono font-bold text-white">
                    R$ {budgetCloud.toLocaleString('pt-BR')}
                  </span>
                </div>

                {/* BI Panel */}
                <div className="flex items-center justify-between text-xs p-2.5 bg-slate-950/50 rounded-xl border border-slate-900/80">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-purple-400" />
                    <span className="text-slate-400 font-medium">Painéis de BI / Dashboards (20%)</span>
                  </span>
                  <span className="font-mono font-bold text-white">
                    R$ {budgetBI.toLocaleString('pt-BR')}
                  </span>
                </div>

                {/* Training */}
                <div className="flex items-center justify-between text-xs p-2.5 bg-slate-950/50 rounded-xl border border-slate-900/80">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-amber-400" />
                    <span className="text-slate-400 font-medium">Capacitação de Equipes (15%)</span>
                  </span>
                  <span className="font-mono font-bold text-white">
                    R$ {budgetCapacitacao.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>

            {/* Micro visual vector illustrating the budget allocation ring */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-950/20 rounded-2xl border border-slate-900">
              <svg viewBox="0 0 100 100" className="w-24 h-24">
                {/* 35% CRM */}
                <circle cx="50" cy="50" r="40" stroke="#10b981" strokeWidth="10" fill="none" strokeDashoffset="0" strokeDasharray="87.9 163.3" />
                {/* 30% Cloud */}
                <circle cx="50" cy="50" r="40" stroke="#06b6d4" strokeWidth="10" fill="none" strokeDashoffset="-87.9" strokeDasharray="75.3 175.9" />
                {/* 20% BI */}
                <circle cx="50" cy="50" r="40" stroke="#a855f7" strokeWidth="10" fill="none" strokeDashoffset="-163.2" strokeDasharray="50.2 201" />
                {/* 15% Training */}
                <circle cx="50" cy="50" r="40" stroke="#f59e0b" strokeWidth="10" fill="none" strokeDashoffset="-213.4" strokeDasharray="37.8 213.4" />
                
                <circle cx="50" cy="50" r="28" fill="#090d16" />
              </svg>
              
              <p className="text-[10px] font-mono text-slate-400 mt-3 text-center uppercase tracking-widest font-semibold">
                Anel de Alocação de Recursos
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
