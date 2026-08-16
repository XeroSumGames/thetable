import type { MetadataRoute } from "next";

// The Table is the canonical home for the character generators. Each one is also
// reachable on its own *.vercel.app alias and (for some) on thetapestry, but every
// copy carries <link rel="canonical"> pointing back here, so this is the URL set we
// want indexed.
const BASE = "https://thetable.xerosumgames.com";

const GENERATOR_SLUGS = [
  "apegenerator",
  "space1999",
  "dredd-generator",
  "walkingdead-rpg",
  "traveller-generator",
  "2300ad-generator",
  "twilight2000-generator",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/table`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    ...GENERATOR_SLUGS.map((slug) => ({
      url: `${BASE}/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
