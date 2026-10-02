import "./styles/Career.css";

const timeline = [
  {
    step: "01",
    role: "Bachelor of Computer Applications",
    org: "University of Bangalore",
    when: "2021 — 2024",
    desc: "Completed my BCA at SB College of Management Studies. Built a strong foundation in computer science and programming, and completed hands-on cloud computing training with AWS, Azure and Google Cloud.",
  },
  {
    step: "02",
    role: "Full Stack Trainee (MERN)",
    org: "Entri Elevate & Illinois Tech US",
    when: "2024 — 2025",
    desc: "Engineered backend services and APIs using Node.js and MongoDB. Implemented version control and API testing workflows with Git and Postman while mastering responsive web design.",
  },
  {
    step: "03",
    role: "Full-Stack Project — CricTrackerPro",
    org: "Independent",
    when: "2025",
    desc: "Developed a live cricket score application delivering real-time match updates through third-party sports APIs. Built the UI with React.js and Tailwind, secured it with Firebase, and handled database operations with Node.js and MongoDB.",
  },
  {
    step: "04",
    role: "IT Administrator",
    org: "Kadambur English Medium School",
    when: "Now",
    now: true,
    desc: "Managing and maintaining the school's IT infrastructure, providing technical support and keeping daily technological operations running. Also designed and built the school's staff attendance portal — now its system of record for attendance, leave, cover and payroll.",
  },
];

const Career = () => {
  return (
    <section className="career-section section-container">
      <div className="section-head">
        <h2 className="section-title title">
          Career <span className="outline">&amp;</span>
          <br />
          Experience
        </h2>
        <span className="section-index">03 — Timeline</span>
      </div>

      <div className="career-info">
        <div className="career-timeline">
          <div className="career-timeline-fill"></div>
        </div>

        {timeline.map((item) => (
          <article className="career-info-box" key={item.step}>
            <div className="career-step">{item.step}</div>
            <div>
              <div className="career-role">
                <h4>{item.role}</h4>
                <h5>{item.org}</h5>
              </div>
              <p>{item.desc}</p>
            </div>
            <div className="career-when" data-now={item.now ? "true" : "false"}>
              {item.when}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Career;
