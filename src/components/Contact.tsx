import { MdArrowOutward } from "react-icons/md";
import "./styles/Contact.css";

const socials = [
  { label: "Github", href: "https://github.com/StromCJS" },
  {
    label: "Linkedin",
    href: "https://www.linkedin.com/in/sayanth-unni-ss111626323",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/__sa__ya__nth__unni?igsh=MXduc3drYzl4M28wZQ==",
  },
];

const Contact = () => {
  return (
    <section className="contact-section section-container" id="contact">
      <div className="section-head">
        <h2 className="section-title title">
          Let&apos;s
          <br />
          <span className="outline">Work</span> Together
        </h2>
        <span className="section-index">05 — Contact</span>
      </div>

      <div className="contact-cta-wrap">
        <a
          className="contact-email"
          href="mailto:sayanthunni116@gmail.com"
          data-cursor="disable"
        >
          sayanthunni116@gmail.com
        </a>
      </div>

      <div className="contact-grid">
        <div className="contact-box">
          <h4>Email</h4>
          <p>
            <a href="mailto:sayanthunni116@gmail.com" data-cursor="disable">
              sayanthunni116@gmail.com
            </a>
          </p>
        </div>
        <div className="contact-box">
          <h4>Education</h4>
          <p>Bachelor of Computer Applications</p>
        </div>
        <div className="contact-box">
          <h4>Social</h4>
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              {social.label} <MdArrowOutward />
            </a>
          ))}
        </div>
      </div>

      <div className="contact-foot">
        <span>© {new Date().getFullYear()} Sayanth V</span>
        <span>Full Stack Developer — Kerala, IN</span>
      </div>
    </section>
  );
};

export default Contact;
