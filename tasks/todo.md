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
- [ ] Mothership (#8, Mothership 1e) inbound - Char-Gen building it now (data
      layer committed in its lane). On ship it needs the usual TheTable surface
      change: GENERATOR_REWRITES + a GENERATORS tile + app/sitemap.ts. No cover
      art yet (no public/gen-mothership-generator.jpg) so the tile is text-only
      unless Xero supplies one. Char-Gen commits + pings Puffer Fish on landing.

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
