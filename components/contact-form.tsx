"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function ContactActions() {
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();

  async function copyEmail() {
    await navigator.clipboard.writeText("azizbr438@gmail.com");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button className="copy-email" onClick={copyEmail} type="button">
      {copied ? t("contact.copied") : t("contact.copy")}
      {copied ? <Check size={15} /> : <Copy size={15} />}
    </button>
  );
}

export function ContactForm() {
  const [ready, setReady] = useState(false);
  const { t, lang } = useI18n();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const defaultSubject = lang === "fr" ? "Opportunité de stage" : "Portfolio inquiry";
    const greeting = lang === "fr" ? "Bonjour Ahmed,\n\n" : "Hi Ahmed,\n\n";
    const subject = encodeURIComponent(String(data.get("subject") || defaultSubject));
    const body = encodeURIComponent(`${greeting}${String(data.get("message") || "")}`);
    setReady(true);
    window.location.href = `mailto:azizbr438@gmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <label>
        {t("contact.subject")}
        <input name="subject" required placeholder={t("contact.subjectPlaceholder")} />
      </label>
      <label>
        {t("contact.message")}
        <textarea name="message" rows={3} required placeholder={t("contact.messagePlaceholder")} />
      </label>
      <button className="button button-light" type="submit">
        {ready ? t("contact.opening") : t("contact.compose")}
        <ArrowUpRight size={16} />
      </button>
      <p className="form-note">{t("contact.formNote")}</p>
    </form>
  );
}
