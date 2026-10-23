import { cabin, engine, form, hero, sequence, site } from "@/data/carData";

/** prefers-reduced-motion: one still poster and the same story as plain sections. */
export function StaticHero() {
  return (
    <>
      <section aria-label="Introduction" className="relative h-svh min-h-[34rem] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sequence.poster}
          alt="The burgundy VELLUTO GT in a dark stone hall, bonnet and doors open"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-transparent to-night" />
        <div className="relative px-gutter pt-28">
          <h1 className="font-display text-[clamp(2.4rem,9vw,8.75rem)] leading-[0.9] text-cream">
            {site.marque}
            <span className="block text-[0.42em] tracking-[0.5em] text-cream/80">GT</span>
          </h1>
          <p className="mt-6 max-w-sm font-display text-xl uppercase">
            {hero.lines.map(([w, a]) => (
              <span key={w} className="block">
                {w} <em className="font-serif text-[1.25em] normal-case text-gold">{a}</em>
              </span>
            ))}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/70">{hero.body}</p>
        </div>
      </section>
      {[
        { id: "the-form", ...form },
        { id: "the-cabin", ...cabin },
        { id: "the-engine", ...engine, points: engine.specs.map((s) => ({ k: s.value, v: s.label })) },
      ].map((s) => (
        <section key={s.id} id={s.id} aria-labelledby={`${s.id}-t`} className="border-t border-cream/10 px-gutter py-20">
          <p className="font-mono text-hud text-gold uppercase">{s.eyebrow}</p>
          <h2 id={`${s.id}-t`} className="mt-3 font-display text-3xl uppercase">
            {s.title[0]} <em className="font-serif normal-case text-gold">{s.title[1]}</em>
          </h2>
          <p className="mt-4 max-w-xl text-cream/70">{s.body}</p>
          <ul className="mt-6 flex flex-wrap gap-8">
            {s.points.map((p) => (
              <li key={p.v}>
                <span className="block font-display text-xl">{p.k}</span>
                <span className="font-mono text-hud text-cream/50 uppercase">{p.v}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
