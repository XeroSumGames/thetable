import fs from "fs";
import path from "path";
import VisitBeacon from "../components/VisitBeacon";
import LaunchSignup from "../components/LaunchSignup";

// Buttons show a picture only if one exists in public/. Missing -> no image, so
// the button looks exactly like the text-only version. Drop a file in and
// redeploy. Generators use gen-<slug>.*, properties use prop-<key>.*.
function assetImage(prefix: string, key: string): string | null {
  for (const ext of ["svg", "png", "webp", "jpg", "jpeg"]) {
    if (fs.existsSync(path.join(process.cwd(), "public", `${prefix}-${key}.${ext}`))) {
      return `/${prefix}-${key}.${ext}`;
    }
  }
  return null;
}

const genImage = (slug: string) => assetImage("gen", slug);
const propLogo = (key: string) => assetImage("prop", key);

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
    tagline: "Using the Xero Sum Games SRD, The Table supports most genres but works best for gritty, hardboiled stories. Always free.",
    href: "/table",
    external: false,
  },
  {
    key: "tapestry",
    name: "The Tapestry",
    tagline: "Designed to support Distemper, a post-apocalyptic tabletop roleplaying game set in a world where 90% of humanity have died out in less than a year.",
    href: "https://thetapestry.distemperverse.com",
    external: true,
  },
  {
    key: "tableau",
    name: "The Tableau",
    tagline: "Designed to support Displaced, a hard science-fiction tabletop roleplaying game set 130 years in the future as mankind starts to colonize other planets.",
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
  { slug: "apegenerator", title: "Planet of the Apes RPG", system: "Published by Magnetic Press" },
  { slug: "space1999", title: "Space 1999 RPG", system: "Published by Modiphius" },
  { slug: "dredd-generator", title: "Judge Dredd (WOIN) RPG", system: "Published by EN Publishing" },
  { slug: "walkingdead-rpg", title: "The Walking Dead RPG", system: "Published by Free League" },
  { slug: "traveller-generator", title: "Traveller RPG", system: "Published by Mongoose Publishing" },
  { slug: "2300ad-generator", title: "2300AD RPG", system: "Published by Mongoose Publishing" },
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
          <a className="auth-btn" href="/login">Create account / Log in</a>
        </div>
        <p className="tagline">
          Three virtual tabletops (VTTs) and a collection of character generators for games I play.
        </p>
      </header>

      <nav className="properties" aria-label="Games">
        {PROPERTIES.map((p) => {
          const logo = propLogo(p.key);
          return (
            <a
              key={p.key}
              className={`prop prop--${p.key}${logo ? " prop--logo" : ""}`}
              href={p.href}
              {...(p.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="prop-logo" src={logo} alt={p.name} />
              ) : null}
              <span className="prop-text">
                <span className={`prop-name${logo ? " prop-name--hidden" : ""}`}>
                  {p.name}
                </span>
                <span className="prop-tagline">{p.tagline}</span>
              </span>
            </a>
          );
        })}
      </nav>

      <section className="gens" aria-label="Character generators">
        <h2 className="section-label">Character generators</h2>
        <div className="gens-row">
          {GENERATORS.map((g) => {
            const img = genImage(g.slug);
            return (
              <a key={g.slug} className="gen" href={`/${g.slug}`}>
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="gen-thumb" src={img} alt={g.title} />
                ) : null}
                <span className="gen-title">{g.title}</span>
                <span className="gen-system">{g.system}</span>
              </a>
            );
          })}
        </div>
      </section>

      <section className="home-signup" aria-label="Update notifications">
        <LaunchSignup
          label="Notify me of updates to these tools"
          source="/thetable-home"
          doneMessage="You're on the list. We'll email you about updates to these tools."
        />
      </section>

      <footer className="foot">
        <p>The Table is always free. Built by Xero Sum Games.</p>
      </footer>
    </main>
  );
}
