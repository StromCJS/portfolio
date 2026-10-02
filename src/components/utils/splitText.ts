import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";

interface SplitElement extends HTMLElement {
  anim?: gsap.core.Animation;
  split?: SplitText;
}

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

/**
 * Reveal pass for the two text roles in the design:
 *   .title — Anton headings, wiped up line by line behind a mask
 *   .para  — body copy, words masked up with a short stagger
 * Nothing is hidden in CSS, so if this never runs the content still reads.
 */
export default function setSplitText() {
  ScrollTrigger.config({ ignoreMobileResize: true });
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const start = window.innerWidth <= 1024 ? "top 85%" : "top 80%";
  const toggleActions = "play none none reverse";

  const titles = document.querySelectorAll<SplitElement>(".title");
  titles.forEach((title) => {
    title.anim?.progress(1).kill();
    title.split?.revert();

    title.split = new SplitText(title, { type: "lines", mask: "lines" });
    title.anim = gsap.fromTo(
      title.split.lines,
      { yPercent: 115 },
      {
        yPercent: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: title, start, toggleActions },
      }
    );
  });

  const paras = document.querySelectorAll<SplitElement>(".para");
  paras.forEach((para) => {
    para.anim?.progress(1).kill();
    para.split?.revert();

    para.split = new SplitText(para, {
      type: "lines,words",
      mask: "lines",
    });
    para.anim = gsap.fromTo(
      para.split.words,
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.015,
        scrollTrigger: { trigger: para, start, toggleActions },
      }
    );
  });
}
