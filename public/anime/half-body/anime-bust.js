// Half-body anime - stands on top of the resume button as if he's behind it: checks his
// watch, looks up and smiles, with a cloud message. Clicking him opens the resume.
// Include on a page with:
//   <link rel="stylesheet" href="anime-bust.css">
//   <script src="anime-bust.js" data-target=".resume-button" defer></script>
// data-target is the CSS selector of the element he stands on (default ".resume-button").
// He follows it if it moves, and waits until it's on the page (fine for React).
(function () {
  if (document.getElementById("ab-bust")) return; // already added

  const script = document.currentScript;
  const TARGET = (script && script.dataset.target) || ".resume-button";

  // ---------- The clip ----------
  // Sprite sheet from make-bust.py (frames left to right, COLS per row) - these numbers
  // must match what it prints. Frames 0-11: looking at his watch; from 12 he looks up;
  // 15-25: smiling at you.
  const SHEET = {
    url: new URL("images/bust.webp", script ? script.src : location.href).href,
    frames: 26, cols: 6, width: 322, height: 330,
  };
  const FPS = 15;
  const LOOK_UP = 12;      // from this frame on he's looking at you
  const WATCH = [0, 11];   // rocks gently in here while checking the watch...
  const SMILE = [15, 25];  // ...and in here while smiling
  const WATCH_MS = 2000;   // how long he lingers on each
  const SMILE_MS = 4500;

  // ---------- Cloud messages ----------
  // Keep them short (about 30 characters); <strong> words are highlighted in acid green.
  const WATCH_TEXT = "Got a minute? ⏳";
  const SMILE_TEXT = "Here's my <strong>resume</strong> 👇";
  const HOVER_TEXT = "Click me to <strong>open it</strong> 📄";

  // ---------- HTML ----------
  document.body.insertAdjacentHTML("beforeend", `
    <div id="ab-bust" class="ab-bust" aria-hidden="true">
      <div class="ab-cloud">
        <svg viewBox="0 0 200 100" preserveAspectRatio="none">
          <path d="M28 80 A18 18 0 0 1 14 50 A22 22 0 0 1 40 20 A40 40 0 0 1 90 10
                   A39 39 0 0 1 140 14 A31 31 0 0 1 180 40 A21 21 0 0 1 178 76
                   A36 36 0 0 1 132 88 A42 42 0 0 1 80 90 A43 43 0 0 1 28 80 Z" />
          <circle cx="197" cy="62" r="5" />
          <circle cx="209" cy="69" r="3" />
        </svg>
        <span class="ab-cloud-text"></span>
      </div>
      <div class="ab-window">
        <canvas class="ab-figure" width="${SHEET.width}" height="${SHEET.height}"></canvas>
      </div>
    </div>
  `);

  const bust = document.getElementById("ab-bust");
  const figure = bust.querySelector(".ab-window");
  const cloud = bust.querySelector(".ab-cloud");
  const cloudText = bust.querySelector(".ab-cloud-text");
  const ctx = bust.querySelector("canvas").getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // ---------- Standing on the target ----------
  let target = null;
  let ready = false;   // the sprite sheet has loaded - he only shows up once it has

  function place() {
    if (!target || !target.isConnected) target = document.querySelector(TARGET);
    const r = target && target.getBoundingClientRect();
    // not while the target is see-through (a page fading it in): he rises as it appears
    const seen = !!target && (!target.checkVisibility || target.checkVisibility({ opacityProperty: true }));
    const show = ready && seen && r.width > 0 && r.height > 0;
    bust.classList.toggle("ab-show", show);
    if (!show) return;

    const screenW = document.documentElement.clientWidth;
    const w = bust.offsetWidth;
    // centred over the target, but never off the screen
    const centre = Math.min(Math.max(r.left + r.width / 2, w / 2 + 4), screenW - w / 2 - 4);
    bust.style.left = `${centre - w / 2}px`;
    bust.style.top = `${r.top - bust.offsetHeight + 1}px`;   // +1: over the target's top border
    bust.classList.toggle("ab-left", centre < screenW / 2);  // cloud goes on his other side
  }

  window.addEventListener("resize", place);
  window.addEventListener("scroll", place, { passive: true, capture: true });
  setInterval(place, 500);   // also catches the target appearing later or moving by itself

  // ---------- Clip player ----------
  const sheet = new Image();
  let frame = reduceMotion.matches ? 20 : 0;
  let dir = 1;
  let phase = "watch";      // "watch" -> "up" -> "smile" -> "down" -> "watch" ...
  let until = 0;
  let lastTick = 0;
  let hovering = false;

  sheet.onload = () => {
    ready = true;
    until = performance.now() + WATCH_MS;
    place();
    draw();
    requestAnimationFrame(tick);
  };
  // only once the page itself has loaded, so he never holds up the page's own loading
  if (document.readyState === "complete") sheet.src = SHEET.url;
  else window.addEventListener("load", () => { sheet.src = SHEET.url; }, { once: true });

  function draw() {
    const col = frame % SHEET.cols;
    const row = Math.floor(frame / SHEET.cols);
    ctx.clearRect(0, 0, SHEET.width, SHEET.height);
    ctx.drawImage(sheet, col * SHEET.width, row * SHEET.height, SHEET.width, SHEET.height,
                  0, 0, SHEET.width, SHEET.height);
    say(hovering ? HOVER_TEXT : frame >= LOOK_UP ? SMILE_TEXT : WATCH_TEXT);
  }

  function step(now) {
    if (phase === "up" || phase === "down") {
      frame += phase === "up" ? 1 : -1;
      if (phase === "up" && frame >= SMILE[1]) { phase = "smile"; until = now + SMILE_MS; dir = -1; }
      if (phase === "down" && frame <= WATCH[0]) { phase = "watch"; until = now + WATCH_MS; dir = 1; }
    } else if (now > until) {
      phase = phase === "smile" ? "down" : "up";
      return step(now);
    } else {
      const [lo, hi] = phase === "smile" ? SMILE : WATCH;
      if (frame + dir > hi || frame + dir < lo) dir = -dir;
      frame += dir;
    }
    draw();
  }

  function tick(now) {
    requestAnimationFrame(tick);   // the browser pauses this in background tabs
    if (now - lastTick < 1000 / FPS - 2) return;   // -2: don't skip a beat on 60 Hz screens
    lastTick = now;
    if (bust.classList.contains("ab-show") && !reduceMotion.matches) step(now);
  }

  // ---------- Cloud ----------
  function say(text) {
    if (cloudText.innerHTML === text) return;
    cloudText.innerHTML = text;
    if (!reduceMotion.matches) {
      cloud.animate([{ opacity: 0, transform: "translateY(0.4em) scale(0.9)" }, { opacity: 1, transform: "none" }],
                    { duration: 380, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
    }
  }

  // ---------- Hover / click ----------
  figure.addEventListener("pointerenter", () => { hovering = true; if (ready) draw(); });
  figure.addEventListener("pointerleave", () => { hovering = false; if (ready) draw(); });
  figure.addEventListener("click", () => { if (target) target.click(); });   // opens the resume
})();
