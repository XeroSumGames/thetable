# The VTT frame - the standard for every Xero Sum Games VTT

**Status: DECIDED by Xero 2026-09-12; measurements settled 2026-09-14 (section
1b). Applies to every VTT from here on, not just the two that exist.** A new VTT starts from this layout; it is not a
per-project choice to make again.

Reference implementations: **TheTableau** (the original) and **Mothership VTT**.
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
.col { overflow-y: auto; padding: 14px; }  /* the centre column: padding 0 */
.railtab { height: 28px; }
```

- **Left 280px, right 260px, centre takes the slack.** Fixed rails, flexible
  middle. **No minimum on the centre** (an earlier draft had `minmax(340px, 1fr)`;
  TheTableau has none, and it was removed from Mothership as a deviation).
- **The 1px gap over a divider-coloured background draws the pane lines.** No
  borders. This also keeps the rails from carrying layout-affecting borders,
  which matters on any app with more than one visual mode.
- **The frame is pinned and the panes scroll, not the page.** An app, not a
  document.

## 3. Behaviour

- **Stacks to one column at `max-width: 820px`.** One breakpoint, no drawers,
  nothing hidden - the columns simply stack. Both existing apps also show a
  "best on desktop" banner on real phones rather than adapting further.
- **A tab strip at the top of a rail is how you multiplex a fixed-width
  column.** Both properties do this. Reach for it before widening a rail.
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

## 5. Open, not yet decided

- **Where the dice / roll controls live.** They are neither purely game-owned
  nor purely player-owned. Mothership currently has them above the sheet in the
  centre. Ask Xero when the first VTT actually has to place them, rather than
  guessing twice.
