GHOST BALL: new project 05 for the site
=======================================

Copy everything in this folder into the site's root folder (next to index.html). Every new file is in a new
folder, so nothing of yours is overwritten except the two files marked "changed" below.

CHANGED
  index.html          - Ghost Ball added as project 05: a tile and index entry on the Projects page, a shortcut in
                        "Jump into a project", the project panel itself, and links to ghostball.css / ghostball.js.
                        The meta and Open Graph descriptions now mention it. Nothing else in the file was touched.
  site.webmanifest    - description mentions Ghost Ball.

NEW
  ghost-ball/index.html                    the app itself, so "Open the app" works at /ghost-ball/
  assets/css/ghostball.css                 styles for the panel (all scoped to gb- classes)
  assets/js/ghostball.js                   the drag-the-balls demo, and the overlay wiring
  assets/img/ghostball/                    figures from the app's own working, shot captures, formula images
  assets/media/ghostball/                  the explainer video (1080p, 14 MB) and its captions (.vtt)

UNCHANGED: 404.html, robots.txt, and everything else in assets/.

HOW IT HOOKS INTO main.js
  main.js and site.css weren't in the upload, so ghostball.js doesn't depend on them. When #projects/ghostball
  is opened:
    - if main.js already opens any panel with a matching data-project, ghostball.js just sets the title bar;
    - if main.js only knows the original four projects, ghostball.js opens the overlay through the TikTok project
      and swaps in the Ghost Ball panel, so main.js's own open/close/minimise behaviour still applies.
  If main.js keeps a list of projects, the cleanest fix is to add "ghostball" to it (number 05, title Ghost Ball).
  The fallback then never runs.

  The panel reuses the site's own classes (wrap, proj-head, proj-title, tags, proj-lede, kpis, kpi, panel,
  panel-pad, btn, btn-primary, btn-sm, code-cap, code, caveats), so it should pick up the site's look. Its own
  pieces (pipeline cards, maths cards, demo, diagrams) are styled in ghostball.css.
