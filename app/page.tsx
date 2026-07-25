import VisitBeacon from "../components/VisitBeacon";
import GenThumb from "../components/GenThumb";

type Property = {
  key: string;
  name: string;
  tagline: string;
  href: string;
  external: boolean;
};

// The three Xero Sum Games properties. The Table is this site's own free SRD
// tabletop; the other two are the sister VTTs on their own domains.
const PROPERTIES: Property[] = [
  {
    key: "table",
    name: "The Table",
    tagline: "Utilizing the Xero Sum Games SRD, The Table supports most genres but works best for gritty, hardboiled stories. Always free.",
    href: "/table",
    external: false,
  },
  {
    key: "tapestry",
    name: "The Tapestry",
    tagline: "For Distemper — the post-apocalyptic tabletop roleplaying game.",
    href: "https://thetapestry.distemperverse.com",
    external: true,
  },
  {
    key: "tableau",
    name: "The Tableau",
    tagline: "For Displaced — the hard science-fiction tabletop roleplaying game.",
    href: "https://thetableau.xerosumgames.com",
    external: true,
  },
];

type Generator = {
  slug: string;
  title: string;
  system: string;
};

// Free character generators, surfaced on this origin via proxy rewrites
// (see next.config.ts).
const GENERATORS: Generator[] = [
  { slug: "apegenerator", title: "Planet of the Apes RPG", system: "Published by D6 Magnetic" },
  { slug: "space1999", title: "Space 1999 RPG", system: "Published by Modiphius 2d20" },
  { slug: "dredd-generator", title: "Judge Dredd (Worlds of 2000AD) RPG", system: "Published by WOIN / N.E.W." },
];

export default function Home() {
  return (
    <main className="wrap">
      <VisitBeacon page="/thetable-home" />
      <header className="masthead">
        <span className="logo-plate">
          <img
            className="logo"
            src="/xsg-logo-border.png"
            alt="Xero Sum Games"
            width={1400}
            height={232}
          />
        </span>
        <div className="auth-cta">
          <a className="auth-btn" href="/table">Create account / Log in</a>
        </div>
        <p className="tagline">
          Three virtual tabletops (VTTs) and a collection of character generators for games I play.
          <br />
          Pick a table.
        </p>
      </header>

      <nav className="properties" aria-label="Games">
        {PROPERTIES.map((p) => (
          <a
            key={p.key}
            className={`prop prop--${p.key}`}
            href={p.href}
            {...(p.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            <span className="prop-name">{p.name}</span>
            <span className="prop-tagline">{p.tagline}</span>
          </a>
        ))}
      </nav>

      <section className="gens" aria-label="Character generators">
        <h2 className="section-label">Free character generators</h2>
        <div className="gens-row">
          {GENERATORS.map((g) => (
            <a key={g.slug} className="gen" href={`/${g.slug}`}>
              <GenThumb slug={g.slug} alt={g.title} />
              <span className="gen-title">{g.title}</span>
              <span className="gen-system">{g.system}</span>
            </a>
          ))}
        </div>
      </section>

      <footer className="foot">
        <p>The Table is always free. Built by Xero Sum Games.</p>
      </footer>
    </main>
  );
}
