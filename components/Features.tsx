import { Reveal } from "@/components/Reveal";
import { features } from "@/data/carData";

export function Features() {
  return (
    <section id="atelier" aria-labelledby="features-title" className="relative overflow-hidden pt-16 pb-28 md:pb-40">
      <p
        aria-hidden
        className="text-outline-gold pointer-events-none font-display text-[clamp(4rem,16vw,15rem)] leading-none whitespace-nowrap opacity-60"
      >
        COACHBUILT · COACHBUILT
      </p>

      <div className="px-gutter">
        <Reveal className="-mt-[clamp(2rem,7vw,6rem)] max-w-xl">
          <p className="font-mono text-hud text-gold uppercase">{features.eyebrow}</p>
          <h2
            id="features-title"
            className="mt-4 font-display text-[clamp(1.75rem,4.4vw,3.75rem)] leading-[1.02] uppercase"
          >
            {features.title[0]}
            <em className="block font-serif text-[1.15em] normal-case text-gold">{features.title[1]}</em>
          </h2>
        </Reveal>

        <ul className="mt-14 grid gap-6 md:mt-20 md:grid-cols-3 md:gap-5">
          {features.items.map((f, i) => (
            <li key={f.n} className={i === 1 ? "md:translate-y-16" : undefined}>
              <Reveal delay={i * 0.08}>
                <article className="group">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-night-2">
                    {/* Static export: plain img, already sized by the frame pipeline. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={f.image}
                      alt={f.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 font-mono text-hud text-cream/80">{f.n} / 03</span>
                  </div>
                  <h3 className="mt-5 font-display text-base tracking-[0.12em] uppercase">{f.title}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-cream/60">{f.body}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
