# TheTable

The always-free home for Xero Sum Games' standalone tabletop character
generators and tools, at **thetable.xerosumgames.com**.

Part of the Xero Sum Games trio:

| Product | Domain | Setting | Tier |
|---|---|---|---|
| Distemper (TheTapestry) | thetapestry.distemperverse.com | post-apocalyptic | free / paid |
| Displaced (TheTableau) | thetableau.xerosumgames.com | science-fiction | free / paid |
| **The Table (this repo)** | **thetable.xerosumgames.com** | vanilla / any genre | **always free** |

## What this is (today)

A thin Next.js landing page that surfaces the free character generators. It has
**no backend** — no auth, no database. The generators themselves live in their
own repos and their own Vercel projects; TheTable proxies them onto this origin
via rewrites in [`next.config.ts`](next.config.ts).

Currently surfaced:

- `/apegenerator` → Planet of the Apes RPG (D6 Magnetic Variant) — repo: `XeroSumGames/apegenerator`
- `/space1999` → Space: 1999 RPG (Modiphius 2d20) — repo: `XeroSumGames/space1999generator`
- (3rd generator: add a `{ slug, deployment }` entry to `GENERATOR_REWRITES` in
  `next.config.ts` and a card in `app/page.tsx` once its Vercel project is live.)

### Analytics

Each generator's visit beacon posts to the shared `log-visit` edge function
(`jbudzglgtxeoaufpejrv.supabase.co`) with a hardcoded page tag, so visits keep
flowing to TheTapestry's `/ape-log` dashboard from this origin. That function
must allow the `thetable.xerosumgames.com` origin via CORS.

## What this becomes (later)

The vanilla / SRD Distemper VTT — `apps/xse` in the eventual monorepo (see
TheTableau's `tasks/merge-plan.md`). The monorepo consolidation is gated behind
Tapestry 1.0; until then this stays a standalone hub.

## Develop

```
npm install
npm run dev
```
