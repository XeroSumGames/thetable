import type { NextConfig } from "next";

// TheTable is the always-free home for Xero Sum Games' standalone character
// generators. Each generator lives in its OWN repo and its OWN Vercel project
// (kept out of any commercial app repo, per those repos' AGENTS.md rules). We
// surface them under thetable.xerosumgames.com via proxy rewrites so the public
// URL sits on THIS origin while the code stays where it is.
//
// The generators' visit beacons post an absolute URL to the shared log-visit
// edge function with a hardcoded page tag (page='/apegenerator', '/space1999'),
// so analytics keep flowing to the existing /ape-log dashboard from this origin
// unchanged. (The log-visit function must allow this origin via CORS.)
//
// Use each generator's STABLE production alias (never the per-build hashed URL,
// which is behind Vercel's auth wall and changes every deploy).
const GENERATOR_REWRITES: { slug: string; deployment: string }[] = [
  // Planet of the Apes RPG (D6 Magnetic Variant)
  // Served from 'potagenerator' (a fresh Vercel project). The original
  // 'apegenerator' project's builds hang in an UNKNOWN state; repoint here until
  // that project is fixed/reconnected in the Vercel dashboard.
  { slug: "apegenerator", deployment: "https://potagenerator.vercel.app" },
  // Space: 1999 RPG (Modiphius 2d20)
  { slug: "space1999", deployment: "https://space1999generator.vercel.app" },
  // Judge Dredd & the Worlds of 2000 AD (WOIN / N.E.W.)
  { slug: "dredd-generator", deployment: "https://dredd-generator.vercel.app" },
  // The Walking Dead Universe RPG (Free League / Year Zero Engine)
  { slug: "walkingdead-rpg", deployment: "https://walkingdead-rpg.vercel.app" },
  // Traveller (Mongoose 2nd Edition)
  { slug: "traveller-generator", deployment: "https://traveller-generator.vercel.app" },
  // 2300AD (Mongoose Traveller setting)
  { slug: "2300ad-generator", deployment: "https://2300ad-generator.vercel.app" },
  // Twilight: 2000 4th Edition (Free League / Year Zero Engine)
  { slug: "twilight2000-generator", deployment: "https://twilight2000-generator.vercel.app" },
];

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // The A24 Viewing Ledger is a self-contained static page (public/a24/
      // index.html) served at the clean /a24 path. It gates itself behind the
      // shared Supabase login and is locked to the Thriver admin account via
      // RLS (sql/add-a24-state on TheTapestry). Not linked from anywhere.
      { source: "/a24", destination: "/a24/index.html" },
      ...GENERATOR_REWRITES.flatMap(({ slug, deployment }) => [
        { source: `/${slug}`, destination: deployment },
        { source: `/${slug}/:path*`, destination: `${deployment}/:path*` },
      ]),
    ];
  },
};

export default nextConfig;
