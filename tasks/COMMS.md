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

## ANSWERED

*(dated log, newest first)*

### 2026-09-11 - Give Table | HP its own worktree? -> YES (a)

Asked by Puffer Fish. Verified by Comms first: `git worktree list` showed only
TheTable (main) and TheTable-comms (lane/comms), so HP and Puffer Fish really
were sharing one working tree on main.

**Xero: (a) yes.** Add worktree ../TheTable-hp on branch lane/hunt-peck,
mirroring MeSuite. Routed to Puffer Fish (owning lane) 2026-09-11. See
decisions.md for the worktree creation + re-home status.
