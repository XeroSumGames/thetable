# HANDOFF - Table | Puffer Fish (hub), 2026-09-12

You are the **hub** for TheTable. The outgoing session wrote this at ~80%
context. Read it, then `tasks/decisions.md` (the durable calls) and
`tasks/todo.md` (open work). Everything below was true at main `HEAD` on
2026-09-12; re-verify before acting on any of it.

**First thing you must do: claim the hub.** Your session id is new. Update the
roster in `tasks/COMMS.md`, commit, push, and message all three lanes with your
id (see "Coordinating" below). Until you do, the lanes will route to a dead
session.

---

## 1. What this project is

**TheTable** (`thetable.xerosumgames.com`) is Xero Sum Games' always-free third
property. It is a thin Next.js hub that:

- surfaces **8 static character generators** at `/<slug>` via proxy rewrites
  in `next.config.ts` (each generator is its own repo + Vercel project),
- hosts a few of its own pages (`/`, `/table`, `/login`, `/signup`,
  `/mailinglist`, `/a24`),
- is the **directory** for full apps, which live on their own subdomains.

Repo: `github.com/XeroSumGames/thetable`, checkout `D:\Coding\VTTs\TheTable`.

### The other properties (context, not yours)
TheTapestry (revenue) and TheTableau are separate products with their own hubs
and their own Puffer Fish sessions. Do not push to them casually. TheTapestry's
`tasks/lane-protocol.md` is the authoritative source for the lane/Comms pattern
this project copies.

---

## 2. Who you are, and the four lanes

Four sessions work on TheTable. **All four now have their own git worktree** -
this matters, they used to share one checkout and it caused real clobbering.

| Lane | Worktree | Branch | Owns |
|---|---|---|---|
| **Puffer Fish (you)** | `D:\Coding\VTTs\TheTable` | `main` | Integration, merges, architecture, the Mothership VTT |
| **Comms** | `D:\Coding\VTTs\TheTable-comms` | `lane/comms` | `COMMS.md`, the smoke-test workbook, every question for Xero |
| **HP** | `D:\Coding\VTTs\TheTable-hp` | `lane/hunt-peck` | Features on the hub itself (landing page, routes) |
| **Character Generators** | `D:\Coding\VTTs\TheTable-chargen` | `lane/character-generators` | All 8 generator repos + the hub's generator surface |

Session ids as of 2026-09-12 (**re-check with `list_sessions`; they change when
a lane restarts, and one already has**):

- Comms: `local_894fe581-b1be-4366-ae60-d38ce452c53c`
- Character Generators: `local_eb161fa5-d93d-4048-aa94-6a27856de9d2`
  (the older `local_1fa2c241-...` is STOPPED - do not route to it)
- HP: `local_4aca6765-6aab-4c0e-961d-be4b5c01da3c`

### What being hub actually means
1. **You merge lane branches to main.** See the gate in section 5.
2. **You make architecture calls** and write them into `decisions.md`.
3. **You do NOT ask Xero questions directly** - everything routes via Comms.
4. **You verify other lanes' claims before acting on them.** This has caught
   real errors both ways, including two of the outgoing session's own bad
   citations.

---

## 3. Coordinating with the other three lanes

**The repo is the transport. Messages are only a nudge.**

This is the single most important operating rule and it was learned
expensively: cross-session messages **fail silently when the target session is
idle** (`isRunning: false`). Seven messages were lost in one day, including an
unpause instruction from Xero. So:

> Write the answer to a file and commit it BEFORE you send the message.

Mechanics:

```
mcp__ccd_session_mgmt__list_sessions      # find a lane's live id by title/cwd
mcp__ccd_session_mgmt__send_message       # deliver into that session
```

- The result says `delivered` (its turn started) or `queued` (it will run when
  its current work finishes). Anything else means it did not land.
- **Xero does not relay between sessions.** Never write "or ask Xero to pass
  this along".
- A lane can die and come back with a **new session id**, on a **different
  model**. Check `get_session` after any restart, and keep the roster in
  `COMMS.md` current.

### The Comms channel - how questions reach Xero

Every question for Xero goes through Comms. **No exceptions, and this holds
even when Xero is actively chatting in your session.** His words:

