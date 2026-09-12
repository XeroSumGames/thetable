# TheTable - standing instructions for every lane

TheTable is the always-free third property: a thin generator-proxy hub today, an
SRD-Distemper VTT later. Several Claude sessions ("lanes") work it in parallel.
These rules apply to all of them.

## Read COMMS first

Read `tasks/COMMS.md` at session start, before anything else, and again before
you ask Xero anything. It is the OPEN / ANSWERED log and it is the transport -
cross-session messages fail silently when a session is idle, so the file is the
only copy you can rely on. On 2026-09-11 four messages in a row came back
undelivered and nothing was lost only because every answer was committed there
first.

Route every question for Xero and every testing ask to **Table | Comms** rather
than to Xero directly. Check `tasks/decisions.md` and `tasks/todo.md` first - if
they answer it, it is decided. Reproduce a defect live before filing it.

Comms owns `tasks/COMMS.md` and `tasks/The Table Smoke Testing.xlsx` (one living
workbook, one worksheet per test ask - never a new file, never a markdown test
plan). Other lanes file into COMMS.md OPEN; Comms records ANSWERED.

## Work in your own worktree

Your worktree is listed below. Work only there. If your working directory is the
shared main checkout (`D:\Coding\VTTs\TheTable`) and your lane has its own
worktree, move yourself with `mcp__ccd_directory__change_directory` before you
edit anything - two sessions in one working tree means the last save silently
wins, which has already cost rework on Tapestry.

| Lane | Worktree | Branch | Model |
| --- | --- | --- | --- |
| Table \| Puffer Fish (hub) | D:\Coding\VTTs\TheTable | main | Opus 5 |
| Table \| HP (features) | D:\Coding\VTTs\TheTable-hp | lane/hunt-peck | Sonnet 5 |
| Table \| Character Generators | D:\Coding\VTTs\TheTable-chargen | lane/character-generators | Opus 5 |
| Table \| Comms | D:\Coding\VTTs\TheTable-comms | lane/comms | Opus 5 |

## Check your own model at session start

Compare your model against the table above (`get_session` with `"self"`). A new
or restarted session inherits the app default, NOT its lane's assignment, so
drift is the normal case and not the exception - it has already happened three
times (2026-09-11, and two lanes at once on 2026-09-12). Every time it was
caught by another lane running `get_session`, never by the drifted session
noticing. Do not assume someone else is watching: check yourself.

**A session cannot change its own model.** If yours is wrong, say so in your
first reply and ask Xero to set it in the model menu; do not quietly carry on.
You CAN fix another session with `mcp__ccd_session_mgmt__set_session_model`, so
the hub should correct any lane it finds adrift. Rationale for who gets what is
in `tasks/decisions.md` under "Model assignment per lane".

## Other standing files

- `tasks/decisions.md` - durable calls. Check before asking.
- `tasks/todo.md` - tracked work not yet ready for Xero. Items marked
  "needs repro" must be reproduced live before they become an ask.
- `tasks/lessons.md` - gotchas, so the next lane does not relearn them.
- `tasks/deploy-runbook.md` - the deploy phases.
- `tasks/lane-briefs.md` - the paste-ready lines these rules came from.

## Machine notes

Windows, PowerShell. Use `py`, not `python`. The Bash tool is Git Bash - use
forward slashes. Never round-trip a text file through
`Get-Content | Set-Content` (it double-encodes non-ASCII). No em-dashes in
anything Xero will read. Never `git add .`.
