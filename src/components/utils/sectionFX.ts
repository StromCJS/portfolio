import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-linked section behaviour. Clip-path wipes and a filling acid rail are
 * the motion signature; everything here is additive, so reduced-motion
 * visitors simply get the static layout.
 */
export default function setSectionFX() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // the hero type drifts up and dims as you leave it
  gsap.to(".landing-title", {
    yPercent: -16,
    opacity: 0.2,
    ease: "none",
    scrollTrigger: {
      trigger: ".landing-section",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  // capability rows wipe in horizontally
  gsap.utils.toArray<HTMLElement>(".cap-row").forEach((row) => {
    gsap.fromTo(
      row,
      { clipPath: "inset(0 100% 0 0)", opacity: 0 },
      {
        clipPath: "inset(0 0% 0 0)",
        opacity: 1,
        duration: 1,
        ease: "power3.inOut",
        scrollTrigger: { trigger: row, start: "top 88%" },
      }
    );
  });

  // the career rail fills with acid as the entries arrive
  gsap.fromTo(
    ".career-timeline-fill",
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".career-info",
        start: "top 72%",
        end: "bottom 75%",
        scrub: true,
      },
    }
  );

  gsap.fromTo(
    ".career-info-box",
    { opacity: 0, y: 34 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.12,
      scrollTrigger: { trigger: ".career-info", start: "top 80%" },
    }
  );

  // Project media unmasks from the bottom, scrubbed against the section's
  // approach rather than played on a timer. Two reasons: a trigger on
  // .work-pin would stall (a pinned element stops moving), and a timed tween
  // can be left part-way if the ticker is interrupted. Scrubbing ties it to
  // scroll position, so it is always fully open before the pin engages.
  gsap.fromTo(
    ".wp-media",
    { clipPath: "inset(0 0 100% 0)" },
    {
      clipPath: "inset(0 0 0% 0)",
      ease: "none",
      stagger: 0.12,
      scrollTrigger: {
        trigger: ".work-section",
        start: "top 85%",
        end: "top 25%",
        scrub: true,
      },
    }
  );

  // panel grids
  gsap.fromTo(
    ".about-stat",
    { opacity: 0, y: 24 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.1,
      scrollTrigger: { trigger: ".about-stats", start: "top 88%" },
    }
  );

  gsap.fromTo(
    ".contact-box",
    { opacity: 0, y: 24 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.08,
      scrollTrigger: { trigger: ".contact-grid", start: "top 90%" },
    }
  );
}
