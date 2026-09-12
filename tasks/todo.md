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

## Landing page

- [ ] Landing render last confirmed by DOM measurement only (screenshot tool was
      timing out): geometry/aspect/overflow are numerically verified but the final
      render was never eyeballed, and the page has changed since (Twilight 2000
      tile, tile reorder). STATUS: low priority. Consider a landing-render smoke
      worksheet once someone re-verifies visually. Owner: HP / Comms.

## Repo hygiene (Puffer Fish)

- [ ] public/TASLogo.png - untracked, unreferenced orphan asset in the shared
      main checkout. No code points at it, so no prod 404. Confirm with Xero
      whether it is wanted; delete or commit accordingly.
- [ ] tasks/puffer-handoff-2026-07-29.md - untracked and badly stale (C:\thetable
      paths, "four generators", deploy listed as vercel --prod when it is git
      push). Superseded by decisions.md + atlas notes. Offer Xero to delete.
