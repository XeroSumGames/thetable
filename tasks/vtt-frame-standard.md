# The VTT frame - the standard for every Xero Sum Games VTT

**Status: DECIDED by Xero 2026-09-12; measurements settled 2026-09-14 (section
1b). Applies to every VTT from here on, not just the two that exist.** A new VTT starts from this layout; it is not a
per-project choice to make again.

Reference implementations, all built to section 1b and verified live by
measurement on 2026-09-14: **Mothership VTT** (`D:\Coding\VTTs\mothership-vtt`,
`app/globals.css` "THE HOUSE FRAME" + `components/Frame.tsx`, asserted by
`scripts/test-frame.ts`) and **TheTableau** (`D:\Coding\VTTs\TheTableau`,
`components/TerminalFrame.tsx` + `components/TerminalTitleBar.tsx`).
TheTapestry is being mocked up to it next. **A new VTT copies one of these
two; it does not re-derive the frame.**
Mockup of the frame in both Mothership identities:
https://claude.ai/code/artifact/38901e35-5114-4719-80a9-eb2b2f160da3

---

## 1. The three panes, and what each is FOR

This is the part that matters. The geometry below is just how it is drawn; the
semantics are what stop a control landing in the wrong rail.

| Pane | Role | Holds |
| --- | --- | --- |
| **Left** | **The game frame** | Controls to navigate the GAME: where you are, what you are in, campaign/session navigation, and the LOGS. |
| **Centre** | **Multi-use** | Swaps between character sheet, map, and whatever else the game needs. Never fixed to one view. |
| **Right** | **The player panel** | The player's own things: notes, inventory, and anything they keep rather than the game keeps. |

Xero's framing, 2026-09-12, verbatim in substance: the left frame is always the
game frame with controls to navigate the game and logs; the centre is always
multi-use so it goes between character sheet, map and anything else required;
the right is the player panel where they can make notes, look at inventory.

**The test when you are unsure which rail something belongs in:** does the GAME
own it, or does the PLAYER own it? A roll log is the game's record - left. A
character's private notes are the player's - right. The thing being played with
right now is the centre.

**Corrects an earlier draft.** The first Mothership mockup put the roll log in
the right rail and character identity in the left. That is wrong under this
standard: the log is game-owned and belongs left. Do not copy that arrangement
from the mockup's first version.

## 1b. The chrome above the panes - a title bar AND a section strip

**Both are part of the frame, not decoration.** Added to this standard
2026-09-12 after the Mothership build shipped the three panes alone and Xero
caught it: "there should be tabs on all the VTTs like on thetableau."

```
+----------------------------------------------------------------------+
| title bar            identity, context, status                 45px  |
+----------------+-----------+-----------+-----------+-----------------+
| first tab 280  | tab       | tab       | tab       | last tab 260    |  34px, grows
+----------------+-----------+-----------+-----------+-----------------+
| left rail      | centre                            | right rail      |
|  280px         |  flexible (1fr), no padding       |  260px          |
|  28px tabs     |                                   |  28px tabs      |
+----------------+-----------------------------------+-----------------+
                          fills the rest of the screen height
```

### Measurements - DECIDED by Xero 2026-09-14

Settled by measuring TheTableau's live site against Mothership and choosing,
item by item. These are the standard; both apps are brought to them.

| Part | Standard |
| --- | --- |
| Left rail | **280px** wide, 14px padding (252px usable) |
| Right rail | **260px** wide, 14px padding (232px usable) |
| Dividers | **1px** gaps between the three columns |
| Centre | the rest: screen width - 542px |
| Title bar | **45px** tall, full width, 20px side padding |
| Section strip (tab bar) | **34px** tall, and it **grows when a tab name wraps** |
| Section tabs | **first tab 280px** over the left rail, **last tab 260px** over the right rail, the tabs between share the rest equally |
| Rail tab strips | **28px** tall |
| Centre padding | **none** on the centre itself; each view adds its own 14px, so a map can run edge to edge |
| Frame height | the columns **fill exactly what the two bars leave**, no gap below |
| Small screens | stacks to one column at `max-width: 820px` |

