/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudentSimulatorInput, MapRegion } from '../types';

// Mock Student profiles for Simulator Playground
export const MOCK_STUDENTS: StudentSimulatorInput[] = [
  {
    name: "Bernardo Silva (Engenharia de Software)",
    notas: 4.2,
    frequencia: 68,
    engajamento: 22,
    atrasoMensalidade: true,
    perfilFinanceiroAdimplente: false
  },
  {
    name: "Helena Castro (Arquitetura e Urbanismo)",
    notas: 9.5,
    frequencia: 98,
    engajamento: 94,
    atrasoMensalidade: false,
    perfilFinanceiroAdimplente: true
  },
  {
    name: "Gustavo Mendes (Direito)",
    notas: 6.8,
    frequencia: 85,
    engajamento: 40,
    atrasoMensalidade: true,
    perfilFinanceiroAdimplente: true
  },
  {
    name: "Larissa Oliveira (Medicina Veterinária)",
    notas: 5.5,
    frequencia: 75,
    engajamento: 58,
    atrasoMensalidade: false,
    perfilFinanceiroAdimplente: true
  },
  {
    name: "Mateus Ribeiro (Administração - Noturno)",
    notas: 3.5,
    frequencia: 50,
    engajamento: 15,
    atrasoMensalidade: false,
    perfilFinanceiroAdimplente: false
  }
];

// Mock regions of Rio de Janeiro state for the Geo map (based on the official Mesorregiões of Rio de Janeiro)
export const METRO_REGIONS: MapRegion[] = [
  {
    id: "reg-costa-verde",
    name: "Costa Verde",
    populationDensity: "Baixa",
    avgIncome: 9500,
    competitorIndex: 9,
    targetAgePercentage: 10,
    coordinateX: 160,
    coordinateY: 480,
    polygonPoints: "60,570 120,580 160,560 210,530 240,490 250,460 260,440 220,450 170,470 110,500 70,540 60,570"
  },
  {
    id: "reg-medio-paraiba",
    name: "Médio Paraíba",
    populationDensity: "Média",
    avgIncome: 5200,
    competitorIndex: 5,
    targetAgePercentage: 21,
    coordinateX: 180,
    coordinateY: 380,
    polygonPoints: "70,540 110,500 170,470 220,450 260,440 280,390 320,310 260,310 210,335 160,360 110,395 70,540"
  },
  {
    id: "reg-metropolitana",
    name: "Metropolitana do Rio de Janeiro",
    populationDensity: "Alta",
    avgIncome: 7500,
    competitorIndex: 1,
    targetAgePercentage: 38,
    coordinateX: 430,
    coordinateY: 430,
    polygonPoints: "260,440 280,390 320,310 380,315 425,305 450,295 485,305 490,325 510,330 540,310 570,315 580,335 590,360 550,490 510,505 480,510 440,475 420,440 375,415 320,440 260,440"
  },
  {
    id: "reg-serrana",
    name: "Serrana",
    populationDensity: "Média",
    avgIncome: 5800,
    competitorIndex: 8,
    targetAgePercentage: 18,
    coordinateX: 430,
    coordinateY: 280,
    polygonPoints: "320,310 380,315 425,305 450,295 485,305 490,325 510,330 540,310 570,315 560,280 500,265 460,240 430,225 380,245 350,265 320,310"
  },
  {
    id: "reg-centro",
    name: "Centro Fluminense",
    populationDensity: "Média",
    avgIncome: 3500,
    competitorIndex: 6,
    targetAgePercentage: 14,
    coordinateX: 400,
    coordinateY: 190,
    polygonPoints: "260,310 320,310 350,265 380,245 430,225 460,240 500,265 560,280 640,220 620,170 550,195 480,180 430,190 370,180 320,200 260,310"
  },
  {
    id: "reg-baixadas",
    name: "Baixadas Litorâneas",
    populationDensity: "Alta",
    avgIncome: 5100,
    competitorIndex: 4,
    targetAgePercentage: 26,
    coordinateX: 680,
    coordinateY: 450,
    polygonPoints: "570,315 580,335 590,360 550,490 650,500 745,505 765,490 750,460 760,420 740,415 700,410 660,400 590,360 570,315"
  },
  {
    id: "reg-norte",
    name: "Norte Fluminense",
    populationDensity: "Média",
    avgIncome: 8200,
    competitorIndex: 2,
    targetAgePercentage: 35,
    coordinateX: 800,
    coordinateY: 280,
    polygonPoints: "560,280 640,220 680,200 740,230 800,180 840,170 880,180 950,180 970,220 980,280 930,380 830,370 760,380 700,410 660,400 590,360 570,315 560,280"
  },
  {
    id: "reg-noroeste",
    name: "Noroeste Fluminense",
    populationDensity: "Baixa",
    avgIncome: 2500,
    competitorIndex: 8,
    targetAgePercentage: 12,
    coordinateX: 740,
    coordinateY: 110,
    polygonPoints: "640,220 680,200 740,230 800,180 800,140 810,95 780,40 760,10 750,40 710,80 690,120 720,160 670,180 650,210 640,220"
  }
];

