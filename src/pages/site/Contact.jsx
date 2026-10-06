import { useState } from "react";
import toast from "react-hot-toast";
import { CircleAlert } from "lucide-react";
import api, { getErrorMessage } from "../../lib/api.js";
import Button from "../../components/ui/Button.jsx";
import { Field, inputClass } from "../../components/ui/Field.jsx";
import useTitle from "../../hooks/useTitle.js";
import { SITE } from "../../config/site.js";
import { container } from "../../lib/status.js";
import { todayUTC, weekdayOf } from "../../lib/format.js";

const empty = { name: "", email: "", message: "", preferredDate: "", website: "" };

const next = [
  "We read your brief and the footage you plan to send.",
  "We email you to confirm a time that works for both of us.",
  "We talk, agree the scope, and you get a clear quote.",
];

export default function Contact() {
  useTitle("Book a meeting");
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState(null);
  const [serverError, setServerError] = useState("");

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) er.email = "Enter a valid email address.";
    if (form.message.trim().length < 10) er.message = "Tell us a little more, at least 10 characters.";
    if (!form.preferredDate) er.preferredDate = "Choose the day you'd like to meet.";
    else if (form.preferredDate < todayUTC()) er.preferredDate = "Choose today or a later date.";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setSending(true);
    try {
      await api.post("/enquiries", { ...form, name: form.name.trim(), email: form.email.trim() });
      setSentTo({ name: form.name.trim().split(" ")[0], email: form.email.trim() });
      setForm(empty);
    } catch (err) {
      const msg = getErrorMessage(err);
      setServerError(msg);
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  const day = weekdayOf(form.preferredDate);

  return (
    <div className={`${container} grid gap-14 py-14 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20`}>
      <div>
        <h1 className="display text-[clamp(3rem,8vw,6.5rem)]">Book a meeting</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75">
          Tell us about your project and pick a day that suits you. We'll reply to confirm the time.
        </p>

        <div className="mt-10 rounded-xl border border-line bg-panel p-6 sm:p-8">
          {sentTo ? (
            <div role="status" className="py-6">
              <h2 className="display text-4xl sm:text-5xl">Thanks, {sentTo.name}.</h2>
              <p className="mt-4 max-w-md text-[1.02rem] leading-relaxed text-ink/75">
                Your enquiry is in. We'll reply to {sentTo.email} within {SITE.responseTime}.
              </p>
              <Button variant="outline" className="mt-8" onClick={() => setSentTo(null)}>
                Send another enquiry
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-5">
              {/* honeypot: hidden from people, bots fill it in */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Your name" htmlFor="name" error={errors.name}>
                  <input id="name" className={inputClass} value={form.name} onChange={set("name")} autoComplete="name" placeholder="Rahul Sharma" />
                </Field>
                <Field label="Email" htmlFor="email" error={errors.email}>
                  <input id="email" type="email" className={inputClass} value={form.email} onChange={set("email")} autoComplete="email" placeholder="you@company.com" />
                </Field>
              </div>

              <Field label="About your project" htmlFor="message" error={errors.message} hint="What are you making, how much footage, and when do you need it?">
                <textarea id="message" rows={5} className={`${inputClass} resize-y`} value={form.message} onChange={set("message")} placeholder="We need a 60 second promo cut from two hours of event footage." />
              </Field>

              <Field
                label="Preferred meeting day"
                htmlFor="preferredDate"
                error={errors.preferredDate}
                hint={day ? `That's a ${day}.` : "Pick the date you'd like to talk."}
              >
                <input id="preferredDate" type="date" min={todayUTC()} className={inputClass} value={form.preferredDate} onChange={set("preferredDate")} />
              </Field>

              {serverError && (
                <p role="alert" className="flex items-start gap-2 rounded-[4px] bg-danger/10 px-3.5 py-3 text-sm font-semibold text-danger">
                  <CircleAlert className="mt-0.5 size-4 shrink-0" /> {serverError}
                </p>
              )}

              <Button type="submit" size="lg" loading={sending} className="w-full sm:w-auto">
                Send enquiry
              </Button>
            </form>
          )}
        </div>
      </div>

      <aside className="lg:pt-6">
        <h2 className="text-2xl font-bold">What happens next</h2>
        <ol className="mt-6 space-y-6">
          {next.map((t, i) => (
            <li key={t} className="flex gap-4">
              <span className="tabular grid size-8 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-paper">
                {i + 1}
              </span>
              <p className="pt-1 leading-relaxed text-ink/80">{t}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 border-t border-ink/15 pt-8">
          <p className="font-bold">Prefer email?</p>
          <a href={`mailto:${SITE.email}`} className="mt-1 inline-block text-lg font-semibold text-chroma hover:underline">
            {SITE.email}
          </a>
        </div>
      </aside>
    </div>
  );
}
