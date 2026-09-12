# Lessons - TheTable

Hard-won gotchas so the next lane does not relearn them. Newest first.

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
