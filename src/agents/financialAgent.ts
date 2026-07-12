import { z } from "zod";
import { AgentState } from "../types/agent";
import { createStructuredChain } from "../lib/llm";

const metricSchema = z.object({
  value: z.string(),
  score: z.number(),
});

const financialSchema = z.object({
  revenueGrowth: metricSchema,
  profitability: metricSchema,
  margins: metricSchema,
  debt: metricSchema,
  cashFlow: metricSchema,
  roe: metricSchema,
  peRatio: metricSchema,
  valuation: metricSchema,
  overallScore: z.number(),
});

export const financialAgentNode = async (state: AgentState): Promise<Partial<AgentState>> => {
  const chain = await createStructuredChain(
    financialSchema,
    "You are an expert financial analyst. Analyze the financial health of the given company based on recent public data. Score every metric from 1-10 and provide the actual approximate value."
  );

  const response = await chain.invoke({
    input: `Ticker: ${state.ticker}. Provide your best estimate of current financials.`,
  });

  return {
    financialHealth: response,
  };
};
