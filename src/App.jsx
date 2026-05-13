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
    const menu = root.querySelector(".menu-toggle");
    const navLinks = root.querySelector("#nav-links");
    const languageButtons = Array.from(root.querySelectorAll("[data-lang]"));

    function onMenuClick() {
      const expanded = menu.getAttribute("aria-expanded") === "true";
      menu.setAttribute("aria-expanded", String(!expanded));
      navLinks.classList.toggle("is-open", !expanded);
    }

    function onLanguageClick(event) {
      const nextLang = event.currentTarget.dataset.lang;
      if (nextLang === activeLang || !content[nextLang]) {
        return;
      }

      setActiveLang(nextLang);
      document.querySelector("#app")?.focus({ preventScroll: true });
    }

    menu?.addEventListener("click", onMenuClick);
    languageButtons.forEach((button) => button.addEventListener("click", onLanguageClick));

    return () => {
      cleanupPageMotion();
      cleanupTimeline();
      cleanupContestCarousel();
      menu?.removeEventListener("click", onMenuClick);
      languageButtons.forEach((button) => button.removeEventListener("click", onLanguageClick));
    };
  }, [activeLang, html]);

  return <div ref={pageRef} className="react-page" dangerouslySetInnerHTML={{ __html: html }} />;
}
