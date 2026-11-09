import test from "node:test";
import assert from "node:assert/strict";
import { buildCurrentQuestion, buildKnowledgeChunks, buildQwenPayload, buildSystemPrompt, cosineSimilarity, getPortfolioAnswer, loadAzizKnowledge, retrieveKnowledge, REFUSAL_ANSWER, MAX_OUTPUT_TOKENS, TEMPERATURE } from "../lib/portfolio-chat.ts";
import { CHAT_REQUEST_HISTORY_LIMIT, toChatRequestMessages } from "../lib/chat-messages.ts";

test("the single knowledge file has all requested sections and excludes the phone number", () => {
  const knowledge = loadAzizKnowledge();
  for (const heading of ["Profile", "Education", "Skills", "Experience", "Projects", "Certifications", "Leadership", "Languages", "Contact"])
    assert.match(knowledge, new RegExp(`## ${heading}`));
  assert.match(knowledge, /azizbr438@gmail\.com/);
  assert.match(knowledge, /linkedin\.com\/in\/aziz-barhoumi-320bb9339/);
  assert.doesNotMatch(knowledge, /\+216|58 714 686/);
});

test("the system prompt is grounded only in retrieved passages", () => {
  const prompt = buildSystemPrompt("Section: Skills\nPython and Java.");
  assert.match(prompt, /Answer ONLY from RETRIEVED KNOWLEDGE/);
  assert.match(prompt, /never invent or estimate facts/i);
  assert.match(prompt, /Be complete before being concise/);
  assert.match(prompt, /include the dataset whenever the passage names one/i);
  assert.ok(prompt.endsWith("Section: Skills\nPython and Java."));
  assert.doesNotMatch(prompt, /NeuroLearn|AgriConnect/);
});

test("knowledge is split into heading-aware chunks and cosine similarity ranks vectors", () => {
  const chunks = buildKnowledgeChunks("# Aziz\n\n## Skills\n\nPython, Java, and React.\n\n## Projects\n\n### NeuroLearn AI\n\nAdaptive platform built with Flask.");
  assert.equal(chunks.length, 2);
  assert.match(chunks[0].text, /Section: Skills/);
  assert.equal(chunks[1].section, "NeuroLearn AI");
  assert.equal(chunks[1].parentSection, "Projects");
  assert.match(chunks[1].text, /Section: Projects > NeuroLearn AI/);
  assert.equal(cosineSimilarity([1, 0], [0.8, 0.6]), 0.8);
});

test("a broad experience query retrieves every internship and leadership passage", async () => {
  const knowledge = "## Experience\n\n### AgriConnect\n\nSecond-year internship at Talan.\n\n### Data Extraction Tool at ProVerdy\n\nFirst-year internship using Selenium.\n\n## Leadership\n\nHuman Resources Manager at IEEE ENSIT.";
  const fetcher = async (_url, options) => {
    const { input } = JSON.parse(options.body);
    const inputs = Array.isArray(input) ? input : [input];
    return { ok: true, json: async () => ({ data: inputs.map((_, index) => ({ index, embedding: [1, 0, 0] })) }) };
  };
  const results = await retrieveKnowledge("What experience and leadership does Aziz have?", knowledge, { apiKey: "test-only", provider: "qwen", model: "all-experience-test", fetcher });
  assert.deepEqual(results.map(({ section }) => section), ["AgriConnect", "Data Extraction Tool at ProVerdy", "Leadership"]);
});

test("retrieval embeds the question and returns the closest portfolio passage", async () => {
  const knowledge = "## Skills\n\nPython and Java.\n\n## Projects\n\n### NeuroLearn AI\n\nAdaptive platform built with Flask.";
  const fetcher = async (_url, options) => {
    const { input } = JSON.parse(options.body);
    const inputs = Array.isArray(input) ? input : [input];
    return { ok: true, json: async () => ({ data: inputs.map((value, index) => ({ index, embedding: /neurolearn|adaptive|flask/i.test(value) ? [1, 0, 0] : [0, 1, 0] })) }) };
  };
  const results = await retrieveKnowledge("What does NeuroLearn use?", knowledge, { apiKey: "test-only", model: "test-embeddings", provider: "qwen", fetcher });
  assert.equal(results[0].section, "NeuroLearn AI");
  assert.equal(results[0].score, 1.16);
});

