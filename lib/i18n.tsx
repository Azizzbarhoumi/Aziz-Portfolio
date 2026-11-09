"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Language = "en" | "fr";

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    "nav.about": "About",
    "nav.projects": "Projects",
    "nav.experience": "Experience",
    "nav.education": "Education",
    "nav.contact": "Contact",
    "nav.available": "Available for internships",
    "nav.downloadCV": "Download CV",
    "nav.cvHref": "/Ahmed-Aziz-Barhoumi-CV.pdf",
    "nav.cvFileName": "Ahmed-Aziz-Barhoumi-CV.pdf",
    "nav.switchLang": "Passer en français",

    // Hero
    "hero.eyebrow": "AI & DATA SCIENCE ENGINEERING · TUNIS, TN",
    "hero.title1": "BUILDING AI",
    "hero.title2": "SYSTEMS THAT",
    "hero.title3": "ACTUALLY SHIP.",
    "hero.internshipTarget": "> INTERNSHIP TARGET: 4–6 months",
    "hero.intro": "Engineering student in Applied Mathematics and Data Science, focused on Generative AI and agentic systems, looking for an internship.",
    "hero.viewProjects": "View projects",
    "hero.getInTouch": "Get in touch",
    "hero.status": "OPEN TO INTERNSHIP OPPORTUNITIES",
    "hero.scroll": "SCROLL TO EXPLORE",
    "hero.intent": "BUILDING WITH INTENT / SHIPPING WITH CARE",

    // Stats
    "stats.projects": "projects built",
    "stats.internships": "internships completed",
    "stats.talan": "Talan internship challenge",
    "stats.certifications": "certifications",

    // About
    "about.eyebrow": "ABOUT",
    "about.title": "Systems-minded.\nPeople-focused.",
    "about.mono": "A PRACTICAL ENGINEER’S MINDSET",
    "about.p1": "I work at the intersection of generative AI and systems design — building agentic architectures, integrating language models, and taking machine learning pipelines from idea to deployment.",
    "about.p2": "Grounded in applied mathematics, I care about understanding how models behave and making sure the systems around them work in practice.",
    "about.aside": "Third-year Engineering student in Applied Mathematics & Modelling at ENSIT, concurrently pursuing a Research Master’s in Data Science.",
    "about.languages": "LANGUAGES",
    "about.languagesVal": "Arabic Native · English Intermediate · French Intermediate",
    "about.location": "TUNIS, TUNISIA",

    // Projects
    "projects.eyebrow": "SELECTED WORK",
    "projects.title": "Projects in practice.",
    "projects.count": "06 / SELECTED",
    "projects.footnote1": "SIX PROJECTS / SIX CASE STUDIES",
    "projects.footnote2": "OPEN A CASE STUDY TO EXPLORE",

    // Toolkit
    "skills.eyebrow": "TOOLKIT",
    "skills.title": "A broad toolkit.\nA clear focus.",

    // Experience
    "experience.eyebrow": "EXPERIENCE",
    "experience.title": "Experience",

    // Education
    "education.eyebrow": "EDUCATION",
    "education.title": "Grounded in mathematics.",
    "education.certifications": "CERTIFICATIONS / 03",

    // Contact
    "contact.eyebrow": "06 / CONTACT — TUNIS, TN",
    "contact.title1": "Let’s build",
    "contact.title2": "something together.",
    "contact.sub": "Open to internship opportunities and thoughtful conversations about AI, data, and systems.",
    "contact.bestWay": "EMAIL / BEST WAY TO REACH ME",
    "contact.copy": "Copy email address",
    "contact.copied": "Copied to clipboard",
    "contact.subject": "Subject",
    "contact.subjectPlaceholder": "Internship opportunity",
    "contact.message": "Message",
    "contact.messagePlaceholder": "Tell me a little about what you have in mind...",
    "contact.compose": "Compose email",
    "contact.opening": "Opening your email app",
    "contact.formNote": "This opens a prefilled draft in your email app.",

    // Footer
    "footer.backToTop": "BACK TO TOP",
    "footer.tagline": "BUILDING WITH INTENT / SHIPPING WITH CARE",

    // Chat
    "chat.launcher": "Ask about Aziz",
    "chat.header": "Ask about Aziz",
    "chat.sub": "Portfolio assistant",
    "chat.welcome": "What would you like to know?",
    "chat.welcomeP": "Explore Aziz’s projects, skills, experience, and contact details.",
    "chat.placeholder": "Ask a question…",
    "chat.privacy": "Gemini searches relevant portfolio details; Qwen writes replies.",
    "chat.sugProjects": "What projects has Aziz worked on?",
    "chat.sugSkills": "What are Aziz’s technical skills?",
    "chat.sugExperience": "Tell me about Aziz’s experience.",
    "chat.sugContact": "How can I contact Aziz?",

    // Detail
    "detail.back": "ALL PROJECTS",
    "detail.technologies": "TECHNOLOGIES",
    "detail.need": "THE NEED / 01",
    "detail.built": "WHAT I BUILT / 02",
    "detail.role": "MY ROLE / 03",
    "detail.result": "RESULT / IMPACT / 04",
    "detail.previous": "PREVIOUS",
    "detail.next": "NEXT",
    "detail.question": "HAVE A QUESTION ABOUT THIS PROJECT?",
    "detail.talk": "Let’s talk",
  },
  fr: {
    // Nav
    "nav.about": "À propos",
    "nav.projects": "Projets",
    "nav.experience": "Expérience",
    "nav.education": "Formation",
    "nav.contact": "Contact",
    "nav.available": "Disponible pour un stage (4-6 mois)",
    "nav.downloadCV": "Télécharger le CV",
    "nav.cvHref": "/Stage_CV.pdf",
    "nav.cvFileName": "Stage_CV.pdf",
    "nav.switchLang": "Switch to English",

    // Hero
    "hero.eyebrow": "INGÉNIERIE IA & DATA SCIENCE · TUNIS, TN",
    "hero.title1": "CONCEVOIR DES",
    "hero.title2": "SYSTÈMES IA QUI",
    "hero.title3": "PASSENT EN PROD.",
    "hero.internshipTarget": "> OBJECTIF DE STAGE : 4–6 mois (dès maintenant)",
    "hero.intro": "Étudiant ingénieur en Mathématiques Appliquées & Data Science, spécialisé en IA générative et architectures agentiques, à la recherche d'un stage opérationnel.",
    "hero.viewProjects": "Voir les projets",
    "hero.getInTouch": "Me contacter",
    "hero.status": "À L'ÉCOUTE D'OPPORTUNITÉS DE STAGE",
    "hero.scroll": "DÉFILER POUR DÉCOUVRIR",
    "hero.intent": "CONÇU AVEC RIGUEUR / DÉPLOYÉ AVEC SOIN",

    // Stats
    "stats.projects": "projets réalisés",
    "stats.internships": "stages effectués",
    "stats.talan": "challenge de stage Talan",
    "stats.certifications": "certifications",

    // About
    "about.eyebrow": "À PROPOS",
    "about.title": "Rigueur système.\nImpact concret.",
    "about.mono": "UNE APPROCHE D'INGÉNIEUR DE TERRAIN",
    "about.p1": "J'évolue à la croisée de l'IA générative et de l'ingénierie des systèmes — concevant des architectures agentiques, intégrant des modèles de langage et menant des pipelines de machine learning de la théorie au déploiement.",
    "about.p2": "Fort d'un socle solide en mathématiques appliquées, je m'attache à comprendre le comportement des modèles et à garantir la robustesse des systèmes opérationnels.",
    "about.aside": "Élève-ingénieur de 3e année en Mathématiques Appliquées & Modélisation à l'ENSIT, menant en parallèle un Master de Recherche en Data Science.",
    "about.languages": "LANGUES",
    "about.languagesVal": "Arabe Natif · Anglais Intermédiaire · Français Intermédiaire",
    "about.location": "TUNIS, TUNISIE",

    // Projects
    "projects.eyebrow": "RÉALISATIONS",
    "projects.title": "Projets & réalisations.",
    "projects.count": "06 / SÉLECTIONNÉS",
    "projects.footnote1": "SIX PROJETS / SIX ÉTUDES DE CAS",
    "projects.footnote2": "OUVRIR UNE ÉTUDE DE CAS",

    // Toolkit
    "skills.eyebrow": "COMPÉTENCES",
    "skills.title": "Une boîte à outils étendue.\nUne vision claire.",

    // Experience
    "experience.eyebrow": "EXPÉRIENCE & LEADERSHIP",
    "experience.title": "Expérience",

    // Education
    "education.eyebrow": "FORMATION",
    "education.title": "Ancré dans les mathématiques.",
    "education.certifications": "CERTIFICATIONS / 03",

    // Contact
    "contact.eyebrow": "06 / CONTACT — TUNIS, TN",
    "contact.title1": "Construisons",
    "contact.title2": "quelque chose ensemble.",
    "contact.sub": "À l'écoute d'opportunités de stage et disponible pour échanger sur vos projets en IA, données et architectures de systèmes.",
    "contact.bestWay": "EMAIL / LE MEILLEUR MOYEN DE ME JOINDRE",
    "contact.copy": "Copier l'adresse email",
    "contact.copied": "Adresse copiée !",
    "contact.subject": "Sujet",
    "contact.subjectPlaceholder": "Proposition de stage / Opportunité",
    "contact.message": "Message",
    "contact.messagePlaceholder": "Parlez-moi de votre équipe, de vos besoins ou de votre projet...",
    "contact.compose": "Composer un email",
    "contact.opening": "Ouverture de votre messagerie...",
    "contact.formNote": "Ceci pré-remplit un brouillon dans votre client mail.",

    // Footer
    "footer.backToTop": "RETOURNER EN HAUT",
    "footer.tagline": "CONÇU AVEC RIGUEUR / DÉPLOYÉ AVEC SOIN",

    // Chat
    "chat.launcher": "Demander sur Aziz",
    "chat.header": "Demander sur Aziz",
    "chat.sub": "Assistant du portfolio",
    "chat.welcome": "Que souhaitez-vous savoir ?",
    "chat.welcomeP": "Découvrez les projets, compétences, stages et coordonnées d'Aziz.",
    "chat.placeholder": "Posez votre question…",
    "chat.privacy": "Gemini recherche les détails pertinents ; Qwen rédige les réponses.",
    "chat.sugProjects": "Quels sont les projets d'Aziz ?",
    "chat.sugSkills": "Quelles sont les compétences d'Aziz ?",
    "chat.sugExperience": "Parle-moi de l'expérience et des stages d'Aziz.",
    "chat.sugContact": "Comment contacter Aziz ?",

    // Detail
    "detail.back": "TOUS LES PROJETS",
    "detail.technologies": "TECHNOLOGIES",
    "detail.need": "LE BESOIN / 01",
    "detail.built": "CE QUE J'AI CONSTRUIT / 02",
    "detail.role": "MON RÔLE / 03",
    "detail.result": "RÉSULTAT & IMPACT / 04",
    "detail.previous": "PRÉCÉDENT",
    "detail.next": "SUIVANT",
    "detail.question": "UNE QUESTION SUR CE PROJET ?",
    "detail.talk": "Discutons-en",
  },
};

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  toggleLang: () => {},
  t: (key: string) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-lang");
    if (saved === "fr" || saved === "en") {
      setLangState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  function setLang(next: Language) {
    setLangState(next);
    localStorage.setItem("portfolio-lang", next);
    document.documentElement.lang = next;
  }

  function toggleLang() {
    setLang(lang === "en" ? "fr" : "en");
  }

  function t(key: string): string {
    return translations[lang]?.[key] ?? translations.en[key] ?? key;
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
