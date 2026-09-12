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

### 1. Portrait also removed from the downloadable PDF - intended? (added 2026-09-11, Character Generators)

Verified by Comms: f0dfa68 removed the portrait from BOTH draw sites, and the
commit message says so. Ruling (d) named only the printed sheet.

The lane's reasoning: the PDF is the artifact people keep, so leaving the
portrait there at the same 78%/82% would have preserved the defect the ruling
was about. Comms agrees that is the consistent reading, and the measurements in
ANSWERED apply identically to the PDF.

  (a) Yes, both - the ruling covers any printed artifact. RECOMMENDED, it is
      what already shipped and is internally consistent.
  (b) Print-only - put the portrait back in the downloadable PDF. Small revert.

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

*Checked by Comms before relaying 2026-09-11 (two citations needed correcting,
neither fatal to the question):*

- *The "standing decision to keep The Table standalone" is NOT in decisions.md,
  which the plan doc cites. It is README.md:37-39, and it is narrower than the
  citation implies: it gates the MONOREPO consolidation behind Tapestry 1.0.
  It leans toward (a) but it does not settle the database question, so this is
  genuinely open rather than already-decided.*
- *The /a24 precedent for (b) holds in substance: public/a24/index.html is a
  static page inside TheTable that calls signInWithPassword against the shared
  project and reads `profiles`. Nuance that cuts toward (a): it only READS
  existing thriver accounts. It has never created a new class of player account
  in the shared pool, which is what the VTT would do.*
- *Proxy convention confirmed real: GENERATOR_REWRITES in next.config.ts, seven
  generators each on their own Vercel deployment.*

Owning lane: Puffer Fish. Comms: put this to Xero.

## ANSWERED

*(dated log, newest first)*

### 2026-09-11 - Give Table | Character Generators its own worktree? -> YES

Never formally filed - Puffer Fish flagged it as a question it was about to put
to Xero directly, Comms pulled it back into the channel, and Xero answered
before it was written up.

**Xero: yes.** Create the worktree. Mirrors the HP call earlier the same day and
the MeSuite pattern; Character Generators does edit this repo (it pushed e27b1d1
to tasks/) even though the generator source lives in
D:\Coding\RPG Character Generators\, so it is a real collision risk on the
shared main checkout.

Puffer Fish created it as ../TheTable-chargen on branch lane/character-generators
(commit 4ed0ff5), superseding the lane/chargen placeholder Comms had recorded.
Same caveat as HP: a session's cwd is fixed at launch, so the running
Table | Character Generators session must be re-opened in the new worktree to
actually use it. Routed to Puffer Fish (owning lane) 2026-09-11.

### 2026-09-11 - Portrait on the printed Walking Dead sheet? -> DROP IT (d)

Asked by Character Generators. Comms verified the code at walkingdead-rpg HEAD
a37e9d6 and then measured both candidate placements against the decoded sheet
art (SHEET_P1, index.html:2321): the current 78/82/18/14 clips the bottom GEAR
bonus row as well as covering TINY ITEMS, and the comment's own intent (right
end of the Description box) overflows into the Drive row at that size. Comms
recommended (a) keep-and-resize.

**Xero: (d) drop it from the printed sheet.** The portrait stays on screen; it
does not print at all. Overrides the Comms recommendation - the official sheet
has no portrait box and no box is worth spending on it.

Implementation for Character Generators: remove the `ps-portrait` div emitted at
index.html:2716, and fix the now-dead comment on 2715 so code and comment stop
disagreeing. Keep the upload, preview and on-screen render exactly as they are.
Routed to Character Generators 2026-09-11.

**SHIPPED and verified by Comms 2026-09-11:** walkingdead-rpg f0dfa68 "drop the
portrait from the printed sheet and the exported PDF". `ps-portrait` went 4
occurrences at f0dfa68^ to 0 at HEAD, and the live file at
thetable.xerosumgames.com/walkingdead-rpg serves 200 with 0 occurrences. Upload
and on-screen preview still present (15 other `portrait` references remain).

**Scope widened beyond the question - see OPEN #1.** The portrait was drawn at
78%/82% in TWO places: buildSheet() for the printed sheet and generatePDF() for
the downloadable fillable PDF. The question named only the printed sheet. The
lane removed both, reasoning that leaving it in the PDF would preserve the exact
defect in the artifact people keep. Flagged, not silent.

### 2026-09-11 - Add TheTable origin to Supabase redirect URLs? -> DONE (a)

Asked by HP via Puffer Fish. Comms verified: live domain 200s, signup sends
emailRedirectTo `${window.location.origin}${next}` (app/signup/page.tsx:24),
login uses signInWithPassword so existing logins never needed it.

**Xero: done.** He first added the bare origin
`https://thetable.xerosumgames.com`, which would not have matched - `next`
defaults to `/` and `/mailinglist` is reachable via
components/MailingListAdmin.tsx:17. Corrected to
`https://thetable.xerosumgames.com/**`, confirmed in the dashboard.

Comms also verified the four pre-existing thetapestry rows are correct against
that repo's code (origin + /auth/callback, and + ?next=<encoded>). Known
caveat, not a defect: the two localhost:3000 rows only work if Tapestry's dev
server actually runs on port 3000 - it has been squatted before and had to run
on an auto-port. Routed to Puffer Fish (infra) 2026-09-11.

### 2026-09-11 - Give Table | HP its own worktree? -> YES (a)

Asked by Puffer Fish. Verified by Comms first: `git worktree list` showed only
TheTable (main) and TheTable-comms (lane/comms), so HP and Puffer Fish really
were sharing one working tree on main.

**Xero: (a) yes.** Add worktree ../TheTable-hp on branch lane/hunt-peck,
mirroring MeSuite. Routed to Puffer Fish (owning lane) 2026-09-11. See
decisions.md for the worktree creation + re-home status.
