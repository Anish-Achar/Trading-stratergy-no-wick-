# Ghost Ball: motion-graphics reel

An 80-second showreel piece for **Ghost Ball**, the pool and snooker shot assistant (project 05 on the website).
It shows what the app does, step by step, as kinetic type, camera moves and diagrams cut to the music.

| File | What it is |
|---|---|
| `GhostBall_reel_1080p60.mp4` | The reel: 1920×1080, 60 fps, captions burned in. H.264 + AAC 192 kbps, mastered to −14 LUFS |
| `GhostBall_reel.srt` | The voiceover as a caption file, for players or platforms that take separate captions |
| `GhostBall_reel_thumbnail.jpg` | Cover frame (1920×1080) |

## What happens when

| Time | Section | On screen |
|---|---|---|
| 0:00 | The problem | A rack drops ball by ball, the white breaks it, every possible line flickers on, then all but one collapse |
| 0:10 | Drop 1 | The camera dives into the ghost ball and the logo slams in |
| 0:14 | One photo | Through the logo's ring into a viewfinder that levels over the table; the shutter fires and the photo lands in the app |
| 0:18 | Computer vision | Edge scan, the four cushion lines lock, the perspective flattens, a distance map ripples out and the 8 balls are found and classified |
| 0:26 | The maths | The table turns into a blueprint: the ghost ball, the 56° cut, the 5.2° pocket window, then the window becomes a bell curve |
| 0:43 | Pot chance | The curve tightens with skill: 59% beginner, 88% club, 99% strong |
| 0:54 | Drop 2 | Straight, bank, kick and combination shots whip past on the beat, with light trails along each real path |
| 1:00 | Ranked | All 23 pots, best first, scrolling in the app |
| 1:05 | Spin | Where to strike the white (stun, top, screw) and where it goes after contact |
| 1:12 | End card | Final hit on the logo, the app in 3D, "Know your shot before you take it." |

## How it was made

- Every frame is drawn in code (Python + Skia) at 60 fps, with motion blur, chromatic split on impacts and film grain.
- App screens are real captures of the app. Nothing is redrawn or AI-generated.
- Every number is the app's own: ball positions, corners, the cut angle, the window, the pot chances and the 23-shot list all come from its solver run on its sample table.
- The voiceover is one take, cut line by line. Scenes start on the beat of a 120 BPM grid, and the two drops land on bar lines.
- Music and sound effects are synthesised from scratch (no samples): an A-minor track with two drops and a half-time maths section, ducked under the voice, plus about 250 effects tied to on-screen events.
