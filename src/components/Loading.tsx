import asset from "./utils/asset";
import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [ready, setReady] = useState(false);
  const [exiting, setExiting] = useState(false);

  // hold on 100% for a beat so the number is readable
  useEffect(() => {
    if (percent < 100) return;
    const timer = setTimeout(() => setReady(true), 420);
    return () => clearTimeout(timer);
  }, [percent]);

  // wipe the panel away, then hand off to the intro animation
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;

    const enter = setTimeout(() => {
      setExiting(true);
      import("./utils/initialFX").then((module) => {
        if (cancelled) return;
        setTimeout(() => {
          if (cancelled) return;
          module.initialFX?.();
          setIsLoading(false);
        }, 950);
      });
    }, 650);

    return () => {
      cancelled = true;
      clearTimeout(enter);
    };
  }, [ready, setIsLoading]);

  return (
    <>
      <div className="loading-header">
        <a href={asset("/")} className="loader-title" data-cursor="disable">
          SV
        </a>
      </div>

      <div className={`loading-screen ${exiting ? "loading-clicked" : ""}`}>
        <div className="loading-row">
          <span className="label">Sayanth&nbsp;V</span>
          <span className="label">Portfolio — Full Stack Developer</span>
        </div>

        <div className="loading-center">
          <div className="loading-marquee">
            <Marquee speed={70} autoFill>
              <span>Frontend</span>
              <span>Backend</span>
              <span>Platform</span>
            </Marquee>
          </div>
        </div>

        <div>
          <div className="loading-row">
            <div className="loading-count">
              {Math.min(100, percent)}
              <i>%</i>
            </div>
            <div className={`loading-state ${ready ? "loading-state-ready" : ""}`}>
              {ready ? "Enter" : "Loading"}
            </div>
          </div>
          <div className="loading-bar">
            <div
              className="loading-bar-fill"
              style={{ transform: `scaleX(${Math.min(100, percent) / 100})` }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  let percent: number = 0;

  let interval = setInterval(() => {
    if (percent <= 50) {
      let rand = Math.round(Math.random() * 5);
      percent = percent + rand;
      setLoading(percent);
    } else {
      clearInterval(interval);
      interval = setInterval(() => {
        percent = percent + Math.round(Math.random());
        setLoading(percent);
        if (percent > 91) {
          clearInterval(interval);
        }
      }, 2000);
    }
  }, 100);

  function clear() {
    clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (percent < 100) {
          percent++;
          setLoading(percent);
        } else {
          resolve(percent);
          clearInterval(interval);
        }
      }, 12);
    });
  }
  return { loaded, percent, clear };
};
