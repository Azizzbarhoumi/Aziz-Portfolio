import MarkdownIt from "markdown-it";

const markdown = new MarkdownIt({ html: false, linkify: true, breaks: true, typographer: false }).enable(["table"]);

export function renderAssistantMarkdown(content: string) {
  const marker = "CHAT_SAFE_BREAK_8F20B";
  const normalized = content.replace(/^\s*(?:\*\*|__|~~)\s*$/gm, "").trim();
  const rendered = markdown.render(normalized.replace(/<br\s*\/?>/gi, marker)).replaceAll(marker, "<br>");
  return rendered.replace(/<table>/g, '<div class="chat-table-wrap"><table>').replace(/<\/table>/g, "</table></div>");
}
