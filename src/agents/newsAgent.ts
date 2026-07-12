import { z } from "zod";
import { AgentState } from "../types/agent";
import { createStructuredChain } from "../lib/llm";

const newsItemSchema = z.object({
  title: z.string(),
  date: z.string(),
  summary: z.string(),
  sentiment: z.enum(["Positive", "Neutral", "Negative"]),
  source: z.string(),
});

const newsSchema = z.object({
  recentNews: z.array(newsItemSchema),
  overallSentiment: z.enum(["Positive", "Neutral", "Negative"]),
  confidence: z.number(),
});

export const newsAgentNode = async (state: AgentState): Promise<Partial<AgentState>> => {
  const chain = await createStructuredChain(
    newsSchema,
    "You are a market sentiment analyst. Summarize recent news, legal issues, acquisitions, and overall sentiment for the given company."
  );

  const response = await chain.invoke({
    input: `Ticker: ${state.ticker}`,
  });

  return {
    newsSentiment: response,
  };
};
