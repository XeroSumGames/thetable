# COMMS - questions for Xero on TheTable

Comms owns this file. Lanes add to OPEN; Comms puts the question to Xero,
records his answer in ANSWERED with a date, and routes the outcome to the
owning lane.

Do NOT ask Xero anything already answered in decisions.md or todo.md.
Verify a thing is actually reachable before asking him to test it.

Sessions (route with mcp__ccd_session_mgmt__send_message; Xero does not relay):
- Table | Puffer Fish (hub)        local_373a5c5c-ee39-47ef-92a9-0bf3ef94544d
- Table | HP (features)            local_4aca6765-6aab-4c0e-961d-be4b5c01da3c
- Table | Character Generators     local_eb161fa5-d93d-4048-aa94-6a27856de9d2
  (restarted 2026-09-11; the old session local_1fa2c241-d7af-4e86-86dd-319b6f2df3bd
  is stopped - do not route to it)
- Table | Comms (this lane)        local_894fe581-b1be-4366-ae60-d38ce452c53c

## OPEN

*(nothing open)*

## ANSWERED

*(dated log, newest first)*

### 2026-09-11 - Does the 14px floor apply to the four hand-built generators? -> YES (a)

Filed by Character Generators after it found that the floor had only ever
reached the four src/-based generators, because it rode along on the Traveller
and T2K redesigns. So "no known 14px violation anywhere" was not true when Comms
reported it.

**Xero: (a) yes, apply the floor to all four** - apegenerator, space1999generator,
dredd-generator, walkingdead-rpg. As separate passes, one generator at a time,
each with its own print and probe verification. These are hand-built single
index.html files with rules, state and DOM interleaved and no src/, so this is a
genuinely different job from the three-repo pass that preceded it.

**Scope, and why the headline number overstates it.** *Verified at source by
Comms 2026-09-11:* `.tt-btn`, `.hdr-sub` and `.hdr-rand` are 12px in all four;
`.step-item` and `.step-num` are 12px in three and absent from walkingdead-rpg,
which uses different stepper markup for the same thing. A large share of the job
is therefore one small set of shared classes repeated across four files, with a
per-generator tail of content rules. `.seo-intro` is NOT one of them - it has no
font-size declaration in any of the four, appearing once per file as a class on
a <p> with no CSS rule, so its size is inherited rather than declared.

**Three measurements, all different, all recorded, because they answer different
questions** - the static count is how many declarations you would EDIT, the
rendered count is how much a user SEES, and neither converts into the other:

| generator | static (Comms) | static (lane) | rendered combos / elements (lane) |
| --- | --- | --- | --- |
| apegenerator | 43 | 40 | 15 / 164 |
| space1999generator | 52 | 52 | 16 / 68 |
| dredd-generator | 53 | 35 | 9 / 20 |
| walkingdead-rpg | 16 | 16 | 11 / 63 |

Rendered figures are start-screen only at 1280x900 - a floor, not a total.

*Comms error corrected in the same breath, for the record: Comms told Xero the
lane's static numbers were computed-style measurements and therefore
authoritative. They were not; the lane said so itself. Ordering note: this lands
behind the life-path redesign and the T2K print spill only if Xero says so - he
has not sequenced it against those.* Routed to Character Generators 2026-09-11.

### 2026-09-11 - Twilight 2000's printed sheet spills to two pages -> QUEUE IT (b)

Filed by Character Generators. Pre-existing defect, not introduced by any of the
day's work: heavy characters tip the printed sheet onto page 2, reproduced at a
sheet weight around 1400 characters (a 9-term character with a full specialty
list). The lane proved it was not its own change by printing identical captured
sheet HTML through both the old and the new build and getting 2 pages from each.
Comms did NOT independently reproduce this - printing is the one thing Comms
cannot measure from served bytes.

**Xero: (b) queue it behind the life-path redesign already in flight.** Not
dropped and not next; it waits its turn. Routed to Character Generators
2026-09-11.

### 2026-09-11 - Does the 2300AD floor pass also clear the 12px footers? -> YES (a)

