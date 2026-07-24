# TheTable — deploy runbook (Phases 2–4)

Phase 1 (scaffold) is done locally in this repo. The remaining phases touch
external systems (Vercel, DNS, Supabase) and the live revenue site, so they're
staged here rather than executed blind.

**Sequencing rule: bring TheTable up and verify it FIRST, then flip TheTapestry.
Never leave the generators dark.**

---

## Phase 2 — Deploy + domain

1. **Create the GitHub repo** `XeroSumGames/thetable` and push this repo to it.
2. **Vercel project:** New Project → import `XeroSumGames/thetable`. Framework
   auto-detects Next.js. No env vars needed (the hub has no backend). Deploy.
   - Verify the `*.vercel.app` URL serves the landing page and that
     `/apegenerator` and `/space1999` proxy through correctly.
3. **Custom domain:** Vercel project → Settings → Domains → add
   `thetable.xerosumgames.com`.
4. **DNS at the registrar for `xerosumgames.com`:** add the record Vercel shows.
   Typically a CNAME:
   ```
   thetable   CNAME   cname.vercel-dns.com.
   ```
   (Use whatever target Vercel's domain panel specifies — it may differ.)
5. Wait for DNS propagation + Vercel TLS issuance, then confirm
   `https://thetable.xerosumgames.com` and `/apegenerator`, `/space1999` all load.

## Phase 3 — CORS on the shared beacon

The generators post visits to `log-visit`
(`jbudzglgtxeoaufpejrv.supabase.co/functions/v1/log-visit`). Confirm that
function allows the new origin so analytics keep flowing to `/ape-log`.

- If it already returns `Access-Control-Allow-Origin: *`, nothing to do.
- If it allow-lists specific origins, add `https://thetable.xerosumgames.com`
  and redeploy the function (in the thetapestry repo's
  `supabase/functions/log-visit`).
- Verify: open `/apegenerator` on the live thetable domain, generate a
  character, and confirm a new visit with `page='/apegenerator'` appears in
  `/ape-log`. Check the browser console for CORS errors.

## Phase 4 — Flip TheTapestry (⚠️ production revenue site)

Only after TheTable is verified live. Replace the two **rewrites** in
`C:\thetapestry\next.config.ts` with **redirects** so old links keep working:

```ts
async redirects() {
  return [
    { source: '/apegenerator', destination: 'https://thetable.xerosumgames.com/apegenerator', permanent: true },
    { source: '/apegenerator/:path*', destination: 'https://thetable.xerosumgames.com/apegenerator/:path*', permanent: true },
    { source: '/space1999', destination: 'https://thetable.xerosumgames.com/space1999', permanent: true },
    { source: '/space1999/:path*', destination: 'https://thetable.xerosumgames.com/space1999/:path*', permanent: true },
  ];
}
```

...and delete the corresponding `rewrites()` entries. Pushing this
auto-deploys the commercial Distemper site — do it deliberately, with sign-off.

(Alternative: just delete the rewrites with no redirect, if old links don't need
to survive. Redirects are the safer default.)

## Phase 5 — Housekeeping

- `atlas root add C:\thetable`
- Leave an atlas note: hub is live, VTT is the next layer.
- When the 3rd generator's Vercel project exists: add its `{ slug, deployment }`
  to `GENERATOR_REWRITES` in `next.config.ts` and a card in `app/page.tsx`.
