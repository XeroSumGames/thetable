# Mothership VTT - architecture plan (DRAFT, pending Xero's calls)

Target: **mothership.xerosumgames.com** (own subdomain - SUPERSEDES the original
/mothershipVTT framing; see decisions.md 2026-09-11 "Third-party VTTs get their
own subdomain"). Planning only - no code until
scope + visual direction are confirmed (see COMMS.md OPEN and the mockup sent
directly in chat). Source material: E:\Documents\My RPG's\Mothership (core
rules) and D:\Coding\RPG Character Generators\mothership-generator (Char-Gen's
creation-engine data, in progress).

## 1. What Mothership actually needs, mechanically

Read Player's Survival Guide v1.2 (44p) and Warden's Operations Manual v1.2a
(60p) directly rather than assuming. Findings that shape scope:

- **Character:** 4 Stats (Strength/Speed/Intellect/Combat), 3 Saves
  (Sanity/Fear/Body), Health/Wounds/Stress as current+max(or min) tracks,
  ~50 Skills across 3 tiers (Trained +10/Expert +15/Master +20), a Class
  (Marine/Android/Scientist/Teamster) each with a fixed Trauma Response,
  inventory/loadout, credits, High Score (sessions survived).
- **Resolution:** roll-under d100 vs a Stat or Save; Advantage/Disadvantage =
  roll twice, take best/worst; a fixed crit-fail band (90-99 always fails).
  This is pure data + a dice roller - no simulation engine needed.
- **Panic:** on gaining Stress at/above a threshold, roll d20 on a fixed
  table of escalating effects/conditions. Table data, not logic.
  **Verify against the source before implementing:** an OCR/extraction pass
  is not a substitute for reading the actual trigger rule and table in full.
- **Combat:** abstract range bands (Adjacent/Close/Long/Extreme), not a grid.
  Damage vs Health -> Wound roll (5 damage-type columns: Blunt/Bleeding/
  Gunshot/Fire/Gore) when Health hits 0 -> Death Save at max Wounds. The
  Death Save has a genuinely fun physical ritual (GM hides a d10 under a cup,
  reveals it once someone checks the body) - worth a real UI moment, not just
  a hidden dice roll.
- **Warden's Operations Manual is mostly GM PROSE ADVICE + random tables**
  (Themes d100, Lore d100, Factions d100, Settlements d100, job/pay tables),
  not a tactical ship-combat system. Ship combat is handled narratively
  ("stay grounded", "39.2 Space is Dangerous") - there is no deck/power/
  drone simulation to build. This is the single biggest scope-reducer versus
  TheTableau: **no ship-combat sim is needed for parity with the source
  material.**
- NPC stat blocks are compact and data-shaped:
  `6 Guards [C:35 stun baton 1d5 dmg I:35 w:1(10)]` - Combat, weapon,
  Instinct, Wounds. Easy to template.

## 2. Reuse, not rebuild

- **mothership-generator** (Char-Gen's lane, D:\Coding\RPG Character
  Generators\mothership-generator): same shape as the other 7 generators -
  single static index.html, no build step, own repo/Vercel project. Its
  "creation engine" (241d3e3) transcribes classes/skills/equipment/tables
  and rolls up a character. Its DATA (the transcribed tables) is exactly what
  the VTT's data model needs and should be reused verbatim rather than
  re-transcribed from the PDFs a second time - ask Char-Gen for the
  structured data (JSON) once its generator ships, don't duplicate the
  transcription work. The generator itself stays a separate creation tool
  (matches the "generators own repo" convention); the VTT consumes its data,
  not its UI.
- **TheTableau** (D:\Coding\VTTs\TheTableau): the direct precedent for "a
  real VTT on this stack." Same stack (Next.js + Supabase), and it already
  solved the two hard problems a Mothership VTT would otherwise reinvent:
  Supabase Realtime channels for live shared state (app/ship/page.tsx,
  app/stories/[id]/table/page.tsx) and campaign/session/RLS patterns
  (campaigns, campaign_members tables). Worth reading those two files
  directly as a template once Tier 3 (live session) is greenlit - do not
  design realtime sync from scratch.
- **TheTable's own conventions:** hand-rolled CSS with custom properties, no
  Tailwind, forced dark theme (see app/globals.css) - matches the rest of
  the portfolio and is the default unless the mockup pushes somewhere
  incompatible with that.

## 3. Scope tiers (proposed - Xero picks how far Phase 1 goes, see COMMS)

1. **Character sheet** (must-have): stats/saves/skills/health/wounds/stress/
   panic/inventory/credits, live-editable, persisted per owner. A dice
   roller wired to it (Stat Checks, Saves, Adv/Disadv, crit bands, Wound
   roll on Health 0, the hidden-die Death Save).
2. **GM tools:** NPC stat-block builder/roster, the random tables (Themes/
   Lore/Factions/Settlements/Jobs) as rollable lookups, a Warden's screen
   equivalent (quick-reference panel).
