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
            Full Stack Developer specialising in the <b>MERN stack</b> and{" "}
            <b>TypeScript</b>, building responsive, end-to-end web applications
            — <em>e-commerce platforms</em>, <em>booking systems</em> and{" "}
            <em>AI-powered tools</em>. I design RESTful APIs, integrate
            third-party services and deploy on <b>AWS, Azure and Google Cloud</b>
            , taking work from concept to production.
          </p>
        </div>
      </div>

      <dl className="about-stats">
        <div className="about-stat">
          <dt>Working since</dt>
          <dd>2024</dd>
        </div>
        <div className="about-stat">
          <dt>Projects shipped</dt>
          <dd>06</dd>
        </div>
        <div className="about-stat">
          <dt>Based in</dt>
          <dd>Kannur, IN</dd>
        </div>
      </dl>
    </section>
  );
};

export default About;
