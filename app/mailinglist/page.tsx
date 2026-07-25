import type { Metadata } from "next";
import MailingListAdmin from "../../components/MailingListAdmin";

export const metadata: Metadata = {
  title: "Mailing list — The Table",
  robots: { index: false, follow: false },
};

export default function MailingListPage() {
  return (
    <main className="wrap">
      <p className="back">
        <a href="/">← The Table</a>
      </p>

      <header className="masthead">
        <p className="kicker">Admin</p>
        <h1>Launch mailing list</h1>
        <p className="tagline">
          Everyone who signed up to be notified when The Table opens.
        </p>
      </header>

      <MailingListAdmin />
    </main>
  );
}
