"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import { Project, getLocalizedProject } from "@/data/projects";
import { BrandIcon } from "@/components/brand-icon";
import { ProjectGallery } from "@/components/project-artwork";
import { useI18n } from "@/lib/i18n";

export function ProjectDetailView({
  project: rawProject,
  previous: rawPrevious,
  next: rawNext,
}: {
  project: Project;
  previous: Project;
  next: Project;
}) {
  const { lang, t } = useI18n();
  const project = getLocalizedProject(rawProject, lang);
  const previous = getLocalizedProject(rawPrevious, lang);
  const next = getLocalizedProject(rawNext, lang);

  return (
    <main id="main" className="detail-page">
      <section className="detail-hero section-shell">
        <Link className="back-link" href="/#projects">
          <ArrowLeft size={15} /> {t("detail.back")}
        </Link>
        <div className="detail-kicker">
          <span>
            {lang === "fr" ? "PROJET" : "PROJECT"} / {project.number} · {project.category} · {project.status}
          </span>
          <span>{project.year}</span>
        </div>
        <h1>
          {project.title}
          <span>{project.subtitle}</span>
        </h1>
        <p className="detail-summary">{project.summary}</p>
        <div className="detail-project-links" aria-label={`${project.title} links`}>
          {project.links.githubUrl && (
            <a
              href={project.links.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.title} GitHub repository`}
              title="GitHub repository"
            >
              <BrandIcon brand="github" />
              <span className="sr-only">GitHub repository</span>
            </a>
          )}
          {project.links.demoUrl && (
            <a href={project.links.demoUrl} target="_blank" rel="noreferrer" aria-label={`${project.title} live app`}>
              <ExternalLink size={17} />
              <span>{lang === "fr" ? "Application en ligne" : "Live app"}</span>
            </a>
          )}
          {project.links.caseStudyUrl && (
            <a href={project.links.caseStudyUrl} target="_blank" rel="noreferrer" aria-label={`${project.title} case study`}>
              <ArrowUpRight size={17} />
              <span>{lang === "fr" ? "Étude de cas" : "Case study"}</span>
            </a>
          )}
        </div>
        {project.interfaceLanguageNote && <p className="interface-language-note">{project.interfaceLanguageNote}</p>}

        {project.screenshots && project.screenshots.length > 0 && (
          <div className="detail-hero-art">
            <ProjectGallery project={project} />
          </div>
        )}
      </section>

      <section className="detail-body section-shell">
        <div className="detail-meta">
          <span>{t("detail.technologies")}</span>
          <div className="tag-list">
            {project.technologies.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <div className="detail-content">
          {project.problem && (
            <div>
              <span className="eyebrow">{t("detail.need")}</span>
              <p>{project.problem}</p>
            </div>
          )}
          {project.built.length > 0 && (
            <div>
              <span className="eyebrow">{t("detail.built")}</span>
              <ul>
                {project.built.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {project.myRole && (
            <div>
              <span className="eyebrow">{t("detail.role")}</span>
              <p>{project.myRole}</p>
            </div>
          )}
          {project.result && (
            <div>
              <span className="eyebrow">{t("detail.result")}</span>
              <p>{project.result}</p>
            </div>
          )}
        </div>
      </section>

      <nav className="project-pagination section-shell" aria-label="Project navigation">
        <Link href={`/projects/${previous.slug}`}>
          <ArrowLeft size={17} />
          <span>
            <small>
              {t("detail.previous")} / {previous.number}
            </small>
            {previous.title}
          </span>
        </Link>
        <Link href={`/projects/${next.slug}`}>
          <span>
            <small>
              {t("detail.next")} / {next.number}
            </small>
            {next.title}
          </span>
          <ArrowRight size={17} />
        </Link>
      </nav>

      <div className="detail-contact section-shell">
        <span>{t("detail.question")}</span>
        <Link href="/#contact">
          {t("detail.talk")} <ArrowUpRight size={16} />
        </Link>
      </div>
    </main>
  );
}
