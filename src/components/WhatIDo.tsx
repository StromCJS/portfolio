import { MdArrowOutward } from "react-icons/md";
import "./styles/WhatIDo.css";

const capabilities = [
  {
    num: "01",
    title: "Frontend",
    sub: "Building interactive UIs",
    desc: "Crafting performant, responsive interfaces with modern frameworks. From SPAs to micro-frontends, I deliver pixel-perfect experiences.",
    tags: [
      "React.js",
      "Angular",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Material UI",
      "HTML5",
      "CSS3",
    ],
  },
  {
    num: "02",
    title: "Backend",
    sub: "Scalable server architecture",
    desc: "Designing robust APIs and microservices. From CMS platforms to complex business logic, I build backends that scale.",
    tags: [
      "Node.js",
      "NestJS",
      "Express.js",
      "MongoDB",
      "PostgreSQL",
      "REST APIs",
      "Microservices",
      "Python",
    ],
  },
  {
    num: "03",
    title: "Platform",
    sub: "CMS & low-code systems",
    desc: "Building the layer other teams work on top of — content models, workflow automation and low-code tooling that non-developers can run themselves.",
    tags: ["CMS", "Low-code", "Workflows", "Git", "Postman", "AWS", "Azure"],
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
