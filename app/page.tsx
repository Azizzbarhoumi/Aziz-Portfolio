"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowDownRight, ArrowUpRight, Download, MoveUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { SectionHeading } from "@/components/site-shell";
import { Reveal, HeroReveal, MagneticLink, RevealGroup, RevealItem, chipIn, dotIn, flipIn, maskLine, revealItem, slideIn, useGroupReveal } from "@/components/motion";
import { ChapterRail, ScrollProgress, ScrollWords, SkillsScene, TimelineTrace, pinQuery, useConverge, useHeroRecede, useScrollScene } from "@/components/scroll-scenes";
import { ProjectShowcase } from "@/components/project-showcase";
import { Stats } from "@/components/stats";
import { ContactActions, ContactForm } from "@/components/contact-form";
import { BrandIcon } from "@/components/brand-icon";
import { SkillsTicker } from "@/components/skills-ticker";
import { PortraitFrame } from "@/components/portrait-frame";
import { HeroName } from "@/components/hero-name";
import { useI18n } from "@/lib/i18n";

const skillsEn = [
  { title: "Generative AI & agentic systems", items: ["LLMs", "RAG", "ChromaDB", "LangChain / LangGraph", "Prompt engineering", "MCP", "A2A", "n8n", "Vision-language models"] },
  { title: "Machine learning & deep learning", items: ["Scikit-learn", "XGBoost", "PyTorch", "TensorFlow", "CNN / CNN-LSTM", "Transformers / BERT", "TF-IDF", "OCR", "ML pipelines"] },
  { title: "Programming", items: ["Python", "Java", "C / C++", "JavaScript", "TypeScript", "MATLAB", "PL/SQL"] },
  { title: "Data & backend", items: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "PostgreSQL", "MySQL", "MongoDB", "FastAPI", "Flask", "REST APIs"] },
  { title: "Development & integration", items: ["Docker", "Git", "Streamlit", "React", "TailwindCSS", "Selenium", "BeautifulSoup", "Groq / Mistral / OpenAI", "Whisper"] },
];

const skillsFr = [
  { title: "IA générative & systèmes agentiques", items: ["LLMs", "RAG", "ChromaDB", "LangChain / LangGraph", "Prompt engineering", "MCP", "A2A", "n8n", "Modèles vision-langage"] },
  { title: "Machine learning & deep learning", items: ["Scikit-learn", "XGBoost", "PyTorch", "TensorFlow", "CNN / CNN-LSTM", "Transformers / BERT", "TF-IDF", "OCR", "Pipelines ML"] },
  { title: "Programmation", items: ["Python", "Java", "C / C++", "JavaScript", "TypeScript", "MATLAB", "PL/SQL"] },
  { title: "Données & backend", items: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "PostgreSQL", "MySQL", "MongoDB", "FastAPI", "Flask", "APIs REST"] },
  { title: "Développement & intégration", items: ["Docker", "Git", "Streamlit", "React", "TailwindCSS", "Selenium", "BeautifulSoup", "Groq / Mistral / OpenAI", "Whisper"] },
];

const experiencesEn = [
  {
    date: "SECOND-YEAR INTERNSHIP · 2 MONTHS",
    title: "AI Agricultural Platform · Talan",
    place: "Second place · Talan internship challenge",
    href: "/projects/agriconnect",
    linkLabel: "Explore AgriConnect case study",
    whatIDid: "Led end-to-end FastAPI backend development and multi-agent pipeline integration for farmer advisory and pest detection.",
  },
  {
    date: "FIRST-YEAR INTERNSHIP · 2 MONTHS · 2024",
    title: "Data Extraction Tool · ProVerdy",
    place: "Automated research workflow",
    href: "/projects/proverdy-data-extraction",
    linkLabel: "Explore ProVerdy case study",
    whatIDid: "Built automated scraping pipelines with Selenium and BeautifulSoup to extract MENA financial/sustainability reports and LinkedIn profiles.",
  },
  {
    date: "LEADERSHIP",
    title: "Human Resources Manager",
    place: "IEEE ENSIT Student Branch",
    whatIDid: "Managed HR operations, member onboarding, and community engagement initiatives for the IEEE ENSIT Student Branch.",
  },
];

