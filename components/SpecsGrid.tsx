import { Reveal } from "@/components/Reveal";
import { specsGrid } from "@/data/carData";

export function SpecsGrid() {
  return (
    <section
      id="specification"
      aria-labelledby="specs-title"
      className="relative px-gutter pt-28 pb-24 md:pt-40 md:pb-32"
    >
      <div className="grid gap-10 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <p className="font-mono text-hud text-gold uppercase">{specsGrid.eyebrow}</p>
          <h2
            id="specs-title"
            className="mt-4 font-display text-[clamp(1.75rem,4.4vw,3.75rem)] leading-[1.02] uppercase"
          >
            {specsGrid.title[0]}
            <em className="block font-serif text-[1.15em] normal-case text-gold">
              {specsGrid.title[1]}
            </em>
          </h2>
          <p className="mt-6 font-mono text-hud text-cream/40 uppercase">{specsGrid.note}</p>
        </Reveal>

        <dl className="grid grid-cols-2 border-t border-l border-cream/10 md:col-span-7 lg:grid-cols-4">
          {specsGrid.items.map((item, i) => (
            <Reveal
              key={item.label}
              delay={(i % 4) * 0.06}
              className="group relative flex min-h-40 flex-col justify-between border-r border-b border-cream/10 p-4 transition-colors hover:bg-burgundy/15 md:min-h-48 md:p-5"
            >
              <dt className="font-mono text-hud text-cream/45 uppercase">{item.label}</dt>
              <dd>
                <span className="font-display text-[clamp(1.5rem,2.6vw,2.4rem)] leading-none text-cream">
                  {item.value}
                </span>
                {item.unit && (
                  <span className="ml-1.5 font-serif text-lg text-gold italic">{item.unit}</span>
                )}
                <span className="mt-3 block text-xs leading-snug text-cream/50">{item.detail}</span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
