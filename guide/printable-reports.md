---
title: Printable reports
order: 135
summary: Download PDF for a report. Letter sheets at real size, built from data with row budgets, previewed, then printed through the browser. Covers the sheet classes, the print mechanics, browser limits and the overflow policy.
---

A report's **Download PDF** is the browser's print, not a PDF library. The page
lays the report out as US Letter sheets in HTML, shows them in a preview at
their real size, and calls `window.print()`. The person saves the PDF from the
print dialog (DS-147). Every Saga report uses this one approach, so a sheet,
its table and its preview look the same everywhere, and a plain HTML prototype
uses the same classes as a Svelte product.

Do not draw report PDFs with jsPDF, pdfmake or html2canvas. Drawing in script
lays the report out a second time, loses the tokens and the components, needs
an embedded font before many student names will print, and rasterizes charts.

## The method

1. **Build the pages in data.** A pure function turns the report's rows into a
   list of pages, using fixed **row budgets**: how many table rows fit on a
   sheet beside its header and its other blocks. The browser cannot tell you
   where a page broke, so the pages are decided before anything renders. The
   preview's page count is the document's page count.
2. **Render each page as a `.saga-sheet`.** The sheet is its real paper size
   on screen, so what the preview shows is what prints.
3. **Preview, then print.** The preview lists the sheets in a scrolling
   column. Download PDF turns on the print root and calls `window.print()`.

Row budgets depend on the type scale and on one line per row, which is why
sheet text uses the fixed print scale and the report table never wraps.

## Overflow: cap the rows and say so

Never shrink text to fit a page, and never let a sheet silently clip (DS-150).

- When a report has more rows than its pages should hold, show the most
  relevant ones and say so on the sheet: "Showing the most recent 28 of 61
  sessions; every session is in the CSV download." Use
  `.saga-sheet__continued`.
- A table that runs over several sheets says where it is: "Students who need
  attention, continued, 33–64 of 120".
- If a page's content still runs past its sheet, the preview says so. Measure
  the body (`scrollHeight > clientHeight`) and set `data-overflows` on the
  sheet. The attribute's value is the badge text. The badge and its red
  outline appear only on screen.

## Sheet anatomy

