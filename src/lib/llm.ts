import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

export const getLLM = (temperature = 0) => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing from environment variables.");
  }

  return new ChatGroq({
    model: "llama-3.3-70b-versatile",
    temperature,
    apiKey,
  });
};

import { StructuredOutputParser } from "@langchain/core/output_parsers";

export const createStructuredChain = <T>(
  schema: any, // Zod schema
  promptTemplate: string,
  modelParams?: any
) => {
  const llm = getLLM(modelParams?.temperature || 0);
  
  // Use StructuredOutputParser instead of native tool calling
  // This avoids Groq's strict 400 errors for malformed tool arguments
  const parser = StructuredOutputParser.fromZodSchema(schema);
  
  const prompt = PromptTemplate.fromTemplate(
    promptTemplate + "\n\nInput: {input}\n\n{format_instructions}"
  );
  
  return RunnableSequence.from([
    {
      input: (input: any) => input.input,
      format_instructions: () => parser.getFormatInstructions(),
    },
    prompt,
    llm,
    parser,
  ]);
};
