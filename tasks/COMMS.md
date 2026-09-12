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

*(nothing open)*

## ANSWERED

*(dated log, newest first)*

### 2026-09-11 - Mothership callsigns: use or delete? -> USE THEM (a), AND EXPAND TO 50

Asked by Character Generators. Comms verified first: `callsign` appeared exactly
once in the whole generator - the data definition itself - and zero times in
src/app.js and src/engine.js. app.js:503 built the random name as
`pick(N.given) + ' ' + pick(N.family)`, so the 25 callsigns were genuinely dead
data.

**Xero: (a) use them, and expand the pool from 25 to 50.**

Implementation for Character Generators (their files, their curation):

- Wire the callsigns into the random-name button and render them the way
  twilight2000-generator already does - it has a `nicknames` pool, picks from
  it, exposes an editable Nickname field and prints `Name "Nickname"` on the
  sheet. Copy that working pattern rather than inventing one.
- Grow the pool to 50 entries. The 25 new ones are the lane's curation call, not
  Xero's and not Comms'. Hold the tone the file's own `_note` already sets:
  blue-collar, multinational, unglamorous, the sort of name a hauler crew hands
  out. Avoid colliding with Twilight 2000's list, which already contains Doc,
  Preacher and Sparks - the overlap is fine in isolation but three shared
  entries out of 25 would read as copy-paste if the pools grow toward each other.

**Blocked on Xero, not on the lane:** Character Generators has paused all build
work on his own instruction, so this cannot start until he unpauses it. Routed
2026-09-11.

### 2026-09-11 - Fold Mothership/Space:1999 name pools into the shared pool? -> NO, KEEP BESPOKE (a)

Asked by Puffer Fish. Comms verified every claim at source first: Mothership's
src/data/names.json is given=40, family=30 (plus callsigns=25, pronouns=6 that
the question did not mention) and its `_note` really does state the curation
rationale; Space:1999 is NAMES_F=36, NAMES_L=28; Ape carries its own
APE_NAMES=30; Twilight 2000 and Dredd use neither the shared pool nor a matching
array.

**Xero: (a) keep them bespoke.** The curated lists stay as they are. Do not
widen either generator to draw from the shared 1000-name pool - the small lists
are deliberate genre-fit, and folding in generic names would dilute that on
every roll.

*Mechanical reason, filed by Character Generators AFTER Xero had already
answered and verified by Comms 2026-09-11 - it strengthens the same call rather
than changing it:* the shared pool is SINGLE GIVEN NAMES only (1000 entries, 0
containing a space). Traveller and 2300AD fake a surname by drawing from it
twice and joining; traveller-generator's own comment says so: "Two picks joined,
so the sheet gets a full name. The pool is single given names". Mothership's
pool is properly split into given+family, so switching it to the shared pool
would LOSE structure rather than gain names - a straight downgrade, not a
tradeoff. Not independently verified: the same reasoning for Space:1999's
given+surname split, though it has the same shape.

Separate and unaffected: the 3-way duplicate of the 1000-name pool is real and
exact - 2300ad-generator, traveller-generator and walkingdead-rpg each carry a
1000-entry pool, all three byte-identical (sha1 0198a83a7e4a), with no mechanism
keeping them in sync. That fix proceeds regardless and must not touch the
Mothership or Space:1999 lists. Routed to Character Generators (owns the files)
and Puffer Fish (raised it) 2026-09-11.

### 2026-09-11 - Mothership VTT topology and auth -> SUBDOMAIN + full accounts

Asked by Puffer Fish. Comms corrected two citations first: the "standing
decision to keep The Table standalone" is README.md:37-39, not decisions.md, and
it gates only the monorepo consolidation; the /a24 precedent is real but only
READS existing thriver accounts, it has never created player accounts in the
shared pool.

**Xero: own subdomain, and full email/password accounts.** He declined to pick
the topology cold and asked Comms to suggest a rule, with the constraint that
whatever is chosen becomes the CONSISTENT pattern for every future third-party
VTT. He agreed with the suggestion as given:

- **Generators keep the proxied subpath** on thetable.xerosumgames.com.
  Verified 2026-09-11: all eight generator repos are a single static index.html,
  no build step, no router - which is why a rewrite works for them.
- **Every third-party VTT gets `<game>.xerosumgames.com`** - own repo, own
  Vercel project, own Supabase project, linked from the hub. Mothership is
  therefore **mothership.xerosumgames.com**, NOT /mothershipVTT.
- **Players get full email/password accounts**, same as TheTable and Tapestry,
  on the VTT's OWN Supabase project - not the shared Tapestry pool.

Reasoning, for whoever revisits this: a Next.js VTT behind a path rewrite must
carry a `basePath` kept permanently in sync with the hub's rewrite table, a
coupling the static generators never pay. A subdomain removes it and isolates
auth storage per app, at the cost of one DNS record per VTT. The hub stays the
directory for full apps and the proxy only for static generators.

Puffer Fish (owning lane) to update tasks/mothership-vtt-architecture.md, which
currently assumes /mothershipVTT throughout, and to log the convention in
decisions.md - it is a durable call, not just an answer. Routed 2026-09-11.

### 2026-09-11 - Portrait also removed from the downloadable PDF? -> YES (a)

Raised by Character Generators as an extension of the (d) print ruling, rather
than absorbed silently. The portrait was drawn at 78%/82% in two places:
buildSheet() for the printed sheet and generatePDF() for the downloadable
fillable PDF. Comms verified the ship before recording: walkingdead-rpg f0dfa68
takes `ps-portrait` from 4 occurrences to 0, and the live page serves 200 with
none.

**Xero: (a) both.** The ruling covers any printed artifact; the PDF is the one
people keep. Nothing to revert - f0dfa68 already stands. Routed to Character
Generators 2026-09-11.

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
