import { NextRequest, NextResponse } from "next/server";
import { compileGraph } from "@/agents/graph";
import { HumanMessage } from "@langchain/core/messages";

export async function POST(req: NextRequest) {
  try {
    const { ticker } = await req.json();

    if (!ticker) {
      return NextResponse.json({ error: "Ticker symbol is required" }, { status: 400 });
    }

    const app = compileGraph();
    
    // Initial state
    const initialState = {
      messages: [new HumanMessage(`Research the company with ticker symbol: ${ticker}`)],
      ticker: ticker.toUpperCase(),
    };

    // Note: LangGraph requires a checkpointer for threads but for single-shot we don't strictly need one 
    // if we don't plan to resume the thread. But passing it is fine or we can omit configurable if no memory is setup.
    const finalState = await app.invoke(initialState, {
      configurable: { thread_id: `thread-${Date.now()}` },
    });

    return NextResponse.json(finalState);
  } catch (error: any) {
    console.error("Error in research API:", error);
    return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 });
  }
}