At 1920x1080 that is: title bar 45, strip 34, columns 1001 tall; tabs
280 / 345 / 345 / 345 / 345 / 260 for six tabs.

### Building it - the details that broke on the way (2026-09-14)

Each of these was a real defect found by measuring, not a style preference:

- **The title bar is `height: 45px`, never `min-height`, with `overflow:
  hidden`.** Its items never wrap: `white-space: nowrap`, and the long,
  lower-priority items shrink with `min-width: 0` and `text-overflow: ellipsis`.
  Identity (logo, site name, user) and game time stay whole. TheTableau's bar
  grew to 53px at 1280 wide before this was done.
- **Section tabs need `min-width: 0` and `overflow-wrap: anywhere`.** Without
  them a flex item cannot shrink below its longest word, and one tab ends up
  wider than the others. That happened to OPERATIONS in TheTableau.
- **Mark the active tab with an inset `box-shadow`, not a border.** A border
  adds height to that one tab and breaks the 34px strip.
- **The strip grows; nothing else in the chrome may.** Check the frame still
  ends exactly at the bottom of the screen at a width where a tab name wraps.
- **Below 820px the page root must let go of the screen height** (`height:
  auto; overflow: visible`, frame `flex: none`), or the stacked columns are
  clipped rather than scrolled.
- **Verify at 1920x1080, 1280x800 and a width where a name wraps**, and on the
  live site after deploying, not only locally: the first live check of
  TheTableau read the previous build.
- **A RAIL NEVER SCROLLS, and the frame enforces it.** The rails are
  `overflow: hidden`; only the CENTRE scrolls (`overflow-y: auto`). Any rail
  content that can outgrow the column owns its own scroll box
  (`flex: 1 1 auto; min-height: 0; overflow-y: auto`) - Mothership's roster, its
  log and its inventory all do. Until 2026-09-16 the rails were
  `overflow-y: auto` and this rule was only a promise each page had to keep:
  TheTapestry copied the frame, put its 1206px site menu in a 721px rail, and
  the whole column scrolled. Both reference implementations now enforce it, and
  `scripts/test-frame.ts` asserts it.
- **A media query contributes NO specificity, so the 820px block loses to a
  `--noright` override.** `.navstrip--noright .navtab:last-child` (two classes
  plus a pseudo-class) beats `.navtab:last-child` inside
  `@media (max-width: 820px)` (one class plus a pseudo-class), so the stacked
  rule silently never reaches that tab. TheTapestry hit this on 2026-09-16: its
  middle tabs carried `flex: 1 1 33%`, five of them claimed 165% of an 800px
  strip, and the last tab - still `flex: 1 1 0` from the un-overridden rule -
  collapsed to 20px with its label clipped. Keep every tab at `flex: 1 1 0` as
  the reference implementations do, so the two rules AGREE rather than race; do
  not fix it by adding a competing declaration inside the media block, which
  re-opens the moment someone adds another `--noright` variant.
- **The general form, and it has bitten three times now: audit every
  `.modifier .child` rule against its breakpoint reset.** Two rules of EQUAL
  specificity are decided by SOURCE ORDER, and a media query still adds none of
  its own, so a stacked reset written ABOVE the rule it resets loses silently.
  Mothership's `.fcol-right .loadout` scroll box is the worked example: the
  reset only took effect once it was moved BELOW the pinned rule, into its own
  `@media (max-width: 820px)` block. Put each stacked reset directly after the
  rule it resets, and check that the one-class resets at the top of the 820px
  block are not quietly failing to reach a two-class rule.
  **The complete rule: a breakpoint reset must either OUTRANK its target or
  COME AFTER it.** Specificity first, source order as the tiebreak; a reset in
  its own media block placed directly after its rule satisfies both at once
  rather than relying on either. Mothership's instance measured BENIGN - the
  stacked rail has no height to squeeze the list against - so a cascade bug
  whose symptom is currently zero is still a bug, and the next layout change is
  what collects on it.
