import asset from "./utils/asset";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import HoverLinks from "./HoverLinks";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const Navbar = () => {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: reduced ? 0 : 1.2,
      speed: reduced ? 1 : 1.25,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });

    smoother.scrollTop(0);
    smoother.paused(true);

    // anchor links scroll through the smoother so the easing matches
    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(".header ul a")
    );
    const onLinkClick = (e: MouseEvent) => {
      if (window.innerWidth <= 1024) return;
      e.preventDefault();
      const target = e.currentTarget as HTMLAnchorElement;
      const section = target.getAttribute("data-href");
      if (section) smoother.scrollTo(section, true, "top top");
    };
    links.forEach((link) => link.addEventListener("click", onLinkClick));

    // acid progress rail across the top
    const rail = gsap.to(".scroll-rail-in", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.35 },
    });

    // header retracts on the way down, returns on the way up
    const header = document.querySelector(".header");
    const headerTrigger = ScrollTrigger.create({
      start: "top -120",
      end: "max",
      onUpdate: (self) => {
        if (!header) return;
        header.classList.toggle("header-hidden", self.direction === 1);
      },
      onLeaveBack: () => header?.classList.remove("header-hidden"),
    });

    const handleResize = () => ScrollSmoother.refresh(true);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      links.forEach((link) => link.removeEventListener("click", onLinkClick));
      rail.scrollTrigger?.kill();
      rail.kill();
      headerTrigger.kill();
      smoother.kill();
    };
  }, []);

  return (
    <>
      <div className="scroll-rail">
        <div className="scroll-rail-in"></div>
      </div>

      <div className="header">
        <a href={asset("/")} className="navbar-title" data-cursor="disable">
          SV
        </a>
        <a
          href="mailto:sayanthunni116@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          sayanthunni116@gmail.com
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="About" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="Work" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="Contact" />
            </a>
          </li>
        </ul>
      </div>

      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
