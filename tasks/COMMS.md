# COMMS - questions for Xero on TheTable

Comms owns this file. Lanes add to OPEN; Comms puts the question to Xero,
records his answer in ANSWERED with a date, and routes the outcome to the
owning lane.

Do NOT ask Xero anything already answered in decisions.md or todo.md.
Verify a thing is actually reachable before asking him to test it.

Sessions (route with mcp__ccd_session_mgmt__send_message; Xero does not relay):
- Table | Puffer Fish (hub)        local_373a5c5c-ee39-47ef-92a9-0bf3ef94544d
- Table | HP (features)            local_4aca6765-6aab-4c0e-961d-be4b5c01da3c
- Table | Character Generators     local_1fa2c241-d7af-4e86-86dd-319b6f2df3bd
- Table | Comms (this lane)        local_894fe581-b1be-4366-ae60-d38ce452c53c

## OPEN

### 1. Add TheTable origin to Supabase redirect URLs (added 2026-09-11, HP -> Puffer Fish)

Xero-only dashboard action, verified and ready to put to him as-is. In the shared
Supabase project: Auth -> URL Configuration -> Redirect URLs, add
https://thetable.xerosumgames.com. One click. Only affects NEW-signup
confirmation emails; existing-account login already works.

Owning lane: Puffer Fish (infra). Comms: put this to Xero.

### 2. Where should the portrait sit on the printed Walking Dead sheet? (added 2026-09-11, Character Generators)

Reproduced and ready to put to Xero; needs a decision, not a test.

The portrait upload works end to end (verified live at walkingdead-rpg HEAD
a37e9d6). The problem is where it lands on the printed sheet: bottom-right,
on top of the TINY ITEMS grid, covering it.

index.html:2716 places it at left:78%;top:82%;width:18%;height:14%. The comment
directly above, on line 2715, says "portrait -> top-left corner of description
box". Code and comment disagree, so one of them was changed without the other.

This is a design call rather than a bug fix: the official sheet has no dedicated
portrait box, and the description box the comment names is space players write
in. Options for Xero:

  (a) leave it where it is, over TINY ITEMS
  (b) move it to the description box, as the comment intends - costs some
      writing space
  (c) somewhere else he names
  (d) drop it from the printed sheet entirely and keep the portrait on screen

One-line change either way. No rush - it has sat six weeks.

Owning lane: Character Generators. Comms: put this to Xero.

## ANSWERED

*(dated log, newest first)*

### 2026-09-11 - Give Table | HP its own worktree? -> YES (a)

Asked by Puffer Fish. Verified by Comms first: `git worktree list` showed only
TheTable (main) and TheTable-comms (lane/comms), so HP and Puffer Fish really
were sharing one working tree on main.

**Xero: (a) yes.** Add worktree ../TheTable-hp on branch lane/hunt-peck,
mirroring MeSuite. Routed to Puffer Fish (owning lane) 2026-09-11. See
decisions.md for the worktree creation + re-home status.