export function runPredictionModel(input: StudentSimulatorInput): {
  logisticRegResult: number;
  randomForestResult: number;
  xgBoostResult: number;
  overallRisk: "Baixo" | "Médio" | "Alto";
  color: string;
  recommendations: string[];
} {
  // Let's create an algorithmic prediction simulation matching standard ML patterns
  // Base risk increases if attendance is low, grades are bad, or engagement is down.
  // Financial issues are heavy drivers for private colleges.

  let factorAttendance = (100 - input.frequencia) * 1.3; // max contribution: 65-130%
  let factorGrades = (10 - input.notas) * 8.5; // max contribution: 85%
  let factorEngagement = (100 - input.engajamento) * 0.75; // max contribution: 75%
  
  // Financial variables weight
  let factorFinancial = 0;
  if (input.atrasoMensalidade) factorFinancial += 25;
  if (!input.perfilFinanceiroAdimplente) factorFinancial += 20;

  // Let's compute average intermediate score
  let baseScore = (factorAttendance + factorGrades + factorEngagement + factorFinancial) / 3.2;
  
  // Clamp base score between 3% and 97% to ensure realistic ML probabilistic variance
  baseScore = Math.max(3, Math.min(97, baseScore));

  // 1. Logistic Regression: Linear combinations with a sigmoid-like scaling
  let lrProb = baseScore + (input.atrasoMensalidade ? 8 : -5);
  lrProb = Math.max(2, Math.min(98, lrProb));

  // 2. Random Forest: Discretized, ensemble-like, responds very sharply to key metrics
  let rfProb = baseScore;
  if (input.frequencia < 75) rfProb += 15;
  if (input.notas < 5.0) rfProb += 10;
  if (!input.perfilFinanceiroAdimplente && input.atrasoMensalidade) rfProb += 12;
  rfProb = Math.max(1, Math.min(99, rfProb - 10));

  // 3. XGBoost: Captures advanced interactions
  let xgProb = baseScore;
  // Non-linear interaction: high absences + low portal engagement is super critical
  if (input.frequencia < 70 && input.engajamento < 30) {
    xgProb += 18;
  }
  // Interaction response to good student with late payment
  if (input.notas > 8.0 && input.atrasoMensalidade) {
    xgProb = Math.max(5, xgProb - 12); // XGBoost understands smart students are less likely to dropout for grades
  }
  xgProb = Math.max(2, Math.min(99.6, xgProb));

  // Average probability for absolute decision labeling
  const avg = (lrProb + rfProb + xgProb) / 3;
  let overallRisk: "Baixo" | "Médio" | "Alto" = "Baixo";
  let color = "bg-green-500 text-green-100 border-green-600";

  if (avg > 60) {
    overallRisk = "Alto";
    color = "bg-rose-500 text-rose-500";
  } else if (avg > 30) {
    overallRisk = "Médio";
    color = "bg-amber-500 text-amber-500";
  } else {
    overallRisk = "Baixo";
    color = "bg-emerald-500 text-emerald-500";
  }

  // Guidelines for compliance and empathetic pedagogy recommendations
  const recs: string[] = [];
  if (overallRisk === "Alto") {
    recs.push("🚨 [AÇÃO CRÍTICA]: Disparar contato ativo telefônico em 24h pela Secretaria de Acolhimento.");
    if (input.atrasoMensalidade || !input.perfilFinanceiroAdimplente) {
      recs.push("💳 [PEDAGÓGICO-FINANCEIRO]: Oferecer renegociação de débito com carência ou transição para parcelamento estudantil parceiro.");
    }
    if (input.frequencia < 75) {
      recs.push("📚 [RETENÇÃO PEDAGÓGICA]: Agendar mentoria pedagógica e ajustar horários de aula contra choques de trabalho.");
    }
  } else if (overallRisk === "Médio") {
    recs.push("⚠️ [SINAL AMARELO]: Incluir o aluno no painel de acompanhamento semanal automático da coordenação.");
    if (input.engajamento < 40) {
      recs.push("💻 [ENGAJAMENTO]: Enviar lembretes personalizados via WhatsApp com convites para grupos de monitoria online.");
    }
    if (input.notas < 6.0) {
      recs.push("📝 [APOIO ACADÊMICO]: Oferecer exercícios de nivelamento ou tutoria aos sábados.");
    }
  } else {
    recs.push("✅ [MANUTENÇÃO]: Enviar mensagem de congratulação pelo engajamento elevado ou bom desempenho acadêmico!");
    recs.push("🌟 [FIDELIZAÇÃO]: Identificar perfil para potencial monitoria ou convite para projetos de pesquisa.");
  }

  // LGPD mandatory advice inclusion
  recs.push("🔒 [LGPD Dica]: O tratamento de dados sensíveis para este perfil respeita o Legítimo Interesse (art. 7º, IX da Lei 13.709/18). Lembre-se de não exportar dados crus com nomes de alunos.");

  return {
    logisticRegResult: Math.round(lrProb),
    randomForestResult: Math.round(rfProb),
    xgBoostResult: Math.round(xgProb),
    overallRisk,
    color,
    recommendations: recs
  };
}

