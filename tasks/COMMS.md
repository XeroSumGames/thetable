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

### 1. Give Table | HP its own worktree? (added 2026-09-11 by Puffer Fish)

*Verified 2026-09-11 by Comms: `git worktree list` shows only TheTable (main)
and TheTable-comms (lane/comms). No HP worktree. Claim confirmed.
Put to Xero 2026-09-11.*

TheTable runs Puffer Fish and Hunt & Peck out of the SAME single checkout
(D:\Coding\VTTs\TheTable, branch main). Two sessions editing one working tree
means the last save silently wins. This has already cost rework on Tapestry
(an editor save overwrote the same change three times in one session).

Adding the Comms worktree (done today) is a natural moment to give HP its own.

- (a) Yes - add worktree ../TheTable-hp on branch lane/hunt-peck now, mirroring
  MeSuite (lane/hunt-peck) and the other properties. RECOMMENDED - removes the
  collision risk before it bites.
- (b) Not yet - accept the risk while the project is quiet, revisit if HP and
  Puffer Fish start editing at the same time.

Owning lane: Puffer Fish (would create it). Comms: put this to Xero.

## ANSWERED

*(dated log, newest first)*
