# COMMS - questions for Xero on TheTable

Comms owns this file. Lanes add to OPEN; Comms puts the question to Xero,
records his answer in ANSWERED with a date, and routes the outcome to the
owning lane.

Do NOT ask Xero anything already answered in decisions.md or todo.md.
Verify a thing is actually reachable before asking him to test it.

Sessions (route with mcp__ccd_session_mgmt__send_message; Xero does not relay).
Required model is per tasks/decisions.md "Model assignment per lane" - CHECK
get_session AND SET IT after every restart, a lane silently resuming on the
wrong model has already happened twice (2026-09-11, 2026-09-12):
- Table | Puffer Fish (hub)  local_58826b41-8ebe-4b95-a65a-6e4dd5b2cf25  [Opus 5]
  (restarted 2026-09-12 per tasks/HANDOFF-puffer-fish-2026-09-12.md; the old
  session local_373a5c5c-ee39-47ef-92a9-0bf3ef94544d is stopped - do not route
  to it. Found resumed on Sonnet 5 2026-09-12 - a session cannot switch its OWN
  model, but ANOTHER session can: Comms set it with set_session_model and
  verified Opus 5 by get_session afterwards. RESOLVED. Recovery note, because
  the first version of this line credited Xero's model menu: a stuck lane does
  NOT need him - any other lane can switch it, and the app asks him to approve.)
- Table | HP (features)      local_4aca6765-6aab-4c0e-961d-be4b5c01da3c  [Sonnet 5]
- Table | Character Generators  local_e4a53d2c-e7e9-4c6c-87d4-bd6008bca5c6  [Opus 5]
  (restarted again 2026-09-12; both local_eb161fa5-d93d-4048-aa94-6a27856de9d2
  and the older local_1fa2c241-d7af-4e86-86dd-319b6f2df3bd are stopped - do not
  route to either. Found resumed on Sonnet 5 2026-09-12, corrected via
  set_session_model by Puffer Fish the same day)
- Table | Comms (this lane)  local_894fe581-b1be-4366-ae60-d38ce452c53c  [Opus 5]

## Give Xero FULL PATHS (his instruction, 2026-09-12)

"instructions like 'the worksheet in The Table Smoke Testing.xlsx' are useless
without a folder structure. look how many folders there are."

D:\Coding\VTTs holds ~25 sibling folders, including four worktrees of THIS repo
that each carry their own copy of every tracked file. Naming a file without its
folder is not an instruction.

**Every file Xero is asked to open gets its full absolute path, every time.** No
bare filenames, no "the workbook", no "tasks/COMMS.md" on its own.

**The copy he opens is always the one in the Comms worktree**, because Comms
owns these files and commits from there:

| What | Exact path |
| --- | --- |
| Test workbook | `D:\Coding\VTTs\TheTable-comms\tasks\The Table Smoke Testing.xlsx` |
| This file | `D:\Coding\VTTs\TheTable-comms\tasks\COMMS.md` |
| Decisions | `D:\Coding\VTTs\TheTable-comms\tasks\decisions.md` |
| Lessons | `D:\Coding\VTTs\TheTable-comms\tasks\lessons.md` |
| Backlog | `D:\Coding\VTTs\TheTable-comms\tasks\todo.md` |
| Deploy runbook | `D:\Coding\VTTs\TheTable-comms\tasks\deploy-runbook.md` |
| Hub handoff | `D:\Coding\VTTs\TheTable-comms\tasks\HANDOFF-puffer-fish-2026-09-12.md` |
| Mothership VTT spec | `D:\Coding\VTTs\TheTable-comms\tasks\mothership-vtt-architecture.md` |

**This is not pedantry - the other copies go stale.** Checked 2026-09-12: the
workbook in TheTable-chargen and TheTable-hp was a day behind and did not contain
the Mothership test tab at all. If he opens the wrong one he sees the wrong file
and neither of us finds out.

Files OUTSIDE this repo still get their full path, e.g.
`D:\Coding\RPG Character Generators\CHARGEN-LANE-HANDOFF.md`.

## Worksheet formatting rules (Xero's instruction, 2026-09-12)

**These rules now live in a machine-wide SKILL, not just here.** Xero ruled
2026-09-12 that the smoke-test standard applies to TheTapestry, TheTable,
TheTableau and all their sub-projects, so it was lifted out of this repo:

