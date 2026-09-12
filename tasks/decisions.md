# Decisions - TheTable

Durable calls that shape how this project is built or run. Newest first.
Check here (and todo.md) before asking Xero anything - if it is answered here,
it is decided.

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
