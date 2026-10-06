import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { buttonClasses } from "../ui/Button.jsx";
import { container } from "../../lib/status.js";

const FPS = 24;
const SPAN_SECONDS = 30; // the ruler represents a 30 second timeline
const pad = (n) => String(n).padStart(2, "0");

// The headline is laid out as clips on three timeline tracks
const tracks = [
  { offset: "", clips: [
    { text: "We edit", tone: "bg-ink text-paper" },
    { text: "videos", tone: "bg-chroma text-white" },
  ] },
  { offset: "md:ml-[8%]", clips: [
    { text: "people", tone: "bg-panel text-ink ring-1 ring-ink/20" },
    { text: "actually", tone: "bg-ink text-paper" },
  ] },
  { offset: "md:ml-[22%]", clips: [
    { text: "want.", tone: "bg-signal text-ink" },
  ] },
];

const formats = [
  { label: "9:16", ratio: "9 / 16", h: "9rem" },
  { label: "1:1", ratio: "1 / 1", h: "6rem" },
  { label: "16:9", ratio: "16 / 9", h: "6rem" },
];

export default function Hero() {
  const ref = useRef(null);
  const widthRef = useRef(1);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 240, damping: 30, mass: 0.6 });
  const timecode = useTransform(sx, (v) => {
    const frames = Math.max(0, Math.round((v / widthRef.current) * SPAN_SECONDS * FPS));
    return `00:${pad(Math.floor(frames / FPS) % 60)}:${pad(frames % FPS)}`;
  });

  useEffect(() => {
    const measure = () => {
      if (ref.current) widthRef.current = ref.current.offsetWidth || 1;
    };
    measure();
    x.set(widthRef.current * 0.36); // the playhead glides in on load
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [x]);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set(Math.min(Math.max(e.clientX - r.left, 0), r.width));
  };

  let clipIndex = 0;

  return (
    <section ref={ref} onPointerMove={onMove} className="relative overflow-hidden border-b border-ink/10">
      {/* ruler */}
      <div aria-hidden="true" className="relative h-6 text-ink/45">
        <div className="ruler-minor absolute inset-x-0 bottom-0 h-2" />
        <div className="ruler-major absolute inset-x-0 bottom-0 h-3.5 text-ink/70" />
      </div>

      {/* playhead: a line that inverts against whatever it crosses, plus a timecode flag */}
      <motion.div
        aria-hidden="true"
        style={{ x: sx }}
        className="pointer-events-none absolute inset-y-0 left-0 z-10 -ml-px hidden w-0.5 bg-white mix-blend-difference md:block"
      />
      <motion.div
        aria-hidden="true"
        style={{ x: sx }}
        className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block"
      >
        <div className="tabular -translate-x-1/2 rounded-b-[4px] bg-signal px-2 py-1 text-xs font-bold text-ink">
          <motion.span>{timecode}</motion.span>
        </div>
      </motion.div>

      <div className={`${container} pb-16 pt-8 md:pb-24 md:pt-12`}>
        <h1 className="display text-[clamp(3rem,9vw,8.25rem)]">
          {tracks.map((track, ti) => (
            <span key={ti} className={`flex flex-wrap gap-[0.1em] border-b border-ink/10 py-[0.07em] ${track.offset}`}>
              {track.clips.map((clip) => {
                const i = clipIndex++;
                return (
                  <motion.span
                    key={clip.text}
                    initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
                    animate={{ clipPath: "inset(0 0% 0 0)" }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
                    className={`clip inline-flex items-center rounded-[10px] px-[0.34em] pb-[0.1em] pt-[0.04em] ${clip.tone}`}
                  >
                    {clip.text}
                  </motion.span>
                );
              })}
            </span>
          ))}
        </h1>

        <div className="mt-12 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <p className="max-w-[34rem] text-lg leading-relaxed text-ink/80 sm:text-xl">
              Send us raw footage and get back finished edits for Reels, YouTube, ads and brand films, cut to
              hold attention from the first second.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/work" className={buttonClasses({ variant: "primary", size: "lg" })}>
                See our work
              </Link>
              <Link to="/contact" className={buttonClasses({ variant: "outline", size: "lg" })}>
                Book a meeting
              </Link>
            </div>
          </div>

          <div className="md:justify-self-end">
            <div className="flex items-end gap-3" aria-hidden="true">
              {formats.map((f) => (
                <div
                  key={f.label}
                  style={{ aspectRatio: f.ratio, height: f.h }}
                  className="flex items-end rounded-[3px] border border-ink/30 bg-panel p-1.5 text-xs font-semibold text-mute"
                >
                  {f.label}
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-mute">Every edit is delivered in the sizes you publish in.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
