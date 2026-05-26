import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function setupTimeline(section) {
  if (!section || typeof window === "undefined") {
    return () => {};
  }

  const viewport = section.querySelector(".timeline-viewport");
  const track = section.querySelector(".timeline-track");
  const canvas = section.querySelector(".timeline-canvas");
  const events = Array.from(section.querySelectorAll(".milestone-event"));
  const previousButton = section.querySelector("[data-timeline-prev]");
  const nextButton = section.querySelector("[data-timeline-next]");

  if (!viewport || !track || !canvas || !events.length) {
    return () => {};
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let trigger = null;
  let ratios = [];
  let currentProgress = 0;
  let idleUntil = 0;
  let autoplayId = null;

  function eventCentersInTrack() {
    const trackRect = track.getBoundingClientRect();
    const trackLeft = trackRect.left;
    if (track.scrollWidth <= 0) {
      return events.map(() => 0);
    }
    return events.map((event) => {
      const rect = event.getBoundingClientRect();
      return rect.left + rect.width / 2 - trackLeft;
    });
  }

  function computeDistance(centers = eventCentersInTrack()) {
    const viewportCenter = viewport.clientWidth / 2;
    const lastCenter = centers[centers.length - 1] || track.scrollWidth;
    return Math.max(0, lastCenter - viewportCenter);
  }

  function eventCenterRatios(distance, totalDistance) {
    const centers = eventCentersInTrack();
    const viewportCenter = viewport.clientWidth / 2;
    if (distance <= 0 || totalDistance <= 0) {
      return events.map(() => 0);
    }
    return centers.map((center) => {
      const targetTravel = Math.min(distance, Math.max(0, center - viewportCenter));
      return Math.min(1, Math.max(0, targetTravel / totalDistance));
    });
  }

  function applyProgress(progress, ratios) {
    currentProgress = progress;
    let activated = false;
    let activeIndex = 0;
    for (let i = 0; i < events.length; i += 1) {
      const reached = progress >= ratios[i] - 0.005;
      events[i].classList.toggle("is-active", reached);
      events[i].classList.remove("is-current");
      events[i].removeAttribute("aria-current");
      if (reached) {
        activated = true;
        activeIndex = i;
      }
    }
    if (!activated && events[0]) {
      events[0].classList.add("is-active");
      activeIndex = 0;
    }
    if (events[activeIndex]) {
      events[activeIndex].classList.add("is-current");
      events[activeIndex].setAttribute("aria-current", "step");
    }
  }

  function currentIndex() {
    if (!ratios.length) {
      return 0;
    }

    let index = 0;
    for (let i = 0; i < ratios.length; i += 1) {
      if (currentProgress >= ratios[i] - 0.005) {
        index = i;
      }
    }
    return index;
  }

  function scrollToProgress(progress, options = {}) {
    const clamped = Math.min(1, Math.max(0, progress));

    if (!trigger) {
      viewport.scrollTo({
        left: clamped * Math.max(0, track.scrollWidth - viewport.clientWidth),
        behavior: options.immediate ? "auto" : "smooth"
      });
      applyProgress(clamped, ratios);
      return;
    }

    const target = trigger.start + (trigger.end - trigger.start) * clamped;
    if (window.__hinoLenis) {
      window.__hinoLenis.scrollTo(target, {
        duration: options.immediate ? 0 : 0.95,
        immediate: Boolean(options.immediate),
        force: true
      });
      return;
    }

    window.scrollTo({
      top: target,
      behavior: options.immediate ? "auto" : "smooth"
    });
  }

  function goToIndex(index, options = {}) {
    if (!ratios.length) {
      return;
    }

    const safeIndex = Math.min(events.length - 1, Math.max(0, index));
    scrollToProgress(ratios[safeIndex], options);
  }

  function pauseAutoplay(duration = 5200) {
    idleUntil = Date.now() + duration;
  }

  function build() {
    if (trigger) {
      trigger.kill();
      trigger = null;
    }

    gsap.set(canvas, { x: 0 });
    events.forEach((event) => {
      event.classList.remove("is-active", "is-current");
      event.removeAttribute("aria-current");
    });

    if (reduceMotion.matches) {
      applyProgress(1, eventCenterRatios(0, 1));
      gsap.set(canvas, { x: 0 });
      return;
    }

    const distance = computeDistance();
    if (distance <= 0) {
      applyProgress(1, eventCenterRatios(0, 1));
      return;
    }

    const finalHold = Math.min(window.innerHeight * 0.55, 680);
    const totalDistance = distance + finalHold;
    ratios = eventCenterRatios(distance, totalDistance);

    const tween = gsap.timeline()
      .to(canvas, {
        x: -distance,
        duration: distance,
        ease: "none"
      })
      .to(canvas, {
        x: -distance,
        duration: finalHold,
        ease: "none"
      });

    trigger = ScrollTrigger.create({
      animation: tween,
      trigger: section,
      start: "top top",
      end: () => `+=${totalDistance}`,
      pin: true,
      pinSpacing: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate(self) {
        applyProgress(self.progress, ratios);
      }
    });
  }

  build();

  function onResize() {
    ScrollTrigger.refresh();
  }

  function onMotionChange() {
    build();
  }

  function onPreviousClick() {
    pauseAutoplay();
    goToIndex(currentIndex() - 1);
  }

  function onNextClick() {
    pauseAutoplay();
    goToIndex(currentIndex() + 1);
  }

  function onUserInput() {
    pauseAutoplay();
  }

  function isTimelineVisible() {
    const rect = section.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.35 && rect.bottom > window.innerHeight * 0.65;
  }

  if (!reduceMotion.matches) {
    autoplayId = window.setInterval(() => {
      if (document.hidden || Date.now() < idleUntil || !isTimelineVisible()) {
        return;
      }

      const nextIndex = currentIndex() >= events.length - 1 ? 0 : currentIndex() + 1;
      goToIndex(nextIndex);
    }, 3200);
  }

  window.addEventListener("resize", onResize);
  window.addEventListener("wheel", onUserInput, { passive: true });
  window.addEventListener("touchstart", onUserInput, { passive: true });
  window.addEventListener("keydown", onUserInput);
  previousButton?.addEventListener("click", onPreviousClick);
  nextButton?.addEventListener("click", onNextClick);
  if (typeof reduceMotion.addEventListener === "function") {
    reduceMotion.addEventListener("change", onMotionChange);
  } else if (typeof reduceMotion.addListener === "function") {
    reduceMotion.addListener(onMotionChange);
  }

  return () => {
    window.removeEventListener("resize", onResize);
    window.removeEventListener("wheel", onUserInput);
    window.removeEventListener("touchstart", onUserInput);
    window.removeEventListener("keydown", onUserInput);
    previousButton?.removeEventListener("click", onPreviousClick);
    nextButton?.removeEventListener("click", onNextClick);
    if (autoplayId) {
      window.clearInterval(autoplayId);
    }
    if (typeof reduceMotion.removeEventListener === "function") {
      reduceMotion.removeEventListener("change", onMotionChange);
    } else if (typeof reduceMotion.removeListener === "function") {
      reduceMotion.removeListener(onMotionChange);
    }
    if (trigger) {
      trigger.kill();
      trigger = null;
    }
  };
}
