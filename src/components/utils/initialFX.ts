import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { smoother } from "../Navbar";
import setSectionFX from "./sectionFX";

/** Runs once, the moment the loader clears. */
export function initialFX() {
  document.body.style.overflowY = "auto";
  smoother?.paused(false);
  document.getElementsByTagName("main")[0]?.classList.add("main-active");

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduced) {
    // the hero lines rise out of their masks — the one big opening gesture
    gsap.fromTo(
      ".lt-line > span",
      { yPercent: 115 },
      {
        yPercent: 0,
        duration: 1.15,
        ease: "expo.out",
        stagger: 0.085,
        delay: 0.15,
      }
    );

    gsap.fromTo(
      [".landing-meta", ".landing-foot", ".header", ".icons-section"],
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        stagger: 0.07,
        delay: 0.45,
      }
    );
  }

  setSectionFX();
  ScrollTrigger.refresh();
}