Raised by Comms after measuring the LIVE bytes post-push. The 14px floor pass
worked - live twilight2000's 8-at-12px and 4-at-13px are gone - but a page
footer at 12px remains: twilight2000 1, traveller 1, 2300ad 9. All are
`class="footer no-print"`, so it is on-screen prose, not print styling.

**Xero: (a) yes.** Fold the footers into the 2300AD standalone floor pass and do
the same edit on traveller and twilight2000 while it is open.

**SHIPPED AND VERIFIED LIVE by Comms 2026-09-11:** 2300ad 76e0dad, traveller
bdca34d, twilight2000 bfb8b69. All three live footers now read
`font-size:14px`; zero occurrences of `font-size:12px` remain in any of them.
Measured outside print blocks, the four src/-based generators now carry only the
`.opt-box` 11px rule (2300ad 1, twilight2000 1, traveller 0, mothership 0).

*Blob hashes at this state, re-verified 2026-09-11 across all eight endpoints
(four Vercel aliases, four proxy routes), every one matching its repo's
HEAD:index.html:* mothership b782ef07 (unchanged by the floor pass - its footer
was already 14px), 2300ad f159f6be, traveller 0bd993e9, twilight2000 34d00158.
The earlier record's e6d54cc2 / 0592420c / eb991d57 were the first-push state and
are superseded.

*Correction to the scope Comms published, and to the lane's correction of it.*
Comms wrote "2300ad 9 footer rules". Wrong label - only one of them was the
footer. Character Generators then explained the 9 as rendered elements
inheriting a single declaration; that is also wrong, and re-checked at source
(`git show ad640ff:index.html`) the pre-fix file contains NINE distinct
`font-size:12px` declarations: `.hdr-sub`, a button style twice, `.ch-dm`,
`.opt-d`, `.term-age`, `.hist-r`, `.note`, and the one inline footer. So: one
footer declaration per repo, as the lane says, but eight further unrelated 12px
declarations in 2300AD that its own floor pass also raised. The fix covered all
of them either way and nothing was missed. Neither account of the number was
right, which is the point worth keeping: a static scan mislabels what it counts,
and a rendered scan cannot see how many declarations produced the result.

**"No known 14px violation anywhere" was NOT achieved by this - see OPEN.**

Explicitly still allowed to stay: the `.opt-box` 11px rule. It sizes a tick
glyph inside a 16x16 checkbox, not prose, and it predates the floor pass in
Xero's own commit. Character Generators was right to leave it; it is not part of
this job.

Scope, measured by Comms on the live bytes so the lane does not rediscover it:
2300ad 9 footer rules plus its 16 other sub-14px rules, traveller 1, twilight2000
1. Routed to Character Generators 2026-09-11.

### 2026-09-11 - 2300AD is under the 14px floor: fix when? -> NOW, STANDALONE (b)

Asked by Character Generators, which recommended folding it into 2300AD's
queued Life Foundation lifepath redesign. Comms verified the defect: 2300AD
carries 16 sub-14px rules (7 at 11px, 9 at 12px) against Traveller's and
Twilight 2000's 2 each, and those two are a small centred element and the page
footer. Pre-existing, not introduced by the export work.

**Xero: (b) fix it now, as its own pass.** Do not wait for the lifepath
redesign - the live site should stop breaking the 14px rule sooner rather than
being bundled into a larger job.

Ordering that follows from the push ruling the same day: all four repos are
being pushed, so 2300AD ships its VTT export first and this floor pass is a
follow-up commit and push, not part of it. Routed to Character Generators
2026-09-11.

### 2026-09-11 - What ships now, across four repos? -> PUSH ALL FOUR (a)

Asked by Character Generators. Comms verified every SHA and count at source:
mothership-generator 6f1a9ba (1 unpushed, callsigns), 2300ad-generator ad640ff
(1, VTT export), twilight2000-generator d1f2043 (5 - export plus 4 parked, of
which two cancel out, so 2 substantive), traveller-generator e857f57 (4 - export
plus 3 parked).

