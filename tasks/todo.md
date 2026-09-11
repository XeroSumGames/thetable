# TODO - TheTable backlog

Tracked work that is NOT yet ready to put to Xero. Check here (and decisions.md)
before re-filing or re-asking. Items marked "needs repro" must be reproduced live
by the owning lane before they become a Comms/Xero ask - do not spend Xero's
attention on an unverified claim.

## Character Generators lane

- [ ] walkingdead-rpg "Print to official sheet" - fixed in 33efe51 + dddc6f8,
      never print-tested. Cannot be verified headless; needs a real print preview.
      STATUS: needs repro. walkingdead-rpg HEAD a37e9d6, no follow-up in ~6 weeks
      as of 2026-09-11. Reproduce, then route to Comms if still broken.
- [ ] walkingdead-rpg portrait upload - 22cdcce wired the file input to change
      instead of click; pushed, never confirmed live.
      STATUS: needs repro. Confirm it still reproduces, then route to Comms.

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
