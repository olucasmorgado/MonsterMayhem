# Monster Mayhem

## Project Overview
A student project using the browser-based 10x10 hex grid game **Monster Mayhem**, which has the following features:
- **Hover** and **click** interactions for choosing and highlighting hexes.
- **Ctrl+click** to move a monster sprite while previewing its dashed path.
- **Sprite-based character** rather than a simple circle.
- **Background music** (beginning with the initial click) and **move sound effect**.
- **HUD** displaying a score that rises by 10 with every move.

## Running the Game
1. Download the repository or clone it.
2. Be certain that these files are located in the same folder:
index.html
style.css
script.js
monster.png
background.mp3
move.wav
3. Launch `index.html` in your current web browser.
4. **Click** Background music can be started anywhere on the canvas.
**Hover** to view the blue gradient highlight,
**click** to toggle the red selection,
**Ctrl+click** to gain points by moving the monster.

## Troubleshooting & AI Usage
**Grid gaps**: Has little spaces between rows at first; they were corrected by using `y = r * (3/4 * h)`.
**Hover imprecision**: When the bounding-box test failed at the edges, it was changed to `Path2D` + `isPointInPath`.
 **Audio autoplay**: Autoplay was restricted by browsers, so `bgMusic.play()` was placed inside the canvas click handler.
 **Sprite substitution**: The simple circle appeared too simplistic; `ctx.drawImage` was used and `monster.png` was loaded.
 **Comments & commits**: All AI prompts and manual fixes were documented.

 ## References (Harvard)
 - Mozilla Developer Network (MDN) (2025) *CanvasRenderingContext2D* [online]. Available at: https://developer.mozilla.org/... (Accessed: 22 May 2025).
- Stack Overflow (2020) ‘Detect if mouse is inside Path2D?’, *Stack Overflow*, 12 March. Available at: https://stackoverflow.com/... (Accessed: 22 May 2025).
- FreeSound.org (2024) ‘Background music loop’, *FreeSound*, uploaded by AudioLibrary. Available at: https://freesound.org/... (Accessed: 22 May 2025).
**Bevouliin (n.d.) ‘Free Flappy Monster Sprite Sheets’, OpenGameArt.org, [online]. Available at: https://opengameart.org/content/bevouliin-free-flappy-monster-sprite-sheets (Accessed: 22 May 2025).
- SuchTheFool88 (n.d.) ‘Movement Sound Effect’, *FreeSound*, [online]. Available at: https://freesound.org/people/suchthefool88/sounds/344252/ (Accessed: 22 May 2025).
- DExUS5 (n.d.) ‘Environmental Ambience Effect’, *FreeSound*, [online]. Available at: https://freesound.org/people/DExUS5/sounds/361686/ (Accessed: 22 May 2025).