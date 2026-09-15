# Brief for TheTableau: bring the frame to the VTT standard (2026-09-14)

**From:** Table | Puffer Fish (hub). **Decided by:** Xero, 2026-09-14.
**Standard:** `D:\Coding\VTTs\TheTable\tasks\vtt-frame-standard.md`, section 1b
(the measurements table). **Reference implementation:** Mothership VTT,
`D:\Coding\VTTs\mothership-vtt\app\globals.css` (search "THE HOUSE FRAME") and
`components\Frame.tsx`, commit after 3f0d3bb on main.

Xero measured TheTableau's live frame against Mothership's and chose each value.
Four of them change TheTableau. Everything else already matches: rails 280px and
260px, 1px dividers, the 45px title bar, and first and last section tabs over
the rails.

## What TheTableau measures today (live, signed out, /dashboard)

| Part | At 1920x1080 | At 1280x800 |
| --- | --- | --- |
| Title bar `.ttb-header` | 45px | 53px (content wraps) |
| Section strip `.ttb-nav` | 41px (40 + 1px border) | 63px (names wrap) |
| Section tabs | Terminal 280, six of 230, Tools 260 | 280, six of 123.33, 260 |
| Frame `.t-layout` | `calc(100vh - 130px)` = 950px, **44px empty below** | 670px, 14px empty below |
| Columns `.t-col` | 280 / 1378 / 260, **padding 14px on all three** | same |
| Rail tab strip `.t-sbtabs` | **40px** (tabs 39px) | 40px |

## The four changes

1. **Section strip: 34px, growing when a name wraps.** It is 41px today. Keep
   the growth, and bring the single-line height to 34px including its bottom
   line.
2. **Rail tab strips: 28px.** `.t-sbtabs` / `.t-sbtab` are 40px today.
3. **No padding on the centre column.** The centre `.t-col` keeps 14px today.
   The centre column gets padding 0, and each centre VIEW adds its own 14px, so
   a full-bleed view such as a map can run edge to edge. Check every view that
   renders in the centre after this change, because each one now needs its own
   padding.
4. **The frame fills exactly what the bars leave.** Replace
   `calc(100vh - 130px)`. Mothership's pattern:
   - The page root is `height: 100vh; overflow: hidden; display: flex;
     flex-direction: column`.
   - The title bar and strip are `flex: none`.
   - The frame is `flex: 1; min-height: 0`.
   - Below 820px the root takes `height: auto; overflow: visible` and the frame
     `flex: none`, so stacked columns scroll instead of clipping.

## How to check it is done

- At 1920x1080: title bar 45, strip 34, frame 1001 tall, `innerHeight` minus the
  frame's bottom is 0, rail tab strips 28, centre column padding 0.
- At a width where a tab name wraps: the strip grows, and the frame still ends
  exactly at the bottom of the screen.
- Below 820px the page scrolls, and the last column can be reached.

Mothership's `scripts\test-frame.ts` asserts the same numbers from the CSS and
is a working model for a TheTableau equivalent.
