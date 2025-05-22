// Monster Mayhem – student script
// - 10×10 hex grid with gradient hover & click selection
// - Sprite-based character rather than just a circle
// - To prevent the autoplay block, the move sound effect and background music begin on the initial click.
// - Score on the HUD + stop the default Ctrl+click behavior.

// DOM references
const canvas    = document.getElementById('gameCanvas');
const ctx       = canvas.getContext('2d');
const hud       = document.getElementById('hud');
const moveSound = document.getElementById('moveSound');
const bgMusic   = document.getElementById('bgMusic');

// Reduce the volume of the background music.
bgMusic.volume = 0.2;

// Set monster image.
const monsterImg = new Image();
monsterImg.src = 'monster.png';
// Make sure to render only after sprite loads in order to troubleshoot.
monsterImg.onload = () => render();

// Grid configuration.
const rows    = 10;
const cols    = 10;
const hexSize = 35;

// State of the game.
let hoverCell    = null;
let selectedCell = null;
let characterPos = { r: 0, c: 0 };
let score        = 0;

// // Stop the browser from defaulting when you press Ctrl+click.
canvas.addEventListener('mousedown', e => {
  if (e.ctrlKey) e.preventDefault();
});

// Convert grid coordinates (r, c) to pixel center (x, y).
function hexCenter(r, c) {
  const w = Math.sqrt(3) * hexSize;
  const h = 2 * hexSize;
  return {
    x: c * w + (r % 2) * (w / 2) + hexSize,
    y: r * (3/4 * h) + hexSize
  };
}

// Create a standard hexagon at (x, y).
function drawHex(x, y, size, fillStyle, strokeStyle) {
  const step = Math.PI / 3;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const xi = x + size * Math.cos(step * i);
    const yi = y + size * Math.sin(step * i);
    i === 0 ? ctx.moveTo(xi, yi) : ctx.lineTo(xi, yi);
  }
  ctx.closePath();
  if (fillStyle) ctx.fillStyle = fillStyle, ctx.fill();
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();
}

// // Accurately check if the point is inside the hex (repairs edge glitches).
function isPointInHex(px, py, x, y, size) {
    // Fast bounding box check
  if (px < x - size || px > x + size || py < y - size || py > y + size) return false;
  //  Use PathD2 for correct polygons.
  const p = new Path2D();
  const step = Math.PI / 3;
  p.moveTo(x + size, y);
  for (let i = 1; i < 6; i++) {
    p.lineTo(
      x + size * Math.cos(step * i),
      y + size * Math.sin(step * i)
    );
  }
  p.closePath();
  return ctx.isPointInPath(p, px, py);
}

// Map the mouse's px/py to a null function or grid cell.
function pixelToCell(px, py) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const { x, y } = hexCenter(r, c);
      if (isPointInHex(px, py, x, y, hexSize)) return { r, c };
    }
  }
  return null;
}

// Main render: sprite, HUD, path preview, grid, and hover/selection.
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1) Create a grid with highlights.
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const { x, y } = hexCenter(r, c);
      let fill   = null;
      let stroke = '#666';

      // highlight selection (red).
      if (selectedCell?.r === r && selectedCell?.c === c) {
        stroke = '#f00';
        fill   = 'rgba(255,0,0,0.2)';
      }
      // hover highlight (gradient of blue).
      else if (hoverCell?.r === r && hoverCell?.c === c) {
        stroke = '#00f';
        const grad = ctx.createRadialGradient(x, y, 0, x, y, hexSize);
        grad.addColorStop(0, 'rgba(0,0,255,0.3)');
        grad.addColorStop(1, 'rgba(0,0,255,0)');
        fill = grad;
      }

      drawHex(x, y, hexSize, fill, stroke);
    }
  }

  // 2) Preview of the dashed path.
  if (hoverCell && !(hoverCell.r === characterPos.r && hoverCell.c === characterPos.c)) {
    const from = hexCenter(characterPos.r, characterPos.c);
    const to   = hexCenter(hoverCell.r,   hoverCell.c);
    ctx.save();
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x,   to.y);
    ctx.strokeStyle = 'orange';
    ctx.stroke();
    ctx.restore();
  }

  // 3) Create a monster sprite instead of a circle.
  const { x: cx, y: cy } = hexCenter(characterPos.r, characterPos.c);
  const size = hexSize * 0.8;
  ctx.drawImage(monsterImg, cx - size/2, cy - size/2, size, size);

  // 4) Modify the HUD.
  hud.textContent = 'Score: ' + score;
}

// Unified click handler: play sound, move or pick cells, update score, and start music.
canvas.addEventListener('click', e => {
  // Fixes the autoplay block by starting bgMusic on the first click.
  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
  }

  const rect = canvas.getBoundingClientRect();
  const cell = pixelToCell(e.clientX - rect.left, e.clientY - rect.top);
  if (!cell) return;

  if (e.ctrlKey) {
    // move character, sound, and score.
    characterPos = cell;
    moveSound.play();
    score += 10;
  } else {
    // toggle selection.
    selectedCell = (selectedCell?.r === cell.r && selectedCell?.c === cell.c)
      ? null
      : cell;
  }

  render();
});

// Handling hover.
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  hoverCell = pixelToCell(e.clientX - rect.left, e.clientY - rect.top);
  render();
});

// On exit, clear hover.
canvas.addEventListener('mouseout', () => {
  hoverCell = null;
  render();
});

// The first drawing.
render();