- `C:\Users\tony_\.claude\skills\smoke-test-workbook\SKILL.md` - the standard
- `C:\Users\tony_\.claude\skills\smoke-test-workbook\build_test_sheet.py` -
  the builder every lane should call instead of hand-rolling openpyxl
- `C:\Users\tony_\.claude\CLAUDE.md` carries a pointer, so a session finds it
  even if skill discovery does not fire

Deliberately NOT an atlas note: atlas notes are per-project, recency-ordered and
built to be dropped, so a cross-property standard would have to be duplicated
into three projects and would scroll away. The section below is this project's
local copy; if the two ever disagree, the skill wins.

"having all that text put in column b is impossible to read." He is right, and
the cause was a formatting bug: the intro prose was written into column B while
column B was 5 characters wide, so every sentence rendered as a one-character
column hundreds of rows tall.

Rules for every worksheet from here:

- **Prose never sits in a narrow column.** Any heading or paragraph is MERGED
  across the full table width (B:F) before the text goes in.
- **Merged cells do not auto-fit - set the row height explicitly.** Excel will
  not grow a merged row to its content, so compute it: characters divided by the
  merged width, times the line height.
- **Wrap text and top-align every cell**, prose and table alike.
- **One narrow gutter column A**, so nothing touches the window edge.
- **Freeze under the header row** and turn gridlines OFF - the borders carry the
  table, and gridlines make wrapped prose unreadable.
- **Check it after writing**, do not assume openpyxl rendered what was intended.

Layout that works for a test tab: A gutter 2, B "#" 5, C "Pass / Fail" 12
(dropdown: Pass / Fail / Skipped), D "What you do" 50, E "What you should see if
it is right" 50, F "Notes" 24.

## Question numbering (Xero's instruction, 2026-09-12)

Every question put to Xero carries a sequential number - Q1, Q2, Q3 - and the
counter NEVER resets. It does not restart per batch, per day, per topic or per
Comms session. He tracks answers by that number, so a reused number is worse
than a missing one.

Counter re-based at his instruction 2026-09-12: the Mothership VTT authenticated
test is **Q1**, the Wix CNAME is **Q2**. The next question asked is **Q3**.
Earlier questions in this log predate the scheme and are unnumbered; do not
renumber them and do not reuse their old ad-hoc numbers.

**Record the number here when you ask, not afterwards.** The next Comms session
reads this file to find where the counter is.

## OPEN

*(nothing open for Xero as a decision)*

### STILL OWED BY XERO - nothing (cleared 2026-09-13)

- **Supabase Site URL: DONE 2026-09-13.** mothership-vtt project Site URL =
  https://mothership.xerosumgames.com, Redirect URLs = that and
  https://mothership-vtt.vercel.app. Seen in his screenshot. Signup is still not
  re-tested: that waits on the hub's code half (emailRedirectTo at Auth.tsx:37),
  then Comms tests it end to end.
- **Junk signup row: DONE 2026-09-13, per Xero.** Deleted via the SQL editor on
  the shared project jbudzglgtxeoaufpejrv, after a first attempt in the
  mothership-vtt project failed harmlessly. Comms cannot verify the row count
  from here (no production credentials), so this rests on his report.

### ROUTED TO THE HUB (Puffer Fish) 2026-09-13 - build work from Xero's answers and his test rerun

From answers: Q6 keep the VTT skin on the generator module (no work); Q7 put the
two logo PNGs in the title bar as a masthead, black in light mode, white in dark;
Q8 drop the mockup change (no work); and **make LIGHT the default mode** (today
`app/layout.tsx` defaults to dark).

From Xero's test notes on the Mothership auth tab (in
`D:\Coding\VTTs\TheTable-comms\tasks\The Table Smoke Testing.xlsx`).

**CORRECTED 2026-09-13 - these are NOT from a rerun today.** Comms labelled them a
rerun because the workbook arrived modified at session start. Puffer Fish showed
otherwise and the git history agrees: they are Xero's SECOND pass on 2026-09-12
(after Comms rewrote step 5 at 08:36 - hence "much better"), which the hub dates to
about 16:19. They sat uncommitted until Comms committed them 09-13 09:45. Timing
against what shipped in mothership-vtt:

