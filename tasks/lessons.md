# Lessons - TheTable

Hard-won gotchas so the next lane does not relearn them. Newest first.

## Running four parallel lanes: what actually broke (2026-09-11, Comms)

A full day of four-session work on TheTable. None of these cost anything in the
end, but every one of them nearly did.

- **A session's cwd is NOT fixed at launch.** Two lanes were told to re-open as
  new sessions to use their worktrees; that advice was wrong and would have
  thrown away their history. `mcp__ccd_directory__change_directory` moves a
  running session, taking effect when its turn ends. Creating a worktree does
  not move anybody - three worktrees existed for hours while all three lanes
  still edited the shared main checkout.
- **Cross-session messages fail silently when the target is idle.** Seven of
  them came back "undelivered" over the day, including an unpause instruction
  from Xero. `isRunning: false` is the tell. The messages are a courtesy; the
  repo is the transport. Write the answer to a file and commit it BEFORE you
  send the nudge - that is the only reason nothing was lost.
- **A lane can die and come back with a new session id.** Character Generators
  restarted mid-day; the question it had filed was one step from being lost with
  it, and the new session was working a different queue than the one in
  COMMS.md. Keep the roster in COMMS.md current, and never leave an answer only
  in a session's context.
- **A restarted lane can come back on a different model.** That lane resumed on
  Sonnet after running on Opus, silently. Check `get_session` after any restart.
- **Two lanes filed questions with citations that did not hold.** One cited a
  "standing decision in decisions.md" that was actually a narrower README line;
  one described which sheet box a graphic covered without having measured it.
  Both were caught by checking at source before relaying. Neither lane was being
  careless - a plausible-sounding citation is just very easy to pass along.
- **Xero answered the same question in two places** - once through Comms, once
  directly to a lane. The answers happened to match. Route through Comms so they
  cannot diverge.

## Testing the character generators headlessly (2026-09-11, Character Generators)

- Print layout IS headless-verifiable. print-to-PDF renders exactly what the
  print path produces - rasterise the PDF and read it. Only the browser's
  interactive print-preview dialog and a real printer driver are out of reach,
  so a paper check is nice-to-have, not a blocker before an item can close.
- Anything a probe injects into the DOM must carry class="no-print". The
  generators' print CSS does not hide unknown nodes, so an injected results div
  prints as extra pages - this nearly produced a false "prints 2 pages" bug.
  Mark injected nodes no-print (or remove them) before counting pages.
- Generator state is closure-scoped. Judge behaviour by the DOM, not by reading
  the internal state object (e.g. `S`) - a probe that read state directly failed
  on its own terms, not the code's. To exercise an upload, attach a real File via
  DataTransfer and dispatch a genuine change event, then read the resulting DOM.
