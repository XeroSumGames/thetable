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

*Verified independently by Comms 2026-09-11 (not relayed on the lane's word):
live domain returns 200 on /, /apegenerator, /signup, /login;
app/signup/page.tsx:24 passes emailRedirectTo `${window.location.origin}${next}`,
so the new origin must be allow-listed or confirmation links break;
app/login/page.tsx:20 uses signInWithPassword, which involves no redirect URL -
that is why existing-account login is unaffected. Put to Xero 2026-09-11.*

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

*Verified by Comms 2026-09-11 at walkingdead-rpg HEAD a37e9d6 (not relayed on
the lane's word): index.html:2716 does read left:78%;top:82%;width:18%;height:14%
and the comment on 2715 does say the description box, so the two disagree; the
description text itself prints at 42.0%, 9.7% (index.html:2671), nowhere near
78/82. NOT independently confirmed: that the covered box is specifically TINY
ITEMS - the box labels live in the SHEET_P1 background image (index.html:2665),
not in code, so that part is taken on the lane's word. No generated text prints
in that region, so what the portrait covers is sheet artwork, not other output.
Put to Xero 2026-09-11.*

Owning lane: Character Generators. Comms: put this to Xero.

### 3. Mothership VTT - repo/deploy topology (added 2026-09-11, Puffer Fish)

New project, planning stage (see tasks/mothership-vtt-architecture.md). Two
questions, both need an answer before any code:

1. Where does it live?
   (a) own repo + own Vercel project + own Supabase project, proxied at
       /mothershipVTT - RECOMMENDED. Matches the generators' convention and
       keeps real player accounts/characters off the shared Tapestry
       Supabase, which the standalone-first decision was drawn to avoid.
   (b) folded into TheTable's own Next.js app, reusing the shared Tapestry
       Supabase - less infra, but mixes real player data into the shared
       pool ahead of Tapestry 1.0.

2. Auth model for players (not Xero)?
   (a) full email/password accounts, same as TheTable/Tapestry
   (b) lighter - a shareable campaign link + a name, no account
   (c) something else he names

Owning lane: Puffer Fish. Comms: put this to Xero.

### 4. Name pools - fold Mothership/Space:1999 into the shared 1000-name pool, or keep bespoke? (added 2026-09-11, Puffer Fish)

Full findings in todo.md. Confirmed real bug (3-way duplicate of a 1000-name
pool, currently in sync, no mechanism to stay that way) is being fixed
regardless - not what this question is about.

This is the one genuine content call: mothership-generator (given 40/family 30)
and space1999generator (given 36/surname 28) both hand-curate a SMALL name list
fitted to their fiction's tone - Mothership's own file literally says why
("ordinary working names rather than heroic ones... blue-collar, multinational
and unglamorous"); Space:1999's includes actual show-canon surnames. Twilight
2000, Ape, and Dredd stay separate regardless (period/nationality-locked,
non-human canon names, and satirical wordplay respectively - not in question).

  (a) keep them bespoke, as curated - RECOMMENDED. The small lists read as
      deliberate genre-fit, not filler; folding in the generic 1000-pool would
      dilute that on every random roll.
  (b) widen them to also draw from the shared 1000-pool (more variety, less
      curated flavor)
  (c) something else he names

Owning lane: Character Generators (their files). Comms: put this to Xero.

## ANSWERED

*(dated log, newest first)*

### 2026-09-11 - Give Table | HP its own worktree? -> YES (a)

Asked by Puffer Fish. Verified by Comms first: `git worktree list` showed only
TheTable (main) and TheTable-comms (lane/comms), so HP and Puffer Fish really
were sharing one working tree on main.

**Xero: (a) yes.** Add worktree ../TheTable-hp on branch lane/hunt-peck,
mirroring MeSuite. Routed to Puffer Fish (owning lane) 2026-09-11. See
decisions.md for the worktree creation + re-home status.
