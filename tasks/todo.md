# TODO - TheTable backlog

Tracked work that is NOT yet ready to put to Xero. Check here (and decisions.md)
before re-filing or re-asking. Items marked "needs repro" must be reproduced live
by the owning lane before they become a Comms/Xero ask - do not spend Xero's
attention on an unverified claim.

## Character Generators lane

- [x] walkingdead-rpg "Print to official sheet" - REPRODUCED GOOD 2026-09-11 at
      HEAD a37e9d6 (33efe51/dddc6f8/22cdcce all confirmed ancestors of HEAD).
      NOT garbled: prints ONE page, letter portrait, with name, archetype, PC and
      NPC anchors, drive, issues, notes, the attribute/skill dot grid, talent plus
      rule text, health track, gear, stored gear and scar all in their proper
      boxes, and no UI chrome leaked onto the sheet. 33efe51 + dddc6f8 held.
      CORRECTION to the original filing: this IS headless-verifiable. print-to-PDF
      renders exactly the print path; only the interactive preview dialog and a
      real printer driver are out of reach. A paper check is nice-to-have, not
      blocking, so this does not need to go to Xero.
- [ ] walkingdead-rpg portrait placement on the printed sheet - the UPLOAD works
      (reproduced 2026-09-11: a real File via DataTransfer plus a genuine change
      event is consumed, the preview renders, and it reaches the print sheet, so
      22cdcce is good). New defect found while verifying it: the portrait prints
      BOTTOM-RIGHT on top of the TINY ITEMS grid. index.html:2716 sets
      left:78%;top:82%;width:18%;height:14% while the comment on 2715 says
      "portrait -> top-left corner of description box". Code and comment disagree
      and the code covers sheet content.
      STATUS: reproduced, Xero-ready. Raised as COMMS.md OPEN #2 - it is a design
      call, not a bug fix. One-line change once he picks a position.
- [x] Mothership (#8, Mothership 1e) - LIVE 2026-09-11. Own infra: repo
      XeroSumGames/mothership-generator, Vercel git-connected, aliased,
      mothership-generator.vercel.app verified 200 before the TheTable change
      landed. TheTable surface merged 51406ff (reviewed a0ccd7e - 4 files, 4
      lines: GENERATOR_REWRITES, GENERATORS tile, sitemap slug, cover art) and
      pushed. VERIFIED LIVE by Puffer Fish independently (not on Char-Gen's
      word): thetable.xerosumgames.com/mothership-generator -> 200,
      byte-identical to the generator's own domain (81181 bytes, same ETag),
      /mothership-generator/ -> 308, homepage tile present, all other routes
      (/, /a24, /table, /walkingdead-rpg) still 200. Verification: node fuzz
      2000/183535 checks/0 failures full coverage, browser probe 63/63 both
      themes, printed profile one page (typical + a deliberate layout ceiling:
      all 42 skills, longest loadout/trinket/patch).
- [ ] mothership-generator-log dashboard on TheTapestry - does not exist yet
      (every other generator has one: app/<gen>-log/page.tsx +
      lib/data/<gen>-log.ts). NOT a blocker - the beacon already posts
      page='/mothership-generator' so data collects from day one regardless.
      Follow-up, same pattern as the other 7. Owner: Character Generators.
- [x] Character JSON export from the generators - SHIPPED with Mothership
      (51406ff, live). Exactly per mothership-vtt-architecture.md section 7:
      {schemaVersion:1, system:"mothership-1e", generator, generatedAt,
      character:{...}}, download-only (<name>.mothership.json), no fetch URL,
      no postMessage. Two additions beyond the spec, both reasonable - Puffer
      Fish confirmed no VTT-side issue: (1) payload carries both rolled and
      final Stats/Saves, not just totals, so the VTT can show what a class
      bonus did; (2) exportCharacter() lives in the ENGINE not the UI, so the
      fuzz harness validates the envelope headlessly every run (2000
      envelopes/run: schema version, system, complete payload, skills keep
      tier+bonus, stats agree with state, survives a JSON round-trip) - also
      means Traveller/2300AD/Twilight2000 can copy the function directly, not
      just the shape. Reference implementation for the other 3 engine-based
      generators, confirmed as intended. Still needed: the VTT's own "Import
      character" side (not built yet - no VTT repo exists).

## Landing page

- [x] Landing render VISUALLY CONFIRMED 2026-09-11 (HP) on the LIVE site at a
      1024px viewport - the screenshot tool is working again, so the "never
      eyeballed" gap is closed. Seen: masthead row (logo + account button side by
      side), all three wordmarks full-column with their taglines on one line, and
      the generator row carrying the Twilight 2000 cover in its new order.
      Measured alongside: wrap 780px centred, each mark 740px ending at x=875,
      documentElement.scrollWidth 1009 vs innerWidth 1024 - no horizontal
      overflow; taglines 11px, 1 line each.
      NOTE for whoever reads a capture next: a mid-scroll screenshot LOOKED
      horizontally cut (wordmark and tagline running off the right edge). That is
      a pane capture artifact - it grabbed ~800px of a 1024px viewport - NOT a
      page defect. Verified by measurement before believing the picture.
      No smoke worksheet needed. Owner: HP (closed).

## Name pools across the generators (investigated 2026-09-11, Puffer Fish)

