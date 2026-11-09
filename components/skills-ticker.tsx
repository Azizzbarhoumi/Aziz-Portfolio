"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const termsEn = ["PYTHON", "GENERATIVE AI", "RAG", "FASTAPI", "MACHINE LEARNING", "AGENTIC SYSTEMS", "TYPESCRIPT", "COMPUTER VISION"];
const termsFr = ["PYTHON", "IA GÉNÉRATIVE", "RAG", "FASTAPI", "MACHINE LEARNING", "SYSTÈMES AGENTIQUES", "TYPESCRIPT", "VISION PAR ORDINATEUR"];

export function SkillsTicker() {
  const [paused, setPaused] = useState(false);
  const { lang } = useI18n();
  const terms = lang === "fr" ? termsFr : termsEn;

  return (
    <section className="marquee-band" aria-label="Technology areas">
      <div className={`marquee-track ${paused ? "is-paused" : ""}`} aria-hidden="true">
        {[...terms, ...terms].map((term, index) => (
          <span key={`${term}-${index}`}>
            {term}<i> / </i>
          </span>
        ))}
      </div>
      <button
        className="ticker-toggle"
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-label={paused ? (lang === "fr" ? "Lancer le défilement" : "Play skills ticker") : (lang === "fr" ? "Mettre en pause" : "Pause skills ticker")}
        aria-pressed={paused}
      >
        {paused ? <Play size={14}/> : <Pause size={14}/>}
        <span>{paused ? (lang === "fr" ? "Lecture" : "Play") : (lang === "fr" ? "Pause" : "Pause")}</span>
      </button>
      <div className="ticker-static" aria-label={terms.join(", ")}>
        {terms.map((term) => <span key={term}>{term}</span>)}
      </div>
    </section>
  );
}