- **Also verify at a SHORT screen, not just a narrow one.** 1280x700 is the
  case that finds a rail 14px too tall; a wide-but-short window is the one real
  users actually have once a taskbar and a browser's chrome are taken off.

**Why the frame is a column, not a calc.** TheTableau sizes its grid as
`calc(100vh - 130px)` in one place and its bars in another. They drifted: live,
its bars total 86px, so the frame stops 44px short of the bottom. The standard
stacks title bar, strip and frame in one flex column of the screen's height,
with the frame taking `flex: 1`. That also lets the strip grow when a name wraps
without pushing the frame off the screen. Mothership implements this in
`app/globals.css`, and `scripts/test-frame.ts` asserts every number above.

**A section with no content yet renders a named "nothing here yet" panel**, not
an empty column - an empty column reads as a broken page. Placeholder sections
are legitimate: they show the shape of the app before its content exists.

**The rails do not change with the section.** They are the game frame and the
player panel; the section changes the CENTRE. That follows from the pane roles
in section 1 - if a section needs its own rail content, that is a signal the
role split is wrong, not that the rail should swap.

## 2. Geometry

Taken from TheTableau's `components/TerminalFrame.tsx`, which is the more
portable of the two existing implementations. TheTapestry's global shell is only
TWO-pane (a 220px nav sidebar); its three-pane is bespoke to the table route and
is NOT the pattern to copy.

```css
.frameroot { height: 100vh; overflow: hidden; display: flex; flex-direction: column; }
.titlebar  { flex: none; height: 45px; }
.navstrip  { flex: none; min-height: 34px; display: flex; }
.navtab             { flex: 1 1 0; }       /* the tabs between the rails */
.navtab:first-child { flex: 0 0 280px; }   /* over the left rail */
.navtab:last-child  { flex: 0 0 260px; }   /* over the right rail */
.frame {
  flex: 1;                       /* fills what the bars leave */
  min-height: 0;
  display: grid;
  grid-template-columns: 280px 1fr 260px;
  gap: 1px;                      /* the gap IS the divider */
  background: var(--divider);    /* shows through the gap */
  overflow: hidden;              /* the document never scrolls */
}
.col        { overflow: hidden; padding: 14px; }  /* a RAIL never scrolls */
.col-centre { overflow-y: auto; padding: 0; }    /* the centre is the scroller */
/* anything in a rail that can grow taller than the column: */
.rail-list  { flex: 1 1 auto; min-height: 0; overflow-y: auto; }
.railtab { height: 28px; }
```

- **Left 280px, right 260px, centre takes the slack.** Fixed rails, flexible
  middle. **No minimum on the centre** (an earlier draft had `minmax(340px, 1fr)`;
  TheTableau has none, and it was removed from Mothership as a deviation).
- **The 1px gap over a divider-coloured background draws the pane lines.** No
  borders. This also keeps the rails from carrying layout-affecting borders,
  which matters on any app with more than one visual mode.
- **The frame is pinned and the CENTRE scrolls, not the page and not a rail.**
  An app, not a document. See section 1b for why the rails are `hidden`.

## 3. Behaviour

- **Stacks to one column at `max-width: 820px`.** One breakpoint, no drawers,
  nothing hidden - the columns simply stack. Both existing apps also show a
  "best on desktop" banner on real phones rather than adapting further.
