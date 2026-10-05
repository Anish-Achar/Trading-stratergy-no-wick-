# Ghost Ball: website update (project 05)

Everything for adding Ghost Ball to the website. Tap any link below to open that file.
To install, copy this folder's contents into the site's root folder, next to `index.html`.

## How to add it and open the site
Ghost Ball goes **inside your existing website**, as project 05 in Projects. It isn't a separate page.

1. On a computer, open your website folder (the one with `index.html` and your `assets` folder).
2. Copy this folder's contents into it: **replace** `index.html` and `site.webmanifest`, and **merge** the `assets` folder so your own files stay.
3. **If the site is online**, upload or push it the way you normally do, then open your site → Projects → Ghost Ball (05).
4. **To check it on your computer first**, use a local server, because double-clicking `index.html` won't run `main.js`. Use VS Code's *Live Server* extension, or run `python3 -m http.server` in the folder and open http://localhost:8000.

Your site's own `assets/css/site.css`, `assets/js/main.js` and images aren't in this folder, because they were never shared. That's why `index.html` looks unstyled if you open it on its own here.

## Changed files (replace yours)
- [index.html](index.html): the home page with Ghost Ball added: a tile, a list entry, the About-page shortcut and the full project panel
- [site.webmanifest](site.webmanifest): the description now mentions Ghost Ball

## New files
- [ghost-ball/index.html](ghost-ball/index.html): the app itself, served at `/ghost-ball/`
- [assets/css/ghostball.css](assets/css/ghostball.css): styles for the Ghost Ball panel
- [assets/js/ghostball.js](assets/js/ghostball.js): the drag-the-balls demo and the overlay wiring
- [assets/media/ghostball/ghostball-explainer.mp4](assets/media/ghostball/ghostball-explainer.mp4): the explainer video (14 MB)
- [assets/media/ghostball/ghostball-explainer.en.vtt](assets/media/ghostball/ghostball-explainer.en.vtt): its captions
- [GHOST_BALL_README.txt](GHOST_BALL_README.txt): install notes and how it connects to `main.js`

Unchanged: `404.html`, `robots.txt` and the rest of `assets/`.

## Images used on the page

### From photo to shot (the app's own working on its sample table)
| | |
|---|---|
| ![Table found](assets/img/ghostball/gb-1-photo.jpg) 1. Find the table | ![Flattened](assets/img/ghostball/gb-2-flat.jpg) 2. Flatten it |
| ![Distance transform](assets/img/ghostball/gb-3-distance.jpg) 3. Find the balls | ![Balls named](assets/img/ghostball/gb-4-balls.jpg) 4. Name them |
| ![Best shot](assets/img/ghostball/gb-5-shot.jpg) 5. Solve every shot | ![Video poster](assets/img/ghostball/gb-video-poster.jpg) Video poster |

### Shot types
| | |
|---|---|
| ![Straight](assets/img/ghostball/gb-type-direct.jpg) Straight, 88% | ![Bank](assets/img/ghostball/gb-type-bank.jpg) Bank, 43% |
| ![Kick](assets/img/ghostball/gb-type-kick.jpg) Kick, 71% | ![Combination](assets/img/ghostball/gb-type-combo.jpg) Combination, 93% |

### Using it
| | |
|---|---|
| ![Phone](assets/img/ghostball/gb-phone.jpg) | ![Close-up](assets/img/ghostball/gb-closeup.jpg) ![Spin guide](assets/img/ghostball/gb-spin-top.jpg) |

### The maths (formula images)
| | |
|---|---|
| Flattening the photo | ![](assets/img/ghostball/math-homography.svg) |
| The ghost ball | ![](assets/img/ghostball/math-ghost.svg) |
| The pocket window | ![](assets/img/ghostball/math-window.svg) |
| Error spread | ![](assets/img/ghostball/math-sigma.svg) |
| Pot chance | ![](assets/img/ghostball/math-chance.svg) |
| Banks: mirror the pocket | ![](assets/img/ghostball/math-mirror.svg) |
| Combinations | ![](assets/img/ghostball/math-combo.svg) |
| Where the white goes | ![](assets/img/ghostball/math-white.svg) |

The diagrams beside each formula are drawn inline in `index.html`, so they only show on the live page.
