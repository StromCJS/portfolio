import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MdArrowOutward } from "react-icons/md";
import asset from "./utils/asset";
import "./styles/Work.css";

gsap.registerPlugin(ScrollTrigger);

type Project = {
  title: string;
  category: string;
  tools: string;
  image: string;
  summary?: string;
  link?: string;
};

const projects: Project[] = [
  {
    title: "KES Attendance Portal",
    category: "School Staff Attendance & Payroll",
    summary:
      "The staff attendance system in daily use at Kadambur English Medium School. Three interfaces over one record — an administrator console, a staff sign-in, and a door kiosk with face and fingerprint check-in. Runs entirely on the school's own computer: no cloud, no subscription, no internet needed.",
    tools: "Node.js, Express, SQLite, Biometric check-in, Payroll",
    image: "/images/kes-attendance.jpg",
  },
  {
    title: "Serenity",
    category: "Hotel Reservation Platform",
    tools: "React, Node.js, Express, MongoDB",
    image: "/images/SERENITY.webp",
  },
  {
    title: "Luxe",
    category: "E-Commerce Storefront",
    tools: "React, Node.js, Express, MongoDB",
    image: "/images/LUXE.webp",
  },
  {
    title: "Elegance",
    category: "Salon Booking & Services",
    tools: "React, Node.js, Express, MongoDB",
    image: "/images/ELEGANCE.webp",
  },
  {
    title: "Portfolio",
    category: "Personal Site — Previous Build",
    tools: "React, TypeScript, Tailwind CSS",
    image: "/images/PORTFOLIO.webp",
  },
];

const Work = () => {
  const pinRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // horizontal rail only where there is room for it, and only if the
    // visitor hasn't asked for reduced motion
    mm.add(
      "(min-width: 1025px) and (prefers-reduced-motion: no-preference)",
      () => {
        const rail = railRef.current;
        const pin = pinRef.current;
        if (!rail || !pin) return;

        const distance = () => Math.max(0, rail.offsetWidth - window.innerWidth);

        const tween = gsap.to(rail, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            anticipatePin: 1,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (fillRef.current) {
                gsap.set(fillRef.current, { scaleX: self.progress });
              }
              if (counterRef.current) {
                const index = Math.min(
                  projects.length,
                  Math.floor(self.progress * projects.length) + 1
                );
                counterRef.current.textContent = String(index).padStart(2, "0");
              }
            },
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section className="work-section" id="work">
      <div className="section-shell">
        <div className="section-head">
          <h2 className="section-title title">
            Selected
            <br />
            <span className="outline">Work</span>
          </h2>
          <span className="section-index">04 — Projects</span>
        </div>
      </div>

      <div className="work-pin" ref={pinRef}>
        <div className="work-rail" ref={railRef}>
          {projects.map((project, index) => (
            <article className="wp" key={project.title}>
              <div className="wp-body">
                <div className="wp-num">{String(index + 1).padStart(2, "0")}</div>
                <h3 className="wp-title">{project.title}</h3>
                <p className="wp-category">{project.category}</p>
                {project.summary && (
                  <p className="wp-summary">{project.summary}</p>
                )}
                <dl className="wp-tools">
                  <dt>Tools &amp; features</dt>
                  <dd>{project.tools}</dd>
                </dl>
              </div>

              <div className="wp-media">
                <img
                  src={asset(project.image)}
                  alt={`${project.title} — ${project.category}`}
                  loading="lazy"
                />
                {project.link && (
                  <a
                    className="wp-link"
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="disable"
                    aria-label={`Open ${project.title}`}
                  >
                    <MdArrowOutward />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="work-meter">
          <span className="work-counter">
            <b ref={counterRef}>01</b> / {String(projects.length).padStart(2, "0")}
          </span>
          <div className="work-meter-track">
            <div className="work-meter-fill" ref={fillRef}></div>
          </div>
          <span className="label">Scroll to advance</span>
        </div>
      </div>
    </section>
  );
};

export default Work;