Full findings below. One confirmed real problem (do the fix); one genuine
content call filed to COMMS (see OPEN #4); the rest are correctly bespoke and
should NOT be merged.

| Generator | Mechanism | Structure | Size | Genre-locked? |
|---|---|---|---|---|
| walkingdead-rpg | `NAME_POOL` inline (index.html) | flat list | 1000 | No - deliberately generic/modern/diverse |
| traveller-generator | `src/data/names.json` | flat list | 1000 | No - byte-identical COPY of walkingdead's pool |
| 2300ad-generator | `src/data/names.json` | flat list | 1000 | No - byte-identical COPY of walkingdead's pool |
| twilight2000-generator | `src/data/names.json` | nested by nationality -> given names | varies | YES - Cold War period + nationality specific |
| mothership-generator | `src/data/names.json` | given (40) + family (30) | 70 | Mild - curated "blue-collar, multinational, unglamorous" per its own file note |
| space1999generator | `NAMES_F`/`NAMES_L` inline | given (36) + surname (28), combinatorial | 64 | Mild - international Moonbase-crew vibe, includes show-canon surnames |
| apegenerator | `APE_NAMES` inline | flat list | 30 | YES - canon Planet of the Apes ape names |
| dredd-generator | `MC1_FIRST`/`MC1_LAST` inline | given (96) + surname (96), combinatorial | 192 words | YES - satirical dystopian wordplay, manually derived FROM the 1000-pool, not real names |

- [x] **Confirmed real problem, plan settled 2026-09-11.** Independently
      re-verified by Character Generators: all 3 pools are the same 1000 names
      (sha f18df6d6aa on a sorted hash, set-equal in every pairing); Mothership
      is correctly separate (70 entries, different sha). WRINKLE Char-Gen
      found: walkingdead-rpg's pool is an inline NAME_POOL in index.html (no
      src/, hand-built, never re-assembled), NOT a names.json like the other
      two - so the sync script needs two modes: a straight file copy for
      traveller-generator/2300ad-generator, and marker-based injection into
      walkingdead-rpg's index.html (same pattern already used for the Ape
      sheet embed). DECIDED (decisions.md): canonical file is
      shared/name-pool.json in TheTable (precedent: TheTable/public already
      holds every generator's cover art); Character Generators builds and owns
      tools/sync-name-pool.py (default = write all 3 consumers, --check =
      report drift only, no writes - the part that actually catches silent
      drift going forward). No deploy-time coupling - purely a local dev tool.
      Lands on lane/character-generators for Puffer Fish's merge, like Mothership.
      PAUSED 2026-09-11 on Xero's direct instruction to Character Generators
      (route through Comms, hold for further instructions) - NOT started,
      lane/character-generators is clean at the Mothership merge, nothing
      half-written. Recon done before the pause, worth keeping so whoever
      resumes doesn't re-derive it: walkingdead-rpg's NAME_POOL is a single
      line at index.html:2334 (1000 quoted strings, 5 references in the file),
      no markers today - plan is to add BEGIN/END marker comments around the
      declaration on first run so every later sync is an exact block
      replacement, not a regex rewrite of a 1000-element line (same pattern as
      apegenerator's tools/embed-sheet.py). traveller-generator/2300ad-generator
      are the easy half: both {_source, _count, names:[...]} in
      src/data/names.json, sync replaces `names` + refreshes `_count`, leaves
      each file's own `_source` note alone. Resume when Xero says go.
- [ ] Traveller/2300AD fake a surname by drawing from the flat 1000-pool
      TWICE and joining - a wart Character Generators already flagged in a
      code comment, not new. Cosmetic, not blocking anything, not part of the
      centralization fix. Low priority - revisit if/when someone's touching
      those generators' name logic anyway.
- [ ] dredd-generator's MC1_FIRST/LAST are worth noting as a THIRD derivative
      of the same 1000-pool (manually curated into satirical compound-word
      parts, not names) - correctly bespoke, not a duplication bug, don't
      touch.

## Repo hygiene (Puffer Fish)

- [x] public/TASLogo.png - NOT a stray (corrected 2026-09-11 by Character
      Generators). Source art Xero gave Char-Gen 2026-08-16 for the Traveller
      generator's Travellers' Aid Society masthead; embedded as base64 in
      traveller-generator (src/tas-logo.b64 is generated from this PNG), which is
      why it looks unreferenced from inside TheTable. It is the original - do NOT
      delete. COMMITTED to public/ 2026-09-11 (Puffer Fish).
- [ ] **One junk row in production `launch_signups`, mine, disclosed 2026-09-12
      (Puffer Fish).** Verifying the new hub recorder I submitted the Notify-me
      form with `secret-address@example.com`. The hub's Supabase URL is
      hardcoded to the shared production project with no dev switch, so the dev
      server posted to the live edge function: POST
      /functions/v1/launch-signup returned 200 and the UI confirmed "You're on
      the list", so assume the row landed with site=table. Harmless but it will
      show in /mailinglist. There is NO delete affordance -
      components/MailingListAdmin.tsx only selects - so removing it needs one
      SQL statement in the Supabase dashboard. Owner: Xero - asked for it to be
      deleted 2026-09-12 and it CANNOT be done from here: the Supabase CLI has
      no arbitrary-SQL subcommand, and the only remote write paths are a
      migration push (which would risk carrying other pending migrations into
      the revenue DB) or psql with the database password. Statement handed to
      him instead, for the dashboard SQL editor:
          select id, email, site, source, created_at from public.launch_signups
            where email = 'secret-address@example.com';
          delete from public.launch_signups
            where email = 'secret-address@example.com';
      Scoped by an address that could only have come from this session.
      LESSON, worth more than the row: any form submitted against this hub's
      dev server hits PRODUCTION data. There is no local Supabase for TheTable.
- [ ] tasks/puffer-handoff-2026-07-29.md - untracked and badly stale (C:\thetable
      paths, "four generators", deploy listed as vercel --prod when it is git
      push). Superseded by decisions.md + atlas notes. Offer Xero to delete.
