import { z } from "zod";
import { AgentState } from "../types/agent";
import { createStructuredChain } from "../lib/llm";

const decisionSchema = z.object({
  recommendation: z.enum(["BUY", "WATCH", "PASS"]),
  confidence: z.number(),
  investmentScore: z.number(),
  bullCase: z.array(z.string()),
  bearCase: z.array(z.string()),
  whatCouldChange: z.array(z.string()),
});

export const decisionAgentNode = async (state: AgentState): Promise<Partial<AgentState>> => {
  const chain = await createStructuredChain(
    decisionSchema,
    "You are the lead portfolio manager. Combine all the research provided to produce a final BUY/WATCH/PASS decision with confidence and a debate between a Bull and Bear case."
  );

  const inputData = JSON.stringify({
    ticker: state.ticker,
    company: state.companyInfo,
    financial: state.financialHealth,
    news: state.newsSentiment,
    risk: state.riskAssessment,
    moat: state.moatAnalysis,
  }, null, 2);

  const response = await chain.invoke({
    input: `Make an investment decision based on this data: ${inputData}`,
  });

  return {
    decision: response,
  };
};
