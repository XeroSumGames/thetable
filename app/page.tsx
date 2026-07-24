type Generator = {
  slug: string | null; // null = not wired yet (renders as "coming soon")
  name: string;
  system: string;
  blurb: string;
};

// The free generators surfaced on this origin. A `slug` maps to a proxy rewrite
// in next.config.ts (thetable.xerosumgames.com/<slug>). Set `slug` when the 3rd
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
          A free, always-open table for character generators and tabletop tools.
          No account. No cost.
        </p>
      </header>

      <section className="grid" aria-label="Character generators">
        {GENERATORS.map((g) => {
          const card = (
            <>
              <h2>{g.name}</h2>
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
      </section>

      <footer className="foot">
        <p>Always free. Built by Xero Sum Games.</p>
      </footer>
    </main>
  );
}
