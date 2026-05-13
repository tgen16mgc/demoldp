import { useEffect, useMemo, useRef, useState } from "react";
import { content } from "./content.js";
import { renderPage } from "./render.js";
import { setupContestCarousel } from "./carousel.js";
import { setupTimeline } from "./timeline.js";
import { setupPageMotion } from "./motion.js";

export function App() {
  const [activeLang, setActiveLang] = useState("vi");
  const pageRef = useRef(null);

  const html = useMemo(() => renderPage(content[activeLang], activeLang), [activeLang]);

  useEffect(() => {
    document.documentElement.lang = activeLang;
  }, [activeLang]);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) {
      return undefined;
    }

    const cleanupTimeline = setupTimeline(root.querySelector(".timeline-section"));
    const cleanupContestCarousel = setupContestCarousel(root.querySelector(".contest-section"));
    const cleanupPageMotion = setupPageMotion(root);
    const siteNav = root.querySelector(".site-nav");
    const menu = root.querySelector(".menu-toggle");
    const navLinks = root.querySelector("#nav-links");
    const navAnchors = Array.from(root.querySelectorAll("#nav-links a"));
    const languageButtons = Array.from(root.querySelectorAll("[data-lang]"));

    function setMenuOpen(open) {
      const isMobile = window.innerWidth <= 900;
      menu?.setAttribute("aria-expanded", String(open));
      siteNav?.classList.toggle("is-menu-open", open);
      navLinks?.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-lock", open);

      if (isMobile) {
        navLinks?.setAttribute("aria-hidden", String(!open));
      } else {
        navLinks?.removeAttribute("aria-hidden");
      }
    }

    function onMenuClick() {
      const expanded = menu.getAttribute("aria-expanded") === "true";
      setMenuOpen(!expanded);
    }

    function onNavAnchorClick() {
      setMenuOpen(false);
    }

    function onDocumentClick(event) {
      if (!siteNav?.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    function onKeyDown(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    function onResize() {
      if (window.innerWidth > 900) {
        setMenuOpen(false);
      } else if (menu?.getAttribute("aria-expanded") !== "true") {
        navLinks?.setAttribute("aria-hidden", "true");
      }
    }

    function onLanguageClick(event) {
      const nextLang = event.currentTarget.dataset.lang;
      if (nextLang === activeLang || !content[nextLang]) {
        return;
      }

      setActiveLang(nextLang);
      setMenuOpen(false);
      document.querySelector("#app")?.focus({ preventScroll: true });
    }

    onResize();
    menu?.addEventListener("click", onMenuClick);
    document.addEventListener("click", onDocumentClick);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    navAnchors.forEach((anchor) => anchor.addEventListener("click", onNavAnchorClick));
    languageButtons.forEach((button) => button.addEventListener("click", onLanguageClick));

    return () => {
      cleanupPageMotion();
      cleanupTimeline();
      cleanupContestCarousel();
      menu?.removeEventListener("click", onMenuClick);
      document.removeEventListener("click", onDocumentClick);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      document.body.classList.remove("nav-lock");
      navAnchors.forEach((anchor) => anchor.removeEventListener("click", onNavAnchorClick));
      languageButtons.forEach((button) => button.removeEventListener("click", onLanguageClick));
    };
  }, [activeLang, html]);

  return <div ref={pageRef} className="react-page" dangerouslySetInnerHTML={{ __html: html }} />;
}
