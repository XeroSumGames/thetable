# Decisions - TheTable

Durable calls that shape how this project is built or run. Newest first.
Check here (and todo.md) before asking Xero anything - if it is answered here,
it is decided.

## 2026-09-11 - Table | HP gets its own worktree

**What:** Created worktree ../TheTable-hp on branch lane/hunt-peck. Xero
approved (via Comms), mirroring MeSuite.

**Why:** Puffer Fish, HP, and Character Generators were all running out of the
one main checkout (D:\Coding\VTTs\TheTable). Two-plus sessions editing one
working tree means the last save silently wins - this has cost rework on Tapestry.

**Still to do (Xero):** the running Table | HP session is still homed in the main
checkout; a session's cwd is fixed at launch, so HP must be re-opened as a new
session in D:\Coding\VTTs\TheTable-hp to actually use the worktree. Until then the
worktree exists but HP is still on main. Table | Character Generators is also
still on the shared main checkout - its own worktree is an open question (see
COMMS if it gets filed).

## 2026-09-11 - Stood up a Comms channel (4th session)

**What:** Added a Comms lane for TheTable, matching Tapestry and TheTableau.
Created worktree ../TheTable-comms (branch lane/comms), tasks/COMMS.md
(OPEN / ANSWERED log) and tasks/The Table Smoke Testing.xlsx (one living test
workbook, one worksheet per test ask). New session: Table | Comms.

**Why:** Xero runs several parallel sessions and answers questions in one place
only. "if you have questions (ever, on anything) they should be routed to the
comms channel. i go there ONLY to answer questions which get lost in your stream
of consciousness." Comms owns every question for Xero and the single test
workbook, so the other lanes stop interrupting him separately. Two rules make it
worth the overhead: verify a thing is reachable before asking him to test it,
and check the repo (decisions.md / todo.md) before re-asking.

**What would make us drop it:** If TheTable stays quiet enough that Comms sits
idle for weeks, the project does not need a fourth session yet - retire Comms
and fold its two files back to whoever is active.

**Reference:** tasks/lane-protocol.md in the Tapestry repo, "Comms channel"
section, is the authoritative pattern.
