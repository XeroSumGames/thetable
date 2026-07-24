type Generator = {
  slug: string | null; // null = not wired yet (renders as "coming soon")
  name: string;
  system: string;
  blurb: string;
};

// The free generators surfaced on this origin. A `slug` maps to a proxy rewrite
// in next.config.ts (thetable.xerosumgames.com/<slug>). Set `slug` when a
// generator's Vercel project is live and its rewrite is added.
const GENERATORS: Generator[] = [
  {
    slug: "apegenerator",
    name: "Planet of the Apes",
    system: "D6 Magnetic Variant",
    blurb:
      "Roll up a character for the POTA tabletop RPG — archetypes, skills, and gear.",
  },
  {
    slug: "space1999",
    name: "Space: 1999",
    system: "Modiphius 2d20",
    blurb:
      "Build a Moonbase Alpha crew member — department, skills, focuses, and talents.",
  },
  {
    slug: null,
    name: "Coming soon",
    system: "",
    blurb: "A third generator is on the way.",
  },
];

export default function Home() {
  return (
    <main className="wrap">
      <header className="masthead">
        <p className="kicker">Xero Sum Games</p>
        <h1>The Table</h1>
        <p className="tagline">
          A free, always-open table. Play the Xero Sum Games SRD, or grab a
          character generator. No account. No cost.
        </p>
      </header>

      {/* Hero: the vanilla-SRD virtual tabletop — the equivalent of Distemper
          (TheTapestry) and Displaced (TheTableau), free and genre-neutral. */}
      <a className="hero" href="/table">
        <span className="hero-kicker">Virtual Tabletop</span>
        <span className="hero-title">The Table</span>
        <span className="hero-sub">
          The Xero Sum Games SRD, played online — the free, vanilla engine behind
          Distemper and Displaced, open to any genre.
        </span>
        <span className="hero-cta">Enter The Table →</span>
      </a>

      <section className="gens" aria-label="Character generators">
        <h2 className="section-label">Character generators</h2>
        <div className="grid">
          {GENERATORS.map((g) => {
            const card = (
              <>
                <h3>{g.name}</h3>
                {g.system && <p className="system">{g.system}</p>}
                <p className="blurb">{g.blurb}</p>
                {g.slug && <span className="cta">Open generator →</span>}
              </>
            );
            return g.slug ? (
              <a key={g.name} className="card" href={`/${g.slug}`}>
                {card}
              </a>
            ) : (
              <div key={g.name} className="card card--soon" aria-disabled="true">
                {card}
              </div>
            );
          })}
        </div>
      </section>

      <footer className="foot">
        <p>Always free. Built by Xero Sum Games.</p>
      </footer>
    </main>
  );
}
