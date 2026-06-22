/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  phase?: string;
}

export interface StudentSimulatorInput {
  name: string;
  notas: number;        // scale 0 - 10
  frequencia: number;   // percentage 0 - 100
  engajamento: number;  // portal logins/clicks scale 0 - 100
  atrasoMensalidade: boolean;
  perfilFinanceiroAdimplente: boolean; // true = steady payment, false = delays or scholarship issues
}

export interface PredictionResult {
  logisticRegResult: number; // probability between 0 and 100
  randomForestResult: number; // probability between 0 and 100
  xgBoostResult: number;     // probability between 0 and 100
  overallRisk: "Baixo" | "Médio" | "Alto";
  color: string;
  recommendations: string[];
}

export interface MapRegion {
  id: string;
  name: string;
  populationDensity: 'Alta' | 'Média' | 'Baixa';
  avgIncome: number; // in R$
  competitorIndex: number; // 0 to 10 scale
  targetAgePercentage: number; // percentage of age 15-24
  coordinateX: number; // SVG center X percent
  coordinateY: number; // SVG center Y percent
  polygonPoints: string; // SVG polygon representation
}

export interface RegionalAcquisitionScore {
  score: number; // 0 - 100
  priority: "Urgente" | "Alto" | "Moderado" | "Baixo";
  estimatedEnrolments: number;
  recommendedCampaignStr: string;
}