3. **Live session (the actual "VTT" part):** GM + players in one session,
   shared visibility rules (GM sees everyone's Stress/Health; a player's
   dice roll is visible to the table, or hidden as a GM-only Death Save),
   real-time sync via Supabase Realtime (TheTableau's pattern).

Each tier is independently shippable and useful on its own - this is not an
all-or-nothing build.

## 7. Character data export from the generators (2026-09-11)

Char-Gen's finding, feeding directly into Tier 1: the generators are the
natural character SOURCE for the VTT, but only 4 of 8 (Traveller, 2300AD,
Twilight 2000, Mothership) separate an `src/engine.js` (pure rules, no DOM,
plain state object, fuzz-testable headless) from UI - a character in those
four is already close to a serializable object. The other 4 (apegenerator,
space1999, dredd-generator, walkingdead-rpg) interleave rules/state/DOM in one
index.html; getting structured output from those is real surgery, not a quick
add. Do not assume all eight behave alike in any later plan.

Decided (architecture calls, mine to make - not routed to Xero):

- **Shape:** one shared OUTER envelope, per-game payload underneath - not a
  single universal inner schema. The games genuinely differ (Mothership: 4
  Stats + 3 Saves; Traveller: 6 characteristics + career history), forcing
  them into one shape would be the wrong kind of generic. Envelope:
  `{schemaVersion, system, generator, generatedAt, character: {...game-shaped}}`.
  The VTT parses the envelope and dispatches on `system` to a per-system
  sheet renderer/importer.
- **Transport:** a plain "Download character JSON" button, no live coupling.
  Ruled out a fetch URL or postMessage handshake - both imply the VTT
  iframes or reaches into the generator. This is now MORE right, not less,
  under the subdomain decision: the generators stay on
  thetable.xerosumgames.com/<slug> while the VTT lives on
  mothership.xerosumgames.com, so they are cross-origin to each other and any
  live handshake would need CORS or postMessage plumbing for no gain. A file
  the player downloads and uploads crosses that boundary for free. The VTT
  gets a matching "Import character" upload - the exact pattern /a24 already
  ships (Import backup), reused rather than invented.
- **Versioning:** `schemaVersion` from day one (start at 1), so a future VTT
  reading an old export can tell.

Char-Gen is adding the export to Mothership before it ships, as the reference
implementation the other 3 engine-based generators follow. Not holding up the
Mothership deploy for this - it is additive to an already-verified generator,
not a redesign.

## 4. Architecture questions - ANSWERED 2026-09-11

Both forks are settled (COMMS ANSWERED, and decisions.md carries the durable
convention). Recorded here because they shape everything below:

- **Topology: own subdomain, `mothership.xerosumgames.com`.** Own repo, own
  Vercel project, own Supabase project, linked from the hub. NOT a proxied
  subpath. Why the original /mothershipVTT proposal was wrong: a Next.js app
  behind a path rewrite has to carry a `basePath` kept permanently in sync
  with the hub's rewrite table - a coupling the eight static generators never
  pay, because each is a single index.html with no build step and no router.
  A subdomain removes that coupling and isolates auth storage per app, for
  the price of one DNS record.
- **Auth: full email/password accounts** on the VTT's OWN Supabase project,
  same shape as TheTable and Tapestry - NOT the shared Tapestry pool, and
  not a lighter link+name scheme. Tier 3 therefore needs a real signup flow.

Two of my own citations were wrong when I filed these, corrected by Comms -
worth keeping so they don't get re-cited: the "keep The Table standalone"
decision is **README.md:37-39, not decisions.md**, and it gates only the
monorepo consolidation, nothing else. And the /a24 precedent only ever READ
existing thriver accounts - it has never created a player account in the
shared pool, so it was never precedent for putting players there.

## 5. Phase 0 gate - CLEARED 2026-09-11

Xero's rule was: visual mockup + font/color settled before any implementation.
Three directions were put up (Terminal / Zine / Signal); he reframed them
rather than picking one - **Terminal and Zine are the dark and light modes of
one design**, Signal is dropped. Full call and the token contract that follows
from it are in decisions.md; mockup canvas:
https://claude.ai/code/artifact/3d4ccdc6-380f-420a-b690-0f9a5e67aeb7

The build constraint that falls out of it: structure and field positions are
identical in both modes, only the token layer swaps, and toggling must never
move anything on the page. Design every new component against the token names,
never against a literal color or font.

## 6. Status - Tier 1 SHIPPED 2026-09-11

Live: **https://mothership-vtt.vercel.app** (stable alias; never link the
per-build hashed URL, it sits behind Vercel's auth wall).

- Repo: github.com/XeroSumGames/mothership-vtt (PRIVATE for now, branch main).
- Vercel: project mothership-vtt, git-connected, auto-deploys on push.
- Supabase: project `dtcqtbrfghuxtogkarzy` (mothership-vtt) created in the
  XeroSumStudio org `ztiibbpagibquyyojvjw`. **Provisioned but NOT yet wired** -
  Tier 1 runs on local state.
- DNS: NOT done. mothership.xerosumgames.com still needs a Wix CNAME to
  cname.vercel-dns.com. The app is fully usable on the .vercel.app alias until
  then, so this is a finishing step, not a blocker.

Built: the two-mode token layer (app/globals.css) carrying all six layout-lock
rules, and lib/rules.ts - Mothership 1e resolution transcribed from PSG v1.2
with page citations, pure and DOM-free so it stays headlessly testable.
Verified live: roll-under d100, skill bonuses, advantage/disadvantage, doubles
as Criticals (99 -> Critical Failure confirmed), failed Save gains 1 Stress,
and a Critical Failure auto-firing a Panic Check that rolls d20 against Stress
and reads the real table. Mode swap measured at 1 drifting element out of 160
(a native select, 1px, moves nothing) and identical 1496px page height.

### Tier 1b SHIPPED 2026-09-11: auth, persistence, import

- **Auth**: email/password on this project's own user pool. The sheet is behind
  the gate; sign-out in the header.
- **Persistence**: `public.characters`, owner-scoped RLS, `updated_at` trigger
  (sql/001-characters.sql). Debounced autosave with a visible Saving/Saved
  state, gated on initial load so the sample can never overwrite a real
  character. Character stored as a jsonb payload shaped like the generator's
  export, so imported and hand-rolled characters are the same thing to the
  table and a rules change needs no migration.
- **Import**: reads the generator's JSON export. Written against the
  generator's ACTUAL engine output rather than section 7's prose - it emits
  CAPITALISED stat keys (Strength, not strength), class as an object,
  condition grouped, and loadout as one comma-joined string with Armor Points
  embedded as "(AP n)". An importer assuming lowercase would have produced a
  sheet of zeroes silently.
- **Verified**: RLS denies anonymous reads (returns []) and rejects anonymous
  inserts (42501). 27 importer assertions pass against a real generator
  fixture, including hostile inputs. `npm run test:import`.

**NOT verified by me, and it needs Xero:** signing in and the end-to-end
import through the UI. Entering passwords and creating accounts is outside
what I do, so the authenticated path - sign up, sheet loads, roll, autosave,
sign out, sign back in, character still there, import a .mothership.json - is
his to walk once.

### Tier 1c SHIPPED 2026-09-11: wounds, damage cascade, Death Save

Full d10 x 5 Wounds Table and the d10 Death Table (PSG p28.2, p29), verbatim.
Damage now behaves like the book rather than flooring at zero: Health drops, at
zero the character gains a Wound and rolls the table for that damage type,
Health resets to Maximum and the carryover is subtracted - so ONE hit can cause
several Wounds - and reaching Maximum Wounds calls for a Death Save.

The Death Save keeps the table ritual (p29.2): the die is rolled immediately
and CONCEALED, revealed only when someone spends a turn checking your vitals.
It is not re-rolled on reveal; the result already exists, which is the point.

**Verified live** (behind a temporary local-only auth bypass, reverted and
never committed): 60 damage vs 14 Health cascaded to 2 Wounds with correct
gunshot-column entries, hit Maximum Wounds, raised a concealed Death Save with
no roll visible, and revealed 00 -> the correct unconscious band, stable across
re-renders. Plus 71 unit assertions (`npm test`), including ~10,000 randomised
rolls checked against invariants rather than one lucky result.

### Next, in order
1. **Multiple characters**: the table already supports N per user; the UI
   assumes one.
2. **Bleeding** (PSG p32.2) - several Wounds entries grant "Bleeding +N" and
   nothing currently tracks it.
3. **Tier 2/3** per section 3. Tier 3 needs a campaigns/members join before a
   GM can read a player's sheet - do NOT widen the owner policy to get there.

### Known rough edges (deliberate, not forgotten)
- Stress is unbounded, matching the book. The stress bar is drawn against a
  denominator of 20 because d20 is the Panic Check die, so 20 is the point
  where panic is certain - past that the bar just pins full.
- Wounds/Health steppers are manual; the Wound table and Death Save (PSG p29)
  are not implemented yet.

Cleared: topology + auth (subdomain, own Supabase, full accounts), visual
direction (dark Terminal / light Zine), the character-import contract
(section 7, and the Mothership generator already emits conforming JSON).

Remaining before Tier 1 can start, in order:
1. Stand up the infra: repo, Vercel project, Supabase project, DNS record for
   mothership.xerosumgames.com.
2. Build the two-mode token layer FIRST, before any component - it is the
   thing every later screen depends on.
3. Tier 1 character sheet + dice roller against those tokens.

No dependency on Character Generators any more - Mothership generator shipped
2026-09-11 and its JSON export is live, so the import target exists.
