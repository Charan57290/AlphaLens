# AlphaLens AI 🔍

> Institutional-Grade AI Investment Research Agent

AlphaLens AI is a next-generation, multi-agent investment research platform built with Next.js, LangGraph, and Google Gemini. It doesn't just summarize data; it thinks like an investment analyst by synthesizing financials, news, risks, and economic moats to deliver data-backed recommendations (BUY, WATCH, PASS).

## 🚀 Features

- **Multi-Agent Workflow**: Six specialized AI agents working synchronously (Research, Financial Health, News Sentiment, Risk Assessment, Moat, and Decision).
- **Premium Dashboard**: A highly polished, interactive UI with Framer Motion animations and Glassmorphism styling.
- **Bull vs Bear Debate**: Two AI personas debating the pros and cons of the investment.
- **Dynamic Scenarios**: "What Could Change My Decision" analysis to highlight critical catalysts.
- **Explain Like I'm 15**: A toggle to simplify complex institutional research for beginners.
- **Confidence Meter**: Animated gauge displaying the AI's confidence in its recommendation.

## 🏗️ Architecture

- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS 4, Framer Motion, Shadcn UI
- **Backend Orchestration**: LangGraph.js & LangChain.js
- **LLM**: Gemini 2.5 Flash (`@langchain/google-genai`)
- **Deployment**: Vercel Ready

## 📂 Folder Structure

\`\`\`
src/
├── agents/       # LangGraph Nodes & Workflow compilation
├── app/          # Next.js Pages & API Routes
├── components/   # UI Components (Shadcn, Framer Motion)
├── lib/          # LLM utilities and configurations
├── types/        # Zod Schemas & TypeScript interfaces
\`\`\`

## ⚙️ Setup

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/Charan57290/AlphaLens.git
   cd AlphaLens
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Set up Environment Variables:
   Rename \`.env.local.template\` to \`.env.local\` and add your Google Gemini API key:
   \`\`\`
   GOOGLE_API_KEY=your_gemini_api_key
   \`\`\`
4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## 🧠 AI Workflow (LangGraph)

1. User enters a Ticker Symbol.
2. The **Graph** initializes and kicks off 5 parallel agents.
3. The parallel agents collect structured output for Financials, News, Risk, etc.
4. The **Decision Agent** aggregates the state and produces the final Verdict and Debate.
5. The UI renders the fully structured result in real-time.

## 📜 License
MIT License