**PUSHED AND INDEPENDENTLY VERIFIED by Comms 2026-09-11.** All four repos are
level with origin (mothership 6f1a9ba, 2300ad ad640ff, twilight2000 d1f2043,
traveller e857f57). All EIGHT endpoints - four Vercel aliases and four
thetable.xerosumgames.com proxy routes - return 200 and hash byte-identical to
each repo's HEAD:index.html blob (b782ef07, e6d54cc2, eb991d57, 0592420c).
Verified by hashing the served bytes with git hash-object, not by status code.
`exportCharacter` present in all four; `callsign` in Mothership only. The
slashed proxy form 308s to the unslashed canonical, as the lane reported.

**Xero: (a) push all four.** This explicitly takes his parked redesigns live -
the Travellers Aid Society redesign on Traveller and the NATO
intelligence-report redesign plus the 14px floor pass on Twilight 2000. They
were fully verified and green, just never asked for. No cherry-picking needed.

Comms finding that informed the call: the 14px issue had been filed as
2300AD-only, but live twilight2000 was measuring 8 rules at 12px, 4 at 13px and
1 at 11px - under Xero's own floor, with the fix (3a5bf5c) sitting in the parked
commits. Pushing clears that violation as a side effect. Routed to Character
Generators 2026-09-11.

### 2026-09-11 - Mothership/T2K name overlap is six, not three -> LEAVE IT (a)

**Comms' error, not a lane's.** When routing the callsign ruling, Comms told
Xero the two pools shared three entries after eyeballing the head of T2K's list
rather than intersecting the sets. Character Generators did the intersection:
the real overlap is six - Cinder, Doc, Mouse, Patch, Preacher, Sparks - across
T2K's 28 nicknames and Mothership's 50 callsigns. Re-verified by Comms.

**Xero: (a) leave it.** Six of 50 against 28 stays. No swap. The lane's 25 new
callsigns collide with nothing, so the pools are not converging, and it was
right to hold at the ruling rather than act on the corrected number itself.
Routed to Character Generators 2026-09-11.

*Lesson for Comms, also in tasks/lessons.md: never quote a set-membership figure
from reading the start of a list. Intersect the sets. This one reached Xero and
shaped a ruling before it was caught.*

### 2026-09-11 - Mothership callsigns: use or delete? -> USE THEM (a), AND EXPAND TO 50

Asked by Character Generators. Comms verified first: `callsign` appeared exactly
once in the whole generator - the data definition itself - and zero times in
src/app.js and src/engine.js. app.js:503 built the random name as
`pick(N.given) + ' ' + pick(N.family)`, so the 25 callsigns were genuinely dead
data.

**Xero: (a) use them, and expand the pool from 25 to 50.**

Implementation for Character Generators (their files, their curation):

- Wire the callsigns into the random-name button and render them the way
  twilight2000-generator already does - it has a `nicknames` pool, picks from
  it, exposes an editable Nickname field and prints `Name "Nickname"` on the
  sheet. Copy that working pattern rather than inventing one.
- Grow the pool to 50 entries. The 25 new ones are the lane's curation call, not
  Xero's and not Comms'. Hold the tone the file's own `_note` already sets:
  blue-collar, multinational, unglamorous, the sort of name a hauler crew hands
  out. Avoid colliding with Twilight 2000's list, which already contains Doc,
  Preacher and Sparks - the overlap is fine in isolation but three shared
  entries out of 25 would read as copy-paste if the pools grow toward each other.

**UNBLOCKED 2026-09-11:** Xero unpaused Character Generators the same day. The
lane may resume build work and pick this up. Routed 2026-09-11.

### 2026-09-11 - Fold Mothership/Space:1999 name pools into the shared pool? -> NO, KEEP BESPOKE (a)

Asked by Puffer Fish. Comms verified every claim at source first: Mothership's
src/data/names.json is given=40, family=30 (plus callsigns=25, pronouns=6 that
the question did not mention) and its `_note` really does state the curation
rationale; Space:1999 is NAMES_F=36, NAMES_L=28; Ape carries its own
APE_NAMES=30; Twilight 2000 and Dredd use neither the shared pool nor a matching
array.

