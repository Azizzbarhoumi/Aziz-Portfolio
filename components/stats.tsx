"use client";

import { useI18n } from "@/lib/i18n";

export function Stats({ projectCount, internshipCount, certificationCount }: { projectCount: number; internshipCount: number; certificationCount: number }) {
  const { t, lang } = useI18n();
  const values = [
    { value: String(projectCount), label: t("stats.projects"), href: "#projects" },
    { value: String(internshipCount), label: t("stats.internships"), href: "#experience" },
    { value: lang === "fr" ? "2e place" : "2nd place", label: t("stats.talan"), href: "#experience" },
    { value: String(certificationCount), label: t("stats.certifications"), href: "#certifications" },
  ];
  return (
    <div className="stats-grid">
      {values.map((item) => (
        <a className="stat-item" href={item.href} key={item.label}>
          <span className="stat-value">{item.value}</span>
          <span className="stat-label">{item.label}</span>
        </a>
      ))}
    </div>
  );
}
