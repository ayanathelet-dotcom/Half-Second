import { container } from "../../lib/status.js";

// Each service is shown in the frame shape it is delivered in
const services = [
  {
    title: "Short-form and Reels",
    text: "Hooks, captions and pacing built for the first three seconds, cut for vertical feeds.",
    label: "9:16",
    ratio: "9 / 16",
  },
  {
    title: "YouTube and long-form",
    text: "Story structure, b-roll, sound design and edits that hold attention for the full runtime.",
    label: "16:9",
    ratio: "16 / 9",
  },
  {
    title: "Ads and promos",
    text: "Tight 15 to 60 second cuts, delivered in every placement size your campaign needs.",
    label: "4:5",
    ratio: "4 / 5",
  },
  {
    title: "Brand films and interviews",
    text: "Documentary-style edits with colour grading and a clean audio mix.",
    label: "2.39:1",
    ratio: "2.39 / 1",
  },
];

export default function Services() {
  return (
    <section id="services" className="scroll-mt-16">
      <div className={`${container} py-20 md:py-28`}>
        <h2 className="display max-w-4xl text-[clamp(2.5rem,6vw,5rem)]">
          Four kinds of edits, one standard of finish.
        </h2>

        <ul className="mt-14 border-b border-ink/15">
          {services.map((s) => (
            <li
              key={s.title}
              className="grid items-center gap-6 border-t border-ink/15 py-8 md:grid-cols-[15rem_1fr_1fr] md:gap-10"
            >
              <div className="flex md:justify-start">
                <div
                  aria-hidden="true"
                  style={{ aspectRatio: s.ratio, height: "5.5rem" }}
                  className="flex items-end rounded-[3px] border border-ink/30 bg-panel p-1.5 text-xs font-semibold text-mute"
                >
                  {s.label}
                </div>
              </div>
              <h3 className="display text-[clamp(1.75rem,3vw,2.5rem)]">{s.title}</h3>
              <p className="max-w-md text-[1.02rem] leading-relaxed text-ink/75">{s.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