**Xero: (a) keep them bespoke.** The curated lists stay as they are. Do not
widen either generator to draw from the shared 1000-name pool - the small lists
are deliberate genre-fit, and folding in generic names would dilute that on
every roll.

*Mechanical reason, filed by Character Generators AFTER Xero had already
answered and verified by Comms 2026-09-11 - it strengthens the same call rather
than changing it:* the shared pool is SINGLE GIVEN NAMES only (1000 entries, 0
containing a space). Traveller and 2300AD fake a surname by drawing from it
twice and joining; traveller-generator's own comment says so: "Two picks joined,
so the sheet gets a full name. The pool is single given names". Mothership's
pool is properly split into given+family, so switching it to the shared pool
would LOSE structure rather than gain names - a straight downgrade, not a
tradeoff. Not independently verified: the same reasoning for Space:1999's
given+surname split, though it has the same shape.

Separate and unaffected: the 3-way duplicate of the 1000-name pool is real and
exact - 2300ad-generator, traveller-generator and walkingdead-rpg each carry a
1000-entry pool, all three byte-identical (sha1 0198a83a7e4a), with no mechanism
keeping them in sync. That fix proceeds regardless and must not touch the
Mothership or Space:1999 lists. Routed to Character Generators (owns the files)
and Puffer Fish (raised it) 2026-09-11.

### 2026-09-11 - Mothership VTT topology and auth -> SUBDOMAIN + full accounts

Asked by Puffer Fish. Comms corrected two citations first: the "standing
decision to keep The Table standalone" is README.md:37-39, not decisions.md, and
it gates only the monorepo consolidation; the /a24 precedent is real but only
READS existing thriver accounts, it has never created player accounts in the
shared pool.

**Xero: own subdomain, and full email/password accounts.** He declined to pick
the topology cold and asked Comms to suggest a rule, with the constraint that
whatever is chosen becomes the CONSISTENT pattern for every future third-party
VTT. He agreed with the suggestion as given:

- **Generators keep the proxied subpath** on thetable.xerosumgames.com.
  Verified 2026-09-11: all eight generator repos are a single static index.html,
  no build step, no router - which is why a rewrite works for them.
- **Every third-party VTT gets `<game>.xerosumgames.com`** - own repo, own
  Vercel project, own Supabase project, linked from the hub. Mothership is
  therefore **mothership.xerosumgames.com**, NOT /mothershipVTT.
- **Players get full email/password accounts**, same as TheTable and Tapestry,
  on the VTT's OWN Supabase project - not the shared Tapestry pool.

Reasoning, for whoever revisits this: a Next.js VTT behind a path rewrite must
carry a `basePath` kept permanently in sync with the hub's rewrite table, a
coupling the static generators never pay. A subdomain removes it and isolates
auth storage per app, at the cost of one DNS record per VTT. The hub stays the
directory for full apps and the proxy only for static generators.

Puffer Fish (owning lane) to update tasks/mothership-vtt-architecture.md, which
currently assumes /mothershipVTT throughout, and to log the convention in
decisions.md - it is a durable call, not just an answer. Routed 2026-09-11.

### 2026-09-11 - Portrait also removed from the downloadable PDF? -> YES (a)

Raised by Character Generators as an extension of the (d) print ruling, rather
than absorbed silently. The portrait was drawn at 78%/82% in two places:
buildSheet() for the printed sheet and generatePDF() for the downloadable
fillable PDF. Comms verified the ship before recording: walkingdead-rpg f0dfa68
takes `ps-portrait` from 4 occurrences to 0, and the live page serves 200 with
none.

**Xero: (a) both.** The ruling covers any printed artifact; the PDF is the one
people keep. Nothing to revert - f0dfa68 already stands. Routed to Character
Generators 2026-09-11.

### 2026-09-11 - Give Table | Character Generators its own worktree? -> YES

