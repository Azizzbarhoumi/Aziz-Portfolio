export const CHAT_REQUEST_HISTORY_LIMIT = 12;

export type ChatRequestMessage = { role: "user" | "assistant"; content: string };

/** Keep the newest conversation context within the API route's accepted limit. */
export function toChatRequestMessages(messages: ChatRequestMessage[]) {
  return messages.slice(-CHAT_REQUEST_HISTORY_LIMIT).map(({ role, content }) => ({ role, content }));
}
