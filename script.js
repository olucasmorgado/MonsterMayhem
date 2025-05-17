// Monster Mayhem – initial script
// Draw a 10×10 hexagonal grid on the canvas with hover and click selection

const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');

const rows    = 10;
const cols    = 10;
const hexSize = 35; // radius of each hex

let hoverCell    = null;    // { r, c } when mouse over, else null
let selectedCell = null;    // { r, c } when clicked, else null

// Convert grid coordinates (r,c) to pixel center (x,y)
function hexCenter(r, c) {
  const w = Math.sqrt(3) * hexSize;
  const h = 2 * hexSize;
  const x = c * w + (r % 2) * (w / 2) + hexSize;
  const y = r * (3 / 4 * h) + hexSize;
  return { x, y };
}

// Draw a regular hexagon centered at (x,y)
function drawHex(x, y, size, fillStyle = null, strokeStyle = '#000') {
  const angleStep = Math.PI / 3;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const xi = x + size * Math.cos(angleStep * i);
    const yi = y + size * Math.sin(angleStep * i);
    if (i === 0) ctx.moveTo(xi, yi);
    else         ctx.lineTo(xi, yi);
  }
  ctx.closePath();
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();
}

// Check if point (px,py) is inside hex centered at (x,y)
function isPointInHex(px, py, x, y, size) {
  // Bounding box quick check
  if (px < x - size || px > x + size || py < y - size || py > y + size) {
    return false;
  }
  // Precise check via Path2D
  const path = new Path2D();
  const angleStep = Math.PI / 3;
  path.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));
  for (let i = 1; i < 6; i++) {
    path.lineTo(
      x + size * Math.cos(angleStep * i),
      y + size * Math.sin(angleStep * i)
    );
  }
  path.closePath();
  return ctx.isPointInPath(path, px, py);
}

// Convert mouse pixel to cell indices { r, c } or null
function pixelToCell(px, py) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const { x, y } = hexCenter(r, c);
      if (isPointInHex(px, py, x, y, hexSize)) {
        return { r, c };
      }
    }
  }
  return null;
}

// Render the entire grid, applying hover and selection styles
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const { x, y } = hexCenter(r, c);

      let fill   = null;
      let stroke = '#666';

      // Selected cell style
      if (selectedCell?.r === r && selectedCell?.c === c) {
        stroke = '#f00';
        fill   = 'rgba(255,0,0,0.2)';
      }
      // Hover cell style (only if not selected)
      else if (hoverCell?.r === r && hoverCell?.c === c) {
        stroke = '#00f';
        fill   = 'rgba(0,0,255,0.2)';
      }

      drawHex(x, y, hexSize, fill, stroke);
    }
  }
}

// Mouse move: update hoverCell and re-render
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  const px   = e.clientX - rect.left;
  const py   = e.clientY - rect.top;
  hoverCell  = pixelToCell(px, py);
  render();
});

// Mouse out: clear hover and re-render
canvas.addEventListener('mouseout', () => {
  hoverCell = null;
  render();
});

// Click: select or deselect cell
canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const px   = e.clientX - rect.left;
  const py   = e.clientY - rect.top;
  const cell = pixelToCell(px, py);

  if (cell) {
    // Deselect if clicking the already selected cell
    if (selectedCell && selectedCell.r === cell.r && selectedCell.c === cell.c) {
      selectedCell = null;
    } else {
      selectedCell = cell;
    }
    render();
  }
});

// Initial draw
render();