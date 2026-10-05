GHOST BALL, ADDED TO YOUR WEBSITE AS PROJECT 05
===============================================

These files add Ghost Ball to your existing website, inside the Projects section next to the V8, NO Candle,
TikTok and Bikes projects. It is not a separate page.

WHAT'S IN THIS FOLDER
  index.html                         your home page, with Ghost Ball added (replaces your current index.html)
  site.webmanifest                   description updated (replaces yours)
  ghost-ball/index.html              the app itself (the "Open the app" button goes here)
  assets/css/ghostball.css           Ghost Ball styles      } these three go INTO your existing assets folder,
  assets/js/ghostball.js             Ghost Ball demo        } next to site.css and main.js. Nothing of yours
  assets/img/ghostball/, assets/media/ghostball/   images and video     } is replaced.

HOW TO ADD IT (on a computer)
  1. Open your website folder: the one with index.html and the assets folder (site.css, main.js, your images, CV).
  2. Copy everything from this folder into it. Say "Replace" for index.html and site.webmanifest, and
     "Merge" (not replace) for the assets folder, so your own files stay.
  3. Keep 404.html, robots.txt and the rest of your files as they are.

HOW TO OPEN THE WEBSITE
  - If your site is online (GitHub Pages, Netlify, Vercel...): upload or push the updated folder the way you
    normally do, wait a minute, then open your site's link, go to Projects and tap "Ghost Ball" (05).
  - To look at it on your computer first: double-clicking index.html won't run the site's scripts (main.js is a
    JavaScript module, which browsers block from plain files). Use a tiny local server instead:
      VS Code: install the "Live Server" extension, right-click index.html, choose "Open with Live Server".
      Or in a terminal, inside the website folder:  python3 -m http.server
      then open http://localhost:8000 in your browser.

WHY THE PREVIEW LOOKED MESSY
  The preview was built without your assets folder (site.css, main.js, images), because only index.html,
  404.html, robots.txt and site.webmanifest were shared. Your own copy of the site has those files, so once
  these files are added to it, everything (Ghost Ball included) uses your real styles.