const experiencesFr = [
  {
    date: "STAGE DE 2E ANNÉE · 2 MOIS",
    title: "Plateforme d’IA agricole · Talan",
    place: "2e place · Challenge de stage Talan",
    href: "/projects/agriconnect",
    linkLabel: "Explorer l'étude de cas AgriConnect",
    whatIDid: "Conception du backend FastAPI de bout en bout et intégration multi-agents pour le conseil agricole et la détection visuelle de nuisibles (2e place).",
  },
  {
    date: "STAGE DE 1RE ANNÉE · 2 MOIS · 2024",
    title: "Outil d'extraction de données · ProVerdy",
    place: "Workflow de recherche automatisé",
    href: "/projects/proverdy-data-extraction",
    linkLabel: "Explorer l'étude de cas ProVerdy",
    whatIDid: "Développement d'un outil de scraping automatisé avec Selenium et BeautifulSoup pour extraire des rapports financiers/ESG et profils LinkedIn.",
  },
  {
    date: "ENGAGEMENT ASSOCIATIF",
    title: "Responsable Ressources Humaines",
    place: "IEEE ENSIT Student Branch",
    whatIDid: "Gestion des opérations RH, accueil et intégration des membres, et animation des initiatives de la branche étudiante.",
  },
];

const educationEn = [
  { date: "2026 — 2027", title: "Research Master’s Degree in Data Science", place: "ENSIT · Higher National School of Engineers of Tunis" },
  { date: "2024 — 2027", title: "Engineering Degree in Applied Mathematics & Modelling", place: "ENSIT · Higher National School of Engineers of Tunis" },
  { date: "2022 — 2024", title: "Preparatory Cycle · Physics-Chemistry", place: "Tunis" },
  { date: "2022", title: "Baccalaureate", place: "Experimental Sciences · Lycée Bab Elkhadhra · Tunis" },
];

const educationFr = [
  { date: "2026 — 2027", title: "Master de recherche en Data Science", place: "ENSIT · École Nationale Supérieure d'Ingénieurs de Tunis" },
  { date: "2024 — 2027", title: "Diplôme d’ingénieur en Mathématiques Appliquées & Modélisation", place: "ENSIT · École Nationale Supérieure d'Ingénieurs de Tunis" },
  { date: "2022 — 2024", title: "Cycle préparatoire · Physique-Chimie", place: "Tunis" },
  { date: "2022", title: "Baccalauréat", place: "Sciences Expérimentales · Lycée Bab Elkhadhra · Tunis" },
];


/**
 * Scroll-linked entrance for the full-bleed inverted panels: they open from slightly inset with
 * rounded corners to full width as they move up the viewport. Follows scroll position only.
 */
function usePanelOpen(target: React.RefObject<HTMLElement | null>) {
  const reduce = !useScrollScene();
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "start 0.3"] });
  const inset = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [5, 0]);
  const radius = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [28, 0]);
  return useMotionTemplate`inset(0% ${inset}% 0% ${inset}% round ${radius}px)`;
}

const certifications = [
  "Fundamentals of Deep Learning|NVIDIA",
  "Introduction to Data Engineering|365 Data Science",
  "Introduction to AI|365 Data Science",
];

