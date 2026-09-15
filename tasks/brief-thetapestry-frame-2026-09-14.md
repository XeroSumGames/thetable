# Brief for TheTapestry: one frame, to the VTT standard - MOCKUP ONLY (2026-09-14)

**From:** Table | Puffer Fish HUB. **Asked for by:** Xero, 2026-09-14.
**Owner of the work:** Tapestry | Puffer Fish Hub, which may route it to a lane.
**Standard:** `D:\Coding\VTTs\TheTable\tasks\vtt-frame-standard.md` (section 1b
has the measurements table). **Working reference:** Mothership VTT, live at
https://mothership.xerosumgames.com, with its frame in
`D:\Coding\VTTs\mothership-vtt\app\globals.css` (search "THE HOUSE FRAME") and
`components\Frame.tsx`. TheTableau has the same frame on its dev server
(`D:\Coding\VTTs\TheTableau`, branch phase-b-deck-combat, commits 9c5e1cdd and
960d5e49).

## What Xero asked for

> "i also want the new design mocked up on TheTapestry for Distemper. it
> currently uses two frames based on context (tactical vs campaign), I want to
> reconcile them into one, based on our standard design. as The Tapestry is a
> live site, make sure we mock this up on the test server first"

**THIS IS A MOCKUP. TheTapestry is the live, revenue site.**
- Do NOT push to main, and do NOT deploy to production.
- Build it on the dev or test server: a local dev server, a branch preview
  deploy, or whatever TheTapestry uses as its test environment.
- Leave it there for Xero to look at. He decides whether and how it ships.

## The two frames today (from Xero's screenshots, 2026-09-14)

**1. The story table / tactical view** (e.g. "DISTRICT ZERO (SESSION 3)").
- **Top bar:** session title, then Start Session, a record dot, Campaign Map,
  Tactical Map, Share Map; on the right Community, Campaign, GM Tools,
  Dashboard, Exit.
- **Left panel:** the user (XERO (GM)) with notification icons, tabs LOGS /
  CHAT / BOTH / MAP, a Start Session button and the system log.
- **Centre:** the tactical map, with Day/Fog controls and a zoom slider.
- **Right panel:** tabs NPCS / ASSETS / PINS / GM NOTES, NPC filters and a
  roster.
- **Bottom bar:** the GM avatar, OBSERVING, and one slot per player character
  (MAP / POPOUT).

**2. The world / campaign view** ("DISTEMPER - THE TAPESTRY v0.5").
- **Left panel:** the brand block (SURVIVORS PRESENT), the user (XERO
  (THRIVER)) with icons, then a long site menu:
  - A Guide to the Tapestry, The World, My Survivors, My Stories, Join a Story,
    My Communities, The Campfire, Rumors, The Rules, Quick Reference, The
    Distemperverse;
  - a SURVIVORS section (Creating a Survivor, Backstory Generation, Quick
    Character, Random Character, Paradigms...).
- **Centre:** the world map, with layer buttons (Satellite, Topo, Street...).
- **Right panel:** PINS, tabs WORLD EVENTS / MY PINS / WHISPERS, and the pin
  lists.
- **No title bar and no section strip.**

## The standard both must become (one frame for the whole site)

| Part | Standard |
| --- | --- |
| Left rail | 280px, 14px padding. **The game frame:** navigating the game, and the logs |
| Right rail | 260px, 14px padding. **The player panel:** what the player keeps |
| Centre | the rest, 1fr, **no padding** (each view adds its own 14px; maps run edge to edge) |
| Dividers | 1px |
| Title bar | 45px, one line at every width (long items clip with an ellipsis, they never wrap) |
| Section strip | 34px, grows when a tab name wraps; **first tab over the left rail (280px), last over the right rail (260px)**, the rest share equally |
| Rail tab strips | 28px |
| Frame height | fills exactly what the bars leave, with no gap below. Build it as a flex column of 100vh with the frame `flex: 1`, not `calc(100vh - N)` |
| Below 820px | stacks to one column and scrolls |

**Rule for which rail something goes in:** does the GAME own it (left), or the
PLAYER (right)? The thing being used right now goes in the centre.

## The job: one frame for both contexts

Propose and mock up how the tactical view and the world view both fit that one
frame, so switching between them changes the CENTRE and the tabs, not the
frame. A starting mapping to test, not to follow blindly:

- **Title bar (45px):** the brand or session title, the user and role, and the
  global controls. Today these are split between the tactical top bar and the
  world view's left panel.
- **Section strip:** the site's top-level sections. Campaign Map and Tactical
  Map could be tabs rather than buttons.
- **Left rail (game frame):** logs and chat (tactical), and game navigation.
- **Centre:** the world map, the tactical map, the rules pages and so on.
- **Right rail (player panel):** pins, whispers and notes.

## Decisions to FLAG for Xero, not settle

These have no answer in the standard. Show him options on the mockup rather
than picking one silently.

1. **The long site menu** (Guide, World, Survivors, Stories, Communities,
   Campfire, Rumors, Rules, Quick Reference and the SURVIVORS sub-menu). It will
   not fit a section strip as tabs, and a 280px game-frame rail is meant for the
   game, not site navigation. Options include grouping it into a few top-level
   tabs with sub-navigation, a menu in the title bar, or a rail tab.
2. **The tactical bottom bar** (the GM and player character slots). The
   standard has no bottom bar. Does it move into a rail, into the section strip,
   or stay as a deliberate exception?
3. **The GM's right rail** (NPCs, Assets, GM Notes). This is the GM's own
   working material. It fits "the player panel" when the player is the GM, but
   the standard's rule of game-owned versus player-owned is worth confirming
   with him for GM tools specifically.
4. **The map controls** (Day/Fog, zoom, layer buttons). In the map itself, or
   in the chrome?

## When the mockup is up, report back

Send a message to Table | Puffer Fish HUB, session
local_58826b41-8ebe-4b95-a65a-6e4dd5b2cf25, with:
- the test URL(s) and how to reach both the tactical and the world views;
- the branch and commit (local or preview only);
- measurements at 1920x1080 and 1280x800: title bar, strip, each tab width,
  rail widths, frame height, gap below, rail tab strips, centre padding;
- the options you mocked for each of the four decisions above.

The hub will verify the measurements against the standard and hand it to Xero.
Nothing ships to the live site without his approval.
