# Lessons - TheTable

Hard-won gotchas so the next lane does not relearn them. Newest first.

## Measure the ceiling, do not wait to roll it (2026-09-11, Character Generators)

From fixing Twilight 2000's two-page print spill.

- **Chrome CDP's `Emulation.setEmulatedMedia({media:'print'})` applies the print
  stylesheet to the live DOM**, so the sheet and every block inside it can be
  measured against the page height directly. No need to roll characters until an
  unlucky one reproduces the overflow.
- **A hairline fit is not a fit.** The sheet had been tightened once before and
  the tallest of 240 random characters came to 1053px against a 1056px page.
  Three pixels of clearance is a coincidence waiting to be spent.
- **Enumerate EVERY dimension that grows the artefact and max them together.**
  The ceiling was found in three passes, each revealing a dimension not yet
  maxed: terms alone looked fine at 1025px; adding specialties took it to 1093;
  adding every skill kept it over even after the first fix, because the skills
  box grows 48px to 84px between a light and a full character. Do not stop at
  the first ceiling you construct.

## Print regressions hide behind unpinned comparisons (2026-09-11, Character Generators)

From the Dredd redesign. Both of these produce a confident wrong answer.

- **A new wrapper element needs a PRINT RESET, not just `no-print` on its
  children.** The summary layout is a CSS grid and the print block only reset
  `.main`, so the official sheet kept a 300px sidebar COLUMN plus padding on
  paper and spilled onto a third page. Hiding the sidebar was not enough - the
  grid column survived. Reset the wrapper, not only its contents.
- **Never compare page counts across builds without pinning the content.** A
  first A/B read HEAD at 2 pages against NEW at 3 and proved nothing: the two
  runs rolled different characters, 2862 characters of sheet against 2246. The
  fix is a capture/inject probe that lifts the printsheet HTML out of one build
  and injects it into the other, so the content is identical and the page counts
  are genuinely comparable. Held constant, both builds produced two pages at
  2161 characters. This is the same trap as comparing any two measurements taken
  on different data - see the name-pool and font-size counts elsewhere in this
  file.

## Two entry paths means two verifications (2026-09-11, Character Generators)

Building the 2300AD redesign exposed a defect that had been LIVE in Traveller
since its own redesign shipped, and the reason it survived verification is the
lesson.

- **The free-navigation gate photographed a section only inside `A.go()`.** The
  Randomise button never calls `A.go` - it builds the whole character and jumps
  to the dossier - so a randomised character held NO snapshots. "Amend this
  part" restored nothing, the unlock returned early, and the warning told the
  player it would discard nothing while the button silently did nothing. A
  hand-filled application was unaffected, which is exactly why the original
  verification passed. Fixed by moving the photograph into `snapGate()`, called
  from both paths.
- **So: when a feature has a hand-driven path and a randomiser path, verify
  BOTH.** The randomiser is the one users actually press, and it was the
  unverified one.
- **A red fuzz result is a hypothesis, not a verdict.** A new invariant failed
  226 times on first run and every failure was the test's fault: it asserted
  that a skill granted after a snapshot vanished on restore, using "Steward",
  but many characters already have Steward so restore correctly returned the
  original value. A sentinel key that cannot collide with real data fixed it.
  Confirm what a failure means before reporting it as a defect.

## Flooring a hand-built generator: where sizes hide (2026-09-11, Character Generators + Comms)

From the space1999generator pass, the first of the four hand-built four. All of
these would have produced a false "clean" result.

- **Sizes live in THREE places, not one:** CSS rules, inline `style=` inside JS
  string literals, and print-sheet rules. On Space 1999 an inline size sat on a
  span that also had a `.ph-note` rule, so the inline overrode the raised rule
  straight back to 12px. A stylesheet scan would have called the file clean
  while it still rendered small.
- **Do not exclude the print sheet by unit.** 2300AD's printed dossier is sized
  in pt, so a px-only raise skipped it for free. Space 1999's is sized in PX, so
  the same approach would have quietly rewritten the printed dossier. Exclude by
  selector (`.ps*`), and check which unit the generator actually uses first.
- **Cache-bust after editing on a reused port.** A server reusing an earlier
  port served a cached index.html; the sweep reported every old size and looked
  like the edit had not applied, while disk and curl showed the new one. The
  same trap can sign off a change that never applied.
- **Raising a size can break layout, so re-measure the phone viewport.** At 14px
  Space 1999's stat labels no longer fit three to a row and `.stat-grid` spilled
  38px past a 390px viewport - a 1fr column cannot shrink below its content and
  single uppercase words cannot wrap. Fixed with a two-column breakpoint below
  440px, and proved to be a new regression by serving the pre-change build and
  measuring the same screen.
- **"Zero sub-14px" claims keep needing a second pass.** Three times in one day
  a sweep was reported clean and was not: the T2K footer, the `.seo-intro`
  inheritance, and Space 1999's `.sel-badge` and `.pk-box`. None were sloppy work
  - each time the residue was a different KIND of thing than the sweep was
  looking for. Have someone else measure before saying zero.

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
- **Comms quoted a set-membership figure from the head of a list.** Routing the
  callsign ruling, Comms said two name pools shared three entries, having read
  the first few entries of one list rather than intersecting the sets. The real
  overlap was six. It reached Xero and shaped a ruling before Character
  Generators caught it. Intersect the sets; never eyeball a count.
- **Confident totals are the recurring failure, on both sides.** Three times in
  one day a lane stated a number it had not re-derived at the moment of stating
  it, and once a summary contradicted its own detail in the same message ("all
  eight generators floored", above a remaining-work list naming apegenerator as
  outstanding). Comms made the same class of error with a set-membership count.
  Re-derive a total before you state it, and read a summary against the detail
  beneath it.
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