- Export button first committed d1f1337, 2026-09-12 16:16 - minutes before that
  pass, very likely not yet live on his screen.
- New character / Random character: ba6c893 18:39, f254e95 19:05, 5104bdc 19:16 -
  two to three hours AFTER the pass.

So steps 9 and 10 are NOT evidence that those controls are hard to find. Comms'
"one layout problem" conclusion is **withdrawn** - it was built on notes that predate
the controls. What still stands:

- Step 3: code half of the Q4 fix (emailRedirectTo, Auth.tsx:37). Hub doing it.
- Step 5: wants a roll log / "current roll" area. A left-rail Game log also shipped
  later on 09-12, so this may already be met - needs a genuine rerun.
- Step 6: the last roll is gone after a reload. STILL TRUE regardless of timing -
  the log is in-memory only. Hub taking it.
- Steps 9 and 10: unproven either way until a genuine rerun.

**Next test ask:** after the hub's push, Comms verifies it live, then writes a NEW
dated tab for a genuine rerun of steps 3 (signup email), 5, 6, 9 and 10.

### 2026-09-13 - Q5, Q6, Q7, Q8 -> a, a, a, b (plus LIGHT MODE DEFAULT)

- **Q5 (a)** crop the access token out of the screenshot. DONE by Comms: the
  browser URL bar (top 43px) removed from the image in the workbook and the file
  re-committed. Checked visually - the token is gone. Older copies remain in git
  history; Xero chose not to purge (option c).
- **Q6 (a)** keep the generator module wearing the VTT's identity - "looks good".
- **Q7 (a)** use the two logo PNGs as a title-bar masthead, one per mode.
- **Q8 (b)** drop the relayed mockup change; the frame is locked.
- **New instruction with it: make LIGHT mode the default.**

Routed to Puffer Fish 2026-09-13.

### 2026-09-12 - Q1 Mothership auth test and Q2 Wix DNS -> BOTH DONE (history kept for the record)

Both recorded in tasks/HANDOFF-puffer-fish-2026-09-12.md and neither is blocking.

**1. Walk the Mothership VTT authenticated path.** A TEST, not a question - it
is now a worksheet, "Mothership VTT auth 2026-09-12", in tasks/The Table Smoke
Testing.xlsx. Ten steps. Only he can run it: it needs a real account, and
creating accounts and entering passwords is outside what the sessions do.

*Verified by Comms 2026-09-12 before asking, per protocol:*
https://mothership-vtt.vercel.app returns 200, the sign-in card renders with
Email, Password and Sign in, and "Create an account" switches it to Create
account with the link reading "I already have an account". The auth wall is
exactly where verification has to stop. https://mothership.xerosumgames.com does
NOT resolve - see item 2.

**2. The Wix DNS record (Q2).** Not blocking; the app works on the .vercel.app
alias, which is why the worksheet points there.

**DONE BY COMMS 2026-09-12 - the Vercel half is finished.** The domain was
added to the project with the authed CLI rather than handed to Xero as
dashboard steps:

    vercel domains add mothership.xerosumgames.com mothership-vtt --scope xerosumgames-projects
    -> {"status":"success","reason":"domain_added"}

