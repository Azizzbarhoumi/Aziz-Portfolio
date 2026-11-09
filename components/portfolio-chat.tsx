"use client";

import Link from "next/link";
import DOMPurify from "dompurify";
import { toChatRequestMessages } from "@/lib/chat-messages";
import { renderAssistantMarkdown } from "@/lib/chat-markdown";
import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { ArrowUp, MessageCircle, Minus, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type Source = { title: string; source: string; href: string };
type Message = { role: "user" | "assistant"; content: string; sources?: Source[] };

function AssistantMarkdown({ content }: { content: string }) {
  const [html, setHtml] = useState("");
  useEffect(() => {
    const rendered = renderAssistantMarkdown(content);
    setHtml(DOMPurify.sanitize(rendered, { FORBID_TAGS: ["style", "iframe", "svg", "math"], FORBID_ATTR: ["style"] }));
  }, [content]);
  return html
    ? <div className="chat-markdown" dangerouslySetInnerHTML={{ __html: html }} />
    : <div className="chat-markdown" role="status" aria-label="Formatting reply" />;
}

export function PortfolioChat() {
  const { lang, t } = useI18n();
  const suggestions = lang === "fr" ? [
    { label: "Projets", question: "Quels sont les projets d'Aziz ?" },
    { label: "Compétences", question: "Quelles sont les compétences d'Aziz ?" },
    { label: "Expérience", question: "Parle-moi des stages et de l'expérience d'Aziz." },
    { label: "Contact", question: "Comment contacter Aziz ?" },
  ] : [
    { label: "Projects", question: "What projects has Aziz worked on?" },
    { label: "Skills", question: "What are Aziz’s technical skills?" },
    { label: "Experience", question: "Tell me about Aziz’s experience." },
    { label: "Contact", question: "How can I contact Aziz?" },
  ];

  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesArea = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpen(localStorage.getItem("portfolio-chat-open") === "true");
    setReady(true);
  }, []);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  useEffect(() => {
    const area = messagesArea.current;
    if (area) {
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      area.scrollTo({ top: area.scrollHeight, behavior });
    }
  }, [messages, busy, open]);

  function setPanelOpen(next: boolean) {
    setOpen(next);
    localStorage.setItem("portfolio-chat-open", String(next));
    if (!next) requestAnimationFrame(() => launcherRef.current?.focus());
  }

  async function send(value = input) {
    const question = value.trim();
    if (!question || busy) return;
    const nextMessages: Message[] = [...messages, { role: "user", content: question }];
    setMessages(nextMessages);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: toChatRequestMessages(nextMessages) }),
      });
      const result = await response.json() as { answer?: string; sources?: Source[]; error?: string };
      if (!response.ok) throw new Error(result.error || "I couldn’t send that question. Please try again.");
      setMessages((current) => [...current, { role: "assistant", content: result.answer || "I couldn’t find an answer to that.", sources: result.sources }]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "I couldn’t send that question. Please try again.");
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send();
  }

  function handleInputKey(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send();
    }
  }

  function resizeInput(event: ChangeEvent<HTMLTextAreaElement>) {
    setInput(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${Math.min(event.target.scrollHeight, 120)}px`;
  }

  function handlePanelKey(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") { event.preventDefault(); setPanelOpen(false); }
    if (event.key !== "Tab" || !open) return;
    const panel = event.currentTarget;
    const focusable = [...panel.querySelectorAll<HTMLElement>('button:not(:disabled), textarea:not(:disabled), a[href]')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  return <div className="portfolio-chat">
    <section id="portfolio-chat-panel" className={`chat-panel${ready && open ? " is-open" : ""}`} aria-label={t("chat.header")} aria-hidden={!ready || !open} aria-modal="false" role="dialog" inert={!ready || !open} onKeyDown={handlePanelKey}>
      <header className="chat-header"><div className="chat-brand"><span className="chat-status-dot"/><div><strong>{t("chat.header")}</strong><small>{t("chat.sub")}</small></div></div><div className="chat-header-actions"><button type="button" className="chat-close" aria-label="Minimize chat" title="Minimize" onClick={() => setPanelOpen(false)}><Minus size={17}/></button><button type="button" className="chat-close" aria-label="Close chat" title="Close" onClick={() => setPanelOpen(false)}><X size={17}/></button></div></header>
      <div className="chat-messages" ref={messagesArea} aria-live="polite" aria-relevant="additions text">
        {messages.length === 0 && <div className="chat-welcome"><span className="chat-eyebrow">PORTFOLIO GUIDE</span><h2>{t("chat.welcome")}</h2><p>{t("chat.welcomeP")}</p><div className="chat-suggestions">{suggestions.map(({label,question}) => <button key={label} type="button" onClick={() => void send(question)}>{label}</button>)}</div></div>}
        {messages.map((message, index) => <article className={`chat-message ${message.role}`} key={`${index}-${message.role}`}>{message.role === "assistant" ? <AssistantMarkdown content={message.content}/> : <p>{message.content}</p>}{message.sources && message.sources.length > 0 && <div className="chat-sources"><span>SOURCES</span>{message.sources.map((source) => <Link key={source.href} href={source.href} onClick={() => setPanelOpen(false)}>{source.source}</Link>)}</div>}</article>)}
        {busy && <div className="chat-message assistant chat-loading" role="status">Thinking<span aria-hidden="true"><i/><i/><i/></span></div>}
        {error && <p className="chat-error" role="alert">{error}</p>}
      </div>
      <form className="chat-form" onSubmit={submit}><label className="sr-only" htmlFor="portfolio-chat-input">{t("chat.placeholder")}</label><textarea ref={inputRef} id="portfolio-chat-input" rows={1} value={input} maxLength={1200} onChange={resizeInput} onKeyDown={handleInputKey} placeholder={t("chat.placeholder")} disabled={busy}/><button type="submit" aria-label="Send question" disabled={busy || !input.trim()}><ArrowUp size={17}/></button></form>
      <p className="chat-privacy">{t("chat.privacy")}</p>
    </section>
    <button ref={launcherRef} type="button" className={`chat-launcher${ready && open ? " is-open" : ""}`} aria-label={ready && open ? "Chat is open" : t("chat.launcher")} aria-expanded={ready && open} aria-controls="portfolio-chat-panel" onClick={() => setPanelOpen(!open)}>{ready && open ? <MessageCircle size={18}/> : <><MessageCircle size={17}/><span>{t("chat.launcher")}</span></>}</button>
  </div>;
}
