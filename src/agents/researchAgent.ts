import { z } from "zod";
import { AgentState } from "../types/agent";
import { createStructuredChain } from "../lib/llm";

const companyInfoSchema = z.object({
  name: z.string(),
  overview: z.string(),
  businessModel: z.string(),
  revenueStreams: z.array(z.string()),
  competitors: z.array(z.string()),
  industry: z.string(),
  products: z.array(z.string()),
});

export const researchAgentNode = async (state: AgentState): Promise<Partial<AgentState>> => {
  const chain = await createStructuredChain(
    companyInfoSchema,
    "You are an expert financial researcher. Gather comprehensive company information for the given ticker symbol."
  );

  const response = await chain.invoke({
    input: `Ticker: ${state.ticker}`,
  });

  return {
    companyInfo: response,
  };
};
