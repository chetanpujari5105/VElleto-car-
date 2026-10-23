import { footer, nav, site } from "@/data/carData";

export function Footer() {
  return (
    <footer className="overflow-hidden bg-cream px-gutter pb-8 text-night">
      <div className="flex flex-col gap-10 border-t border-night/15 pt-12 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <p className="font-serif text-2xl text-burgundy italic">{footer.line}</p>
          <p className="mt-3 text-sm leading-relaxed text-night/60">{footer.credit}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-12 gap-y-3 font-mono text-hud uppercase">
            {[...nav, { label: "Private viewing", href: "#commission" }].map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-night/60 hover:text-burgundy">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p
        aria-hidden
        className="mt-16 text-center font-display text-[clamp(3rem,17.5vw,19rem)] leading-[0.8] tracking-[0.02em] text-burgundy"
      >
        {site.marque}
      </p>

      <div className="mt-10 flex flex-col gap-3 font-mono text-hud text-night/50 uppercase sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} {site.name} · All figures illustrative</span>
        <a href="#top" className="hover:text-burgundy">
          Return to the hall ↑
        </a>
      </div>
    </footer>
  );
}
