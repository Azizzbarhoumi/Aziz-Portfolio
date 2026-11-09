import { writeFileSync } from "node:fs";
import path from "node:path";
import nextEnv from "@next/env";
import { buildEmbeddedKnowledge, hashKnowledge, loadAzizKnowledge } from "../lib/portfolio-chat.ts";

nextEnv.loadEnvConfig(process.cwd());

const apiKey = process.env.QWEN_API_KEY;
const providerArg = process.argv.find((argument) => argument.startsWith("--provider="))?.slice("--provider=".length);
const provider = providerArg || process.env.EMBEDDING_PROVIDER || "gemini";
if (provider !== "gemini" && provider !== "qwen") throw new Error("EMBEDDING_PROVIDER must be gemini or qwen.");
const embeddingApiKey = provider === "gemini" ? process.env.GEMINI_API_KEY : apiKey;
if (!embeddingApiKey) throw new Error(`${provider === "gemini" ? "GEMINI_API_KEY" : "QWEN_API_KEY"} must be set in .env.local or the environment to build the vector index.`);

const knowledge = loadAzizKnowledge();
const modelArg = process.argv.find((argument) => argument.startsWith("--model="))?.slice("--model=".length);
const model = modelArg || process.env.EMBEDDING_MODEL || (provider === "gemini" ? "gemini-embedding-001" : process.env.QWEN_EMBEDDING_MODEL || "text-embedding-v3");
const chunks = await buildEmbeddedKnowledge(knowledge, { apiKey: embeddingApiKey, model, provider });
const output = {
  version: 2,
  provider,
  model,
  knowledgeHash: hashKnowledge(knowledge),
  chunks,
};
const outputPath = path.join(process.cwd(), "knowledge", "aziz.vectors.json");
writeFileSync(outputPath, `${JSON.stringify(output)}\n`, "utf8");
console.log(`Indexed ${chunks.length} portfolio chunks with ${provider}/${model}.`);
