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
- [ ] Mothership (#8, Mothership 1e) - BUILT + VERIFIED 2026-09-11 (Char-Gen):
      node fuzz 2000 characters/153535 checks/0 failures, full coverage; browser
      probe 59/59 both themes; printed profile one page at typical and ceiling
      layouts. Cover art exists and fits the band (gen-mothership-generator.jpg,
      900x1236, aspect 0.728). DEPLOY ORDER (Char-Gen's, confirmed correct):
      repo + Vercel + alias first, verify the generator answers on its own
      domain, THEN the TheTable surface (GENERATOR_REWRITES + GENERATORS tile +
      app/sitemap.ts) - doing the tile first would 404 against a project that
      doesn't exist yet. OWNERSHIP: Char-Gen does the TheTable surface change
      too (settled 2026-09-11 - they have done this 7 times, cover art is
      already in their worktree). Lands on lane/character-generators; Puffer
      Fish reviews the diff and merges to main (see decisions.md).
- [ ] mothership-generator-log dashboard on TheTapestry - does not exist yet
      (every other generator has one: app/<gen>-log/page.tsx +
      lib/data/<gen>-log.ts). NOT a blocker - the beacon already posts
      page='/mothership-generator' so data collects from day one regardless.
      Follow-up, same pattern as the other 7. Owner: Character Generators.
- [ ] Character JSON export from the generators - Char-Gen's finding
      2026-09-11: only 4/8 generators (Traveller, 2300AD, Twilight 2000,
      Mothership) separate engine (src/engine.js, pure state, fuzz-testable
      headless) from UI, so only those 4 can cheaply emit structured character
      data for the VTT to import. The other 4 (apegenerator, space1999,
      dredd-generator, walkingdead-rpg) interleave rules/state/DOM in one
      index.html - getting structured output from those needs real surgery,
      not a quick add. Envelope/transport/versioning decided in
      mothership-vtt-architecture.md section 7. Char-Gen adding the export to
      Mothership before it ships, as the reference implementation.

## Landing page

- [ ] Landing render last confirmed by DOM measurement only (screenshot tool was
      timing out): geometry/aspect/overflow are numerically verified but the final
      render was never eyeballed, and the page has changed since (Twilight 2000
      tile, tile reorder). STATUS: low priority. Consider a landing-render smoke
      worksheet once someone re-verifies visually. Owner: HP / Comms.

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

- [ ] **Confirmed real problem, not a design call:** walkingdead-rpg's 1000-name
      NAME_POOL was already copy-pasted (each copy's own file says "Xero asked
      for the same pool here rather than a second list to maintain") into
      traveller-generator and 2300ad-generator's names.json. Verified
      byte-identical across all 3 right now (set-equal, 1000/1000/1000) - but
      it's 3 physical files with NO sync mechanism, so the next edit to any one
      of them (Xero asking to add names, say) silently drifts the other two out
      of sync with no warning. FIX: one canonical source (propose: hosted in
      TheTable, since it's the hub all 8 already proxy under) + a small sync
      script the 3 consumers run instead of hand-copying. Proposing to
      Character Generators (their repos) rather than doing it myself.
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
- [ ] tasks/puffer-handoff-2026-07-29.md - untracked and badly stale (C:\thetable
      paths, "four generators", deploy listed as vercel --prod when it is git
      push). Superseded by decisions.md + atlas notes. Offer Xero to delete.
