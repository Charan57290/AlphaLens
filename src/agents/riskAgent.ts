import { z } from "zod";
import { AgentState } from "../types/agent";
import { createStructuredChain } from "../lib/llm";

const riskItemSchema = z.object({
  riskType: z.string(),
  description: z.string(),
  severity: z.enum(["High", "Medium", "Low"]),
});

const riskSchema = z.object({
  risks: z.array(riskItemSchema),
  overallRiskScore: z.number(),
});

export const riskAgentNode = async (state: AgentState): Promise<Partial<AgentState>> => {
  const chain = await createStructuredChain(
    riskSchema,
    "You are a risk assessment manager. Identify potential risks for the given company including competition, debt, political, regulatory, tech disruption, and macro factors."
  );

  const response = await chain.invoke({
    input: `Ticker: ${state.ticker}`,
  });

  return {
    riskAssessment: response,
  };
};
