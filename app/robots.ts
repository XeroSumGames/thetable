import type { MetadataRoute } from "next";

const BASE = "https://thetable.xerosumgames.com";

// /a24 is the private Thriver-only viewing ledger. It is already gated at the app and
// RLS level; keeping it out of the index as well means it never turns up in a search.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/a24", "/a24/"] }],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
