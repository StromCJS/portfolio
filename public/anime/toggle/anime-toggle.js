// Anime toggle - include on a page with:
//   <link rel="stylesheet" href="anime-toggle.css">
//   <script src="anime-toggle.js" defer></script>
// The script adds its own HTML, so the page needs no extra markup.
// Optional: data-start-after=".social-icons" on the script tag makes him start just to the
// right of that element (bottom-left) instead of in the bottom-right corner.
(function () {
  if (document.getElementById("at-widget")) return; // already added

  const script = document.currentScript;
  const START_AFTER = script && script.dataset.startAfter;

  // Image folder, worked out from where this script lives, so it also works from a
  // sub-folder or once copied into the portfolio's public/ folder.
  const BASE = new URL("images/", script ? script.src : location.href);

  // ---------- Clips and their cloud messages ----------
  // He plays these in order, CLIP_MS each, showing that clip's message in the cloud.
  // HOVER is what he says (and does) while the mouse is on him. Keep messages short (about
  // 55 characters) so they fit the cloud; <strong> words are highlighted in acid green.
  const PLAYLIST = [
    { clip: "wave",         text: "Hey! Today's a great day to <strong>build something</strong>." },
    { clip: "sway",         text: "Stay curious. Keep learning. <strong>Keep going</strong> 🚀" },
    { clip: "point",        text: "Your next big idea is <strong>right there</strong>. Go for it!" },
    { clip: "arm-out",      text: "Small steps every day lead to <strong>big wins</strong> 💪" },
    { clip: "arms-crossed", text: "Believe in yourself. <strong>You've got this</strong> 😎" },
  ];
  const HOVER = { clip: "wave", text: "<strong>Hi!</strong> 👋 Nice to see you here." };
  const CLIP_MS = 5000;

  // The clips are moving parts of the animated videos, cut out frame by frame into sprite
  // sheets by make-clips.py (frames left to right, COLS per row). `frames` must match the
  // counts it prints. Each clip plays through once, then rocks back and forth from frame
  // `hold` to the end (his pose "holding" with a little life) until the next clip.
  const FPS = 15;
  const COLS = 6;
  const CLIPS = {
    "wave":         { frames: 24, hold: 0 },
    "point":        { frames: 27, hold: 8 },
    "sway":         { frames: 21, hold: 0 },
    "arm-out":      { frames: 11, hold: 2 },
    "arms-crossed": { frames: 19, hold: 4 },
  };

  // ---------- Widget HTML ----------
  document.body.insertAdjacentHTML("beforeend", `
    <div id="at-widget" class="at-widget">
      <div class="at-header">
        <span class="at-title">Sayanth</span>
        <div id="at-toggle" class="at-toggle" role="button" tabindex="0"
             aria-label="Open quick links. Drag or use the arrow keys to move.">
          <span class="at-sprite"></span>
        </div>
        <div class="at-bubble">
          <svg class="at-cloud" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M28 80 A18 18 0 0 1 14 50 A22 22 0 0 1 40 20 A40 40 0 0 1 90 10
                     A39 39 0 0 1 140 14 A31 31 0 0 1 180 40 A21 21 0 0 1 178 76
                     A36 36 0 0 1 132 88 A42 42 0 0 1 80 90 A43 43 0 0 1 28 80 Z" />
            <circle cx="197" cy="62" r="5" />
            <circle cx="209" cy="69" r="3" />
          </svg>
          <span class="at-bubble-text"></span>
        </div>
        <div class="at-buttons">
          <button id="at-minimise" class="at-icon-btn" aria-label="Minimise">–</button>
          <button id="at-close" class="at-icon-btn at-close" aria-label="Close">✕</button>
        </div>
      </div>
      <div class="at-panel">
        <div class="at-panel-body">
          <p><strong>Hi there!</strong> Where do you want to go?</p>
          <ul class="at-links">
            <li><a href="#about">About me</a></li>
            <li><a href="#work">My work</a></li>
            <li><a href="#contact">Get in touch</a></li>
          </ul>
        </div>
      </div>
    </div>
    <button id="at-reopen" class="at-reopen">Sayanth</button>
  `);

  const widget = document.getElementById("at-widget");
  const toggle = document.getElementById("at-toggle");
  const reopen = document.getElementById("at-reopen");
  const panel = widget.querySelector(".at-panel");
  const bubble = widget.querySelector(".at-bubble");
  const bubbleText = widget.querySelector(".at-bubble-text");
  const sprite = widget.querySelector(".at-sprite");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // ---------- Clip player ----------
  // Until every sheet has loaded he stands in the still wave pose (CSS); then the clips take
  // over. If a sheet can't load he simply stays the still pose.
  let clipsReady = false;
  let playing = null;      // { name, clip, frame, dir } - the clip on screen
  let wantedClip = "wave"; // the clip to show once the sheets are ready
  let rafId = null;
  let lastTick = 0;

  // The sheets (about 1 MB) only start downloading once the page itself has loaded, so they
  // never hold up the page's own loading.
  function loadClips() {
    new Image().src = new URL("step.webp", BASE).href;   // dragging pose (a still)
    Promise.all(Object.entries(CLIPS).map(([name, clip]) => new Promise((resolve, reject) => {
      clip.rows = Math.ceil(clip.frames / COLS);
      clip.url = new URL(`clips/${name}.webp`, BASE).href;
      clip.img = new Image();   // kept, so the browser keeps the decoded sheet around
      clip.img.onload = () => {
        clip.img.decode().catch(() => {});   // decode early, so switching clips never flashes
        resolve();
      };
      clip.img.onerror = reject;
      clip.img.src = clip.url;
    }))).then(() => {
      clipsReady = true;
      widget.classList.add("at-clips");
      setClip(wantedClip);
      play();
    }, () => {});
  }
  if (document.readyState === "complete") loadClips();
  else window.addEventListener("load", loadClips, { once: true });

  function setClip(name) {
    wantedClip = name;
    if (!clipsReady || (playing && playing.name === name)) return;
    const clip = CLIPS[name];
    const last = clip.frames - 1;
    // With reduced motion he doesn't move: show a frame from the middle of the hold.
    const frame = reduceMotion.matches ? clip.hold + Math.floor((last - clip.hold) / 2) : 0;
    playing = { name, clip, frame, dir: 1 };
    sprite.style.backgroundImage = `url("${clip.url}")`;
    sprite.style.backgroundSize = `${COLS * 100}% ${clip.rows * 100}%`;
    drawFrame();
  }

  function drawFrame() {
    const { clip, frame } = playing;
    const col = frame % COLS;
    const row = Math.floor(frame / COLS);
    sprite.style.backgroundPosition =
      `${col / (COLS - 1) * 100}% ${clip.rows > 1 ? row / (clip.rows - 1) * 100 : 0}%`;
  }

  // Next frame: forwards to the end, then back and forth between `hold` and the end.
  function nextFrame() {
    const p = playing;
    const last = p.clip.frames - 1;
    let next = p.frame + p.dir;
    if (next > last) {                                 // reached the end: rock back
      p.dir = -1;
      next = p.frame - 1;
    } else if (p.dir < 0 && next < p.clip.hold) {      // back at the start of the hold
      p.dir = 1;
      next = p.frame + 1;
    }
    if (next >= 0 && next <= last) p.frame = next;     // (a one-frame clip stays put)
    drawFrame();
  }

  function tick(now) {
    rafId = requestAnimationFrame(tick);
    if (now - lastTick < 1000 / FPS - 2) return;   // -2: don't skip a beat on 60 Hz screens
    lastTick = now;
    if (playing && !reduceMotion.matches) nextFrame();
  }

  // Frames only run while he's on screen (the browser also pauses them in background tabs).
  function play() {
    if (!clipsReady || rafId !== null) return;
    if (widget.classList.contains("at-open") || widget.classList.contains("at-hidden")) return;
    rafId = requestAnimationFrame(tick);
  }

  function pause() {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  // ---------- Clip cycle + cloud messages ----------
  let clipIndex = 0;
  let cycleTimer = null;

  // Shows one clip with its message: he hops into the new clip and the cloud pops in.
  function show({ clip, text }) {
    const animate = !reduceMotion.matches && !widget.classList.contains("at-dragging");
    if (wantedClip !== clip) {
      setClip(clip);
      if (animate) {   // the hop also hides the jump between two separate bits of video
        toggle.animate([{ translate: "0 0" }, { translate: "0 -0.3em", offset: 0.4 }, { translate: "0 0" }],
                       { duration: 260, easing: "ease-out" });
      }
    }
    if (bubbleText.innerHTML !== text) {
      bubbleText.innerHTML = text;
      if (animate) {
        bubble.animate([{ opacity: 0, transform: "translateY(0.4em) scale(0.9)" }, { opacity: 1, transform: "none" }],
                       { duration: 380, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
      }
    }
  }

  function startCycle() {
    stopCycle();
    show(PLAYLIST[clipIndex]);
    cycleTimer = setInterval(() => {
      clipIndex = (clipIndex + 1) % PLAYLIST.length;
      show(PLAYLIST[clipIndex]);
    }, CLIP_MS);
  }

  function stopCycle() {
    clearInterval(cycleTimer);
    cycleTimer = null;
  }

  // Picks the cycle back up - unless the panel is open or he's minimised.
  function resumeCycle() {
    if (cycleTimer || widget.classList.contains("at-open") || widget.classList.contains("at-hidden")) return;
    startCycle();
  }

  // Mouse on him (or keyboard focus): stop, wave and say hi. Leaving picks the cycle back up.
  function sayHi() {
    stopCycle();
    show(HOVER);
  }
  toggle.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") sayHi(); });
  toggle.addEventListener("pointerleave", e => { if (e.pointerType === "mouse" && !drag) resumeCycle(); });
  toggle.addEventListener("focus", () => { if (toggle.matches(":focus-visible")) sayHi(); });
  toggle.addEventListener("blur", resumeCycle);

  // ---------- Open / close / minimise ----------
  function openWidget() {
    stopCycle();
    pause();
    widget.classList.add("at-open");
    place();                               // the open panel is wider, keep it on screen
  }

  function closeWidget() {
    widget.classList.add("at-between");    // hide header while the panel collapses
    panel.style.height = "0";
    setTimeout(() => {
      widget.classList.remove("at-open", "at-between");
      panel.style.height = "";
      place();                             // back to where the user dropped him
      startCycle();
      play();
    }, 400);                               // matches the 0.4s panel transition
  }

  function minimise() {
    stopCycle();
    pause();
    widget.classList.remove("at-open");
    place();                               // back to his closed width and spot
    // the tab pops up where he was standing, so it doesn't land on other buttons
    const box = toggle.getBoundingClientRect();
    widget.classList.add("at-hidden");
    if (box.width) {
      const screenW = document.documentElement.clientWidth;
      const right = screenW - (box.left + box.width / 2) - reopen.offsetWidth / 2;
      reopen.style.right = `${Math.max(EDGE, Math.min(right, screenW - reopen.offsetWidth - EDGE))}px`;
    }
    reopen.classList.add("at-show");
  }

  function restore() {
    reopen.classList.remove("at-show");
    setTimeout(() => {
      widget.classList.remove("at-hidden");
      startCycle();
      play();
    }, 300);
  }

  // Following a quick link closes the panel. If the page has its own link to the same place
  // (like the portfolio's menu), that one is clicked instead, so the page scrolls its own way.
  widget.querySelectorAll(".at-links a").forEach(a => a.addEventListener("click", e => {
    const href = a.getAttribute("href");
    const twin = Array.from(document.querySelectorAll("a[href]"))
      .find(other => other.getAttribute("href") === href && !widget.contains(other));
    if (twin) {
      e.preventDefault();
      twin.click();
    }
    closeWidget();
  }));

  // ---------- Drag to move (left/right along the bottom) ----------
  const EDGE = 12;          // px kept clear of the screen edges
  let wantedRight = null;   // where the user dropped him (px from right); null = CSS default
  let drag = null;          // { startX, lastX, startRight, moved } while the pointer is down
  let suppressClick = false;
  let stopWalkTimer = null;

  function currentRight() {
    return document.documentElement.clientWidth - widget.getBoundingClientRect().right;
  }

  // Applies wantedRight, clamped to the current widget width and screen size.
  // wantedRight itself is never clamped, so opening/closing or resizing the window
  // doesn't lose the spot the user picked. Until he's dragged, he stands just after the
  // START_AFTER element if there is one, otherwise in the CSS corner.
  function place() {
    if (widget.classList.contains("at-hidden")) return;   // minimised: nothing to measure
    const screenW = document.documentElement.clientWidth;
    let right = wantedRight;
    if (START_AFTER) {
      const after = document.querySelector(START_AFTER);
      const r = after && after.getBoundingClientRect();
      // He comes in together with that element (on the portfolio it fades in after the
      // loading screen). If the page has no such element, he shows once the page has loaded.
      const seen = after ? r.width > 0 && (!after.checkVisibility || after.checkVisibility({ opacityProperty: true }))
                         : document.readyState === "complete";
      widget.classList.toggle("at-waiting", !seen);
      if (right === null && r && r.width) right = screenW - r.right - 8 - widget.offsetWidth;
    }
    if (right !== null) {
      const max = screenW - widget.offsetWidth - EDGE;
      widget.style.right = Math.max(EDGE, Math.min(right, max)) + "px";
    }

    const box = widget.getBoundingClientRect();
    widget.classList.toggle("at-left", box.left + box.width / 2 < screenW / 2);
  }

  toggle.addEventListener("pointerdown", e => {
    if (e.button !== 0) return;
    suppressClick = false;
    drag = { startX: e.clientX, lastX: e.clientX, startRight: currentRight(), moved: false };
    toggle.setPointerCapture(e.pointerId);  // keep getting moves even off the element
  });

  toggle.addEventListener("pointermove", e => {
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    if (!drag.moved && Math.abs(dx) < 5) return; // tiny wobble still counts as a click

    if (!drag.moved) {
      drag.moved = true;
      widget.classList.add("at-dragging");
    }

    // Face the way he's being moved, and bob while the pointer keeps moving.
    const step = e.clientX - drag.lastX;
    if (step !== 0) {
      widget.classList.toggle("at-dir-right", step > 0);
      widget.classList.add("at-walking");
      clearTimeout(stopWalkTimer);
      stopWalkTimer = setTimeout(() => widget.classList.remove("at-walking"), 150);
    }
    drag.lastX = e.clientX;

    wantedRight = drag.startRight - dx;
    place();
  });

  function endDrag() {
    if (!drag) return;
    suppressClick = drag.moved;              // a drag shouldn't also open the panel
    if (drag.moved) savePosition();
    drag = null;
    clearTimeout(stopWalkTimer);
    widget.classList.remove("at-dragging", "at-walking", "at-dir-right");
    if (!toggle.matches(":hover")) resumeCycle();   // the mouse may have left him mid-drag
  }
  toggle.addEventListener("pointerup", endDrag);
  toggle.addEventListener("pointercancel", endDrag);

  window.addEventListener("resize", place);
  // the START_AFTER element may only appear later (React), fade in, or move by itself
  if (START_AFTER) {
    widget.classList.add("at-waiting");
    setInterval(() => { if (!drag) place(); }, 250);
  }

  // ---------- Remember position across reloads ----------
  // Stored in this browser only. Wrapped in try/catch because storage can be blocked
  // (private windows, strict privacy settings) - then he just starts in the corner.
  const STORAGE_KEY = "anime-toggle-right";

  function savePosition() {
    try { localStorage.setItem(STORAGE_KEY, String(wantedRight)); } catch (e) {}
  }

  try {
    const saved = parseFloat(localStorage.getItem(STORAGE_KEY));
    if (Number.isFinite(saved)) wantedRight = saved;
  } catch (e) {}
  place();   // also clamps a saved spot if the window is now narrower than when it was saved

  // ---------- Events ----------
  toggle.addEventListener("click", () => {
    if (suppressClick) { suppressClick = false; return; }
    openWidget();
  });
  toggle.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openWidget(); }
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      wantedRight = currentRight() + (e.key === "ArrowLeft" ? 40 : -40);
      place();
      savePosition();
    }
  });
  document.getElementById("at-close").addEventListener("click", closeWidget);
  document.getElementById("at-minimise").addEventListener("click", minimise);
  reopen.addEventListener("click", restore);

  startCycle();
})();