test("retrieval returns no passage when semantic similarity is below the grounding threshold", async () => {
  const fetcher = async (_url, options) => {
    const { input } = JSON.parse(options.body);
    const inputs = Array.isArray(input) ? input : [input];
    return { ok: true, json: async () => ({ data: inputs.map((value, index) => ({ index, embedding: /unrelated/i.test(value) ? [0, 1, 0] : [1, 0, 0] })) }) };
  };
  const results = await retrieveKnowledge("An unrelated topic", "## Skills\n\nPython and Java.", { apiKey: "test-only", model: "no-match-test", provider: "qwen", fetcher, minScore: 0.2 });
  assert.equal(results.length, 0);
});

test("section intent promotes the relevant chunk and removes unrelated near-ties", async () => {
  const knowledge = "## Profile\n\nAI engineering student in Tunis.\n\n## Skills\n\nPython, Java, and machine learning.\n\n## Contact\n\nEmail and LinkedIn.";
  const fetcher = async (_url, options) => {
    const { input } = JSON.parse(options.body);
    const inputs = Array.isArray(input) ? input : [input];
    return { ok: true, json: async () => ({ data: inputs.map((_, index) => ({ index, embedding: [1, 0] })) }) };
  };
  const results = await retrieveKnowledge("technical skills", knowledge, { apiKey: "test-only", provider: "qwen", model: "section-focus-test", fetcher });
  assert.deepEqual(results.map(({ section }) => section), ["Skills"]);
});

test("a broad portfolio projects query retrieves every project chunk", async () => {
  const knowledge = ["AgriConnect", "Data Extraction Tool at ProVerdy", "NeuroLearn AI", "City Brain Convergence", "FakeGuard AI", "Emotion Recognition from Speech"]
    .map((name) => `### ${name}\n\nA project description for ${name}.`).join("\n\n");
  const fetcher = async (_url, options) => {
    const { input } = JSON.parse(options.body);
    const inputs = Array.isArray(input) ? input : [input];
    return { ok: true, json: async () => ({ data: inputs.map((_, index) => ({ index, embedding: [1, 0, 0] })) }) };
  };
  const results = await retrieveKnowledge("What projects has Aziz worked on?", knowledge, { apiKey: "test-only", provider: "qwen", model: "all-projects-test", fetcher });
  assert.equal(results.length, 6);
  assert.deepEqual(results.map(({ section }) => section), ["AgriConnect", "Data Extraction Tool at ProVerdy", "NeuroLearn AI", "City Brain Convergence", "FakeGuard AI", "Emotion Recognition from Speech"]);
});

test("Gemini embeddings distinguish indexed documents from search queries", async () => {
  const calls = [];
  const fetcher = async (url, options) => {
    const payload = JSON.parse(options.body);
    calls.push({ url, options, payload });
    const embeddings = payload.requests.map(() => ({ values: [1, 0] }));
    return { ok: true, json: async () => ({ embeddings }) };
  };
  const results = await retrieveKnowledge("What programming skills?", "## Skills\n\nPython and Java.", { apiKey: "gemini-test-only", provider: "gemini", model: "gemini-embedding-test", fetcher });
  assert.equal(results[0].section, "Skills");
  assert.equal(calls.length, 2);
  assert.match(calls[0].url, /gemini-embedding-test:batchEmbedContents$/);
  assert.equal(calls[0].options.headers["x-goog-api-key"], "gemini-test-only");
  assert.ok(calls.some(({ payload }) => payload.requests[0].taskType === "RETRIEVAL_DOCUMENT"));
  assert.ok(calls.some(({ payload }) => payload.requests[0].taskType === "RETRIEVAL_QUERY"));
});

test("Qwen payload answers only the current question instead of merging unrelated history", () => {
  const messages = Array.from({ length: 10 }, (_, index) => ({ role: index % 2 ? "assistant" : "user", content: `turn ${index}` }));
  const payload = buildQwenPayload(messages, "trusted data", "eval-model");
  assert.equal(payload.model, "eval-model");
  assert.equal(payload.temperature, TEMPERATURE);
  assert.equal(payload.max_tokens, MAX_OUTPUT_TOKENS);
  assert.equal(MAX_OUTPUT_TOKENS, 1000);
  assert.equal(payload.messages.length, 2);
  assert.equal(payload.messages[1].content, "turn 8");
  assert.match(payload.messages[0].content, /trusted data/);
});