`vercel domains inspect` then gave the record Vercel actually wants, which
settles the handoff's CNAME claim for good:

    A    mothership.xerosumgames.com    76.76.21.21     [Vercel's word, recommended]

An **A record**, not a CNAME - matching `thetable.xerosumgames.com`, which
already resolves to 76.76.21.21 on this same Wix-hosted domain. The handoff's
`CNAME -> cname.vercel-dns.com` would have been wrong.

**Q2 COMPLETE 2026-09-12. https://mothership.xerosumgames.com is LIVE.**

Sequence, for whoever does the next one: Comms added the domain with the authed
CLI; `vercel domains inspect` gave the record (A -> 76.76.21.21, not a CNAME);
Xero added it in Wix - the only step he could not be spared; DNS then resolved on
both 8.8.8.8 and 1.1.1.1 within minutes and HTTP served 200.

**The certificate did NOT issue on its own.** After ~25 minutes HTTPS still
failed the handshake with no peer certificate, and `vercel certs ls` showed
certs for thetableau, thetapestry and thetable but none for mothership. Fixed
with an explicit request:

    vercel certs issue mothership.xerosumgames.com --scope xerosumgames-projects

which succeeded in 9s, and HTTPS answered 200 on the next attempt. Do not wait
indefinitely on automatic issuance - check `vercel certs ls` and issue it.

*Verified by Comms: https://mothership.xerosumgames.com serves the real app -
the Mothership sign-in card with Email, Password, Sign in, "Create an account"
and the "The Table" link back to the hub, driven in a browser rather than
inferred from a status code.*

**Direct URL, resolved by Comms 2026-09-12 via `vercel teams ls`:**
`https://vercel.com/xerosumgames-projects/mothership-vtt/settings/domains`

*Xero could not find Domains because he was in TEAM settings (Billing,
Members, Access Groups, Compliance...). Domains is a PROJECT-level tab.
Team slug is `xerosumgames-projects`, display name "xerosumgames' projects";
project is `mothership-vtt`; org id team_sN42g41yxJ62DxivPKSUCCuh, project id
prj_DjmqfNdmeNmetnmdXco3MxFsI6v4, both from
`D:\Coding\VTTs\mothership-vtt\.vercel\project.json`. The Vercel CLI is
installed and authed on this box, so a session can resolve this rather than
guess. Only xerosumgames.com and distemperverse.com are on the account,
both third-party registered with third-party nameservers - Wix.*

*Measured by Comms 2026-09-12, and it corrects the handoff:* xerosumgames.com is
on Wix nameservers (ns0/ns1.wixdns.net), confirmed. `mothership.xerosumgames.com`
does not resolve at all - non-existent domain, no record of any kind. But the
sibling that already works, `thetable.xerosumgames.com`, resolves to **76.76.21.21
via an A record**, NOT a CNAME to cname.vercel-dns.com as the handoff states.

That matters because his own A24 notes warn Wix is finicky about subdomain
CNAMEs, and the A record is very likely why thetable works. So the instruction
given to him is: add the domain in Vercel and use whatever record ITS panel
specifies, and if Wix refuses or mangles a CNAME, fall back to an A record to
76.76.21.21 - the known-good configuration already live on this exact domain.
The recorded last-resort fallback remains hosting under distemperverse.com.

**3. DELETE tasks/puffer-handoff-2026-07-29.md - ANSWERED 2026-09-12: yes.**
Deleted the same day. It was UNTRACKED, so there is no git history to recover it
from; Xero was told that before he answered.

What it claimed, all wrong by 2026-09-12 and all of it the kind of thing a new
session would have acted on: the repo is `C:	hetable` (it is
D:\Coding\VTTs\TheTable); "there is NO GitHub remote for TheTable" and deploy
with `vercel --prod --yes` (the remote is github.com/XeroSumGames/thetable and
deploying is a git push); "four character generators" (there are eight); and no
minimum-font rule on this repo (there is a 14px floor across all eight,
completed 2026-09-11). Two handoff docs had accumulated warnings telling people
not to trust it, which is what finally made deleting it the answer.

Owning lane: none, these are Xero's own. Comms: put all three to him.

### ROUTING - DONE 2026-09-12

**Merge 4e1d92a from lane/character-generators into main. COMPLETE.** Raised by
Character Generators 2026-09-11; routed to Puffer Fish, delivery failed, and the
repo carried it - which is exactly why it is written here. Puffer Fish landed all
three lane branches in its retirement merge bcb763b before retiring. *Verified by
Comms 2026-09-12: `4e1d92a` is an ancestor of `main`, and `shared/name-pool.json`
and `tools/sync-name-pool.py` are both present on main.* Nothing owed to anyone.
Kept below for the verification record.

Adds two new directories to the hub repo: `shared/name-pool.json` (the one
canonical copy of the 1000-name pool) and `tools/sync-name-pool.py` (writes it
outward; `--check` reports drift and exits non-zero without writing). Not
next.config-adjacent, so not under the merge gate - it goes to Puffer Fish
because the canonical file has to live in the hub.

*Verified by Comms at source before routing:* the canonical pool holds 1000
names at sha1 0198a83a7e4a over the parsed array - the exact hash Comms derived
independently from the three duplicated consumers earlier the same day, so it is
genuinely the same pool and not a re-transcription. Consumers are the three that
were duplicated: 2300ad-generator, traveller-generator, walkingdead-rpg. The
file records Xero's bespoke-pools ruling in its own `_not_consumers` field
rather than only in a commit message. walkingdead-rpg e3f132a is live and
verified on the proxy, blob 84e8bf2b, and its entire diff is TWO inserted marker
lines with the 1000-name array byte-identical - checked, not taken on report.

Property not to break if anyone later tidies the writer: syncing an
already-correct file must produce a BYTE-IDENTICAL result. The first version
used a 2-space JSON indent where the consumers use one, turning a one-name edit
into 1005 changed lines.

### 2026-09-12 - Q4: what failed at step 3 of the Mothership test? -> (b) THE CONFIRMATION LINK IS BROKEN

**Root cause found, and it is not what Comms predicted.** Xero answered (b) and
had pasted the error screenshot into the workbook itself, which is what made it
diagnosable at all.

The confirmation email's link points at **`localhost:3000`**. The screenshot
shows `localhost:3000/#access_token=...` and ERR_CONNECTION_REFUSED. Comms had
guessed the Supabase redirect-URL allow-list, the fault TheTable hit. Wrong: the
allow-list was never consulted, because the app never asks for a redirect.

*Located by Comms at source:*
`D:\Coding\VTTs\mothership-vtt\components\Auth.tsx:37` calls
`supabase.auth.signUp({ email, password })` with **no `options.emailRedirectTo`**.
With no redirect supplied, Supabase falls back to the project's **Site URL**,
which is still the development default `http://localhost:3000`. So every
confirmation email any new user ever receives points at a machine that is not
theirs.

Why he still got in: the token was issued and the account confirmed correctly.
Only the landing page was wrong. That is also why steps 4, 7 and 8 passed and
why this looked cosmetic.

**Two fixes, and both are wanted:**

1. *Supabase dashboard (Xero only):* the mothership-vtt Supabase project ->
   Authentication -> URL Configuration -> **Site URL** =
   `https://mothership.xerosumgames.com`, with that and
   `https://mothership-vtt.vercel.app` both in Redirect URLs.
2. *Code (hub lane):* pass
   `options: { emailRedirectTo: `${window.location.origin}` }` at Auth.tsx:37, so
   the link is correct regardless of what Site URL happens to be set to. Belt and
   braces - fix 1 alone leaves the same trap for the next environment.

Routed to Puffer Fish 2026-09-12.

### 2026-09-12 - Q3: where should the smoke-test standard live? -> (a) A USER-LEVEL SKILL

### 2026-09-11 - A Life Foundation emblem for the 2300AD masthead? -> CSS EMBLEM STANDS (a)

Filed by Character Generators as non-blocking; it built a CSS-drawn emblem so
nothing waited, and the redesign shipped with it (8b41c8d, live blob f3163944,
verified by Comms).

**Xero: (a) keep the CSS-drawn emblem.** He is not supplying Life Foundation
artwork. 2300AD's distinguishing gift stays the Esperanto section subtitles -
the Life Foundation's official language per Core Book 1 p101 - rather than an
inlined image.

*Context verified by Comms: traveller-generator carries exactly one inlined
`data:image/png;base64` asset, inside a block commented "Travellers' Aid Society
masthead", so Xero's real TAS artwork is genuinely what gives that frame its
weight. 2300AD has no equivalent asset and will not get one. If he ever changes
his mind the masthead is one element and the swap is small.* Routed to Character
Generators 2026-09-11.

### 2026-09-11 - Does "exempt" mean leave alone, or merely not required? -> NOT REQUIRED (a)

Filed by Character Generators, which had raised space1999generator's `.die-pip`
from 12px to 14px before the prose-only ruling existed and offered to revert it.
*Verified by Comms:* `.die-pip` is a fixed 24x24 box with centred content, so it
would have qualified as exempt; 14px fits inside 24px and no overflow was found
at 1280, 600 or 390.

**Xero: (a) exempt means NOT REQUIRED.** Raising an exempt element anyway is
fine. `.die-pip` stays at 14px; nothing is reverted. The exemption exists
because a fixed box cannot always accommodate larger text - where it can, the
larger text is welcome.

Practical effect for the remaining work: exempt is a floor-compliance carve-out,
not a prohibition. A lane may raise a glyph container when it fits, and must not
when it would overflow. Both `.keytag` (raised, read as prose - verified correct,
it is padding-sized with the word "Key" as content and grew 31px to 38px) and
`.die-pip` (raised, exempt but fitting) stand as shipped.

*Closes the 14px floor questions. Six of eight generators compliant; dredd and
apegenerator remain, both already ruled on.* Routed to Character Generators
2026-09-11.

### 2026-09-11 - Dredd: fold the floor pass into its redesign? -> YES, FOLD IT (a)

Filed by Comms rather than the lane, because the lane was proposing the option
Xero had rejected once and may not have known it.

**Xero: (a) fold Dredd's 14px floor pass into its life-path redesign.** One job.

This deliberately differs from his 2300AD ruling the same day, where the same
choice was offered and he chose standalone. The difference that justifies it:
2300AD's redesign was queued but its floor pass could ship immediately and
independently, whereas Dredd's redesign rewrites that generator's UI markup
wholesale - so flooring first is work thrown away, and worse, the redesign could
quietly reintroduce sub-14px rules after the floor pass had signed them off.

**Consequence to hold onto:** Dredd's live site keeps breaking the 14px rule
until the redesign ships. That is accepted, not overlooked.

**Same hazard in reverse on 2300AD, already handled by the lane and needing no
ruling:** its floor pass is ALREADY shipped, so its redesign could undo it
unnoticed. The lane is treating "nothing on screen below 14px prose" as an
acceptance criterion of both redesigns, verified by computed style before either
ships, rather than re-auditing afterwards. Routed to Character Generators
2026-09-11.

### 2026-09-11 - apegenerator's floor pass would push parked work live -> FIX THE SHEET FIRST (b)

Filed by Character Generators. *Verified by Comms:* apegenerator was 1 ahead of
origin on b5f49d3, "print the official Planet of the Apes character sheet,
filled in" - Xero's own commit from 2026-08-16, replacing the CSS dossier print
output with the publisher sheet. The live site does not have it, so any
floor-pass push would have taken it live. The push-all-four ruling covered
mothership, 2300ad, twilight2000 and traveller only.

**Xero: (b) do the POTA sheet fixes from atlas note #121 first, then ship both
together.** So he does still want the official sheet; it is not being abandoned
and it is not shipping as-is.

**SHIPPED AND VERIFIED LIVE by Comms 2026-09-11:** apegenerator df00342, "make
the printed sheet legible, and put a 14px floor under the text", sitting on top
of b5f49d3 - so his parked sheet went live with it, as the ruling intended. Live
blob 89b75d6c, matching on potagenerator.vercel.app and on the
thetable.xerosumgames.com/apegenerator proxy route. The official sheet is
present in the served bytes (one inlined base64 image, SHEET_FIELDS). Verified
against potagenerator, NOT the dead apegenerator.vercel.app hostname.

**THE 14px FLOOR PROGRAMME IS COMPLETE - 8 of 8.** Total re-derived by Comms
from the live bytes of all eight rather than recalled, as promised:

| generator | prose | exempt | print |
| --- | --- | --- | --- |
| traveller | 0 | 1 | 0 |
| 2300ad | 0 | 1 | 0 |
| twilight2000 | 0 | 1 | 0 |
| mothership | 0 | 0 | 0 |
| space1999 | 0 | 2 | 6 |
| walkingdead | 0 | 0 | 0 |
| dredd | 0 | 3 | 33 |
| apegenerator | 0 | 3 | 0 |

**Zero prose rules outstanding anywhere.** Comms and the lane agree on every
generator; the only difference is bucketing - the lane reported space1999 as
0 prose / 8 exempt, rolling its px-sized print sheet into the exempt column,
where Comms counts print separately. Same underlying bytes.

This makes apegenerator the LARGEST of the four hand-built jobs rather than the
smallest: sheet fixes plus floor pass plus the print and probe verification each
needs, in one push. It is correctly last in the lane's sequence.

*Comms verified the commit and its unpushed state; Comms did NOT verify atlas
note #121's contents - the lane owns reading that.* Note also that apegenerator
carries a modified .gitignore alongside, which the lane had attributed to
dredd-generator only. Routed to Character Generators 2026-09-11.

### 2026-09-11 - Does the 14px floor cover glyphs inside fixed-size UI shapes? -> PROSE ONLY (a)

Raised by Comms after finding two sub-14px rules surviving in the SERVED
space1999generator bytes, which the lane had reported as zero. Both were glyph
containers: `.sel-badge` (20x20 circle, border-radius:50%, content `&#10003;`)
and `.pk-box` (17x17 rounded-square checkbox, same construction as `.opt-box`).

**Xero: (a) the floor covers PROSE only.** A glyph inside a fixed-size box or
badge is exempt, as `.opt-box` already was. This is a CATEGORY ruling, not a
per-selector one - it settles `.opt-box`, `.sel-badge`, `.pk-box` and every
similar container in walkingdead-rpg, dredd-generator and apegenerator. Do not
re-ask per generator.

Practical effect: a sweep that reports sub-14px rules should classify them
first. A 12px tick inside a 17px box stays; prose does not. Raising the glyph
would overflow its container, which is why this reading is also the one the
markup wants.

*Space 1999 itself needs no change - both surviving rules are exempt under this
ruling, and the pass that shipped (84c9994, live blob 0c4f8485, verified on both
hostnames by Comms) is complete as it stands.* Routed to Character Generators
2026-09-11.

**Scoping consequence, verified by Comms 2026-09-11:** `.step-num` is EXEMPT
under this ruling, not shared chrome to raise as Comms had earlier scoped it. It
is a fixed circle - 20x20 in dredd-generator, 17x17 in apegenerator,
`border-radius:50%` - containing a digit or a checkmark. That shrinks the
remaining job in both generators slightly.

**Classified audit of all eight, lane's figures, spot-checked by Comms:**
traveller / 2300ad / twilight2000 zero prose + 1 exempt (`.opt-box`);
mothership and walkingdead zero prose + 0 exempt; space1999 zero prose + 2
exempt (`.sel-badge`, `.pk-box`); dredd 32 prose + 3 exempt; apegenerator 36
prose + 3 exempt. Six of eight compliant; the two outstanding are exactly the
two Xero has now ruled on.

**Reconciles an earlier unexplained discrepancy.** Comms' static scan of
dredd-generator said 53 sub-14px against the lane's 35. The difference is
print-sheet sizes written as inline `style=` strings inside the `printSheet()`
JS function - roughly eighteen of them, at 7px to 11px. They are print output,
not screen, and correctly out of scope. Neither count was wrong; they were
counting different things.

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

**The footer is four separate edits, not one repeated.** Unlike the src/-based
three, where it was a single identical inline style in each assemble.py, the
hand-built four each declare it under a DIFFERENT class name. *Verified at
source by Comms 2026-09-11:*

| generator | footer rule |
| --- | --- |
| apegenerator | `.site-footer` 12px |
| space1999generator | `.footer` 12px |
| dredd-generator | `.footer` 12px |
| walkingdead-rpg | `.foot` 12px, markup `<footer class="foot no-print">` |

*Correction to the lane's version of this finding, which said walkingdead-rpg
had no footer font-size rule and inherited from elsewhere: it does declare one,
at `.foot`, directly. The difference matters to whoever does the work - a
declaration under an unexpected name is a one-line edit like the other three,
whereas "inherits from somewhere else" implies a hunt that is not needed.*

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

**FIXED AND VERIFIED LIVE by Comms 2026-09-11:** twilight2000-generator 2947621,
"keep the printed sheet on one page at the rules' ceiling". Live blob 683ae395,
matching on both the alias and the proxy route; the served bytes carry one
sub-14px rule, `.opt-box`, exempt.

The diagnosis was not the spill. The sheet had been tightened once before and
fit only to a hairline - the tallest of 240 random characters measured 1053px
against a 1056px letter page. Three pixels is a coincidence, not a fit. Rather
than hunting for an unlucky character, the lane MEASURED the ceiling using
Chrome CDP's `Emulation.setEmulatedMedia({media:'print'})`, which applies the
print stylesheet to the live DOM: the rules' true maximum - 10 terms, 14
specialties, every skill, all gear, all five personal fields - came to 1093px,
37px over. About 60px was bought back from gaps between blocks with type sizes
untouched. Ceiling now 1043px, 13px clear.

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
