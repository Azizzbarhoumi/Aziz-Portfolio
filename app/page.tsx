"use client";

import Link from "next/link";
import { ArrowDown, ArrowDownRight, ArrowUpRight, MoveUpRight } from "lucide-react";
import { projects, getLocalizedProject } from "@/data/projects";
import { SectionHeading } from "@/components/site-shell";
import { Reveal, HeroReveal, MagneticLink } from "@/components/motion";
import { Stats } from "@/components/stats";
import { ContactActions, ContactForm } from "@/components/contact-form";
import { BrandIcon } from "@/components/brand-icon";
import { SkillsTicker } from "@/components/skills-ticker";
import { PortraitFrame } from "@/components/portrait-frame";
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

const certifications = [
  "Fundamentals of Deep Learning|NVIDIA",
  "Introduction to Data Engineering|365 Data Science",
  "Introduction to AI|365 Data Science",
];

export default function Home() {
  const { lang, t } = useI18n();

  const skills = lang === "fr" ? skillsFr : skillsEn;
  const experiences = lang === "fr" ? experiencesFr : experiencesEn;
  const education = lang === "fr" ? educationFr : educationEn;

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
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-topline">
          <span className="eyebrow">{t("hero.eyebrow")}</span>
        </div>
        <div className="hero-grid">
          <div className="hero-copy">
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
                className="button button-quiet"
                href={t("nav.cvHref")}
                download={t("nav.cvFileName")}
                target="_blank"
              >
                {t("nav.downloadCV")} <ArrowUpRight size={16} />
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
        </div>
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
          <div className="about-grid">
            <Reveal className="about-intro">
              <span className="mono-label">{t("about.mono")}</span>
              <p>
                {lang === "fr" ? (
                  <>J&apos;évolue à la croisée de l&apos;<strong>IA générative et de l&apos;ingénierie des systèmes</strong> — concevant des architectures agentiques, intégrant des modèles de langage et menant des pipelines de machine learning de la théorie au déploiement.</>
                ) : (
                  <>I work at the intersection of <strong>generative AI and systems design</strong> — building agentic architectures, integrating language models, and taking machine learning pipelines from idea to deployment.</>
                )}
              </p>
              <p>
                {lang === "fr" ? (
                  <>Fort d&apos;un socle solide en mathématiques appliquées, je m&apos;attache à comprendre le comportement des modèles et à garantir la robustesse des systèmes qui les exploitent.</>
                ) : (
                  <>Grounded in applied mathematics, I care about understanding how models behave and making sure the systems around them work in practice.</>
                )}
              </p>
            </Reveal>
            <Reveal delay={0.12} className="about-aside">
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
            </Reveal>
          </div>
        </div>
      </section>

      <section id="projects" className="section section-projects">
        <div className="section-shell">
          <div className="projects-heading-row">
            <SectionHeading index="02" label={t("projects.eyebrow")} title={t("projects.title")} />
            <span className="project-count">{t("projects.count")}</span>
          </div>
          <div className="project-list">
            {projects.map((rawProject) => {
              const project = getLocalizedProject(rawProject, lang);
              const Row = (
                <>
                  <div className="project-row-main">
                    <span className="project-number">{project.number}</span>
                    <div>
                      <h3>{project.title}</h3>
                      <p>{project.subtitle}</p>
                    </div>
                    <span className="project-context">{project.result}</span>
                    <span className="project-year">{project.year}</span>
                    <span className="project-arrow" aria-hidden="true">
                      <ArrowUpRight size={19} />
                    </span>
                  </div>
                  <div className="project-row-expanded">
                    <div className="project-row-summary-copy">
                      <p>{project.summary}</p>
                      <div className="project-tags">
                        <span className="project-category">{project.category}</span>
                        <span className="project-status">{project.status === "Case study" ? (lang === "fr" ? "Étude de cas" : "Case study") : (lang === "fr" ? "Résumé" : "Summary only")}</span>
                      </div>
                    </div>
                    <div className="tag-list">
                      {project.technologies.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </>
              );

              return project.status === "Case study" ? (
                <Link
                  href={`/projects/${project.slug}`}
                  className={`project-row ${project.slug === "agriconnect" ? "project-row-featured" : ""}`}
                  key={project.slug}
                >
                  {Row}
                </Link>
              ) : (
                <article className="project-row project-row-summary" key={project.slug}>
                  {Row}
                  {project.links.githubUrl && (
                    <a
                      className="summary-repo"
                      href={project.links.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${project.title} GitHub repository`}
                    >
                      <BrandIcon brand="github" />
                    </a>
                  )}
                </article>
              );
            })}
          </div>
          <div className="projects-footnote">
            <span>{t("projects.footnote1")}</span>
            <span>
              {t("projects.footnote2")} <ArrowUpRight size={13} />
            </span>
          </div>
        </div>
      </section>

      <section className="skills-invert" id="skills">
        <div className="section-shell">
          <SectionHeading index="03" label={t("skills.eyebrow")} title={t("skills.title")} inverted />
          <div className="skills-grid">
            {skills.map((group, index) => (
              <Reveal className="skill-group" delay={index * 0.05} key={group.title}>
                <span className="skill-index">0{index + 1}</span>
                <div>
                  <h3>{group.title}</h3>
                  <div className="skill-chips">
                    {group.items.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="section section-experience">
        <div className="section-shell">
          <SectionHeading index="04" label={t("experience.eyebrow")} title={t("experience.title")} />
          <div className="timeline">
            {experiences.map((item, index) =>
              item.date.includes("LEADERSHIP") || item.date.includes("ENGAGEMENT") ? (
                <Reveal className="leadership-layout" delay={index * 0.045} key={item.title}>
                  <div className="leadership-entry">
                    <span className="timeline-dot" />
                    <span className="timeline-date">{item.date}</span>
                    <div className="timeline-copy">
                      <h3>{item.title}</h3>
                      <p>{item.place}</p>
                      {item.whatIDid && <p className="experience-contribution">{item.whatIDid}</p>}
                    </div>
                  </div>
                </Reveal>
              ) : (
                <Reveal className="timeline-row experience-row" delay={index * 0.045} key={item.title}>
                  <span className="timeline-dot" />
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
                </Reveal>
              )
            )}
          </div>
        </div>
      </section>

      <section id="education" className="section section-education">
        <div className="section-shell">
          <SectionHeading index="05" label={t("education.eyebrow")} title={t("education.title")} />
          <div className="timeline education-timeline">
            {education.map((item, index) => (
              <Reveal className="timeline-row" delay={index * 0.045} key={item.title}>
                <span className="timeline-dot" />
                <span className="timeline-date">{item.date}</span>
                <div className="timeline-copy">
                  <h3>{item.title}</h3>
                  <p>{item.place}</p>
                </div>
                <span className="timeline-arrow" aria-hidden="true" />
              </Reveal>
            ))}
          </div>
          <div className="credentials-grid education-credentials" id="certifications">
            <div className="credentials-block">
              <span className="eyebrow">{t("education.certifications")}</span>
              <ul>
                {certifications.map((item) => {
                  const [name, issuer] = item.split("|");
                  return (
                    <li key={name}>
                      <span>{name}</span>
                      <i>{issuer}</i>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="section-shell">
          <div className="contact-heading">
            <span className="eyebrow">{t("contact.eyebrow")}</span>
            <h2>
              {t("contact.title1")}
              <br />
              <span>{t("contact.title2")}</span>
            </h2>
            <p>{t("contact.sub")}</p>
          </div>
          <div className="contact-grid">
            <div className="contact-details">
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
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