test("short follow-ups include only the immediately previous user question", () => {
  const messages = [
    { role: "user", content: "What are Aziz's technical skills?" },
    { role: "assistant", content: "old generated answer" },
    { role: "user", content: "What is AgriMent?" },
    { role: "assistant", content: "another generated answer" },
    { role: "user", content: "What did it use?" },
  ];
  assert.equal(buildCurrentQuestion(messages), "Earlier user question (reference only; do not answer it): What is AgriMent?\nCurrent question (answer only this): What did it use?");
  assert.equal(buildCurrentQuestion([...messages.slice(0, 2), { role: "user", content: "internships" }]), "internships");
});

test("chat request history remains within the API limit and retains the latest exchange", () => {
  const conversation = Array.from({ length: 15 }, (_, index) => ({
    role: index % 2 === 0 ? "user" : "assistant",
    content: `message ${index}`,
  }));
  const requestMessages = toChatRequestMessages(conversation);
  assert.equal(requestMessages.length, CHAT_REQUEST_HISTORY_LIMIT);
  assert.deepEqual(requestMessages[0], { role: "assistant", content: "message 3" });
  assert.deepEqual(requestMessages.at(-1), { role: "user", content: "message 14" });
});

test("the route and evaluator share the same Qwen completion function", async () => {
  const requests = [];
  const fetcher = async (url, options) => {
    const payload = JSON.parse(options.body);
    requests.push({ url, options, payload });
    if (url.endsWith("/embeddings")) {
      const inputs = Array.isArray(payload.input) ? payload.input : [payload.input];
      return { ok: true, json: async () => ({ data: inputs.map((value, index) => ({ index, embedding: /neurolearn|adaptive|flask/i.test(value) ? [1, 0, 0] : [0, 1, 0] })) }) };
    }
    return { ok: true, json: async () => ({ choices: [{ message: { content: "Grounded answer." }, finish_reason: "stop" }] }) };
  };
  const knowledge = "## Projects\n\n### NeuroLearn AI\n\nAdaptive platform built with Flask.";
  const result = await getPortfolioAnswer([{ role: "user", content: "What does NeuroLearn use?" }], { apiKey: "test-only", fetcher, knowledge, embeddingModel: "test-embeddings", embeddingProvider: "qwen" });
  assert.equal(result.answer, "Grounded answer.");
  assert.equal(result.finishReason, "stop");
  const chatRequest = requests.find(({ url }) => url.endsWith("/chat/completions"));
  const embeddingRequest = requests.find(({ url }) => url.endsWith("/embeddings"));
  assert.ok(embeddingRequest);
  assert.ok(embeddingRequest.payload.input.some((passage) => passage.includes("Adaptive platform")));
  assert.equal(chatRequest.url, "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions");
  assert.equal(chatRequest.options.headers.Authorization, "Bearer test-only");
  assert.match(chatRequest.payload.messages[0].content, /Adaptive platform built with Flask/);
  assert.doesNotMatch(chatRequest.payload.messages[0].content, /Python and Java/);
  assert.deepEqual(result.sources.map(({ source }) => source), ["NeuroLearn AI"]);
});

test("the answer function refuses before generation when no chunk is relevant", async () => {
  const calls = [];
  const fetcher = async (url, options) => {
    calls.push(url);
    const { input } = JSON.parse(options.body);
    const inputs = Array.isArray(input) ? input : [input];
    return { ok: true, json: async () => ({ data: inputs.map((value, index) => ({ index, embedding: /outside-topic/i.test(value) ? [0, 1, 0] : [1, 0, 0] })) }) };
  };
  const result = await getPortfolioAnswer([{ role: "user", content: "An outside-topic question" }], {
    apiKey: "test-only", fetcher, knowledge: "## Skills\n\nPython and Java.", embeddingModel: "refusal-embeddings", embeddingProvider: "qwen",
  });
  assert.equal(result.answer, REFUSAL_ANSWER);
  assert.equal(result.finishReason, "retrieval_no_match");
  assert.equal(calls.some((url) => url.endsWith("/chat/completions")), false);
});
