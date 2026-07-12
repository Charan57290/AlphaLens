# AlphaLens AI - Investment Research Agent

This project was built for the AI/LLM assignment. AlphaLens AI is an institutional-grade, multi-agent investment research platform powered by Llama 3 via Groq.

## Overview — What it does

AlphaLens AI acts as a team of specialized AI financial analysts. When you provide a stock ticker (e.g., `MSFT`, `AAPL`, `TSLA`), the platform coordinates a team of 6 specialized AI agents to generate a comprehensive investment thesis. It analyzes a company's financial health, economic moat, market risks, and bullish/bearish arguments to ultimately deliver a final "BUY", "SELL", or "WATCH" verdict with an associated confidence score. The frontend features a premium, responsive glassmorphism dashboard built with Next.js and Tailwind CSS.

## How to run it — Setup and Run Steps

### Prerequisites
- Node.js (v18 or higher)
- A Groq API Key

### Setup Instructions
1. **Clone/Download the repository**.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add your Groq API key:
   ```env
   GROQ_API_KEY=gsk_your_api_key_here
   ```
4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
5. **Access the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser. Enter a ticker in the search bar and hit enter!

## How it works — Approach and Architecture

AlphaLens utilizes a multi-agent architecture powered by **LangGraph** and **Langchain**. 
The backend orchestrates a Directed Acyclic Graph (DAG) where specialized agents run in sequence, each contributing specific analysis to a shared `AgentState`.

**The Agent Pipeline:**
1. **Research Agent**: Gathers foundational company data, industry context, and revenue streams.
2. **Financial Agent**: Analyzes the raw data to score the company's financial health, growth, and margins.
3. **Risk Agent**: Identifies specific macro, micro, and operational risks associated with the company.
4. **Moat Agent**: Evaluates the company's competitive advantages (e.g., brand, network effects, switching costs).
5. **News Agent**: (Scaffolding for real-time sentiment analysis).
6. **Decision Agent**: Synthesizes the outputs of all previous agents to formulate a final thesis (Bull vs Bear case), a final recommendation, and a confidence score.

The frontend is a React (Next.js) application that queries this LangGraph API route. It features dynamic state management, Framer Motion animations, and native PDF export capabilities.

## Key decisions & trade-offs

- **LLM Choice (Llama 3 70B via Groq)**: 
  - *Why*: We chose Groq for its unprecedented inference speed. Financial analysis requires multiple agents running sequentially; using OpenAI/Anthropic would result in a very slow UX (30+ seconds). Groq completes the entire 6-agent pipeline in under 5 seconds.
  - *Trade-off*: Groq has stricter output parsing rules than OpenAI, which required implementing `StructuredOutputParser` instead of native tool calling to prevent JSON schema crashes.
- **State Management (LangGraph)**:
  - *Why*: We used LangGraph because it perfectly models the deterministic flow of data between agents. We avoided AutoGPT-style autonomous loops to prevent infinite loops and ensure reliable, structured output for the dashboard.
- **RAG / Vector Databases**:
  - *Left out*: We intentionally left out a heavy Vector Database (like Pinecone) for this MVP. Hardcoding the agent prompts with structured outputs was sufficient for demonstrating the architecture without over-engineering the deployment process.

## Example Runs

### MSFT (Microsoft)
- **Verdict**: BUY (95% Confidence)
- **Moat**: Wide Moat (High switching costs for Enterprise Software, Cloud Infrastructure).
- **Bull Case**: Dominance in AI via OpenAI partnership, Azure growth, and Office 365 recurring revenue.
- **Bear Case**: High valuation multiples, macroeconomic tech spending slowdowns.

### TSLA (Tesla)
- **Verdict**: WATCH (60% Confidence)
- **Moat**: Narrow Moat (Brand strength and Supercharger network, but facing increasing EV competition).
- **Bull Case**: FSD (Full Self-Driving) software margins, energy storage growth.
- **Bear Case**: Price cuts hurting automotive gross margins, rising competition in China (BYD).

## What I would improve with more time

1. **Real-Time Data Integration**: Connect the agents to the Yahoo Finance API or Polygon.io so they aren't relying on the LLM's training data cutoff.
2. **RAG implementation**: Add a vector database to ingest real-time SEC 10-K filings and earnings call transcripts for the agents to cite.
3. **Multi-Agent Parallelism**: Run the Financial, Risk, and Moat agents in parallel within LangGraph to reduce the total response time to under 2 seconds.

---

## 🏆 Bonus Points: LLM Chat Transcript Included!

This entire project was built via pair programming with an advanced AI agent. 
You can find the full, raw conversation transcript (showing the LLM's thought process, tool calls, and problem-solving) included in this folder as `LLM_Chat_Transcript.jsonl`.
