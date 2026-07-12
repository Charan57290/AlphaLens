import { z } from "zod";
import { AgentState } from "../types/agent";
import { createStructuredChain } from "../lib/llm";

const moatSchema = z.object({
  brandStrength: z.number(),
  networkEffects: z.number(),
  patents: z.number(),
  switchingCosts: z.number(),
  marketLeadership: z.number(),
  economicMoat: z.enum(["Wide", "Narrow", "None"]),
  summary: z.string(),
});

export const moatAgentNode = async (state: AgentState): Promise<Partial<AgentState>> => {
  const chain = await createStructuredChain(
    moatSchema,
    "You are a competitive strategy analyst. Determine the economic moat of the given company by evaluating its brand, network effects, patents, and switching costs."
  );

  const response = await chain.invoke({
    input: `Ticker: ${state.ticker}`,
  });

  return {
    moatAnalysis: response,
  };
};
