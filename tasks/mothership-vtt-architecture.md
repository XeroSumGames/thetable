# Mothership VTT - architecture plan (DRAFT, pending Xero's calls)

Target: thetable.xerosumgames.com/mothershipVTT. Planning only - no code until
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

## 4. Open architecture questions

Two genuine forks that change the shape of everything downstream. Full
question text with options is in tasks/COMMS.md OPEN (routed there per
protocol, not decided here):

- **Repo/deploy topology:** own repo + own Vercel project + own Supabase
  project, proxied at /mothershipVTT (matches the generators' "own repo"
  convention AND the standing decision to keep The Table standalone until
  Tapestry 1.0 - see decisions.md) vs. folded into TheTable's existing
  Next.js app reusing the shared Tapestry Supabase (matches how /a24 was
  built, less infra to stand up). Recommendation: own Supabase project -
  real players beyond Xero will have accounts/characters here, which is a
  different trust boundary than the thriver-only /a24, and mixing it into
  the shared pool blurs the "no shared platform DB yet" line that was drawn
  on purpose.
- **Auth model:** the Mothership table is presumably Xero + a handful of
  actual players, not the public. Full email/password accounts (mirrors
  TheTable/Tapestry) vs. something lighter - a shareable campaign link +
  a name, no account at all (common in small VTT tools). This decides
  whether Tier 3 needs a signup flow or not.

## 5. Phase 0 gate (before any code)

Per Xero: a visual mockup + font/color decision happens before implementation
starts, independent of the two questions above (the character-sheet screen
exists in every scope tier). Sent directly in chat as a design-canvas
Artifact with a few direction options grounded in Mothership's actual
zine/horror-sci-fi print identity, not a generic app look.

## 6. Status

Planning only. No code, no repo, no Supabase project created. Waiting on:
(a) COMMS answers to the two architecture questions above, (b) Xero's pick
from the mockup, (c) Character Generators finishing its current work
(Mothership generator + whatever's queued after) before build starts.