> "if you have questions (ever, on anything) they should be routed to the comms
> channel. i go there ONLY to answer questions which get lost in your stream of
> consciousness."

He also asked that the channel be *"sparse, terse, and free from any stream of
consciousness, just questions/answers."* Respect that - numbered options, each
answerable in a word, a one-line recommendation, batched.

**Procedure:** add the question to `tasks/COMMS.md` under OPEN (file first) →
commit + push → message the Comms session. Comms verifies the claim itself,
puts it to Xero, records the answer under ANSWERED with a date, and routes the
outcome back to the owning lane.

**The one carve-out:** tight real-time back-and-forth that *Xero himself*
starts. If he is handing you values one at a time in your own session, just
answer him. Route genuine open decisions.

**Trap the outgoing session fell into:** Comms records answers on
`lane/comms`, which does **not** reach `main` until you merge it. Four answered
questions sat unmerged and unread for hours. **Check `lane/comms` regularly**,
not just `main`.

---

## 4. Environment and gotchas that bite

- **`py`, not `python`** (`python` is the broken Windows Store stub).
- The **Bash tool is Git Bash** - it mangles `C:\` backslashes. Use
  `/d/coding/...` or forward slashes. `cd` resets between calls, so `cd X && ...`
  in one command.
- **Backticks inside a double-quoted bash string run as command substitution**
  and silently delete the word. Use a heredoc (`-F -` with `<<'EOF'`) for any
  commit message containing backticks.
- **Commit email is the deploy-blocker.** Always:
  ```
  git -c user.name="Xero Sum Games" \
      -c user.email="187208146+XeroSumGames@users.noreply.github.com" commit ...
  ```
- **Never `git add .`** - stage explicit paths. Other lanes' uncommitted work
  lives in the same tree.
- **Generator `index.html` files are huge** (embedded base64). Never cat/grep
  them in a way that dumps it - use `py`+regex or `sed -n` ranges.
- **Deploy = `git push`.** Every Vercel project here is git-connected. **Do NOT
  run `vercel deploy`/`--prod`** - the CLI attributes the deploy to the commit
  author email, our no-reply address is not a Vercel team member, and the
  deploy lands `UNKNOWN` and never aliases. A deployment stuck `UNKNOWN` in
  `vercel ls` is that signature; it is what killed the original apegenerator
  project. **Do not "fix" it by switching to the gmail address** - that is the
  inverse failure that already blocked two projects.
- Never link a **per-build hashed Vercel URL** - it sits behind Vercel's auth
  wall. Use the stable alias.
- **Verify live, not just locally.** A fixed-width mockup reported zero layout
  drift while the running app had 24 drifting elements at a narrower viewport.
  Measure the thing that ships.

---

## 5. The merge gate (your job)

Recorded in `decisions.md`. For the small set of **shared/hot files** -
`next.config.ts` (GENERATOR_REWRITES), `app/page.tsx` (GENERATORS tiles),
`app/sitemap.ts` - a lane commits to its branch, pushes, and messages you the
SHA. **You read the actual diff** and merge to main yourself. No GitHub PR;
this repo has never used them.

Everything else (a lane's own generator repo, its own cover art) self-ships.

**Two merge traps:**
1. `git diff --stat main..lane` shows huge phantom deletions when the lane
   branched before content landed on main. That is a snapshot comparison, not a
   merge. Check `git diff --stat $(git merge-base main lane) lane` for what the
   branch *actually* changes, and trust the three-way merge.
2. A merge aborts if your working tree has uncommitted changes to a file the
   merge touches. `.claude/launch.json` is **Char-Gen's file** - if it blocks
   you, discard your local copy, don't fight it.

---

## 6. Current state

### TheTable hub - healthy
Live, all routes 200. **All three lane branches were merged into main and
pushed on 2026-09-12** as part of this handoff, and the build is green. The
lanes are now level with main; nothing is stranded.

### The 8 generators - all live
apegenerator (served by the `potagenerator` Vercel project), space1999,
dredd-generator, walkingdead-rpg, traveller-generator, 2300ad-generator,
twilight2000-generator, mothership-generator. All proxied at
`thetable.xerosumgames.com/<slug>`.

The **shared name-pool fix landed**: `shared/name-pool.json` is the single
canonical 1000-name pool and `tools/sync-name-pool.py` (write + `--check`
modes) keeps walkingdead-rpg, traveller-generator and 2300ad-generator from
silently drifting. `--check` is the part that matters.

### Mothership VTT - the active build, and yours
**https://mothership-vtt.vercel.app** - repo `XeroSumGames/mothership-vtt`
(private), checkout `D:\Coding\VTTs\mothership-vtt`, Supabase project
`dtcqtbrfghuxtogkarzy` in the XeroSumStudio org.

Read `tasks/mothership-vtt-architecture.md` in full - it is the spec. Summary:

- **Topology (durable rule):** every third-party VTT gets its own subdomain,
  own repo/Vercel/Supabase, full email/password accounts on its OWN project -
  never the shared Tapestry pool. Static generators keep the proxied subpath.
- **Visual:** ONE design, TWO modes. Dark = Terminal (default), Light = Zine.
  A full identity swap (fonts, border weight, texture, case), not a palette
  swap. **Six layout-lock rules in `decisions.md` keep them pixel-identical -
  read them before touching `app/globals.css`.** The nastiest: `line-height:
  normal` resolves differently per typeface and a 1px strut difference
  cascaded across 129 elements.
- **Shipped:** Tier 1 (sheet + dice roller), 1b (auth, owner-scoped
  persistence, character import), 1c (Wounds table, damage cascade, concealed
  Death Save). `npm test` = 71 assertions, 0 failures.
- **`lib/rules.ts` is transcribed from the PSG v1.2 with page citations. Do
  not add a rule that is not in the book, and cite the page when you do.**

**Owed by Xero, still outstanding:**
1. **Walk the authenticated path once** - sign up, sheet loads, roll, autosave,
   sign out, sign back in, character persists, import a `.mothership.json`.
   The outgoing session could not do this: creating accounts and entering
   passwords is outside what it does.
2. **The Wix DNS record** - `mothership` CNAME → `cname.vercel-dns.com`. Not
   blocking; the app works on the `.vercel.app` alias. His own A24 notes warn
   Wix is finicky about subdomain CNAMEs; the fallback is hosting under
   `distemperverse.com`.

**Next on the VTT, in order:** multiple characters per user (the table supports
N, the UI assumes one); Bleeding (PSG p32.2 - several Wounds entries grant
"Bleeding +N" and nothing tracks it); then Tier 2 (GM tools) and Tier 3 (live
session). **Tier 3 needs a campaigns/members join before a GM can read a
player's sheet - do NOT widen the owner-only RLS policy to get there.**

### Loose ends
- `tasks/puffer-handoff-2026-07-29.md` is untracked and badly stale (old
  `C:\thetable` paths, says deploy is `vercel --prod`). Xero was asked twice
  about deleting it and has not answered. Do not trust it.
- `package.json` on main has an uncommitted `dev -p 3002` pin from the
  outgoing session. Char-Gen's `launch.json` runs a bare `npm run dev` for
  `thetable-dev`, so that pin is what keeps it off port 3000. Commit it or
  fold it into Char-Gen's setup - just don't silently drop it.

---

## 7. How the outgoing session worked (the habits worth keeping)

- **Verify before claiming.** Every "it's live" in this project was checked
  with a real request, and byte-compared where it mattered. Twice that caught
  things that would otherwise have shipped broken.
- **Read the source, don't infer it.** The Mothership rules came out of the
  PDFs with page citations. The character importer was written against the
  generator's *actual* engine output, which emits **capitalised** stat keys -
  the spec-based assumption would have produced sheets of zeroes silently.
- **Test invariants over many runs**, not one lucky result. The rules suite
  asserts across ~10,000 randomised rolls.
- **When UI sits behind a gate you cannot pass**, patch a LOCAL-ONLY bypass,
  build and run it on a spare port, drive it, then `git checkout` the file.
  Never deploy a bypass.
- **Own mistakes plainly in the record.** `decisions.md` and `lessons.md`
  carry the outgoing session's wrong citations and its bad "re-open the
  session" advice, because the correction is the useful part.
