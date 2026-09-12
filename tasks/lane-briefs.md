# Lane briefs - standing lines for TheTable sessions

Paste-ready text Xero adds to each lane's brief when starting or re-homing a
session. Comms drafts these; Xero owns whether they go in. Newest first.

## The COMMS line (2026-09-11)

Every lane gets this. It exists because on 2026-09-11 four cross-session
messages in a row came back "undelivered" - a message only lands if the target
session is actually running, and all three lanes were idle. Nothing was lost
only because every answer was committed to the repo first. This line makes the
repo the transport and the nudge a courtesy.

```
Read tasks/COMMS.md at session start, before anything else, and again before
you ask Xero anything. It is the OPEN / ANSWERED log and it is the transport -
cross-session messages fail silently when a session is idle, so the file is the
only copy you can rely on. Route every question for Xero and every testing ask
to Table | Comms rather than to Xero; check tasks/decisions.md and tasks/todo.md
first, and reproduce a defect live before filing it.
```

## The worktree line (2026-09-11)

For a lane that has its own worktree. Substitute the path and branch.

```
Your worktree is <PATH> on branch <BRANCH>. Work only there. If your working
directory is the shared main checkout (D:\Coding\VTTs\TheTable), move yourself
with mcp__ccd_directory__change_directory before you edit anything - two
sessions in one working tree means the last save silently wins.
```

Current assignments:

| Lane | Worktree | Branch |
| --- | --- | --- |
| Table | Puffer Fish | D:\Coding\VTTs\TheTable | main |
| Table | HP | D:\Coding\VTTs\TheTable-hp | lane/hunt-peck |
| Table | Character Generators | D:\Coding\VTTs\TheTable-chargen | lane/character-generators |
| Table | Comms | D:\Coding\VTTs\TheTable-comms | lane/comms |
