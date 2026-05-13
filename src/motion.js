import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function splitTextForScrub(element) {
  const text = element.textContent || "";
  const words = text.trim().split(/\s+/);

  if (words.length < 4) {
    return () => {};
  }

  element.dataset.motionText = text;
  element.innerHTML = words
    .map((word) => `<span class="motion-word">${escapeHtml(word)}</span>`)
    .join(" ");

  return () => {
    element.textContent = element.dataset.motionText || text;
    delete element.dataset.motionText;
  };
}

function revealOnEntry(targets, options = {}) {
  const elements = gsap.utils.toArray(targets);

  if (!elements.length) {
    return;
  }

  gsap.from(elements, {
    y: options.y ?? 28,
    autoAlpha: 0,
    duration: options.duration ?? 0.78,
    stagger: options.stagger ?? 0.08,
    ease: "power3.out",
    scrollTrigger: {
      trigger: options.trigger || elements[0],
      start: options.start || "top 88%",
      once: true
    }
  });
}

export function setupPageMotion(root) {
  if (!root || typeof window === "undefined") {
    return () => {};
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches) {
    return () => {};
  }

  const splitCleanups = [];
  const eventCleanups = [];
  const ctx = gsap.context(() => {
    const heroBanner = root.querySelector(".hero-banner");
    const heroImage = root.querySelector(".hero-image-full");
    const loadTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (heroBanner && heroImage && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      function zoomHeroIn() {
        gsap.to(heroImage, {
          scale: 1.045,
          duration: 0.9,
          ease: "power3.out",
          overwrite: "auto"
        });
      }

      function zoomHeroOut() {
        gsap.to(heroImage, {
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          overwrite: "auto"
        });
      }

      heroBanner.addEventListener("mouseenter", zoomHeroIn);
      heroBanner.addEventListener("mouseleave", zoomHeroOut);
      eventCleanups.push(() => {
        heroBanner.removeEventListener("mouseenter", zoomHeroIn);
        heroBanner.removeEventListener("mouseleave", zoomHeroOut);
      });
    }

    const navIntroTargets = [".brand-lockup", ".language-toggle button"];
    if (window.matchMedia("(min-width: 901px)").matches) {
      navIntroTargets.splice(1, 0, ".nav-links a");
    }

    loadTimeline
      .from(".site-nav", { y: -18, autoAlpha: 0, duration: 0.62 })
      .from(
        navIntroTargets.join(", "),
        { y: -10, autoAlpha: 0, duration: 0.48, stagger: 0.035 },
        "-=0.34"
      )
      .from(".hero-image-full", { scale: 1.035, autoAlpha: 0.82, duration: 1.08 }, "-=0.16")
      .from(
        ".hero-action-copy > *, .hero-action-side > *",
        { y: 22, autoAlpha: 0, duration: 0.72, stagger: 0.09 },
        "-=0.48"
      );

    root.querySelectorAll(".hero-copy, .section-heading p").forEach((element) => {
      splitCleanups.push(splitTextForScrub(element));
      const words = element.querySelectorAll(".motion-word");

      if (!words.length) {
        return;
      }

      gsap.fromTo(
        words,
        { opacity: 0.18 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            end: "bottom 48%",
            scrub: true
          }
        }
      );
    });

    root.querySelectorAll(".split-section, .content-band, .timeline-section, .card-section, .profile-cta, .site-footer")
      .forEach((section) => {
        revealOnEntry(
          section.querySelectorAll(
            ".portrait-placeholder, .split-copy > *, .section-heading > *, .video-frame, .asset-status, .timeline-pin, .news-card, .contest-heading-row, .marquee-wrapper, .profile-cta .button, .footer-group, .footer-contact, .footer-bottom-inner > *"
          ),
          { trigger: section }
        );
      });

    gsap.utils.toArray(".card-image, .milestone-image").forEach((image) => {
      gsap.fromTo(
        image,
        { scale: 0.94, autoAlpha: 0.72 },
        {
          scale: 1,
          autoAlpha: 1,
          ease: "none",
          scrollTrigger: {
            trigger: image,
            start: "top 92%",
            end: "bottom 42%",
            scrub: true
          }
        }
      );
    });

    ScrollTrigger.refresh();
  }, root);

  return () => {
    eventCleanups.forEach((cleanup) => cleanup());
    ctx.revert();
    splitCleanups.forEach((cleanup) => cleanup());
  };
}