| Part | Class | Notes |
|---|---|---|
| Sheet | `.saga-sheet`, `.saga-sheet--landscape` | 8.5 × 11in, or 11 × 8.5in; padding `--sheet-pad-y` `--sheet-pad-x`; paper palette; `--print-text-sm` body |
| Header | `.saga-sheet__header` | `.saga-sheet__heading` holds `.saga-sheet__title` and up to two `.saga-sheet__meta` lines (each clipped to one line); `.saga-sheet__brand` on the right |
| Body | `.saga-sheet__body` | Takes the remaining height and clips. Blocks inside are spaced by `--print-gap` |
| Section title | `.saga-sheet__section-title` | `--print-text-md`, bold |
| Stats | `.saga-sheet__stats` > `.saga-sheet__stat` | `__stat-value`, `__stat-label`, `__stat-caption`; a hairline box, no shadow |
| Notes | `.saga-sheet__note`, `.saga-sheet__continued` | Muted `--print-text-xs`; `continued` is italic |
| Footer (optional) | `.saga-sheet__footer` | `.saga-sheet__notice` (the product's wording) and `.saga-sheet__page` ("Page 2 of 7") |

```html
<section class="saga-sheet">
  <header class="saga-sheet__header">
    <div class="saga-sheet__heading">
      <h2 class="saga-sheet__title">Student Sentiment Report</h2>
      <p class="saga-sheet__meta">Lincoln Middle · Oct 1 – Oct 31, 2026</p>
    </div>
    <span class="saga-sheet__brand">Saga Education</span>
  </header>
  <div class="saga-sheet__body">
    <ul class="saga-sheet__stats">
      <li class="saga-sheet__stat"><span class="saga-sheet__stat-value">82%</span><span class="saga-sheet__stat-label">Completion</span></li>
    </ul>
    <h3 class="saga-sheet__section-title">Needs attention</h3>
    <table class="saga-report-table">…</table>
    <p class="saga-sheet__continued">Showing 32 of 45 students; every student is in the CSV download.</p>
  </div>
  <footer class="saga-sheet__footer">
    <span class="saga-sheet__notice">…the product's notice…</span>
    <span class="saga-sheet__page">Page 1 of 3</span>
  </footer>
</section>
```

## The report table

`.saga-report-table` is the dense table for paper (DS-151): `--print-text-sm`,
`--print-cell-y` `--print-cell-x` padding, a hairline under each row, muted
semibold headers, and **one line per cell**, so a long value ends in an
ellipsis instead of wrapping. It uses `table-layout: fixed`: set column widths
on the first row's cells. `.num` right-aligns numbers in tabular figures. The
header repeats if a browser ever splits the table across sheets, but row
budgets should mean it never does.

- `.saga-report-table--grid` boxes every cell and centres it (a day-by-day
  grid). The first column stays left-aligned for names.
- `.saga-report-table--small` drops to `--print-text-2xs` for a grid of
  marks.

## Paper colour and type

The `--paper-*` palette is paper, not the screen theme (DS-148). It reads Tier
1 primitives only, so a theme or high-contrast remap never reaches a printed
page. A report's own domain colours, such as attendance marks or survey faces,
are Tier 3 aliases in the product, defined on its sheet.

- **Colour must survive greyscale.** A status colour on paper always carries a
  label, a code or a pattern as well. Many schools print in black and white.
- Sheets set `print-color-adjust: exact`, so fills print without the reader
  ticking "Background graphics".
- The print type scale (`--print-text-2xs` to `--print-text-xl`) is in px, not
  rem. The screen root grows with the window and the reader's text-size
  setting, and paper must not.

## Print mechanics

These are what worked in saga-dash's attendance report PDF and in testing
across browsers (DS-149).

- **The print root is a direct child of `<body>`.** Portal the preview to
  `<body>` and give it `.saga-print-root`. While printing, `body.saga-printing`
  hides every other child of `<body>`, so only the sheets print.
- **Turn the print class on around `window.print()`** and off again on
  `afterprint`.
- **Named pages, always on.** `.saga-sheet` uses
  `page: saga-letter-portrait`; `.saga-sheet--landscape` uses
  `saga-letter-landscape`. Only those two named `@page` rules set a size and
  zero margins. There is no unnamed `@page` rule, so the page's ordinary print
  (a table's own Print button) keeps the browser's margins. Nothing is added or
  removed at runtime.
- **Never size anything in `vh`.** Print `vh` is measured from the first sheet,
  so a landscape sheet at `100vh` would take the portrait height.
- **Move focus after a tick.** Moving a focused node blurs it, so focus the
  preview's close button only after the portal has moved the preview.
- **The file name is the document title.** Set `document.title` to the file
  name (`student-sentiment-report_2026-10-01_to_2026-10-31`) before
  `window.print()` and restore it on `afterprint`. Browsers offer it as the
  name when saving as PDF.
- **Escape or a click on the scrim closes the preview.** A product that asks
  "Download student data?" asks before printing, not after.

A plain HTML page needs about thirty lines. The showcase's
[Printable reports](/showcase/print/) page runs this code.

```html
<div class="saga-print-preview saga-print-root" hidden>
  <div class="saga-print-preview__dialog" role="dialog" aria-modal="true" aria-labelledby="pp-title">
    <div class="saga-print-preview__bar">
      <h2 class="saga-print-preview__title" id="pp-title">Download PDF</h2>
      <div class="saga-print-preview__actions">
        <button class="saga-btn" id="pp-print">Download PDF</button>
        <button class="saga-btn saga-btn--quiet saga-btn--icon" id="pp-close" aria-label="Close">✕</button>
      </div>
    </div>
    <div class="saga-print-preview__pages"><!-- .saga-sheet × n --></div>
  </div>
</div>
<script>
  const pp = document.querySelector('.saga-print-preview');
  document.body.append(pp); // the print root must be a direct child of <body>
  let savedTitle = document.title;
  function openPreview() { pp.hidden = false; setTimeout(() => pp.querySelector('#pp-close').focus()); }
  function closePreview() { pp.hidden = true; }
  function endPrint() { document.body.classList.remove('saga-printing'); document.title = savedTitle; }
  pp.querySelector('#pp-print').onclick = () => {
    savedTitle = document.title;
    document.title = 'student-sentiment-report_2026-10-01_to_2026-10-31'; // the PDF's file name
    document.body.classList.add('saga-printing');
    addEventListener('afterprint', endPrint, { once: true });
    print();
  };
  pp.querySelector('#pp-close').onclick = closePreview;
  pp.onclick = (e) => { if (e.target === pp) closePreview(); };
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !pp.hidden) closePreview(); });
</script>
```

In a Svelte product, use `PrintPreview` and `PrintSheet` from
`@saga-ed/ui-svelte` and its `paginate` helper instead. They render these
classes and do the mechanics above.

## Orientation and browsers

Use portrait unless the content needs the width, such as a day-by-day grid or
a table with one column per week (DS-153).

| Browser | What happens |
|---|---|
| Chrome, Edge (about 97% of dash users, most on Chromebooks) | Each sheet prints at its own size and orientation, margins zero, colours kept |
| Safari, and every browser on iPhone and iPad (WebKit) | Margins and colours work, but `@page` `size` is ignored: everything prints portrait unless the person picks Landscape, and a mix of portrait and landscape sheets is shrunk to fit the widest. `CSS.supports('page', …)` still answers true, so detect the engine, not the feature |
| Firefox | Not yet tested |

When a report has landscape sheets, the preview shows one line in WebKit
browsers, in `.saga-print-preview__note`:

- Mixed orientations: "Landscape pages print correctly in Chrome or Edge."
- Landscape only: "Choose Landscape in the print dialog."

## The confidentiality notice

The guide owns where a notice sits, not what it says (DS-152). If a report
carries a notice, it goes in `.saga-sheet__notice` on every sheet's footer, in
`--print-text-xs` muted type. The wording belongs to the product and its legal
or data-privacy review, and this public guide never holds it. The footer is
optional: saga-dash's attendance report has none, because the product asks
"Download student data?" before printing instead.

## What stays in the product

The report's content and blocks, its row budgets, its domain colours, the
notice wording and the file name. The guide and the libraries supply the
sheet, the table, the preview and the mechanics.
