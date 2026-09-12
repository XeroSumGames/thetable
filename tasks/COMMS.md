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
