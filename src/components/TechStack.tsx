import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/TechStack.css";

const rowA = [
  "React.js",
  "Next.js",
  "Angular",
  "TypeScript",
  "Node.js",
  "NestJS",
];
const rowB = [
  "MongoDB",
  "PostgreSQL",
  "Express.js",
  "Python",
  "Material UI",
  "Git",
];

const TechStack = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const rowARef = useRef<HTMLDivElement>(null);
  const rowBRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const a = rowARef.current;
      const b = rowBRef.current;
      if (!a || !b) return;

      // each row renders its list twice, so a -50% shift loops seamlessly
      const tweenA = gsap.to(a, {
        xPercent: -50,
        duration: 26,
        ease: "none",
        repeat: -1,
      });
      const tweenB = gsap.fromTo(
        b,
        { xPercent: -50 },
        { xPercent: 0, duration: 26, ease: "none", repeat: -1 }
      );

      // scroll velocity briefly speeds the marquee up — the page feels like
      // one connected object rather than a stack of sections
      let settle: ReturnType<typeof setTimeout>;
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const boost = gsap.utils.clamp(
            1,
            4.5,
            1 + Math.abs(self.getVelocity()) / 1200
          );
          gsap.to([tweenA, tweenB], {
            timeScale: boost,
            duration: 0.25,
            overwrite: true,
          });
          clearTimeout(settle);
          settle = setTimeout(() => {
            gsap.to([tweenA, tweenB], { timeScale: 1, duration: 0.8 });
          }, 160);
        },
      });

      return () => {
        clearTimeout(settle);
        trigger.kill();
        tweenA.kill();
        tweenB.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="techstack" ref={sectionRef}>
      <div className="tech-label">
        <span className="label">Stack — tools I reach for</span>
      </div>

      <div className="tech-row" ref={rowARef}>
        {[...rowA, ...rowA].map((tech, i) => (
          <span className="tech-item" key={`a-${i}`}>
            {tech}
          </span>
        ))}
      </div>

      <div className="tech-row tech-row--alt" ref={rowBRef}>
        {[...rowB, ...rowB].map((tech, i) => (
          <span className="tech-item" key={`b-${i}`}>
            {tech}
          </span>
        ))}
      </div>
    </section>
  );
};

export default TechStack;
