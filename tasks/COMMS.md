# COMMS - questions for Xero on TheTable

Comms owns this file. Lanes add to OPEN; Comms puts the question to Xero,
records his answer in ANSWERED with a date, and routes the outcome to the
owning lane.

Do NOT ask Xero anything already answered in decisions.md or todo.md.
Verify a thing is actually reachable before asking him to test it.

Sessions: Table | Puffer Fish (hub), Table | HP (features),
Table | Character Generators, Table | Comms (this lane).
Route with mcp__ccd_session_mgmt__send_message; Xero does not relay.

## OPEN

*(nothing open)*

## ANSWERED

*(dated log, newest first)*

### 2026-09-11 - Give Table | HP its own worktree? -> YES (a)

Asked by Puffer Fish. Verified by Comms first: `git worktree list` showed only
TheTable (main) and TheTable-comms (lane/comms), so HP and Puffer Fish really
were sharing one working tree on main.

**Xero: (a) yes.** Add worktree ../TheTable-hp on branch lane/hunt-peck now,
mirroring MeSuite. Routed to Puffer Fish (owning lane) 2026-09-11.
