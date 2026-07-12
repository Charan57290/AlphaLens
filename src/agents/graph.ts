import { StateGraph, START, END } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";
import { AgentState } from "../types/agent";
import { researchAgentNode } from "./researchAgent";
import { financialAgentNode } from "./financialAgent";
import { newsAgentNode } from "./newsAgent";
import { riskAgentNode } from "./riskAgent";
import { moatAgentNode } from "./moatAgent";
import { decisionAgentNode } from "./decisionAgent";

const agentStateChannels = {
  messages: {
    value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
    default: () => [],
  },
  ticker: {
    value: (x: string, y?: string) => y ?? x,
    default: () => "",
  },
  companyInfo: {
    value: (x: any, y: any) => y ?? x,
    default: () => undefined,
  },
  financialHealth: {
    value: (x: any, y: any) => y ?? x,
    default: () => undefined,
  },
  newsSentiment: {
    value: (x: any, y: any) => y ?? x,
    default: () => undefined,
  },
  riskAssessment: {
    value: (x: any, y: any) => y ?? x,
    default: () => undefined,
  },
  moatAnalysis: {
    value: (x: any, y: any) => y ?? x,
    default: () => undefined,
  },
  decision: {
    value: (x: any, y: any) => y ?? x,
    default: () => undefined,
  },
};

const builder = new StateGraph<AgentState>({
  channels: agentStateChannels as any,
})
  .addNode("research", researchAgentNode)
  .addNode("financial", financialAgentNode)
  .addNode("news", newsAgentNode)
  .addNode("risk", riskAgentNode)
  .addNode("moat", moatAgentNode)
  .addNode("decision", decisionAgentNode)
  
  .addEdge(START, "research")
  .addEdge(START, "financial")
  .addEdge(START, "news")
  .addEdge(START, "risk")
  .addEdge(START, "moat")
  
  .addEdge("research", "decision")
  .addEdge("financial", "decision")
  .addEdge("news", "decision")
  .addEdge("risk", "decision")
  .addEdge("moat", "decision")
  
  .addEdge("decision", END);

export const compileGraph = () => {
  return builder.compile();
};
