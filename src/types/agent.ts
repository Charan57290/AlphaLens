import { BaseMessage } from "@langchain/core/messages";

export interface CompanyInfo {
  name: string;
  overview: string;
  businessModel: string;
  revenueStreams: string[];
  competitors: string[];
  industry: string;
  products: string[];
}

export interface FinancialMetric {
  value: string;
  score: number; // 1-10
}

export interface FinancialHealth {
  revenueGrowth: FinancialMetric;
  profitability: FinancialMetric;
  margins: FinancialMetric;
  debt: FinancialMetric;
  cashFlow: FinancialMetric;
  roe: FinancialMetric;
  peRatio: FinancialMetric;
  valuation: FinancialMetric;
  overallScore: number;
}

export interface NewsItem {
  title: string;
  date: string;
  summary: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  source: string;
}

export interface NewsSentiment {
  recentNews: NewsItem[];
  overallSentiment: "Positive" | "Neutral" | "Negative";
  confidence: number;
}

export interface RiskItem {
  riskType: string;
  description: string;
  severity: "High" | "Medium" | "Low";
}

export interface RiskAssessment {
  risks: RiskItem[];
  overallRiskScore: number; // 0-100
}

export interface MoatAnalysis {
  brandStrength: number; // 1-10
  networkEffects: number; // 1-10
  patents: number; // 1-10
  switchingCosts: number; // 1-10
  marketLeadership: number; // 1-10
  economicMoat: "Wide" | "Narrow" | "None";
  summary: string;
}

export interface Decision {
  recommendation: "BUY" | "WATCH" | "PASS";
  confidence: number; // 0-100
  investmentScore: number; // 0-100
  bullCase: string[];
  bearCase: string[];
  whatCouldChange: string[];
}

export interface AgentState {
  messages: BaseMessage[];
  ticker: string;
  companyInfo?: CompanyInfo;
  financialHealth?: FinancialHealth;
  newsSentiment?: NewsSentiment;
  riskAssessment?: RiskAssessment;
  moatAnalysis?: MoatAnalysis;
  decision?: Decision;
}
