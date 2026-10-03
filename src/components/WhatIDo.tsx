import { MdArrowOutward } from "react-icons/md";
import "./styles/WhatIDo.css";

const capabilities = [
  {
    num: "01",
    title: "Frontend",
    sub: "Building interactive UIs",
    desc: "Building responsive, performant interfaces with modern React. Component architecture, state that stays predictable, and motion that earns its place.",
    tags: [
      "React.js",
      "Next.js",
      "TypeScript",
      "Redux Toolkit",
      "Tailwind CSS",
      "GSAP",
      "HTML5",
      "CSS3",
    ],
  },
  {
    num: "02",
    title: "Backend",
    sub: "APIs and data layers",
    desc: "Designing RESTful services, authentication and data models — from product catalogues and bookings to attendance records that have to balance at month end.",
    tags: [
      "Node.js",
      "Express.js",
      "REST APIs",
      "GraphQL",
      "JWT Auth",
      "MongoDB",
      "PostgreSQL",
      "Python",
    ],
  },
  {
    num: "03",
    title: "Cloud & AI",
    sub: "Deployment and LLM tooling",
    desc: "Shipping to the cloud and wiring language models into real workflows — including training teachers to use AI tools in their own day-to-day work.",
    tags: [
      "AWS",
      "Azure",
      "Google Cloud",
      "Docker",
      "CI/CD",
      "OpenAI API",
      "Prompt Engineering",
      "Git",
    ],
  },
];

const WhatIDo = () => {
  return (
    <section className="whatIDO">
      <div className="section-shell">
        <div className="section-head">
          <h2 className="section-title title">
            What
            <br />I Do
          </h2>
          <span className="section-index">02 — Capabilities</span>
        </div>

        <div className="cap-list">
          {capabilities.map((cap) => (
            <article className="cap-row" key={cap.num}>
              <div className="cap-num">{cap.num}</div>
              <div>
                <h3 className="cap-title">{cap.title}</h3>
                <p className="cap-sub">{cap.sub}</p>
              </div>
              <div className="cap-desc-wrap">
                <p className="cap-desc">{cap.desc}</p>
                <div className="cap-tags">
                  {cap.tags.map((tag) => (
                    <span className="cap-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="cap-arrow" aria-hidden="true">
                <MdArrowOutward />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatIDo;