export default function Home() {
  const { lang, t } = useI18n();
  const heroRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const contactTitleRef = useRef<HTMLHeadingElement>(null);
  const heroRecede = useHeroRecede(heroRef);
  const pinned = useScrollScene(pinQuery);
  const converge = useConverge(contactTitleRef);
  const skillsClip = usePanelOpen(skillsRef);
  const contactClip = usePanelOpen(contactRef);
  const contactHeadingGroup = useGroupReveal(0.1);
  const certGroup = useGroupReveal(0.12, 0.2);

  const skills = lang === "fr" ? skillsFr : skillsEn;
  const experiences = lang === "fr" ? experiencesFr : experiencesEn;
  const education = lang === "fr" ? educationFr : educationEn;
  const chapters = useMemo(
    () => [
      { id: "top", label: "A/B" },
      { id: "about", label: t("nav.about") },
      { id: "projects", label: t("nav.projects") },
      { id: "skills", label: t("skills.eyebrow") },
      { id: "experience", label: t("nav.experience") },
      { id: "education", label: t("nav.education") },
      { id: "contact", label: t("nav.contact") },
    ],
    [t],
  );
  const contactLines = t("contact.title1").split("\n");

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ahmed Aziz Barhoumi",
    jobTitle: lang === "fr" ? "Élève-Ingénieur IA & Data Science" : "AI & Data Science Engineering Student",
    email: "mailto:azizbr438@gmail.com",
    address: { "@type": "PostalAddress", addressLocality: "Tunis", addressCountry: "TN" },
    sameAs: [
      "https://www.linkedin.com/in/aziz-barhoumi-320bb9339",
      "https://github.com/Azizzbarhoumi",
    ],
  };

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <ScrollProgress />
      <ChapterRail chapters={chapters} />
      <div className="hero-chapter">
      <section className="hero" id="top" aria-labelledby="hero-title" ref={heroRef}>
        <motion.span className="hero-dim" aria-hidden="true" style={{ opacity: heroRecede.dim }} />
        <div className="hero-topline">
          <span className="eyebrow">{t("hero.eyebrow")}</span>
        </div>
        <motion.div className="hero-grid" style={heroRecede.grid}>
          <div className="hero-copy">
            <HeroName />
            <h1 id="hero-title">
              <span><HeroReveal delay={0.08}>{t("hero.title1")}</HeroReveal></span>
              <span><HeroReveal delay={0.2}>{t("hero.title2")}</HeroReveal></span>
              <span className="hero-outline"><HeroReveal delay={0.32}>{t("hero.title3")}</HeroReveal></span>
            </h1>
            <div className="hero-subline">
              <span className="mono-label">{t("hero.internshipTarget")}</span>
              <p>{t("hero.intro")}</p>
            </div>
            <div className="hero-ctas">
              <MagneticLink className="button button-primary" href="#projects">
                {t("hero.viewProjects")} <ArrowDownRight size={17} />
              </MagneticLink>
              <MagneticLink
                className="button button-cv"
                href={t("nav.cvHref")}
                download={t("nav.cvFileName")}
                target="_blank"
              >
                <span className="button-cv-icon" aria-hidden="true"><Download size={16} strokeWidth={2} /></span>
                {t("nav.downloadCV")}
                <span className="button-cv-tag" aria-hidden="true">PDF</span>
              </MagneticLink>
              <MagneticLink
                className="button button-quiet"
                href="https://github.com/Azizzbarhoumi"
                target="_blank"
                rel="noreferrer"
                aria-label="Aziz Barhoumi on GitHub"
              >
                GitHub <ArrowUpRight size={16} />
              </MagneticLink>
              <MagneticLink className="button button-quiet hero-contact" href="#contact">
                {t("hero.getInTouch")} <ArrowUpRight size={16} />
              </MagneticLink>
            </div>
            <div className="hero-status">
              <span className="status-light" /> {t("hero.status")}
            </div>
          </div>
          <div className="hero-portrait-wrap">
            <PortraitFrame />
          </div>
        </motion.div>
        <div className="hero-bottom">
          <span className="eyebrow">{t("hero.intent")}</span>
          <a href="#about" className="scroll-cue">
            <span>{t("hero.scroll")}</span>
            <ArrowDown size={15} />
          </a>
          <span className="hero-bottom-right">36°48′ N&nbsp;&nbsp; 10°10′ E</span>
        </div>
      </section>

      <div className="stats-band" aria-label="Portfolio highlights">
        <Stats
          projectCount={projects.length}
          internshipCount={experiences.filter((item) => item.date.includes("STAGE") || item.date.includes("INTERNSHIP")).length}
          certificationCount={certifications.length}
        />
      </div>
      <SkillsTicker />

      <section id="about" className="section section-about">
        <div className="section-shell">
          <SectionHeading index="01" label={t("about.eyebrow")} title={t("about.title")} />
          <RevealGroup className="about-grid" stagger={0.16}>
            <RevealItem className="about-intro">
              <span className="mono-label">{t("about.mono")}</span>
              <ScrollWords segments={lang === "fr" ? [
                { text: "J'évolue à la croisée de l'" },
                { text: "IA générative et de l'ingénierie des systèmes", strong: true },
                { text: " — concevant des architectures agentiques, intégrant des modèles de langage et menant des pipelines de machine learning de la théorie au déploiement." },
              ] : [
                { text: "I work at the intersection of " },
                { text: "generative AI and systems design", strong: true },
                { text: " — building agentic architectures, integrating language models, and taking machine learning pipelines from idea to deployment." },
              ]} />
              <ScrollWords segments={[{ text: lang === "fr"
                ? "Fort d'un socle solide en mathématiques appliquées, je m'attache à comprendre le comportement des modèles et à garantir la robustesse des systèmes qui les exploitent."
                : "Grounded in applied mathematics, I care about understanding how models behave and making sure the systems around them work in practice." }]} />
            </RevealItem>
            <RevealItem className="about-aside">
              <span className="about-marker">[ BASE / TN ]</span>
              <p>{t("about.aside")}</p>
              <div className="language-list">
                <span>{t("about.languages")}</span>
                <p>
                  {lang === "fr" ? (
                    <>Arabe <i>Natif</i><b>·</b> Anglais <i>Intermédiaire</i><b>·</b> Français <i>Intermédiaire</i></>
                  ) : (
                    <>Arabic <i>Native</i><b>·</b> English <i>Intermediate</i><b>·</b> French <i>Intermediate</i></>
                  )}
                </p>
              </div>
              <span className="location-line">
                {t("about.location")} <MoveUpRight size={13} />
              </span>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>
      </div>

      <section id="projects" className="section section-projects">
        <div className="section-shell">
          <div className="projects-heading-row">
            <SectionHeading index="02" label={t("projects.eyebrow")} title={t("projects.title")} />
            <span className="project-count">{t("projects.count")}</span>
          </div>
          <ProjectShowcase projects={projects} />
          <Reveal className="projects-footnote">
            <span>{t("projects.footnote1")}</span>
            <span>
              {t("projects.footnote2")} <ArrowUpRight size={13} />
            </span>
          </Reveal>
        </div>
      </section>

      <motion.section className={`skills-invert ${pinned ? "is-pinned" : ""}`} id="skills" ref={skillsRef} style={{ clipPath: skillsClip }}>
        {pinned ? (
          <SkillsScene groups={skills} heading={<SectionHeading index="03" label={t("skills.eyebrow")} title={t("skills.title")} inverted />} />
        ) : (
        <div className="section-shell">
          <SectionHeading index="03" label={t("skills.eyebrow")} title={t("skills.title")} inverted />
          <RevealGroup className="skills-grid" stagger={0.1}>
            {skills.map((group, index) => (
              <RevealItem className="skill-group" key={group.title}>
                <span className="skill-index">0{index + 1}</span>
                <div>
                  <h3>{group.title}</h3>
                  <div className="skill-chips">
                    {group.items.map((item) => (
                      <motion.span key={item} variants={chipIn}>{item}</motion.span>
                    ))}
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
        )}
      </motion.section>

      <section id="experience" className="section section-experience">
        <div className="section-shell">
          <SectionHeading index="04" label={t("experience.eyebrow")} title={t("experience.title")} />
          <div className="timeline-scene" ref={timelineRef}>
          <TimelineTrace target={timelineRef} />
          <RevealGroup className="timeline" stagger={0.12}>
            {experiences.map((item) =>
              item.date.includes("LEADERSHIP") || item.date.includes("ENGAGEMENT") ? (
                <RevealItem className="leadership-layout" key={item.title}>
                  <span data-trace className="trace-anchor" />
                  <div className="leadership-entry">
                    <motion.span className="timeline-dot" variants={dotIn} />
                    <span className="timeline-date">{item.date}</span>
                    <div className="timeline-copy">
                      <h3>{item.title}</h3>
                      <p>{item.place}</p>
                      {item.whatIDid && <p className="experience-contribution">{item.whatIDid}</p>}
                    </div>
                  </div>
                </RevealItem>
              ) : (
                <RevealItem className="timeline-row experience-row" key={item.title}>
                  <span data-trace className="trace-anchor" />
                  <motion.span className="timeline-dot" variants={dotIn} />
                  <span className="timeline-date">{item.date}</span>
                  <div className="timeline-copy">
                    <h3>{item.title}</h3>
                    <p>{item.place}</p>
                    {item.whatIDid && <p className="experience-contribution">{item.whatIDid}</p>}
                    {item.href && (
                      <Link className="experience-project-link" href={item.href}>
                        {item.linkLabel}
                        <ArrowUpRight size={14} />
                      </Link>
                    )}
                  </div>
                  {item.href && <ArrowUpRight className="timeline-arrow" size={16} />}
                </RevealItem>
              )
            )}
          </RevealGroup>
          </div>
        </div>
      </section>

      <section id="education" className="section section-education">
        <div className="section-shell">
          <SectionHeading index="05" label={t("education.eyebrow")} title={t("education.title")} />
          <RevealGroup className="timeline education-timeline" stagger={0.12}>
            {education.map((item) => (
              <RevealItem className="timeline-row" key={item.title} variants={slideIn}>
                <motion.span className="timeline-dot" variants={dotIn} />
                <span className="timeline-date">{item.date}</span>
                <div className="timeline-copy">
                  <h3>{item.title}</h3>
                  <p>{item.place}</p>
                </div>
                <span className="timeline-arrow" aria-hidden="true" />
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal className="credentials-grid education-credentials" id="certifications">
            <div className="credentials-block">
              <span className="eyebrow">{t("education.certifications")}</span>
              <motion.ul {...certGroup}>
                {certifications.map((item) => {
                  const [name, issuer] = item.split("|");
                  return (
                    <motion.li key={name} data-reveal variants={flipIn}>
                      <span>{name}</span>
                      <i>{issuer}</i>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </div>
          </Reveal>
        </div>
      </section>

      <motion.section id="contact" className="contact-section" ref={contactRef} style={{ clipPath: contactClip }}>
        <div className="section-shell">
          <motion.div className="contact-heading" {...contactHeadingGroup}>
            <motion.span className="eyebrow" data-reveal variants={revealItem}>{t("contact.eyebrow")}</motion.span>
            <h2 ref={contactTitleRef}>
              {contactLines.map((line, index) => (
                <motion.span className="mask-line" key={index} style={{ x: index % 2 === 0 ? converge.left : converge.right }}>
                  <motion.span className="mask-line-inner" data-reveal variants={maskLine}>{line}</motion.span>
                </motion.span>
              ))}
              <motion.span className="mask-line" style={{ x: contactLines.length % 2 === 0 ? converge.left : converge.right }}>
                <motion.span className="mask-line-inner" data-reveal variants={maskLine}>
                  <span>{t("contact.title2")}</span>
                </motion.span>
              </motion.span>
            </h2>
            <motion.p data-reveal variants={revealItem}>{t("contact.sub")}</motion.p>
          </motion.div>
          <RevealGroup className="contact-grid" stagger={0.14}>
            <RevealItem className="contact-details">
              <span className="contact-label">{t("contact.bestWay")}</span>
              <a className="email-link" href="mailto:azizbr438@gmail.com" aria-label="Email Ahmed Aziz Barhoumi">
                <BrandIcon brand="gmail" />
              </a>
              <ContactActions />
              <div className="contact-links">
                <a
                  href="https://github.com/Azizzbarhoumi"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Ahmed Aziz Barhoumi on GitHub"
                  title="GitHub"
                >
                  <BrandIcon brand="github" />
                </a>
                <a
                  href="https://www.linkedin.com/in/aziz-barhoumi-320bb9339"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Ahmed Aziz Barhoumi on LinkedIn"
                  title="LinkedIn"
                >
                  <BrandIcon brand="linkedin" />
                </a>
              </div>
              <span className="contact-location">{t("about.location")}</span>
            </RevealItem>
            <RevealItem>
              <ContactForm />
            </RevealItem>
          </RevealGroup>
        </div>
      </motion.section>
    </main>
  );
}
