# Decisions - TheTable

Durable calls that shape how this project is built or run. Newest first.
Check here (and todo.md) before asking Xero anything - if it is answered here,
it is decided.

## 2026-09-11 - Table | Character Generators gets its own worktree

**What:** Created worktree ../TheTable-chargen on branch
lane/character-generators. Xero approved.

**Why:** It was the third session on the shared main checkout (with Puffer Fish
and HP). Same collision reason as HP.

**Still to do (Xero):** re-home the running Table | Character Generators session
into D:\Coding\VTTs\TheTable-chargen at its next natural break - NOT mid-T2K,
since re-homing starts a fresh session and loses in-progress context. Until then
it still edits the main checkout; it commits TheTable edits promptly and
coordinates via Comms.

## 2026-09-11 - Table | HP gets its own worktree

**What:** Created worktree ../TheTable-hp on branch lane/hunt-peck. Xero
approved (via Comms), mirroring MeSuite.

**Why:** Puffer Fish, HP, and Character Generators were all running out of the
one main checkout (D:\Coding\VTTs\TheTable). Two-plus sessions editing one
working tree means the last save silently wins - this has cost rework on Tapestry.

**Still to do (Xero):** the running Table | HP session is still homed in the main
checkout; a session's cwd is fixed at launch, so HP must be re-opened as a new
session in D:\Coding\VTTs\TheTable-hp to actually use the worktree. Until then the
worktree exists but HP is still on main. (Table | Character Generators now has
its own worktree too - see the entry above.)

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
