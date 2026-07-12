import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";

export const getLLM = (temperature = 0) => {
  return new ChatGoogleGenerativeAI({
    modelName: "gemini-2.5-flash",
    maxOutputTokens: 8192,
    temperature,
    apiKey: process.env.GOOGLE_API_KEY,
  });
};

export const createStructuredChain = async <T>(
  schema: any, // Zod schema
  systemPrompt: string,
  temperature = 0
) => {
  const llm = getLLM(temperature);
  // We use withStructuredOutput provided by the model directly if possible,
  // or we can use generic output parser.
  // The Gemini Chat model supports withStructuredOutput using JSON schema.
  const modelWithStructure = llm.withStructuredOutput(schema);
  
  const prompt = PromptTemplate.fromTemplate(
    `${systemPrompt}\n\nUser Request: {input}`
  );

  return prompt.pipe(modelWithStructure);
};
