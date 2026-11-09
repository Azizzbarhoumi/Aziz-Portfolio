import test from "node:test";
import assert from "node:assert/strict";
import { renderAssistantMarkdown } from "../lib/chat-markdown.ts";

test("assistant replies render emphasis, responsive tables, and br tags safely", () => {
  const reply = `**Project Highlights**\n\n| Project | Role | Key Achievements |\n| --- | --- | --- |\n| City Brain | Agentic AI | Detect accidents<br>Trigger actuators |`;
  const html = renderAssistantMarkdown(reply);

  assert.match(html, /<strong>Project Highlights<\/strong>/);
  assert.match(html, /<div class="chat-table-wrap"><table>/);
  assert.match(html, /<td>Detect accidents<br>Trigger actuators<\/td>/);
});

test("orphan markdown markers from an incomplete model response are not shown literally", () => {
  const html = renderAssistantMarkdown("Here are Ahmed's experiences:\n\n**Technical Skills**\n\n**");
  assert.match(html, /<strong>Technical Skills<\/strong>/);
  assert.doesNotMatch(html, /<p>\*\*<\/p>/);
});

test("assistant markdown escapes raw HTML instead of rendering it", () => {
  const html = renderAssistantMarkdown("<img src=x onerror=alert(1)>");
  assert.doesNotMatch(html, /<img\b/i);
  assert.match(html, /&lt;img/);
});
