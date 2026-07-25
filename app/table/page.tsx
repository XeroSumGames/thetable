import type { Metadata } from "next";
import LaunchSignup from "../../components/LaunchSignup";

export const metadata: Metadata = {
  title: "The Table — Xero Sum Games SRD virtual tabletop",
  description:
    "The free, vanilla Xero Sum Games SRD, played online. The engine behind Distemper and Displaced, open to any genre.",
};

export default function TablePage() {
  return (
    <main className="wrap">
      <p className="back">
        <a href="/">← The Table</a>
      </p>

      <header className="masthead">
        <p className="kicker">Virtual Tabletop</p>
        <h1>The Table</h1>
        <p className="tagline">
          Utilizing the Xero Sum Games SRD, The Table supports most genres but
          works best for gritty, hardboiled stories. Always free.
        </p>
      </header>

      <section className="soon-panel">
        <h2>Coming soon</h2>
        <p>
          Built on the Xero Sum Games SRD, the Table offers character creation,
          tactical maps, and campaign options. All yours, all the time.
        </p>
        <LaunchSignup />
      </section>

      <footer className="foot">
        <p>The Table is always free. Built by Xero Sum Games.</p>
      </footer>
    </main>
  );
}
