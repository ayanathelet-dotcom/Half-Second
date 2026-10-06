import { container } from "../../lib/status.js";

const steps = [
  { title: "Send footage", text: "Share a Drive, Dropbox or Frame.io link with a short brief on what you want.", bar: "bg-ink" },
  { title: "First cut", text: "We build the story, pacing, sound and graphics into a first version.", bar: "bg-chroma" },
  { title: "Revisions", text: "Leave notes at exact timestamps. We turn them around and re-export.", bar: "bg-signal" },
  { title: "Delivery", text: "Final files in every aspect ratio you need, ready to publish.", bar: "bg-ink" },
];

export default function Process() {
  return (
    <section id="process" className="scroll-mt-16 border-t border-ink/10 bg-panel">
      <div className={`${container} py-20 md:py-28`}>
        <h2 className="display text-[clamp(2.5rem,6vw,5rem)]">How a project runs</h2>
        <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((s, i) => (
            <li key={s.title}>
              <div className={`h-2.5 rounded-full ${s.bar}`} aria-hidden="true" />
              <p className="tabular mt-5 text-sm font-bold text-mute">Step {i + 1}</p>
              <h3 className="mt-1 text-2xl font-bold">{s.title}</h3>
              <p className="mt-2 max-w-xs text-[0.98rem] leading-relaxed text-ink/75">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
