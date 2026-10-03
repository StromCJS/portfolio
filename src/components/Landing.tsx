import { PropsWithChildren, useEffect, useRef } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Scale each headline to exactly span the container. Anton's metrics vary by
  // string, so measuring beats guessing a vw value per line.
  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    const fit = () => {
      const width = title.clientWidth;
      if (!width) return;

      const spans = Array.from(
        title.querySelectorAll<HTMLElement>(".lt-line > span")
      );

      // Measure and correct rather than assuming width scales linearly with
      // font-size from a single sample. If a fallback face is still active the
      // first guess can be well out, so converge on the real width instead.
      const sizes = spans.map((span) => {
        let size = 100;
        span.style.fontSize = `${size}px`;
        for (let pass = 0; pass < 4; pass++) {
          const natural = span.scrollWidth;
          if (!natural) return 0;
          if (Math.abs(natural - width) <= 0.5) break;
          size = (size * width) / natural;
          span.style.fontSize = `${size}px`;
        }
        return size;
      });

      // Width-fitted type can overflow a short viewport. Measure the space the
      // rest of the hero leaves — all of it is independent of the title size,
      // so this stays non-circular — rather than guessing a fraction.
      const section = title.closest(".landing-section") as HTMLElement | null;
      const type = title.parentElement as HTMLElement | null;
      let budget = window.innerHeight;
      if (section && type) {
        const sectionStyle = getComputedStyle(section);
        const typeStyle = getComputedStyle(type);
        const meta = section.querySelector<HTMLElement>(".landing-meta");
        const foot = section.querySelector<HTMLElement>(".landing-foot");
        budget =
          window.innerHeight -
          parseFloat(sectionStyle.paddingTop) -
          parseFloat(sectionStyle.paddingBottom) -
          parseFloat(typeStyle.paddingTop) -
          parseFloat(typeStyle.paddingBottom) -
          (meta?.offsetHeight ?? 0) -
          (foot?.offsetHeight ?? 0);
      }
      // 0.8 leading means Anton paints outside its line boxes; leave room
      budget *= 0.95;

      const used = title.clientHeight;
      if (budget > 0 && used > budget) {
        const ratio = budget / used;
        spans.forEach((span, i) => {
          if (sizes[i]) span.style.fontSize = `${sizes[i] * ratio}px`;
        });
      }
    };

    // document.fonts.ready resolves before the stylesheet's @import has even
    // requested Anton, so ask for the face by name as well, and re-fit if any
    // font finishes loading afterwards.
    const fonts = document.fonts;
    if (fonts) {
      Promise.all([fonts.load('1em "Anton"'), fonts.ready])
        .then(fit)
        .catch(fit);
      fonts.addEventListener("loadingdone", fit);
    } else {
      fit();
    }

    window.addEventListener("resize", fit);
    return () => {
      window.removeEventListener("resize", fit);
      fonts?.removeEventListener("loadingdone", fit);
    };
  }, []);

  return (
    <section className="landing-section" id="landingDiv">
      <div className="landing-meta">
        <span className="label">Portfolio — 2026</span>
        <span className="label landing-status">
          <i></i> Available for work
        </span>
      </div>

      <div className="landing-type">
        <h1 className="landing-title" ref={titleRef}>
          <span className="lt-line">
            <span>Sayanth V</span>
          </span>
          <span className="lt-line">
            <span className="outline">Full Stack Developer</span>
          </span>
        </h1>
      </div>

      <div className="landing-foot">
        <div>
          <p className="landing-stack">
            React · Next.js · TypeScript · Node · MongoDB
          </p>
          <p className="landing-blurb">
            I build <strong>production web applications</strong> end to end —
            from interface to API to deployment.
          </p>
        </div>
        <div className="landing-scroll">
          <span className="label">Scroll</span>
          <div className="landing-scroll-track"></div>
        </div>
      </div>
      {children}
    </section>
  );
};

export default Landing;
