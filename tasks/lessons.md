# Lessons - TheTable

Hard-won gotchas so the next lane does not relearn them. Newest first.

## A "delivered" message can be delivered to the wrong session (2026-09-13, Puffer Fish)

The hub sent five test asks to Comms with `SendMessage` to a peer named
`thetable-comms-60`. Every send came back "success". None reached the Comms
lane: the real Comms session is titled "Table | Comms", and the name-based
roster listed no row with that title. `thetable-comms-60` was a different
session whose working folder happened to be named after the Comms worktree.
Comms only learned of two of the asks because Xero relayed them. The other
three, and a renumbering note, went nowhere.

Two rules were broken at once:
- **The file is the transport.** This file already says it ("cross-session
  messages fail silently"). "Success" from a send means a session received it,
  not the right session.
- **Numbering ahead of the owner.** The hub numbered Q13-Q15 without reading
  COMMS.md first, while Comms had already used Q13. Read the counter in
  COMMS.md at the moment of numbering, never from memory.

**How to apply:**
- File every ask into COMMS.md OPEN first, commit and push it, and only then
  nudge.
- To nudge, find the lane by its TITLE with `list_sessions` (`sessionId` plus
  title, e.g. "Table | Comms") and use `send_message`. Never guess from a folder
  name in `ListAgents`.
- Treat a missing reply or a missing COMMS entry as not received.

## A missing anchor makes an edit silently do nothing (2026-09-13, Comms)

Comms edits COMMS.md with small scripts that insert text before a heading. One edit
replaced a section by slicing up to the next heading and took the ANSWERED header
with it. Every later insert anchored on that header then matched nothing, so Xero's
Q9/Q10 answer was never written - while the same commit removed the questions from
OPEN. The only record left was a commit message. Puffer Fish caught it from the
diff: 56 lines out, 0 in.

- **Assert the anchor exists before replacing.** `str.replace` on a missing string
  returns the input unchanged and raises nothing.
- **Assert the result, not just the attempt** - check the new entry is in the file
  before committing. And make the assertion precise: a check that counts a heading
  will also count that heading quoted inside the text you just wrote.
- **Read the diff stat of your own commit.** A commit that should add an answer and
  shows only deletions is wrong on its face.

## Instrumentation that looks like it works (2026-09-12, Puffer Fish)

From porting the session recorder into the hub and the Mothership VTT. Both
bugs below were invisible from the UI and obvious the moment something other
than the UI was asserted on.

- **An "init once" ref guard plus a cleanup that unsubscribes equals nothing
  installed.** React strict mode runs the mount effect, runs the cleanup, then
  runs the effect again - and the guard turns that third step into a no-op, so
  the listeners the cleanup just removed are never restored. The Record button
  still lit up and the event counter still ticked, because those are React
  state; capture was dead.
  **The guard is not the villain, and deleting one without understanding it is
  how this gets reintroduced.** With no cleanup, a double-invoke really does
  double-install: each run builds fresh closures, so two runs leave two click
  listeners, and worse, a `console.error` patch NESTS - run 2 saves run 1's
  patch as its "original", so every error records twice and the real
  `console.error` is buried permanently. There are exactly two valid shapes:
  **guard + no cleanup** (install once, never tear down - TheTapestry, works)
  or **cleanup + no guard** (install A, remove A, install B, ending at one set
  of listeners and one layer of patches, because the cleanup restores the true
  original before the next run saves it - the hub and the VTT, works). Having
  NEITHER double-records. Having BOTH records nothing. The failure here was a
  cleanup added later, correctly by React's contract, on top of a guard that
  had become redundant the moment it landed. **TheTableau carried this too and
  is now FIXED** at its `610a50ec` on `phase-b-deck-combat`, on Xero's say-so
  2026-09-12 - committed there but deliberately NOT pushed, since that branch
  is 44 commits ahead of upstream with other sessions' work. Dev-only there as
  well, since production never double-invokes, and not verified by running that
  app: its tree held another session's uncommitted changes and its own atlas
  notes record test runs damaging Xero's live save, which is not a risk worth
  taking for a two-line deletion already proven behaviourally here.
  **Correction, 2026-09-12: I first wrote that TheTapestry carried it as well,
  and it does not.** It has the same `initRef` guard but ZERO
  `removeEventListener` calls - no cleanup function at all - so its listeners
  install once and stay installed. It is the combination that breaks, not the
  guard: guard plus cleanup goes inert, guard alone merely leaks on unmount
  (harmless for a component mounted at the root that never unmounts). I
  asserted this from a filename and a line count without opening the file, and
  it went into decisions.md and lessons.md before being checked - the exact
  failure this project keeps catching. Open the file.
- **Assert on the mechanism, not the indicator.** The way this was caught was
  checking whether `console.error` had actually been replaced, not whether the
  button looked active. Same family as the cached-DOM-node and
  fixed-width-mockup entries elsewhere in this file: the measurement was the
  thing that was broken.
- **...but do not assert on a SYMBOL NAME, which minifies.** The check used for
  the above was `String(console.error).includes('patchedErr')`. That works in
  dev and reports a false NEGATIVE against a production build, where the
  function name is mangled - it said capture was dead on the live hub when
  capture was fine. Assert on BEHAVIOUR instead: start recording, fire a
  `console.error`, confirm an event landed in the buffer. That works in both
  builds. Two brittle measurements in one afternoon, in opposite directions.
- **Dice inside a `setC` updater get rolled twice.** React double-invokes state
  updaters in dev to check purity. `takeDamage` and `doPanic` in the VTT
  resolved `applyDamage` / `rollPanic` inside one, so every Wound d10 and every
  Panic d20 was rolled twice, the second set won, and the log printed both.
  This was pre-existing and only surfaced because a trace call placed beside it
  fired twice per click. If a function needs fresh state, mirror it in a ref -
  do not use an updater as a state reader.
- **A recorder must not record what the rules conceal.** The Mothership Death
  Save is rolled in secret (PSG p29.2) and the code hides it deliberately. A
  dump carrying the hidden value would undo that rule for anyone who opened the
  file, so the snapshot records only that a save is pending, and the roll only
  once revealed. Worth asking of any new event: does this leak something the
  game is deliberately withholding?

## A generator tool must match the file's own conventions (2026-09-11, Character Generators)

From building the name-pool sync script. The pool sync itself was trivial; all
the work was stopping the tool reformatting what it touched.

- **A sync tool whose diffs nobody reads is not a sync tool.** Three separate
  reformatting faults, each of which would have made a real change unreviewable:
  a 2-space JSON indent where both consumer files use one, so a one-name edit
  came out as 1005 changed lines; a trailing newline one file did not have; and
  rewriting a compact array with spaces after the commas. Match the file's own
  conventions, and hold the end state that syncing an already-correct file is
  BYTE-IDENTICAL to HEAD.
- **Replace a marked block, never regex over live code.** The consumer array is
  fenced with `name-pool:start` / `name-pool:end`, so a sync replaces an exact
  span instead of pattern-matching against working JavaScript.
- **Verify a checker by BREAKING it, not by a clean first run.** Inject drift,
  confirm `--check` catches it and exits non-zero, run the write, confirm the
  file comes back byte-identical and the check goes green. A tool that has only
  ever seen correct input has not been tested.
- **Re-query a DOM element every iteration.** A probe cached an input element and
  read one distinct name from 40 clicks, which looked exactly like a broken
  pool. The app re-renders on each suggest, so the cached node was detached and
  frozen at its first value. Re-querying gave 29 distinct names from 30 clicks.
  Same family as the other false results in this file: the measurement was
  broken, not the code.

## Fixing a print sheet against real artwork (2026-09-11, Character Generators)

From the Planet of the Apes sheet, the last of the note #121 fixes. Three of the
five faults were not what the note said they were.

- **Sample the artwork, do not inherit a colour from a note.** The note gave the
  sheet's ink as roughly `#8b4a32`. Sampled, its printed labels run `#5a3925` to
  `#5f3428`, so the fill used is `#6b3a24`.
- **Print a calibration grid in the artefact's own coordinate space before
  moving anything.** Two of the five "position" faults were not position faults:
  the psi ovals were correctly placed all along, and the handwriting face that
  replaced Courier is simply wider, so values overhung their labels. The fix was
  a smaller size, not a new position. The same grid showed the SRP ovals
  ALTERNATE - S and P left of their letter, R right of it - so the three never
  shared an x, although the field table gave all three 18.5.
- **Raising text breaks any box sized to the old text.** Third instance of the
  same family in one day: space1999's stat grid, walkingdead's key row, and here
  a tracked label needing 93px inside a 90px min-width box, clipping 12px on a
  phone. A per-container `scrollWidth > clientWidth` check at 390px belongs in
  every floor pass, not just a viewport-level sweep.
- **Never use backslash escapes in code emitted from another language.** A
  `
` written inside a Python string that emits JavaScript became a real
  newline inside a JS string literal - a syntax error that killed the whole
  block and printed an entirely empty sheet. `String.fromCharCode(10)` instead.

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

## A modified workbook is not a new test run (2026-09-13, Comms)

Comms found the smoke workbook modified at session start, read fresh-looking notes
in it, and routed them as a rerun - concluding that three controls were
undiscoverable. Puffer Fish caught it: the notes were a day old (typos and all) and
predated the very controls they complained about. The file's timestamp was Comms'
own later edit.

- **Date a result before interpreting it.** A file's mtime or an uncommitted diff
  tells you when it was SAVED, not when he TESTED. Ask, or find the notes in an
  earlier commit.
- **Line results up against what shipped.** Check the feature's commit time before
  reading "X is missing" as a finding. A note that predates the feature is not
  evidence about the feature.
- **Commit his workbook the moment it lands.** Uncommitted results lose their date.
  Had the 09-12 notes been committed on 09-12, the timing would have been obvious.

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
