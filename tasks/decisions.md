# Decisions - TheTable

Durable calls that shape how this project is built or run. Newest first.
Check here (and todo.md) before asking Xero anything - if it is answered here,
it is decided.

## 2026-09-13 - Mothership VTT build order: shared game first; maps are zones plus an optional grid

**What (COMMS Q9 a, Q10 b, Xero's reply "Q9A Q10B"):**

1. **Shared game comes first.** A Warden creates a campaign and players join it.
   There is one roll log for the whole table, the Warden can roll hidden, and the
   Warden can read players' sheets. The per-character localStorage log is a
   stopgap until then. Maps and NPCs are built on top of this, not beside it.
2. **Maps: zones by default, grid opt-in.** This follows the books (PSG PDF p30,
   WOM 18.1, Gradient Descent PDF p6): range bands and zone/flowchart maps, not
   squares. The Warden uploads a map image, places tokens freely, hides and
   reveals areas, and keeps room notes on a Warden-only layer. A grid overlay is a
   per-map toggle for groups who want one. Published TKG maps are never bundled
   into the app; the Warden uploads their own.
3. **The Record button becomes Thriver-only** the moment a second player can see
   a game.

**Constraints carried in:**
- The owner-only RLS on `characters` is not widened. The Warden's read access
  goes through a campaign-membership rule of its own.
- Campaigns and members must sit on the one-login model (entry below):
  `property_access` grants the property, and membership grants the campaign.
  Nothing should be built that the move onto Tapestry's identity would have to
  undo.
- Hidden Warden rolls must not reach players' browsers at all, including through
  realtime payloads or the recorder. Filtering them in the UI is not enough.

## 2026-09-12 - One Xero Sum Games login across all four properties, activated per property

**What:** a single account works on TheTapestry, TheTableau, TheTable and
Mothership - and every VTT after them. Access to each property is granted
SEPARATELY, by a confirmation link, so one login does not silently mean access
to everything.

Xero's flow, as he specified it:

1. Someone signs up at any property. Say TheTapestry.
2. They go to Mothership and choose "reuse existing Xero Sum Games account".
3. That sends an activation email for THAT property, exactly like a new signup.
4. No click, no access. Click, and they now have both Tapestry and Mothership.
5. Same again for each further property.

**Shape, decided after he asked what industry standard is.** Standard is
centralised authentication with decentralised authorisation - one identity
provider, each product deciding separately what that identity may do, products
keeping their own data stores. That is Google, Atlassian, Slack, Discord; his
flow is essentially the Slack/Discord per-workspace join.

**But that shape assumes a real IdP.** Supabase projects can accept tokens from
an external issuer, but one Supabase project acting as the issuer for another is
not a first-class path - so "separate databases plus one login" on Supabase
means adding Clerk or Auth0 and migrating existing users onto it. Offered; he
chose the simpler shape:

- **Identity lives in TheTapestry's existing project** (`jbudzglgtxeoaufpejrv`),
  because the real users are already there and migrating live auth is the one
  genuinely dangerous step. Marked "for now, we may reconsider".
- **One database, separated per property** by schema.
- **A `property_access` table - `(user_id, property, status, activated_at)` -
  is the ONLY thing that grants access to anything.** Status carries pending ->
  active, plus blocked for Xero. No access rule anywhere reads a data table
  without going through it.

**That last rule is the whole point and is not a style preference.** If
`property_access` is the sole grant mechanism, moving later to separate
databases behind a real IdP is a data move. If any policy reaches straight into
a table instead, that move becomes a rewrite. Anyone widening a policy here
should read this paragraph first.

**AMENDS the 2026-09-11 topology decision, partially.** That entry says every
third-party VTT gets its own Supabase project and that players get accounts on
the VTT's OWN project, "never the shared Tapestry pool". The AUTH half of that
is now reversed - one shared pool is the point. What still stands: each VTT
keeps its own repo, its own Vercel project and its own subdomain. Only identity
and data storage consolidate.

**Context that makes this affordable now:** it is a beta, nobody is paying, and
there is no grandfathering - one uniform rule for everyone including Xero. The
Mothership project currently holds one user and one character row. This is
dramatically cheaper today than it will be with real players.

**Also true, and to be built in from the start:** the activation link is a
credential. Single-use, expiring, bound to the account it was issued for - a
forwarded email must not be an access grant.

**Free vs paid:** some properties will have paid components, but every property
has a free mode. So `property_access` needs an entitlement dimension, not just
allow/block.

**Status: NOT STARTED.** Sequenced after multiple-characters-per-user on the
Mothership VTT, by his call. Nothing touches TheTapestry's live auth until the
Tapestry lane has been brought in - an atlas note is on that project.

## 2026-09-12 - Mothership VTT adopts the house app frame STRUCTURALLY, not visually

**What:** the VTT moves from its current single scrolling column to the
two-sidebars-plus-centre-panel frame that TheTapestry and TheTableau use. Xero's
call, asked and answered directly: **structurally.** Same shape, same widths,
same collapse behaviour as the other two properties - while keeping its own
Terminal/Zine two-mode identity. The frame is the house pattern; the skin stays
Mothership's.

**Why it was never decided before:** `tasks/mothership-vtt-architecture.md`
specifies the mechanics, the scope tiers, the export contract and the two-mode
visual identity, and has NO section on the app shell. So the sheet grew as one
scrolling column by default rather than by choice. That is the gap this closes.

**Why it is not cosmetic.** Two defects from Xero's own walkthrough and the next
queued feature all resolve into this one piece of work:

- The Roll log is currently the LAST section on the page, so a roll made at the
  top landed below the fold. He marked step 5 "there needs to be a log or a
  'current roll' area so the outcome is super clear". A readout above the Stats
  patched it; a persistent right rail is the actual fix, because the log is then
  always on screen.
- He marked step 10 "there needs to be a 'new character' or random or similar as
  I am just importing the same file". Character switching belongs in a left
  rail, and that is the same surface the queued multiple-characters-per-user
  feature needs - the `characters` table already supports N rows while the UI
  assumes one.

**Constraint carried into it:** the six layout-lock rules still apply. Whatever
the frame is, both modes must measure identical - and note that rule 5 has
already proven insufficient on its own once: a `<select>` with explicit
font-family AND line-height still sized its box from the font's own metrics and
drifted 1px. Fixed-height controls (rule 6) are the reliable answer, and any new
rail must be measured in both modes rather than assumed.

**Still to settle:** the concrete widths, what exactly each rail holds, and the
narrow-width collapse behaviour, all pending a survey of how the other two
properties actually implement it. Copy the house frame; do not invent a third.

## 2026-09-12 - Session recorder: on the hub and the VTT, ported not shared

**What:** both TheTable's hub and mothership-vtt carry their own copy of the
session recorder (`lib/recorder.ts` + `components/Recorder.tsx`), ported from
TheTableau's, which came from TheTapestry's `playtest-recorder`. Xero asked for
the capture function the other two properties have, so a playtest arrives as a
dump instead of a description.

**Copied, not shared, and that is deliberate.** Four properties in four repos
with no shared package; a port is what the lineage already does. The cost is
that a fix has to be walked along the chain by hand - which is exactly what
happened on day one, when the inert-listener bug was found on the VTT and had
to be fixed in the hub too, and then walked out to TheTableau (its `610a50ec`,
committed not pushed). **TheTapestry never had it** - same guard but no cleanup
at all, so its listeners install once and stay. (First recorded here as both
carrying it, which was wrong, corrected the same day - see lessons.md.) If
this chain grows a fourth or fifth consumer, that cost stops being worth it and
the answer becomes a small published package.

**Arming differs per property, on purpose:**
- **Hub: hidden until armed** with `?rec=1` (sticky per browser, `?rec=0`
  disarms). It is a public unauthenticated marketing site and a Record button
  sitting on it for every visitor is wrong.
- **VTT: always visible.** It is an unlisted fan tool behind an auth wall, and
  the expensive failure there is finishing a ten-step walkthrough having
  forgotten to arm the recorder. A recording never leaves the browser until it
  is downloaded, so a stray visitor seeing the button costs nothing.

Hotkeys work regardless on both: Ctrl+Shift+R start/stop, Ctrl+Shift+L dump,
Ctrl+Shift+M mark, Ctrl+Shift+P peek.

**COVERAGE, the thing to understand before reading a hub dump:** the hub
recorder sees its five React pages only. The 8 generators are proxy rewrites to
other Vercel projects and `/a24` is a static file, so they are separate
documents that hub JS never runs in, whatever the address bar says. Every hub
dump states this in its own `meta.coverage`, so an empty recording is not
misread as a broken recorder. Covering the generators would need a second
vanilla-JS build injected into eight hand-built `index.html` files owned by the
Character Generators lane - **not done, and not to be assumed.**

**What never goes in a dump:** field VALUES. The `input` event kind records
field identity and value length only, because these forms hold emails and
passwords. Keys matching password / token / cookie / authorization are redacted,
strings clip at 500 chars, object walks cap at depth 3, and network capture
records method / path / status / duration and error codes but never request or
response bodies. The VTT additionally withholds the concealed Death Save roll
until it is revealed - see `lessons.md`.

**What would make us revisit:** if the generators genuinely need coverage, or
if a third consumer appears, replace the port chain with a package rather than
copying a fourth time.

## 2026-09-11 - Mothership VTT visual direction: one design, two modes (dark Terminal / light Zine)

**What:** Xero picked from three mockup directions and reframed them - Terminal
and Zine are not competing options, they are the DARK and LIGHT modes of one
design. Signal (the clean modern treatment) is dropped.

- **Dark = Terminal.** Amber phosphor (#ffb400) on near-black (#07080a),
  JetBrains Mono throughout, 1px hairline rules, scanline texture, ALL CAPS
  labels. This is the DEFAULT - The Table's hub is forced-dark, so the VTT
  opens dark and matches.
- **Light = Zine.** Warm paper (#e9e3d3), near-black warm ink (#181410),
  Archivo Black display + Work Sans body, 2.5px hard rules, halftone dots,
  stamp red (#a8241c) as the single accent. Mirrors the actual printed
  rulebooks.

**This is a full IDENTITY swap, not a palette swap** - fonts, border weight,
texture and letter case all change with the mode, not just colors. That is
deliberate (each mode is faithful to a different real artifact: a ship
terminal and a printed zine) but it has a standing cost: every new component
has to be designed twice, for the life of the project. Accepted knowingly.

**The constraint that keeps it affordable:** structure and field positions are
IDENTICAL across both modes. Only the token layer changes. Toggling must never
move anything on the page. Implementation follows from that - one set of CSS
custom properties covering --bg/--panel/--ink/--ink-dim/--line/--line-width/
--accent/--font-display/--font-body/--texture/--case, swapped as a block.

**LAYOUT LOCK - the rules that make two identities safe.** Xero's constraint:
"the boxes/lines/positioning should be as close to identical as possible",
accepting only glyph-width variance. The first pass FAILED this - hand-writing
two files let real drift in (tiles 95px vs 97px tall, name 40px vs 42px, sheet
sections 4px out). Four rules fixed it, verified by measuring every element in
both modes:

1. **Generate both modes from one skeleton.** The mockups are built by a script
   from a single geometry block, so the layout CSS is byte-identical and only a
   token block differs. Care is not a mechanism; generation is.
2. **`line-height` must be explicit on the root.** This was the root cause of a
   cascade that shifted 129 elements. `line-height: normal` resolves
   DIFFERENTLY PER TYPEFACE (JetBrains Mono ~1.3, Work Sans ~1.17), so the
   inherited strut differed by 1px and pushed everything below it. Never leave
   line-height unset anywhere in this app.
3. **Borders must not carry layout.** `--bw` is 1px dark / 2.5px light; on an
   auto-height box a real border adds real height. Draw every border as
   `box-shadow: inset 0 0 0 var(--bw)` (or `outline` for dashed) - visually
   identical, zero layout cost. Keeps the Zine's heavy rules for free.
4. **Give re-wrappable text an EXPLICIT height, not a min-height.** First
   attempt used min-height sized against the 1440px mockup; building the real
   app proved that insufficient. At narrower viewports JetBrains Mono wraps the
   trauma paragraph to far more lines than Work Sans and the light panel
   collapsed by 81px. A min-height only holds at the width you measured at. Use
   a fixed height with internal overflow.
5. **Form controls do not inherit line-height.** Rule 2 is not enough on its
   own: button/input/select/textarea take a UA default of `normal`, which
   smuggles per-typeface drift back in through every control. Set
   font-family and line-height on them explicitly.
6. **Prefer controls that cannot rewrap.** A row of chips wrapped to different
   line counts per font AND collapsed at narrow widths (448px of content in a
   61px scroller, in both modes). A segmented control and a select are
   fixed-height by construction - that removes the failure mode instead of
   padding around it. Reach for those over free-flowing chip rows.

*(Rules 4-6 were found by measuring the REAL app, not the mockup. The mockup
was measured at a fixed 1440px and reported zero drift; the running app at a
narrower viewport had 24 drifting elements. Measure the thing that ships.)*

**Verified result:** 0 vertical position differences, 0 height differences, 0
container x differences across all 142 elements; both sheets 1900px tall;
106/142 pixel-perfect on all four dimensions. Remaining variance is confined to
glyph widths inside text runs, which is the agreed-acceptable part.

**What would make us revisit:** if maintaining two identities starts slowing
feature work, collapse to a shared type/border system and keep only the color
swap - the layout is already mode-independent, so that retreat is cheap.

Mockup: https://claude.ai/code/artifact/3d4ccdc6-380f-420a-b690-0f9a5e67aeb7

## 2026-09-11 - mothership-vtt deploys by git push ONLY, never the Vercel CLI

**What:** the mothership-vtt Vercel project is git-connected. Deploy with
`git push origin main`. Never run `vercel deploy` / `vercel --prod` there.

**Why:** a CLI deploy is attributed to the COMMIT AUTHOR EMAIL, and the GitHub
no-reply address we commit with is not a Vercel team member, so Vercel rejects
it:

> 187208146+XeroSumGames@users.noreply.github.com attempted to deploy a commit
> to xerosumgames' projects on Vercel through the Vercel CLI, but they're not a
> member of the team.

A git push is attributed through the GitHub integration instead and works
fine - both push-triggered deploys went Ready while the CLI one landed
`UNKNOWN` and never aliased. **No Vercel Pro upgrade is needed**; the
suggestion in that error is a red herring for our setup.

**The trap to avoid:** the obvious "fix" is to commit as
xerosumgames@gmail.com so the CLI recognises the author. Do NOT. That is the
INVERSE failure and it has already blocked two projects in this org
(walkingdead-rpg and apegenerator - see atlas note #41/#42). Commits keep the
no-reply address; the deploy method changes, not the email.

**Watch for:** a deployment stuck in `UNKNOWN` in `vercel ls` is the signature
of this, and it is the same signature that eventually forced the original
apegenerator project to be deleted and rebuilt as potagenerator. An orphaned
UNKNOWN deploy that never aliased is harmless; a project where EVERY deploy
lands UNKNOWN is the corrupted case.

This generalises: **any git-connected Vercel project in this org deploys by
push.** The CLI is only for standing a project up before it is connected.

## 2026-09-11 - Third-party VTTs get their own subdomain; generators keep the proxied subpath

**What:** a standing rule for how apps reach users on this property, not a
one-off for Mothership.

- **Static character generators** stay proxied subpaths on
  thetable.xerosumgames.com/<slug> (the existing GENERATOR_REWRITES pattern).
  All eight are a single static index.html - no build step, no router - which
  is exactly why a rewrite works for them.
- **Every third-party-IP VTT gets `<game>.xerosumgames.com`**: own repo, own
  Vercel project, own Supabase project, linked from the hub rather than
  proxied through it. Mothership is therefore
  **mothership.xerosumgames.com**, superseding the /mothershipVTT framing the
  planning doc was written around.
- **Players get full email/password accounts on the VTT's OWN Supabase
  project** - never the shared Tapestry pool.

**Why:** a Next.js app behind a path rewrite must carry a `basePath` kept
permanently in sync with the hub's rewrite table. That is a live coupling
between two repos that the static generators never pay, and it breaks in a
way that is annoying to diagnose. A subdomain removes the coupling and
isolates auth storage per app; the cost is one DNS record per VTT. The hub
stays the DIRECTORY for full apps and the PROXY only for static ones.

**Xero's framing:** he declined to pick cold and asked for a rule that would
be applied consistently to every future third-party VTT, then agreed with the
above. So the rule is the decision - Mothership is just its first application.

**Two citations corrected while settling this** (both mine, worth not
re-citing): the "keep The Table standalone" constraint lives at
README.md:37-39, not decisions.md, and gates only the monorepo consolidation.
And /a24 only ever READ existing thriver accounts - it never created player
accounts in the shared pool, so it was not precedent for putting players there.

## 2026-09-11 - Model assignment per lane

**What:** Puffer Fish (hub) Opus 5; Table | HP Sonnet 5; Character Generators
Opus 5; Comms Opus 5. Verified applied 2026-09-11.

**Why:** assign by the cost of an undetected error, not by how much the lane
types. Puffer Fish makes architecture calls that govern every future VTT.
Character Generators transcribes rulebooks into data that ships to users and
that nobody proofreads against the source - a wrong skill prerequisite is
invisible until a player hits it. Comms exists to catch bad claims before they
reach Xero; a miss there propagates a wrong answer to three lanes. HP ships
features on a small Next.js hub where errors surface by running it, so it is the
right place to spend less.

Corrected two drifts at the same time: Puffer Fish had been left on Opus 4.8, a
generation behind, and Character Generators had silently resumed on Sonnet after
a restart. Check `get_session` after any lane restart.

**What would make us drop it:** if Character Generators moves off rules
transcription onto routine wiring, it can drop to Sonnet too.

## 2026-09-11 - Canonical home for the shared name pool: shared/name-pool.json in TheTable

**What:** the 1000-name pool duplicated across walkingdead-rpg (inline
NAME_POOL), traveller-generator and 2300ad-generator (both src/data/names.json,
verified byte-identical by Character Generators - sha f18df6d6aa on a sorted
hash, set-equal in every pairing) gets ONE canonical source at
shared/name-pool.json in TheTable, synced into the 3 consumers by a script
Character Generators owns (tools/sync-name-pool.py in their lane, two modes:
default writes, --check reports drift only and writes nothing).

**Why here, not a generator repo:** precedent already exists - TheTable/public
holds every generator's cover art, so shared generator content living in the
hub is an established pattern, not a new coupling. Nominating one generator
repo as canonical instead would depend on which repos a given checkout has
cloned and break for anyone who only has one. No deploy-time coupling either
way - Vercel serves the static index.html for these, never runs assemble.py,
so this is a local dev-time tool with zero risk to the live sites.

**The wrinkle that shaped this:** walkingdead-rpg has no src/ (hand-built,
edited in place per the program rule, never re-assembled), so the sync script
has two jobs, not one - a straight file copy for the two src/-based consumers,
and marker-based injection into walkingdead-rpg's index.html (the same pattern
Character Generators already uses for the Ape sheet embed).

**What would make us drop it:** if a 4th consumer needed the pool and the
marker-injection approach stopped scaling, revisit as a proper shared package -
not needed at this size.

## 2026-09-11 - How lane branches reach main (shared/hot files only)

**What:** For files every lane reads and a mistake in breaks the whole site -
next.config.ts (GENERATOR_REWRITES), app/page.tsx (GENERATORS tiles),
app/sitemap.ts - a lane commits to its own branch and pushes it, then messages
Puffer Fish (hub) the SHA. Puffer Fish reads the diff and merges to main
itself. No GitHub PR - this repo has never used PRs, and a 3-line rewrite/tile
diff doesn't warrant that overhead. A lane's OWN files (its generator repo, a
gen-*.jpg it owns) still self-ship straight to main exactly as before - this
gate is specifically for the small set of shared/hot files, mirroring
Tapestry's graduated-gate principle (lane-protocol.md) without importing its
full PR machinery, which this repo doesn't have.

**Why:** next.config.ts is one array read by every rewrite; app/page.tsx's
GENERATORS array is read by the whole landing page. A syntax error or bad
entry there doesn't just break the new generator's tile, it can break every
existing one. Cheap for the hub to eyeball before it lands given how small
these diffs are.

**Ownership of the change itself stays with whichever lane is landing a
generator** (Character Generators, as established) - this decision only
governs how it reaches main, not who writes it.

## 2026-09-11 - Table | Character Generators gets its own worktree

**What:** Created worktree ../TheTable-chargen on branch
lane/character-generators. Xero approved.

**Why:** It was the third session on the shared main checkout (with Puffer Fish
and HP). Same collision reason as HP.

**Still to do (Xero):** re-home the running Table | Character Generators session
into D:\Coding\VTTs\TheTable-chargen at its next natural break - NOT mid-T2K,
since re-homing starts a fresh session and loses in-progress context. Until then
it still edits the main checkout; it commits TheTable edits promptly and
coordinates via Comms.

## 2026-09-11 - Table | HP gets its own worktree

**What:** Created worktree ../TheTable-hp on branch lane/hunt-peck. Xero
approved (via Comms), mirroring MeSuite.

**Why:** Puffer Fish, HP, and Character Generators were all running out of the
one main checkout (D:\Coding\VTTs\TheTable). Two-plus sessions editing one
working tree means the last save silently wins - this has cost rework on Tapestry.

**Still to do (Xero):** the running Table | HP session is still homed in the main
checkout; a session's cwd is fixed at launch, so HP must be re-opened as a new
session in D:\Coding\VTTs\TheTable-hp to actually use the worktree. Until then the
worktree exists but HP is still on main. (Table | Character Generators now has
its own worktree too - see the entry above.)

## 2026-09-11 - Stood up a Comms channel (4th session)

**What:** Added a Comms lane for TheTable, matching Tapestry and TheTableau.
Created worktree ../TheTable-comms (branch lane/comms), tasks/COMMS.md
(OPEN / ANSWERED log) and tasks/The Table Smoke Testing.xlsx (one living test
workbook, one worksheet per test ask). New session: Table | Comms.

**Why:** Xero runs several parallel sessions and answers questions in one place
only. "if you have questions (ever, on anything) they should be routed to the
comms channel. i go there ONLY to answer questions which get lost in your stream
of consciousness." Comms owns every question for Xero and the single test
workbook, so the other lanes stop interrupting him separately. Two rules make it
worth the overhead: verify a thing is reachable before asking him to test it,
and check the repo (decisions.md / todo.md) before re-asking.

**What would make us drop it:** If TheTable stays quiet enough that Comms sits
idle for weeks, the project does not need a fourth session yet - retire Comms
and fold its two files back to whoever is active.

**Reference:** tasks/lane-protocol.md in the Tapestry repo, "Comms channel"
section, is the authoritative pattern.