- **A tab strip at the top of a rail is how you multiplex a fixed-width
  column.** Both properties do this. Reach for it before widening a rail.
  **The device is the MARKUP as well as the 28px**: `role="tablist"` wrapping
  `role="tab"` buttons that carry `aria-selected`, each with a real text label.
  Mothership routes every strip - the section strip and all three rail strips -
  through `components/Frame.tsx`, so it cannot drift per page. A hand-rolled row
  of bare buttons measures identically and is broken for screen readers;
  TheTapestry's pins panel shipped exactly that and is being brought to the
  house markup. Geometry checks cannot see this - read the markup.
  **And query the strip by `role="tab"`, never `role="button"`**: an explicit
  role replaces the implicit one, so an accessibility-tree query for a button
  finds nothing on a CORRECT strip and it reads as missing.
  **The corollary, from TheTapestry 2026-09-16: having the component prevents
  drift only when it is the ONLY way to render the device.** Its port had the
  component, the 28px token AND a styling hook written for this very panel, and
  the panel hand-rolled three bare buttons anyway, because a second rendering
  path survived. A component plus a surviving hand-rolled path is a coin flip on
  which one a call site picks, and the hand-rolled one wins whenever it was
  there first - which it always was. Mothership is safe because nothing else
  renders a strip, not because the component exists; `scripts/test-frame.ts`
  asserts that single path.
  **Where a second path must exist during a migration** - TheTapestry's inline
  pins panel has to stay byte-identical because the onboarding tour targets its
  elements by selector - **write the expiry condition down.** A temporary
  duplicate with no expiry note is a permanent one nobody has noticed yet.
- **Sections inside a rail may collapse**, persisted per user to localStorage
  (TheTableau uses the key `tableau.sidebarCollapsed`). The rails themselves do
  not collapse.
- **A page may suppress the right rail** and fall back to a two-column grid when
  it genuinely has no contextual content. That is the page's call, not the
  user's.

## 4. Carrying it into an app with two visual modes

Mothership VTT runs one design in two identities (Terminal / Zine), under six
layout-lock rules in `decisions.md`. If a future VTT does the same:

- **Fixed px rail widths are an asset** - they cannot vary with the typeface,
  so the frame itself is safe.
- **Everything inside a rail still has to be measured in both modes.** On
  2026-09-12 a `<select>` with an explicit font-family AND line-height still
  sized its box from the font's own metrics and drifted 1px, pushing every
  section below it out of alignment. Fixed-height controls are the reliable
  answer.
- Borders drawn as `box-shadow: inset` rather than `border`, because border
  width differs per mode and a real border adds real height.

## 4b. Approved per-app exceptions

An exception is listed here only when Xero has approved it for that app. It
does not carry over to other VTTs.

| App | Exception | Approved |
| --- | --- | --- |
| TheTapestry (story table) | The DASHBOARD tab (first strip tab, renamed from CAMPAIGN MAP) swaps BOTH rails, against section 1b's "the rails do not change with the section": left shows the full site menu, right shows the PINS panel, centre the world map. Every other story tab keeps the normal rails (Logs / Chat / Both / Map left, NPCs / Assets / Pins / GM Notes right) | Xero, 2026-09-14 |

Also decided for TheTapestry (final picks 2026-09-15, superseding 2026-09-14),
all inside the standard, not exceptions: the site menu stays in the left rail;
the player seats move into the title bar as avatars, each opening an in-page
popover with the bar's MAP and POPOUT controls (so there is NO bottom bar and
the frame fills to the screen's bottom); the GM's NPC list stays in the right
rail; map controls stay on the map. DASHBOARD is the landing page. Recorded in
TheTapestry's `tasks/decisions.md` (commit ee077918).

A 2026-09-14 exception for a 58px bottom seats bar was approved and then
WITHDRAWN on 2026-09-15 when the seats moved to the title bar. Do not reinstate
it from older notes.

## 5. Open, not yet decided

- **Where the dice / roll controls live.** They are neither purely game-owned
  nor purely player-owned. Mothership currently has them above the sheet in the
  centre. Ask Xero when the first VTT actually has to place them, rather than
  guessing twice.
