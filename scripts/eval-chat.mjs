import nextEnv from "@next/env";
import { getPortfolioAnswer, loadAzizKnowledge } from "../lib/portfolio-chat.ts";

nextEnv.loadEnvConfig(process.cwd());

const passingQuestions = [
  { question: "What does Aziz study?", terms: ["ENSIT", "Applied Mathematics and Modelling", "Data Science"] },
  { question: "What is AgriMent?", terms: ["Talan", "second place", "generative AI", "VLM", "FastAPI"] },
  { question: "What stack does NeuroLearn use?", terms: ["Flask", "React", "TypeScript", "TailwindCSS", "Groq", "Mistral", "OpenAI Whisper"] },
  { question: "What projects has Aziz worked on?", terms: ["AgriConnect", "Data Extraction Tool at ProVerdy", "NeuroLearn AI", "City Brain Convergence", "FakeGuard AI", "Emotion Recognition from Speech"] },
  { question: "What experience and leadership does Aziz have?", terms: ["AgriConnect", "Data Extraction Tool at ProVerdy", "Human Resources Manager", "IEEE ENSIT"] },
  { question: "Which models were compared in FakeGuard?", terms: ["BERT", "CNN-LSTM", "classical baselines", "WELFake"] },
  { question: "What certifications does he have?", terms: ["Fundamentals of Deep Learning", "NVIDIA", "Introduction to Data Engineering", "Introduction to AI", "365 Data Science"] },
  { question: "How can I contact him?", terms: ["azizbr438@gmail.com", "linkedin.com/in/aziz-barhoumi-320bb9339"], forbids: ["+216", "58 714 686"] },
];

const refusalQuestions = [
  "Did he build a crop-yield model from satellite imagery?",
  "How much did he reduce manual entry time at ProVerdy?",
  "How many members did he recruit at IEEE?",
  "What is his GPA?",
  "What is his salary expectation?",
];

const knowledge = loadAzizKnowledge();
if (!process.env.QWEN_API_KEY) throw new Error("QWEN_API_KEY must be set in .env.local or the environment to run the live evaluation.");

const customQuestionArg = process.argv.find((argument) => argument.startsWith("--question="));
const customQuestion = customQuestionArg?.slice("--question=".length);
if (!process.argv.includes("--smoke") && !customQuestion) {
  console.log("TEST QUESTION: What does Aziz study?\n");
  console.log("The chat request embeds this question, retrieves the closest indexed portfolio chunks, and passes only those chunks to Qwen.\n");
}

const numericFacts = new Set((knowledge.match(/\d+(?:[-.]\d+)*(?:\+|%)?/g) ?? []).flatMap((value) => value.match(/\d+/g) ?? []));
const allCases = [
  ...passingQuestions.map((item) => ({ ...item, expected: "answer" })),
  ...refusalQuestions.map((question) => ({ question, expected: "refusal" })),
];
const casesToRun = customQuestion ? [{ question: customQuestion, expected: "answer" }] : process.argv.includes("--smoke") ? allCases.slice(0, 1) : allCases;

let completedCases = 0;
let failedCases = 0;
for (const [index, item] of casesToRun.entries()) {
  let answer;
  let finishReason;
  let usageMetadata;
  let sources;
  try {
    ({ answer, finishReason, usageMetadata, sources } = await getPortfolioAnswer([{ role: "user", content: item.question }]));
  } catch (error) {
    const causeCode = error && typeof error === "object" && "cause" in error && error.cause && typeof error.cause === "object" && "code" in error.cause ? String(error.cause.code) : "";
    const reason = `${error instanceof Error ? error.message : "unknown error"}${causeCode ? ` (${causeCode})` : ""}`;
    console.error(`\nUNAVAILABLE — live Qwen evaluation stopped on question ${index + 1}/${casesToRun.length}: ${reason}`);
    process.exitCode = 1;
    break;
  }
  const normalizedAnswer = answer.toLowerCase();
  const issues = [];
  if (item.expected === "refusal") {
    if (!normalizedAnswer.includes("that isn't in aziz's portfolio")) issues.push("Expected the portfolio refusal.");
  } else {
    for (const term of item.terms ?? []) if (!normalizedAnswer.includes(term.toLowerCase())) issues.push(`Missing “${term}”.`);
    for (const forbidden of item.forbids ?? []) if (answer.includes(forbidden)) issues.push("Sensitive phone number included.");
  }
  for (const value of answer.match(/\d+/g) ?? []) if (!numericFacts.has(value)) issues.push(`Number ${value} is not in the knowledge file.`);
  if (finishReason === "length") issues.push("Qwen stopped at the output token limit.");
  completedCases += 1;
  if (issues.length) failedCases += 1;
  console.log(`\n[${index + 1}/${casesToRun.length}] ${issues.length ? "FAIL" : "PASS"} — ${item.question}${issues.length ? `\nChecks: ${issues.join(" ")}` : ""}\nRetrieved: ${sources?.map(({ source, score }) => `${source} (${score.toFixed(3)})`).join(", ") || "no relevant passage"}\nFinish: ${finishReason ?? "not provided"}; tokens: ${usageMetadata?.totalTokenCount ?? "not provided"} (thinking ${usageMetadata?.thoughtsTokenCount ?? "not provided"})\n${answer}`);
}

if (completedCases === casesToRun.length && failedCases === 0) console.log(`\nPASS — ${casesToRun.length} live Qwen evaluation cases.`);
else if (completedCases === casesToRun.length) {
  console.error(`\nFAIL — ${failedCases}/${casesToRun.length} live Qwen evaluation cases.`);
  process.exitCode = 1;
}
