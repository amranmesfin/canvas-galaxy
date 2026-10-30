// Play With the Canvas API: a spiral galaxy of repeated stars
// Canvas API element explored: ctx.arc() (drawing circles)

// 1. Get the canvas reference
const canvas = document.getElementById("myCanvas");

// 2. Get the 2D context
const ctx = canvas.getContext("2d");

// Make the canvas fill the window
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Settings
const STAR_COUNT = 1500;     // stars in the galaxy
const BG_STAR_COUNT = 300;   // far-away background stars
const ARMS = 4;              // spiral arms
const colors = ["#ffffff", "#ffe9c4", "#d4fbff", "#b8c6ff", "#ffc8f0"];

let stars = [];
let bgStars = [];
let rotation = 0;

// Random number helper
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// Build the galaxy: place stars along spiral arms
function createGalaxy() {
  stars = [];
  bgStars = [];
  const maxRadius = Math.min(canvas.width, canvas.height) * 0.45;

  for (let i = 0; i < STAR_COUNT; i++) {
    const arm = i % ARMS;
    const distance = Math.pow(Math.random(), 1.5) * maxRadius; // more stars near the center
    const armAngle = (arm / ARMS) * Math.PI * 2;
    const twist = distance * 0.015;                            // makes the spiral curve
    const scatter = random(-0.35, 0.35);                       // spreads stars out from the arm

    stars.push({
      distance: distance,
      angle: armAngle + twist + scatter,
      size: random(0.5, 2.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      twinkle: Math.random() * Math.PI * 2,
    });
  }

  for (let i = 0; i < BG_STAR_COUNT; i++) {
    bgStars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: random(0.3, 1.2),
      twinkle: Math.random() * Math.PI * 2,
    });
  }
}

// Draw one star using arc()
function drawStar(x, y, size, color, alpha) {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2); // x, y, radius, startAngle, endAngle
  ctx.fill();
}

// Glowing galaxy core using a radial gradient made of circles
function drawCore(cx, cy) {
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120);
  glow.addColorStop(0, "rgba(255, 240, 210, 0.9)");
  glow.addColorStop(0.3, "rgba(200, 150, 255, 0.35)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.globalAlpha = 1;
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, 120, 0, Math.PI * 2);
  ctx.fill();
}

// Animation loop
function draw() {
  // black background
  ctx.globalAlpha = 1;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  // background stars twinkle in place
  bgStars.forEach((s) => {
    s.twinkle += 0.03;
    drawStar(s.x, s.y, s.size, "#ffffff", 0.3 + Math.sin(s.twinkle) * 0.3);
  });

  drawCore(cx, cy);

  // galaxy stars rotate around the center (inner stars move faster)
  rotation += 0.002;
  stars.forEach((s) => {
    s.twinkle += 0.05;
    const speed = 1 - s.distance / (Math.min(canvas.width, canvas.height) * 0.5);
    const angle = s.angle + rotation * (0.5 + speed);
    const x = cx + Math.cos(angle) * s.distance;
    const y = cy + Math.sin(angle) * s.distance * 0.6; // squash for a tilted look
    const alpha = 0.6 + Math.sin(s.twinkle) * 0.4;
    drawStar(x, y, s.size, s.color, alpha);
  });

  requestAnimationFrame(draw);
}

// Click to generate a brand new galaxy
canvas.addEventListener("click", createGalaxy);
window.addEventListener("resize", createGalaxy);

createGalaxy();
draw();