"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useRef, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { commission, site } from "@/data/carData";
import { cn } from "@/lib/cn";

type Values = { name: string; email: string; interest: string; month: string; message: string; consent: boolean };
type Errors = Partial<Record<keyof Values, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validate(v: Values): Errors {
  const e: Errors = {};
  // Insertion order = visual order, so submit focuses the first error on screen.
  if (!v.interest) e.interest = "Choose what you would like to do.";
  if (v.name.trim().length < 2) e.name = "Please tell us your name.";
  if (!EMAIL.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if (v.message.length > 800) e.message = "Please keep it under 800 characters.";
  if (!v.consent) e.consent = "We need your permission to reply.";
  return e;
}

const empty: Values = { name: "", email: "", interest: "", month: "", message: "", consent: false };

export function Commission() {
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (touched[key]) setErrors(validate(next));
  };
  const blur = (key: keyof Values) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validate(values));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched({ name: true, email: true, interest: true, message: true, consent: true });
    const first = Object.keys(found)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    // Static export: no server. Connect a form service here (see README).
    await new Promise((r) => setTimeout(r, 900));
    setStatus("sent");
  };

  const show = (k: keyof Values) => (touched[k] ? errors[k] : undefined);
  const fid = (k: string) => `${uid}-${k}`;

  return (
    <section
      id="commission"
      aria-labelledby="commission-title"
      className="relative overflow-hidden rounded-t-[2.5rem] bg-cream px-gutter pt-24 pb-24 text-night md:rounded-t-[4rem] md:pt-32 md:pb-32"
    >
      <div className="grid gap-14 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <p className="font-mono text-hud text-burgundy uppercase">{commission.eyebrow}</p>
          <h2
            id="commission-title"
            className="mt-4 font-display text-[clamp(1.75rem,4.2vw,3.5rem)] leading-[1.02] uppercase"
          >
            {commission.title[0]}
            <em className="block font-serif text-[1.15em] normal-case text-burgundy">{commission.title[1]}</em>
          </h2>
          <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-night/70">{commission.body}</p>
          <a
            href={`mailto:${site.email}`}
            className="mt-8 inline-block font-mono text-hud text-night/60 uppercase underline-offset-4 hover:text-burgundy hover:underline"
          >
            {site.email}
          </a>
        </Reveal>

        <div className="md:col-span-6 md:col-start-7">
          <AnimatePresence mode="wait">
            {status === "sent" ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                role="status"
                className="border-t border-night/15 pt-8"
              >
                <p className="font-serif text-4xl text-burgundy italic">Grazie, {values.name.split(" ")[0]}.</p>
                <p className="mt-4 max-w-md leading-relaxed text-night/70">
                  Your request for <strong className="font-medium">{values.interest.toLowerCase()}</strong> has been
                  noted. We will reply to {values.email} within two working days.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setValues(empty);
                    setTouched({});
                    setErrors({});
                    setStatus("idle");
                  }}
                  className="mt-8 font-mono text-hud text-night/60 uppercase underline underline-offset-4 hover:text-burgundy"
                >
                  Send another request
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                ref={formRef}
                noValidate
                onSubmit={onSubmit}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-8"
                aria-describedby={`${fid("note")}`}
              >
                <fieldset>
                  <legend className="font-mono text-hud text-night/55 uppercase">I would like</legend>
                  <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-invalid={!!show("interest")}>
                    {commission.interests.map((opt, i) => {
                      const on = values.interest === opt;
                      return (
                        <label
                          key={opt}
                          className={cn(
                            "cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-burgundy",
                            on ? "border-burgundy bg-burgundy text-cream" : "border-night/20 hover:border-night/50",
                          )}
                        >
                          <input
                            type="radio"
                            name="interest"
                            value={opt}
                            checked={on}
                            data-field={i === 0 ? "interest" : undefined}
                            onChange={() => {
                              setTouched((t) => ({ ...t, interest: true }));
                              set("interest", opt);
                            }}
                            className="sr-only"
                          />
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                  <FieldError id={fid("interest-err")} msg={show("interest")} />
                </fieldset>

                <div className="grid gap-8 sm:grid-cols-2">
                  <Field label="Full name" id={fid("name")} error={show("name")}>
                    <input
                      id={fid("name")}
                      data-field="name"
                      autoComplete="name"
                      value={values.name}
                      onChange={(e) => set("name", e.target.value)}
                      onBlur={() => blur("name")}
                      aria-invalid={!!show("name")}
                      aria-describedby={show("name") ? `${fid("name")}-err` : undefined}
                      className={inputCls(!!show("name"))}
                      placeholder="Giulia Ferri"
                    />
                  </Field>
                  <Field label="Email" id={fid("email")} error={show("email")}>
                    <input
                      id={fid("email")}
                      data-field="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      value={values.email}
                      onChange={(e) => set("email", e.target.value)}
                      onBlur={() => blur("email")}
                      aria-invalid={!!show("email")}
                      aria-describedby={show("email") ? `${fid("email")}-err` : undefined}
                      className={inputCls(!!show("email"))}
                      placeholder="you@example.com"
                    />
                  </Field>
                </div>

                <Field label="Preferred month (optional)" id={fid("month")}>
                  <select
                    id={fid("month")}
                    value={values.month}
                    onChange={(e) => set("month", e.target.value)}
                    className={cn(inputCls(false), "appearance-none")}
                  >
                    <option value="">Any first Saturday</option>
                    {commission.months.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Anything we should know? (optional)" id={fid("message")} error={show("message")}>
                  <textarea
                    id={fid("message")}
                    data-field="message"
                    rows={3}
                    value={values.message}
                    onChange={(e) => set("message", e.target.value)}
                    onBlur={() => blur("message")}
                    aria-invalid={!!show("message")}
                    aria-describedby={show("message") ? `${fid("message")}-err` : undefined}
                    className={cn(inputCls(!!show("message")), "resize-none")}
                    placeholder="The car you drive now, the one you miss most…"
                  />
                </Field>

                <div>
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-night/70">
                    <input
                      type="checkbox"
                      data-field="consent"
                      checked={values.consent}
                      onChange={(e) => {
                        setTouched((t) => ({ ...t, consent: true }));
                        set("consent", e.target.checked);
                      }}
                      aria-invalid={!!show("consent")}
                      className="mt-0.5 size-4 accent-burgundy"
                    />
                    I agree that the atelier may contact me about this request. Nothing else, ever.
                  </label>
                  <FieldError id={fid("consent-err")} msg={show("consent")} />
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group inline-flex items-center gap-3 rounded-full bg-burgundy px-7 py-4 font-mono text-hud text-cream uppercase transition-colors hover:bg-burgundy-bright disabled:opacity-60"
                  >
                    {status === "sending" ? "Sending…" : "Request a viewing"}
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                  </button>
                  <p id={fid("note")} className="font-mono text-hud text-night/45 uppercase">
                    Reply within two working days
                  </p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

const inputCls = (invalid: boolean) =>
  cn(
    "mt-2 w-full border-0 border-b bg-transparent px-0 py-2.5 text-base text-night placeholder:text-night/30 focus:ring-0 focus:outline-none",
    invalid ? "border-burgundy-bright" : "border-night/25 focus:border-night",
  );

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="font-mono text-hud text-night/55 uppercase">
        {label}
      </label>
      {children}
      <FieldError id={`${id}-err`} msg={error} />
    </div>
  );
}

function FieldError({ id, msg }: { id: string; msg?: string }) {
  return (
    <p id={id} aria-live="polite" className="mt-2 min-h-4 text-xs text-burgundy-bright">
      {msg}
    </p>
  );
}