Never formally filed - Puffer Fish flagged it as a question it was about to put
to Xero directly, Comms pulled it back into the channel, and Xero answered
before it was written up.

**Xero: yes.** Create the worktree. Mirrors the HP call earlier the same day and
the MeSuite pattern; Character Generators does edit this repo (it pushed e27b1d1
to tasks/) even though the generator source lives in
D:\Coding\RPG Character Generators\, so it is a real collision risk on the
shared main checkout.

Puffer Fish created it as ../TheTable-chargen on branch lane/character-generators
(commit 4ed0ff5), superseding the lane/chargen placeholder Comms had recorded.
Same caveat as HP: a session's cwd is fixed at launch, so the running
Table | Character Generators session must be re-opened in the new worktree to
actually use it. Routed to Puffer Fish (owning lane) 2026-09-11.

### 2026-09-11 - Portrait on the printed Walking Dead sheet? -> DROP IT (d)

Asked by Character Generators. Comms verified the code at walkingdead-rpg HEAD
a37e9d6 and then measured both candidate placements against the decoded sheet
art (SHEET_P1, index.html:2321): the current 78/82/18/14 clips the bottom GEAR
bonus row as well as covering TINY ITEMS, and the comment's own intent (right
end of the Description box) overflows into the Drive row at that size. Comms
recommended (a) keep-and-resize.

**Xero: (d) drop it from the printed sheet.** The portrait stays on screen; it
does not print at all. Overrides the Comms recommendation - the official sheet
has no portrait box and no box is worth spending on it.

Implementation for Character Generators: remove the `ps-portrait` div emitted at
index.html:2716, and fix the now-dead comment on 2715 so code and comment stop
disagreeing. Keep the upload, preview and on-screen render exactly as they are.
Routed to Character Generators 2026-09-11.

**SHIPPED and verified by Comms 2026-09-11:** walkingdead-rpg f0dfa68 "drop the
portrait from the printed sheet and the exported PDF". `ps-portrait` went 4
occurrences at f0dfa68^ to 0 at HEAD, and the live file at
thetable.xerosumgames.com/walkingdead-rpg serves 200 with 0 occurrences. Upload
and on-screen preview still present (15 other `portrait` references remain).

**Scope widened beyond the question - see OPEN #1.** The portrait was drawn at
78%/82% in TWO places: buildSheet() for the printed sheet and generatePDF() for
the downloadable fillable PDF. The question named only the printed sheet. The
lane removed both, reasoning that leaving it in the PDF would preserve the exact
defect in the artifact people keep. Flagged, not silent.

### 2026-09-11 - Add TheTable origin to Supabase redirect URLs? -> DONE (a)

Asked by HP via Puffer Fish. Comms verified: live domain 200s, signup sends
emailRedirectTo `${window.location.origin}${next}` (app/signup/page.tsx:24),
login uses signInWithPassword so existing logins never needed it.

**Xero: done.** He first added the bare origin
`https://thetable.xerosumgames.com`, which would not have matched - `next`
defaults to `/` and `/mailinglist` is reachable via
components/MailingListAdmin.tsx:17. Corrected to
`https://thetable.xerosumgames.com/**`, confirmed in the dashboard.

Comms also verified the four pre-existing thetapestry rows are correct against
that repo's code (origin + /auth/callback, and + ?next=<encoded>). Known
caveat, not a defect: the two localhost:3000 rows only work if Tapestry's dev
server actually runs on port 3000 - it has been squatted before and had to run
on an auto-port. Routed to Puffer Fish (infra) 2026-09-11.

### 2026-09-11 - Give Table | HP its own worktree? -> YES (a)

Asked by Puffer Fish. Verified by Comms first: `git worktree list` showed only
TheTable (main) and TheTable-comms (lane/comms), so HP and Puffer Fish really
were sharing one working tree on main.

**Xero: (a) yes.** Add worktree ../TheTable-hp on branch lane/hunt-peck,
mirroring MeSuite. Routed to Puffer Fish (owning lane) 2026-09-11. See
decisions.md for the worktree creation + re-home status.
