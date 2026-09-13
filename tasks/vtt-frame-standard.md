# The VTT frame - the standard for every Xero Sum Games VTT

**Status: DECIDED by Xero 2026-09-12. Applies to every VTT from here on, not
just the two that exist.** A new VTT starts from this layout; it is not a
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
+--------------------------------------------------------------+
| title bar        identity, context, status        46px        |
+----------------+---------------------------------------------+
| Home  (280px)  | Section  | Section  | Section  |   34px      |   <- section strip
+----------------+----------+----------+----------+-------------+
| left rail      | centre                    | right rail       |
|  280px         |  flexible                 |  260px           |
+----------------+---------------------------+------------------+
```

- **The first section tab is the width of the LEFT RAIL** and takes the panel
  background, so the strip lines up with the columns beneath it rather than
  floating free of them. That is how TheTableau's TERMINAL tab reads.
- **The remaining tabs share what is left**, equal width.
- **The grid sizes itself against the chrome**, so the three panes fill exactly
  what remains and the document never scrolls.

**Compose the chrome height from named parts, do not hardcode a total.**
TheTableau writes its bar's height in one file and `calc(100vh - 130px)` in
another; those two can drift apart silently. Mothership uses
`--titlebar-h` + `--navstrip-h` composed into `--chrome-h`, and the grid reads
only the composed value.

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
.frame {
  display: grid;
  grid-template-columns: 280px minmax(340px, 1fr) 260px;
  gap: 1px;                      /* the gap IS the divider */
  background: var(--divider);    /* shows through the gap */
  height: calc(100vh - <chrome>);
  overflow: hidden;              /* the document never scrolls */
}
.col { overflow-y: auto; }       /* each pane scrolls independently */
```

- **Left 280px, right 260px, centre takes the slack.** Fixed rails, flexible
  middle.
- `280 + 340 + 260 + two 1px gaps = 882`, so all three panes fit a 1024px window
  with no horizontal scroll. Do not let the centre's minimum push past that.
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