export function runRegionalAcquisitionModel(region: MapRegion): {
  score: number;
  priority: "Urgente" | "Alto" | "Moderado" | "Baixo";
  estimatedEnrolments: number;
  recommendedCampaignStr: string;
} {
  // Region intelligence math calculation
  // Scores are higher if population is high, targetAge (15-24) is high, family budget represents good match, and competitors are low

  // Competitor resistance score
  const compResistance = (10 - region.competitorIndex) * 10; // max 100 points
  
  // R$ Income score - higher fit if in R$ 3,000 to R$ 8,000 range for mid-market private
  let incomeFit = 0;
  if (region.avgIncome >= 3000 && region.avgIncome <= 8000) {
    incomeFit = 100;
  } else if (region.avgIncome > 8000) {
    incomeFit = 75; // high purchasing power but usually prefers top tier state universities
  } else {
    incomeFit = 50; // lower income, fits better with scholarships (Fies/Prouni)
  }

  // Age score
  const ageFactor = region.targetAgePercentage * 2.5; // max 100

  // Combine factors to establish potential
  let baseScore = (compResistance * 0.35) + (incomeFit * 0.35) + (ageFactor * 0.30);
  if (region.populationDensity === "Alta") baseScore += 10;
  
  baseScore = Math.max(10, Math.min(98, Math.round(baseScore)));

  let priority: "Urgente" | "Alto" | "Moderado" | "Baixo" = "Baixo";
  let recommendedCampaignStr = "";
  let estimatedEnrolments = Math.round((baseScore / 10) * (region.populationDensity === "Alta" ? 2.5 : 1.2));

  if (baseScore > 80) {
    priority = "Urgente";
    recommendedCampaignStr = "Campanha Offline Massiva (Outdoors + Panfletagem local) cruzada com Geo-anúncios patrocinados no Instagram e TikTok focando em Bolsas de Estudo de até 50%.";
  } else if (baseScore > 60) {
    priority = "Alto";
    recommendedCampaignStr = "Anúncios altamente focalizados via Google Ads local por palavra-chave de cursos técnicos/graduação, e visitas estratégicas a colégios parceiros do Ensino Médio da região.";
  } else if (baseScore > 40) {
    priority = "Moderado";
    recommendedCampaignStr = "Promoções pontuais de isenção de taxa de inscrição do vestibular e posts patrocinados leves nas redes de bairros locais.";
  } else {
    priority = "Baixo";
    recommendedCampaignStr = "Trabalhar apenas captação orgânica via buscadores gerais e monitorar a movimentação de possíveis novos concorrentes.";
  }

  return {
    score: baseScore,
    priority,
    estimatedEnrolments,
    recommendedCampaignStr
  };
}
