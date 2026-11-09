"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { ReactLenis } from "lenis/react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { BrandIcon } from "@/components/brand-icon";
import { PortfolioChat } from "@/components/portfolio-chat";
import { I18nProvider, useI18n } from "@/lib/i18n";

const navKeys: [string, string][] = [
  ["nav.about", "/#about"],
  ["nav.projects", "/#projects"],
  ["nav.experience", "/#experience"],
  ["nav.education", "/#education"],
  ["nav.contact", "/#contact"],
];

function SiteShellInner({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [activeSection, setActiveSection] = useState("");
  const lastY = useRef(0);
  const reduceMotion = useReducedMotion();
  const { lang, toggleLang, t } = useI18n();

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-theme");
    const next = saved === "light" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y < 90 || y < lastY.current || menuOpen);
      const current = navKeys
        .map(([, href]) => href.slice(2))
        .filter((id) => document.getElementById(id)?.getBoundingClientRect().top !== undefined && (document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= 130)
        .at(-1) ?? "";
      setActiveSection(current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  useEffect(() => {
    const dot = document.querySelector<HTMLElement>("body .cursor-dot");
    if (!dot || reduceMotion || !window.matchMedia("(pointer:fine)").matches) return;
    const move = (event: PointerEvent) => { dot.style.left = `${event.clientX}px`; dot.style.top = `${event.clientY}px`; };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduceMotion]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("portfolio-theme", next);
  }

  return (
    <ReactLenis root options={{ autoRaf: true, lerp: reduceMotion ? 1 : 0.09, smoothWheel: !reduceMotion }}>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className={`site-header ${visible ? "is-visible" : "is-hidden"}`}>
        <Link className="wordmark" href="/" aria-label="Ahmed Aziz Barhoumi, home">A<span>/</span>B</Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navKeys.map(([key, href]) => (
            <a key={href} href={href} aria-current={activeSection === href.slice(2) ? "location" : undefined}>
              {t(key)}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="availability" href="#contact"><span /> {t("nav.available")}</a>
          <a
            className="icon-button header-social-link"
            href="https://github.com/Azizzbarhoumi"
            target="_blank"
            rel="noreferrer"
            aria-label="Aziz Barhoumi on GitHub"
            title="GitHub"
          >
            <BrandIcon brand="github" style={{ width: 16, height: 16 }} />
          </a>
          <button
            className="icon-button lang-button"
            type="button"
            onClick={toggleLang}
            aria-label={t("nav.switchLang")}
            title={t("nav.switchLang")}
          >
            <span className="lang-code">{lang === "en" ? "FR" : "EN"}</span>
          </button>
          <button
            className="icon-button theme-button"
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            className="icon-button menu-button"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </header>
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen} inert={!menuOpen}>
        <div className="mobile-menu-inner">
          <span className="eyebrow">NAVIGATION / 01—05</span>
          {navKeys.map(([key, href], i) => (
            <a
              key={href}
              href={href}
              aria-current={activeSection === href.slice(2) ? "location" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              <span>0{i + 1}</span>{t(key)}<ArrowUpRight size={20} />
            </a>
          ))}
          <div className="mobile-extras">
            <button type="button" className="mobile-lang-btn" onClick={toggleLang}>
              {lang === "en" ? "Version Française (FR)" : "English Version (EN)"}
            </button>
            <div className="mobile-social-row">
              <a href="https://github.com/Azizzbarhoumi" target="_blank" rel="noreferrer" aria-label="GitHub">
                <BrandIcon brand="github" style={{ width: 22, height: 22 }} />
              </a>
              <a href="https://www.linkedin.com/in/aziz-barhoumi-320bb9339" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <BrandIcon brand="linkedin" style={{ width: 22, height: 22 }} />
              </a>
              <a className="mobile-email" href="mailto:azizbr438@gmail.com" aria-label="Email Ahmed Aziz Barhoumi">
                <BrandIcon brand="gmail" style={{ width: 22, height: 22 }} />
              </a>
            </div>
          </div>
        </div>
      </div>
      {children}
      <PortfolioChat />
      <SiteFooter />
      <div className="cursor-dot" aria-hidden="true" />
    </ReactLenis>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <SiteShellInner>{children}</SiteShellInner>
    </I18nProvider>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Link className="footer-name" href="/#top">
          AHMED AZIZ<br/>BARHOUMI<span> / AI & DATA SCIENCE</span>
        </Link>
        <nav aria-label="Footer navigation">
          {navKeys.map(([key, href]) => <Link key={href} href={href}>{t(key)}</Link>)}
        </nav>
        <Link className="back-top" href="/#top">
          {t("footer.backToTop")} <ArrowUpRight size={14}/>
        </Link>
      </div>
      <div className="footer-bottom">
        <span>{t("footer.tagline")}</span>
        <div style={{ display: "inline-flex", gap: "16px", alignItems: "center" }}>
          <a href="https://github.com/Azizzbarhoumi" target="_blank" rel="noreferrer" aria-label="Ahmed Aziz Barhoumi on GitHub">
            <BrandIcon brand="github" style={{ width: 19, height: 19 }} />
          </a>
          <a href="https://www.linkedin.com/in/aziz-barhoumi-320bb9339" target="_blank" rel="noreferrer" aria-label="Ahmed Aziz Barhoumi on LinkedIn">
            <BrandIcon brand="linkedin" style={{ width: 19, height: 19 }} />
          </a>
        </div>
        <span>© 2026 AHMED AZIZ BARHOUMI</span>
      </div>
    </footer>
  );
}

export function SectionHeading({ index, label, title, inverted = false }: { index: string; label: string; title: string; inverted?: boolean }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={`section-heading ${inverted ? "inverted" : ""}`}
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -8%" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="eyebrow"><b>{index}</b> / {label}</span>
      <h2>{title}</h2>
      <ArrowDownRight className="heading-arrow" strokeWidth={1} />
    </motion.div>
  );
}

export function ActionLink({ href, children, external = false, className = "" }: { href: string; children: ReactNode; external?: boolean; className?: string }) {
  return (
    <a className={`action-link ${className}`} href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
      {children}<ArrowUpRight size={15} strokeWidth={1.5} />
    </a>
  );
}
