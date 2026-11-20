"use client";

import { motion } from "framer-motion";
import { revealItem, useGroupReveal } from "@/components/motion";
import { useI18n } from "@/lib/i18n";
import { CountUp } from "@/components/scroll-scenes";

export function Stats({ projectCount, internshipCount, certificationCount }: { projectCount: number; internshipCount: number; certificationCount: number }) {
  const { t, lang } = useI18n();
  const group = useGroupReveal(0.1);
  const values = [
    { value: String(projectCount), label: t("stats.projects"), href: "#projects" },
    { value: String(internshipCount), label: t("stats.internships"), href: "#experience" },
    { value: lang === "fr" ? "2e place" : "2nd place", label: t("stats.talan"), href: "#experience" },
    { value: String(certificationCount), label: t("stats.certifications"), href: "#certifications" },
  ];
  return (
    <motion.div className="stats-grid" {...group}>
      {values.map((item) => (
        <motion.a className="stat-item" href={item.href} key={item.label} data-reveal variants={revealItem}>
          <span className="stat-value"><CountUp value={item.value} /></span>
          <span className="stat-label">{item.label}</span>
        </motion.a>
      ))}
    </motion.div>
  );
}
