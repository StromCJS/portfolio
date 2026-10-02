import "./styles/About.css";

const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="about-grid">
        <div className="about-label">
          <span className="label">01 — About</span>
          <figure className="about-photo">
            <img
              src="/images/sayanth.webp"
              alt="Illustrated portrait of Sayanth V"
              width="1122"
              height="1402"
              loading="lazy"
            />
          </figure>
        </div>
        <div className="about-me">
          <p className="about-statement para">
            Full Stack Developer with <b>1+ years</b> of experience building
            scalable web applications using React.js, Angular, Next.js, Node.js
            and NestJS. Skilled in <em>microservices architecture</em>,{" "}
            <em>CMS development</em> and <em>low-code platforms</em> — focused on
            shipping <b>high-performance, production-ready</b> solutions from
            concept to deployment.
          </p>
        </div>
      </div>

      <dl className="about-stats">
        <div className="about-stat">
          <dt>Experience</dt>
          <dd>1+ Yrs</dd>
        </div>
        <div className="about-stat">
          <dt>Projects shipped</dt>
          <dd>05</dd>
        </div>
        <div className="about-stat">
          <dt>Based in</dt>
          <dd>Kerala, IN</dd>
        </div>
      </dl>
    </section>
  );
};

export default About;
